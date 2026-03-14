import { useParams, useNavigate } from "react-router-dom";
import Markdown from "react-markdown";
import AppShell from "../components/layout/AppShell";
import ContentStudio from "../components/studio/ContentStudio";
import AddSourcePanel from "../components/sources/AddSourcePanel";
import NotebookQueryPanel from "../components/notebooks/NotebookQueryPanel";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import { useNotebook } from "../hooks/useNotebooks";

export default function NotebookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: notebook, isLoading, isError } = useNotebook(id ?? "");

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </AppShell>
    );
  }

  if (isError || !notebook) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-sm text-gray-500">
            노트북을 불러올 수 없습니다
          </p>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => navigate("/")}
          >
            목록으로 돌아가기
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          노트북 목록
        </button>

        {/* Notebook info */}
        <Card>
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h1 className="truncate text-xl font-bold text-gray-900">
                  {notebook.title}
                </h1>
                <a
                  href={`https://notebooklm.google.com/notebook/${notebook.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-indigo-300 hover:text-indigo-600"
                  title="NotebookLM에서 열기"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  NotebookLM
                </a>
              </div>
              {notebook.description && (
                <div className="prose prose-sm prose-gray mt-3 max-w-none">
                  <Markdown>{notebook.description}</Markdown>
                </div>
              )}
            </div>
            <div className="ml-4 flex shrink-0 flex-wrap gap-1.5">
              {notebook.tags.map((tag) => (
                <Badge key={tag} label={tag} variant="tag" />
              ))}
            </div>
          </div>

          {/* Sources */}
          <div className="mt-5">
            <h3 className="text-sm font-semibold text-gray-700">
              소스 ({notebook.sources.length})
            </h3>
            {notebook.sources.length > 0 ? (
              <ul className="mt-2 divide-y divide-gray-100">
                {notebook.sources.map((source) => (
                  <li
                    key={source.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      <SourceIcon type={source.type} />
                      <span className="text-sm text-gray-800">
                        {source.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {source.type}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-400">
                소스가 없습니다
              </p>
            )}
          </div>
        </Card>

        {/* Query Panel */}
        <NotebookQueryPanel notebookId={notebook.id} />

        {/* Add Source / Research */}
        <AddSourcePanel notebookId={notebook.id} />

        {/* Content Studio */}
        <ContentStudio notebookId={notebook.id} />
      </div>
    </AppShell>
  );
}

function SourceIcon({ type }: { type: string }) {
  const iconMap: Record<string, string> = {
    pdf: "bg-red-100 text-red-600",
    url: "bg-blue-100 text-blue-600",
    text: "bg-gray-100 text-gray-600",
    youtube: "bg-rose-100 text-rose-600",
    doc: "bg-indigo-100 text-indigo-600",
  };
  const classes = iconMap[type.toLowerCase()] ?? "bg-gray-100 text-gray-600";

  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold uppercase ${classes}`}
    >
      {type.charAt(0)}
    </span>
  );
}
