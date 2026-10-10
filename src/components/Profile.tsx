import { modeStyles } from "../lib/consts";
import type { BreathMode } from "../lib/types";
import { cn } from "../lib/utils";
import { Modal } from "./ui/Modal";
import dufariasImage from "../assets/images/dufarias.jpg";
import type { ReactNode } from "react";

interface ProfileProps {
  currentMode: BreathMode;
  onClose: () => void;
}

interface SocialLinkProps {
  href: string;
  currentMode: BreathMode;
  className: string;
  children: ReactNode;
}

function SocialLink({
  href,
  currentMode,
  className,
  children,
}: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center justify-center",
        modeStyles[currentMode].text,
        "transition-[filter] duration-300",
        className
      )}
    >
      {children}
    </a>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.207 11.387.6.113.793-.258.793-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.744.082-.729.082-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.42-1.304.763-1.604-2.665-.303-5.467-1.333-5.467-5.93 0-1.31.468-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.323 3.3 1.23a11.5 11.5 0 013.003-.404c1.02.005 2.047.138 3.003.404 2.29-1.553 3.297-1.23 3.297-1.23.653 1.653.24 2.873.117 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.92.432.372.816 1.103.816 2.222 0 1.604-.015 2.896-.015 3.29 0 .322.19.696.8.577C20.565 21.796 24 17.296 24 12c0-6.63-5.373-12-12-12" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Profile({ currentMode, onClose }: ProfileProps) {
  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col items-center justify-start">
        <div
          className={cn(
            "flex mb-4 gap-[3px]",
            "text-[25px] sm:text-[28px] font-semibold tracking-tight leading-7"
          )}
        >
          <p>du</p>
          <p>farias</p>
        </div>

        <div className="w-full max-w-56 mb-3 aspect-square rounded-3xl overflow-hidden">
          <img
            src={dufariasImage}
            alt="du farias"
            className="w-full h-full object-cover grayscale"
          />
        </div>

        <p className="text-[15px] sm:text-[16px] text-center font-medium leading-4 opacity-70 mb-6">
          Software Developer | Product Engineer
        </p>

        <div className="flex gap-5">
          <SocialLink
            href="https://github.com/heydufarias"
            currentMode={currentMode}
            className="opacity-90 hover:opacity-100"
          >
            <GithubIcon />
          </SocialLink>

          <SocialLink
            href="https://linkedin.com/in/heydufarias"
            currentMode={currentMode}
            className="opacity-100 sm:opacity-80 hover:opacity-100"
          >
            <LinkedinIcon />
          </SocialLink>
        </div>
      </div>
    </Modal>
  );
}