import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  isExternal?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#30251F] text-[#F6EFE3] hover:bg-[#B88A44] active:bg-[#A65335] border border-transparent shadow-sm",
  secondary:
    "bg-[#B88A44] text-[#191918] hover:bg-[#D7B98E] active:bg-[#A65335] border border-transparent",
  outline:
    "bg-transparent text-[#30251F] hover:bg-[#30251F] hover:text-[#F6EFE3] border border-[#30251F]/30",
  ghost:
    "bg-transparent text-[#30251F] hover:bg-[#30251F]/05 active:bg-[#30251F]/10 border border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs tracking-wider",
  md: "px-5 py-2.5 text-xs tracking-widest",
  lg: "px-7 py-3 text-sm tracking-widest",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  isExternal = false,
  className = "",
  children,
  disabled,
  ...rest
}: ButtonProps) {
  const combinedClasses = `
    inline-flex items-center justify-center font-medium uppercase transition-colors
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A65335]
    disabled:opacity-50 disabled:pointer-events-none cursor-pointer rounded-xs
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.trim();

  if (href) {
    if (isExternal) {
      return (
        <a
          href={href}
          className={combinedClasses}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
