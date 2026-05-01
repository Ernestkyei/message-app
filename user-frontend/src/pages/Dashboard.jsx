import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { 
  Send, 
  LogOut, 
  MessageCircle, 
  MoreVertical,
  Search,
  Smile,
  Paperclip,
  Phone,
  Video,
  Info
} from 'lucide-react';

// Mock Data
const users = [
  { id: 1, name: "Alice Green", status: "Online", lastMessage: "Hey, just checking in...", online: true, unreadCount: 2 },
  { id: 2, name: "Ben Carter", status: "Idle", lastMessage: "Hey, just checking in...", online: true, unreadCount: 0 },
  { id: 3, name: "Chloe Davies", status: "Online", lastMessage: "Hey, just checking in...", online: true, unreadCount: 1 },
  { id: 4, name: "David Evans", status: "Online", lastMessage: "Hey, just checking in...", online: true, unreadCount: 0 },
  { id: 5, name: "Eva Fisher", status: "Online", lastMessage: "Hey, just checking in...", online: true, unreadCount: 0 },
  { id: 6, name: "Frank Garcia", status: "Offline", lastMessage: "Hey, just checking in...", online: false, unreadCount: 0 },
  { id: 7, name: "Grace Hall", status: "Online", lastMessage: "Hey, just checking in...", online: true, unreadCount: 3 },
];

const initialMessages = [
  { id: 1, from: "Alice", fromId: 1, text: "Hi there! How are you?", time: "11:00 PM", self: false, read: true, delivered: true },
  { id: 2, from: "You", fromId: 0, text: "I'm good, how about you?", time: "11:02 PM", self: true, read: true, delivered: true },
  { id: 3, from: "Alice", fromId: 1, text: "Doing well, thanks! What's up?", time: "3:00 PM", self: false, read: true, delivered: true },
  { id: 4, from: "You", fromId: 0, text: "Just working on a new project. It's pretty exciting!", time: "3:05 PM", self: true, read: true, delivered: true },
  { id: 5, from: "Alice", fromId: 1, text: "That sounds great! Would love to hear more about it.", time: "3:06 PM", self: false, read: false, delivered: true },
];

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'Online': return 'bg-green-500';
    case 'Idle': return 'bg-yellow-500';
    case 'Do Not Disturb': return 'bg-red-500';
    case 'Offline': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};

// Helper function to format time
const formatMessageTime = (time) => {
  return time;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle sending message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      from: "You",
      fromId: 0,
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      self: true,
      read: false,
      delivered: true
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate reply
      const replyMessage = {
        id: messages.length + 2,
        from: selectedUser.name.split(' ')[0],
        fromId: selectedUser.id,
        text: "Thanks for your message! I'll get back to you shortly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        self: false,
        read: false,
        delivered: true
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 2000);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle logout with toast - matching your App.jsx style
  const handleLogout = () => {
    toast.success('Logged out successfully!');    
    setTimeout(() => {
      navigate('/auth/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 h-16 max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-sm">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Messaging App
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Dashboard
            </Link>
            <Link to="/profile" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Profile
            </Link>
            <Link to="/settings" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              Settings
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative group">
              <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-1.5 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full">
        {/* Sidebar - Users List */}
        <aside className="w-80 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col shadow-sm z-0">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Users List Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Messages</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {users.length} contacts
            </span>
          </div>

          {/* Users List */}
          <ul className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent ${
                  selectedUser.id === user.id ? 'bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center font-bold text-gray-700 text-lg shadow-sm">
                    {user.name[0]}
                  </div>
                  {user.online && (
                    <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${getStatusColor(user.status)} border-2 border-white rounded-full`}></span>
                  )}
                </div>
                <div className="flex-1 ml-3 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800 text-sm truncate">{user.name}</span>
                    {user.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {user.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-gray-500 truncate">{user.lastMessage}</p>
                    <span className="text-xs text-gray-400 ml-2 flex-shrink-0">12:30</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Chat Area */}
        <section className="flex-1 flex flex-col bg-gray-50">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white shadow-sm">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-sm">
                  {selectedUser.name[0]}
                </div>
                {selectedUser.online && (
                  <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${getStatusColor(selectedUser.status)} border-2 border-white rounded-full`}></span>
                )}
              </div>
              <div className="ml-3">
                <span className="font-semibold text-gray-800 text-lg">{selectedUser.name}</span>
                <div className="flex items-center mt-0.5">
                  <span className={`text-xs ${selectedUser.online ? 'text-green-600' : 'text-gray-500'}`}>
                    {selectedUser.online ? 'Online' : 'Offline'}
                  </span>
                  {selectedUser.status === 'Idle' && (
                    <span className="text-xs text-yellow-600 ml-2">· Idle</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex animate-slideIn ${msg.self ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md px-5 py-2.5 rounded-2xl shadow-sm ${
                  msg.self 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className={`text-xs mt-1.5 ${msg.self ? 'text-blue-100' : 'text-gray-400'} flex items-center gap-1`}>
                    {formatMessageTime(msg.time)}
                    {msg.self && msg.read && (
                      <span className="ml-1">✓✓</span>
                    )}
                    {msg.self && !msg.read && msg.delivered && (
                      <span className="ml-1">✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 px-6 py-4 bg-white">
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${selectedUser.name.split(' ')[0]}...`}
                  rows={1}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}