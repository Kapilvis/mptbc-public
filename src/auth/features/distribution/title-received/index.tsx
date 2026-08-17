import { Route, Routes } from "react-router-dom";
import TitleReceivedList from "./pages/TitleReceivedList";

export default function TitleReceived() {
  return (
    <Routes>
      <Route index element={<TitleReceivedList />} />
    </Routes>
  );
}
