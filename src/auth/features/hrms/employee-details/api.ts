import { mockEmployees } from "./data";

const employees = [...mockEmployees];

export async function getEmployees(): Promise<HRMS.EmployeeRegistration[]> {
  return [...employees];
}

export async function getEmployeeById(
  employeeId: number,
): Promise<HRMS.EmployeeRegistration> {
  const item = employees.find((e) => e.employeeId === Number(employeeId));
  if (!item) throw new Error("Employee not found");
  return { ...item };
}

export async function createEmployee(
  data: Omit<HRMS.EmployeeRegistration, "employeeId" | "fullName">,
) {
  const nextId =
    employees.length > 0
      ? Math.max(...employees.map((e) => e.employeeId)) + 1
      : 1;
  const firstName = data.firstName || "";
  const middleName = data.middleName || "";
  const lastName = data.lastName || "";
  const fullName = [firstName, middleName, lastName]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" ");

  const newItem: HRMS.EmployeeRegistration = {
    ...data,
    employeeId: nextId,
    fullName,
  };
  employees.push(newItem);
  return newItem;
}

export async function updateEmployee(
  employeeId: number,
  data: HRMS.EmployeeRegistration,
): Promise<HRMS.EmployeeRegistration | undefined> {
  const index = employees.findIndex((e) => e.employeeId === Number(employeeId));
  if (index !== -1) {
    const firstName = data.firstName || "";
    const middleName = data.middleName || "";
    const lastName = data.lastName || "";
    const fullName = [firstName, middleName, lastName]
      .map((s) => s.trim())
      .filter(Boolean)
      .join(" ");

    const updatedItem = {
      ...employees[index],
      ...data,
      fullName,
    };
    employees[index] = updatedItem;
    return updatedItem;
  }
  return undefined;
}

export async function deleteEmployee(employeeId: number): Promise<boolean> {
  const index = employees.findIndex((e) => e.employeeId === Number(employeeId));
  if (index !== -1) {
    employees.splice(index, 1);
    return true;
  }
  return false;
}

export async function patchEmployeeStatus(
  employeeId: number,
): Promise<boolean> {
  const index = employees.findIndex((e) => e.employeeId === Number(employeeId));
  if (index !== -1) {
    employees[index].employmentStatus =
      employees[index].employmentStatus === "Active" ? "Inactive" : "Active";
    return true;
  }
  return false;
}
