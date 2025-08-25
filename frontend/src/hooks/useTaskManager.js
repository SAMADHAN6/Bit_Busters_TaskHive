import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8000';

export const useTaskManager = () => {
  const [taskStatus, setTaskStatus] = useState('idle');
  const [currentTaskId, setCurrentTaskId] = useState(null);

  const startTask = useCallback(async (taskDescription) => {
    try {
      setTaskStatus('starting');
      
      const response = await fetch(`${API_BASE_URL}/start-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_description: taskDescription,
          user_id: 'default_user'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCurrentTaskId(data.task_id);
      setTaskStatus('running');
      
      console.log('Task started successfully:', data);
      return data.task_id;

    } catch (error) {
      console.error('Failed to start task:', error);
      setTaskStatus('error');
      throw error;
    }
  }, []);

  const getTaskStatus = useCallback(async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/task-status/${taskId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTaskStatus(data.status);
      
      return data;

    } catch (error) {
      console.error('Failed to get task status:', error);
      throw error;
    }
  }, []);

  const downloadReport = useCallback(async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/download-report/${taskId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `taskhive_report_${taskId}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('Report downloaded successfully');
      return true;

    } catch (error) {
      console.error('Failed to download report:', error);
      throw error;
    }
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }, []);

  return {
    startTask,
    getTaskStatus,
    downloadReport,
    checkHealth,
    taskStatus,
    currentTaskId
  };
};
