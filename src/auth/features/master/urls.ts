import { bloodGroupUrls } from "./blood-group/urls";
import { casteUrls } from "./caste/urls";
import { designationTypeUrls } from "./designation-type/urls";
import { designationUrls } from "./designation/urls";
import { districtUrls } from "./district/urls";
import { divisionUrls } from "./division/urls";
import { nationalityUrls } from "./nationality/urls";
import { officeLevelUrls } from "./office-level/urls";
import { officeTypeUrls } from "./office-type/urls";
import { officeUrls } from "./office/urls";
import { projectUrls } from "./project/urls";
import { qualificationSubjectUrls } from "./qualification-subject/urls";
import { qualificationTypeUrls } from "./qualification-type/urls";
import { qualificationUrls } from "./qualification/urls";
import { religionUrls } from "./religion/urls";
import { sectorUrls } from "./sector/urls";
import { stateUrls } from "./state/urls";
import { bookTypeUrls } from "./book-type/urls";
import { classUrls } from "./class/urls";
import { mediumUrls } from "./medium/urls";
import { gsmUrls } from "./gsm/urls";
import { titleUrls } from "./title/urls";

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
  caste: casteUrls(baseUrl),
  religion: religionUrls(baseUrl),
  bloodGroup: bloodGroupUrls(baseUrl),
  nationality: nationalityUrls(baseUrl),
  designation: designationUrls(baseUrl),
  designationType: designationTypeUrls(baseUrl),
  qualificationType: qualificationTypeUrls(baseUrl),
  qualification: qualificationUrls(baseUrl),
  qualificationSubject: qualificationSubjectUrls(baseUrl),
  class: classUrls(baseUrl),
  bookType: bookTypeUrls(baseUrl),
  medium: mediumUrls(baseUrl),
  gsm: gsmUrls(baseUrl),
  title: titleUrls(baseUrl),
};
