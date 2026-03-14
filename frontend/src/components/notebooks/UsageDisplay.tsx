import Card from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";
import Spinner from "../ui/Spinner";
import type { UsageInfo } from "../../types/notebook";

interface UsageDisplayProps {
  usage: UsageInfo | undefined;
  isLoading: boolean;
}

export default function UsageDisplay({ usage, isLoading }: UsageDisplayProps) {
  if (isLoading) {
    return (
      <Card className="flex items-center gap-3">
        <Spinner size="sm" />
        <span className="text-sm text-gray-400">사용량 로딩 중...</span>
      </Card>
    );
  }

  if (!usage) return null;

  const percentage =
    usage.max_limit > 0
      ? (usage.current_count / usage.max_limit) * 100
      : 0;
  const isWarning = percentage > 80;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">노트북 사용량</h3>
        {isWarning && (
          <span className="text-xs font-medium text-amber-600">
            용량이 거의 찼습니다
          </span>
        )}
      </div>
      <div className="mt-2">
        <ProgressBar current={usage.current_count} max={usage.max_limit} />
      </div>
    </Card>
  );
}
