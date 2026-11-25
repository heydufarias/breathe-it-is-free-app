import { Canvas } from "@react-three/fiber";
import { AnimatePresence } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { modeStyles } from "../lib/consts";
import { cn } from "../lib/utils";
import { advanceSession, setMode, startSession } from "../state/actions";
import { state } from "../state/state";
import { MotionInSpan } from "./motion/MotionInSpan";
import { Blob as BreathingBlob } from "./three/Blob";
import { ModeSelector } from "./ui/ModeSelector";

export function RecordingScreen() {
  const { t } = useTranslation();
  const captureSession = new URLSearchParams(window.location.search).has("capture");
  const currentMode = state.use((value) => value.currentMode);
  const sessionStage = state.use((value) => value.sessionStage);
  const currentPhase = state.use((value) => value.currentPhase);
  const phaseIndex = state.use((value) => value.phaseIndex);
  const secondsLeft = state.use((value) => value.secondsLeft);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "m") {
        setShowModeSelector((visible) => !visible);
      }

      if (event.key === "Escape") {
        setShowModeSelector(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useLayoutEffect(() => {
    if (sessionStage === "idle" && !captureSession) {
      startSession();
    }

    if (sessionStage === "done") {
      startSession(true);
    }
  }, [sessionStage, captureSession]);

  useEffect(() => {
    if (!captureSession) return;

    const startCaptureSession = () => startSession();
    window.addEventListener("breathe:recording-start", startCaptureSession);
    return () => window.removeEventListener("breathe:recording-start", startCaptureSession);
  }, [captureSession]);

  useEffect(() => {
    if (sessionStage !== "prepare" || introComplete) {
      return;
    }

    const timeout = setTimeout(() => {
      startSession(true);
      setIntroComplete(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [sessionStage, introComplete]);

  useEffect(() => {
    if (!introComplete || (sessionStage !== "prepare" && sessionStage !== "active")) {
      return;
    }

    const timeout = setTimeout(advanceSession, 1000);
    return () => clearTimeout(timeout);
  }, [sessionStage, secondsLeft, introComplete]);

  return (
    <main className="relative flex h-dvh w-full items-center justify-center bg-black">
      <div
        data-recording-frame
        style={{
          width: "min(100vw, 56.25dvh)",
          height: "min(100dvh, 177.7778vw)",
        }}
        className={cn(
          "relative flex items-center justify-center overflow-hidden",
          "font-helvetica font-semibold transition-colors duration-500",
          modeStyles[currentMode].bgSurface,
          modeStyles[currentMode].text,
        )}
      >
        {showModeSelector && (
          <div className="absolute inset-x-0 top-1 z-20 mx-auto w-full max-w-120 px-3">
            <ModeSelector
              currentMode={currentMode}
              onModeChange={(mode) => {
                setMode(mode);
                setShowModeSelector(false);
              }}
              language="en"
            />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 w-full px-12">
          <Canvas
            camera={{ position: [0, 0, 22], fov: 30 }}
          >
            <ambientLight intensity={1.5} />
            <directionalLight position={[75, 75, 5]} intensity={0.8} />
            <directionalLight position={[-5, -5, 2]} intensity={1.8} />
            <BreathingBlob startSmall />
          </Canvas>
        </div>
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center",
            modeStyles[currentMode].text,
          )}
        >
          <AnimatePresence mode="wait">
            {introComplete && currentPhase && (
              <MotionInSpan
                key={`${currentMode}-${sessionStage}-${phaseIndex}`}
                transition={{ duration: 0.5, ease: "easeIn" }}
                className="absolute text-center text-[144px] tracking-tighter"
                data-capture-text="phase"
                style={{
                  textRendering: "geometricPrecision",
                  WebkitTextStroke: "0.25px currentColor",
                }}
              >
                {t(`session.phases.${currentPhase.label}`, { lng: "en" })}
              </MotionInSpan>
            )}
          </AnimatePresence>
        </div>
        <div
          aria-label="Breathe, it is free."
          className={cn(
            "pointer-events-none absolute left-1/2 top-[75%] z-10 flex -translate-x-1/2 flex-col",
            "text-center text-[92px] tracking-tight leading-none",
            modeStyles[currentMode].text,
          )}
          style={{
            textRendering: "geometricPrecision",
            WebkitTextStroke: "0.25px currentColor",
          }}
        >
          <span data-capture-text>Breathe,</span>
          <span className="-mt-[0.18em]" data-capture-text>it is free.</span>
        </div>
      </div>
    </main>
  );
}
