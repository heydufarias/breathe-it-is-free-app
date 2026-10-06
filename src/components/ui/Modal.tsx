
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";
import { MotionIn } from "../motion/MotionIn";

interface ModalProps {
  onClose: () => void;
  maxWidth?: string;
  children: ReactNode;
}

export function Modal({ onClose, maxWidth = "max-w-md", children }: ModalProps) {
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
          "relative flex flex-col max-h-[70vh] w-full",
          maxWidth,
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
          {children}
        </div>
      </MotionIn>
    </MotionIn>
  );
}