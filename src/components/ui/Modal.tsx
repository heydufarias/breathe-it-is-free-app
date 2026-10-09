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
        "fixed inset-0 flex items-center justify-center p-6 z-40",
        "bg-black/10 backdrop-blur-[2px]",
        "text-[#c1c1c1]",
      )}
    >
      <style>{`body { overflow: hidden; }`}</style>

      <MotionIn
        scale
        onClick={(e) => e.stopPropagation()}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "flex flex-col max-h-[70vh] w-full",
          maxWidth,
          "bg-white rounded-4xl overflow-hidden tracking-tight"
        )}
      >
        <div className="flex w-full items-end justify-end">
          <button
            onClick={onClose}
            className={cn(
              "flex h-10 w-10 items-center justify-center",
              "mt-2 mr-2 sm:mt-3 sm:mr-3",
              "rounded-full cursor-pointer",
            )}
          >
            <X className="h-6 hover:sm:scale-110 transition-transform duration-200" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col px-8 pb-8 overflow-y-auto min-h-0">
          {children}
        </div>
      </MotionIn>
    </MotionIn>
  );
}