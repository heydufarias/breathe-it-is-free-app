import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MODES, modeStyles } from "../lib/consts";
import { cn } from "../lib/utils";
import { MotionIn } from "./motion/MotionIn";

interface InfoProps {
  onClose: () => void;
}

export function Info({ onClose }: InfoProps) {
  const { t } = useTranslation();

  return (
    <MotionIn
      onClick={onClose}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "absolute inset-0 flex items-center justify-center p-6 z-40",
        "bg-black/10 backdrop-blur-[2px]",
        "text-[#b7b8b8]",
      )}
    >
      <MotionIn
        scale
        onClick={(e) => e.stopPropagation()}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "relative flex flex-col max-h-[70vh] max-w-md w-full",
          "bg-white rounded-4xl overflow-hidden"
        )}
      >
        <div className={cn(
          "flex h-12 w-full items-end justify-end pr-2",
          // " bg-red-500",

        )}>

          <button
            onClick={onClose}
            className={cn(
              "flex items-center justify-center w-10 h-10",
              // " bg-amber-400",
              "rounded-full cursor-pointer",

            )}
          >
            <X className=" h-6" strokeWidth={2.5} />
          </button>
        </div>
        <div className="flex flex-col gap-8 px-8 pb-8 overflow-y-auto">
          <section>
            <p className="mb-4 text-[16px] tracking-tight">
              {t("info.modesSection.title")}
            </p>

            <div className="flex flex-col gap-5">
              {MODES.map((mode) => (
                <div key={mode}>
                  <span
                    className={cn(
                      "text-lg font-bold leading-0 transition-colors duration-500",
                      modeStyles[mode].text
                    )}
                  >
                    {t(`modes.${mode}`)}
                  </span>

                  <p
                    className={cn(
                      "-mt-1 text-[12px] font-semibold leading-3 transition-colors duration-500",
                      modeStyles[mode].text,
                      "opacity-50"
                    )}
                  >
                    {t(`info.modesSection.${mode}.pattern`)}
                  </p>

                  <p className="mt-2 leading-4.5 text-[15px] font-medium tracking-tight">
                    {t(`info.modesSection.${mode}.description`)}
                  </p>
                </div>
              ))}
            </div>
          
          </section>
        </div>
      </MotionIn>
    </MotionIn>
  );
}