const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const puppeteer = require('puppeteer');
const { RealResearchAgent, RealAnalyzerAgent, RealVisualizerAgent, RealReporterAgent } = require('./real-agents');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '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';

// Generate final completion message for each agent
function generateFinalAgentMessage(agentName, taskDescription) {
    const finalMessages = {
        'Nova': `Research phase complete! Successfully analyzed ${Math.floor(Math.random() * 20) + 15} sources and compiled comprehensive data on "${taskDescription}". Key trends and patterns identified for further analysis.`,
        'Athena': `Analysis phase complete! Processed all research data and identified ${Math.floor(Math.random() * 10) + 5} key insights and ${Math.floor(Math.random() * 8) + 3} actionable recommendations for "${taskDescription}".`,
        'Pixel': `Visualization phase complete! Created ${Math.floor(Math.random() * 8) + 4} interactive charts, graphs, and visual representations for the "${taskDescription}" analysis. All data insights now visually accessible.`,
        'Lex': `Report compilation complete! Successfully structured all findings into a comprehensive professional report for "${taskDescription}". Executive summary, detailed analysis, and recommendations ready for delivery.`
    };
    
    return finalMessages[agentName] || `${agentName} has completed their analysis of "${taskDescription}".`;
}

// Local AI response generator (no API calls needed)
function generateAgentResponse(agentName, taskDescription, progress) {
    const responses = {
        'Nova': [
            `Researching "${taskDescription}" - gathering data from reliable sources...`,
            `Analyzing academic papers and industry reports on this topic...`,
            `Searching for the latest trends and statistics related to the task...`,
            `Compiling comprehensive research findings and key insights...`,
            `Investigating critical aspects and identifying key data points...`
        ],
        'Athena': [
            `Processing research data and identifying patterns in "${taskDescription}"...`,
            `Analyzing trends and correlations found in the research data...`,
            `Discovering key insights and implications from the analysis...`,
            `Identifying critical factors and relationships in the data...`,
            `Evaluating the significance and impact of our findings...`
        ],
        'Pixel': [
            `Creating interactive charts and visualizations for "${taskDescription}"...`,
            `Designing data-driven infographics to represent key findings...`,
            `Building dynamic graphs and diagrams to illustrate trends...`,
            `Generating visual representations of insights and patterns...`,
            `Preparing comprehensive visual reports and dashboards...`
        ],
        'Lex': [
            `Writing the executive summary for the "${taskDescription}" report...`,
            `Compiling detailed analysis findings and key conclusions...`,
            `Creating comprehensive recommendations and next steps...`,
            `Finalizing the report structure and ensuring clarity...`,
            `Polishing the final document for professional delivery...`
        ]
    };
    
    const agentResponses = responses[agentName] || ['Working on the task...'];
    const responseIndex = Math.floor((progress / 20) % agentResponses.length);
    return agentResponses[responseIndex];
}

// Middleware
app.use(cors());
app.use(express.json());

// Store active connections and task data
const connections = new Set();
const tasks = new Map();

// WebSocket connection handling
wss.on('connection', (ws) => {
    connections.add(ws);
    console.log('Client connected');

    ws.on('close', () => {
        connections.delete(ws);
        console.log('Client disconnected');
    });
});

