import { useState, useEffect } from 'react';
import { Send, Search, MessageSquare, RefreshCw, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';
import useUserStore from '@/stores/userStore';
import useAdminStore from '@/stores/adminStore';

const SendMessage = () => {
  const [sending, setSending] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [search, setSearch] = useState('');
  
  // Get users from store
  const { users = [], getAllUsers, isLoading } = useUserStore();
  const { sendDirectMessage } = useAdminStore();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    await getAllUsers(1, 100);
  };

  // Get initials for avatar
  const getInitials = (name, email) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'U';
  };

  const handleSend = async () => {
    if (!selectedUser) {
      toast.error('Please select a user to message');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSending(true);
    
    try {
      const result = await sendDirectMessage(
        selectedUser._id || selectedUser.id,
        message,
        subject || 'Message from Admin'
      );
      
      // REMOVED duplicate toast - the store already shows success/error toast
      if (result?.success) {
        setMessage('');
        setSubject('');
        setSelectedUser(null);
      }
    } catch (error) {
      console.error('Send message error:', error);
      // Only show error if the store didn't already show one
      if (!error.response?.data?.message) {
        toast.error('Failed to send message');
      }
    } finally {
      setSending(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const UserCardSkeleton = () => (
    <div className="flex items-center gap-3 p-3 border rounded-lg">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-40" />
      </div>
      <Skeleton className="h-8 w-16" />
    </div>
  );

  const isLoadingState = isLoading;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Send Message</h1>
        <p className="text-gray-500 text-sm mt-1">Send a personal message to any user on the platform</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - User Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UsersIcon size={18} />
              Select Recipient
            </CardTitle>
            <CardDescription>Choose a user to send a message to</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Users List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {isLoadingState ? (
                Array(5).fill(0).map((_, i) => <UserCardSkeleton key={i} />)
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No users found
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user._id || user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedUser?._id === user._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium shadow-sm">
                      {getInitials(user.name, user.email)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{user.name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.isOnline && (
                        <Badge className="bg-green-100 text-green-700">Online</Badge>
                      )}
                      {selectedUser?._id === user._id && (
                        <Badge className="bg-blue-100 text-blue-700">Selected</Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Message Composition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare size={18} />
              Compose Message
            </CardTitle>
            <CardDescription>
              {selectedUser 
                ? `Sending to: ${selectedUser.name}` 
                : 'Select a user from the left panel'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedUser && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-medium shadow-sm">
                  {getInitials(selectedUser.name, selectedUser.email)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedUser.name}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedUser(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  Change
                </Button>
              </div>
            )}

            {/* Subject Field */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Input
                id="subject"
                placeholder="Enter subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={!selectedUser}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                disabled={!selectedUser}
                className="resize-none"
              />
              {message && (
                <p className="text-xs text-gray-500">
                  {message.length} characters
                </p>
              )}
            </div>

            <Button
              onClick={handleSend}
              disabled={!selectedUser || !message.trim() || sending}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {sending ? (
                <>
                  <RefreshCw size={16} className="animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SendMessage;