import { Canvas } from "@react-three/fiber";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { modeStyles } from "../lib/consts";
import { cn } from "../lib/utils";
import {
  advanceSession,
  decreaseCycles,
  finishSession,
  increaseCycles,
  resetToIdle,
  setMode,
  startSession,
} from "../state/actions";
import { state } from "../state/state";
import { MotionFade } from "./motion/MotionFade";
import { MotionIn } from "./motion/MotionIn";
import { MotionInSpan } from "./motion/MotionInSpan";
import { Blob } from "./three/Blob";
import { CycleSelector } from "./ui/CycleSelector";
import { MainButton } from "./ui/MainButton";
import { ModeSelector } from "./ui/ModeSelector";

export function MainContent() {
  const { t, i18n } = useTranslation();

  const currentMode = state.use((value) => value.currentMode);
  const cycles = state.use((value) => value.cycles);
  const currentCycle = state.use((value) => value.currentCycle);
  const sessionStage = state.use((value) => value.sessionStage);
  const currentPhase = state.use((value) => value.currentPhase);
  const phaseIndex = state.use((value) => value.phaseIndex);
  const secondsLeft = state.use((value) => value.secondsLeft);
  const isTransitioning = state.use((value) => value.isTransitioning);
  const isSessionActive = sessionStage !== "idle";

  useEffect(() => {
    if (sessionStage !== "prepare" && sessionStage !== "active") {
      return;
    }

    const timeout = setTimeout(advanceSession, 1000);

    return () => clearTimeout(timeout);
  }, [sessionStage, secondsLeft]);

  useEffect(() => {
    if (sessionStage !== "done") {
      return;
    }

    const timeout = setTimeout(resetToIdle, 3000);

    return () => clearTimeout(timeout);
  }, [sessionStage]);

  function renderCircleContent() {
    if (sessionStage === "prepare") {
      return (
        <MotionIn
          key="prepare"
          transition={{ duration: 0.6 }}
          className={cn(
            "relative flex h-full w-full items-center justify-center",
            modeStyles[currentMode].text,
          )}
        >
          <AnimatePresence mode="wait">
            {secondsLeft <= 3 && (
              <MotionInSpan
                key={secondsLeft}
                scale
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute text-[80px] sm:text-[100px]"
              >
                {secondsLeft}
              </MotionInSpan>
            )}
          </AnimatePresence>
        </MotionIn>
      );
    }

    if (sessionStage === "active" && currentPhase) {
      return (
        <MotionIn
          key="active"
          transition={{ duration: 1, delay: 0.4, ease: "easeInOut" }}
          className={cn(
            "relative flex h-full w-full items-center justify-center",
            modeStyles[currentMode].text,
          )}
        >
          <AnimatePresence mode="wait">
            <MotionInSpan
              key={phaseIndex}
              transition={{ duration: 0.5, ease: "easeIn" }}
              className="absolute text-[47px] xs:text-[60px] sm:text-[65px] tracking-tight text-center"
            >
              {t(`session.phases.${currentPhase.label}`)}
            </MotionInSpan>
          </AnimatePresence>
        </MotionIn>
      );
    }

    if (sessionStage === "done") {
      return (
        <MotionIn
          key="done"
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className={cn(
            "absolute flex flex-col h-full w-full items-center justify-center",
            "text-[30px] xs:text-[36px] sm:text-[40px] tracking-tight text-center",
            "leading-6 xs:leading-8"
          )}
        >
          {t("session.done").split(" ").map((word, index) => (
            <span key={index} className="block">
              {word}
            </span>
          ))}
        </MotionIn>
      );
    }

    return null;
  }

  return (
    <div className="flex h-full w-full items-center justify-center px-3">
      <div className="flex flex-col h-full w-full max-w-120">
        <div className="relative h-29 w-full">
          <MotionFade
            visible={!isSessionActive}
            duration={0.5}
            className="absolute inset-0 flex flex-col items-center justify-center text-center gap-1.5"
          >
            <div className="text-[22px] sm:text-3xl tracking-tight leading-none">
              {t("session.title")}
            </div>
            <ModeSelector currentMode={currentMode} onModeChange={setMode} />
          </MotionFade>

          <MotionFade
            visible={sessionStage === "prepare"}
            duration={sessionStage === "prepare" ? 1.5 : sessionStage === "active" ? 1.5 : 0.2}
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center",
              "text-center tracking-tight",
              i18n.language === "pt-BR" ? "text-[28px]/[24px]" : "text-[28px]/[22px]",
              i18n.language === "pt-BR" ? "sm:text-[50px]/[40px]" : "sm:text-[50px]/[34px]"
            )}
          >
            {t("session.prepare")}
          </MotionFade>
        </div>

        <div className="relative flex flex-1 w-full">
          <div className="absolute inset-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 22], fov: 30 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[75, 75, 5]} intensity={0.8} />
              <directionalLight position={[-5, -5, 2]} intensity={1.8} />
              <Blob />
            </Canvas>
          </div>

          <AnimatePresence mode="wait">
            {renderCircleContent()}
          </AnimatePresence>
        </div>

        <div className="flex w-full items-center justify-center gap-5">
          <MainButton
            className="w-64 xs:w-50 sm:w-56"
            currentMode={currentMode}
            onStart={startSession}
            onFinish={finishSession}
            isSessionActive={isSessionActive}
            disabled={isTransitioning}
          />

          <CycleSelector
            currentMode={currentMode}
            cycles={cycles}
            onDecrease={decreaseCycles}
            onIncrease={increaseCycles}
            isSessionActive={isSessionActive}
            currentCycle={currentCycle}
          />
        </div>
      </div>
    </div>
  );
}