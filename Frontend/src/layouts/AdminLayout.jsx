import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminLayout() {
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
    { to: ".", label: "Bảng điều khiển", icon: "📊" },
    { to: "attendance", label: "Chấm công", icon: "📅" },
    { to: "assignments", label: "Phân công", icon: "📋" },
    { to: "shift-requests", label: "Yêu cầu ca", icon: "🔄" },
    { to: "alerts", label: "Thông báo", icon: "🔔" },
    { to: "shifts", label: "Ca làm việc", icon: "⏰" },
    { to: "employees", label: "Nhân viên", icon: "👥" },
    { to: "settings", label: "Cài đặt", icon: "⚙️" },
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const isActive = (path) => {
    if (path === ".") return location.pathname === "/admin";
    return location.pathname.includes(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="flex items-center justify-center w-10 h-10 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isMobile ? (mobileMenuOpen ? "✕" : "☰") : (sidebarCollapsed ? "→" : "←")}
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-sm text-gray-500">Hệ thống quản lý</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <span className="text-lg">🔔</span>
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
              3
            </span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 font-bold text-white bg-blue-500 rounded-full">
              AD
            </div>
            <div className="hidden md:block">
              <p className="font-medium text-gray-800">Quản trị viên</p>
              <p className="text-sm text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed top-16 left-0 bottom-0 z-40 
          bg-gray-900 text-white 
          transition-all duration-300
          flex flex-col
          ${isMobile ? (
            mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full'
          ) : sidebarCollapsed ? 'w-20' : 'w-64'}
        `}>
          {/* Logo */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚙️</span>
              {(!sidebarCollapsed || isMobile) && (
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  ADMIN
                </span>
              )}
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg 
                  transition-colors duration-200
                  ${isActive(item.to) 
                    ? 'bg-blue-500/20 text-blue-300 border-l-4 border-blue-500' 
                    : 'text-gray-300 hover:bg-gray-800'
                  }
                  ${sidebarCollapsed && !isMobile ? 'justify-center px-2' : ''}
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {(!sidebarCollapsed || isMobile) && (
                  <span className="font-medium">{item.label}</span>
                )}
                {isActive(item.to) && (
                  <span className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </Link>
            ))}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            {(!sidebarCollapsed || isMobile) && (
              <button className="flex items-center justify-center w-full gap-2 px-4 py-3 text-red-400 transition-colors border border-red-400/20 rounded-lg hover:bg-red-400/10">
                <span>🚪</span>
                <span>Đăng xuất</span>
              </button>
            )}
          </div>
        </aside>

        {/* Overlay cho mobile */}
        {isMobile && mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main content */}
        <main className={`
          flex-1 min-h-[calc(100vh-4rem)] 
          transition-all duration-300
          ${isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-20' : 'ml-64'}
        `}>
          <div className="p-6">
            {/* Page header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {menuItems.find(item => isActive(item.to))?.label || "Bảng điều khiển"}
              </h2>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <span>Admin</span>
                <span>›</span>
                <span>{menuItems.find(item => isActive(item.to))?.label || "Dashboard"}</span>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 bg-white rounded-xl shadow-sm">
              <Outlet />
            </div>
            
            {/* Footer */}
            <footer className="mt-6 pt-4 text-center text-gray-500 border-t">
              <p>© {new Date().getFullYear()} Hệ thống quản lý • Phiên bản 2.0</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}