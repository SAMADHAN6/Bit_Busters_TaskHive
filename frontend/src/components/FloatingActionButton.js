import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, X, RefreshCw } from 'lucide-react';

const FloatingActionButton = ({ onStartTask, isConnected, isConnecting }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quickTask, setQuickTask] = useState('');
  const [currentSuggestions, setCurrentSuggestions] = useState([]);

  const allQuickTasks = [
    "Analyze market trends for AI adoption in 2024",
    "Research sustainable energy solutions and their economic impact",
    "Analyze the future of remote work and its effects on productivity",
    "Study the impact of social media on mental health",
    "Research blockchain technology applications in healthcare",
    "Analyze customer satisfaction trends in e-commerce",
    "Research renewable energy investment opportunities",
    "Study the evolution of digital payment systems",
    "Analyze the future of autonomous vehicles",
    "Research climate change adaptation strategies",
    "Study the impact of artificial intelligence on job markets",
    "Analyze global supply chain optimization strategies",
    "Research cybersecurity threats and prevention methods",
    "Study the future of virtual reality in education",
    "Analyze the impact of 5G technology on industries",
    "Research sustainable agriculture practices",
    "Study the evolution of cloud computing services",
    "Analyze the future of quantum computing",
    "Research mental health awareness in workplaces",
    "Study the impact of influencer marketing on consumer behavior",
    "Analyze the future of smart cities",
    "Research the evolution of mobile app development",
    "Study the impact of data privacy regulations",
    "Analyze the future of wearable technology",
    "Research sustainable transportation solutions"
  ];

  const randomizeSuggestions = () => {
    const shuffled = [...allQuickTasks].sort(() => 0.5 - Math.random());
    setCurrentSuggestions(shuffled.slice(0, 6)); // Show 6 random suggestions
  };

  useEffect(() => {
    if (isExpanded) {
      randomizeSuggestions();
    }
  }, [isExpanded]);

  const handleQuickTask = async (task) => {
    if (isConnected) {
      await onStartTask(task);
      setIsExpanded(false);
    }
  };

  const handleCustomTask = async () => {
    if (quickTask.trim() && isConnected) {
      await onStartTask(quickTask);
      setQuickTask('');
      setIsExpanded(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 mb-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Quick Start</h3>
              <div className="flex items-center space-x-2">
                <motion.button
                  onClick={randomizeSuggestions}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Randomize suggestions"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Task Buttons */}
            <div className="space-y-2 mb-4 max-h-48 overflow-y-auto custom-scrollbar">
              {currentSuggestions.map((task, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleQuickTask(task)}
                  disabled={!isConnected}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700 disabled:opacity-50 hover:shadow-sm"
                >
                  {task}
                </motion.button>
              ))}
            </div>

            {/* Custom Task Input */}
            <div className="space-y-2">
              <input
                type="text"
                value={quickTask}
                onChange={(e) => setQuickTask(e.target.value)}
                placeholder="Or type your own task..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nova-blue-500 focus:border-transparent text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleCustomTask()}
              />
              <button
                onClick={handleCustomTask}
                disabled={!quickTask.trim() || !isConnected}
                className="w-full btn-primary text-sm py-2 disabled:opacity-50"
              >
                Start Custom Task
              </button>
            </div>

            {/* Footer Info */}
            <div className="mt-3 text-center">
              <p className="text-xs text-gray-500">
                💡 <strong>Pro Tip:</strong> Click the refresh icon to see new suggestions!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
          isConnecting
            ? 'bg-yellow-500 cursor-wait'
            : isConnected 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
              : 'bg-gray-400 cursor-not-allowed'
        }`}
        disabled={!isConnected || isConnecting}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ rotate: -90 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 90 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              initial={{ rotate: 90 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: -90 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default FloatingActionButton;
