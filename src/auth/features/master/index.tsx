import { Route, Routes } from "react-router-dom";
import Designation from "./designation";
import DesignationType from "./designation-type";
import District from "./district";
import Division from "./division";
import Office from "./office";
import OfficeLevel from "./office-level";
import OfficeType from "./office-type";
import Project from "./project";
import Qualification from "./qualification";
import QualificationSubject from "./qualification-subject";
import QualificationType from "./qualification-type";
import Sector from "./sector";
import State from "./state";

export default function Master() {
  return (
    <Routes>
      {/* Office */}
      <Route path="office/*" element={<Office />} />
      <Route path="office-level/*" element={<OfficeLevel />} />
      <Route path="office-type/*" element={<OfficeType />} />

      {/* Location */}
      <Route path="state/*" element={<State />} />
      <Route path="division/*" element={<Division />} />
      <Route path="district/*" element={<District />} />
      <Route path="project/*" element={<Project />} />
      <Route path="sector/*" element={<Sector />} />

      {/* HR Management */}
      <Route path="designation/*" element={<Designation />} />
      <Route path="designation-type/*" element={<DesignationType />} />
      <Route path="qualification-type/*" element={<QualificationType />} />
      <Route path="qualification/*" element={<Qualification />} />
      <Route
        path="qualification-subject/*"
        element={<QualificationSubject />}
      />
    </Routes>
  );
}
