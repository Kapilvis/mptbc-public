import { Route, Routes } from "react-router-dom";
import Profile from "../../anonymous/pages/Profile";

import { RouteGuard } from "../components/RouteGuard";

import Home from "./home/Home";
import Master from "./master";
import Printing from "./printing";
import PrinterRegistration from "./printing/printer-registration";
import DepotRegistration from "./depot-registration";
import UserManagement from "./user-management";
import HRMS from "./hrms";
import Reports from "./reports";
import Distribution from "./distribution";
import BookPaperRequirement from "auth/features/book-paper-requirement";
import DistrictDepot from "./district-depot";

export default function Features() {
  return (
    <Routes>
      <Route element={<RouteGuard />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="user-management/*" element={<UserManagement />} />
        <Route path="master/*" element={<Master />} />
        <Route path="masters/*" element={<Master />} />
        <Route path="printing/*" element={<Printing />} />
        <Route
          path="mptbc/printer-registration/*"
          element={<PrinterRegistration />}
        />
        <Route
          path="mptbc/depot-registration/*"
          element={<DepotRegistration />}
        />
        <Route path="hrms/*" element={<HRMS />} />
        <Route path="reports/*" element={<Reports />} />
        <Route path="distribution/*" element={<Distribution />} />
        <Route
          path="book-paper-requirement/*"
          element={<BookPaperRequirement />}
        />
        <Route path="district-depot/*" element={<DistrictDepot />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
