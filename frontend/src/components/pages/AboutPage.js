import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Users, 
  Target, 
  Award, 
  Globe, 
  Shield,
  Zap,
  Heart,
  Star,
  TrendingUp
} from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: Rocket,
      title: 'AI-Powered Collaboration',
      description: 'Our specialized AI agents work together seamlessly to deliver comprehensive results'
    },
    {
      icon: Target,
      title: 'Precision & Accuracy',
      description: 'High-accuracy results with advanced pattern recognition and data validation'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Fast, efficient processing with real-time updates and progress tracking'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with data protection and privacy compliance'
    }
  ];

  const stats = [
    { label: 'AI Agents', value: '4', icon: Users },
    { label: 'Accuracy Rate', value: '96%', icon: Target },
    { label: 'Processing Speed', value: '<8s', icon: Zap },
    { label: 'User Satisfaction', value: '98%', icon: Heart }
  ];

  const team = [
    {
      name: 'AI Research Team',
      role: 'Machine Learning & NLP',
      description: 'Developing cutting-edge AI models and natural language processing capabilities'
    },
    {
      name: 'Data Science Team',
      role: 'Analytics & Visualization',
      description: 'Creating powerful analytical tools and beautiful data visualizations'
    },
    {
      name: 'Engineering Team',
      role: 'Platform Development',
      description: 'Building robust, scalable infrastructure and seamless user experiences'
    },
    {
      name: 'Product Team',
      role: 'User Experience',
      description: 'Designing intuitive interfaces and optimizing user workflows'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-bold text-gradient mb-6">About TaskHive</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            TaskHive is a revolutionary AI-powered collaboration platform that brings together specialized 
            artificial intelligence agents to solve complex tasks with unprecedented efficiency and accuracy. 
            Our mission is to democratize access to advanced AI capabilities and transform how organizations 
            approach problem-solving and decision-making.
          </p>
        </motion.div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <div className="text-center">
            <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To revolutionize how organizations approach complex problem-solving by providing 
              accessible, intelligent AI collaboration tools that enhance human capabilities 
              and drive innovation across industries.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <div className="text-center">
            <Globe className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              A world where AI collaboration is seamless, intuitive, and accessible to everyone, 
              enabling organizations to tackle complex challenges with confidence and achieve 
              breakthrough results through intelligent automation.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Features */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose TaskHive?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform combines cutting-edge AI technology with intuitive design to deliver 
            exceptional results for organizations of all sizes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card text-center"
            >
              <feature.icon className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="card">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Platform Statistics</h2>
          <p className="text-lg text-gray-600">
            Impressive numbers that demonstrate our platform's capabilities and impact
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-gray-50 rounded-lg"
            >
              <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Team</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Behind TaskHive is a dedicated team of experts in AI, data science, engineering, 
            and product development, working together to create the future of AI collaboration.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-700">{member.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="card">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Technology Stack</h2>
          <p className="text-lg text-gray-600">
            Built with cutting-edge technologies to ensure performance, scalability, and reliability
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Frontend</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">React.js</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">Tailwind CSS</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">Framer Motion</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">WebSocket</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Backend</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">Node.js</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">Express.js</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">WebSocket</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">OpenAI API</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">AI & ML</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">GPT Models</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">Natural Language Processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">Machine Learning</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">Data Visualization</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-6 opacity-90">
          Join thousands of organizations already using TaskHive to transform their workflows
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Start Your Free Trial
        </button>
      </motion.div>
    </div>
  );
};

export default AboutPage;
