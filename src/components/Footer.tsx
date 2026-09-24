import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Language } from "../lib/types";
import { cn } from "../lib/utils";

export function Footer() {
  const { i18n } = useTranslation();
  const current = i18n.language;

  return (
    <footer className={cn(
      "flex items-center justify-between px-4 sm:px-6 py-5",
      "text-[20px] sm:text-[25px] tracking-tight leading-none"
    )}>
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

      <span>
        &copy;{new Date().getFullYear()}
      </span>
    </footer >
  );
}