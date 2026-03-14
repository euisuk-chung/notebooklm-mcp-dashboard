interface BadgeProps {
  label: string;
  variant?: "default" | "processing" | "complete" | "failed" | "pending" | "tag";
}

const variantClasses: Record<string, string> = {
  default: "bg-gray-100 text-gray-700",
  processing: "bg-amber-100 text-amber-800 animate-pulse",
  generating: "bg-amber-100 text-amber-800 animate-pulse",
  complete: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  pending: "bg-blue-100 text-blue-800",
  tag: "bg-indigo-50 text-indigo-700",
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
  const labelMap: Record<string, string> = {
    pending: "대기중",
    generating: "생성중",
    complete: "완료",
    failed: "실패",
  };
  return (
    <Badge
      label={labelMap[status] ?? status}
      variant={status as BadgeProps["variant"]}
    />
  );
}
