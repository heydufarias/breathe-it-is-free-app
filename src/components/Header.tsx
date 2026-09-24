import { useTranslation } from "react-i18next";
import { MotionFade } from "./motion/MotionFade";
import { cn } from "../lib/utils";

interface HeaderProps {
  showInfoButton: boolean;
  onInfoButtonClick: () => void;
}

export function Header({ showInfoButton, onInfoButtonClick }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-2">
      <div className={cn(
        "flex flex-col",
        "text-[26px] sm:text-[34px] font-semibold tracking-tight leading-none"
      )}>
        <span>Breathe,</span>
        <span className="-mt-1.5">it is free.</span>
      </div>
      <MotionFade visible={showInfoButton}>
        <button
          onClick={onInfoButtonClick}
          className={cn(
            "text-[20px] sm:text-[25px] font-semibold",
            "cursor-pointer"
          )}>
          {t("info.howToUse.title")}
        </button>
      </MotionFade>
    </header>
  );
}