import { useState } from 'react';
import { Search, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Users = () => {
  const [search, setSearch] = useState('');

  const users = [
    { name: 'Admin User', email: 'admin01@gmail.com', role: 'Admin', status: 'Active', lastActive: '2 minutes ago' },
    { name: 'Alice Hi there!', email: 'administer@gmail.com', role: 'User', status: 'Inactive', lastActive: '3 hours ago' },
    { name: 'Admin User', email: 'adminuse@gmail.com', role: 'User', status: 'Inactive', lastActive: '3 hours ago' },
    { name: 'Alice Siraram', email: 'alice.twa@gmail.com', role: 'User', status: 'Inactive', lastActive: '2 minutes ago' },
    { name: 'Mathan Smith', email: 'mathan.ker@gmail.com', role: 'User', status: 'Inactive', lastActive: '2 minutes ago' },
    { name: 'Stephan Raman', email: 'sephan.usex@gmail.com', role: 'User', status: 'Inactive', lastActive: '4 hours ago' },
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">User</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
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
                      user.role === 'Admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-500 text-sm">{user.lastActive}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button className="p-1 text-blue-500 hover:bg-blue-50 rounded transition">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-red-500 hover:bg-red-50 rounded transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Users;