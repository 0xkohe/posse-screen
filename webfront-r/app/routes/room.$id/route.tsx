import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

// Message component to display individual chat messages
const ChatMessage = ({ message, isOwn }) => {
  return (
    <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`px-4 py-3 rounded-lg max-w-xs sm:max-w-md lg:max-w-lg ${
        isOwn 
          ? 'bg-indigo-600 text-white rounded-br-none' 
          : 'bg-gray-700 text-gray-100 rounded-bl-none'
      }`}>
        <p className="text-sm">{message.text}</p>
        <span className="text-xs mt-1 opacity-70 block text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

// Main Chat Page Component
const ChatPage = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey there! How's it going?", timestamp: new Date(Date.now() - 1000 * 60 * 60), isOwn: false },
    { id: 2, text: "I'm doing great! Just working on this new project.", timestamp: new Date(Date.now() - 1000 * 60 * 30), isOwn: true },
    { id: 3, text: "That sounds exciting! What kind of project is it?", timestamp: new Date(Date.now() - 1000 * 60 * 20), isOwn: false },
    { id: 4, text: "It's a new chat application with a modern dark mode interface.", timestamp: new Date(Date.now() - 1000 * 60 * 10), isOwn: true },
    { id: 5, text: "That sounds awesome! I'd love to see it when it's ready.", timestamp: new Date(Date.now() - 1000 * 60 * 5), isOwn: false },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Focus the input field when component mounts
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (newMessage.trim() === '') return;
    
    // Add new message to the messages array
    const newMsg = {
      id: messages.length + 1,
      text: newMessage,
      timestamp: new Date(),
      isOwn: true
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate a response after a short delay
    setTimeout(() => {
      const responseMsg = {
        id: messages.length + 2,
        text: "Thanks for your message! This is an automated response.",
        timestamp: new Date(),
        isOwn: false
      };
      setMessages(prev => [...prev, responseMsg]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
              <span className="text-lg font-medium">C</span>
            </div>
            <div className="ml-3">
              <h2 className="font-semibold">Chat #{chatId || '1'}</h2>
              <p className="text-xs text-gray-400">Online</p>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </header>
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} isOwn={message.isOwn} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input Area */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <button type="button" className="p-2 rounded-full hover:bg-gray-700 transition text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <button type="button" className="p-2 rounded-full hover:bg-gray-700 transition text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            onClick={handleSendMessage}
            className="p-2 bg-indigo-600 rounded-full hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newMessage.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;