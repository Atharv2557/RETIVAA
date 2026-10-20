import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: "narrow" | "standard" | "wide";
  as?: "div" | "section" | "article" | "header" | "footer";
}

const sizeClasses = {
  narrow: "max-w-3xl",
  standard: "max-w-6xl",
  wide: "max-w-7xl",
} as const;

export function Container({
  children,
  className = "",
  size = "standard",
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
