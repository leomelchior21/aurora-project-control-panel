import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LandingPage } from "../../pages/LandingPage";
import { CityPage } from "../../pages/CityPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/city/:slug" element={<CityPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
