import { useTranslation } from "react-i18next";
import { modeStyles } from "../lib/consts";
import type { BreathMode } from "../lib/types";
import { cn } from "../lib/utils";

interface CreditLinkProps {
  currentMode: BreathMode;
  isSessionActive: boolean;
}

export function CreditLink({ currentMode, isSessionActive }: CreditLinkProps) {
  const { t } = useTranslation();

  return (
    <a
      href="https://github.com/heydufarias"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "fixed bottom-60 sm:bottom-50 right-0 z-30 origin-bottom-right -rotate-90",
        "flex h-6 items-end px-3",
        "text-[11px] sm:text-[13px] font-semibold tracking-wide",
        modeStyles[currentMode].text,
        "opacity-40 hover:opacity-100",
        "transition-opacity duration-300",
        isSessionActive && "opacity-0 pointer-events-none"
      )}
    >
      {t("by")} dufarias
    </a>
  );
}