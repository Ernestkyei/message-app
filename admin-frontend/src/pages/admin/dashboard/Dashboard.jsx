import { useState, useEffect } from 'react';
import { Users, MessageSquare, Mail, Activity, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
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

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock stats data
  const stats = [
    { title: 'Total Users', value: '1,426', change: '+12%', trend: 'up', icon: Users, color: 'bg-blue-500' },
    { title: 'Total Messages', value: '8,942', change: '+18%', trend: 'up', icon: MessageSquare, color: 'bg-green-500' },
    { title: 'Conversations', value: '2,177', change: '-5%', trend: 'down', icon: Mail, color: 'bg-purple-500' },
    { title: 'Active Today', value: '342', change: '+8%', trend: 'up', icon: Activity, color: 'bg-orange-500' },
  ];

  // Chart data: Messages per day
  const messagesChartData = [
    { day: 'Mon', messages: 145, users: 120 },
    { day: 'Tue', messages: 189, users: 145 },
    { day: 'Wed', messages: 210, users: 168 },
    { day: 'Thu', messages: 198, users: 172 },
    { day: 'Fri', messages: 256, users: 189 },
    { day: 'Sat', messages: 187, users: 134 },
    { day: 'Sun', messages: 134, users: 98 },
  ];

  // Pie chart data: User distribution
  const userDistribution = [
    { name: 'Active Users', value: 342, color: '#10b981' },
    { name: 'Inactive Users', value: 1084, color: '#6b7280' },
  ];

  // Top users by messages
  const topUsers = [
    { name: 'Admin User', messages: 245 },
    { name: 'Alice Hi there!', messages: 189 },
    { name: 'Sarah Johnson', messages: 156 },
    { name: 'John Smith', messages: 134 },
    { name: 'Mike Wilson', messages: 98 },
  ];

  // Mock users data for table
  const users = [
    { id: 1, name: 'Admin User', email: 'admin01@gmail.com', activity: 'Online', conversations: 24, lastActive: '2 minutes ago' },
    { id: 2, name: 'Alice Hi there!', email: 'administer@gmail.com', activity: 'Offline', conversations: 16, lastActive: '3 hours ago' },
    { id: 3, name: 'John Smith', email: 'john.smith@gmail.com', activity: 'Offline', conversations: 3, lastActive: '3 hours ago' },
    { id: 4, name: 'Sarah Johnson', email: 'sarah.j@example.com', activity: 'Online', conversations: 2, lastActive: '2 minutes ago' },
    { id: 5, name: 'Mike Wilson', email: 'mike.w@example.com', activity: 'Offline', conversations: 3, lastActive: '2 minutes ago' },
    { id: 6, name: 'Lisa Brown', email: 'lisa.b@example.com', activity: 'Offline', conversations: 2, lastActive: '2 minutes ago' },
    { id: 7, name: 'Tom Davis', email: 'tom.d@example.com', activity: 'Offline', conversations: 0, lastActive: '4 hours ago' },
    { id: 8, name: 'Emma Clark', email: 'emma.c@example.com', activity: 'Offline', conversations: 1, lastActive: '2 minutes ago' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

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

  const showSkeletons = loading || refreshing;

  return (
    <div>
      {/* Header with Refresh Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <Button onClick={handleRefresh} disabled={showSkeletons} className="flex items-center gap-2">
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {showSkeletons ? (
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
        {/* Bar Chart - Messages per Day */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Messages Overview</h3>
          {showSkeletons ? (
            <ChartSkeleton />
          ) : (
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
          )}
        </div>

        {/* Pie Chart - User Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">User Distribution</h3>
          {showSkeletons ? (
            <ChartSkeleton />
          ) : (
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
          )}
        </div>
      </div>

      {/* Top Users by Messages */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Active Users</h3>
        {showSkeletons ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {topUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                  <span className="font-medium text-gray-800">{user.name}</span>
                </div>
                <span className="text-sm text-blue-600 font-semibold">{user.messages} messages</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Directory Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">User Directory</h2>
          {!showSkeletons && (
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {users.length} users
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
                <TableHead>Activity</TableHead>
                <TableHead>Conversations</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showSkeletons ? (
                Array(5).fill(0).map((_, i) => <TableRowSkeleton key={i} />)
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                        {user.name.charAt(0)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">{user.name}</TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        user.activity === 'Online' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.activity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-gray-800">{user.conversations}</span>
                      <span className="text-gray-400 text-xs ml-1">conversations</span>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">{user.lastActive}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {!showSkeletons && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <span className="text-sm text-gray-500">Showing 1-{users.length} of {users.length} users</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;