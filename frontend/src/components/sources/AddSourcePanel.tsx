import { useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useAddSourceUrl, useAddSourceText, useAddSourceYoutube, useStartResearch, useImportResearch, useAddSourceBatchUrl, useRunPipeline } from "../../hooks/useSources";

type Tab = "url" | "text" | "youtube" | "research" | "pipeline";

interface AddSourcePanelProps {
  notebookId: string;
}

export default function AddSourcePanel({ notebookId }: AddSourcePanelProps) {
  const [tab, setTab] = useState<Tab>("url");
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-indigo-400 hover:text-indigo-600"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        소스 추가 / 웹 리서치
      </button>
    );
  }

  const tabs: { key: Tab; label: string; emoji: string }[] = [
    { key: "url", label: "URL", emoji: "🔗" },
    { key: "youtube", label: "YouTube", emoji: "▶️" },
    { key: "text", label: "텍스트", emoji: "📝" },
    { key: "research", label: "웹 리서치", emoji: "🔍" },
    { key: "pipeline", label: "파이프라인", emoji: "⚡" },
  ] as const;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
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
        placeholder="URL을 입력하세요 (여러 개는 줄바꿈으로 구분)"
        rows={3}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {isPending
            ? `${urlCount}개 URL 추가 중...`
            : "URL을 입력하면 자동으로 내용을 분석합니다"}
        </p>
        <Button onClick={handleSubmit} loading={isPending} size="sm">
          추가
        </Button>
      </div>
      {isSuccess && <p className="text-xs text-green-600">소스가 추가되었습니다</p>}
      {isError && <p className="text-xs text-red-600">추가 실패. URL을 확인해주세요.</p>}
    </div>
  );
}

function YoutubeForm({ notebookId }: { notebookId: string }) {
  const [url, setUrl] = useState("");
  const mutation = useAddSourceYoutube(notebookId);

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
        placeholder="https://www.youtube.com/watch?v=..."
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">YouTube 영상의 자막을 소스로 추가합니다</p>
        <Button onClick={handleSubmit} loading={mutation.isPending} size="sm">
          추가
        </Button>
      </div>
      {mutation.isSuccess && <p className="text-xs text-green-600">소스가 추가되었습니다</p>}
      {mutation.isError && <p className="text-xs text-red-600">추가 실패. YouTube URL을 확인해주세요.</p>}
    </div>
  );
}

function TextForm({ notebookId }: { notebookId: string }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const mutation = useAddSourceText(notebookId);

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
        placeholder="소스 제목 (선택)"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="텍스트 내용을 입력하세요..."
        rows={4}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
      <div className="flex justify-end">
        <Button onClick={handleSubmit} loading={mutation.isPending} size="sm">
          추가
        </Button>
      </div>
      {mutation.isSuccess && <p className="text-xs text-green-600">소스가 추가되었습니다</p>}
      {mutation.isError && <p className="text-xs text-red-600">추가 실패</p>}
    </div>
  );
}

function ResearchForm({ notebookId }: { notebookId: string }) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("fast");
  const [source, setSource] = useState("web");
  const startMutation = useStartResearch(notebookId);
  const importMutation = useImportResearch(notebookId);

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
        placeholder="검색할 주제를 입력하세요..."
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        onKeyDown={(e) => e.key === "Enter" && handleStart()}
      />
      <div className="flex gap-2">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
        >
          <option value="fast">빠른 검색 (~30초, ~10개)</option>
          <option value="deep">심층 검색 (~5분, ~40개)</option>
        </select>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
        >
          <option value="web">웹 검색</option>
          <option value="drive">Google Drive</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleStart} loading={startMutation.isPending} size="sm">
          리서치 시작
        </Button>
        <Button
          variant="ghost"
          onClick={() => importMutation.mutate()}
          loading={importMutation.isPending}
          size="sm"
        >
          결과 가져오기
        </Button>
      </div>
      {startMutation.isSuccess && (
        <p className="text-xs text-green-600">리서치가 시작되었습니다. 완료 후 "결과 가져오기"를 클릭하세요.</p>
      )}
      {importMutation.isSuccess && (
        <p className="text-xs text-green-600">리서치 결과가 소스로 추가되었습니다</p>
      )}
      {(startMutation.isError || importMutation.isError) && (
        <p className="text-xs text-red-600">오류가 발생했습니다. 다시 시도해주세요.</p>
      )}
    </div>
  );
}

function PipelineForm({ notebookId }: { notebookId: string }) {
  const [url, setUrl] = useState("");
  const [pipeline, setPipeline] = useState("ingest-and-podcast");
  const mutation = useRunPipeline(notebookId);

  const handleSubmit = () => {
    if (!url.trim()) return;
    mutation.mutate({ url: url.trim(), pipeline }, { onSuccess: () => setUrl("") });
  };

  const pipelineOptions = [
    { value: "ingest-and-podcast", label: "URL → 팟캐스트" },
    { value: "research-and-report", label: "리서치 → 리포트" },
    { value: "multi-format", label: "전체 콘텐츠" },
  ];

  return (
    <div className="space-y-3">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/article"
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <select
        value={pipeline}
        onChange={(e) => setPipeline(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700"
      >
        {pipelineOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">URL 입력부터 콘텐츠 생성까지 한 번에 실행합니다</p>
        <Button onClick={handleSubmit} loading={mutation.isPending} size="sm">
          실행
        </Button>
      </div>
      {mutation.isPending && <p className="text-xs text-indigo-600">파이프라인 실행 중...</p>}
      {mutation.isSuccess && <p className="text-xs text-green-600">파이프라인이 시작되었습니다</p>}
      {mutation.isError && <p className="text-xs text-red-600">파이프라인 실행 실패. URL을 확인해주세요.</p>}
    </div>
  );
}
