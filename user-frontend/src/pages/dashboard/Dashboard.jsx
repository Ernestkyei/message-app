import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Send, 
  MessageCircle, 
  Search,
  Smile,
  Paperclip,
  Volume2,
  VolumeX,
  Users,
  Trash2,
  AlertTriangle,
  EyeOff,
  Bell,
  Reply
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import api from '../../services/api';
import endpoints from '../../config/endpoints/endpoints';
import Header from '../../components/common/Header';
import useAuthStore from '@/stores/authStore';
import useMessageStore from '@/stores/messageStore';
import useConversationStore from '@/stores/conversationStore';
import websocketService from '@/services/websocket';

// Import shadcn components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// ==================== UTILITIES ====================

const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getInitials = (name) => {
  if (!name) return 'U';
  return name.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// ==================== SOUND NOTIFICATION ====================
let audioContext = null;
let notificationSoundBuffer = null;

// Create a simple beep sound using Web Audio API
const createBeepSound = () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const duration = 0.3;
    const frequency = 880;
    const sampleRate = audioContext.sampleRate;
    const frames = duration * sampleRate;
    const arrayBuffer = audioContext.createBuffer(1, frames, sampleRate);
    const channelData = arrayBuffer.getChannelData(0);
    
    for (let i = 0; i < frames; i++) {
      const t = i / sampleRate;
      // Two-tone notification sound
      const freq1 = 880;
      const freq2 = 660;
      const freq = t < 0.15 ? freq1 : freq2;
      channelData[i] = Math.sin(freq * 2 * Math.PI * t) * 0.3;
    }
    
    notificationSoundBuffer = arrayBuffer;
  } catch (error) {
    console.warn('Could not create beep sound:', error);
  }
};

// Play notification sound for admin messages
const playNotificationSound = () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      createBeepSound();
    }
    
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    if (notificationSoundBuffer) {
      const source = audioContext.createBufferSource();
      source.buffer = notificationSoundBuffer;
      source.connect(audioContext.destination);
      source.start();
    } else {
      // Fallback: create oscillator
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 880;
      gainNode.gain.value = 0.2;
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.3);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  } catch (error) {
    console.warn('Could not play sound:', error);
  }
};

// ==================== SKELETON COMPONENTS ====================

const UserListSkeleton = () => (
  <div className="flex items-center px-4 py-3">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="ml-3 flex-1">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  </div>
);

const MessageSkeleton = () => (
  <div className="flex justify-start mb-4">
    <Skeleton className="h-16 w-48 rounded-2xl" />
  </div>
);

// ==================== MAIN COMPONENT ====================

