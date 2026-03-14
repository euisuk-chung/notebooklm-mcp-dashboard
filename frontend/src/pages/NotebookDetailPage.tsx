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
import { useLanguage } from "../contexts/LanguageContext";

export default function NotebookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: notebook, isLoading, isError } = useNotebook(id ?? "");
  const { t } = useLanguage();

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
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("detail.loadError")}
          </p>
          <Button
            variant="ghost"
            className="mt-4"
            onClick={() => navigate("/")}
          >
            {t("detail.backToList")}
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
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("detail.back")}
        </button>

        {/* Notebook info */}
        <Card>
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h1 className="truncate text-xl font-bold text-gray-900 dark:text-gray-100">
                  {notebook.title}
                </h1>
                <a
                  href={`https://notebooklm.google.com/notebook/${notebook.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:border-indigo-300 hover:text-indigo-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-indigo-600 dark:hover:text-indigo-400"
                  title={t("detail.openNotebookLM")}
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  NotebookLM
                </a>
              </div>
              {notebook.description && (
                <div className="prose prose-sm prose-gray mt-3 max-w-none dark:prose-invert">
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
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t("detail.sources", { count: notebook.sources.length })}
            </h3>
            {notebook.sources.length > 0 ? (
              <ul className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
                {notebook.sources.map((source) => (
                  <li
                    key={source.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      <SourceIcon type={source.type} />
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {source.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {source.type}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">
                {t("detail.noSources")}
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
    pdf: "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400",
    url: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
    text: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    youtube: "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400",
    doc: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400",
  };
  const classes = iconMap[type.toLowerCase()] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded text-xs font-bold uppercase ${classes}`}
    >
      {type.charAt(0)}
    </span>
  );
}
