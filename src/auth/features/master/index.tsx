import { Route, Routes } from "react-router-dom";
import BloodGroup from "./blood-group";
import Caste from "./caste";
import Designation from "./designation";
import DesignationType from "./designation-type";
import District from "./district";
import Division from "./division";
import Nationality from "./nationality";
import Office from "./office";
import OfficeLevel from "./office-level";
import OfficeType from "./office-type";
import Project from "./project";
import Qualification from "./qualification";
import QualificationSubject from "./qualification-subject";
import QualificationType from "./qualification-type";
import Religion from "./religion";
import Sector from "./sector";
import State from "./state";
import BookType from "./book-type";
import ClassMaster from "./class";
import Medium from "./medium";
import GsmMaster from "./gsm";
import TitleMaster from "./title";
import BlockMaster from "./block";
import Depot from "./depot";
import SubDepot from "./sub-depot";

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
      <Route path="block/*" element={<BlockMaster />} />
      <Route path="location/depot/*" element={<Depot />} />
      <Route path="location/sub-depot/*" element={<SubDepot />} />

      {/* HR Management */}
      <Route path="caste/*" element={<Caste />} />
      <Route path="religion/*" element={<Religion />} />
      <Route path="blood-group/*" element={<BloodGroup />} />
      <Route path="nationality/*" element={<Nationality />} />
      <Route path="designation/*" element={<Designation />} />
      <Route path="designation-type/*" element={<DesignationType />} />
      <Route path="qualification-type/*" element={<QualificationType />} />
      <Route path="qualification/*" element={<Qualification />} />
      <Route
        path="qualification-subject/*"
        element={<QualificationSubject />}
      />

      {/* Curriculum */}
      <Route path="class/*" element={<ClassMaster />} />
      <Route path="book-type/*" element={<BookType />} />
      <Route path="medium/*" element={<Medium />} />
      <Route path="gsm/*" element={<GsmMaster />} />
      <Route path="title/*" element={<TitleMaster />} />
    </Routes>
  );
}
