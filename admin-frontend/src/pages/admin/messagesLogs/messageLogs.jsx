import { useState, useEffect } from 'react';
import { 
  Search, Trash2, Eye, RefreshCw, ChevronLeft, ChevronRight, 
  Download, MessageSquare, User, Calendar, Clock, Send,
  Plus, AlertTriangle, X
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
  DialogDescription,
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
import useAdminStore from '@/stores/adminStore';
import useUserStore from '@/stores/userStore';
import useMessageStore from '@/stores/messageStore';

const Messages = () => {
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  
  // Send message state
  const [sendForm, setSendForm] = useState({
    userId: '',
    receiverName: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  
  // Get stores
  const { sendDirectMessage } = useAdminStore();
  const { users = [], getAllUsers, isLoading: usersLoading } = useUserStore();
  const { 
    messages, 
    messageStats, 
    isLoading: messagesLoading,
    getAllMessages, 
    deleteMessage,
    getMessageStats
  } = useMessageStore();

  // Fetch users
  const fetchUsers = async () => {
    await getAllUsers(1, 100);
  };

  // Fetch messages
  const fetchMessages = async () => {
    await getAllMessages(currentPage, limit);
  };

  // Fetch stats
  const fetchStats = async () => {
    await getMessageStats();
  };

  // Delete message
  const handleDeleteClick = (message) => {
    setMessageToDelete(message);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;
    
    const result = await deleteMessage(messageToDelete._id || messageToDelete.id);
    if (result.success) {
      toast.success('Message deleted successfully');
      setShowDeleteModal(false);
      setMessageToDelete(null);
      fetchMessages();
      fetchStats();
    } else {
      toast.error(result.error || 'Failed to delete message');
    }
  };

  // View message details
  const handleView = (message) => {
    setSelectedMessage(message);
    setShowViewModal(true);
  };

  // Send new message using store
  const handleSendMessage = async () => {
    if (!sendForm.userId || !sendForm.message) {
      toast.error('Please select a recipient and enter a message');
      return;
    }

    setSending(true);
    
    try {
      const result = await sendDirectMessage(
        sendForm.userId,
        sendForm.message,
        sendForm.subject || 'Message from Admin'
      );
      
      if (result?.success) {
        toast.success(`Message sent to ${sendForm.receiverName}`);
        setShowSendModal(false);
        setSendForm({ userId: '', receiverName: '', subject: '', message: '' });
        fetchMessages();
        fetchStats();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Export messages
  const handleExport = async () => {
    try {
      const result = await getAllMessages(1, 1000);
      if (result.success && result.data?.data) {
        const exportData = result.data.data;
        
        const csv = convertToCSV(exportData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `messages_export_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast.success('Export completed');
      } else {
        toast.error('No data to export');
      }
    } catch (error) {
      console.error('Error exporting messages:', error);
      toast.error('Failed to export messages');
    }
  };

  // Convert to CSV helper
  const convertToCSV = (data) => {
    const headers = ['ID', 'Sender', 'Sender Email', 'Receiver', 'Receiver Email', 'Content', 'Status', 'Timestamp'];
    const rows = data.map(msg => [
      msg._id || msg.id,
      msg.sender?.name || msg.senderName || 'Admin',
      msg.sender?.email || msg.senderEmail || '',
      msg.receiver?.name || msg.receiverName || '',
      msg.receiver?.email || msg.receiverEmail || '',
      msg.content || msg.message || '',
      msg.status || 'delivered',
      new Date(msg.createdAt || msg.timestamp).toLocaleString()
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csvContent;
  };

  // Refresh data
  const handleRefresh = () => {
    Promise.all([fetchMessages(), fetchStats(), fetchUsers()]);
    toast.success('Refreshing data...');
  };

  // Initial data load
  useEffect(() => {
    fetchMessages();
    fetchStats();
    fetchUsers();
  }, [currentPage]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchMessages();
      } else {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Filter messages by search
  const filteredMessages = messages.filter(msg =>
    msg.content?.toLowerCase().includes(search.toLowerCase()) ||
    msg.sender?.name?.toLowerCase().includes(search.toLowerCase()) ||
    msg.receiver?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'read': 
        return <Badge className="bg-green-100 text-green-700">Read</Badge>;
      case 'delivered': 
        return <Badge className="bg-yellow-100 text-yellow-700">Delivered</Badge>;
      case 'sent': 
        return <Badge className="bg-blue-100 text-blue-700">Sent</Badge>;
      default: 
        return <Badge variant="secondary">{status || 'Sent'}</Badge>;
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  const showSkeletons = messagesLoading || usersLoading;

  // Debug log to see what's being displayed
  console.log('Current messageStats:', messageStats);
  console.log('Total Messages value:', messageStats?.totalMessages);

  return (
    <div className="w-full h-full overflow-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Messaging Logs</h1>
            <p className="text-gray-500 text-xs">Monitor, manage, and send messages</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" onClick={() => setShowSendModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus size={14} className="mr-1" />
              New Message
            </Button>
            <Button size="sm" variant="outline" onClick={handleExport} disabled={showSkeletons}>
              <Download size={14} className="mr-1" />
              Export
            </Button>
            <Button size="sm" variant="outline" onClick={handleRefresh} disabled={showSkeletons}>
              <RefreshCw size={14} className={messagesLoading ? 'animate-spin' : ''} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {showSkeletons ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-3">
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-6 w-12" />
              </div>
            ))
          ) : (
            <>
              {/* Total Messages Card */}
              <div className="bg-white rounded-lg shadow-sm p-3">
                <p className="text-xs text-gray-500">Total Messages</p>
                <p className="text-2xl font-bold text-blue-600">{messageStats?.totalMessages || 0}</p>
                <p className="text-green-500 text-[10px]">{messageStats?.growthPercentage || '0%'} growth</p>
              </div>
              
              {/* Total Conversations Card */}
              <div className="bg-white rounded-lg shadow-sm p-3">
                <p className="text-xs text-gray-500">Conversations</p>
                <p className="text-2xl font-bold text-green-600">{messageStats?.totalConversations || 0}</p>
              </div>
              
              {/* Unread Messages Card */}
              <div className="bg-white rounded-lg shadow-sm p-3">
                <p className="text-xs text-gray-500">Unread</p>
                <p className="text-2xl font-bold text-orange-600">{messageStats?.unreadMessages || 0}</p>
              </div>
              
              {/* Total Users Card */}
              <div className="bg-white rounded-lg shadow-sm p-3">
                <p className="text-xs text-gray-500">Users</p>
                <p className="text-2xl font-bold text-purple-600">{users.length}</p>
              </div>
            </>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 py-1.5 text-sm w-full"
          />
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-3 py-2 border-b bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">Message History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-2 font-medium text-gray-600">Sender</th>
                  <th className="text-left p-2 font-medium text-gray-600">Receiver</th>
                  <th className="text-left p-2 font-medium text-gray-600">Message</th>
                  <th className="text-left p-2 font-medium text-gray-600">Status</th>
                  <th className="text-left p-2 font-medium text-gray-600">Date</th>
                  <th className="text-center p-2 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {showSkeletons ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2"><Skeleton className="h-4 w-24" /></td>
                      <td className="p-2"><Skeleton className="h-4 w-24" /></td>
                      <td className="p-2"><Skeleton className="h-4 w-32" /></td>
                      <td className="p-2"><Skeleton className="h-5 w-14 rounded-full" /></td>
                      <td className="p-2"><Skeleton className="h-4 w-20" /></td>
                      <td className="p-2"><div className="flex gap-1 justify-center"><Skeleton className="h-7 w-7 rounded" /><Skeleton className="h-7 w-7 rounded" /></div></td>
                    </tr>
                  ))
                ) : filteredMessages.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      <MessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
                      No messages found
                    </td>
                  </tr>
                ) : (
                  filteredMessages.map((msg) => (
                    <tr key={msg._id || msg.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-[10px]">
                              {getInitials(msg.sender?.name || msg.senderName || 'A')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm truncate max-w-[100px]">{msg.sender?.name || msg.senderName || 'Admin'}</span>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-gray-100 text-gray-700 text-[10px]">
                              {getInitials(msg.receiver?.name || msg.receiverName || 'U')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm truncate max-w-[100px]">{msg.receiver?.name || msg.receiverName || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="p-2 max-w-[200px]">
                        <p className="text-gray-600 truncate">{msg.content || msg.message}</p>
                      </td>
                      <td className="p-2">{getStatusBadge(msg.status)}</td>
                      <td className="p-2 whitespace-nowrap text-xs text-gray-500">
                        {formatDate(msg.createdAt || msg.timestamp)}
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1 justify-center">
                          <Button variant="ghost" size="sm" onClick={() => handleView(msg)} className="h-7 w-7 p-0">
                            <Eye size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(msg)} className="h-7 w-7 p-0 text-red-500 hover:text-red-700">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!showSkeletons && filteredMessages.length > 0 && (
            <div className="px-3 py-2 border-t bg-gray-50 flex justify-between items-center text-xs">
              <span className="text-gray-500">
                Showing {filteredMessages.length} of {messageStats?.totalMessages || 0} messages
              </span>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="h-7 text-xs">
                  <ChevronLeft size={12} />
                  Prev
                </Button>
                <Button size="sm" variant="outline" disabled={currentPage === (messageStats?.totalPages || 1)} onClick={() => setCurrentPage(p => p + 1)} className="h-7 text-xs">
                  Next
                  <ChevronRight size={12} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Message Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <p className="text-xs text-blue-600">From</p>
                  <p className="font-medium">{selectedMessage.sender?.name || selectedMessage.senderName || 'Admin'}</p>
                  <p className="text-xs text-gray-500 break-all">{selectedMessage.sender?.email || selectedMessage.senderEmail || ''}</p>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <p className="text-xs text-purple-600">To</p>
                  <p className="font-medium">{selectedMessage.receiver?.name || selectedMessage.receiverName || 'Unknown'}</p>
                  <p className="text-xs text-gray-500 break-all">{selectedMessage.receiver?.email || selectedMessage.receiverEmail || ''}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm break-words">{selectedMessage.content || selectedMessage.message}</p>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Status: {selectedMessage.status || 'sent'}</span>
                <span>{formatDate(selectedMessage.createdAt || selectedMessage.timestamp)}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Message?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {messageToDelete && (
            <div className="bg-gray-50 p-2 rounded text-sm">
              <p className="text-gray-500 text-xs">Preview:</p>
              <p className="italic">"{messageToDelete.content?.substring(0, 100)}"</p>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Message Modal */}
      <Dialog open={showSendModal} onOpenChange={setShowSendModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Select 
              value={sendForm.userId} 
              onValueChange={(value) => {
                const selectedUser = users.find(u => (u._id || u.id) === value);
                setSendForm({ ...sendForm, userId: value, receiverName: selectedUser?.name || '' });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user._id || user.id} value={user._id || user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Subject (optional)"
              value={sendForm.subject}
              onChange={(e) => setSendForm({ ...sendForm, subject: e.target.value })}
            />
            <textarea
              placeholder="Type your message..."
              value={sendForm.message}
              onChange={(e) => setSendForm({ ...sendForm, message: e.target.value })}
              className="w-full min-h-[120px] p-2 border rounded resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSendModal(false)}>Cancel</Button>
            <Button onClick={handleSendMessage} disabled={sending} className="bg-green-600">
              {sending ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} className="mr-1" />}
              {sending ? 'Sending...' : 'Send'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;