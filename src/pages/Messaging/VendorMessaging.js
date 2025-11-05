import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiPaperclip, FiSend, FiSmile } from 'react-icons/fi';
import './VendorMessaging.css';

const VendorMessaging = () => {
  const [vendorList, setVendorList] = useState([
    {
      id: 1,
      name: 'Pink Palace Decor',
      email: 'pink.palace@example.com',
      lastMessage: 'Need update on catering setup...',
      timestamp: '2:45 PM',
      avatar: '👰',
      unreadCount: 3,
      online: true,
    },
    {
      id: 2,
      name: 'Dream Events',
      email: 'dream.events@example.com',
      lastMessage: 'Please confirm payment details...',
      timestamp: '1:30 PM',
      avatar: '🎉',
      unreadCount: 1,
      online: true,
    },
    {
      id: 3,
      name: 'Golden Catering',
      email: 'golden.catering@example.com',
      lastMessage: 'Menu options sent',
      timestamp: 'Yesterday',
      avatar: '🍽️',
      unreadCount: 0,
      online: false,
    },
    {
      id: 4,
      name: 'Sparkle Decorations',
      email: 'sparkle.deco@example.com',
      lastMessage: 'Designs approved!',
      timestamp: 'Yesterday',
      avatar: '✨',
      unreadCount: 0,
      online: true,
    },
  ]);

  const [selectedVendor, setSelectedVendor] = useState(vendorList[0]);
  const [messages, setMessages] = useState({
    1: [
      { id: 1, sender: 'vendor', text: 'Hi, I need details about the event setup', timestamp: '2:30 PM' },
      { id: 2, sender: 'admin', text: 'Sure! What specific details do you need?', timestamp: '2:35 PM' },
      { id: 3, sender: 'vendor', text: 'Need update on catering setup...', timestamp: '2:45 PM' },
    ],
    2: [
      { id: 1, sender: 'vendor', text: 'When is the payment due?', timestamp: '1:15 PM' },
      { id: 2, sender: 'admin', text: 'Payment due date is March 15th', timestamp: '1:20 PM' },
      { id: 3, sender: 'vendor', text: 'Please confirm payment details...', timestamp: '1:30 PM' },
    ],
    3: [
      { id: 1, sender: 'admin', text: 'Hi Golden Catering', timestamp: '10:00 AM' },
      { id: 2, sender: 'vendor', text: 'Menu options sent', timestamp: '10:30 AM' },
    ],
    4: [
      { id: 1, sender: 'vendor', text: 'Designs are ready', timestamp: 'Yesterday' },
      { id: 2, sender: 'admin', text: 'Great! Let me check', timestamp: 'Yesterday' },
      { id: 3, sender: 'vendor', text: 'Designs approved!', timestamp: 'Yesterday' },
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
  }, [selectedVendor, messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: (messages[selectedVendor.id] || []).length + 1,
        sender: 'admin',
        text: messageInput,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages({
        ...messages,
        [selectedVendor.id]: [...(messages[selectedVendor.id] || []), newMessage],
      });

      setMessageInput('');
      setIsTyping(false);

      // Simulate vendor typing response
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const autoResponse = {
            id: (messages[selectedVendor.id] || []).length + 2,
            sender: 'vendor',
            text: 'Thanks for your message! I\'ll get back to you soon.',
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages(prev => ({
            ...prev,
            [selectedVendor.id]: [...(prev[selectedVendor.id] || []), autoResponse],
          }));
          setIsTyping(false);
        }, 1500);
      }, 500);
    }
  };

  const filteredVendors = vendorList.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectVendor = (vendor) => {
    setSelectedVendor(vendor);
    // Clear unread count
    setVendorList(vendorList.map(v =>
      v.id === vendor.id ? { ...v, unreadCount: 0 } : v
    ));
  };

  return (
    <div className="vendor-messaging-container">
      {/* Left Panel - Chat List */}
      <div className="chat-list-panel">
        <div className="chat-list-header">
          <h2>Vendor Messages</h2>
        </div>

        <div className="search-box">
          <FiSearch size={18} />
          <input
            type="text"
            placeholder="Search vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="chat-list">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className={`chat-item ${selectedVendor.id === vendor.id ? 'active' : ''}`}
              onClick={() => handleSelectVendor(vendor)}
            >
              <div className="chat-avatar">
                <span className="avatar-emoji">{vendor.avatar}</span>
                {vendor.online && <div className="online-indicator"></div>}
              </div>
              <div className="chat-info">
                <div className="chat-header-row">
                  <h4 className="chat-name">{vendor.name}</h4>
                  <span className="chat-time">{vendor.timestamp}</span>
                </div>
                <p className="chat-message">{vendor.lastMessage}</p>
              </div>
              {vendor.unreadCount > 0 && (
                <div className="unread-badge">{vendor.unreadCount}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat Window */}
      <div className="chat-window-panel">
        {selectedVendor && (
          <>
            {/* Chat Header */}
            <div className="chat-window-header">
              <div className="header-left">
                <div className="header-avatar">
                  <span>{selectedVendor.avatar}</span>
                  {selectedVendor.online && <div className="online-indicator"></div>}
                </div>
                <div className="header-info">
                  <h3>{selectedVendor.name}</h3>
                  <p className="header-status">
                    {selectedVendor.online ? '🟢 Online' : '⏱️ Last seen 2h ago'}
                  </p>
                </div>
              </div>
              <div className="header-actions">
                <button className="header-btn">⋮</button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
              {(messages[selectedVendor.id] || []).map((message) => (
                <div
                  key={message.id}
                  className={`message-bubble ${message.sender === 'admin' ? 'admin' : 'vendor'}`}
                >
                  <p className="message-text">{message.text}</p>
                  <span className="message-time">{message.timestamp}</span>
                </div>
              ))}
              {isTyping && (
                <div className="message-bubble vendor typing">
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
                  placeholder="Type a message..."
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

export default VendorMessaging;