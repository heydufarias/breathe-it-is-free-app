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

  return (
    <button
      onClick={() => !disabled && (isSessionActive ? onFinish() : onStart())}
      disabled={disabled}
      className={cn(
        "relative flex h-15 w-full items-center overflow-hidden p-1",
        "rounded-full",
        "cursor-pointer transition-colors duration-500",
        isSessionActive ? `justify-end ${modeStyles[currentMode].bgPrimary}` : "justify-start bg-white",
        className,
      )}
    >
      <MotionFade
        visible={!isSessionActive}
        className={cn(
          "absolute right-5 md:right-7 flex h-full items-center z-10",
          "text-[22px] md:text-2xl",
          "transition-colors duration-500",
          modeStyles[currentMode].text
        )}
      >
        {t("Start")}
      </MotionFade>

      <MotionFade
        visible={isSessionActive}
        duration={0.5}
        className={cn(
          "absolute left-5 md:left-7 flex h-full items-center z-10",
          "text-[22px] md:text-2xl text-white",
          "transition-colors duration-500",
        )}
      >
        {t("Finish")}
      </MotionFade>

      <motion.div
        layout
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={cn(
          "flex h-full items-center justify-center z-20",
          "rounded-full aspect-square",
          "transition-colors duration-500",
          isSessionActive ? "bg-white" : modeStyles[currentMode].bgPrimary
        )}
      >
        <motion.div
          animate={{ rotate: isSessionActive ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <ArrowRight
            className={cn(
              "h-8 w-8 md:h-9 md:w-9",
              "transition-colors duration-500",
              isSessionActive ? `text-[var(--color-${currentMode})]` : "text-white"
            )}
            strokeWidth={2.5}
          />
        </motion.div>
      </motion.div>
    </button>
  );
}