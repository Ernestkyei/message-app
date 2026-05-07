import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/admin/auth/Login'; 
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/dashboard/Dashboard';
import Users from './pages/admin/users/Users';
import Messages from './pages/admin/messagesLogs/messageLogs';
import SendMessage from './pages/admin/sendMessage/SendMessages';
import Notifications from './pages/admin/notifications/Notifications';
import Settings from './pages/admin/settings/Settings';

function App() {
  const mockToken = localStorage.getItem('mockToken');
  const mockIsAdmin = localStorage.getItem('mockIsAdmin') === 'true';

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
        <Route path="/login" element={<Login />} />
      
        <Route element={mockToken && mockIsAdmin ? <AdminLayout /> : <Navigate to="/login" />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/messages" element={<Messages />} />
          <Route path="/admin/send-message" element={<SendMessage />} />
          <Route path="/admin/notifications" element={<Notifications />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/admin" />} />s
      </Routes>
    </BrowserRouter>
  );
}

export default App;