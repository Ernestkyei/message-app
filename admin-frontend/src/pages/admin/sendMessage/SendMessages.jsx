import { useState, useEffect } from 'react';
import { Send, User, Mail, MessageSquare, RefreshCw, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';

const SendMessage = () => {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Mock fetching users
    const timer = setTimeout(() => {
      setUsers([
        { id: '1', name: 'Alice Johnson', email: 'alice@example.com', avatar: 'A' },
        { id: '2', name: 'Bob Smith', email: 'bob@example.com', avatar: 'B' },
        { id: '3', name: 'Carol Davis', email: 'carol@example.com', avatar: 'C' },
        { id: '4', name: 'David Wilson', email: 'david@example.com', avatar: 'D' },
        { id: '5', name: 'Emma Brown', email: 'emma@example.com', avatar: 'E' },
      ]);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
    
    // Simulate API call
    setTimeout(() => {
      toast.success(`Message sent to ${selectedUser.name}`);
      setMessage('');
      setSelectedUser(null);
      setSending(false);
    }, 1500);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
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

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Send Message</h1>
        <p className="text-gray-500 text-sm mt-1">Send a message to any user on the platform</p>
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
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Users List */}
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {loading ? (
                Array(5).fill(0).map((_, i) => <UserCardSkeleton key={i} />)
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No users found
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedUser?.id === user.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    {selectedUser?.id === user.id && (
                      <Badge className="bg-blue-100 text-blue-700">Selected</Badge>
                    )}
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
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                    {selectedUser.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-800">{selectedUser.name}</p>
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

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                disabled={!selectedUser}
                className="resize-none"
              />
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