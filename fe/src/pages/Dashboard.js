import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>
          Xin chào, {user?.username} ({user?.role})
        </h1>
        <button onClick={handleLogout} className="btn-logout">
          Đăng xuất
        </button>
      </header>

      <div className="menu-grid">
        <Link to="/attendance" className="menu-card">
          <h3>🕒 Chấm công</h3>
          <p>Check-in / Check-out và xem lịch sử</p>
        </Link>

        <Link to="/schedule" className="menu-card">
          <h3>📅 Lịch làm việc</h3>
          <p>Xem lịch phân công của bạn</p>
        </Link>

        {(user?.role === "admin" || user?.role === "manager") && (
          <>
            <Link to="/shifts" className="menu-card admin">
              <h3>⚙️ Quản lý Ca (Admin)</h3>
              <p>Tạo và chỉnh sửa ca làm việc</p>
            </Link>
            <Link to="/assignments" className="menu-card admin">
              <h3>📋 Phân Ca (MỚI)</h3>
              <p>Gán ca làm việc cho nhân viên</p>
            </Link>
            <Link to="/payroll" className="menu-card admin">
  <h3>💰 Tính Lương (MỚI)</h3>
  <p>Xem bảng lương & chỉnh sửa mức lương</p>
</Link>
            <Link to="/alerts" className="menu-card admin">
              <h3>⚠️ Cảnh báo (Admin)</h3>
              <p>Xem nhân viên đi muộn/vắng</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