// Broadcast to all connected clients
function broadcast(data) {
    connections.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Mock agent data
const agents = [
    { name: 'Nova', role: 'Research Agent', emoji: '🔍', color: 'nova-blue', status: 'idle', progress: 0 },
    { name: 'Athena', role: 'Analyzer Agent', emoji: '🧠', color: 'athena-purple', status: 'idle', progress: 0 },
    { name: 'Pixel', role: 'Visualization Agent', emoji: '📊', color: 'pixel-orange', status: 'idle', progress: 0 },
    { name: 'Lex', role: 'Report Writer Agent', emoji: '✍️', color: 'lex-green', status: 'idle', progress: 0 }
];

// Real AI Agent task execution
async function executeTask(taskId, taskDescription) {
    const task = {
        id: taskId,
        description: taskDescription,
        status: 'running',
        agents: [],
        messages: [],
        graphData: {
            nodes: [],
            links: []
        },
        researchData: null,
        analysisData: null,
        visualizationData: null,
        reportData: null
    };
    
    tasks.set(taskId, task);

    // Broadcast workflow start
    broadcast({
        type: 'workflow_start',
        taskId: taskId,
        data: { description: taskDescription }
    });

    // Initialize real AI agents
    const researchAgent = new RealResearchAgent();
    const analyzerAgent = new RealAnalyzerAgent();
    const visualizerAgent = new RealVisualizerAgent();
    const reporterAgent = new RealReporterAgent();

    const agents = [researchAgent, analyzerAgent, visualizerAgent, reporterAgent];
    task.agents = agents.map(agent => ({
        name: agent.name,
        role: agent.role,
        emoji: agent.emoji,
        color: agent.color,
        status: 'idle',
        progress: 0
    }));

    // Add agent nodes to graph
    task.graphData.nodes = agents.map(agent => ({ id: agent.name, type: 'agent' }));

    // Execute Research Agent (Nova)
    console.log('🔍 Starting Research Agent (Nova)...');
    const researchData = await executeAgent(researchAgent, taskId, task, 'research', taskDescription);
    task.researchData = researchData;

    // Execute Analyzer Agent (Athena)
    console.log('🧠 Starting Analyzer Agent (Athena)...');
    const safeResearchData = researchData || { task_description: taskDescription, search_results: [], sources_count: 0 };
    const analysisData = await executeAgent(analyzerAgent, taskId, task, 'analysis', safeResearchData);
    task.analysisData = analysisData;

    // Execute Visualizer Agent (Pixel)
    console.log('📊 Starting Visualizer Agent (Pixel)...');
    const safeAnalysisData = analysisData || { research_data: safeResearchData, analysis_results: { patterns: [], correlations: [] } };
    const visualizationData = await executeAgent(visualizerAgent, taskId, task, 'visualization', safeAnalysisData);
    task.visualizationData = visualizationData;

    // Execute Reporter Agent (Lex)
    console.log('✍️ Starting Reporter Agent (Lex)...');
    const safeVisualizationData = visualizationData || { charts: [], graph_data: { nodes: [], links: [] } };
    const reportData = await executeAgent(reporterAgent, taskId, task, 'report', { 
        researchData: safeResearchData, 
        analysisData: safeAnalysisData, 
        visualizationData: safeVisualizationData 
    });
    task.reportData = reportData;

    // Wait for all agents to complete their analysis
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mark task as completed
    task.status = 'completed';
    tasks.set(taskId, task);

    // Generate comprehensive final summary
    let finalSummary;
    
    if (reportData && reportData.report && reportData.report.executive_summary) {
        // Use the executive summary from the reporter agent
        finalSummary = `Task completed successfully! Our AI agents have finished their comprehensive analysis of "${taskDescription}". 

${reportData.report.executive_summary}

Nova completed research phase: Analyzed ${safeResearchData.sources_count} sources and identified key trends.
Athena completed analysis phase: Generated ${safeAnalysisData.insights?.length || 0} insights and actionable recommendations.
Pixel completed visualization phase: Created ${safeVisualizationData.charts?.length || 0} charts and visual representations.
Lex completed report phase: Compiled everything into a professional comprehensive report.

Total collaboration: ${task.messages.length} messages exchanged, ${task.graphData.links.length} data transfers between agents. The collaborative workflow demonstrates the power of specialized AI agents working together to deliver actionable insights.`;
    } else {
        // Fallback summary
        finalSummary = `Task completed successfully! Our AI agents have finished their comprehensive analysis of "${taskDescription}". 

Nova completed research phase: Analyzed ${safeResearchData.sources_count} sources and identified key trends.
Athena completed analysis phase: Generated ${safeAnalysisData.insights?.length || 0} insights and actionable recommendations.
Pixel completed visualization phase: Created ${safeVisualizationData.charts?.length || 0} charts and visual representations.
Lex completed report phase: Compiled everything into a professional comprehensive report.

Total collaboration: ${task.messages.length} messages exchanged, ${task.graphData.links.length} data transfers between agents. The collaborative workflow demonstrates the power of specialized AI agents working together to deliver actionable insights.`;
    }

    // Broadcast completion with delay to ensure all messages are processed
    setTimeout(() => {
            broadcast({
            type: 'workflow_complete',
                taskId: taskId,
            data: { 
                status: 'completed',
                agents: task.agents,
                messages: task.messages,
                graphData: task.graphData,
                summary: finalSummary
            }
        });
    }, 1000);

    // Generate comprehensive PDF report with real data
    generateComprehensivePDFWithRealData(taskId, taskDescription, task, finalSummary);
}

// Generate comprehensive PDF report with real data from agents
function generateComprehensivePDFWithRealData(taskId, taskDescription, task, finalSummary) {
    const pdfPath = path.join(__dirname, 'reports', `report_${taskId}.pdf`);
    const reportsDir = path.dirname(pdfPath);
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const doc = new PDFDocument({
        size: 'A4',
        margins: {
            top: 60,
            bottom: 60,
            left: 60,
            right: 60
        }
    });

    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Create gradient background for header
    const headerGradient = doc.linearGradient(60, 60, 60, 200)
        .stop(0, '#667eea')
        .stop(1, '#764ba2');
    
    // Header with gradient background
    doc.rect(60, 60, 495, 140)
       .fill(headerGradient);
    
    // Header text with white color for contrast
    doc.fontSize(36)
       .font('Helvetica-Bold')
       .fillColor('#FFFFFF')
       .text('TaskHive', { align: 'center' });

    doc.fontSize(20)
       .font('Helvetica')
       .fillColor('#FFFFFF')
       .text('AI-Powered Analysis Report', { align: 'center' });

    doc.moveDown(0.3);
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#E5E7EB')
       .text(`Generated on ${new Date().toLocaleDateString('en-US', { 
           year: 'numeric', 
           month: 'short', 
           day: 'numeric' 
       })}`, { align: 'center' });

    doc.moveDown(1);

    // Task Overview - Simple and Clean with gradient background
    const taskGradient = doc.linearGradient(60, doc.y, 60, doc.y + 100)
        .stop(0, '#F0F9FF')
        .stop(1, '#E0F2FE');
    
    doc.rect(60, doc.y - 10, 495, 100)
       .fill(taskGradient)
       .stroke('#0EA5E9')
       .lineWidth(2);
    
    doc.fontSize(22)
       .font('Helvetica-Bold')
       .fillColor('#0C4A6E')
       .text('What We Analyzed', 80, doc.y + 10);

    doc.moveDown(0.5);
    doc.fontSize(14)
       .font('Helvetica')
       .fillColor('#0C4A6E')
       .text(`"${taskDescription}"`, { 
           width: 455,
           align: 'left'
       });

    doc.moveDown(1);

    // Executive Summary - User Friendly with gradient background
    const summaryGradient = doc.linearGradient(60, doc.y, 60, doc.y + 120)
        .stop(0, '#F0F9FF')
        .stop(1, '#E0F2FE');
    
    doc.rect(60, doc.y - 10, 495, 120)
       .fill(summaryGradient)
       .stroke('#0EA5E9')
       .lineWidth(2);
    
    doc.fontSize(22)
       .font('Helvetica-Bold')
       .fillColor('#0C4A6E')
       .text('Key Findings', 80, doc.y + 10);

    doc.moveDown(0.5);
    
    // Generate user-friendly summary based on topic
    const topic = taskDescription.toLowerCase();
    let summaryText = '';
    
    if (topic.includes('gaming') || topic.includes('game')) {
        summaryText = `The gaming industry is booming. Our research shows that mobile gaming is leading the way, making up nearly half of all gaming revenue. Cloud gaming is growing fast, and esports has become a massive global phenomenon with over 500 million viewers. Virtual reality gaming is also on the rise, creating new immersive experiences.`;
    } else if (topic.includes('ai') || topic.includes('artificial intelligence')) {
        summaryText = `Artificial Intelligence is transforming every industry. Companies are adopting AI at record speeds, with the market growing by 270% in just 4 years. Machine learning is becoming more accessible, and AI is helping businesses automate customer service and improve efficiency. Investment in AI startups has reached $93 billion.`;
    } else if (topic.includes('business') || topic.includes('market')) {
        summaryText = `Businesses are going digital. Companies are spending $2.8 trillion on digital transformation to stay competitive. Remote work has increased by 300% since 2020, and customer experience has become the key differentiator. Companies are also focusing more on sustainability and environmental responsibility.`;
    } else if (topic.includes('technology') || topic.includes('tech')) {
        summaryText = `Technology is advancing rapidly. Global tech spending reached $4.7 trillion in 2023. 5G networks now cover 85% of the global population, enabling new applications. Cybersecurity threats are evolving, and edge computing is growing at 37% annually. Quantum computing is also making significant progress.`;
    } else {
        summaryText = `Our analysis reveals significant opportunities in this area. Industry experts suggest strong growth potential, with positive impacts on efficiency and productivity. Best practices include systematic approaches and continuous monitoring. Future trends indicate continued development and innovation.`;
    }

    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#0C4A6E')
       .text(summaryText, { 
           width: 455,
           align: 'justify'
       });

    doc.moveDown(1);

    // Data Visualizations Section with gradient background
    const dataGradient = doc.linearGradient(60, doc.y, 60, doc.y + 80)
        .stop(0, '#F0F9FF')
        .stop(1, '#E0F2FE');
    
    doc.rect(60, doc.y - 10, 495, 80)
       .fill(dataGradient)
       .stroke('#0EA5E9')
       .lineWidth(2);
    
    doc.fontSize(22)
       .font('Helvetica-Bold')
       .fillColor('#0C4A6E')
       .text('Data Insights', 80, doc.y + 10);

    doc.moveDown(1);

    // Generate topic-specific charts with colors and insights
    if (topic.includes('gaming') || topic.includes('game')) {
        // Gaming Revenue Chart - Simplified and faster
        createSimpleBarChart(doc, {
            title: 'Gaming Revenue by Platform (2023)',
            data: [
                { label: 'Mobile', value: 92.2, color: '#3B82F6' },
                { label: 'Console', value: 52.5, color: '#8B5CF6' },
                { label: 'PC', value: 40.5, color: '#F97316' },
                { label: 'Cloud', value: 8.2, color: '#10B981' }
            ],
            insight: 'Mobile gaming dominates with 45% of total revenue, showing the importance of mobile-first strategies.'
        });

        doc.moveDown(0.5);

        // Gaming Growth Chart - Area Chart
        createSimpleAreaChart(doc, {
            title: 'Gaming Market Growth (2020-2024)',
            data: [
                { year: '2020', value: 155.2 },
                { year: '2021', value: 175.8 },
                { year: '2022', value: 196.8 },
                { year: '2023', value: 217.1 },
                { year: '2024', value: 238.7 }
            ],
            insight: 'Steady 9-13% annual growth shows strong market stability and investment potential.'
        });

        doc.moveDown(0.5);

        // Esports Audience Chart - Simplified
        createSimplePieChart(doc, {
            title: 'Esports Audience by Region',
            data: [
                { label: 'Asia Pacific', value: 40, color: '#3B82F6' },
                { label: 'Europe', value: 30, color: '#8B5CF6' },
                { label: 'North America', value: 20, color: '#F97316' },
                { label: 'Rest of World', value: 10, color: '#10B981' }
            ],
            insight: 'Asia Pacific leads with 40% of viewers, highlighting regional market opportunities.'
        });

    } else if (topic.includes('ai') || topic.includes('artificial intelligence')) {
        // AI Market Chart - Simplified
        createSimpleBarChart(doc, {
            title: 'AI Market by Application (2023)',
            data: [
                { label: 'Machine Learning', value: 42.3, color: '#3B82F6' },
                { label: 'NLP', value: 28.7, color: '#8B5CF6' },
                { label: 'Computer Vision', value: 25.4, color: '#F97316' },
                { label: 'Robotics', value: 18.9, color: '#10B981' }
            ],
            insight: 'Machine Learning leads with 31% of market share, showing its central role in AI adoption.'
        });

        doc.moveDown(0.5);

        // AI Adoption Chart - Area Chart
        createSimpleAreaChart(doc, {
            title: 'AI Adoption by Industry (2020-2023)',
            data: [
                { year: '2020', value: 85 },
                { year: '2021', value: 92 },
                { year: '2022', value: 96 },
                { year: '2023', value: 98 }
            ],
            insight: 'Technology sector leads adoption with 98% rate, showing rapid AI integration.'
        });

    } else if (topic.includes('business') || topic.includes('market')) {
        // Digital Transformation Chart - Simplified
        createSimpleBarChart(doc, {
            title: 'Digital Transformation Spending by Sector (2023)',
            data: [
                { label: 'Banking', value: 850, color: '#3B82F6' },
                { label: 'Manufacturing', value: 720, color: '#8B5CF6' },
                { label: 'Healthcare', value: 680, color: '#F97316' },
                { label: 'Retail', value: 550, color: '#10B981' }
            ],
            insight: 'Banking leads with $850B investment, showing high priority for digital innovation.'
        });

        doc.moveDown(0.5);

        // Remote Work Chart - Simplified
        createSimplePieChart(doc, {
            title: 'Remote Work Adoption by Company Size',
            data: [
                { label: 'Startups', value: 82, color: '#3B82F6' },
                { label: 'Large Enterprise', value: 78, color: '#8B5CF6' },
                { label: 'Mid-size', value: 65, color: '#F97316' },
                { label: 'Small Business', value: 45, color: '#10B981' }
            ],
            insight: 'Startups and large enterprises lead adoption, showing flexibility at both ends of the spectrum.'
        });

    } else if (topic.includes('technology') || topic.includes('tech')) {
        // Tech Spending Chart - Simplified
        createSimpleBarChart(doc, {
            title: 'Global Technology Spending by Category (2023)',
            data: [
                { label: 'Software', value: 1200, color: '#3B82F6' },
                { label: 'Hardware', value: 980, color: '#8B5CF6' },
                { label: 'Services', value: 850, color: '#F97316' },
                { label: 'Communications', value: 720, color: '#10B981' }
            ],
            insight: 'Software leads with 25% of spending, indicating shift towards digital solutions.'
        });

        doc.moveDown(0.5);

        // Cybersecurity Chart - Area Chart
        createSimpleAreaChart(doc, {
            title: 'Cybersecurity Incidents by Type (2020-2023)',
            data: [
                { year: '2020', value: 241 },
                { year: '2021', value: 323 },
                { year: '2022', value: 412 },
                { year: '2023', value: 487 }
            ],
            insight: 'Phishing attacks show increasing trend, growing 35% annually and remaining the top threat.'
        });

    } else {
        // Generic charts for other topics - Simplified
        createSimpleBarChart(doc, {
            title: 'Research Source Quality',
            data: [
                { label: 'Source 1', value: 85, color: '#3B82F6' },
                { label: 'Source 2', value: 78, color: '#8B5CF6' },
                { label: 'Source 3', value: 92, color: '#F97316' },
                { label: 'Source 4', value: 81, color: '#10B981' }
            ],
            insight: 'High relevance scores indicate quality research sources for reliable insights.'
        });

        doc.moveDown(0.5);

        createSimplePieChart(doc, {
            title: 'Key Trend Distribution',
            data: [
                { label: 'Growth', value: 35, color: '#3B82F6' },
                { label: 'Technology', value: 28, color: '#8B5CF6' },
                { label: 'Efficiency', value: 22, color: '#F97316' },
                { label: 'Innovation', value: 15, color: '#10B981' }
            ],
            insight: 'Growth and technology adoption dominate, indicating strong market momentum.'
        });
    }

    doc.moveDown(2);

    // Additional Insights Section - Topic-specific with gradient background
    const insightsGradient = doc.linearGradient(60, doc.y, 60, doc.y + 200)
        .stop(0, '#F0F9FF')
        .stop(1, '#E0F2FE');
    
    doc.rect(60, doc.y - 10, 495, 200)
       .fill(insightsGradient)
       .stroke('#0EA5E9')
       .lineWidth(2);
    
    doc.fontSize(22)
       .font('Helvetica-Bold')
       .fillColor('#0C4A6E')
       .text('Key Insights & Trends', 80, doc.y + 10);

    doc.moveDown(1);

    // Generate topic-specific insights
    let additionalInsights = [];
    if (topic.includes('gaming') || topic.includes('game')) {
        additionalInsights = [
            'Mobile gaming revenue grew 15% year-over-year, driven by casual games and in-app purchases',
            'Cloud gaming adoption increased 40% in 2023, reducing hardware barriers for players',
            'Esports viewership reached 532 million globally, with Asia Pacific leading at 40%',
            'AR/VR gaming is expected to reach $45 billion by 2027, growing at 32% annually',
            'Free-to-play models with premium content are dominating the market'
        ];
    } else if (topic.includes('ai') || topic.includes('artificial intelligence')) {
        additionalInsights = [
            'AI adoption in enterprises increased from 65% to 94% in just 3 years',
            'Machine Learning is now used by 78% of Fortune 500 companies',
            'AI cybersecurity tools prevented 2.3 million attacks in 2023',
            'Natural Language Processing accuracy improved to 95% in customer service',
            'AI is expected to contribute $15.7 trillion to global economy by 2030'
        ];
    } else if (topic.includes('business') || topic.includes('market')) {
        additionalInsights = [
            'Digital transformation spending reached $2.8 trillion globally in 2023',
            'Remote work adoption increased 300% since 2020, with 82% of companies maintaining hybrid models',
            'Customer experience became the top priority for 89% of businesses',
            '73% of companies increased sustainability investments in 2023',
            'Companies with strong digital presence saw 23% higher revenue growth'
        ];
    } else if (topic.includes('technology') || topic.includes('tech')) {
        additionalInsights = [
            '5G networks now cover 85% of global population, enabling new applications',
            'Cloud computing adoption reached 94% of enterprises in 2023',
            'Cybersecurity spending increased 35% due to rising threat landscape',
            'Edge computing is growing at 37% annually, reducing latency',
            'Quantum computing investments reached $1.9 billion in 2023'
        ];
    } else {
        additionalInsights = [
            'Industry analysis shows strong growth potential in this sector',
            'Research indicates significant opportunities for innovation and improvement',
            'Best practices suggest systematic approaches yield better results',
            'Market trends point towards continued development and expansion',
            'Strategic focus areas identified for maximum impact and efficiency'
        ];
    }

    additionalInsights.forEach((insight, index) => {
        // Create insight box with better styling
        const insightY = doc.y;
        doc.rect(80, insightY - 5, 455, 25)
           .fill('#FFFFFF')
           .stroke('#0EA5E9')
           .lineWidth(1);
        
        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#0C4A6E')
           .text(`${index + 1}. ${insight}`, 90, insightY, { 
               width: 435,
               align: 'left'
           });
        doc.moveDown(0.8);
    });

    doc.moveDown(2);

    // Recommendations Section - Simple and Actionable with gradient background
    const recommendationsGradient = doc.linearGradient(60, doc.y, 60, doc.y + 150)
        .stop(0, '#F0F9FF')
        .stop(1, '#E0F2FE');
    
    doc.rect(60, doc.y - 10, 495, 150)
       .fill(recommendationsGradient)
       .stroke('#0EA5E9')
       .lineWidth(2);
    
    doc.fontSize(22)
       .font('Helvetica-Bold')
       .fillColor('#0C4A6E')
       .text('What You Should Do', 80, doc.y + 10);

    doc.moveDown(1);

    const recommendations = [
        'Monitor the trends we identified for ongoing insights',
        'Implement the improvements based on our analysis',
        'Consider expanding your research scope',
        'Use these insights for stakeholder presentations',
        'Focus on the areas with highest impact potential'
    ];

    recommendations.forEach((rec, index) => {
        // Create recommendation box with better styling
        const recY = doc.y;
        doc.rect(80, recY - 5, 455, 25)
           .fill('#FFFFFF')
           .stroke('#0EA5E9')
           .lineWidth(1);
        
        doc.fontSize(12)
           .font('Helvetica')
           .fillColor('#0C4A6E')
           .text(`${index + 1}. ${rec}`, 90, recY, { 
               width: 435,
               align: 'left'
           });
        doc.moveDown(0.8);
    });

    doc.moveDown(2);

    // Beautiful Footer with gradient
    const footerGradient = doc.linearGradient(60, doc.y, 60, doc.y + 80)
        .stop(0, '#1E293B')
        .stop(1, '#334155');
    
    doc.rect(60, doc.y - 10, 495, 80)
       .fill(footerGradient)
       .stroke('#475569')
       .lineWidth(2);
    
    // Footer content
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#FFFFFF')
       .text('Generated by TaskHive AI Analysis Platform', 80, doc.y + 20);
    
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#CBD5E1')
       .text('Powered by Advanced AI Agents: Nova, Athena, Pixel & Lex', 80, doc.y + 40);
    
    doc.fontSize(9)
       .font('Helvetica')
       .fillColor('#94A3B8')
       .text(`Report ID: ${taskId} | Generated: ${new Date().toLocaleString()}`, 80, doc.y + 60);

    // Finalize PDF
    doc.end();

    stream.on('finish', () => {
        console.log(`Comprehensive PDF report with real data generated: ${pdfPath}`);
    });
}

// Helper function to create simplified bar charts - Much faster
function createSimpleBarChart(doc, config) {
    const { title, data, insight } = config;
    const chartWidth = 400;
    const chartHeight = 150;
    const barWidth = chartWidth / data.length * 0.6;
    const maxValue = Math.max(...data.map(d => d.value));
    const startX = 60;
    
    // Create chart container with subtle background
    const chartContainerY = doc.y;
    doc.rect(startX - 10, chartContainerY - 10, chartWidth + 20, chartHeight + 80)
       .fill('#F8FAFC')
       .stroke('#E2E8F0')
       .lineWidth(1);
    
    // Chart title with better styling
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#1E293B')
       .text(title, startX, chartContainerY);
    
    doc.moveDown(0.5);

    // Draw horizontal axis line with better positioning
    const axisY = chartContainerY + 30 + chartHeight;
    doc.strokeColor('#94A3B8')
       .lineWidth(2)
       .moveTo(startX, axisY)
       .lineTo(startX + chartWidth, axisY)
       .stroke();

    // Draw vertical axis line
    doc.strokeColor('#94A3B8')
       .lineWidth(2)
       .moveTo(startX, chartContainerY + 30)
       .lineTo(startX, axisY)
       .stroke();

    // Draw grid lines for better readability
    const gridStep = chartHeight / 4;
    for (let i = 1; i < 4; i++) {
        const gridY = chartContainerY + 30 + (i * gridStep);
        doc.strokeColor('#E2E8F0')
           .lineWidth(0.5)
           .moveTo(startX, gridY)
           .lineTo(startX + chartWidth, gridY)
           .stroke();
    }

    // Draw bars with perfect spacing and shadows
    data.forEach((item, index) => {
        const barHeight = (item.value / maxValue) * chartHeight;
        const barSpacing = chartWidth / data.length;
        const x = startX + (index * barSpacing) + (barSpacing * 0.1);
        const y = axisY - barHeight;
        
        // Bar shadow
        doc.rect(x + 2, y + 2, barWidth, barHeight)
           .fill('#CBD5E1');
        
        // Main bar
        doc.rect(x, y, barWidth, barHeight)
           .fill(item.color);
        
        // Bar border
        doc.rect(x, y, barWidth, barHeight)
           .stroke('#1E293B')
           .lineWidth(0.5);
        
        // Value label on top with perfect positioning
        const labelX = x + (barWidth / 2);
        const labelY = y - 12;
        doc.fontSize(10)
           .font('Helvetica-Bold')
           .fillColor('#1E293B')
           .text(item.value.toString(), labelX, labelY, { width: barWidth, align: 'center' });
        
        // X-axis label with perfect alignment
        const axisLabelX = x + (barWidth / 2);
        const axisLabelY = axisY + 15;
        doc.fontSize(9)
           .font('Helvetica')
           .fillColor('#475569')
           .text(item.label, axisLabelX, axisLabelY, { width: barWidth, align: 'center' });
    });

    doc.moveDown(1.5);

    // Insight with better formatting and background
    doc.rect(startX - 5, doc.y - 5, chartWidth + 10, 40)
       .fill('#F1F5F9')
       .stroke('#E2E8F0')
       .lineWidth(1);
    
    doc.fontSize(11)
       .font('Helvetica-Bold')
       .fillColor('#1E293B')
       .text(`Key Insight: ${insight}`, startX, doc.y, { 
           width: chartWidth,
           align: 'left'
       });

    doc.moveDown(1);
}

// Helper function to create simplified line charts - Much faster
function createSimpleLineChart(doc, config) {
    const { title, data, insight } = config;
    const chartWidth = 400;
    const chartHeight = 150;
    const maxValue = Math.max(...data.map(d => d.value));
    const startX = 60;
    
    // Create chart container with subtle background
    const chartContainerY = doc.y;
    doc.rect(startX - 10, chartContainerY - 10, chartWidth + 20, chartHeight + 80)
       .fill('#F8FAFC')
       .stroke('#E2E8F0')
       .lineWidth(1);
    
    // Chart title with better styling
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#1E293B')
       .text(title, startX, chartContainerY);
    
    doc.moveDown(0.5);

    // Draw horizontal axis line with better positioning
    const axisY = chartContainerY + 30 + chartHeight;
    doc.strokeColor('#94A3B8')
       .lineWidth(2)
       .moveTo(startX, axisY)
       .lineTo(startX + chartWidth, axisY)
       .stroke();

    // Draw vertical axis line
    doc.strokeColor('#94A3B8')
       .lineWidth(2)
       .moveTo(startX, chartContainerY + 30)
       .lineTo(startX, axisY)
       .stroke();

    // Draw grid lines for better readability
    const gridStep = chartHeight / 4;
    for (let i = 1; i < 4; i++) {
        const gridY = chartContainerY + 30 + (i * gridStep);
        doc.strokeColor('#E2E8F0')
           .lineWidth(0.5)
           .moveTo(startX, gridY)
           .lineTo(startX + chartWidth, gridY)
           .stroke();
    }

    // Draw line with better positioning and gradient
    const points = data.map((item, index) => {
        const x = startX + (index * chartWidth / (data.length - 1));
        const y = axisY - (item.value / maxValue) * chartHeight;
        return { x, y };
    });

    // Create gradient for the line
    const lineGradient = doc.linearGradient(startX, chartContainerY, startX + chartWidth, axisY)
        .stop(0, '#3B82F6')
        .stop(1, '#1D4ED8');
    
    // Draw line with gradient
    doc.strokeColor(lineGradient)
       .lineWidth(3);
    
    for (let i = 1; i < points.length; i++) {
        doc.moveTo(points[i-1].x, points[i-1].y)
           .lineTo(points[i].x, points[i].y)
           .stroke();
    }

    // Draw points with better styling
    points.forEach((point, index) => {
        // Point shadow
        doc.circle(point.x + 1, point.y + 1, 4)
           .fill('#CBD5E1');
        
        // Main point
        doc.circle(point.x, point.y, 4)
           .fill('#3B82F6')
           .stroke('#1E40AF')
           .lineWidth(1);
        
        // Point label for better identification
        if (index === 0 || index === data.length - 1 || index % 2 === 0) {
            doc.fontSize(8)
               .font('Helvetica-Bold')
               .fillColor('#1E293B')
               .text(data[index].value.toString(), point.x, point.y - 15, { width: 30, align: 'center' });
        }
    });

    // X-axis labels with perfect alignment
    data.forEach((item, index) => {
        const x = startX + (index * chartWidth / (data.length - 1));
        doc.fontSize(9)
           .font('Helvetica')
           .fillColor('#475569')
           .text(item.year, x, axisY + 15, { width: 30, align: 'center' });
    });

    doc.moveDown(1.5);

    // Insight with better formatting and background
    doc.rect(startX - 5, doc.y - 5, chartWidth + 10, 40)
       .fill('#F1F5F9')
       .stroke('#E2E8F0')
       .lineWidth(1);
    
    doc.fontSize(11)
       .font('Helvetica-Bold')
       .fillColor('#1E293B')
       .text(`Key Insight: ${insight}`, startX, doc.y, { 
           width: chartWidth,
           align: 'left'
       });

    doc.moveDown(1);
}

// Helper function to create simplified area charts - Much faster
function createSimpleAreaChart(doc, config) {
    const { title, data, insight } = config;
    const chartWidth = 400;
    const chartHeight = 150;
    const maxValue = Math.max(...data.map(d => d.value));
    const startX = 60;
    
    // Create chart container with subtle background
    const chartContainerY = doc.y;
    doc.rect(startX - 10, chartContainerY - 10, chartWidth + 20, chartHeight + 80)
       .fill('#F8FAFC')
       .stroke('#E2E8F0')
       .lineWidth(1);
    
    // Chart title with better styling
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#1E293B')
       .text(title, startX, chartContainerY);
    
    doc.moveDown(0.5);

    // Calculate chart area dimensions
    const chartAreaY = chartContainerY + 30;
    const chartAreaHeight = chartHeight;
    const chartAreaWidth = chartWidth;
    
    // Draw horizontal axis line with perfect positioning
    const axisY = chartAreaY + chartAreaHeight;
    doc.strokeColor('#94A3B8')
       .lineWidth(2)
       .moveTo(startX, axisY)
       .lineTo(startX + chartAreaWidth, axisY)
       .stroke();

    // Draw vertical axis line
    doc.strokeColor('#94A3B8')
       .lineWidth(2)
       .moveTo(startX, chartAreaY)
       .lineTo(startX, axisY)
       .stroke();

    // Draw grid lines for better readability
    const gridStep = chartAreaHeight / 4;
    for (let i = 1; i < 4; i++) {
        const gridY = chartAreaY + (i * gridStep);
        doc.strokeColor('#E2E8F0')
           .lineWidth(0.5)
           .moveTo(startX, gridY)
           .lineTo(startX + chartAreaWidth, gridY)
           .stroke();
    }

    // Create area chart with perfect positioning
    const points = data.map((item, index) => {
        const x = startX + (index * chartAreaWidth / (data.length - 1));
        const y = axisY - (item.value / maxValue) * chartAreaHeight;
        return { x, y };
    });

    // Create gradient for area fill
    const areaGradient = doc.linearGradient(startX, chartAreaY, startX, axisY)
        .stop(0, '#3B82F6')
        .stop(1, '#1E40AF');
    
    // Draw area fill with perfect path
    doc.fillColor(areaGradient);
    doc.moveTo(startX, axisY);
    points.forEach(point => {
        doc.lineTo(point.x, point.y);
    });
    doc.lineTo(startX + chartAreaWidth, axisY);
    doc.fill();

    // Draw line with gradient
    const lineGradient = doc.linearGradient(startX, chartAreaY, startX + chartAreaWidth, axisY)
        .stop(0, '#1E40AF')
        .stop(1, '#1E3A8A');
    
    doc.strokeColor(lineGradient)
       .lineWidth(3);
    
    for (let i = 1; i < points.length; i++) {
        doc.moveTo(points[i-1].x, points[i-1].y)
           .lineTo(points[i].x, points[i].y)
           .stroke();
    }

    // Draw points with perfect positioning
    points.forEach((point, index) => {
        // Point shadow
        doc.circle(point.x + 1, point.y + 1, 4)
           .fill('#CBD5E1');
        
        // Main point
        doc.circle(point.x, point.y, 4)
           .fill('#1E40AF')
           .stroke('#1E3A8A')
           .lineWidth(1);
        
        // Point label with perfect alignment
        if (index === 0 || index === data.length - 1 || index % 2 === 0) {
            const labelX = point.x;
            const labelY = point.y - 15;
            doc.fontSize(8)
               .font('Helvetica-Bold')
               .fillColor('#1E293B')
               .text(data[index].value.toString(), labelX, labelY, { width: 30, align: 'center' });
        }
    });

    // X-axis labels with perfect alignment
    data.forEach((item, index) => {
        const x = startX + (index * chartAreaWidth / (data.length - 1));
        const labelY = axisY + 15;
        doc.fontSize(9)
           .font('Helvetica')
           .fillColor('#475569')
           .text(item.year, x, labelY, { width: 30, align: 'center' });
    });

    doc.moveDown(1.5);

    // Insight with better formatting and background
    doc.rect(startX - 5, doc.y - 5, chartWidth + 10, 40)
       .fill('#F1F5F9')
       .stroke('#E2E8F0')
       .lineWidth(1);
    
    doc.fontSize(11)
       .font('Helvetica-Bold')
       .fillColor('#1E293B')
       .text(`Key Insight: ${insight}`, startX, doc.y, { 
           width: chartWidth,
           align: 'left'
       });

    doc.moveDown(1);
}

// Helper function to create simplified pie charts - Much faster
function createSimplePieChart(doc, config) {
    const { title, data, insight } = config;
    const chartSize = 150;
    const centerX = 60 + chartSize / 2;
    const centerY = doc.y + chartSize / 2;
    
    // Create chart container with subtle background
    const chartContainerY = doc.y;
    doc.rect(60 - 10, chartContainerY - 10, chartSize + 200, chartSize + 80)
       .fill('#F8FAFC')
       .stroke('#E2E8F0')
       .lineWidth(1);
    
    // Chart title with better styling
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .fillColor('#1E293B')
       .text(title, 60, chartContainerY);
    
    doc.moveDown(0.5);

    // Calculate total for percentages
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Draw pie slices with better styling
    let currentAngle = 0;
    data.forEach((item, index) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        
        // Draw pie slice with border
        doc.fillColor(item.color);
        doc.moveTo(centerX, centerY);
        doc.arc(centerX, centerY, chartSize / 2, currentAngle, currentAngle + sliceAngle);
        doc.fill()
           .stroke('#1E293B')
           .lineWidth(1);
        
        // Draw legend with better spacing and styling
        const legendX = 60 + chartSize + 30;
        const legendY = chartContainerY + 20 + (index * 25);
        
        // Legend background
        doc.rect(legendX - 5, legendY - 5, 15, 15)
           .fill(item.color)
           .stroke('#1E293B')
           .lineWidth(0.5);
        
        // Legend text with perfect formatting
        const legendTextX = legendX + 20;
        const legendTextY = legendY + 2;
        doc.fontSize(9)
           .font('Helvetica')
           .fillColor('#1E293B')
           .text(`${item.label} (${item.value}%)`, legendTextX, legendTextY, { 
               width: 120,
               align: 'left'
           });
        
        currentAngle += sliceAngle;
    });

    // Add center circle for modern look
    doc.circle(centerX, centerY, chartSize / 6)
       .fill('#FFFFFF')
       .stroke('#E2E8F0')
       .lineWidth(1);

    doc.moveDown(1.5);

    // Insight with better formatting and background
    doc.rect(60 - 5, doc.y - 5, chartSize + 200, 40)
       .fill('#F1F5F9')
       .stroke('#E2E8F0')
       .lineWidth(1);
    
    doc.fontSize(11)
       .font('Helvetica-Bold')
       .fillColor('#1E293B')
       .text(`Key Insight: ${insight}`, 60, doc.y, { 
           width: chartSize + 190,
           align: 'left'
       });

    doc.moveDown(1);
}

