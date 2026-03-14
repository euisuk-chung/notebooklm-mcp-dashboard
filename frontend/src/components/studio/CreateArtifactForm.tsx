import { useState } from "react";
import type { ArtifactType } from "../../types/studio";
import { ARTIFACT_OPTIONS } from "../../types/studio";
import { ARTIFACT_CONFIGS } from "../../utils/constants";
import Button from "../ui/Button";
import Card from "../ui/Card";

interface CreateArtifactFormProps {
  type: ArtifactType;
  onSubmit: (options: Record<string, unknown>) => void;
  onCancel: () => void;
  isCreating: boolean;
}

const OPTION_LABELS: Record<string, string> = {
  formats: "포맷",
  styles: "스타일",
  voice_count: "음성 수",
  resolution: "해상도",
  length: "길이",
  question_types: "문제 유형",
  difficulty: "난이도",
  question_count: "문제 수",
  card_count: "카드 수",
  depth: "깊이",
  slide_count: "슬라이드 수",
  orientation: "방향",
};

export default function CreateArtifactForm({
  type,
  onSubmit,
  onCancel,
  isCreating,
}: CreateArtifactFormProps) {
  const config = ARTIFACT_CONFIGS[type];
  const options = ARTIFACT_OPTIONS[type] as Record<string, unknown[]>;
  const optionKeys = Object.keys(options);

  const [selected, setSelected] = useState<Record<string, unknown>>(() => {
    const defaults: Record<string, unknown> = {};
    for (const key of optionKeys) {
      const values = options[key];
      if (values.length > 0) {
        defaults[key] = values[0];
      }
    }
    return defaults;
  });

  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{config.emoji}</span>
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {config.label} 생성
          </h3>
          <p className="text-xs text-gray-500">{config.description}</p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {optionKeys.map((key) => {
          const values = options[key] as (string | number)[];
          return (
            <div key={key}>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {OPTION_LABELS[key] ?? key}
              </label>
              <select
                value={String(selected[key] ?? "")}
                onChange={(e) => {
                  const raw = e.target.value;
                  const parsed =
                    typeof values[0] === "number" ? Number(raw) : raw;
                  setSelected((prev) => ({ ...prev, [key]: parsed }));
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {values.map((v) => (
                  <option key={String(v)} value={String(v)}>
                    {String(v)}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onCancel} disabled={isCreating}>
          취소
        </Button>
        <Button onClick={() => onSubmit(selected)} loading={isCreating}>
          생성하기
        </Button>
      </div>
    </Card>
  );
}
