import { Canvas } from "@react-three/fiber";
import { AnimatePresence } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { modeStyles } from "../lib/consts";
import { cn } from "../lib/utils";
import { advanceSession, setMode, startSession } from "../state/actions";
import { state } from "../state/state";
import { MotionInSpan } from "./motion/MotionInSpan";
import { Blob } from "./three/Blob";
import { ModeSelector } from "./ui/ModeSelector";

const wordmarkLines = [
  { text: "Breathe,", className: "" },
  { text: "it is free.", className: "-mt-1.5" },
];

export function RecordingScreen() {
  const { t } = useTranslation();
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
    if (sessionStage === "idle") {
      startSession();
    }

    if (sessionStage === "done") {
      startSession(true);
    }
  }, [sessionStage]);

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
    <main className="flex h-dvh w-full items-center justify-center bg-black">
      <div
        style={{
          width: "min(100vw, 56.25dvh)",
          height: "min(100dvh, 177.7778vw)",
        }}
        className={cn(
          "relative flex flex-col overflow-hidden",
          "font-helvetica font-semibold transition-colors duration-500",
          modeStyles[currentMode].bgSurface,
          modeStyles[currentMode].text,
        )}
      >
        <div className="relative h-16 shrink-0">
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
        </div>

        <div className="relative h-29 w-full shrink-0">
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-1.5",
              "px-3 text-center tracking-tight",
              "text-[32px]/[26px]",
            )}
          >
            Now it's your time to take a break and breathe.
          </div>
        </div>

        <div className="relative flex w-full flex-1 justify-center">
          <div className="pointer-events-none absolute inset-0 w-full px-2">
            <Canvas camera={{ position: [0, 0, 22], fov: 30 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[75, 75, 5]} intensity={0.8} />
              <directionalLight position={[-5, -5, 2]} intensity={1.8} />
              <Blob startSmall />
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
                  className="absolute text-[56px] tracking-tighter text-center"
                >
                  {t(`session.phases.${currentPhase.label}`, { lng: "en" })}
                </MotionInSpan>
              )}
            </AnimatePresence>
          </div>
        </div>

        <footer
          className={cn(
            "relative flex w-full shrink-0 items-center justify-between px-4 py-5",
            "text-[22px] tracking-tight leading-none",
          )}
        >
          <span className="absolute inset-x-0 text-center">
            Check on breatheitisfree.app
          </span>

          <div
            aria-label="Breathe, it is free."
            className={cn(
              "absolute right-1 bottom-2.5 flex cursor-default flex-col",
              "text-[30px] tracking-tight leading-none",
              modeStyles[currentMode].text,
            )}
          >
            {wordmarkLines.map(({ text, className }) => (
              <span key={text} className={className}>
                {text}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </main>
  );
}
