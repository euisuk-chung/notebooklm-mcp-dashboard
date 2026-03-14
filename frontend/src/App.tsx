import { Routes, Route } from "react-router-dom";
import NotebooksPage from "./pages/NotebooksPage";
import NotebookDetailPage from "./pages/NotebookDetailPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<NotebooksPage />} />
      <Route path="/notebooks/:id" element={<NotebookDetailPage />} />
    </Routes>
  );
}
