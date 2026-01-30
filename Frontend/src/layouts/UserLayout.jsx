import { Link, Outlet, useLocation, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function UserLayout() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userNotifications, setUserNotifications] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { to: "attendance", label: "Chấm công", icon: "🕒", badge: null },
    { to: "assignments", label: "Công việc", icon: "📋", badge: 2 },
    { to: "shift-request", label: "Đăng ký ca", icon: "🔄", badge: null },
    { to: "alerts", label: "Thông báo", icon: "🔔", badge: userNotifications },
    { to: "profile", label: "Hồ sơ", icon: "👤", badge: null },
    { to: "calendar", label: "Lịch làm", icon: "📅", badge: null },
  ];

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header với Navigation ngang */}
      <header className="sticky top-0 z-50 bg-white shadow-lg">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 text-white bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl">
                <span className="text-lg font-bold">NV</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Nhân Viên</h1>
                <p className="text-xs text-gray-500">Employee Portal</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `
                    relative flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'text-white bg-gradient-to-r from-blue-500 to-cyan-500 shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-xs font-medium text-white bg-red-500 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* User Info & Mobile Menu Button */}
            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">Nguyễn Văn A</p>
                  <p className="text-xs text-gray-500">Nhân viên</p>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full flex items-center justify-center text-white font-bold">
                    NA
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 rounded-lg md:hidden hover:bg-gray-100"
              >
                {mobileMenuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t shadow-inner">
                {menuItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center justify-between px-4 py-3 rounded-lg
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
                
                {/* User Info Mobile */}
                <div className="px-4 py-3 mt-2 border-t">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full flex items-center justify-center text-white font-bold">
                      NA
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Nguyễn Văn A</p>
                      <p className="text-sm text-gray-500">Nhân viên</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="p-6 mb-6 overflow-hidden text-white bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Xin chào, Nguyễn Văn A! 👋</h2>
              <p className="mt-2 opacity-90">Chúc bạn một ngày làm việc hiệu quả và vui vẻ!</p>
            </div>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="text-center">
                <p className="text-3xl font-bold">08:45</p>
                <p className="text-sm opacity-90">Giờ vào</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">17:30</p>
                <p className="text-sm opacity-90">Giờ ra</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
          <div className="p-5 bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Số ngày làm việc</p>
                <p className="text-2xl font-bold text-gray-800">22</p>
              </div>
              <div className="p-3 text-blue-600 bg-blue-100 rounded-lg">📅</div>
            </div>
          </div>
          
          <div className="p-5 bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Công việc đang làm</p>
                <p className="text-2xl font-bold text-gray-800">3</p>
              </div>
              <div className="p-3 text-green-600 bg-green-100 rounded-lg">📋</div>
            </div>
          </div>
          
          <div className="p-5 bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ngày nghỉ còn lại</p>
                <p className="text-2xl font-bold text-gray-800">12</p>
              </div>
              <div className="p-3 text-amber-600 bg-amber-100 rounded-lg">🏖️</div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 bg-white rounded-2xl shadow-md">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {menuItems.find(item => isActive(item.to))?.label || "Tổng quan"}
            </h3>
            <p className="text-gray-500">
              {location.pathname.includes("attendance") && "Quản lý thời gian làm việc của bạn"}
              {location.pathname.includes("assignments") && "Công việc được giao và tiến độ"}
              {location.pathname.includes("shift-request") && "Đăng ký và thay đổi ca làm việc"}
              {location.pathname.includes("alerts") && "Thông báo và tin nhắn quan trọng"}
              {location.pathname.includes("profile") && "Thông tin cá nhân và cài đặt"}
              {!location.pathname.includes("/user/") && "Thông tin tổng quan về công việc"}
            </p>
          </div>
          
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center">
          <div className="flex flex-col items-center justify-between gap-4 p-4 text-sm text-gray-500 md:flex-row">
            <p>© {new Date().getFullYear()} Employee Portal • Phiên bản 2.0</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-600">Trợ giúp</a>
              <a href="#" className="hover:text-blue-600">Liên hệ</a>
              <a href="#" className="hover:text-blue-600">Chính sách</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}