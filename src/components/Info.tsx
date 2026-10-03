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
        "text-[#c1c1c1]",
      )}
    >
      <MotionIn
        scale
        onClick={(e) => e.stopPropagation()}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "relative flex flex-col max-h-[70vh] max-w-md w-full",
          "bg-white rounded-4xl overflow-hidden tracking-tight"
        )}
      >
        <div className="flex h-12 w-full items-end justify-end pr-2">
          <button
            onClick={onClose}
            className={cn(
              "flex items-center justify-center w-10 h-10",
              "rounded-full cursor-pointer",
            )}
          >
            <X className="h-6" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col px-8 pb-8 overflow-y-auto">
          <p className="text-[16px] font-medium leading-4.5">
            {t(`info.description`)}
          </p>
          <section>
            <p className="pt-6 pb-2 text-[16px] font-semibold leading-4.5">
              {t("info.modesSection.title")}:
            </p>

            <div className="flex flex-col gap-5">
              {MODES.map((mode) => (
                <div key={mode}>
                  <span
                    className={cn(
                      "text-[18px] font-bold tracking-normal leading-0",
                      modeStyles[mode].text
                    )}
                  >
                    {t(`modes.${mode}`)}
                  </span>

                  <p
                    className={cn(
                      "-mt-0.5",
                      "text-[14px] font-semibold tracking-normal leading-4",
                      "opacity-50",
                      modeStyles[mode].text,
                    )}
                  >
                    {t(`info.modesSection.${mode}.pattern`)}
                  </p>

                  <p className="mt-1.5 text-[16px] font-medium leading-4.5">
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