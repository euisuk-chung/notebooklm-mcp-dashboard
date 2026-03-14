import Card from "../ui/Card";
import type { ArtifactType } from "../../types/studio";
import { ARTIFACT_CONFIGS } from "../../utils/constants";
import { useLanguage } from "../../contexts/LanguageContext";

interface ArtifactTypeCardProps {
  type: ArtifactType;
  onClick: (type: ArtifactType) => void;
}

export default function ArtifactTypeCard({
  type,
  onClick,
}: ArtifactTypeCardProps) {
  const config = ARTIFACT_CONFIGS[type];
  const { t } = useLanguage();

  return (
    <Card
      className="cursor-pointer transition-all hover:border-indigo-300 hover:shadow-md dark:hover:border-indigo-600"
      onClick={() => onClick(type)}
    >
      <div className="flex flex-col items-center text-center">
        <span className="text-3xl">{config.emoji}</span>
        <h4 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          {t(config.labelKey)}
        </h4>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t(config.descriptionKey)}</p>
      </div>
    </Card>
  );
}
