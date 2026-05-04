import { Users, MessageSquare, Mail, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Dashboard = () => {
  const stats = [
    { title: 'Users', value: '1,426', change: '+12%', trend: 'up', icon: Users, color: 'bg-blue-500' },
    { title: 'Messages', value: '1,136', change: '+8%', trend: 'up', icon: MessageSquare, color: 'bg-green-500' },
    { title: 'Emails', value: '2,177', change: '-5%', trend: 'down', icon: Mail, color: 'bg-purple-500' },
    { title: 'Activity', value: '25h', change: '-3%', trend: 'down', icon: Activity, color: 'bg-orange-500' },
  ];

  const users = [
    { name: 'Admin User', email: 'admin01@gmail.com', activity: 'Online', conversations: 24, lastActive: '2 minutes ago' },
    { name: 'Alice Hi there!', email: 'administer@gmail.com', activity: 'Offline', conversations: 16, lastActive: '3 hours ago' },
    { name: 'Admin User', email: 'adminuse@gmail.com', activity: 'Offline', conversations: 3, lastActive: '3 hours ago' },
    { name: 'Admin User', email: 'elicinvert91@gmail.com', activity: 'Offline', conversations: 2, lastActive: '2 minutes ago' },
    { name: 'Alice Siraram', email: 'alice.twa@gmail.com', activity: 'Offline', conversations: 3, lastActive: '2 minutes ago' },
    { name: 'Mathan Smith', email: 'mathan.ker@gmail.com', activity: 'Offline', conversations: 2, lastActive: '2 minutes ago' },
    { name: 'Stephan Raman', email: 'sephan.usex@gmail.com', activity: 'Offline', conversations: 0, lastActive: '4 hours ago' },
    { name: 'Admin User', email: 'adminuse@gmail.com', activity: 'Offline', conversations: 1, lastActive: '2 minutes ago' },
  ];

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Directory Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">User Directory</h2>
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
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                      {user.name.charAt(0)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-800">{user.name}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.activity === 'Online' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.activity}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-600">{user.conversations}</TableCell>
                  <TableCell className="text-gray-500 text-sm">{user.lastActive}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;