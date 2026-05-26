import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  href?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
  disabled,
  href,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-display font-600 rounded-full transition-all duration-300 cursor-pointer select-none relative overflow-hidden group";

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-7 py-3 text-base",
    lg: "px-9 py-4 text-lg",
  };

  const variants = {
    primary:
      "text-white shadow-lg hover:shadow-solar/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
    outline:
      "border-2 border-solar text-solar hover:bg-solar hover:text-white active:scale-[0.98]",
    ghost:
      "text-[var(--text)] hover:text-solar hover:bg-solar/10",
  };

  const classes = cn(base, sizes[size], variants[variant], className);

  const gradientStyle = variant === "primary"
    ? {
        background: "linear-gradient(135deg, #FF781E 0%, #FF9F21 45%, #F9CF57 100%)",
        backgroundSize: "200% 200%",
        animation: "gradient-shift 3s ease infinite",
      }
    : {};

  if (href) {
    return (
      <a href={href} className={classes} style={gradientStyle}>
        <span className="absolute inset-0 bg-white/15 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 skew-x-12" />
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(classes, disabled && "opacity-50 cursor-not-allowed")}
      style={gradientStyle}
    >
      <span className="absolute inset-0 bg-white/15 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 skew-x-12" />
      {children}
    </button>
  );
}
