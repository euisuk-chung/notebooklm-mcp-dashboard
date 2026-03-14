import type { ButtonHTMLAttributes, ReactNode } from "react";
import Spinner from "./Spinner";

type Variant = "primary" | "danger" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-400",
  danger:
    "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 disabled:bg-red-300",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-300 disabled:text-gray-400",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  disabled,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
