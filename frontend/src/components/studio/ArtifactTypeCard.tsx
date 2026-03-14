import Card from "../ui/Card";
import type { ArtifactType } from "../../types/studio";
import { ARTIFACT_CONFIGS } from "../../utils/constants";

interface ArtifactTypeCardProps {
  type: ArtifactType;
  onClick: (type: ArtifactType) => void;
}

export default function ArtifactTypeCard({
  type,
  onClick,
}: ArtifactTypeCardProps) {
  const config = ARTIFACT_CONFIGS[type];

  return (
    <Card
      className="cursor-pointer transition-all hover:border-indigo-300 hover:shadow-md"
      onClick={() => onClick(type)}
    >
      <div className="flex flex-col items-center text-center">
        <span className="text-3xl">{config.emoji}</span>
        <h4 className="mt-2 text-sm font-semibold text-gray-900">
          {config.label}
        </h4>
        <p className="mt-1 text-xs text-gray-500">{config.description}</p>
      </div>
    </Card>
  );
}
