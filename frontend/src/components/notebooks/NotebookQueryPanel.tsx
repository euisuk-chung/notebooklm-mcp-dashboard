import { useState } from "react";
import Markdown from "react-markdown";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { useQueryNotebook } from "../../hooks/useNotebooks";

interface NotebookQueryPanelProps {
  notebookId: string;
}

interface QAPair {
  question: string;
  answer: string;
}

export default function NotebookQueryPanel({ notebookId }: NotebookQueryPanelProps) {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<QAPair[]>([]);
  const mutation = useQueryNotebook(notebookId);

  const handleAsk = () => {
    if (!question.trim()) return;
    const q = question.trim();
    setQuestion("");
    mutation.mutate(q, {
      onSuccess: (data) => {
        setHistory((prev) => [...prev, { question: q, answer: data.answer }]);
      },
    });
  };

  return (
    <Card>
      <h3 className="text-sm font-semibold text-gray-700">노트북 질문하기</h3>
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="질문을 입력하세요..."
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
        />
        <Button onClick={handleAsk} loading={mutation.isPending} size="sm">
          질문하기
        </Button>
      </div>

      {mutation.isError && (
        <p className="mt-2 text-xs text-red-600">질문 처리 중 오류가 발생했습니다.</p>
      )}

      {mutation.isPending && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <Spinner size="sm" />
          <span>답변 생성 중...</span>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-4 space-y-4">
          {history.map((qa, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-xl rounded-tr-sm bg-indigo-600 px-4 py-2 text-sm text-white">
                  {qa.question}
                </div>
              </div>
              <div className="flex justify-start">
                <div className="prose prose-sm prose-gray max-w-[80%] rounded-xl rounded-tl-sm bg-gray-100 px-4 py-2">
                  <Markdown>{qa.answer}</Markdown>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
