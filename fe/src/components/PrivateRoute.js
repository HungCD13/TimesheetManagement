import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Nếu route yêu cầu quyền admin mà user là employee -> chặn
  if (roles && !roles.includes(user.role)) {
    return <div className="p-4 text-red-500">Bạn không có quyền truy cập trang này.</div>;
  }

  return children;
};

export default PrivateRoute;