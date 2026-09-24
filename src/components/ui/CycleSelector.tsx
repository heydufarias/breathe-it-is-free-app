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

  const disabledIconColor = `color-mix(in srgb, white 60%, var(--color-${currentMode}))`;

  return (
    <div className={cn("relative flex flex-col w-full items-start", className)}>
      <div
        className={cn(
          "absolute top-[-25px] pl-4",
          "text-[17px]/snug sm:text-[19px]/tight",
        )}
      >
        {t("Cycles")}
      </div>

      <div className="relative flex h-11 sm:h-12 w-28 sm:w-32 items-center justify-center overflow-hidden rounded-full">
        {/* Fundo: cor do modo (sessão parada) */}
        <MotionFade
          visible={!isSessionActive}
          className={cn(
            "absolute inset-0 z-0 transition-colors duration-500",
            modeStyles[currentMode].bgPrimary,
          )}
        />

        {/* Fundo: branco (sessão ativa) */}
        <MotionFade
          visible={isSessionActive}
          className="absolute inset-0 z-0 bg-white"
        />

        {/* Conteúdo: seletor */}
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
            whileTap={canDecrease ? { scale: 0.8 } : undefined}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className={cn(
              "flex h-full aspect-square shrink-0 items-center justify-center",
              "rounded-full bg-white/25 will-change-transform",
              canDecrease ? "cursor-pointer" : "cursor-default",
            )}
          >
            <Minus
              className="h-5 w-5 sm:h-6 sm:w-6 transition-colors"
              style={{ color: canDecrease ? "white" : disabledIconColor }}
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
            whileTap={canIncrease ? { scale: 0.8 } : undefined}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className={cn(
              "flex h-full aspect-square shrink-0 items-center justify-center",
              "rounded-full bg-white/25 will-change-transform",
              canIncrease ? "cursor-pointer" : "cursor-default",
            )}
          >
            <Plus
              className="h-5 w-5 sm:h-6 sm:w-6 transition-colors"
              style={{ color: canIncrease ? "white" : disabledIconColor }}
              strokeWidth={3.5}
            />
          </motion.button>
        </MotionFade>

        {/* Conteúdo: contador da sessão */}
        <MotionFade
          visible={isSessionActive}
          className={cn(
            "absolute inset-0 flex w-full items-center justify-center z-10",
            "text-[32px] sm:text-[33px]",
            `text-[var(--color-${currentMode})]`,
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