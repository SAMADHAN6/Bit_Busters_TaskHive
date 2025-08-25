import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Zap, Cpu, Database, BarChart3, FileText, ArrowRight, Activity } from 'lucide-react';

const GraphVisualization = ({ graphData, agentStatuses = {} }) => {
  const [graphNodes, setGraphNodes] = useState([]);
  const [graphLinks, setGraphLinks] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [activeAgent, setActiveAgent] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  // 3D Agent Models Configuration
  const agentModels = {
    Nova: {
      icon: Database,
      color: '#3B82F6',
      gradient: 'from-blue-500 to-blue-600',
      description: 'Research Agent',
      capabilities: ['Web Scraping', 'Data Collection', 'Source Analysis'],
      shape: 'cube',
      rotationSpeed: 0.02,
      pulseColor: '#60A5FA'
    },
    Athena: {
      icon: Cpu,
      color: '#8B5CF6',
      gradient: 'from-purple-500 to-purple-600',
      description: 'Analysis Agent',
      capabilities: ['Pattern Recognition', 'Trend Analysis', 'Insight Generation'],
      shape: 'sphere',
      rotationSpeed: 0.015,
      pulseColor: '#A78BFA'
    },
    Pixel: {
      icon: BarChart3,
      color: '#F97316',
      gradient: 'from-orange-500 to-orange-600',
      description: 'Visualization Agent',
      capabilities: ['Chart Generation', 'Data Visualization', 'Graph Creation'],
      shape: 'cylinder',
      rotationSpeed: 0.025,
      pulseColor: '#FB923C'
    },
    Lex: {
      icon: FileText,
      color: '#22C55E',
      gradient: 'from-green-500 to-green-600',
      description: 'Report Writer',
      capabilities: ['Report Compilation', 'Executive Summary', 'Recommendations'],
      shape: 'pyramid',
      rotationSpeed: 0.018,
      pulseColor: '#4ADE80'
    }
  };

  useEffect(() => {
    if (graphData && graphData.length > 0) {
      setIsVisible(true);
      updateGraphData();
    }
  }, [graphData]);

  // Update graph nodes when agent statuses change
  useEffect(() => {
    if (Object.keys(agentStatuses).length > 0) {
      setGraphNodes(prev => prev.map(node => {
        const agentId = node.name.toLowerCase();
        const status = agentStatuses[agentId];
        if (status) {
          return {
            ...node,
            status: status.status || 'idle',
            progress: status.progress || 0,
            lastActive: Date.now()
          };
        }
        return node;
      }));
    }
  }, [agentStatuses]);

  const updateGraphData = () => {
    // Create nodes for all agents with 3D positioning
    const nodes = [
      { 
        id: 'Nova', 
        name: 'Nova', 
        group: 'research', 
        x: -150, y: -100, z: 0,
        status: 'idle',
        progress: 0,
        lastActive: Date.now()
      },
      { 
        id: 'Athena', 
        name: 'Athena', 
        group: 'analysis', 
        x: 150, y: -100, z: 0,
        status: 'idle',
        progress: 0,
        lastActive: Date.now()
      },
      { 
        id: 'Pixel', 
        name: 'Pixel', 
        group: 'visualization', 
        x: -150, y: 100, z: 0,
        status: 'idle',
        progress: 0,
        lastActive: Date.now()
      },
      { 
        id: 'Lex', 
        name: 'Lex', 
        group: 'report', 
        x: 150, y: 100, z: 0,
        status: 'idle',
        progress: 0,
        lastActive: Date.now()
      }
    ];

    // Create links based on graph data
    const links = graphData
      .filter(edge => edge && (edge.source || edge.from) && (edge.target || edge.to))
      .map((edge, index) => ({
        source: edge.source || edge.from,
        target: edge.target || edge.to,
        type: edge.type || 'data_transfer',
        id: `link-${index}`,
        color: getEdgeColor(edge.type || 'data_transfer'),
        strength: 0.8,
        animated: true
      }));

    setGraphNodes(nodes);
    setGraphLinks(links);
  };

  const getEdgeColor = (type) => {
    switch (type) {
      case 'research_data':
        return '#3B82F6';
      case 'analysis_data':
        return '#8B5CF6';
      case 'visualization_data':
        return '#F97316';
      case 'data_transfer':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  // 3D Drawing Functions
  const draw3DShape = (ctx, x, y, size, shape, rotation, color, gradient) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Create gradient
    const gradientObj = ctx.createLinearGradient(-size, -size, size, size);
    gradientObj.addColorStop(0, color);
    gradientObj.addColorStop(1, adjustBrightness(color, -20));

    ctx.fillStyle = gradientObj;
    ctx.strokeStyle = adjustBrightness(color, -40);
    ctx.lineWidth = 2;

    switch (shape) {
      case 'cube':
        drawCube(ctx, size);
        break;
      case 'sphere':
        drawSphere(ctx, size);
        break;
      case 'cylinder':
        drawCylinder(ctx, size);
        break;
      case 'pyramid':
        drawPyramid(ctx, size);
        break;
      default:
        drawCube(ctx, size);
    }

    ctx.restore();
  };

  const drawCube = (ctx, size) => {
    ctx.beginPath();
    ctx.rect(-size, -size, size * 2, size * 2);
    ctx.fill();
    ctx.stroke();
  };

  const drawSphere = (ctx, size) => {
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  };

  const drawCylinder = (ctx, size) => {
    ctx.beginPath();
    ctx.ellipse(0, -size/2, size, size/3, 0, 0, Math.PI * 2);
    ctx.ellipse(0, size/2, size, size/3, 0, 0, Math.PI * 2);
    ctx.rect(-size, -size/2, size * 2, size);
    ctx.fill();
    ctx.stroke();
  };

  const drawPyramid = (ctx, size) => {
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(-size, size);
    ctx.lineTo(size, size);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const adjustBrightness = (hex, percent) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const drawAnimatedLink = (ctx, source, target, color, animated, time) => {
    if (!source || !target) return;

    const startX = source.x;
    const startY = source.y;
    const endX = target.x;
    const endY = target.y;

    // Draw main link
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Draw animated particles
    if (animated) {
      const particleCount = 3;
      for (let i = 0; i < particleCount; i++) {
        const progress = ((time * 0.001 + i * 0.3) % 1);
        const x = startX + (endX - startX) * progress;
        const y = startY + (endY - startY) * progress;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw arrow
    const angle = Math.atan2(endY - startY, endX - startX);
    const arrowLength = 15;
    const arrowAngle = Math.PI / 6;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle - arrowAngle),
      endY - arrowLength * Math.sin(angle - arrowAngle)
    );
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle + arrowAngle),
      endY - arrowLength * Math.sin(angle + arrowAngle)
    );
    ctx.stroke();
  };

  const animate = useCallback((time) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Update time
    timeRef.current = time;
    
    // Draw background grid
    drawGrid(ctx, canvas.width, canvas.height, centerX, centerY);
    
    // Draw links
    graphLinks.forEach(link => {
      const sourceNode = graphNodes.find(n => n.id === link.source);
      const targetNode = graphNodes.find(n => n.id === link.target);
      if (sourceNode && targetNode) {
        const isHovered = hoveredLink === link.id;
        const linkColor = isHovered ? adjustBrightness(link.color, 20) : link.color;
        drawAnimatedLink(
          ctx,
          { x: centerX + sourceNode.x, y: centerY + sourceNode.y },
          { x: centerX + targetNode.x, y: centerY + targetNode.y },
          linkColor,
          link.animated,
          time
        );
      }
    });
    
    // Draw nodes
    graphNodes.forEach(node => {
      const model = agentModels[node.name];
      if (model) {
        // Add floating effect
        const floatOffset = Math.sin(time * 0.002 + node.x * 0.01) * 5;
        const x = centerX + node.x;
        const y = centerY + node.y + floatOffset;
        const rotation = time * model.rotationSpeed;
        const size = 30;
        
        // Draw shadow with better positioning
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.beginPath();
        ctx.ellipse(x, y + size + 20, size * 0.9, size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw 3D shape with hover effect
        const isHovered = hoveredNode === node.id;
        const hoverScale = isHovered ? 1.2 : 1;
        const hoverSize = size * hoverScale;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(hoverScale, hoverScale);
        draw3DShape(ctx, 0, 0, size, model.shape, rotation, model.color, model.gradient);
        ctx.restore();
        
        // Draw status indicator
        if (node.status === 'running') {
          drawPulseEffect(ctx, x, y, hoverSize + 10, model.pulseColor, time);
        }
        
        // Draw hover glow effect
        if (isHovered) {
          ctx.strokeStyle = model.color;
          ctx.lineWidth = 3;
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.arc(x, y, hoverSize + 15, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
        
        // Draw agent label with glow effect
        ctx.shadowColor = model.color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#1F2937';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, x, y + size + 25);
        ctx.shadowBlur = 0;
        
        // Draw description
        ctx.fillStyle = '#6B7280';
        ctx.font = '11px Inter';
        ctx.fillText(model.description, x, y + size + 40);
      }
    });
    
    animationRef.current = requestAnimationFrame(animate);
  }, [graphNodes, graphLinks, hoveredLink, hoveredNode]);

  const drawGrid = (ctx, width, height, centerX, centerY) => {
    ctx.strokeStyle = '#F3F4F6';
    ctx.lineWidth = 1;
    
    const gridSize = 50;
    const offsetX = centerX % gridSize;
    const offsetY = centerY % gridSize;
    
    // Vertical lines
    for (let x = offsetX; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = offsetY; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawPulseEffect = (ctx, x, y, radius, color, time) => {
    const pulseCount = 3;
    for (let i = 0; i < pulseCount; i++) {
      const pulseRadius = radius + (time * 0.1 + i * 20) % 40;
      const alpha = Math.max(0, 1 - (pulseRadius - radius) / 40);
      
      ctx.strokeStyle = `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  useEffect(() => {
    if (isVisible) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, animate]);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - canvas.width / 2;
    const y = event.clientY - rect.top - canvas.height / 2;
    
    // Check if click is on a node
    const clickedNode = graphNodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance < 30;
    });
    
    if (clickedNode) {
      setActiveAgent(clickedNode);
    }
  };

  const handleLinkHover = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left - canvas.width / 2;
    const y = event.clientY - rect.top - canvas.height / 2;
    
    // Find hovered node
    const hoveredNode = graphNodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance < 30;
    });
    
    setHoveredNode(hoveredNode ? hoveredNode.id : null);
    
    // Find hovered link
    const hoveredLink = graphLinks.find(link => {
      const sourceNode = graphNodes.find(n => n.id === link.source);
      const targetNode = graphNodes.find(n => n.id === link.target);
      if (!sourceNode || !targetNode) return false;
      
      const distance = distanceToLine(
        x, y,
        sourceNode.x, sourceNode.y,
        targetNode.x, targetNode.y
      );
      return distance < 10;
    });
    
    setHoveredLink(hoveredLink ? hoveredLink.id : null);
  };

  const distanceToLine = (px, py, x1, y1, x2, y2) => {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) param = dot / lenSq;
    
    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  if (!isVisible) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card text-center py-12"
      >
        <div className="relative">
        <Network className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Activity className="w-8 h-8 text-blue-500" />
          </motion.div>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">3D Agent Interaction Graph</h3>
        <p className="text-gray-500">
          Advanced 3D visualization of AI agent interactions and data flow
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Network className="w-5 h-5 text-nova-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">3D Agent Interaction Graph</h3>
        <div className="ml-auto flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-nova-blue-500 rounded-full"></div>
            <span>Research</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-athena-purple-500 rounded-full"></div>
            <span>Analysis</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-pixel-orange-500 rounded-full"></div>
            <span>Visualization</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-lex-green-500 rounded-full"></div>
            <span>Report</span>
          </div>
        </div>
      </div>

      <div className="relative h-[500px] border border-gray-200 rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-pointer"
          onClick={handleCanvasClick}
          onMouseMove={handleLinkHover}
        />
        
        {/* 3D Scene Controls */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200"
            onClick={() => {
              // Reset view
              setActiveAgent(null);
            }}
            title="Reset View"
          >
            <Zap className="w-4 h-4 text-gray-600" />
          </motion.button>
          
          {/* Add info button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200"
            title="3D Visualization Info"
          >
            <Activity className="w-4 h-4 text-gray-600" />
          </motion.button>
        </div>
        
        {/* Instructions Overlay */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200 shadow-lg">
          <p className="text-xs text-gray-600">
            💡 <strong>Tip:</strong> Click on agents to see details • Hover over connections
          </p>
        </div>
      </div>

      {/* Agent Details Panel */}
      <AnimatePresence>
        {activeAgent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-3 h-3 rounded-full bg-${agentModels[activeAgent.name]?.gradient.split('-')[1]}-500`}></div>
              <h4 className="font-semibold text-gray-800">{activeAgent.name}</h4>
              <span className="text-sm text-gray-500">{agentModels[activeAgent.name]?.description}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Capabilities</h5>
                <ul className="space-y-1">
                  {agentModels[activeAgent.name]?.capabilities.map((capability, index) => (
                    <li key={index} className="text-xs text-gray-600 flex items-center space-x-1">
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Status</h5>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    activeAgent.status === 'running' ? 'bg-green-500 animate-pulse' :
                    activeAgent.status === 'completed' ? 'bg-blue-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-xs text-gray-600 capitalize">{activeAgent.status}</span>
                </div>
                
                {activeAgent.status === 'running' && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-green-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${activeAgent.progress}%` }}
                        transition={{ duration: 0.5 }}
        />
      </div>
                    <span className="text-xs text-gray-500 mt-1 block">{activeAgent.progress}%</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Graph Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <motion.div 
          className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-2xl font-bold text-blue-800">{graphNodes.length}</div>
          <div className="text-sm text-blue-600">AI Agents</div>
        </motion.div>
        <motion.div 
          className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-2xl font-bold text-purple-800">{graphLinks.length}</div>
          <div className="text-sm text-purple-600">Data Flows</div>
        </motion.div>
        <motion.div 
          className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200"
          whileHover={{ scale: 1.02 }}
        >
          <div className="text-2xl font-bold text-green-800">3D</div>
          <div className="text-sm text-green-600">Visualization</div>
        </motion.div>
        </div>

      {/* Enhanced Legend */}
      <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Agent Types & Interactions</h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(agentModels).map(([name, model]) => (
            <motion.div 
              key={name}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/50 transition-colors"
              whileHover={{ x: 5 }}
            >
              <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${model.gradient}`}></div>
              <div>
                <div className="text-sm font-medium text-gray-800">{name}</div>
                <div className="text-xs text-gray-500">{model.description}</div>
        </div>
            </motion.div>
          ))}
      </div>

        <div className="mt-3 pt-3 border-t border-gray-200">
          <h5 className="text-xs font-medium text-gray-700 mb-2">Data Flow Types</h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Research → Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Analysis → Visualization</span>
          </div>
          <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Visualization → Report</span>
          </div>
          <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Cross-Agent Sync</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GraphVisualization;
