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
import PaperModule from "./paper";
import BookPaperRequirement from "auth/features/book-paper-requirement";
import DistrictDepot from "./district-depot";
<<<<<<< HEAD
import Transportation from "./transportation";
=======
import CentralDepot from "./inventory";
>>>>>>> c9a9facc745c407afc00e66458be47eb7c5bee12

import MockModulePage from "../components/MockModulePage";
import UnauthorizedPage from "../components/UnauthorizedPage";

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
        <Route path="paper/*" element={<PaperModule />} />
        <Route
          path="book-paper-requirement/*"
          element={<BookPaperRequirement />}
        />
        <Route path="district-depot/*" element={<DistrictDepot />} />
        <Route path="transport/*" element={<Transportation />} />
        <Route path="inventory/*" element={<CentralDepot />} />
        <Route path="profile" element={<Profile />} />

        {/* Mock Module Routes */}
        <Route path="assigned-demand" element={<MockModulePage />} />
        <Route path="tender" element={<MockModulePage />} />
        <Route path="paper-receiving" element={<MockModulePage />} />
        <Route path="title-master" element={<MockModulePage />} />
        <Route path="gsm-master" element={<MockModulePage />} />
        <Route path="supply-section" element={<MockModulePage />} />
        <Route path="payment" element={<MockModulePage />} />
        <Route path="paper-supply" element={<MockModulePage />} />
        <Route path="paper-orders" element={<MockModulePage />} />
        <Route path="demand" element={<MockModulePage />} />
        <Route path="allocation" element={<MockModulePage />} />
        <Route path="distribution-page" element={<MockModulePage />} />
        <Route path="dispatch" element={<MockModulePage />} />
        <Route path="distribution-tracking" element={<MockModulePage />} />

        {/* Access Denied Route */}
        <Route path="unauthorized" element={<UnauthorizedPage />} />
      </Route>
    </Routes>
  );
}
