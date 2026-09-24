import { useTranslation } from "react-i18next";
import { MODES, modeStyles } from "../../lib/consts";
import type { BreathMode } from "../../lib/types";
import { cn } from "../../lib/utils";

interface ModeSelectorProps {
  currentMode: BreathMode;
  onModeChange: (mode: BreathMode) => void;
}

export function ModeSelector({
  currentMode,
  onModeChange,
}: ModeSelectorProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "relative flex w-full overflow-hidden",
        "rounded-full",
        "transition-colors duration-500",
        modeStyles[currentMode].bgPrimary
      )}
    >
      <div
        className={cn(
          "absolute top-1 bottom-1 left-1",
          "bg-white rounded-full ",
          "transition-all duration-500 ease-in-out",
          modeStyles[currentMode].translate
        )}
        style={{ width: "calc((100% - 0.5rem) / 3)" }}
      />

      {MODES.map((mode) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={cn(
            "flex flex-1 h-13 items-center justify-center z-10",
            "text-[20px] sm:text-2xl",
            "cursor-pointer transition-colors duration-500",
            currentMode === mode ? modeStyles[currentMode].text : "text-white/60"
          )}
        >
          <span>
            {t(`modes.${mode}`)}
          </span>
        </button>
      ))}
    </div>
  );
}