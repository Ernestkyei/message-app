import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, X, RefreshCw, Settings, Trash2, User, MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  // Mock notifications data
  const mockNotifications = [
    { id: 1, type: 'user', title: 'New User Registration', message: 'John Doe has joined the platform', time: '5 minutes ago', read: false, priority: 'high' },
    { id: 2, type: 'message', title: 'Message Flagged', message: 'User "Alice" reported inappropriate content', time: '15 minutes ago', read: false, priority: 'high' },
    { id: 3, type: 'system', title: 'System Update', message: 'New version 2.4.0 has been deployed', time: '1 hour ago', read: true, priority: 'medium' },
    { id: 4, type: 'user', title: 'User Suspended', message: 'Account of Bob Smith has been suspended', time: '2 hours ago', read: true, priority: 'medium' },
    { id: 5, type: 'message', title: 'Spam Report', message: 'Multiple spam reports detected', time: '4 hours ago', read: false, priority: 'high' },
    { id: 6, type: 'system', title: 'Maintenance Scheduled', message: 'Server maintenance on Sunday at 2 AM', time: '1 day ago', read: true, priority: 'low' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    toast.success('Marked as read');
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'user': return <User className="w-5 h-5 text-blue-500" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-purple-500" />;
      case 'system': return <Settings className="w-5 h-5 text-orange-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'high': return <Badge className="bg-red-100 text-red-700">High Priority</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>;
      case 'low': return <Badge className="bg-gray-100 text-gray-600">Low</Badge>;
      default: return null;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    return n.type === activeTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const NotificationSkeleton = () => (
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-gray-500 text-sm mt-1">Stay updated with platform activity and alerts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleMarkAllRead} className="flex items-center gap-2">
            <CheckCircle size={16} />
            Mark All Read
          </Button>
          <Button variant="outline" onClick={handleClearAll} className="flex items-center gap-2 text-red-600 hover:text-red-700">
            <Trash2 size={16} />
            Clear All
          </Button>
          <Button onClick={() => window.location.reload()} className="flex items-center gap-2">
            <RefreshCw size={16} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-blue-100 text-sm">Total Notifications</p>
              <p className="text-3xl font-bold">{notifications.length}</p>
            </div>
            <Bell size={32} className="opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-sm p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-orange-100 text-sm">Unread</p>
              <p className="text-3xl font-bold">{unreadCount}</p>
            </div>
            <AlertCircle size={32} className="opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm p-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-green-100 text-sm">High Priority</p>
              <p className="text-3xl font-bold">{notifications.filter(n => n.priority === 'high').length}</p>
            </div>
            <Info size={32} className="opacity-50" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="bg-white">
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="user">Users</TabsTrigger>
          <TabsTrigger value="message">Messages</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {loading ? (
              Array(5).fill(0).map((_, i) => <NotificationSkeleton key={i} />)
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-600">No notifications</h3>
                <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div key={notification.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/30' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                          {getPriorityBadge(notification.priority)}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={12} />
                            {notification.time}
                          </span>
                          {!notification.read && (
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">New</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read && (
                        <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(notification.id)} className="h-8 text-blue-600">
                          Mark read
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(notification.id)} className="h-8 text-red-500">
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;