import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ChallengePage from "./pages/ChallengePage.tsx";
import ResultsPage from "./pages/ResultsPage.tsx";
import SetupPage from "./pages/SetupPage.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/setup" replace />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/challenge" element={<ChallengePage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/setup" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
