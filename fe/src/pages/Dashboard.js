import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../css/Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Header mới với cấu trúc Navbar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <h2>HRM System</h2>
        </div>
        
        <div className="navbar-user-info">
          <div className="user-details">
            <span className="user-name">👤 {user?.username}</span>
            <span className="user-role-badge">{user?.role}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout-minimal">
            Đăng xuất
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
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
                <h3>⚙️ Quản lý Ca</h3>
                <p>Tạo và chỉnh sửa ca làm việc</p>
              </Link>
              <Link to="/assignments" className="menu-card admin">
                <h3>📋 Phân Ca</h3>
                <p>Gán ca làm việc cho nhân viên</p>
              </Link>
              <Link to="/payroll" className="menu-card admin">
                <h3>💰 Tính Lương</h3>
                <p>Xem bảng lương & chỉnh sửa</p>
              </Link>
              <Link to="/alerts" className="menu-card admin">
                <h3>⚠️ Cảnh báo</h3>
                <p>Nhân viên đi muộn/vắng</p>
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;