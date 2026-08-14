import { Route, Routes } from "react-router-dom";
import Profile from "../../anonymous/pages/Profile";

import { RouteGuard } from "../components/RouteGuard";

import Home from "./home/Home";
import Master from "./master";
import Printing from "./printing";
import UserManagement from "./user-management";
import HRMS from "./hrms";
import Reports from "./reports";
import Distribution from "./distribution";

export default function Features() {
  return (
    <Routes>
      <Route element={<RouteGuard />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="user-management/*" element={<UserManagement />} />
        <Route path="master/*" element={<Master />} />
        <Route path="printing/*" element={<Printing />} />
        <Route path="hrms/*" element={<HRMS />} />
        <Route path="reports/*" element={<Reports />} />
        <Route path="distribution/*" element={<Distribution />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
