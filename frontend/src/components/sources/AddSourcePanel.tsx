import { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useAddSourceUrl, useAddSourceText, useAddSourceYoutube, useStartResearch, useImportResearch, useAddSourceBatchUrl, useRunPipeline } from "../../hooks/useSources";
import { useLanguage } from "../../contexts/LanguageContext";

type Tab = "url" | "text" | "youtube" | "research" | "pipeline";

interface AddSourcePanelProps {
  notebookId: string;
}

export default function AddSourcePanel({ notebookId }: AddSourcePanelProps) {
  const [tab, setTab] = useState<Tab>("url");
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-indigo-400 hover:text-indigo-600 dark:border-gray-600 dark:text-gray-400 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        {t("source.addTitle")}
      </button>
    );
  }

  const tabs: { key: Tab; labelKey: string; emoji: string }[] = [
    { key: "url", labelKey: "source.url", emoji: "\uD83D\uDD17" },
    { key: "youtube", labelKey: "source.youtube", emoji: "\u25B6\uFE0F" },
    { key: "text", labelKey: "source.text", emoji: "\uD83D\uDCDD" },
    { key: "research", labelKey: "source.research", emoji: "\uD83D\uDD0D" },
    { key: "pipeline", labelKey: "source.pipeline", emoji: "\u26A1" },
  ] as const;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {tabs.map((tabItem) => (
            <button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === tabItem.key
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tabItem.emoji} {t(tabItem.labelKey)}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="mt-4">
        {tab === "url" && <UrlForm notebookId={notebookId} />}
        {tab === "youtube" && <YoutubeForm notebookId={notebookId} />}
        {tab === "text" && <TextForm notebookId={notebookId} />}
        {tab === "research" && <ResearchForm notebookId={notebookId} />}
        {tab === "pipeline" && <PipelineForm notebookId={notebookId} />}
      </div>
    </Card>
  );
}

function UrlForm({ notebookId }: { notebookId: string }) {
  const [urls, setUrls] = useState("");
  const singleMutation = useAddSourceUrl(notebookId);
  const batchMutation = useAddSourceBatchUrl(notebookId);
  const { t } = useLanguage();

  const handleSubmit = () => {
    const lines = urls.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    if (lines.length === 1) {
      singleMutation.mutate(lines[0], { onSuccess: () => setUrls("") });
    } else {
      batchMutation.mutate(lines, { onSuccess: () => setUrls("") });
    }
  };

  const isPending = singleMutation.isPending || batchMutation.isPending;
  const isSuccess = singleMutation.isSuccess || batchMutation.isSuccess;
  const isError = singleMutation.isError || batchMutation.isError;
  const urlCount = urls.split("\n").map((l) => l.trim()).filter(Boolean).length;

  return (
    <div className="space-y-3">
      <textarea
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
        placeholder={t("source.urlPlaceholder")}
        rows={3}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {isPending
            ? t("source.urlAdding", { count: urlCount })
            : t("source.urlHint")}
        </p>
        <Button onClick={handleSubmit} loading={isPending} size="sm">
          {t("source.add")}
        </Button>
      </div>
      {isSuccess && <p className="text-xs text-green-600">{t("source.added")}</p>}
      {isError && <p className="text-xs text-red-600">{t("source.addFailed")}</p>}
    </div>
  );
}

function YoutubeForm({ notebookId }: { notebookId: string }) {
  const [url, setUrl] = useState("");
  const mutation = useAddSourceYoutube(notebookId);
  const { t } = useLanguage();

  const handleSubmit = () => {
    if (!url.trim()) return;
    mutation.mutate(url.trim(), { onSuccess: () => setUrl("") });
  };

  return (
    <div className="space-y-3">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={t("source.ytPlaceholder")}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 dark:text-gray-500">{t("source.ytHint")}</p>
        <Button onClick={handleSubmit} loading={mutation.isPending} size="sm">
          {t("source.add")}
        </Button>
      </div>
      {mutation.isSuccess && <p className="text-xs text-green-600">{t("source.added")}</p>}
      {mutation.isError && <p className="text-xs text-red-600">{t("source.ytFailed")}</p>}
    </div>
  );
}

