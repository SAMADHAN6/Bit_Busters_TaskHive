import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users, Zap } from 'lucide-react';
import OutputGuide from '../OutputGuide';

const HomePage = ({ onStartTask, currentTask, taskStatus, agentStatuses, messages, graphData, showFinalOutput, onDownloadReport }) => {
  const stats = [
    { label: 'Active Tasks', value: currentTask ? '1' : '0', icon: TrendingUp, color: 'text-blue-600' },
    { label: 'AI Agents', value: '4', icon: Users, color: 'text-purple-600' },
    { label: 'Messages', value: messages.length.toString(), icon: Sparkles, color: 'text-orange-600' },
    { label: 'Status', value: taskStatus || 'Idle', icon: Zap, color: 'text-green-600' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 relative min-h-screen"
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Primary gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-nova-blue-50 via-athena-purple-50 to-pixel-orange-50"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-lex-green-50/40 via-transparent to-pixel-orange-50/40"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-nova-blue-100/20 via-transparent to-athena-purple-100/20"></div>
        
        {/* Animated floating orbs */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Large background orbs */}
          <motion.div 
            className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-nova-blue-200/30 to-nova-blue-300/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, 20, 0],
              y: [0, -15, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-athena-purple-200/30 to-athena-purple-300/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, -15, 0],
              y: [0, 20, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div 
            className="absolute bottom-32 left-1/3 w-28 h-28 bg-gradient-to-br from-pixel-orange-200/30 to-pixel-orange-300/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, 25, 0],
              y: [0, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-1/4 w-20 h-20 bg-gradient-to-br from-lex-green-200/30 to-lex-green-300/20 rounded-full blur-3xl"
            animate={{ 
              x: [0, -20, 0],
              y: [0, 15, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{ 
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          {/* Medium floating elements */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-br from-nova-blue-100/40 to-athena-purple-100/30 rounded-full blur-2xl"
            animate={{ 
              x: [0, 30, 0],
              y: [0, -25, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute top-1/3 right-1/3 w-12 h-12 bg-gradient-to-br from-pixel-orange-100/40 to-lex-green-100/30 rounded-full blur-2xl"
            animate={{ 
              x: [0, -25, 0],
              y: [0, 30, 0],
              rotate: [0, -180, -360]
            }}
            transition={{ 
              duration: 18,
              repeat: Infinity,
              ease: "linear",
              delay: 3
            }}
          />
          
          {/* Small accent elements */}
          <motion.div 
            className="absolute top-1/2 left-1/2 w-8 h-8 bg-gradient-to-br from-athena-purple-100/50 to-pixel-orange-100/40 rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-2/3 left-1/6 w-6 h-6 bg-gradient-to-br from-nova-blue-100/50 to-lex-green-100/40 rounded-full blur-lg"
            animate={{ 
              scale: [1, 2, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                              radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.05) 0%, transparent 50%)`
          }}></div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="text-center py-20 relative">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <h1 className="text-7xl font-bold text-gradient mb-6 relative z-10">
              TaskHive
            </h1>
            {/* Enhanced glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-nova-blue-200/30 via-athena-purple-200/30 to-pixel-orange-200/30 blur-3xl rounded-full transform scale-150"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-nova-blue-100/20 via-athena-purple-100/20 to-pixel-orange-100/20 blur-2xl rounded-full transform scale-125"></div>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed relative z-10 font-medium">
            AI Agent Collaboration Platform - Where intelligent agents work together to solve complex tasks with unprecedented efficiency and creativity
          </p>
          
          {/* Decorative elements */}
          <div className="flex justify-center space-x-4 mt-8 relative z-10">
            <motion.div 
              className="w-2 h-2 bg-nova-blue-400 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="w-2 h-2 bg-athena-purple-400 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            <motion.div 
              className="w-2 h-2 bg-pixel-orange-400 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div 
              className="w-2 h-2 bg-lex-green-400 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card text-center bg-white/90 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/95"
          >
            <div className={`text-3xl mb-3 ${stat.color}`}>
              <stat.icon className="w-8 h-8 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Agent Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center bg-white/90 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/95"
        >
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-semibold text-nova-blue-700 mb-2">Nova</h3>
          <p className="text-gray-600">Research Agent</p>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-nova-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${agentStatuses.nova?.progress || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {agentStatuses.nova?.status || 'idle'}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center bg-white/90 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/95"
        >
          <div className="text-4xl mb-3">🧠</div>
          <h3 className="text-lg font-semibold text-athena-purple-700 mb-2">Athena</h3>
          <p className="text-gray-600">Analyzer Agent</p>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-athena-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${agentStatuses.athena?.progress || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {agentStatuses.athena?.status || 'idle'}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center bg-white/90 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/95"
        >
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-lg font-semibold text-pixel-orange-700 mb-2">Pixel</h3>
          <p className="text-gray-600">Visualization Agent</p>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-pixel-orange-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${agentStatuses.pixel?.progress || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {agentStatuses.pixel?.status || 'idle'}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card text-center bg-white/90 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/95"
        >
          <div className="text-4xl mb-3">✍️</div>
          <h3 className="text-lg font-semibold text-lex-green-700 mb-2">Lex</h3>
          <p className="text-gray-600">Report Writer Agent</p>
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-lex-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${agentStatuses.lex?.progress || 0}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {agentStatuses.lex?.status || 'idle'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Quick Start */}
      {!currentTask && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card text-center bg-white/90 backdrop-blur-md border border-white/20 shadow-xl relative z-10 overflow-hidden"
        >
          {/* Enhanced background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-nova-blue-100/60 via-athena-purple-100/60 to-pixel-orange-100/60 rounded-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent rounded-xl"></div>
          
          <div className="relative z-10 p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-700 mb-6 text-lg">
              Describe your task and watch our AI agents collaborate to deliver comprehensive results
            </p>
            <motion.button
              onClick={() => document.getElementById('task-input')?.focus()}
              className="btn-primary text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-nova-blue-500 to-athena-purple-500 hover:from-nova-blue-600 hover:to-athena-purple-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your First Task
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Output Guide */}
      <div className="relative z-10">
        <OutputGuide isVisible={true} />
      </div>
    </motion.div>
  );
};

export default HomePage;
