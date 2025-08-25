import asyncio
import json
import os
from datetime import datetime
from typing import Dict, List, Any
from dataclasses import dataclass, asdict

from agents.research_agent import ResearchAgent
from agents.analyzer_agent import AnalyzerAgent
from agents.visualization_agent import VisualizationAgent
from agents.report_writer_agent import ReportWriterAgent

@dataclass
class AgentStatus:
    name: str
    role: str
    status: str  # "idle", "working", "completed", "error"
    progress: int  # 0-100
    color: str
    emoji: str
    last_message: str = ""
    start_time: str = ""
    end_time: str = ""

class TaskCoordinator:
    def __init__(self, task_id: str, task_description: str, websocket_manager):
        self.task_id = task_id
        self.task_description = task_description
        self.websocket_manager = websocket_manager
        self.status = "initializing"
        self.progress = 0
        self.start_time = datetime.now()
        
        # Initialize agents
        self.agents = {
            "nova": ResearchAgent("Nova", "ResearchAgent", "🔍", "blue"),
            "athena": AnalyzerAgent("Athena", "AnalyzerAgent", "🧠", "purple"),
            "pixel": VisualizationAgent("Pixel", "VisualizationAgent", "📊", "orange"),
            "lex": ReportWriterAgent("Lex", "ReportWriterAgent", "✍️", "green")
        }
        
        # Agent status tracking
        self.agent_statuses = {
            name: AgentStatus(
                name=agent.name,
                role=agent.role,
                status="idle",
                progress=0,
                color=agent.color,
                emoji=agent.emoji
            )
            for name, agent in self.agents.items()
        }
        
        # Task data storage
        self.research_data = {}
        self.analysis_results = {}
        self.visualizations = {}
        self.final_report = ""
        self.report_path = ""
        
        # Create reports directory
        os.makedirs("reports", exist_ok=True)
        
    async def broadcast_update(self, message_type: str, data: Dict[str, Any]):
        """Send update to all connected WebSocket clients"""
        message = {
            "type": message_type,
            "task_id": self.task_id,
            "timestamp": datetime.now().isoformat(),
            **data
        }
        await self.websocket_manager.broadcast(json.dumps(message))
    
    async def update_agent_status(self, agent_name: str, status: str, progress: int = None, message: str = ""):
        """Update agent status and broadcast to frontend"""
        agent_status = self.agent_statuses[agent_name]
        agent_status.status = status
        if progress is not None:
            agent_status.progress = progress
        if message:
            agent_status.last_message = message
            
        if status == "working" and not agent_status.start_time:
            agent_status.start_time = datetime.now().isoformat()
        elif status in ["completed", "error"] and not agent_status.end_time:
            agent_status.end_time = datetime.now().isoformat()
        
        await self.broadcast_update("agent_status", {
            "agent": agent_name,
            "status": asdict(agent_status)
        })
    
    async def log_conversation(self, agent_name: str, message: str, message_type: str = "info"):
        """Log agent conversation and broadcast to chat"""
        log_entry = {
            "agent": agent_name,
            "message": message,
            "type": message_type,
            "timestamp": datetime.now().isoformat(),
            "color": self.agents[agent_name].color,
            "emoji": self.agents[agent_name].emoji
        }
        
        await self.broadcast_update("chat_message", log_entry)
    
    async def update_graph_edges(self, from_agent: str, to_agent: str, edge_type: str = "data"):
        """Update graph visualization with agent interactions"""
        edge_data = {
            "from": from_agent,
            "to": to_agent,
            "type": edge_type,
            "timestamp": datetime.now().isoformat()
        }
        
        await self.broadcast_update("graph_edge", edge_data)
    
    async def run_workflow(self):
        """Main workflow orchestration"""
        try:
            self.status = "running"
            await self.broadcast_update("workflow_start", {
                "task_description": self.task_description
            })
            
            # Step 1: Research Phase (Nova)
            await self.update_agent_status("nova", "working", 0, "Starting research...")
            await self.log_conversation("nova", f"🔍 Beginning research on: {self.task_description}")
            
            research_data = await self.agents["nova"].execute(self.task_description)
            self.research_data = research_data
            
            await self.update_agent_status("nova", "completed", 100, "Research completed!")
            await self.log_conversation("nova", f"✅ Research complete! Found {len(research_data.get('sources', []))} sources")
            await self.update_graph_edges("nova", "athena", "research_data")
            
            # Step 2: Analysis Phase (Athena)
            await self.update_agent_status("athena", "working", 0, "Analyzing research data...")
            await self.log_conversation("athena", "🧠 Processing research findings...")
            
            analysis_results = await self.agents["athena"].execute(research_data)
            self.analysis_results = analysis_results
            
            await self.update_agent_status("athena", "completed", 100, "Analysis completed!")
            await self.log_conversation("athena", f"✅ Analysis complete! Key insights identified")
            await self.update_graph_edges("athena", "pixel", "analysis_data")
            
            # Step 3: Visualization Phase (Pixel)
            await self.update_agent_status("pixel", "working", 0, "Creating visualizations...")
            await self.log_conversation("pixel", "📊 Generating charts and graphs...")
            
            visualizations = await self.agents["pixel"].execute(analysis_results)
            self.visualizations = visualizations
            
            await self.update_agent_status("pixel", "completed", 100, "Visualizations completed!")
            await self.log_conversation("pixel", f"✅ Visualizations complete! Created {len(visualizations.get('charts', []))} charts")
            await self.update_graph_edges("pixel", "lex", "visualization_data")
            
            # Step 4: Report Generation (Lex)
            await self.update_agent_status("lex", "working", 0, "Writing final report...")
            await self.log_conversation("lex", "✍️ Compiling comprehensive report...")
            
            report_data = {
                "task_description": self.task_description,
                "research_data": research_data,
                "analysis_results": analysis_results,
                "visualizations": visualizations
            }
            
            final_report = await self.agents["lex"].execute(report_data)
            self.final_report = final_report
            
            # Generate PDF report
            self.report_path = f"reports/taskhive_report_{self.task_id}.pdf"
            await self.agents["lex"].generate_pdf_report(final_report, self.report_path)
            
            await self.update_agent_status("lex", "completed", 100, "Report completed!")
            await self.log_conversation("lex", "✅ Final report complete! PDF generated successfully")
            
            # Workflow complete
            self.status = "completed"
            self.progress = 100
            
            await self.broadcast_update("workflow_complete", {
                "report_path": self.report_path,
                "total_duration": str(datetime.now() - self.start_time)
            })
            
            await self.log_conversation("system", "🎉 Task workflow completed successfully!", "success")
            
        except Exception as e:
            self.status = "error"
            await self.log_conversation("system", f"❌ Workflow error: {str(e)}", "error")
            await self.broadcast_update("workflow_error", {"error": str(e)})
    
    def get_status(self) -> str:
        """Get current workflow status"""
        return self.status
    
    def get_progress(self) -> int:
        """Get overall progress percentage"""
        return self.progress
    
    def get_agent_statuses(self) -> Dict[str, Dict]:
        """Get status of all agents"""
        return {name: asdict(status) for name, status in self.agent_statuses.items()}
    
    def get_report_path(self) -> str:
        """Get path to generated PDF report"""
        return self.report_path
