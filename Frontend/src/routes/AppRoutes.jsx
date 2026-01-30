import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

import Login from "../pages/Login";
import Register from "../pages/Register";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import UserLayout from "../layouts/UserLayout";

// Admin pages
import AdminDashboard from "../pages/admin/Dashboard";
import AdminAttendance from "../pages/admin/Attendance";
import AdminAssignments from "../pages/admin/Assignments";
import AdminShiftRequests from "../pages/admin/ShiftRequests";
import AdminAlerts from "../pages/admin/Alerts";
import AdminShifts from "../pages/admin/Shifts";

// Manager pages
import ManagerDashboard from "../pages/manager/Dashboard";
import ManagerAttendance from "../pages/manager/Attendance";
import ManagerShiftRequests from "../pages/manager/ShiftRequests";
import ManagerAlerts from "../pages/manager/Alerts";

// User pages
import UserDashboard from "../pages/user/Dashboard";
import UserAttendance from "../pages/user/Attendance";
import UserAssignments from "../pages/user/Assignments";
import UserShiftRequest from "../pages/user/ShiftRequest";
import UserAlerts from "../pages/user/Alerts";

export default function AppRoutes() {
  const user = useAuthStore((s) => s.user);

  // 🔒 Chưa login → chỉ được login / register
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // 👑 ADMIN
  if (user.role === "admin") {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="assignments" element={<AdminAssignments />} />
          <Route path="shift-requests" element={<AdminShiftRequests />} />
          <Route path="alerts" element={<AdminAlerts />} />
          <Route path="shifts" element={<AdminShifts />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    );
  }

  // 🧑‍💼 MANAGER
  if (user.role === "manager") {
    return (
      <Routes>
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="attendance" element={<ManagerAttendance />} />
          <Route path="shift-requests" element={<ManagerShiftRequests />} />
          <Route path="alerts" element={<ManagerAlerts />} />
        </Route>

        <Route path="*" element={<Navigate to="/manager" />} />
      </Routes>
    );
  }

  // 👤 USER / EMPLOYEE
  return (
    <Routes>
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<UserDashboard />} />
        <Route path="attendance" element={<UserAttendance />} />
        <Route path="assignments" element={<UserAssignments />} />
        <Route path="shift-request" element={<UserShiftRequest />} />
        <Route path="alerts" element={<UserAlerts />} />
      </Route>

      <Route path="*" element={<Navigate to="/user" />} />
    </Routes>
  );
}