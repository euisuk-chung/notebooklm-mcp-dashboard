interface ProgressBarProps {
  current: number;
  max: number;
  showLabel?: boolean;
}

export default function ProgressBar({
  current,
  max,
  showLabel = true,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  const isWarning = percentage > 80;
  const barColor = isWarning ? "bg-amber-500" : "bg-indigo-600";
  const textColor = isWarning ? "text-amber-700 dark:text-amber-400" : "text-gray-600 dark:text-gray-400";

  return (
    <div className="w-full">
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className={`mt-1 text-xs ${textColor}`}>
          {current} / {max} ({percentage.toFixed(0)}%)
        </p>
      )}
    </div>
  );
}
