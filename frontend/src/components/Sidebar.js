import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  Brain, 
  BarChart3, 
  FileText, 
  Menu, 
  X,
  ChevronRight,
  Info,
  Settings
} from 'lucide-react';

const Sidebar = ({ currentPage, onPageChange, isCollapsed, onToggleCollapse }) => {
  const [expandedAgent, setExpandedAgent] = useState(null);

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home, color: 'text-blue-600' },
    { id: 'agents', label: 'AI Agents', icon: Brain, color: 'text-purple-600' },
    { id: 'about', label: 'About', icon: Info, color: 'text-green-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' },
    { id: 'login', label: 'Login', icon: Search, color: 'text-orange-600' },
    { id: 'register', label: 'Register', icon: FileText, color: 'text-indigo-600' }
  ];

  const agents = [
    {
      id: 'nova',
      name: 'Nova',
      role: 'Research Agent',
      emoji: '🔍',
      color: 'nova-blue',
      description: 'Specialized in comprehensive research and data gathering',
      capabilities: [
        'Academic paper analysis',
        'Industry report compilation',
        'Trend identification',
        'Source validation',
        'Data collection'
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'athena',
      name: 'Athena',
      role: 'Analyzer Agent',
      emoji: '🧠',
      color: 'athena-purple',
      description: 'Advanced pattern recognition and analytical insights',
      capabilities: [
        'Pattern identification',
        'Statistical analysis',
        'Trend correlation',
        'Insight generation',
        'Predictive modeling'
      ],
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'pixel',
      name: 'Pixel',
      role: 'Visualization Agent',
      emoji: '📊',
      color: 'pixel-orange',
      description: 'Creates compelling visual representations of data',
      capabilities: [
        'Chart generation',
        'Infographic design',
        'Interactive visualizations',
        'Data storytelling',
        'Visual reporting'
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'lex',
      name: 'Lex',
      role: 'Report Writer Agent',
      emoji: '✍️',
      color: 'lex-green',
      description: 'Professional report compilation and documentation',
      capabilities: [
        'Executive summaries',
        'Detailed analysis reports',
        'Recommendation writing',
        'Document structuring',
        'Professional formatting'
      ],
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop&crop=center'
    }
  ];

  const handleAgentClick = (agentId) => {
    if (expandedAgent === agentId) {
      setExpandedAgent(null);
    } else {
      setExpandedAgent(agentId);
    }
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: isCollapsed ? -280 : 0 }}
      className={`fixed left-0 top-0 h-full bg-white shadow-xl border-r border-gray-200 z-40 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-80'
      }`}
    >
      {/* Toggle Button */}
      <div className="absolute -right-3 top-6 bg-white rounded-full shadow-lg border border-gray-200">
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-gray-50 rounded-full transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <X className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-3"
        >
          <div className="text-2xl">🚀</div>
          {!isCollapsed && (
            <div>
              <h2 className="text-xl font-bold text-gradient">TaskHive</h2>
              <p className="text-sm text-gray-500">AI Collaboration</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Navigation Menu */}
      <div className="p-4 flex-shrink-0">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                currentPage === item.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </motion.button>
          ))}
        </nav>
      </div>

      {/* AI Agents Section - Scrollable */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto border-t border-gray-200 custom-scrollbar">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 sticky top-0 bg-white py-2">AI Agents</h3>
            <div className="space-y-3">
              {agents.map((agent) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleAgentClick(agent.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{agent.emoji}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{agent.name}</h4>
                      <p className="text-sm text-gray-600">{agent.role}</p>
                    </div>
                    <ChevronRight 
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        expandedAgent === agent.id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                  
                  {expandedAgent === agent.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-3"
                    >
                      <img 
                        src={agent.image} 
                        alt={agent.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <p className="text-sm text-gray-700">{agent.description}</p>
                      <div>
                        <h5 className="text-sm font-semibold text-gray-800 mb-2">Capabilities:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {agent.capabilities.map((capability, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                              <span>{capability}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Collapsed Agent Icons */}
      {isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-3">
            {agents.map((agent) => (
              <motion.div
                key={agent.id}
                whileHover={{ scale: 1.1 }}
                className="flex justify-center"
                title={`${agent.name} - ${agent.role}`}
              >
                <div className="text-2xl cursor-pointer hover:opacity-80 transition-opacity">
                  {agent.emoji}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;
