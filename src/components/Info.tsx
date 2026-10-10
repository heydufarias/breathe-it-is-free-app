import { useTranslation } from "react-i18next";
import { MODES, modeStyles } from "../lib/consts";
import { cn } from "../lib/utils";
import { Modal } from "./ui/Modal";

interface InfoProps {
  onClose: () => void;
}

export function Info({ onClose }: InfoProps) {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose}>
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
    </Modal>
  );
}