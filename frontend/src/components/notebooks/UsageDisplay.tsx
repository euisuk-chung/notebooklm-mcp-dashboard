import Card from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";
import Spinner from "../ui/Spinner";
import type { UsageInfo } from "../../types/notebook";
import { useLanguage } from "../../contexts/LanguageContext";

interface UsageDisplayProps {
  usage: UsageInfo | undefined;
  isLoading: boolean;
}

export default function UsageDisplay({ usage, isLoading }: UsageDisplayProps) {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <Card className="flex items-center gap-3">
        <Spinner size="sm" />
        <span className="text-sm text-gray-400 dark:text-gray-500">{t("usage.loading")}</span>
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
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t("usage.title")}</h3>
        {isWarning && (
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
            {t("usage.almostFull")}
          </span>
        )}
      </div>
      <div className="mt-2">
        <ProgressBar current={usage.current_count} max={usage.max_limit} />
      </div>
    </Card>
  );
}
