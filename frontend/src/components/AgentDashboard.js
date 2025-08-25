import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, Play } from 'lucide-react';

const AgentDashboard = ({ agentStatuses, currentTask }) => {
  const agents = [
    {
      id: 'nova',
      name: 'Nova',
      role: 'Research Agent',
      emoji: '🔍',
      color: 'nova-blue',
      description: 'Gathers comprehensive information and sources'
    },
    {
      id: 'athena',
      name: 'Athena',
      role: 'Analyzer Agent',
      emoji: '🧠',
      color: 'athena-purple',
      description: 'Processes data and extracts key insights'
    },
    {
      id: 'pixel',
      name: 'Pixel',
      role: 'Visualization Agent',
      emoji: '📊',
      color: 'pixel-orange',
      description: 'Creates charts and visual representations'
    },
    {
      id: 'lex',
      name: 'Lex',
      role: 'Report Writer Agent',
      emoji: '✍️',
      color: 'lex-green',
      description: 'Generates comprehensive reports and PDFs'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'working':
        return <Play className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'working':
        return 'border-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  const getProgressColor = (agentId) => {
    const agent = agents.find(a => a.id === agentId);
    return `bg-${agent.color}-500`;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Agent Dashboard</h2>
        <p className="text-gray-600">
          Watch our AI agents collaborate in real-time to complete your task
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent, index) => {
          const status = agentStatuses[agent.id] || { status: 'idle', progress: 0, last_message: '' };
          
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`agent-card ${getStatusColor(status.status)}`}
            >
              {/* Agent Header */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`text-3xl bg-${agent.color}-100 p-3 rounded-full`}>
                      {agent.emoji}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{agent.name}</h3>
                      <p className="text-sm text-gray-600">{agent.role}</p>
                    </div>
                  </div>
                  {getStatusIcon(status.status)}
                </div>

                {/* Agent Description */}
                <p className="text-gray-600 mb-4">{agent.description}</p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{status.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${getProgressColor(agent.id)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${status.progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Status Message */}
                {status.last_message && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-3 rounded-lg text-sm ${
                      status.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : status.status === 'working'
                        ? 'bg-yellow-100 text-yellow-800'
                        : status.status === 'error'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {status.last_message}
                  </motion.div>
                )}
              </div>

              {/* Animated Background */}
              {status.status === 'working' && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r from-${agent.color}-100/20 to-${agent.color}-200/20`}
                  animate={{
                    background: [
                      `linear-gradient(45deg, var(--tw-gradient-stops))`,
                      `linear-gradient(135deg, var(--tw-gradient-stops))`,
                      `linear-gradient(45deg, var(--tw-gradient-stops))`
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ zIndex: -1 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Task Info */}
      {currentTask && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Task</h3>
          <p className="text-gray-600">{currentTask.description}</p>
          <p className="text-sm text-gray-500 mt-2">Task ID: {currentTask.id}</p>
        </motion.div>
      )}
    </div>
  );
};

export default AgentDashboard;
