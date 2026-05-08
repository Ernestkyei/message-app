// admin-frontend/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/admin/auth/Login';
import ForgotPassword from './pages/admin/auth/ForgotPassword';
import ResetPassword from './pages/admin/auth/ResetPassword';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/dashboard/Dashboard';
import Users from './pages/admin/users/Users';
import Messages from './pages/admin/messagesLogs/messageLogs';
import Notifications from './pages/admin/notifications/Notifications';
import Settings from './pages/admin/settings/Settings';
import useAuthStore from './stores/authStore';

function App() {
  const { token, user } = useAuthStore();
  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  return (
    <BrowserRouter>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
          },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      
        {/* Protected Admin Routes */}
        <Route 
          element={isAuthenticated && isAdmin ? <AdminLayout /> : <Navigate to="/login" />}
        >
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/messages" element={<Messages />} />
          <Route path="/admin/notifications" element={<Notifications />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
        
        {/* Default Redirects */}
        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;