import { useState, useEffect } from 'react';
import { Search, Edit, Trash2, RefreshCw } from 'lucide-react';
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
import useUserStore from '@/stores/userStore';

const Users = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  
  // Get data from store
  const { 
    users = [], 
    isLoading, 
    error,
    page: currentPage,
    totalPages,
    getAllUsers,
    deleteUser,
    clearError
  } = useUserStore();

  // Debug: Log users whenever they change
  useEffect(() => {
    console.log('📊 Users state updated:', users);
    console.log('📊 Number of users:', users?.length);
  }, [users]);

  // Debug: Log error
  useEffect(() => {
    if (error) {
      console.error('❌ Error in store:', error);
    }
  }, [error]);

  // Load users on component mount and when page changes
  useEffect(() => {
    console.log('🔄 Loading users for page:', page);
    loadUsers();
  }, [page]);

  const loadUsers = async () => {
    console.log('🔵 Calling getAllUsers...');
    const result = await getAllUsers(page, 10);
    console.log('🔵 getAllUsers result:', result);
  };

  const handleRefresh = async () => {
    console.log('🔄 Manual refresh triggered');
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleDelete = async (id, userName) => {
    if (window.confirm(`Are you sure you want to delete user: ${userName}?`)) {
      const result = await deleteUser(id);
      if (result.success) {
        alert('User deleted successfully');
        loadUsers(); // Reload the list
      } else {
        alert(`Failed to delete user: ${result.error}`);
      }
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  console.log('🎨 Rendering with users count:', users?.length, 'filtered:', filteredUsers?.length);

  const isLoadingState = isLoading || refreshing;

  // Table row skeleton
  const TableRowSkeleton = () => (
    <TableRow>
      <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
      <TableCell><div className="flex gap-2"><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-8" /></div></TableCell>
    </TableRow>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <Button onClick={handleRefresh} disabled={isLoadingState} className="flex items-center gap-2">
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-700 hover:text-red-900">×</button>
        </div>
      )}

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
              {isLoadingState ? (
                Array(5).fill(0).map((_, i) => <TableRowSkeleton key={i} />)
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                        {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">{user.name || 'N/A'}</TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'Admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role || 'User'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.isOnline || user.status === 'Active'
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {user.isOnline ? 'Online' : (user.status || 'Offline')}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">{user.lastActive || 'Never'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button 
                          className="p-1 text-blue-500 hover:bg-blue-50 rounded transition"
                          onClick={() => {/* Open edit modal */}}
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition"
                          onClick={() => handleDelete(user.id, user.name)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!isLoadingState && totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;