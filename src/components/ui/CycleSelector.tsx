import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
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
      "relative flex flex-col items-start",
      className
    )}>
      <div
        className={cn(
          "absolute -top-6 sm:-top-6.75 pl-4",
          "text-[17px] sm:text-[19px]",
        )}
      >
        {t("cycles")}
      </div>

      <div className="relative flex h-11 sm:h-12 w-28 sm:w-32 items-center justify-center overflow-hidden rounded-full">
        <MotionFade
          visible={!isSessionActive}
          className={cn(
            "absolute inset-0 z-0",
            "transition-colors duration-500",
            modeStyles[currentMode].bgPrimary,
          )}
        />

        <MotionFade
          visible={isSessionActive}
          className="absolute inset-0 z-0 bg-white"
        />

        <MotionFade
          visible={!isSessionActive}
          className={cn(
            "absolute inset-0 flex w-full items-center p-1 z-10",
            "text-[28px] sm:text-[33px] text-white",
          )}
        >
          <motion.button
            onClick={onDecrease}
            disabled={!canDecrease}
            whileTap={canDecrease ? { scale: 0.85 } : undefined}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className={cn(
              "flex h-full items-center justify-center aspect-square shrink-0",
              "rounded-full bg-white/25 will-change-transform",
              canDecrease ? "cursor-pointer" : "cursor-default",
            )}
          >
            <Minus
              className={cn("h-5 sm:h-6",
                "transition-colors",
                canDecrease ? "white" : modeStyles[currentMode].text,
              )}
              strokeWidth={3.5}
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
            whileTap={canIncrease ? { scale: 0.85 } : undefined}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className={cn(
              "flex h-full items-center justify-center aspect-square shrink-0",
              "rounded-full bg-white/25 will-change-transform",
              canIncrease ? "cursor-pointer" : "cursor-default",
            )}
          >
            <Plus
              className={cn("h-5 sm:h-6",
                "transition-colors duration-500",
                canIncrease ? "white" : modeStyles[currentMode].text,
              )}
              strokeWidth={3.5}
            />
          </motion.button>
        </MotionFade>

        <MotionFade
          visible={isSessionActive}
          className={cn(
            "absolute inset-0 flex w-full items-center justify-center z-10",
            "text-[28px] sm:text-[33px]",
            modeStyles[currentMode].text,
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