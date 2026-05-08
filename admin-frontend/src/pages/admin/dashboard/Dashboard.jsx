import { useState, useEffect } from 'react';
import { Users, Shield, UserCheck, Activity, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Import stores
import useUserStore from '@/stores/userStore';
import useConversationStore from '@/stores/conversationStore';
import useMessageStore from '@/stores/messageStore';
import useAdminStore from '@/stores/adminStore';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Get data from stores
  const { 
    users = [], 
    userStats, 
    isLoading: userLoading,
    getAllUsers,
    getUserStats 
  } = useUserStore();
  
  const { 
    conversations = [], 
    isLoading: conversationLoading,
    getAllConversations 
  } = useConversationStore();
  
  const { 
    messageStats, 
    isLoading: messageLoading,
    getMessageStats 
  } = useMessageStore();
  
  const { 
    dashboardData, 
    adminLoading,
    getSystemAnalytics,
    getDashboardStats
  } = useAdminStore();

  // Stats cards - ALL data comes from your existing API
  const stats = [
    { 
      title: 'Total Users', 
      value: userStats?.total?.toLocaleString() || '0',
      change: userStats?.growthPercentage || '0%',
      trend: (userStats?.growthPercentage || '0%').startsWith('+') ? 'up' : 'down',
      icon: Users, 
      color: 'bg-blue-500' 
    },
    { 
      title: 'Admins', 
      value: userStats?.admins?.toLocaleString() || '0',
      change: '0%',
      trend: 'up',
      icon: Shield, 
      color: 'bg-purple-500' 
    },
    { 
      title: 'Regular Users', 
      value: userStats?.users?.toLocaleString() || '0',
      change: '0%',
      trend: 'up',
      icon: UserCheck, 
      color: 'bg-green-500' 
    },
    { 
      title: 'Active Today', 
      value: userStats?.activeToday?.toLocaleString() || '0',
      change: userStats?.activeGrowth || '0%',
      trend: (userStats?.activeGrowth || '0%').startsWith('+') ? 'up' : 'down',
      icon: Activity, 
      color: 'bg-orange-500' 
    },
  ];

  // Chart data from API
  const [messagesChartData, setMessagesChartData] = useState([]);
  const [userDistribution, setUserDistribution] = useState([]);
  const [topUsers, setTopUsers] = useState([]);

  // Load all dashboard data
  const loadAllData = async () => {
    try {
      console.log('Loading dashboard data...');
      
      await Promise.allSettled([
        getAllUsers(1, 10),
        getUserStats(),
        getAllConversations(1, 10),
        getMessageStats(),
        getDashboardStats && getDashboardStats()
      ]);

      // Fetch analytics for charts
      const analytics = await getSystemAnalytics({ days: 7 });
      console.log('Analytics response:', analytics);
      
      if (analytics.success && analytics.data) {
        console.log('Messages per day:', analytics.data.messagesPerDay);
        console.log('User distribution:', { active: analytics.data.activeUsers, inactive: analytics.data.inactiveUsers });
        
        setMessagesChartData(analytics.data.messagesPerDay || []);
        setUserDistribution([
          { name: 'Active Users', value: analytics.data.activeUsers || 0, color: '#10b981' },
          { name: 'Inactive Users', value: analytics.data.inactiveUsers || 0, color: '#6b7280' },
        ]);
        setTopUsers(analytics.data.topUsers || []);
      } else {
        console.warn('Analytics data not available');
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadAllData();
      setLoading(false);
    };
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  const isLoading = loading || refreshing || userLoading || conversationLoading || messageLoading || adminLoading;

  const StatsSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-8 w-24 mb-3" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
    </div>
  );

  const TableRowSkeleton = () => (
    <TableRow>
      <TableCell><Skeleton className="h-9 w-9 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
    </TableRow>
  );

  const ChartSkeleton = () => (
    <div className="h-80 flex items-center justify-center">
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <Button onClick={handleRefresh} disabled={isLoading} className="flex items-center gap-2">
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards - 4 Cards from your API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <StatsSkeleton key={i} />)
        ) : (
          stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-3">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change} from last week
                    </span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Messages Overview</h3>
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            messagesChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={messagesChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="messages" fill="#3b82f6" name="Messages" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="users" fill="#10b981" name="Active Users" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No message data available
              </div>
            )
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Distribution</h3>
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            userDistribution.length > 0 && (userDistribution[0].value > 0 || userDistribution[1].value > 0) ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={userDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  {userDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-600">{item.name}</span>
                      <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No user distribution data available
              </div>
            )
          )}
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Recent Users</h2>
          {!isLoading && (
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {userStats?.recent?.length || 0} recent users
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">User</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => <TableRowSkeleton key={i} />)
              ) : (
                userStats?.recent && userStats.recent.length > 0 ? (
                  userStats.recent.map((user) => (
                    <TableRow key={user._id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                          {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-800">{user.name || 'N/A'}</TableCell>
                      <TableCell className="text-gray-600">{user.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role || 'User'}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;