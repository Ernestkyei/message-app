// admin-frontend/src/layouts/AdminLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X,
  Send,
} from 'lucide-react';
import { Header } from '@/components/shared';
import toast from 'react-hot-toast';
import useAuthStore from '@/stores/authStore';
import { io } from 'socket.io-client';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const navigate = useNavigate();
  const { logout, getToken, user } = useAuthStore();

  // Connect to Socket.IO when admin logs in
  useEffect(() => {
    const authToken = getToken();
    
    if (authToken && user?.role === 'admin') {
      // ✅ USE ENVIRONMENT VARIABLE - FIXED!
      const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:4000';
      
      console.log('🔌 Admin socket connecting to:', WS_URL);
      
      const socketInstance = io(WS_URL, {  // ← NOW USING ENV VAR
        query: { token: authToken },
        transports: ['polling', 'websocket'], // Both for reliability
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        withCredentials: true,
      });

      socketInstance.on('connect', () => {
        console.log('✅ Admin Socket connected');
        setSocketConnected(true);
      });

      socketInstance.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        setSocketConnected(false);
      });

      socketInstance.on('disconnect', (reason) => {
        console.log('❌ Admin Socket disconnected:', reason);
        setSocketConnected(false);
      });

      setSocket(socketInstance);

      // Cleanup on unmount
      return () => {
        if (socketInstance) {
          socketInstance.disconnect();
        }
      };
    }
  }, [getToken, user]);

  const handleLogout = async () => {
    if (socket) {
      socket.disconnect();
    }
    await logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/send-messages', icon: Send, label: 'Send Message' },
    { path: '/admin/messages', icon: MessageSquare, label: 'Messaging Logs' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Socket connection status indicator - optional */}
      {socketConnected && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Real-time connected
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className={`flex items-center gap-2 ${!sidebarOpen && 'justify-center w-full'}`}>
            <LayoutDashboard className="w-6 h-6 text-blue-400" />
            {sidebarOpen && <span className="font-bold text-lg">Admin Panel</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded hover:bg-gray-800">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              <item.icon size={20} />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;