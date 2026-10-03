import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { modeStyles } from "../lib/consts";
import type { BreathMode, Language } from "../lib/types";
import { cn } from "../lib/utils";

interface FooterProps {
  currentMode: BreathMode;
  isSessionActive: boolean;
}

export function Footer({ currentMode, isSessionActive }: FooterProps) {
  const { t, i18n } = useTranslation();
  const current = i18n.language;

  return (
    <footer
      className={cn(
        "relative flex items-center justify-between px-4 sm:px-6 py-5",
        "text-[20px] sm:text-[25px] tracking-tight leading-none"
      )}
    >
      <div className="flex gap-3">
        {(["en", "pt-BR"] as Language[]).map((language) => {
          return (
            <button
              key={language}
              onClick={() => i18n.changeLanguage(language)}
              className="relative cursor-pointer"
            >
              {language === "en" ? "En" : "Pt-br"}
              {current === language && (
                <motion.div
                  layoutId="active-underline"
                  className={cn(
                    "absolute -bottom-0.5 left-0 right-0 h-0.5",
                    "bg-current"
                  )}
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      <a
        href="https://github.com/heydufarias"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "absolute left-1/2 bottom-2 -translate-x-1/2",
          "flex h-10 items-end px-3",
          "text-[14px] font-semibold tracking-wide",
          modeStyles[currentMode].text,
          "opacity-40 hover:opacity-100",
          "transition-all duration-500",
          isSessionActive && "opacity-0 pointer-events-none"
        )}
      >
        {t("by")} dufarias
      </a>

      <span className="flex items-baseline gap-[1.5px]">
        <span>&copy;</span>
        <span>{new Date().getFullYear()}</span>
      </span>
    </footer>
  );
}