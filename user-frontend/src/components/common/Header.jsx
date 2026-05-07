import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  LogOut, 
  ChevronLeft,
  Settings,
  HelpCircle,
  LayoutDashboard,
  Bell,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '@/stores/authStore';
import useMessageStore from '@/stores/messageStore'; // ✅ ADD THIS
import api from '@/services/api';
import endpoints from '@/config/endpoints/endpoints';
import websocketService from '@/services/websocket';

const Header = ({ 
  showBackButton = false, 
  backPath = '/dashboard',
  backLabel = 'Back',
  customButtons = [],
  title = null,
  showThemeToggle = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { totalUnreadCount, fetchTotalUnreadCount } = useMessageStore(); // ✅ ADD THIS
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // ✅ ADD THIS - Fetch total unread count on mount and periodically
  useEffect(() => {
    fetchTotalUnreadCount();
    const interval = setInterval(fetchTotalUnreadCount, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    if (endpoints.notifications?.getAll) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  // Track WebSocket online status
  useEffect(() => {
    const handleConnect = () => setIsOnline(true);
    const handleDisconnect = () => setIsOnline(false);
    const handleStatusChange = (status) => setIsOnline(status?.online || false);
    
    websocketService.on('connect', handleConnect);
    websocketService.on('disconnect', handleDisconnect);
    websocketService.on('statusChange', handleStatusChange);
    
    setIsOnline(websocketService.isCurrentUserOnline?.() || false);
    
    return () => {
      websocketService.off('connect', handleConnect);
      websocketService.off('disconnect', handleDisconnect);
      websocketService.off('statusChange', handleStatusChange);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const fetchNotifications = async () => {
    if (!endpoints.notifications?.getAll) return;
    
    try {
      const response = await api.get(endpoints.notifications.getAll);
      const notificationsData = response.data.notifications || response.data || [];
      setNotifications(notificationsData);
      const unread = notificationsData.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    if (!endpoints.notifications?.markAsRead) return;
    
    try {
      await api.patch(`${endpoints.notifications.markAsRead}/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!endpoints.notifications?.markAllAsRead) {
      toast.error('Notifications endpoint not configured');
      return;
    }
    
    try {
      await api.post(endpoints.notifications.markAllAsRead);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      toast.error('Failed to update notifications');
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
      setNotificationOpen(false);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  const handleLogout = async () => {
    try {
      if (endpoints.auth?.logout) {
        await api.post(endpoints.auth.logout);
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      logout();
      toast.success('Logged out successfully!');
      navigate('/auth/login');
    }
  };

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-10 dark:bg-gray-900/80 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button
                onClick={() => navigate(backPath)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group dark:text-gray-400 dark:hover:text-blue-400"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline">{backLabel}</span>
              </button>
            )}
            
            {title && (
              <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h1>
            )}

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 ml-4">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Custom Buttons */}
            {customButtons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`hidden sm:flex items-center gap-2 ${button.className}`}
              >
                {button.icon}
                <span>{button.label}</span>
              </button>
            ))}

            {/* Theme Toggle */}
            {showThemeToggle && (
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-800"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            )}

            {/* Notification Bell - Shows both system notifications AND unread messages */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <Bell className="w-5 h-5" />
                {/* ✅ SHOW UNREAD MESSAGE COUNT (priority over notifications) */}
                {totalUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                  </span>
                )}
                {/* Show notification count if no unread messages */}
                {totalUnreadCount === 0 && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown (can be expanded to show unread messages) */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 animate-fadeIn dark:bg-gray-800 dark:border-gray-700">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                      {totalUnreadCount > 0 ? `📬 ${totalUnreadCount} Unread Message${totalUnreadCount > 1 ? 's' : ''}` : 'Notifications'}
                    </p>
                    {totalUnreadCount > 0 && (
                      <button
                        onClick={() => {
                          navigate('/dashboard');
                          setNotificationOpen(false);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        Go to Chats
                      </button>
                    )}
                    {unreadCount > 0 && totalUnreadCount === 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {totalUnreadCount > 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50 text-blue-500" />
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          You have <span className="font-bold text-blue-600">{totalUnreadCount}</span> unread message{totalUnreadCount > 1 ? 's' : ''}
                        </p>
                        <button
                          onClick={() => {
                            navigate('/dashboard');
                            setNotificationOpen(false);
                          }}
                          className="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          View Messages
                        </button>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors dark:hover:bg-gray-700 ${
                            !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <p className="text-sm text-gray-800 dark:text-white">{notification.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : ''}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Dropdown - Clean version with single blinking dot before avatar */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-800"
              >
                {/* Blinking Online Indicator BEFORE Avatar */}
                {isOnline && (
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <span className="flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Avatar */}
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getInitials(user?.name)}
                    </span>
                  </div>
                </div>
                
                {/* User Info */}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize dark:text-gray-400">{user?.role || 'User'}</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 animate-fadeIn dark:bg-gray-800 dark:border-gray-700">
                  <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.name}</p>
                      {isOnline && (
                        <div className="flex items-center">
                          <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-xs text-gray-400 capitalize dark:text-gray-500">Role: {user?.role || 'User'}</p>
                      {isOnline ? (
                        <span className="text-xs text-green-600 dark:text-green-400">● Online</span>
                      ) : (
                        <span className="text-xs text-gray-400">○ Offline</span>
                      )}
                    </div>
                  </div>
                  
                  {/* My Profile Option */}
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  
                  {/* Settings Option */}
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  
                  {/* Help & Support Option */}
                  <button
                    onClick={() => {
                      navigate('/help');
                      setDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2 transition-colors dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Help & Support
                  </button>
                  
                  <hr className="my-2 border-gray-100 dark:border-gray-700" />
                  
                  {/* Logout Option */}
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slideDown dark:border-gray-700">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
            <hr className="my-2 border-gray-100 dark:border-gray-700" />
            {customButtons.map((button, index) => (
              <button
                key={index}
                onClick={() => {
                  button.onClick();
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${button.className}`}
              >
                {button.icon}
                <span>{button.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;