export default function Dashboard() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const popupTimeoutRef = useRef(null);
  const audioResumedRef = useRef(false);
  const hasLoadedSavedCounts = useRef(false);
  const lastToastTime = useRef(0);
  const processedAdminMessages = useRef(new Set());
  const messagesEndRef = useRef(null);
  
  // State
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isCurrentUserOnline, setIsCurrentUserOnline] = useState(false);
  const [activeTab, setActiveTab] = useState('chats');
  const [allUsers, setAllUsers] = useState([]);
  const [onlineUsersMap, setOnlineUsersMap] = useState({});
  const [isOnlineLoading, setIsOnlineLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  
  // Track unread messages per conversation
  const [unreadCounts, setUnreadCounts] = useState({});
  
  // Track processed message IDs to prevent duplicates
  const processedMessageIds = useRef(new Set());
  
  // Delete Modal State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  
  // Initialize sound on first user interaction
  useEffect(() => {
    const initAudio = () => {
      if (!audioContext && soundEnabled) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        createBeepSound();
        audioResumedRef.current = true;
      }
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
      }
    };
    
    // Initialize on first click anywhere
    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keypress', handleFirstInteraction);
    };
    
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keypress', handleFirstInteraction);
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keypress', handleFirstInteraction);
    };
  }, [soundEnabled]);
  
  // Stores
  const { 
    messages, 
    loading: messagesLoading, 
    fetchMessages, 
    sendMessage, 
    deleteMessage,
    hideMessage,
    clearMessages,
    initWebSocket,
    addMessage,
    markAsRead,
    fetchTotalUnreadCount
  } = useMessageStore();
  
  const {
    conversations,
    activeConversation,
    loading: conversationsLoading,
    fetchConversations,
    createConversation,
    setActiveConversation,
    clearActiveConversation
  } = useConversationStore();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Helper function to check if a user is online
  const isUserOnlineUpdated = (userId) => {
    return onlineUsersMap[userId] === true;
  };

  // Calculate total unread messages across all conversations
  const totalUnreadMessages = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  // ==================== PERSIST UNREAD COUNTS ====================
  
  const saveUnreadCounts = (counts) => {
    try {
      const userId = currentUser?._id || currentUser?.id;
      if (userId) {
        localStorage.setItem(`unread_counts_${userId}`, JSON.stringify(counts));
        console.log('💾 Saved unread counts to localStorage:', counts);
      }
    } catch (e) {
      console.error('Failed to save unread counts:', e);
    }
  };
  
  const loadUnreadCounts = () => {
    try {
      const userId = currentUser?._id || currentUser?.id;
      if (userId) {
        const saved = localStorage.getItem(`unread_counts_${userId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          console.log('📂 Loaded saved unread counts from localStorage:', parsed);
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load unread counts:', e);
    }
    return {};
  };
  
  useEffect(() => {
    if (currentUser?._id || currentUser?.id) {
      saveUnreadCounts(unreadCounts);
    }
  }, [unreadCounts, currentUser]);
  
  useEffect(() => {
    if (conversations.length > 0 && !hasLoadedSavedCounts.current && currentUser?._id) {
      const savedCounts = loadUnreadCounts();
      if (Object.keys(savedCounts).length > 0) {
        const validCounts = {};
        conversations.forEach(conv => {
          if (savedCounts[conv._id] && savedCounts[conv._id] > 0) {
            validCounts[conv._id] = savedCounts[conv._id];
          }
        });
        if (Object.keys(validCounts).length > 0) {
          console.log('🔄 Restoring unread counts after refresh:', validCounts);
          setUnreadCounts(validCounts);
        }
      }
      hasLoadedSavedCounts.current = true;
    }
  }, [conversations, currentUser]);

  // ==================== WEBSOCKET SETUP ====================

  const connectWebSocket = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    websocketService.connect(token);
    
    websocketService.on('connect', () => {
      console.log('✅ WebSocket connected, socket ID:', websocketService.socket?.id);
      setIsCurrentUserOnline(true);
      setIsOnlineLoading(true);
      
      const userId = currentUser?._id || currentUser?.id;
      if (userId && websocketService.socket) {
        websocketService.socket.emit('join', { userId });
        console.log('🔵 Joined room with user ID:', userId);
      }
      
      setTimeout(() => {
        if (websocketService.socket?.connected) {
          console.log('🔵 Socket is ready to send/receive messages');
          websocketService.socket.emit('getOnlineUsers');
        }
      }, 500);
    });
    
    websocketService.on('newMessage', (messageData) => {
      const message = messageData.data || messageData;
      const messageId = message._id || message.id;
      
      if (processedMessageIds.current.has(messageId)) {
        console.log('⚠️ Duplicate message ignored:', messageId);
        return;
      }
      processedMessageIds.current.add(messageId);
      
      setTimeout(() => {
        processedMessageIds.current.delete(messageId);
      }, 5000);
      
      const messageSenderId = message.sender?._id || message.senderId;
      const currentUserId = currentUser?._id || currentUser?.id;
      const isOwnMessage = messageSenderId === currentUserId;
      const conversationId = message.conversation;
      const isActiveConversation = activeConversation?._id === conversationId;
      
      console.log('📨 NEW MESSAGE RECEIVED:', {
        from: message.sender?.name,
        content: message.content,
        messageId: messageId,
        conversationId: conversationId,
        isOwnMessage: isOwnMessage,
        isActiveConversation: isActiveConversation
      });
      
      if (!isOwnMessage) {
        if (soundEnabled) {
          playNotificationSound();
        }
        
        if (!isActiveConversation) {
          setUnreadCounts(prev => {
            const currentCount = prev[conversationId] || 0;
            const newCount = currentCount + 1;
            console.log(`🟢 GREEN BADGE UPDATE: ${message.sender?.name} -> ${newCount} unread`);
            return {
              ...prev,
              [conversationId]: newCount
            };
          });
        }
        
        fetchConversations();
        fetchTotalUnreadCount();
      } else {
        console.log('📤 Own message - NOT updating badge');
      }
      
      if (isActiveConversation) {
        console.log('✅ Adding to current chat');
        addMessage(message);
        if (!isOwnMessage) {
          markAsRead(conversationId);
          fetchTotalUnreadCount();
          setUnreadCounts(prev => ({
            ...prev,
            [conversationId]: 0
          }));
        }
      }
    });
    
    // ========== ADMIN DIRECT MESSAGE LISTENER WITH SOUND ==========
    websocketService.on('adminDirectMessage', (data) => {
      console.log('🎉 ADMIN MESSAGE RECEIVED!', data);
      
      const messageUniqueId = `${data.message}_${data.timestamp}_${data.from}`;
      
      if (processedAdminMessages.current.has(messageUniqueId)) {
        console.log('⚠️ Duplicate admin message ignored:', messageUniqueId);
        return;
      }
      
      processedAdminMessages.current.add(messageUniqueId);
      
      setTimeout(() => {
        processedAdminMessages.current.delete(messageUniqueId);
      }, 10000);
      
      // Show toast notification
      const now = Date.now();
      if (now - lastToastTime.current > 3000) {
        lastToastTime.current = now;
        toast.success(`📨 New message from Admin`, {
          duration: 5000,
          icon: '📨'
        });
      }
      
      // PLAY SOUND for admin message (if enabled)
      if (soundEnabled) {
        playNotificationSound();
      }
      
      // Create admin user object
      const adminUser = {
        _id: 'admin_special',
        id: 'admin_special',
        name: 'Admin',
        email: 'admin@system.com',
        role: 'admin'
      };
      
      // Create message object with deterministic ID
      const adminMessageObj = {
        _id: `admin_${Date.now()}_${Math.random()}`,
        content: data.message,
        subject: data.subject || 'Message from Admin',
        sender: adminUser,
        senderId: 'admin_special',
        recipient: currentUser?._id,
        createdAt: data.timestamp || new Date().toISOString(),
        read: false,
        isAdminMessage: true
      };
      
      // Save to localStorage for persistence
      const existingMessages = localStorage.getItem(`chat_admin_${currentUser?._id}`);
      let savedMessages = existingMessages ? JSON.parse(existingMessages) : [];
      
      const messageExists = savedMessages.some(msg => 
        msg.content === data.message && 
        new Date(msg.createdAt).getTime() === new Date(data.timestamp).getTime()
      );
      
      if (!messageExists) {
        savedMessages.push(adminMessageObj);
        localStorage.setItem(`chat_admin_${currentUser?._id}`, JSON.stringify(savedMessages.slice(-100)));
      } else {
        console.log('⚠️ Admin message already in localStorage, skipping save');
      }
      
      // Add to messages if currently viewing admin chat
      if (selectedUser?._id === 'admin_special' || selectedUser?.role === 'admin') {
        const messageInCurrent = messages.some(msg => 
          msg.content === data.message && 
          new Date(msg.createdAt).getTime() === new Date(data.timestamp).getTime()
        );
        if (!messageInCurrent) {
          addMessage(adminMessageObj);
        }
      } else {
        // Not viewing admin chat, so increment unread count for admin
        setUnreadCounts(prev => {
          const currentCount = prev['admin_special_conversation'] || 0;
          return {
            ...prev,
            ['admin_special_conversation']: currentCount + 1
          };
        });
      }
    });
    
    websocketService.on('onlineUsersList', (data) => {
      console.log('📋 Online users list:', data);
      const newMap = {};
      (data.onlineUsers || []).forEach(userId => {
        if (userId !== (currentUser?._id || currentUser?.id)) {
          newMap[userId] = true;
        }
      });
      setOnlineUsersMap(newMap);
      setIsOnlineLoading(false);
    });
    
    websocketService.on('userConnected', (data) => {
      const newMap = {};
      (data.onlineUsers || []).forEach(userId => {
        if (userId !== (currentUser?._id || currentUser?.id)) {
          newMap[userId] = true;
        }
      });
      setOnlineUsersMap(newMap);
    });
    
    websocketService.on('userDisconnected', (data) => {
      const newMap = {};
      (data.onlineUsers || []).forEach(userId => {
        if (userId !== (currentUser?._id || currentUser?.id)) {
          newMap[userId] = true;
        }
      });
      setOnlineUsersMap(newMap);
    });
  };

  // ==================== DATA FETCHING ====================

  const fetchUsers = async () => {
    try {
      const response = await api.get(endpoints.user.getAllUsers);
      console.log('📋 Users response:', response.data);
      
      let usersData = [];
      if (response.data.data) {
        usersData = response.data.data;
      } else if (response.data.users) {
        usersData = response.data.users;
      } else if (Array.isArray(response.data)) {
        usersData = response.data;
      }
      
      const currentUserId = currentUser?._id || currentUser?.id;
      const otherUsers = usersData.filter(user => (user._id || user.id) !== currentUserId);
      setUsers(otherUsers);
      console.log('👥 Users for chat:', otherUsers.length);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await api.get(endpoints.user.getAllUsers);
      console.log('📋 All users API response:', response.data);
      
      let usersList = [];
      if (response.data.data) {
        usersList = response.data.data;
      } else if (response.data.users) {
        usersList = response.data.users;
      } else if (Array.isArray(response.data)) {
        usersList = response.data;
      }
      
      setAllUsers(usersList);
      
      const admins = usersList.filter(user => user.role === 'admin');
      console.log(`👑 Found ${admins.length} admins:`, admins.map(a => a.name));
      
    } catch (error) {
      console.error('Failed to fetch all users:', error);
      setAllUsers([]);
    }
  };

  const loadConversations = async () => {
    try {
      await fetchConversations();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // ==================== ACTIONS ====================

  const handleSelectUser = async (user) => {
    if (!user) {
      toast.error('Invalid user');
      return;
    }
    
    setSelectedUser(user);
    setLoading(true);
    
    if (user._id === 'admin_special' || user.id === 'admin_special' || user.role === 'admin') {
      console.log('📁 Loading admin messages from localStorage');
      
      const storedMessages = localStorage.getItem(`chat_admin_${currentUser?._id}`);
      let adminMsgList = storedMessages ? JSON.parse(storedMessages) : [];
      
      adminMsgList = adminMsgList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      console.log(`📨 Found ${adminMsgList.length} admin messages`);
      
      clearMessages();
      adminMsgList.forEach(msg => {
        addMessage(msg);
      });
      
      setUnreadCounts(prev => ({
        ...prev,
        ['admin_special_conversation']: 0
      }));
      
      setActiveConversation({ _id: 'admin_special_conversation', isAdminConversation: true });
      setReplyingTo(null);
      setLoading(false);
      setActiveTab('chats');
      return;
    }
    
    try {
      const userId = user._id || user.id;
      
      let conversation = conversations.find(
        conv => conv.participants?.some(p => (p._id || p.id) === userId)
      );
      
      if (!conversation) {
        conversation = await createConversation(userId);
        await fetchConversations();
      }
      
      if (conversation && conversation._id) {
        setActiveConversation(conversation);
        await fetchMessages(conversation._id);
        await markAsRead(conversation._id);
        await fetchTotalUnreadCount();
        
        console.log(`✅ Clearing badge for conversation: ${conversation._id}`);
        setUnreadCounts(prev => ({
          ...prev,
          [conversation._id]: 0
        }));
        
        setActiveTab('chats');
      } else {
        toast.error('Could not start conversation');
      }
    } catch (error) {
      console.error('Error in handleSelectUser:', error);
      toast.error(error.response?.data?.message || 'Failed to start conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReplyToAdmin = async () => {
    if (!inputMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const replyContent = inputMessage;
    setInputMessage('');
    setReplyingTo(null);

    const replyMessageObj = {
      _id: `reply_${Date.now()}_${Math.random()}`,
      content: replyContent,
      subject: `Re: ${replyingTo?.subject || 'Message from Admin'}`,
      sender: { 
        _id: currentUser?._id, 
        name: currentUser?.name,
        role: 'user'
      },
      senderId: currentUser?._id,
      recipient: 'admin_special',
      createdAt: new Date().toISOString(),
      read: true,
      isReplyToAdmin: true
    };

    const existingMessages = localStorage.getItem(`chat_admin_${currentUser?._id}`);
    let savedMessages = existingMessages ? JSON.parse(existingMessages) : [];
    savedMessages.push(replyMessageObj);
    localStorage.setItem(`chat_admin_${currentUser?._id}`, JSON.stringify(savedMessages.slice(-100)));

    addMessage(replyMessageObj);
    toast.success('Reply sent to Admin', { icon: '✉️', duration: 2000 });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) {
      console.log('🔴 Empty message, not sending');
      return;
    }
    
    if (replyingTo) {
      await handleSendReplyToAdmin();
      return;
    }
    
    if (!activeConversation || !activeConversation._id) {
      console.log('🔴 No active conversation selected');
      toast.error('No conversation selected');
      return;
    }

    const messageContent = inputMessage;
    setInputMessage('');

    try {
      if (websocketService.socket && websocketService.socket.connected) {
        websocketService.socket.emit('sendMessage', {
          conversationId: activeConversation._id,
          content: messageContent
        });
        console.log('✅ Message emitted via Socket.IO');
        
        const tempMessage = {
          _id: Date.now().toString(),
          content: messageContent,
          sender: { _id: currentUser?._id, name: currentUser?.name },
          senderId: currentUser?._id,
          createdAt: new Date().toISOString(),
          read: false
        };
        addMessage(tempMessage);
        
        toast.success('✓ Sent', { duration: 1000, icon: '✅' });
      } else {
        console.error('❌ Socket not connected! Falling back to REST API');
        await sendMessage(activeConversation._id, messageContent);
        toast.success('✓ Sent via API', { duration: 1000, icon: '✅' });
      }
    } catch (error) {
      console.error('❌ Send message error:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
      setInputMessage(messageContent);
    }
  };

  const handleDeleteAdminMessage = (messageId) => {
    setMessageToDelete(messageId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteAdminMessage = async () => {
    if (!messageToDelete) return;
    
    const storedMessages = localStorage.getItem(`chat_admin_${currentUser?._id}`);
    if (storedMessages) {
      let messages = JSON.parse(storedMessages);
      messages = messages.filter(msg => msg._id !== messageToDelete);
      localStorage.setItem(`chat_admin_${currentUser?._id}`, JSON.stringify(messages));
    }
    
    if (selectedUser?._id === 'admin_special' || selectedUser?.role === 'admin') {
      const updatedMessages = localStorage.getItem(`chat_admin_${currentUser?._id}`);
      let msgList = updatedMessages ? JSON.parse(updatedMessages) : [];
      msgList = msgList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      clearMessages();
      msgList.forEach(msg => {
        addMessage(msg);
      });
    }
    
    toast.success('Message deleted', { duration: 2000 });
    setDeleteDialogOpen(false);
    setMessageToDelete(null);
  };

  const handleHideMessage = async (messageId) => {
    try {
      await hideMessage(messageId);
      toast.success('Message hidden', { duration: 2000 });
    } catch (error) {
      toast.error('Failed to hide message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUserInteraction = () => {
    if (!audioResumedRef.current && audioContext && soundEnabled) {
      audioContext.resume();
      audioResumedRef.current = true;
    }
  };

  // ==================== HELPERS ====================

  const getOtherUser = (conversation) => {
    if (conversation._id === 'admin_special_conversation') {
      return { _id: 'admin_special', name: 'Admin', role: 'admin' };
    }
    return conversation.participants?.find(p => 
      (p._id || p.id) !== (currentUser?._id || currentUser?.id)
    );
  };

  const getAllConversations = () => {
    const allConvs = [...conversations];
    
    const storedMessages = localStorage.getItem(`chat_admin_${currentUser?._id}`);
    const hasAdminMessages = storedMessages ? JSON.parse(storedMessages).length > 0 : false;
    const hasAdminInConv = allConvs.some(conv => conv._id === 'admin_special_conversation');
    
    if (hasAdminMessages && !hasAdminInConv && currentUser?._id) {
      const adminConv = {
        _id: 'admin_special_conversation',
        participants: [
          { _id: currentUser._id, name: currentUser.name },
          { _id: 'admin_special', name: 'Admin', role: 'admin' }
        ],
        lastMessage: {
          content: 'Admin messages',
          createdAt: new Date().toISOString()
        },
        updatedAt: new Date().toISOString(),
        isAdminConversation: true
      };
      allConvs.unshift(adminConv);
    }
    
    return allConvs;
  };

  const allConversations = getAllConversations();
  
  const searchedFilteredConversations = allConversations.filter(conv => {
    const otherUser = getOtherUser(conv);
    return otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredAllUsers = allUsers.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ==================== EFFECTS ====================

  useEffect(() => {
    const handleStorageChange = () => {
      if (selectedUser?._id === 'admin_special') {
        const storedMessages = localStorage.getItem(`chat_admin_${currentUser?._id}`);
        let msgList = storedMessages ? JSON.parse(storedMessages) : [];
        msgList = msgList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        clearMessages();
        msgList.forEach(msg => {
          addMessage(msg);
        });
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [selectedUser, currentUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (websocketService.socket?.connected) {
        websocketService.socket.emit('getOnlineUsers');
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    fetchUsers();
    fetchAllUsers();
    loadConversations();
    connectWebSocket();
    fetchTotalUnreadCount();
    
    if (initWebSocket && typeof initWebSocket === 'function') {
      initWebSocket();
    }

    return () => {
      clearMessages();
      clearActiveConversation();
      websocketService.disconnect();
      if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleConnect = () => {
      setIsCurrentUserOnline(true);
    };
    
    const handleDisconnect = () => {
      setIsCurrentUserOnline(false);
    };
    
    websocketService.on('connect', handleConnect);
    websocketService.on('disconnect', handleDisconnect);
    websocketService.on('statusChange', (status) => setIsCurrentUserOnline(status.online));
    
    setIsCurrentUserOnline(websocketService.isCurrentUserOnline?.() || false);
    
    return () => {
      websocketService.off('connect', handleConnect);
      websocketService.off('disconnect', handleDisconnect);
      websocketService.off('statusChange');
    };
  }, []);

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100" onClick={handleUserInteraction}>
      <Header />

      {/* Sound Toggle Button */}
      <button
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="fixed bottom-6 right-6 z-50 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all border border-gray-200"
        title={soundEnabled ? 'Disable sound' : 'Enable sound'}
      >
        {soundEnabled ? <Volume2 className="w-5 h-5 text-green-600" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
      </button>

      {/* Debug counter - Shows total unread */}
      <div className="fixed top-20 right-6 z-50 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-mono">
        📨 Unread: {totalUnreadMessages}
      </div>

      {/* Online Status Loading Indicator */}
      {isOnlineLoading && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg text-sm animate-pulse">
          Loading online users...
        </div>
      )}

      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full mt-4">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col shadow-sm z-0 rounded-2xl overflow-hidden m-2">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'chats' ? "Search conversations..." : "Search users..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('chats')}
              className={cn(
                "flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 relative",
                activeTab === 'chats' 
                  ? "text-blue-600 border-b-2 border-blue-500 bg-blue-50/30" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              Chats ({allConversations.length})
              {totalUnreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-md ring-2 ring-white animate-pulse">
                  {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={cn(
                "flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2",
                activeTab === 'users' 
                  ? "text-blue-600 border-b-2 border-blue-500 bg-blue-50/30" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <Users className="w-4 h-4" />
              All Users ({allUsers.length})
            </button>
          </div>

          {activeTab === 'chats' ? (
            <ul className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {loading || conversationsLoading ? (
                Array(5).fill(0).map((_, i) => <UserListSkeleton key={i} />)
              ) : searchedFilteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                  <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No conversations yet</p>
                  <p className="text-gray-400 text-xs mt-1">Click "All Users" tab to start chatting</p>
                </div>
              ) : (
                searchedFilteredConversations.map((conversation) => {
                  const otherUser = getOtherUser(conversation);
                  if (!otherUser) return null;
                  
                  const isOnline = isUserOnlineUpdated(otherUser._id || otherUser.id);
                  const unreadCount = unreadCounts[conversation._id] || 0;
                  const isAdminConv = conversation._id === 'admin_special_conversation';
                  
                  return (
                    <li
                      key={conversation._id}
                      onClick={() => handleSelectUser(otherUser)}
                      className={cn(
                        "group flex items-center px-4 py-3 cursor-pointer transition-all duration-200",
                        activeConversation?._id === conversation._id ? "bg-blue-50" : "",
                        unreadCount > 0 && activeConversation?._id !== conversation._id 
                          ? "bg-blue-100 hover:bg-blue-200 border-l-4 border-blue-500" 
                          : "hover:bg-gray-50"
                      )}
                    >
                      <div className="relative flex-shrink-0">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm",
                          unreadCount > 0 && activeConversation?._id !== conversation._id
                            ? "bg-gradient-to-br from-orange-500 to-red-600 ring-2 ring-orange-300"
                            : isAdminConv
                              ? "bg-gradient-to-br from-purple-500 to-purple-700 ring-2 ring-purple-300"
                              : "bg-gradient-to-br from-blue-400 to-blue-600"
                        )}>
                          {getInitials(otherUser.name)}
                        </div>
                        {isOnline && unreadCount === 0 && !isAdminConv && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 ring-2 ring-white rounded-full animate-pulse"></span>
                        )}
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                        )}
                      </div>
                      <div className="flex-1 ml-3 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-sm font-medium truncate",
                              unreadCount > 0 && activeConversation?._id !== conversation._id
                                ? "text-blue-800 font-bold"
                                : "text-gray-800"
                            )}>
                              {otherUser.name}
                            </span>
                            {(otherUser.role === 'admin' || isAdminConv) && (
                              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                                Admin
                              </span>
                            )}
                          </div>
                          {unreadCount > 0 && (
                            <div className="bg-green-500 text-white text-xs font-bold rounded-full min-w-[28px] h-6 px-2 flex items-center justify-center shadow-md ring-2 ring-green-300 animate-bounce">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </div>
                          )}
                        </div>
                        <p className={cn(
                          "text-xs truncate",
                          unreadCount > 0 && activeConversation?._id !== conversation._id
                            ? "text-blue-700 font-medium"
                            : "text-gray-500"
                        )}>
                          {conversation.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                      <div className="ml-2 text-xs">
                        {isOnline && !isAdminConv ? (
                          <span className="text-green-600 font-medium">● Online</span>
                        ) : isAdminConv ? (
                          <span className="text-purple-600 font-medium">★ Admin</span>
                        ) : (
                          <span className="text-gray-400">○ Offline</span>
                        )}
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          ) : (
            <ul className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {filteredAllUsers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                  <Users className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No users found</p>
                  <p className="text-gray-400 text-xs mt-1">Try a different search</p>
                </div>
              ) : (
                filteredAllUsers.map((user) => {
                  const isOnline = isUserOnlineUpdated(user._id || user.id);
                  const isAdmin = user.role === 'admin';
                  
                  const conversationWithUser = conversations.find(conv => 
                    conv.participants?.some(p => (p._id || p.id) === (user._id || user.id))
                  );
                  
                  const unreadCount = conversationWithUser 
                    ? (unreadCounts[conversationWithUser._id] || 0)
                    : 0;
                  
                  return (
                    <li
                      key={user._id || user.id}
                      onClick={() => handleSelectUser(user)}
                      className={cn(
                        "group flex items-center px-4 py-3 cursor-pointer transition-all duration-200",
                        unreadCount > 0 ? "bg-blue-100 hover:bg-blue-200 border-l-4 border-blue-500" : "hover:bg-gray-50"
                      )}
                    >
                      <div className="relative flex-shrink-0">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm",
                          unreadCount > 0
                            ? "bg-gradient-to-br from-orange-500 to-red-600 ring-2 ring-orange-300"
                            : isAdmin 
                              ? "bg-gradient-to-br from-purple-500 to-purple-700 ring-2 ring-purple-300"
                              : "bg-gradient-to-br from-green-400 to-teal-500"
                        )}>
                          {getInitials(user.name)}
                        </div>
                        {isOnline && unreadCount === 0 && (
                          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 ring-2 ring-white rounded-full animate-pulse"></span>
                        )}
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                        )}
                      </div>
                      <div className="flex-1 ml-3 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-sm font-medium truncate",
                              unreadCount > 0 ? "text-blue-800 font-bold" : "text-gray-800"
                            )}>
                              {user.name}
                            </span>
                            {isAdmin && (
                              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                                Admin
                              </span>
                            )}
                          </div>
                          {unreadCount > 0 && (
                            <div className="bg-green-500 text-white text-xs font-bold rounded-full min-w-[28px] h-6 px-2 flex items-center justify-center shadow-md ring-2 ring-green-300 animate-bounce">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </div>
                          )}
                        </div>
                        <p className={cn(
                          "text-xs truncate",
                          unreadCount > 0 ? "text-blue-700 font-medium" : "text-gray-500"
                        )}>
                          {user.email}
                        </p>
                      </div>
                      <div className="ml-2 text-xs">
                        {isOnline ? (
                          <span className="text-green-600 font-medium">● Online</span>
                        ) : (
                          <span className="text-gray-400">○ Offline</span>
                        )}
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          )}

          <div className="p-3 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Online now</span>
              {isOnlineLoading ? (
                <span className="text-green-600 font-medium animate-pulse">Loading...</span>
              ) : (
                <span className="text-green-600 font-medium">
                  {Object.keys(onlineUsersMap).length + (isCurrentUserOnline ? 1 : 0)} users
                </span>
              )}
            </div>
          </div>
        </aside>

        {/* Chat Area */}
        <section className="flex-1 flex flex-col bg-gray-50 m-2 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-white shadow-sm">
            {loading ? (
              <div className="flex items-center">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-3">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ) : selectedUser ? (
              <div className="flex items-center">
                <div className="relative">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm",
                    selectedUser._id === 'admin_special' || selectedUser.role === 'admin'
                      ? "bg-gradient-to-br from-purple-500 to-purple-700"
                      : "bg-gradient-to-br from-blue-400 to-blue-600"
                  )}>
                    {getInitials(selectedUser.name)}
                  </div>
                  {isUserOnlineUpdated(selectedUser._id || selectedUser.id) && selectedUser._id !== 'admin_special' && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 ring-2 ring-white rounded-full animate-pulse"></span>
                  )}
                </div>
                <div className="ml-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800 text-lg">{selectedUser.name}</span>
                    {(selectedUser.role === 'admin' || selectedUser._id === 'admin_special') && (
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Admin</span>
                    )}
                  </div>
                  {selectedUser._id !== 'admin_special' && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isUserOnlineUpdated(selectedUser._id || selectedUser.id) 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {isUserOnlineUpdated(selectedUser._id || selectedUser.id) ? 'Online' : 'Offline'}
                    </span>
                  )}
                  {selectedUser._id === 'admin_special' && (
                    <span className="text-xs text-purple-600">Official Admin Account</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <MessageCircle className="w-8 h-8 text-gray-400" />
                <span className="ml-3 text-gray-500">Select a conversation to start messaging</span>
              </div>
            )}
            
            {selectedUser && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className={`w-2 h-2 rounded-full ${isCurrentUserOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                <span>{isCurrentUserOnline ? 'You are online' : 'You are offline'}</span>
              </div>
            )}
          </div>

          {/* Reply Indicator */}
          {replyingTo && (
            <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Reply className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-700">
                  Replying to: <span className="font-medium">"{replyingTo.content?.substring(0, 50)}"</span>
                </span>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-yellow-600 hover:text-yellow-800 text-xs"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messagesLoading ? (
              Array(6).fill(0).map((_, i) => <MessageSkeleton key={i} />)
            ) : !selectedUser ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">Select a conversation to start messaging</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-gray-600 font-medium mb-1">No messages yet</h3>
                  <p className="text-gray-400 text-sm">
                    {selectedUser._id === 'admin_special' || selectedUser.role === 'admin' 
                      ? 'Admin messages will appear here. Click reply to respond.' 
                      : 'Send a message to start the conversation'}
                  </p>
                </div>
              </div>
            ) : (
              [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((msg, index) => {
                const currentUserId = currentUser?.id || currentUser?._id;
                const senderId = msg.senderId || msg.sender?._id;
                const isSent = senderId === currentUserId;
                const isAdminMessage = msg.isAdminMessage || msg.sender?.role === 'admin';
                const isReplyToAdmin = msg.isReplyToAdmin;
                
                const uniqueKey = `${msg._id || msg.id || index}_${msg.createdAt || Date.now()}_${index}`;
                
                return (
                  <div 
                    key={uniqueKey} 
                    className={`flex ${isSent ? 'justify-end' : 'justify-start'} group`}
                  >
                    <div className={`max-w-md px-5 py-2.5 rounded-2xl shadow-sm relative ${
                      isSent
                        ? isReplyToAdmin
                          ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-br-sm'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm'
                        : isAdminMessage
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-bl-sm'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                    }`}>
                      {!isSent && isAdminMessage && (
                        <div className="text-xs text-white/70 mb-1 font-semibold">
                          📨 Admin Message
                        </div>
                      )}
                      {isSent && isReplyToAdmin && (
                        <div className="text-xs text-white/70 mb-1 font-semibold">
                          ✉️ Reply to Admin
                        </div>
                      )}
                      {msg.subject && msg.subject !== 'Message from Admin' && !isSent && (
                        <div className="text-xs font-semibold text-yellow-200 mb-1">
                          📌 {msg.subject}
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <div className={`text-xs mt-1.5 ${isSent ? 'text-blue-100' : isAdminMessage ? 'text-purple-100' : 'text-gray-400'} flex items-center gap-1`}>
                        {formatMessageTime(msg.createdAt)}
                        {isSent && (msg.read ? <span className="ml-1">✓✓</span> : <span className="ml-1">✓</span>)}
                      </div>
                      
                      {!isSent && isAdminMessage && (
                        <>
                          <button
                            onClick={() => {
                              setReplyingTo(msg);
                              toast.success('Reply mode activated', { duration: 1500 });
                            }}
                            className="absolute -bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-purple-500 text-white rounded-full p-1.5 shadow-md hover:bg-purple-600 hover:scale-110"
                            title="Reply to Admin"
                          >
                            <Reply className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAdminMessage(msg._id)}
                            className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 hover:scale-110"
                            title="Delete message (only for you)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      
                      {!isAdminMessage && !isReplyToAdmin && (
                        <button
                          onClick={() => handleHideMessage(msg._id || msg.id)}
                          className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gray-500 text-white rounded-full p-1.5 shadow-md hover:bg-gray-600 hover:scale-110"
                          title="Hide (only for you)"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                        </button>
                      )}
                      
                      {isSent && !isAdminMessage && !isReplyToAdmin && (
                        <button
                          onClick={() => {
                            const msgId = msg._id || msg.id;
                            setMessageToDelete(msgId);
                            setDeleteDialogOpen(true);
                          }}
                          className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white rounded-full p-1.5 shadow-md hover:shadow-lg hover:scale-110 border border-gray-200"
                          title="Delete for everyone"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {!loading && selectedUser && (
            <div className="border-t border-gray-200 px-6 py-4 bg-white">
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={replyingTo ? `Reply to Admin...` : `Message ${selectedUser.name}...`}
                    rows={1}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
                  <Smile className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className={cn(
                    "text-white p-2.5 rounded-xl transition-all",
                    replyingTo
                      ? "bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                      : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
                    !inputMessage.trim() && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
            
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center ring-4 ring-red-100">
                  <AlertTriangle className="w-7 h-7 text-red-500" strokeWidth={1.5} />
                </div>
              </div>

              <DialogHeader className="text-center">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Delete Message?
                </DialogTitle>
                <DialogDescription className="text-gray-500 text-center mt-2">
                  Are you sure you want to delete this message?
                  <br />
                  This action <span className="font-semibold text-red-500">cannot be undone</span>.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="flex flex-row gap-3 mt-6 sm:justify-center">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  className="flex-1 h-10 rounded-lg border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDeleteAdminMessage}
                  className="flex-1 h-10 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Yes, Delete
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce {
          animation: bounce 0.5s ease-in-out 3;
        }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
      `}</style>
    </div>
  );
}