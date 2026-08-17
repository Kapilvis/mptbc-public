import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import List from "./pages/List";
import BidFormPage from "./pages/BidFormPage";

export default function CommercialBid() {
  const [currentTransporterId, setCurrentTransporterId] = useState(1);

  return (
    <Routes>
      <Route
        index
        element={
          <List
            currentTransporterId={currentTransporterId}
            setCurrentTransporterId={setCurrentTransporterId}
          />
        }
      />
      <Route
        path="bid/:tenderId"
        element={<BidFormPage currentTransporterId={currentTransporterId} />}
      />
    </Routes>
  );
}
