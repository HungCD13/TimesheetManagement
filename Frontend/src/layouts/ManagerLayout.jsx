import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  HiHome, 
  HiUserGroup, 
  HiCalendar, 
  HiBell, 
  HiCog, 
  HiChevronLeft, 
  HiChevronRight,
  HiMenu,
  HiX
} from "react-icons/hi";
import { 
  FaClipboardCheck, 
  FaExchangeAlt, 
  FaUserClock 
} from "react-icons/fa";

export default function ManagerLayout() {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false);
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setMobileMenuOpen(false);
  }, [location, isMobile]);

  const menuItems = [
    { to: ".", label: "Tổng quan", icon: <HiHome className="w-5 h-5" /> },
    { to: "attendance", label: "Chấm công", icon: <FaClipboardCheck className="w-5 h-5" /> },
    { to: "shift-requests", label: "Yêu cầu ca", icon: <FaExchangeAlt className="w-5 h-5" /> },
    { to: "alerts", label: "Thông báo", icon: <HiBell className="w-5 h-5" /> },
    { to: "team", label: "Đội nhóm", icon: <HiUserGroup className="w-5 h-5" /> },
    { to: "schedule", label: "Lịch làm việc", icon: <HiCalendar className="w-5 h-5" /> },
    { to: "time-off", label: "Nghỉ phép", icon: <FaUserClock className="w-5 h-5" /> },
    { to: "settings", label: "Cài đặt", icon: <HiCog className="w-5 h-5" /> },
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const isActive = (path) => {
    if (path === ".") return location.pathname === "/manager";
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 bg-white shadow-md md:px-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleSidebar}
            className="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100 hover:text-blue-600"
          >
            {isMobile ? (
              mobileMenuOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />
            ) : (
              sidebarCollapsed ? <HiChevronRight className="w-5 h-5" /> : <HiChevronLeft className="w-5 h-5" />
            )}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg">
              <span className="text-sm font-bold">M</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 md:text-xl">Quản lý</h1>
              <p className="text-xs text-gray-500">Manager Dashboard</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 transition-colors rounded-lg hover:bg-gray-100 group">
            <HiBell className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
              5
            </span>
          </button>
          
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium text-gray-800">Nguyễn Văn Quản lý</p>
              <p className="text-xs text-gray-500">Manager</p>
            </div>
            <div className="relative">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                M
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed top-16 left-0 bottom-0 z-40 
          bg-gradient-to-b from-gray-900 to-gray-800 text-white 
          transition-all duration-300 shadow-xl
          flex flex-col
          ${isMobile ? (
            mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full'
          ) : sidebarCollapsed ? 'w-20' : 'w-64'}
        `}>
          {/* Sidebar Header */}
          <div className="p-5 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg">
                <span className="text-lg font-bold">MGR</span>
              </div>
              {(!sidebarCollapsed || isMobile) && (
                <div>
                  <h2 className="font-bold text-white">Manager Panel</h2>
                  <p className="text-xs text-gray-300">Quyền quản lý</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg 
                  transition-all duration-200
                  ${isActive(item.to) 
                    ? 'bg-gradient-to-r from-blue-600/90 to-cyan-500/90 text-white shadow-md' 
                    : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }
                  ${sidebarCollapsed && !isMobile ? 'justify-center px-3' : ''}
                `}
              >
                <div className={`${isActive(item.to) ? 'text-white' : 'text-gray-400'}`}>
                  {item.icon}
                </div>
                {(!sidebarCollapsed || isMobile) && (
                  <span className="font-medium">{item.label}</span>
                )}
                {isActive(item.to) && !sidebarCollapsed && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            ))}
          </nav>
          
          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700">
            {(!sidebarCollapsed || isMobile) && (
              <div className="p-3 bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-300">Bạn có 5 yêu cầu đang chờ</p>
                <button className="w-full px-4 py-2 mt-3 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
                  Xem tất cả
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isMobile && mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`
          flex-1 min-h-[calc(100vh-4rem)] p-4 md:p-6
          transition-all duration-300
          ${isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-20' : 'ml-64'}
        `}>
          {/* Page Title & Stats */}
          <div className="mb-6">
            <div className="flex flex-col justify-between md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {menuItems.find(item => isActive(item.to))?.label || "Tổng quan"}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <span className="text-gray-500">Trang chủ</span>
                  <span>›</span>
                  <span className="font-medium text-blue-600">
                    {menuItems.find(item => isActive(item.to))?.label || "Tổng quan"}
                  </span>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex gap-3 mt-4 md:mt-0">
                <div className="px-4 py-2 bg-white rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Nhân viên online</p>
                  <p className="text-lg font-bold text-green-600">12/24</p>
                </div>
                <div className="px-4 py-2 bg-white rounded-lg shadow-sm">
                  <p className="text-sm text-gray-500">Yêu cầu chờ</p>
                  <p className="text-lg font-bold text-amber-600">5</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <Outlet />
          </div>
          
          {/* Footer */}
          <footer className="mt-6 pt-4 text-center text-gray-500">
            <p className="text-sm">
              © {new Date().getFullYear()} Manager Dashboard v1.2 • 
              <span className="mx-2">|</span>
              <span className="text-blue-600">Quyền truy cập: Quản lý</span>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}