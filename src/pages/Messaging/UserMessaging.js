import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiPaperclip, FiSend, FiSmile, FiMoreVertical } from 'react-icons/fi';
import './UserMessaging.css';

const UserMessaging = () => {
  const [userList, setUserList] = useState([
    {
      id: 1,
      name: 'Raj Kumar',
      email: 'raj.kumar@example.com',
      lastMessage: 'Can you help me with the booking?',
      timestamp: '3:15 PM',
      avatar: '👨',
      unreadCount: 2,
      online: true,
    },
    {
      id: 2,
      name: 'Priya Singh',
      email: 'priya.singh@example.com',
      lastMessage: 'The wedding package looks great!',
      timestamp: '2:50 PM',
      avatar: '👩',
      unreadCount: 0,
      online: true,
    },
    {
      id: 3,
      name: 'Amit Patel',
      email: 'amit.patel@example.com',
      lastMessage: 'When can I schedule the event?',
      timestamp: 'Yesterday',
      avatar: '👨‍💼',
      unreadCount: 1,
      online: false,
    },
    {
      id: 4,
      name: 'Sneha Gupta',
      email: 'sneha.gupta@example.com',
      lastMessage: 'Thanks for the quick response!',
      timestamp: '2 days ago',
      avatar: '👩‍🎓',
      unreadCount: 0,
      online: true,
    },
    {
      id: 5,
      name: 'Vikram Sharma',
      email: 'vikram.sharma@example.com',
      lastMessage: 'Need help with corporate event',
      timestamp: '2 days ago',
      avatar: '👔',
      unreadCount: 0,
      online: false,
    },
  ]);

  const [selectedUser, setSelectedUser] = useState(userList[0]);
  const [messages, setMessages] = useState({
    1: [
      { id: 1, sender: 'user', text: 'Hi, I\'m interested in booking an event', timestamp: '2:45 PM' },
      { id: 2, sender: 'admin', text: 'Hello! I\'d be happy to help you. What type of event?', timestamp: '2:50 PM' },
      { id: 3, sender: 'user', text: 'Can you help me with the booking?', timestamp: '3:15 PM' },
    ],
    2: [
      { id: 1, sender: 'user', text: 'Hi there!', timestamp: '2:30 PM' },
      { id: 2, sender: 'admin', text: 'Hey! How can I assist you?', timestamp: '2:35 PM' },
      { id: 3, sender: 'user', text: 'The wedding package looks great!', timestamp: '2:50 PM' },
    ],
    3: [
      { id: 1, sender: 'user', text: 'Hello', timestamp: 'Yesterday' },
      { id: 2, sender: 'admin', text: 'Hi Amit! Welcome!', timestamp: 'Yesterday' },
      { id: 3, sender: 'user', text: 'When can I schedule the event?', timestamp: 'Yesterday' },
    ],
    4: [
      { id: 1, sender: 'admin', text: 'Hi Sneha! How are you?', timestamp: '2 days ago' },
      { id: 2, sender: 'user', text: 'Great! Everything is set', timestamp: '2 days ago' },
      { id: 3, sender: 'user', text: 'Thanks for the quick response!', timestamp: '2 days ago' },
    ],
    5: [
      { id: 1, sender: 'user', text: 'Hi, I have a corporate event', timestamp: '2 days ago' },
    ],
  });

  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedUser, messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: (messages[selectedUser.id] || []).length + 1,
        sender: 'admin',
        text: messageInput,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages({
        ...messages,
        [selectedUser.id]: [...(messages[selectedUser.id] || []), newMessage],
      });

      setMessageInput('');
      setIsTyping(false);

      // Simulate user typing response
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const autoResponse = {
            id: (messages[selectedUser.id] || []).length + 2,
            sender: 'user',
            text: 'Thanks for your help!',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages(prev => ({
            ...prev,
            [selectedUser.id]: [...(prev[selectedUser.id] || []), autoResponse],
          }));
          setIsTyping(false);
        }, 1500);
      }, 500);
    }
  };

  const filteredUsers = userList.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    // Clear unread count
    setUserList(userList.map(u =>
      u.id === user.id ? { ...u, unreadCount: 0 } : u
    ));
  };

  return (
    <div className="user-messaging-container">
      {/* Left Panel - Chat List */}
      <div className="chat-list-panel">
        <div className="chat-list-header">
          <h2>User Messages</h2>
        </div>

        <div className="search-box">
          <FiSearch size={18} />
          <input
            type="text"
            placeholder="Search user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="chat-list">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`chat-item ${selectedUser.id === user.id ? 'active' : ''}`}
              onClick={() => handleSelectUser(user)}
            >
              <div className="chat-avatar">
                <span className="avatar-emoji">{user.avatar}</span>
                {user.online && <div className="online-indicator"></div>}
              </div>
              <div className="chat-info">
                <div className="chat-header-row">
                  <h4 className="chat-name">{user.name}</h4>
                  <span className="chat-time">{user.timestamp}</span>
                </div>
                <p className="chat-message">{user.lastMessage}</p>
              </div>
              {user.unreadCount > 0 && (
                <div className="unread-badge">{user.unreadCount}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat Window */}
      <div className="chat-window-panel">
        {selectedUser && (
          <>
            {/* Chat Header */}
            <div className="chat-window-header">
              <div className="header-left">
                <div className="header-avatar">
                  <span>{selectedUser.avatar}</span>
                  {selectedUser.online && <div className="online-indicator"></div>}
                </div>
                <div className="header-info">
                  <h3>{selectedUser.name}</h3>
                  <p className="header-status">
                    {selectedUser.online ? '🟢 Online now' : '⏱️ Last seen 1h ago'}
                  </p>
                </div>
              </div>
              <div className="header-actions">
                <button className="header-btn">
                  <FiMoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
              {(messages[selectedUser.id] || []).map((message) => (
                <div
                  key={message.id}
                  className={`message-bubble ${message.sender === 'admin' ? 'admin' : 'user'}`}
                >
                  <p className="message-text">{message.text}</p>
                  <span className="message-time">{message.timestamp}</span>
                </div>
              ))}
              {isTyping && (
                <div className="message-bubble user typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="message-input-area">
              <div className="input-row">
                <button className="input-btn">
                  <FiPaperclip size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Type a message…"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button className="input-btn">
                  <FiSmile size={20} />
                </button>
                <button className="send-btn" onClick={handleSendMessage}>
                  <FiSend size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserMessaging;