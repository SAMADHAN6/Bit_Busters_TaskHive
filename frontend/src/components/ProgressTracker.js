import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const ProgressTracker = ({ taskStatus, agentStatuses, currentTask }) => {
  const getOverallProgress = () => {
    if (!agentStatuses || Object.keys(agentStatuses).length === 0) return 0;
    
    const totalProgress = Object.values(agentStatuses).reduce((sum, status) => {
      return sum + (status?.progress || 0);
    }, 0);
    
    return Math.round(totalProgress / Object.keys(agentStatuses).length);
  };

  const getAgentStatus = (agentId) => {
    const status = agentStatuses[agentId];
    if (!status) return { status: 'pending', progress: 0 };
    
    // Normalize status values
    let normalizedStatus = status.status;
    if (normalizedStatus === 'working' || normalizedStatus === 'running') {
      normalizedStatus = 'working';
    } else if (normalizedStatus === 'idle' || normalizedStatus === 'pending') {
      normalizedStatus = 'pending';
    }
    
    return {
      status: normalizedStatus,
      progress: status.progress || 0
    };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'running':
        return <TrendingUp className="w-6 h-6 text-blue-500 animate-pulse" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'running':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'error':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Task Completed';
      case 'running':
        return 'In Progress';
      case 'error':
        return 'Error Occurred';
      default:
        return 'Initializing';
    }
  };

  const overallProgress = getOverallProgress();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Progress Tracker</h2>
          <p className="text-gray-600">Overall task completion status</p>
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${getStatusColor(taskStatus)}`}>
          {getStatusIcon(taskStatus)}
          <span className="font-medium">{getStatusText(taskStatus)}</span>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-bold text-gray-800">{overallProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-nova-blue-500 via-athena-purple-500 to-pixel-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Agent Progress Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { id: 'nova', name: 'Nova', emoji: '🔍', color: 'nova-blue' },
          { id: 'athena', name: 'Athena', emoji: '🧠', color: 'athena-purple' },
          { id: 'pixel', name: 'Pixel', emoji: '📊', color: 'pixel-orange' },
          { id: 'lex', name: 'Lex', emoji: '✍️', color: 'lex-green' }
        ].map((agent, index) => {
          const agentStatus = getAgentStatus(agent.id);

          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className={`text-2xl mb-2 bg-${agent.color}-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto`}>
                {agent.emoji}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{agent.name}</h3>
              <div className="text-sm text-gray-600 mb-2">{agentStatus.status}</div>
              
              {/* Individual Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <motion.div
                  className={`h-2 rounded-full bg-${agent.color}-500`}
                  initial={{ width: 0 }}
                  animate={{ width: `${agentStatus.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              
              <div className="text-xs font-medium text-gray-700">
                {agentStatus.progress}%
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Task Details */}
      {currentTask && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 pt-6 border-t border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Current Task</h3>
              <p className="text-sm text-gray-600 mt-1">{currentTask.description}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Task ID</p>
              <p className="text-sm font-mono text-gray-700">{currentTask.id.slice(0, 8)}...</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 pt-6 border-t border-gray-200"
      >
        <h3 className="font-semibold text-gray-800 mb-4">Workflow Steps</h3>
        <div className="space-y-3">
          {[
            { id: 'research', name: 'Research Phase', agent: 'Nova', agentId: 'nova' },
            { id: 'analysis', name: 'Analysis Phase', agent: 'Athena', agentId: 'athena' },
            { id: 'visualization', name: 'Visualization Phase', agent: 'Pixel', agentId: 'pixel' },
            { id: 'report', name: 'Report Generation', agent: 'Lex', agentId: 'lex' }
          ].map((step, index) => {
            // Get the actual status from agentStatuses using helper function
            const agentStatus = getAgentStatus(step.agentId);
            
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  agentStatus.status === 'completed' 
                    ? 'bg-green-500 text-white' 
                    : agentStatus.status === 'working'
                    ? 'bg-blue-500 text-white animate-pulse'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {agentStatus.status === 'completed' ? '✓' : index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{step.name}</p>
                  <p className="text-sm text-gray-600">Handled by {step.agent}</p>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  agentStatus.status === 'completed' 
                    ? 'bg-green-100 text-green-700' 
                    : agentStatus.status === 'working'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {agentStatus.status}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProgressTracker;
