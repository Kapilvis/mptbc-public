import { Route, Routes } from "react-router";
import UserRole from "./role";
import RolePermissions from "./role-permissions";
import User from "./user";
import UserAssignment from "./user-assignment";

export default function UserManagement() {
  return (
    <Routes>
      <Route path="user/*" element={<User />} />
      <Route path="role/*" element={<UserRole />} />
      <Route path="role-permissions/*" element={<RolePermissions />} />
      <Route path="user-assignment/*" element={<UserAssignment />} />
    </Routes>
  );
}
