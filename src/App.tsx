import { QueryClientProvider } from "@tanstack/react-query";
import { useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Callback from "./anonymous/pages/Callback";
import Login from "./anonymous/pages/Login";
import "./App.css";
import AuthorizedApp from "./auth"; // Uses index.tsx
import { AuthProvider } from "./auth/AuthProvider";
import { initConfig } from "./config/initConfig";

function App() {
  const { queryClient } = useMemo(() => initConfig(), []);

  return (
    <QueryClientProvider client={queryClient}>
      <>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route index element={<Login />} />
              <Route path="callback" element={<Callback />} />

              {/* Protected Routes - Authorized context starts here */}
              <Route path="/*" element={<AuthorizedApp />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </>
    </QueryClientProvider>
  );
}

export default App;
