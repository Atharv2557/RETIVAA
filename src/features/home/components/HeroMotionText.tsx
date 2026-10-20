"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

interface LineRevealProps {
  lines: readonly string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  immediate?: boolean;
}

export function LineReveal({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  immediate = false,
}: LineRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span className={`block ${className}`}>
      {lines.map((line, index) => (
        <motion.span
          key={index}
          className={`block will-change-transform ${lineClassName}`}
          initial={{
            clipPath: "inset(0% 0% 100% 0%)",
            y: shouldReduceMotion ? 0 : 30,
            opacity: 0,
          }}
          {...(immediate
            ? {
                animate: {
                  clipPath: "inset(0% 0% -10% 0%)",
                  y: 0,
                  opacity: 1,
                },
              }
            : {
                whileInView: {
                  clipPath: "inset(0% 0% -10% 0%)",
                  y: 0,
                  opacity: 1,
                },
                viewport: { once: false, margin: "0px 0px -8% 0px" },
              })}
          transition={{
            duration: shouldReduceMotion ? 0.01 : 0.95,
            ease: EASE_LUXURY,
            delay: delay + index * 0.12,
          }}
        >
          {line}
        </motion.span>
      ))}
    </span>
  );
}

interface FadeSlideProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  immediate?: boolean;
}

export function FadeSlide({
  children,
  delay = 0,
  y = 16,
  className = "",
  immediate = false,
}: FadeSlideProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : y }}
      {...(immediate
        ? { animate: { opacity: 1, y: 0 } }
        : {
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: false, margin: "0px 0px -10% 0px" },
          })}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.8,
        ease: EASE_LUXURY,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
