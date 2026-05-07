import { useState, useEffect } from 'react';
import { 
  Search, Trash2, Eye, RefreshCw, ChevronLeft, ChevronRight, 
  Filter, Download, MessageSquare, User, Calendar, Clock, Send,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import toast from 'react-hot-toast';

const Messages = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Send message state
  const [sendForm, setSendForm] = useState({
    receiverId: '',
    receiverName: '',
    subject: '',
    content: '',
  });
  const [sending, setSending] = useState(false);
  const [users, setUsers] = useState([]);

  // Mock data
  const mockMessages = [
    { id: 1, sender: 'Admin User', senderEmail: 'admin@example.com', receiver: 'Alice Johnson', receiverId: 'user_001', content: 'Hey, how are you doing today?', timestamp: '2024-01-15T10:30:00', status: 'delivered', conversationId: 'conv_001' },
    { id: 2, sender: 'Alice Johnson', senderEmail: 'alice@example.com', receiver: 'Admin User', content: 'I\'m doing great! Thanks for asking.', timestamp: '2024-01-15T10:32:00', status: 'read', conversationId: 'conv_001' },
    { id: 3, sender: 'Bob Smith', senderEmail: 'bob@example.com', receiver: 'Admin User', content: 'Can you review my latest proposal?', timestamp: '2024-01-15T09:15:00', status: 'delivered', conversationId: 'conv_002' },
    { id: 4, sender: 'Admin User', senderEmail: 'admin@example.com', receiver: 'Bob Smith', receiverId: 'user_002', content: 'Sure, I\'ll take a look right now.', timestamp: '2024-01-15T09:20:00', status: 'read', conversationId: 'conv_002' },
    { id: 5, sender: 'Carol Davis', senderEmail: 'carol@example.com', receiver: 'Admin User', content: 'Meeting at 3 PM today?', timestamp: '2024-01-15T08:45:00', status: 'delivered', conversationId: 'conv_003' },
  ];

  // Mock users for sending messages
  const mockUsers = [
    { id: 'user_001', name: 'Alice Johnson', email: 'alice@example.com' },
    { id: 'user_002', name: 'Bob Smith', email: 'bob@example.com' },
    { id: 'user_003', name: 'Carol Davis', email: 'carol@example.com' },
    { id: 'user_004', name: 'David Wilson', email: 'david@example.com' },
    { id: 'user_005', name: 'Emma Brown', email: 'emma@example.com' },
  ];

  const fetchData = () => {
    setRefreshing(true);
    setTimeout(() => {
      setMessages(mockMessages);
      setUsers(mockUsers);
      setTotalPages(3);
      setLoading(false);
      setRefreshing(false);
    }, 1500);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleDelete = (id) => {
    if (window.confirm('Delete this message?')) {
      setMessages(messages.filter(m => m.id !== id));
      toast.success('Message deleted successfully');
    }
  };

  const handleView = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const handleExport = () => {
    toast.success('Export started');
  };

  const handleRefresh = () => {
    fetchData();
  };

  const handleSendMessage = async () => {
    if (!sendForm.receiverId || !sendForm.content) {
      toast.error('Please select a recipient and enter a message');
      return;
    }

    setSending(true);
    
    // Simulate API call
    setTimeout(() => {
      const newMessage = {
        id: messages.length + 1,
        sender: 'Admin User',
        senderEmail: 'admin@example.com',
        receiver: sendForm.receiverName,
        receiverId: sendForm.receiverId,
        content: sendForm.content,
        timestamp: new Date().toISOString(),
        status: 'delivered',
        conversationId: `conv_${Date.now()}`,
      };
      
      setMessages([newMessage, ...messages]);
      toast.success(`Message sent to ${sendForm.receiverName}`);
      setShowSendModal(false);
      setSendForm({ receiverId: '', receiverName: '', subject: '', content: '' });
      setSending(false);
    }, 1000);
  };

  const filteredMessages = messages.filter(msg =>
    msg.content.toLowerCase().includes(search.toLowerCase()) ||
    msg.sender.toLowerCase().includes(search.toLowerCase()) ||
    msg.receiver.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch(status) {
      case 'read': return <Badge className="bg-green-100 text-green-700">Read</Badge>;
      case 'delivered': return <Badge className="bg-yellow-100 text-yellow-700">Delivered</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const showSkeletons = loading || refreshing;

  // Stats Card Skeleton
  const StatsCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16 mb-3" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
    </div>
  );

  // Table Row Skeleton
  const TableRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </TableCell>
      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
      <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell><div className="flex gap-2"><Skeleton className="h-8 w-8 rounded" /><Skeleton className="h-8 w-8 rounded" /></div></TableCell>
    </TableRow>
  );

  // Search Bar Skeleton
  const SearchSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );

  // Pagination Skeleton
  const PaginationSkeleton = () => (
    <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
      <Skeleton className="h-4 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Messaging Logs</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor, manage, and send messages across the platform</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowSendModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus size={16} />
            New Message
          </Button>
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-2" disabled={showSkeletons}>
            <Download size={16} />
            Export
          </Button>
          <Button onClick={handleRefresh} disabled={showSkeletons} className="flex items-center gap-2">
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {showSkeletons ? (
          Array(4).fill(0).map((_, i) => <StatsCardSkeleton key={i} />)
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Messages</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">1,247</p>
                  <p className="text-green-500 text-xs mt-2">↑ 12% this week</p>
                </div>
                <div className="bg-blue-500 p-3 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Active Conversations</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">342</p>
                  <p className="text-green-500 text-xs mt-2">↑ 8% this week</p>
                </div>
                <div className="bg-green-500 p-3 rounded-xl">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Unread Messages</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">89</p>
                  <p className="text-red-500 text-xs mt-2">↓ 5% this week</p>
                </div>
                <div className="bg-purple-500 p-3 rounded-xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Active Users Today</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">156</p>
                  <p className="text-green-500 text-xs mt-2">↑ 18% from yesterday</p>
                </div>
                <div className="bg-orange-500 p-3 rounded-xl">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Search and Filters */}
      {showSkeletons ? (
        <SearchSkeleton />
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by sender, receiver, or message content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          {showSkeletons ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            <h2 className="text-lg font-semibold text-gray-800">Message History</h2>
          )}
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {showSkeletons ? (
                Array(5).fill(0).map((_, i) => <TableRowSkeleton key={i} />)
              ) : filteredMessages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-8 text-gray-500">
                    No messages found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMessages.map((msg) => (
                  <TableRow key={msg.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                            {msg.sender.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-800">{msg.sender}</p>
                          <p className="text-xs text-gray-500">{msg.senderEmail}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                            {msg.receiver.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-gray-600">{msg.receiver}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-gray-600 truncate">{msg.content}</p>
                    </TableCell>
                    <TableCell>{getStatusBadge(msg.status)}</TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {new Date(msg.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleView(msg)} className="h-8 w-8 p-0">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(msg.id)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {showSkeletons ? (
          <PaginationSkeleton />
        ) : (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <span className="text-sm text-gray-500">Showing 1-{filteredMessages.length} of {messages.length} messages</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                <ChevronLeft size={16} />
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                Next
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {selectedMessage.sender.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-800">{selectedMessage.sender}</p>
                  <p className="text-xs text-gray-500">to {selectedMessage.receiver}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{selectedMessage.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className="font-medium">{getStatusBadge(selectedMessage.status)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Sent</p>
                  <p className="font-medium">{new Date(selectedMessage.timestamp).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Conversation ID</p>
                  <p className="font-medium text-xs">{selectedMessage.conversationId}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Message Modal */}
      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send size={18} />
              Send New Message
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Select Recipient</Label>
              <Select 
                value={sendForm.receiverId} 
                onValueChange={(value) => {
                  const selectedUser = users.find(u => u.id === value);
                  setSendForm({
                    ...sendForm,
                    receiverId: value,
                    receiverName: selectedUser?.name || '',
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user to message" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                        <span className="text-xs text-gray-400">({user.email})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <textarea
                value={sendForm.content}
                onChange={(e) => setSendForm({ ...sendForm, content: e.target.value })}
                placeholder="Type your message here..."
                className="w-full min-h-[150px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-3">
            <Button variant="outline" onClick={() => setShowSendModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={sending} className="bg-blue-600 hover:bg-blue-700">
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
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;