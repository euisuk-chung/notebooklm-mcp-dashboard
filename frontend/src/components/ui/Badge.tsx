import { useLanguage } from "../../contexts/LanguageContext";

interface BadgeProps {
  label: string;
  variant?: "default" | "processing" | "complete" | "failed" | "pending" | "tag";
}

const variantClasses: Record<string, string> = {
  default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  processing: "bg-amber-100 text-amber-800 animate-pulse dark:bg-amber-900/50 dark:text-amber-300",
  generating: "bg-amber-100 text-amber-800 animate-pulse dark:bg-amber-900/50 dark:text-amber-300",
  complete: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  pending: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
  tag: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
};

export default function Badge({ label, variant = "default" }: BadgeProps) {
  const classes = variantClasses[variant] ?? variantClasses.default;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const { t } = useLanguage();
  const labelMap: Record<string, string> = {
    pending: t("status.pending"),
    generating: t("status.generating"),
    complete: t("status.completed"),
    failed: t("status.failed"),
  };
  return (
    <Badge
      label={labelMap[status] ?? status}
      variant={status as BadgeProps["variant"]}
    />
  );
}
