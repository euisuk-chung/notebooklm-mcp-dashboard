import { useState } from "react";
import type { ArtifactType } from "../../types/studio";
import { ARTIFACT_OPTIONS } from "../../types/studio";
import { ARTIFACT_CONFIGS } from "../../utils/constants";
import Button from "../ui/Button";
import Card from "../ui/Card";
import { useLanguage } from "../../contexts/LanguageContext";

interface CreateArtifactFormProps {
  type: ArtifactType;
  onSubmit: (options: Record<string, unknown>) => void;
  onCancel: () => void;
  isCreating: boolean;
}

export default function CreateArtifactForm({
  type,
  onSubmit,
  onCancel,
  isCreating,
}: CreateArtifactFormProps) {
  const config = ARTIFACT_CONFIGS[type];
  const options = ARTIFACT_OPTIONS[type] as Record<string, unknown[]>;
  const optionKeys = Object.keys(options);
  const { t } = useLanguage();

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
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {t("studio.generating", { label: t(config.labelKey) })}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t(config.descriptionKey)}</p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {optionKeys.map((key) => {
          const values = options[key] as (string | number)[];
          const optionLabelKey = `option.${key}`;
          return (
            <div key={key}>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t(optionLabelKey) !== optionLabelKey ? t(optionLabelKey) : key}
              </label>
              <select
                value={String(selected[key] ?? "")}
                onChange={(e) => {
                  const raw = e.target.value;
                  const parsed =
                    typeof values[0] === "number" ? Number(raw) : raw;
                  setSelected((prev) => ({ ...prev, [key]: parsed }));
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
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
          {t("studio.cancel")}
        </Button>
        <Button onClick={() => onSubmit(selected)} loading={isCreating}>
          {t("studio.create")}
        </Button>
      </div>
    </Card>
  );
}
