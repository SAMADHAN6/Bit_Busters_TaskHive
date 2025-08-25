import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Wifi, WifiOff, Sparkles } from 'lucide-react';

const Header = ({ onStartTask, isConnected, isConnecting }) => {
  const [taskDescription, setTaskDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskDescription.trim()) return;

    setIsLoading(true);
    try {
      await onStartTask(taskDescription);
      setTaskDescription('');
    } catch (error) {
      console.error('Failed to start task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="text-3xl">🚀</div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">TaskHive</h1>
              <p className="text-sm text-gray-500">AI Agent Collaboration</p>
            </div>
          </motion.div>

          {/* Task Input Form */}
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="flex-1 max-w-2xl mx-8"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  id="task-input"
                  type="text"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Describe your task (e.g., 'Analyze market trends for AI adoption')"
                  className="input-field pr-12"
                  disabled={isLoading}
                />
                <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <motion.button
                type="submit"
                disabled={!taskDescription.trim() || isLoading || !isConnected}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`btn-primary flex items-center space-x-2 ${
                  (!taskDescription.trim() || isLoading || !isConnected) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Starting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Start Task</span>
                  </>
                )}
              </motion.button>
            </div>
            
            {/* Quick Start Examples */}
            {!taskDescription && !isLoading && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setTaskDescription("Analyze market trends for AI adoption in 2024")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  AI Market Trends
                </button>
                <button
                  type="button"
                  onClick={() => setTaskDescription("Research sustainable energy solutions and their economic impact")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  Sustainable Energy
                </button>
                <button
                  type="button"
                  onClick={() => setTaskDescription("Analyze the future of remote work and its effects on productivity")}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  Remote Work Analysis
                </button>
              </div>
            )}
          </motion.form>

          {/* Connection Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2"
          >
            {isConnecting ? (
              <>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <div className="w-5 h-5 text-yellow-500 animate-spin">
                  <div className="w-full h-full border-2 border-yellow-500 border-t-transparent rounded-full"></div>
                </div>
                <span className="text-sm text-yellow-600 font-medium">Connecting...</span>
              </>
            ) : isConnected ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <Wifi className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-600 font-medium">Connected</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <WifiOff className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-600 font-medium">Disconnected</span>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
