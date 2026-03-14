import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: boolean;
}

export default function Card({
  children,
  padding = true,
  className = "",
  ...rest
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 ${padding ? "p-5" : ""} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
