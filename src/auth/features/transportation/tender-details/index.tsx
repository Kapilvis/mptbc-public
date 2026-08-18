import { Route, Routes } from "react-router-dom";
import TenderDetailsPage from "./pages/TenderDetailsPage";

export default function TenderDetailsModule() {
  return (
    <Routes>
      <Route index element={<TenderDetailsPage />} />
    </Routes>
  );
}
