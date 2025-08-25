import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, BarChart3, MessageSquare, CheckCircle, RefreshCw, Lightbulb } from 'lucide-react';

const OutputGuide = ({ isVisible }) => {
  const [currentRecommendations, setCurrentRecommendations] = useState([]);

  const allRecommendations = [
    "🔍 Research market trends for emerging technologies in 2024",
    "📊 Analyze customer feedback data to identify improvement opportunities",
    "💡 Generate creative ideas for product innovation and development",
    "📈 Create a comprehensive business strategy for Q2 2024",
    "🌱 Research sustainable business practices and their ROI",
    "🎯 Analyze competitor strategies and market positioning",
    "📱 Evaluate user experience design trends in mobile applications",
    "💰 Conduct financial analysis for investment decision making",
    "🌍 Research global market expansion opportunities",
    "⚡ Analyze operational efficiency and process optimization",
    "🎨 Create visual content strategy for social media campaigns",
    "📚 Compile industry best practices and case studies",
    "🔬 Research scientific breakthroughs and their commercial applications",
    "🏥 Analyze healthcare technology trends and patient outcomes",
    "🎓 Research educational technology innovations and learning outcomes",
    "🏗️ Analyze construction industry trends and sustainability practices",
    "🚗 Research electric vehicle market and charging infrastructure",
    "🍽️ Analyze food industry trends and consumer preferences",
    "🏠 Research real estate market trends and investment opportunities",
    "🎮 Analyze gaming industry trends and user engagement patterns"
  ];

  const outputs = [
    {
      title: "📊 Agent Dashboard",
      description: "Real-time status and progress of all AI agents",
      location: "Main screen - Agent cards showing status, progress bars, and current activity",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    {
      title: "💬 Live Chat Feed",
      description: "Real-time messages from agents as they work",
      location: "Right sidebar - Shows agent communications and updates",
      icon: <MessageSquare className="w-5 h-5 text-blue-500" />
    },
    {
      title: "🕸️ Agent Interaction Graph",
      description: "Visual representation of agent collaboration",
      location: "Below dashboard - Interactive network showing data flow between agents",
      icon: <BarChart3 className="w-5 h-5 text-purple-500" />
    },
    {
      title: "📈 Progress Tracker",
      description: "Overall task completion status",
      location: "Top of main screen - Shows overall progress and individual agent status",
      icon: <CheckCircle className="w-5 h-5 text-orange-500" />
    },
    {
      title: "📄 Final Report",
      description: "Comprehensive analysis and recommendations",
      location: "Appears when task completes - Summary of all findings",
      icon: <FileText className="w-5 h-5 text-green-500" />
    },
    {
      title: "⬇️ PDF Download",
      description: "Downloadable comprehensive report",
      location: "Final output screen - Click 'Download PDF Report' button",
      icon: <Download className="w-5 h-5 text-blue-500" />
    }
  ];

  const randomizeRecommendations = () => {
    const shuffled = [...allRecommendations].sort(() => 0.5 - Math.random());
    setCurrentRecommendations(shuffled.slice(0, 8)); // Show 8 random recommendations
  };

  useEffect(() => {
    if (isVisible) {
      randomizeRecommendations();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📋 Where to Find Your Outputs</h2>
        <p className="text-gray-600">Complete guide to accessing all analysis results</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {outputs.map((output, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                {output.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">{output.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{output.description}</p>
                <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  📍 {output.location}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Recommendations Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-nova-blue-50 to-athena-purple-50 rounded-xl border border-nova-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-800">💡 Task Recommendations</h3>
          </div>
          <motion.button
            onClick={randomizeRecommendations}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm text-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Randomize</span>
          </motion.button>
        </div>
        
        <p className="text-gray-600 mb-4 text-sm">
          Get inspired with these AI-powered task suggestions. Click "Randomize" to see new ideas!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentRecommendations.map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-3 bg-white rounded-lg border border-gray-200 hover:border-nova-blue-300 hover:shadow-sm transition-all cursor-pointer group"
            >
              <p className="text-sm text-gray-700 group-hover:text-nova-blue-700 transition-colors">
                {recommendation}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            💡 <strong>Pro Tip:</strong> Use these suggestions as starting points and customize them to your specific needs!
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• <strong>Agent Dashboard:</strong> Watch real-time progress as agents work</li>
          <li>• <strong>Chat Feed:</strong> See detailed messages from each agent</li>
          <li>• <strong>Graph:</strong> Visualize how agents collaborate and share data</li>
          <li>• <strong>Final Report:</strong> Get comprehensive analysis and recommendations</li>
          <li>• <strong>PDF Download:</strong> Save the complete report for offline use</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default OutputGuide;