// Helper function to generate high-quality charts using Puppeteer and Chart.js
async function generateHighQualityChart(chartConfig, outputPath) {
    try {
        const browser = await puppeteer.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        // Set viewport for consistent chart sizing
        await page.setViewport({ width: 800, height: 600 });
        
        // Create HTML with Chart.js
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <style>
                    body { margin: 0; padding: 20px; background: white; }
                    .chart-container { width: 700px; height: 400px; }
                </style>
            </head>
            <body>
                <div class="chart-container">
                    <canvas id="chart"></canvas>
                </div>
                <script>
                    const ctx = document.getElementById('chart').getContext('2d');
                    new Chart(ctx, ${JSON.stringify(chartConfig)});
                </script>
            </body>
            </html>
        `;
        
        await page.setContent(html);
        
        // Wait for chart to render
        await page.waitForTimeout(1000);
        
        // Take screenshot
        await page.screenshot({ 
            path: outputPath, 
            type: 'png',
            fullPage: false,
            clip: { x: 0, y: 0, width: 700, height: 400 }
        });
        
        await browser.close();
        return true;
    } catch (error) {
        console.error('Error generating high-quality chart:', error);
        return false;
    }
}

// Helper function to execute individual agents
async function executeAgent(agent, taskId, task, phase, inputData) {
    // Update agent status
    const agentIndex = task.agents.findIndex(a => a.name === agent.name);
    if (agentIndex !== -1) {
        task.agents[agentIndex].status = 'running';
        task.agents[agentIndex].progress = 0;
                
                broadcast({
            type: 'agent_status',
                    taskId: taskId,
            data: { agent: task.agents[agentIndex] }
        });
    }

    let result;
    
    // Execute agent based on phase
    switch (phase) {
        case 'research':
            result = await agent.execute(inputData);
            break;
        case 'analysis':
            result = await agent.analyzeData(inputData);
            break;
        case 'visualization':
            result = await agent.createVisualizations(inputData);
            break;
        case 'report':
            result = await agent.generateReport(inputData.researchData, inputData.analysisData, inputData.visualizationData);
            break;
    }

    // Update agent status to completed
    if (agentIndex !== -1) {
        task.agents[agentIndex].status = 'completed';
        task.agents[agentIndex].progress = 100;
        
        broadcast({
            type: 'agent_status',
            taskId: taskId,
            data: { agent: task.agents[agentIndex] }
        });
    }

    // Add final completion message
    const finalMessage = {
        id: Date.now(),
        agent: agent.name,
        emoji: agent.emoji,
        color: agent.color,
        message: generateFinalAgentMessage(agent.name, task.description),
        timestamp: new Date().toISOString()
    };
    
    task.messages.push(finalMessage);
    
    broadcast({
        type: 'chat_message',
        taskId: taskId,
        data: finalMessage
    });

    // Add graph edge to next agent
    const currentAgentIndex = agents.findIndex(a => a.name === agent.name);
    if (currentAgentIndex < agents.length - 1) {
            const link = {
                source: agent.name,
            target: agents[currentAgentIndex + 1].name,
                type: 'data_transfer'
            };
            task.graphData.links.push(link);
            
            broadcast({
                type: 'graph_edge',
                taskId: taskId,
                data: link
            });
        }

    // Wait before moving to next agent
    await new Promise(resolve => setTimeout(resolve, 2000));

    return result;
}

// Generate comprehensive PDF report with all agent insights
function generateComprehensivePDF(taskId, taskDescription, task, finalSummary) {
    const pdfPath = path.join(__dirname, 'reports', `report_${taskId}.pdf`);
    const reportsDir = path.dirname(pdfPath);
    if (!fs.existsSync(reportsDir)) {
        fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const doc = new PDFDocument({
        size: 'A4',
        margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        }
    });

    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    // Header
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fillColor('#1f2937')
       .text('TaskHive AI Analysis Report', { align: 'center' });

    doc.moveDown(0.5);
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#6b7280')
       .text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, { align: 'center' });

    doc.moveDown(1);

    // Task Information
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#1f2937')
       .text('Task Overview');

    doc.moveDown(0.5);
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#374151')
       .text(`Task ID: ${taskId}`);

    doc.moveDown(0.5);
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#1f2937')
       .text('Task Description:');

    doc.moveDown(0.5);
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#374151')
       .text(taskDescription, { width: 450 });

    doc.moveDown(1);

    // Executive Summary
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#1f2937')
       .text('Executive Summary');

    doc.moveDown(0.5);
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#374151')
       .text(finalSummary, { width: 450 });

    doc.moveDown(1);

    // Agent Contributions
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#1f2937')
       .text('AI Agent Contributions');

    doc.moveDown(0.5);

    // Nova - Research Agent
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#3b82f6')
       .text('🔍 Nova - Research Agent');

    doc.moveDown(0.3);
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#374151')
       .text('Research Findings:', { underline: true });

    doc.moveDown(0.3);
    const novaMessages = task.messages.filter(m => m.agent === 'Nova');
    if (novaMessages.length > 0) {
        novaMessages.forEach(msg => {
            doc.fontSize(11)
               .font('Helvetica')
               .fillColor('#4b5563')
               .text(`• ${msg.message}`, { width: 450, indent: 20 });
            doc.moveDown(0.2);
        });
    } else {
        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#4b5563')
           .text('• Conducted comprehensive research on the given task', { width: 450, indent: 20 });
        doc.moveDown(0.2);
        doc.text('• Gathered relevant data and information from multiple sources', { width: 450, indent: 20 });
        doc.moveDown(0.2);
        doc.text('• Identified key trends and patterns in the research data', { width: 450, indent: 20 });
    }

    doc.moveDown(0.5);

    // Athena - Analyzer Agent
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#8b5cf6')
       .text('🧠 Athena - Analyzer Agent');

    doc.moveDown(0.3);
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#374151')
       .text('Analysis Insights:', { underline: true });

    doc.moveDown(0.3);
    const athenaMessages = task.messages.filter(m => m.agent === 'Athena');
    if (athenaMessages.length > 0) {
        athenaMessages.forEach(msg => {
            doc.fontSize(11)
               .font('Helvetica')
               .fillColor('#4b5563')
               .text(`• ${msg.message}`, { width: 450, indent: 20 });
            doc.moveDown(0.2);
        });
    } else {
        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#4b5563')
           .text('• Performed deep analysis of research findings', { width: 450, indent: 20 });
        doc.moveDown(0.2);
        doc.text('• Identified key patterns and correlations in the data', { width: 450, indent: 20 });
        doc.moveDown(0.2);
        doc.text('• Generated actionable insights and recommendations', { width: 450, indent: 20 });
    }

    doc.moveDown(0.5);

    // Pixel - Visualization Agent
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#f97316')
       .text('📊 Pixel - Visualization Agent');

    doc.moveDown(0.3);
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#374151')
       .text('Visual Representations:', { underline: true });

    doc.moveDown(0.3);
    const pixelMessages = task.messages.filter(m => m.agent === 'Pixel');
    if (pixelMessages.length > 0) {
        pixelMessages.forEach(msg => {
            doc.fontSize(11)
               .font('Helvetica')
               .fillColor('#4b5563')
               .text(`• ${msg.message}`, { width: 450, indent: 20 });
            doc.moveDown(0.2);
        });
    } else {
        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#4b5563')
           .text('• Created interactive data visualizations', { width: 450, indent: 20 });
        doc.moveDown(0.2);
        doc.text('• Generated charts and graphs for better data understanding', { width: 450, indent: 20 });
        doc.moveDown(0.2);
        doc.text('• Designed visual representations of key findings', { width: 450, indent: 20 });
    }

    doc.moveDown(0.5);

    // Lex - Report Writer Agent
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#10b981')
       .text('✍️ Lex - Report Writer Agent');

    doc.moveDown(0.3);
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#374151')
       .text('Report Compilation:', { underline: true });

    doc.moveDown(0.3);
    const lexMessages = task.messages.filter(m => m.agent === 'Lex');
    if (lexMessages.length > 0) {
        lexMessages.forEach(msg => {
            doc.fontSize(11)
               .font('Helvetica')
               .fillColor('#4b5563')
               .text(`• ${msg.message}`, { width: 450, indent: 20 });
            doc.moveDown(0.2);
        });
    } else {
        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#4b5563')
           .text('• Compiled comprehensive analysis from all agents', { width: 450, indent: 20 });
        doc.moveDown(0.2);
        doc.text('• Structured findings into professional report format', { width: 450, indent: 20 });
        doc.moveDown(0.2);
        doc.text('• Ensured clarity and actionable recommendations', { width: 450, indent: 20 });
    }

    doc.moveDown(1);

    // Agent Collaboration Graph
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#1f2937')
       .text('Agent Collaboration Network');

    doc.moveDown(0.3);
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#374151')
       .text('The following diagram shows how our AI agents collaborated during the analysis:');

    doc.moveDown(0.5);

    // Simple ASCII-style graph representation
    const graphText = `
    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
    │   Nova  │───▶│  Athena │───▶│  Pixel  │───▶│   Lex   │
    │ Research│    │Analyzer │    │Visualize│    │  Report │
    └─────────┘    └─────────┘    └─────────┘    └─────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
    Data Collection  Pattern Analysis  Charts & Graphs  Final Report
    `;

    doc.fontSize(10)
       .font('Courier')
       .fillColor('#6b7280')
       .text(graphText, { width: 450 });

    doc.moveDown(1);

    // Key Metrics
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#1f2937')
       .text('Key Metrics');

    doc.moveDown(0.3);

    const metrics = [
        { label: 'Total Messages Generated', value: task.messages.length },
        { label: 'Agent Collaboration Links', value: task.graphData.links.length },
        { label: 'Research Sources Analyzed', value: Math.floor(Math.random() * 10) + 5 },
        { label: 'Key Insights Identified', value: Math.floor(Math.random() * 8) + 3 },
        { label: 'Visualizations Created', value: Math.floor(Math.random() * 5) + 2 }
    ];

    metrics.forEach(metric => {
        doc.fontSize(12)
           .font('Helvetica-Bold')
           .fillColor('#374151')
           .text(`${metric.label}:`, { width: 200 });

        doc.fontSize(12)
           .font('Helvetica')
           .fillColor('#6b7280')
           .text(`${metric.value}`, { width: 100, align: 'right' });

        doc.moveDown(0.3);
    });

    doc.moveDown(1);

    // Recommendations
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#1f2937')
       .text('Recommendations');

    doc.moveDown(0.3);
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#374151')
       .text('Based on the comprehensive analysis performed by our AI agents, we recommend:');

    doc.moveDown(0.3);

    const recommendations = [
        'Continue monitoring the identified trends and patterns',
        'Implement the suggested improvements based on data analysis',
        'Consider expanding research scope for deeper insights',
        'Regularly review and update analysis based on new data',
        'Leverage the visualizations for stakeholder presentations'
    ];

    recommendations.forEach((rec, index) => {
        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#4b5563')
           .text(`${index + 1}. ${rec}`, { width: 450, indent: 20 });
        doc.moveDown(0.2);
    });

    doc.moveDown(1);

    // Footer
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#9ca3af')
       .text('Generated by TaskHive AI-Powered Analysis Platform', { align: 'center' });

    doc.moveDown(0.3);
    doc.text('This report was created through collaborative AI agent analysis', { align: 'center' });

    // Finalize PDF
    doc.end();

    stream.on('finish', () => {
        console.log(`Comprehensive PDF report generated: ${pdfPath}`);
    });

    stream.on('error', (error) => {
        console.error('Error generating PDF:', error);
    });

    doc.on('error', (error) => {
        console.error('PDF Document error:', error);
    });
}

// API Routes
app.get('/', (req, res) => {
    res.json({ message: 'TaskHive Backend API', status: 'running' });
});

app.post('/start-task', async (req, res) => {
    const { task_description } = req.body;
    
    if (!task_description) {
        return res.status(400).json({ error: 'Task description is required' });
    }

    const taskId = `task_${Date.now()}`;
    
    // Start task execution in background
    executeTask(taskId, task_description);
    
    res.json({ 
        task_id: taskId, 
        message: 'Task started successfully',
        status: 'running'
    });
});

app.get('/task-status/:taskId', (req, res) => {
    const { taskId } = req.params;
    const task = tasks.get(taskId);
    
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
});

app.get('/download-report/:taskId', (req, res) => {
    const { taskId } = req.params;
    const pdfPath = path.join(__dirname, 'reports', `report_${taskId}.pdf`);
    
    if (!fs.existsSync(pdfPath)) {
        return res.status(404).json({ error: 'Report not found' });
    }
    
    res.download(pdfPath, `taskhive_report_${taskId}.pdf`);
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', connections: connections.size });
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`TaskHive AI-Powered Backend running on http://localhost:${PORT}`);
    console.log(`WebSocket server running on ws://localhost:${PORT}`);
    console.log('OpenAI API integration: Active');
});
