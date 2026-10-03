import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { modeStyles } from "../lib/consts";
import type { BreathMode, Language } from "../lib/types";
import { cn } from "../lib/utils";

interface FooterProps {
  currentMode: BreathMode;
}

export function Footer({ currentMode }: FooterProps) {
  const { i18n } = useTranslation();
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
          "absolute right-1 sm:right-2.5 bottom-2.5 sm:bottom-2",
          "flex h-10 items-end px-3",
          "text-[11px] sm:text-[14px] font-semibold tracking-normal",
          modeStyles[currentMode].text,
          "opacity-40 hover:opacity-100",
          "transition-colors duration-500",
        )}
      >
        By dufarias
      </a>

      <span className="flex items-baseline gap-[1.5px]">
        <span>&copy;</span>
        <span>{new Date().getFullYear()}</span>
      </span>
    </footer>
  );
}