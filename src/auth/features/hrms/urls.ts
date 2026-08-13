import { employeeUrls } from "./employee-details/urls";

const baseUrl = "/hrms";
export const hrmsUrls = {
  employeeDetails: employeeUrls(baseUrl),
};
