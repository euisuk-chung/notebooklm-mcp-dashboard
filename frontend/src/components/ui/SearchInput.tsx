import { useState, useEffect } from "react";

interface SearchInputProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchInput({
  value: controlledValue,
  onChange,
  placeholder = "검색...",
  debounceMs = 300,
}: SearchInputProps) {
  const [internal, setInternal] = useState(controlledValue ?? "");

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternal(controlledValue);
    }
  }, [controlledValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(internal);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [internal, debounceMs, onChange]);

  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={internal}
        onChange={(e) => setInternal(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  );
}
