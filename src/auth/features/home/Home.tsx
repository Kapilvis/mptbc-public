import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../AuthProvider";
import { getRoleDashboardRoute } from "../../authConfig";

const Home: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || localStorage.getItem("role") || "";
  return <Navigate to={getRoleDashboardRoute(role)} replace />;
};

export default Home;
