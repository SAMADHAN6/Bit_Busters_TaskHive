import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Bot } from 'lucide-react';

const ChatFeed = ({ messages }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageTypeColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAgentColor = (agentId) => {
    if (!agentId) return 'gray';
    
    const colors = {
      nova: 'nova-blue',
      athena: 'athena-purple',
      pixel: 'pixel-orange',
      lex: 'lex-green',
      system: 'gray'
    };
    return colors[agentId.toLowerCase()] || 'gray';
  };

  return (
    <div className="card h-[calc(100vh-12rem)] flex flex-col relative" style={{ minHeight: '500px' }}>
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200">
        <MessageCircle className="w-5 h-5 text-nova-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Agent Chat</h3>
        <div className="ml-auto text-sm text-gray-500">
          {messages.length} messages
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide pb-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={`${message.timestamp}-${index}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start space-x-3 ${
                message.agent && message.agent === 'system' ? 'justify-center' : ''
              }`}
            >
              {message.agent && message.agent !== 'system' && (
                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-${getAgentColor(message.agent)}-100 flex items-center justify-center`}>
                  <span className="text-sm font-medium text-gray-700">
                    {message.emoji || '🤖'}
                  </span>
                </div>
              )}
              
              <div className={`flex-1 ${
                message.agent && message.agent === 'system' 
                  ? 'text-center max-w-md mx-auto' 
                  : ''
              }`}>
                {message.agent && message.agent !== 'system' && (
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`text-sm font-semibold text-${getAgentColor(message.agent)}-700`}>
                      {message.agent.charAt(0).toUpperCase() + message.agent.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                )}
                
                <div className={`p-3 rounded-lg border ${
                  message.agent && message.agent === 'system' 
                    ? getMessageTypeColor(message.type)
                    : 'bg-white border-gray-200'
                }`}>
                  <p className="text-sm leading-relaxed">
                    {message.message}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Empty State */}
      {messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 py-8"
        >
          <Bot className="w-16 h-16 mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2">No messages yet</p>
          <p className="text-sm max-w-xs">
            Agent conversations will appear here as they collaborate on your task
          </p>
          
          {/* Animated Elements for Better Visual Appeal */}
          <div className="mt-6 flex space-x-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              className="w-3 h-3 bg-nova-blue-300 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
              className="w-3 h-3 bg-athena-purple-300 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.6 }}
              className="w-3 h-3 bg-pixel-orange-300 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.9 }}
              className="w-3 h-3 bg-lex-green-300 rounded-full"
            />
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200 mt-auto">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Connected</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-nova-blue-400 rounded-full"></div>
              <span>Real-time</span>
            </div>
          </div>
          <span>TaskHive Chat</span>
        </div>
      </div>
    </div>
  );
};

export default ChatFeed;
