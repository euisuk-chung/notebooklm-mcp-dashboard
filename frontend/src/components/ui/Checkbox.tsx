import type { MouseEvent } from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export default function Checkbox({
  checked,
  onChange,
  label,
}: CheckboxProps) {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange();
  };

  return (
    <span
      role="checkbox"
      aria-checked={checked}
      className="inline-flex items-center gap-2 cursor-pointer select-none"
      onClick={handleClick}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
          checked
            ? "border-indigo-600 bg-indigo-600"
            : "border-gray-300 bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500"
        }`}
      >
        {checked && (
          <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      {label && <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>}
    </span>
  );
}
