import { once } from "node:events";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";
import puppeteer from "puppeteer-core";
import { createServer } from "vite";

const WIDTH = 1080;
const HEIGHT = 1920;
const FPS = 30;
const FRAME_INTERVAL_MS = 1000 / FPS;
const MODES = new Set(["relax", "focus", "sleep"]);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function option(name, fallback) {
  const inlineValue = process.argv.find((argument) => argument.startsWith(`--${name}=`));
  if (inlineValue) return inlineValue.slice(name.length + 3);

  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function help() {
  console.log(`Usage: npm run record:reel -- [options]

Options:
  --duration <seconds>  Reel length (default: 20)
  --mode <mode>         relax, focus, or sleep (default: relax)
  --output <file>       Output MP4 path (default: recordings/...)`);
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : undefined,
    process.platform === "win32"
      ? path.join(process.env.PROGRAMFILES ?? "C:\\Program Files", "Google/Chrome/Application/chrome.exe")
      : undefined,
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter(Boolean);

  return candidates.find((candidate) => existsSync(candidate));
}

async function availablePort() {
  const server = net.createServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Could not reserve a local port.");
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  return address.port;
}

function pngDimensions(png) {
  if (png.toString("ascii", 1, 4) !== "PNG") throw new Error("Chrome did not return a PNG frame.");
  return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

async function writeFrame(stream, frame) {
  if (!stream.write(frame)) await once(stream, "drain");
}

const duration = Number(option("duration", "20"));
const mode = option("mode", "relax");
const outputArgument = option("output", "");

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  help();
  process.exit(0);
}

if (!Number.isFinite(duration) || duration < 3 || duration > 300) {
  throw new Error("Duration must be between 3 and 300 seconds.");
}
if (!MODES.has(mode)) throw new Error("Mode must be relax, focus, or sleep.");
if (!ffmpegPath) throw new Error("FFmpeg is unavailable for this platform.");

const chromePath = findChrome();
if (!chromePath) {
  throw new Error("Google Chrome was not found. Set CHROME_PATH to the Chrome executable.");
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outputPath = path.resolve(
  projectRoot,
  outputArgument || `recordings/breathe-${mode}-${timestamp}.mp4`,
);
await mkdir(path.dirname(outputPath), { recursive: true });

let viteServer;
let browser;
let ffmpeg;
let ffmpegError = "";

try {
  const port = await availablePort();
  viteServer = await createServer({
    configFile: path.join(projectRoot, "vite.config.ts"),
    root: projectRoot,
    logLevel: "error",
    server: { host: "127.0.0.1", port, strictPort: true },
  });
  await viteServer.listen();

  browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--hide-scrollbars", "--force-color-profile=srgb"],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  await page.evaluateOnNewDocument((selectedMode) => {
    localStorage.setItem("breathMode", selectedMode);
  }, mode);
  await page.goto(`http://127.0.0.1:${port}/recording?capture=1`, {
    waitUntil: "networkidle2",
    timeout: 60_000,
  });
  await page.evaluate(() => document.fonts.ready);

  const frame = await page.waitForSelector("[data-recording-frame]", { timeout: 30_000 });
  await page.waitForFunction(() => {
    const canvas = document.querySelector("[data-recording-frame] canvas");
    return canvas instanceof HTMLCanvasElement && canvas.width > 0 && canvas.height > 0;
  }, { timeout: 30_000 });

  const cdp = await page.createCDPSession();
  let latestFrame;
  let latestSequence = 0;
  cdp.on("Page.screencastFrame", (event) => {
    latestFrame = Buffer.from(event.data, "base64");
    latestSequence += 1;
    void cdp.send("Page.screencastFrameAck", { sessionId: event.sessionId });
  });
  await cdp.send("Page.startScreencast", {
    format: "png",
    maxWidth: WIDTH,
    maxHeight: HEIGHT,
    everyNthFrame: 1,
  });
  while (!latestFrame) await new Promise((resolve) => setTimeout(resolve, 10));

  const dimensions = pngDimensions(latestFrame);
  if (dimensions.width !== WIDTH || dimensions.height !== HEIGHT) {
    throw new Error(`Expected ${WIDTH} × ${HEIGHT}, got ${dimensions.width} × ${dimensions.height}.`);
  }

  const frameCount = Math.ceil(duration * FPS);
  ffmpeg = spawn(ffmpegPath, [
    "-hide_banner",
    "-loglevel", "warning",
    "-y",
    "-f", "image2pipe",
    "-vcodec", "png",
    "-framerate", String(FPS),
    "-i", "pipe:0",
    "-an",
    "-c:v", "libx264",
    "-profile:v", "high",
    "-level:v", "4.2",
    "-preset", "slow",
    "-b:v", "9M",
    "-maxrate", "10M",
    "-bufsize", "18M",
    "-pix_fmt", "yuv420p",
    "-r", String(FPS),
    "-fps_mode", "cfr",
    "-g", String(FPS * 2),
    "-keyint_min", String(FPS * 2),
    "-sc_threshold", "0",
    "-color_primaries", "bt709",
    "-color_trc", "bt709",
    "-colorspace", "bt709",
    "-movflags", "+faststart",
    outputPath,
  ], { stdio: ["pipe", "ignore", "pipe"] });
  ffmpeg.stderr.setEncoding("utf8");
  ffmpeg.stderr.on("data", (chunk) => { ffmpegError += chunk; });
  const ffmpegExit = once(ffmpeg, "close");

  await page.evaluate(() => window.dispatchEvent(new Event("breathe:recording-start")));
  const startedAt = performance.now();
  let framesWritten = 0;
  let repeatedFrames = 0;
  let previousSequence = latestSequence;

  while (framesWritten < frameCount) {
    const frameDeadline = startedAt + framesWritten * FRAME_INTERVAL_MS;
    const wait = frameDeadline - performance.now();
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));

    if (latestSequence === previousSequence) repeatedFrames += 1;
    await writeFrame(ffmpeg.stdin, latestFrame);
    previousSequence = latestSequence;
    framesWritten += 1;

    if (framesWritten % FPS === 0 || framesWritten === frameCount) {
      console.log(`Captured ${Math.min(framesWritten / FPS, duration).toFixed(1)}s / ${duration}s`);
    }
  }

  await cdp.send("Page.stopScreencast");
  ffmpeg.stdin.end();
  const [exitCode] = await ffmpegExit;
  if (exitCode !== 0) throw new Error(`FFmpeg failed to encode the video.\n${ffmpegError}`);

  console.log(`Saved ${outputPath}`);
  console.log(`MP4: ${WIDTH} × ${HEIGHT}, ${FPS} fps, H.264 High, target 9 Mbps.`);
  if (repeatedFrames > 0) {
    console.log(`Chrome repeated ${repeatedFrames} frames to maintain the ${FPS} fps timeline.`);
  }
} finally {
  if (ffmpeg && !ffmpeg.killed) ffmpeg.kill("SIGTERM");
  if (browser) await browser.close();
  if (viteServer) await viteServer.close();
}
