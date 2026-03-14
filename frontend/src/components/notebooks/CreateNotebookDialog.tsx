import { useState, useEffect, useRef } from "react";
import Button from "../ui/Button";
import { useCreateNotebook } from "../../hooks/useNotebooks";
import { useLanguage } from "../../contexts/LanguageContext";

interface CreateNotebookDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateNotebookDialog({ open, onClose }: CreateNotebookDialogProps) {
  const [title, setTitle] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mutation = useCreateNotebook();
  const { t } = useLanguage();

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      setTimeout(() => inputRef.current?.focus(), 0);
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setTitle("");
      mutation.reset();
    }
  }, [open]);

  const handleCreate = () => {
    if (!title.trim()) return;
    mutation.mutate(title.trim(), {
      onSuccess: () => {
        setTitle("");
        onClose();
      },
    });
  };

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-50 m-auto w-full max-w-md rounded-xl border border-gray-200 bg-white p-0 shadow-xl backdrop:bg-black/40 dark:border-gray-700 dark:bg-gray-900"
      onClose={onClose}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t("create.title")}</h3>
        <div className="mt-4">
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("create.placeholder")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
        </div>
        {mutation.isError && (
          <p className="mt-2 text-xs text-red-600">{t("create.error")}</p>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>
            {t("create.cancel")}
          </Button>
          <Button onClick={handleCreate} loading={mutation.isPending} disabled={!title.trim()}>
            {t("create.submit")}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
