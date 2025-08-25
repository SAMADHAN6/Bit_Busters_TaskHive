import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import FloatingActionButton from './components/FloatingActionButton';
import Toast from './components/Toast';
import AgentDashboard from './components/AgentDashboard';
import ChatFeed from './components/ChatFeed';
import ProgressTracker from './components/ProgressTracker';
import GraphVisualization from './components/GraphVisualization';
import FinalOutput from './components/FinalOutput';
import HomePage from './components/pages/HomePage';
import AgentsPage from './components/pages/AgentsPage';
import AboutPage from './components/pages/AboutPage';
import SettingsPage from './components/pages/SettingsPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import { useWebSocket } from './hooks/useWebSocket';
import { useTaskManager } from './hooks/useTaskManager';

function App() {
  const [currentTask, setCurrentTask] = useState(null);
  const [showFinalOutput, setShowFinalOutput] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { messages, agentStatuses, graphData, sendMessage, isConnected, isConnecting, taskStatus } = useWebSocket();
  const { startTask, downloadReport } = useTaskManager();
  
  const handleStartTask = async (taskDescription) => {
    try {
      const taskId = await startTask(taskDescription);
      setCurrentTask({ id: taskId, description: taskDescription });
      setShowFinalOutput(false);
      
      // Send ping to keep WebSocket alive
      sendMessage({ type: 'ping' });
      
      setToast({ message: 'Task started successfully!', type: 'success', isVisible: true });
      setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
    } catch (error) {
      console.error('Failed to start task:', error);
      setToast({ message: 'Failed to start task. Please try again.', type: 'error', isVisible: true });
      setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
    }
  };
  
  const handleDownloadReport = async () => {
    if (currentTask?.id) {
      try {
        await downloadReport(currentTask.id);
      } catch (error) {
        console.error('Failed to download report:', error);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAuthentication = (action) => {
    if (action === 'login') {
      // Simulate successful login
      setIsAuthenticated(true);
      setCurrentPage('home');
      setToast({ message: 'Successfully logged in!', type: 'success', isVisible: true });
      setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
    } else if (action === 'register') {
      // Simulate successful registration
      setIsAuthenticated(true);
      setCurrentPage('home');
      setToast({ message: 'Account created successfully!', type: 'success', isVisible: true });
      setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
    }
  };
  
  // Check if workflow is complete
  useEffect(() => {
    console.log('Task status changed:', taskStatus);
    console.log('Agent statuses:', agentStatuses);
    console.log('Show final output:', showFinalOutput);
    
    // Check if all agents are completed
    const allAgentsCompleted = Object.keys(agentStatuses).length > 0 && 
      Object.values(agentStatuses).every(status => status.status === 'completed');
    
    console.log('All agents completed:', allAgentsCompleted);
    
    // Only show final output if task is completed AND all agents are completed
    if (taskStatus === 'completed' && allAgentsCompleted && !showFinalOutput) {
      console.log('Setting showFinalOutput to true');
      // Add a small delay to ensure all final messages are displayed
      setTimeout(() => {
        setShowFinalOutput(true);
      }, 2000);
    }
  }, [taskStatus, agentStatuses, showFinalOutput]);

  // Check authentication on mount
  useEffect(() => {
    // For demo purposes, set as authenticated by default
    // In a real app, you would check for valid tokens/session
    setIsAuthenticated(true);
  }, []);
  
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage 
            onStartTask={handleStartTask}
            currentTask={currentTask}
            taskStatus={taskStatus}
            agentStatuses={agentStatuses}
            messages={messages}
            graphData={graphData}
            showFinalOutput={showFinalOutput}
            onDownloadReport={handleDownloadReport}
          />
        );
      case 'agents':
        return <AgentsPage />;
      case 'about':
        return <AboutPage />;
      case 'settings':
        return <SettingsPage />;
      case 'login':
        return <LoginPage onPageChange={handlePageChange} />;
      case 'register':
        return <RegisterPage onPageChange={handlePageChange} />;
      default:
        return <HomePage 
          onStartTask={handleStartTask}
          currentTask={currentTask}
          taskStatus={taskStatus}
          agentStatuses={agentStatuses}
          messages={messages}
          graphData={graphData}
          showFinalOutput={showFinalOutput}
          onDownloadReport={handleDownloadReport}
        />;
    }
  };

  // Show authentication pages if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AnimatePresence mode="wait">
          {currentPage === 'login' ? (
            <LoginPage key="login" onPageChange={handlePageChange} />
          ) : (
            <RegisterPage key="register" onPageChange={handlePageChange} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <Sidebar 
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-80'}`}>
        {/* Header */}
        <Header onStartTask={handleStartTask} isConnected={isConnected} isConnecting={isConnecting} />
        
        <div className="container mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            {currentTask && currentPage === 'home' ? (
              // Task Execution Screen
              <motion.div
                key="task-execution"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Progress Tracker */}
                <ProgressTracker 
                  taskStatus={taskStatus} 
                  agentStatuses={agentStatuses}
                  currentTask={currentTask}
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Agent Dashboard */}
                  <div className="lg:col-span-2">
                    <AgentDashboard 
                      agentStatuses={agentStatuses}
                      currentTask={currentTask}
                    />
                  </div>
                  
                  {/* Chat Feed */}
                  <div>
                    <ChatFeed messages={messages} />
                  </div>
                </div>
                
                {/* Graph Visualization */}
                <GraphVisualization graphData={graphData} agentStatuses={agentStatuses} />
                
                {/* Final Output */}
                <AnimatePresence>
                  {showFinalOutput && (
                    <FinalOutput 
                      onDownloadReport={handleDownloadReport}
                      currentTask={currentTask}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              // Page Content
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {renderPage()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Floating Action Button */}
      <FloatingActionButton onStartTask={handleStartTask} isConnected={isConnected} isConnecting={isConnecting} />
      
      {/* Toast Notifications */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
}

export default App;
