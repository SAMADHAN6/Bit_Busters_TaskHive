import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Brain, 
  BarChart3, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Target,
  Users,
  Clock
} from 'lucide-react';

const AgentsPage = () => {
  const [selectedAgent, setSelectedAgent] = useState('nova');

  const agents = [
    {
      id: 'nova',
      name: 'Nova',
      role: 'Research Agent',
      emoji: '🔍',
      color: 'nova-blue',
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Specialized in comprehensive research and data gathering from multiple sources',
      longDescription: 'Nova is our premier research specialist, designed to gather comprehensive information from academic papers, industry reports, market data, and reliable online sources. With advanced natural language processing capabilities, Nova can understand complex queries and extract relevant information efficiently.',
      capabilities: [
        'Academic paper analysis and synthesis',
        'Industry report compilation and summarization',
        'Market trend identification and tracking',
        'Source validation and credibility assessment',
        'Multi-source data collection and aggregation',
        'Real-time information gathering',
        'Citation and reference management'
      ],
      strengths: [
        'Comprehensive coverage of topics',
        'High accuracy in source validation',
        'Fast processing of large datasets',
        'Multi-language support',
        'Contextual understanding'
      ],
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop&crop=center',
      stats: {
        accuracy: '98%',
        speed: '2.3s',
        sources: '50+',
        languages: '15'
      }
    },
    {
      id: 'athena',
      name: 'Athena',
      role: 'Analyzer Agent',
      emoji: '🧠',
      color: 'athena-purple',
      gradient: 'from-purple-500 to-pink-500',
      description: 'Advanced pattern recognition and analytical insights generation',
      longDescription: 'Athena is our analytical powerhouse, designed to process complex datasets and identify meaningful patterns, correlations, and insights. Using advanced machine learning algorithms, Athena can uncover hidden relationships and provide actionable intelligence from raw data.',
      capabilities: [
        'Statistical analysis and hypothesis testing',
        'Pattern recognition and trend identification',
        'Predictive modeling and forecasting',
        'Correlation and causation analysis',
        'Anomaly detection and outlier identification',
        'Multi-dimensional data analysis',
        'Risk assessment and probability calculation'
      ],
      strengths: [
        'Deep analytical insights',
        'High accuracy in predictions',
        'Complex pattern recognition',
        'Statistical rigor',
        'Interpretable results'
      ],
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop&crop=center',
      stats: {
        accuracy: '96%',
        speed: '1.8s',
        models: '25+',
        insights: '100+'
      }
    },
    {
      id: 'pixel',
      name: 'Pixel',
      role: 'Visualization Agent',
      emoji: '📊',
      color: 'pixel-orange',
      gradient: 'from-orange-500 to-red-500',
      description: 'Creates compelling visual representations and interactive data visualizations',
      longDescription: 'Pixel transforms complex data into beautiful, intuitive visualizations that make insights accessible and engaging. From interactive charts to professional infographics, Pixel ensures that data tells a compelling story that resonates with any audience.',
      capabilities: [
        'Interactive chart and graph generation',
        'Infographic design and creation',
        'Data storytelling and narrative visualization',
        'Custom color schemes and branding',
        'Responsive design for multiple platforms',
        'Animation and dynamic visualizations',
        'Export in multiple formats (PNG, SVG, PDF)'
      ],
      strengths: [
        'Beautiful visual design',
        'Interactive capabilities',
        'Multiple output formats',
        'Customizable styling',
        'Accessibility compliance'
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center',
      stats: {
        accuracy: '94%',
        speed: '3.1s',
        formats: '8',
        templates: '50+'
      }
    },
    {
      id: 'lex',
      name: 'Lex',
      role: 'Report Writer Agent',
      emoji: '✍️',
      color: 'lex-green',
      gradient: 'from-green-500 to-emerald-500',
      description: 'Professional report compilation and comprehensive documentation',
      longDescription: 'Lex is our expert communicator, transforming complex analysis and insights into clear, professional reports that stakeholders can easily understand and act upon. From executive summaries to detailed technical reports, Lex ensures clarity and impact.',
      capabilities: [
        'Executive summary generation',
        'Detailed technical report writing',
        'Recommendation and action plan creation',
        'Professional document structuring',
        'Multiple writing styles and tones',
        'Citation and reference formatting',
        'Multi-language report generation'
      ],
      strengths: [
        'Clear and concise writing',
        'Professional formatting',
        'Multiple report types',
        'Consistent quality',
        'Quick turnaround'
      ],
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop&crop=center',
      stats: {
        accuracy: '97%',
        speed: '4.2s',
        styles: '12',
        languages: '8'
      }
    }
  ];

  const currentAgent = agents.find(agent => agent.id === selectedAgent);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">AI Agents</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Meet our specialized AI agents, each designed to excel in their domain and collaborate seamlessly to deliver comprehensive results
        </p>
      </div>

      {/* Agent Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <motion.button
            key={agent.id}
            onClick={() => setSelectedAgent(agent.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              selectedAgent === agent.id
                ? `border-${agent.color}-500 bg-${agent.color}-50`
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="text-4xl mb-3">{agent.emoji}</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{agent.name}</h3>
            <p className="text-sm text-gray-600">{agent.role}</p>
            <p className="text-xs text-gray-500 mt-2">{agent.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Detailed Agent View */}
      {currentAgent && (
        <motion.div
          key={currentAgent.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image and Stats */}
            <div className="space-y-6">
              <div className="relative">
                <img 
                  src={currentAgent.image} 
                  alt={currentAgent.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-${currentAgent.color}-900/50 to-transparent rounded-lg`}></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-4xl mb-2">{currentAgent.emoji}</div>
                  <h2 className="text-2xl font-bold">{currentAgent.name}</h2>
                  <p className="text-lg opacity-90">{currentAgent.role}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{currentAgent.stats.accuracy}</div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{currentAgent.stats.speed}</div>
                  <div className="text-sm text-gray-600">Avg Speed</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Zap className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{currentAgent.stats.sources || currentAgent.stats.models || currentAgent.stats.formats || currentAgent.stats.styles}</div>
                  <div className="text-sm text-gray-600">
                    {currentAgent.id === 'nova' ? 'Sources' : 
                     currentAgent.id === 'athena' ? 'Models' : 
                     currentAgent.id === 'pixel' ? 'Formats' : 'Styles'}
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-800">{currentAgent.stats.languages}</div>
                  <div className="text-sm text-gray-600">Languages</div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">About {currentAgent.name}</h3>
                <p className="text-gray-700 leading-relaxed">{currentAgent.longDescription}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Capabilities</h3>
                <div className="space-y-2">
                  {currentAgent.capabilities.map((capability, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Key Strengths</h3>
                <div className="grid grid-cols-1 gap-2">
                  {currentAgent.strengths.map((strength, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <ArrowRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Collaboration Section */}
      <div className="card text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">How They Work Together</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          Our AI agents don't work in isolation. They collaborate seamlessly, passing insights and data between each other to create comprehensive, actionable results.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-800 mb-2">1. Research</h3>
            <p className="text-sm text-gray-600">Nova gathers comprehensive data</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="font-semibold text-gray-800 mb-2">2. Analyze</h3>
            <p className="text-sm text-gray-600">Athena processes and finds patterns</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-800 mb-2">3. Visualize</h3>
            <p className="text-sm text-gray-600">Pixel creates compelling visuals</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">✍️</div>
            <h3 className="font-semibold text-gray-800 mb-2">4. Report</h3>
            <p className="text-sm text-gray-600">Lex compiles the final report</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentsPage;
