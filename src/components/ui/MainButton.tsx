import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { modeStyles } from "../../lib/consts";
import type { BreathMode } from "../../lib/types";
import { cn } from "../../lib/utils";
import { MotionFade } from "../motion/MotionFade";

interface MainButtonProps {
  currentMode: BreathMode;
  onStart: () => void;
  onFinish: () => void;
  isSessionActive: boolean;
  disabled?: boolean;
  className?: string;
}

export function MainButton({
  currentMode,
  onStart,
  isSessionActive,
  onFinish,
  disabled,
  className,
}: MainButtonProps) {
  const { t } = useTranslation();

  function handleClick() {
    if (disabled) return;
    if (isSessionActive) {
      onFinish();
      return;
    }

    onStart();
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "relative flex h-13 w-full items-center rounded-full cursor-pointer overflow-hidden p-1",
        isSessionActive ? "justify-end" : "justify-start",
        className,
      )}
    >
      <MotionFade
        visible={!isSessionActive}
        className="absolute inset-0 z-0 bg-white"
      />

      <div className="absolute right-7 flex h-full items-center z-10 pointer-events-none">
        <MotionFade
          visible={!isSessionActive}
          className="text-[21px] sm:text-2xl"
        >
          {t("start")}
        </MotionFade>
      </div>

      <MotionFade
        visible={isSessionActive}
        className={cn(
          "absolute inset-0 z-0 transition-colors duration-500",
          modeStyles[currentMode].bgPrimary,
        )}
      />

      <div className="absolute left-7 flex h-full items-center z-10 pointer-events-none">
        <MotionFade
          visible={isSessionActive}
          duration={0.5}
          className="text-white text-[21px] sm:text-2xl"
        >
          {t("finish")}
        </MotionFade>
      </div>

      <motion.div
        layout
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="relative flex h-full aspect-square shrink-0 items-center justify-center rounded-full overflow-hidden z-20 "
      >
        <MotionFade
          visible={!isSessionActive}
          className={cn(
            "absolute inset-0 transition-colors duration-500",
            modeStyles[currentMode].bgPrimary,
          )}
        />

        <MotionFade
          visible={isSessionActive}
          className="absolute inset-0 bg-white"
        />

        <motion.div
          animate={{ rotate: isSessionActive ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="relative z-10"
        >
          <ArrowRight
            className={cn(
              "h-7 w-7 md:h-8 md:w-8 transition-colors duration-500",
              isSessionActive ? modeStyles[currentMode].text : "text-white",
            )}
            strokeWidth={2.5}
          />
        </motion.div>
      </motion.div>
    </button>
  );
}