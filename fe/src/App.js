import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AttendancePage from './pages/AttendancePage';
import ShiftManager from './pages/ShiftManager';
import AssignmentManager from './pages/AssignmentManager';
import SchedulePage from './pages/SchedulePage';
import PayrollPage from './pages/PayrollPage';
import './App.css'; // Import CSS

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Private Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/attendance" element={
            <PrivateRoute>
              <AttendancePage />
            </PrivateRoute>
          } />

          <Route path="/schedule" element={
            <PrivateRoute>
              <SchedulePage />
            </PrivateRoute>
          } />


          {/* Admin Routes */}
          <Route path="/shifts" element={
            <PrivateRoute roles={['admin', 'manager']}>
              <ShiftManager />
            </PrivateRoute>
          } />

          
          <Route path="/payroll" element={
  <PrivateRoute roles={['admin']}>
     <PayrollPage />
  </PrivateRoute>
} />

          <Route path="/assignments" element={
            <PrivateRoute roles={['admin', 'manager']}>
              <AssignmentManager />
            </PrivateRoute>
          } />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;