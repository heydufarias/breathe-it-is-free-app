
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MotionFade } from "./motion/MotionFade";

interface HeaderProps {
  showInfoButton: boolean;
  onInfoButtonClick: () => void;
}

const titleLines = [
  { text: "Breathe,", className: "" },
  { text: "it is free.", className: "-mt-1.5" },
] as const;

const animatedTitleClassName =
  "bg-[linear-gradient(90deg,color-mix(in_srgb,var(--color-relax)_70%,white),color-mix(in_srgb,var(--color-focus)_70%,white),color-mix(in_srgb,var(--color-sleep)_70%,white),color-mix(in_srgb,var(--color-relax)_70%,white),color-mix(in_srgb,var(--color-focus)_70%,white),color-mix(in_srgb,var(--color-sleep)_70%,white),color-mix(in_srgb,var(--color-relax)_70%,white),color-mix(in_srgb,var(--color-focus)_70%,white),color-mix(in_srgb,var(--color-sleep)_70%,white),color-mix(in_srgb,var(--color-relax)_70%,white))] bg-[length:300%_100%] bg-no-repeat bg-clip-text text-transparent [-webkit-text-fill-color:transparent]";

export function Header({
  showInfoButton,
  onInfoButtonClick,
}: HeaderProps) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

  const prefersReducedMotion = useReducedMotion() ?? false;
  const isColorful = isHovered || isPressed;
  const isIntro = !hasPlayedIntro && !prefersReducedMotion;

  const titleAnimation = {
    backgroundPosition:
      isIntro || (isColorful && !prefersReducedMotion)
        ? ["100% 50%", "0% 50%"]
        : "100% 50%",
  };

  const titleTransition = {
    backgroundPosition:
      isIntro || !isColorful
        ? {
          duration: 1.5,
          ease: "easeInOut" as const,
          delay: isIntro ? 0.6 : 0,
        }
        : {
          duration: 10,
          ease: "linear" as const,
          repeat: Infinity,
        },
  };

  const wipeAnimation = {
    "--wipe-position": isIntro
      ? ["-40%", "100%"]
      : isColorful
        ? "-40%"
        : "100%",
  };

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-2">
      <motion.div
        className="relative flex flex-col cursor-default text-[27px] sm:text-[34px] tracking-tight leading-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onPointerDown={(event) => {
          if (event.pointerType === "touch") {
            setIsPressed(true);
            event.currentTarget.setPointerCapture(event.pointerId);
          }
        }}
        onPointerUp={() => setIsPressed(false)}
        onPointerCancel={() => setIsPressed(false)}
        onLostPointerCapture={() => setIsPressed(false)}
      >
        {titleLines.map(({ text, className }) => (
          <span key={text} className={className}>
            {text}
          </span>
        ))}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <motion.div
            className="absolute inset-0 flex flex-col mask-[linear-gradient(90deg,transparent_var(--wipe-position),black_calc(var(--wipe-position)+40%))] [-webkit-mask-image:linear-gradient(90deg,transparent_var(--wipe-position),black_calc(var(--wipe-position)_+_40%))]"
            initial={{ "--wipe-position": "-40%" }}
            animate={wipeAnimation}
            transition={{
              "--wipe-position": {
                duration: isIntro ? 1.5 : 1,
                ease: "easeInOut",
                delay: isIntro ? 0.6 : 0,
              },
            }}
            onAnimationComplete={() => {
              if (isIntro) setHasPlayedIntro(true);
            }}
          >
            {titleLines.map(({ text, className }) => (
              <motion.span
                key={text}
                className={`${className} ${animatedTitleClassName}`}
                initial={{ backgroundPosition: "100% 50%" }}
                animate={titleAnimation}
                transition={titleTransition}
              >
                {text}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <MotionFade visible={showInfoButton}>
        <button
          onClick={onInfoButtonClick}
          className="text-[20px] sm:text-[25px] cursor-pointer"
        >
          {t("about")}
        </button>
      </MotionFade>
    </header>
  );
}
