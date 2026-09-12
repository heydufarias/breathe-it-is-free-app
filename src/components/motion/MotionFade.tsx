import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface MotionFadeProps {
  visible: boolean;
  duration?: number;
  className?: string;
  children?: ReactNode;
}

export function MotionFade({ visible, duration = 0.5, className, children }: MotionFadeProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration, ease: "easeInOut" }}
          className={cn(className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}