function TextForm({ notebookId }: { notebookId: string }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const mutation = useAddSourceText(notebookId);
  const { t } = useLanguage();

  const handleSubmit = () => {
    if (!text.trim()) return;
    mutation.mutate({ text: text.trim(), title: title.trim() }, {
      onSuccess: () => { setTitle(""); setText(""); },
    });
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t("source.textTitle")}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("source.textPlaceholder")}
        rows={4}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
      />
      <div className="flex justify-end">
        <Button onClick={handleSubmit} loading={mutation.isPending} size="sm">
          {t("source.add")}
        </Button>
      </div>
      {mutation.isSuccess && <p className="text-xs text-green-600">{t("source.added")}</p>}
      {mutation.isError && <p className="text-xs text-red-600">{t("source.textFailed")}</p>}
    </div>
  );
}

function ResearchForm({ notebookId }: { notebookId: string }) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("fast");
  const [source, setSource] = useState("web");
  const startMutation = useStartResearch(notebookId);
  const importMutation = useImportResearch(notebookId);
  const { t } = useLanguage();

  const handleStart = () => {
    if (!query.trim()) return;
    startMutation.mutate({ query: query.trim(), mode, source });
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("source.researchPlaceholder")}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
        onKeyDown={(e) => e.key === "Enter" && handleStart()}
      />
      <div className="flex gap-2">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="fast">{t("source.researchFast")}</option>
          <option value="deep">{t("source.researchDeep")}</option>
        </select>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="web">{t("source.researchWeb")}</option>
          <option value="drive">{t("source.researchDrive")}</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleStart} loading={startMutation.isPending} size="sm">
          {t("source.researchStart")}
        </Button>
        <Button
          variant="ghost"
          onClick={() => importMutation.mutate()}
          loading={importMutation.isPending}
          size="sm"
        >
          {t("source.researchImport")}
        </Button>
      </div>
      {startMutation.isSuccess && (
        <p className="text-xs text-green-600">{t("source.researchStarted")}</p>
      )}
      {importMutation.isSuccess && (
        <p className="text-xs text-green-600">{t("source.researchImported")}</p>
      )}
      {(startMutation.isError || importMutation.isError) && (
        <p className="text-xs text-red-600">{t("source.researchError")}</p>
      )}
    </div>
  );
}

function PipelineForm({ notebookId }: { notebookId: string }) {
  const [url, setUrl] = useState("");
  const [pipeline, setPipeline] = useState("ingest-and-podcast");
  const mutation = useRunPipeline(notebookId);
  const { t } = useLanguage();

  const handleSubmit = () => {
    if (!url.trim()) return;
    mutation.mutate({ url: url.trim(), pipeline }, { onSuccess: () => setUrl("") });
  };

  const pipelineOptions = [
    { value: "ingest-and-podcast", labelKey: "source.pipelineUrl2Podcast" },
    { value: "research-and-report", labelKey: "source.pipelineResearch2Report" },
    { value: "multi-format", labelKey: "source.pipelineMulti" },
  ];

  return (
    <div className="space-y-3">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/article"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <select
        value={pipeline}
        onChange={(e) => setPipeline(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
      >
        {pipelineOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
        ))}
      </select>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 dark:text-gray-500">{t("source.pipelineHint")}</p>
        <Button onClick={handleSubmit} loading={mutation.isPending} size="sm">
          {t("source.pipelineRun")}
        </Button>
      </div>
      {mutation.isPending && <p className="text-xs text-indigo-600 dark:text-indigo-400">{t("source.pipelineRunning")}</p>}
      {mutation.isSuccess && <p className="text-xs text-green-600">{t("source.pipelineStarted")}</p>}
      {mutation.isError && <p className="text-xs text-red-600">{t("source.pipelineFailed")}</p>}
    </div>
  );
}
