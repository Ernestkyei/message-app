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
  User,
  ChevronDown
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user from localStorage (mock data for now)
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser) {
      setAdminUser(JSON.parse(mockUser));
    } else {
      // Default mock admin user
      const defaultUser = {
        name: 'Admin User',
        email: 'admin@messageapp.com',
        role: 'admin',
        avatar: 'A'
      };
      setAdminUser(defaultUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mockToken');
    localStorage.removeItem('mockIsAdmin');
    localStorage.removeItem('mockUser');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/send-message', icon: Send, label: 'Send Message' },
    { path: '/admin/messages', icon: MessageSquare, label: 'Messaging Logs' },
    { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
        {/* Header with Avatar and Dropdown */}
        <header className="bg-white shadow-sm px-6 py-3 flex justify-between items-center sticky top-0 z-30">
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
          
          {/* User Menu with Avatar */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {adminUser ? getInitials(adminUser.name) : 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">{adminUser?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">{adminUser?.email || 'admin@messageapp.com'}</p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{adminUser?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">{adminUser?.email || 'admin@messageapp.com'}</p>
                  <p className="text-xs text-blue-600 mt-1">Administrator</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;