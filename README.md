# TaskHive - AI Agent Collaboration Platform

A full-stack application featuring an intelligent agent system that collaborates to complete complex tasks through research, analysis, visualization, and report generation.

## 🚀 Features

- **Multi-Agent System**: Four specialized AI agents working together
- **Real-Time Updates**: WebSocket-powered live status and chat updates
- **Interactive Dashboard**: Animated agent cards with progress tracking
- **Dynamic Visualization**: Real-time graph showing agent interactions
- **PDF Reports**: Automated report generation with professional formatting
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🤖 Agents

- **Nova** (🔍 ResearchAgent): Blue-themed, curious researcher gathering information
- **Athena** (🧠 AnalyzerAgent): Purple-themed, analytical thinker processing data
- **Pixel** (📊 VisualizationAgent): Orange-themed, creative visualizer creating charts
- **Lex** (✍️ ReportWriterAgent): Green-themed, professional writer generating reports

## 🏗️ Architecture

```
TaskHive/
├── backend/                 # FastAPI backend
│   ├── main.py             # FastAPI app with WebSocket
│   ├── coordinator.py      # Agent orchestration
│   ├── agents/             # Agent implementations
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   ├── package.json        # Node dependencies
│   └── tailwind.config.js  # Tailwind configuration
└── README.md               # This file
```

## 🛠️ Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```bash
   python main.py
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 🎯 Usage

1. Open the frontend in your browser
2. Enter a task description in the input field
3. Click "Start Task" to begin the agent workflow
4. Watch real-time updates as agents collaborate
5. View the interactive graph showing agent interactions
6. Download the final PDF report when complete

## 🔧 API Endpoints

- `POST /start-task`: Initiate a new task workflow
- `WebSocket /ws`: Real-time status updates and chat messages

## 🎨 Technologies Used

### Backend
- FastAPI (Python web framework)
- WebSockets (real-time communication)
- ReportLab (PDF generation)
- asyncio (asynchronous programming)

### Frontend
- React (UI framework)
- Tailwind CSS (styling)
- Framer Motion (animations)
- react-force-graph (graph visualization)
- WebSocket (real-time updates)

## 📝 License

MIT License - feel free to use this project for your own applications!
# Bit_Busters_TaskHive
