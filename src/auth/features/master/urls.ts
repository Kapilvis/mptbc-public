import { designationTypeUrls } from "./designation-type/urls";
import { designationUrls } from "./designation/urls";
import { districtUrls } from "./district/urls";
import { divisionUrls } from "./division/urls";
import { officeLevelUrls } from "./office-level/urls";
import { officeTypeUrls } from "./office-type/urls";
import { officeUrls } from "./office/urls";
import { projectUrls } from "./project/urls";
import { qualificationSubjectUrls } from "./qualification-subject/urls";
import { qualificationTypeUrls } from "./qualification-type/urls";
import { qualificationUrls } from "./qualification/urls";
import { sectorUrls } from "./sector/urls";
import { stateUrls } from "./state/urls";

const baseUrl = "/master";
export const masterUrls = {
  office: officeUrls(baseUrl),
  officeLevel: officeLevelUrls(baseUrl),
  officeType: officeTypeUrls(baseUrl),
  state: stateUrls(baseUrl),
  division: divisionUrls(baseUrl),
  district: districtUrls(baseUrl),
  project: projectUrls(baseUrl),
  sector: sectorUrls(baseUrl),
  designation: designationUrls(baseUrl),
  designationType: designationTypeUrls(baseUrl),
  qualificationType: qualificationTypeUrls(baseUrl),
  qualification: qualificationUrls(baseUrl),
  qualificationSubject: qualificationSubjectUrls(baseUrl),
};
