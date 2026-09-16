import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { modeStyles } from "../../lib/consts";
import type { BreathMode } from "../../lib/types";
import { cn } from "../../lib/utils";
import { MotionFade } from "../motion/MotionFade";

interface CycleSelectorProps {
  currentMode: BreathMode;
  cycles: number;
  currentCycle: number;
  onDecrease: () => void;
  onIncrease: () => void;
  isSessionActive: boolean;
  className?: string;
}

export function CycleSelector({
  currentMode,
  cycles,
  currentCycle,
  onDecrease,
  onIncrease,
  isSessionActive,
  className,
}: CycleSelectorProps) {
  const { t } = useTranslation();

  const canDecrease = cycles > 3;
  const canIncrease = cycles < 9;

  return (
    <div className={cn(
      "flex flex-col w-full items-start",
      className,
    )}>
      <div className={cn(
        "pl-6",
        "text-lg/snug md:text-xl/tight pb-[0.8px]",
      )}>
        {t("Cycles")}
      </div>

      <div
        className={cn(
          "relative flex h-15 w-full items-center justify-center overflow-hidden",
          "rounded-full transition-colors duration-500",
          isSessionActive ? "bg-white" : modeStyles[currentMode].bgPrimary
        )}
      >
        <MotionFade
          visible={!isSessionActive}
          className={cn(
            "absolute inset-0 flex w-full items-center z-10",
            "text-[32px] md:text-4xl text-white",
          )}
        >
          <motion.button
            onClick={onDecrease}
            disabled={!canDecrease}
            whileTap={canDecrease ? { scale: 0.8 } : undefined}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className={cn(
              "flex flex-1 h-full items-center justify-center",
              "rounded-full will-change-transform",
              canDecrease ? "cursor-pointer" : "cursor-default"
            )}
          >
            <ChevronLeft
              className={cn(
                "h-8 w-8 md:h-9 md:w-9 transition-colors",
                canDecrease ? "text-white" : "text-white/60"
              )}
              strokeWidth={2.5}
            />
          </motion.button>

          <span className="flex flex-1 items-baseline justify-center text-white">
            <motion.span
              key={cycles}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {cycles}
            </motion.span>
          </span>

          <motion.button
            onClick={onIncrease}
            disabled={!canIncrease}
            whileTap={canIncrease ? { scale: 0.8 } : undefined}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className={cn(
              "flex flex-1 h-full items-center justify-center",
              "rounded-full will-change-transform",
              canIncrease ? "cursor-pointer" : "cursor-default"
            )}
          >
            <ChevronRight
              className={cn(
                "h-8 w-8 md:h-9 md:w-9 transition-colors",
                canIncrease ? "text-white" : "text-white/60"
              )}
              strokeWidth={2.5}
            />
          </motion.button>
        </MotionFade>

        <MotionFade
          visible={isSessionActive}
          className={cn(
            "absolute inset-0 flex w-full items-center justify-center z-10",
            "text-[32px] md:text-4xl text-white",
            `text-[var(--color-${currentMode})]`
          )}
        >
          <span className="flex items-baseline">
            <motion.span
              key={currentCycle}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {currentCycle}
            </motion.span>
            <span>/{cycles}</span>
          </span>
        </MotionFade>
      </div>
    </div>
  );
}