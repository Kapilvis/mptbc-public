import { employeeUrls } from "./employee-details/urls";

const baseUrl = "/hrms";
export const hrmsUrls = {
  dashboard: `${baseUrl}/dashboard`,
  employeeDetails: employeeUrls(baseUrl),
};
