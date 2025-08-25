import { useState, useEffect, useRef, useCallback } from 'react';

export const useWebSocket = () => {
  const [messages, setMessages] = useState([]);
  const [agentStatuses, setAgentStatuses] = useState({});
  const [graphData, setGraphData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [taskStatus, setTaskStatus] = useState('idle');
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(() => {
    try {
      setIsConnecting(true);
      const ws = new WebSocket('ws://localhost:8000');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        
        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setIsConnecting(false);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
        setIsConnecting(false);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setIsConnected(false);
      setIsConnecting(false);
    }
  }, []);

  const handleMessage = useCallback((data) => {
    console.log('Received WebSocket message:', data);
    console.log('Message type:', data.type);
    console.log('Message data:', data.data);
    
    switch (data.type) {
      case 'chat_message':
        setMessages(prev => [...prev, {
          id: data.data.id,
          agent: data.data.agent,
          message: data.data.message,
          emoji: data.data.emoji,
          color: data.data.color,
          timestamp: data.data.timestamp
        }]);
        break;

      case 'agent_status':
        // Map agent names to IDs for the frontend
        const agentNameToId = {
          'Nova': 'nova',
          'Athena': 'athena', 
          'Pixel': 'pixel',
          'Lex': 'lex'
        };
        const agentId = agentNameToId[data.data.agent.name];
        
        if (agentId) {
          setAgentStatuses(prev => ({
            ...prev,
            [agentId]: {
              status: data.data.agent.status,
              progress: data.data.agent.progress,
              role: data.data.agent.role,
              emoji: data.data.agent.emoji,
              color: data.data.agent.color
            }
          }));
        }
        break;

      case 'graph_edge':
        setGraphData(prev => [...prev, {
          source: data.data.source,
          target: data.data.target,
          type: data.data.type || 'data_transfer'
        }]);
        break;

      case 'workflow_start':
        console.log('Workflow started:', data);
        setMessages([]);
        setAgentStatuses({});
        setGraphData([]);
        setTaskStatus('running');
        break;

      case 'workflow_complete':
        console.log('Workflow completed:', data);
        console.log('Final summary:', data.data.summary);
        
        // Set task status to completed
        setTaskStatus('completed');
        
        // Set all agents to completed status
        setAgentStatuses(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(agentId => {
            updated[agentId] = {
              ...updated[agentId],
              status: 'completed',
              progress: 100
            };
          });
          return updated;
        });
        
        // Add final completion message to chat
        if (data.data.summary) {
          setMessages(prev => [...prev, {
            id: Date.now(),
            agent: 'System',
            message: data.data.summary,
            emoji: '🎉',
            color: 'system-blue',
            timestamp: new Date().toISOString()
          }]);
        }
        break;

      case 'workflow_error':
        console.error('Workflow error:', data.error);
        break;

      case 'pong':
        // Keep connection alive
        break;

      default:
        console.log('Unknown message type:', data.type);
    }
  }, []);

  const sendMessage = useCallback((message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  // Connect on mount
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  // Keep connection alive with periodic pings
  useEffect(() => {
    if (!isConnected) return;

    const pingInterval = setInterval(() => {
      sendMessage({ type: 'ping' });
    }, 30000); // Send ping every 30 seconds

    return () => clearInterval(pingInterval);
  }, [isConnected, sendMessage]);

  return {
    messages,
    agentStatuses,
    graphData,
    isConnected,
    isConnecting,
    taskStatus,
    sendMessage
  };
};
