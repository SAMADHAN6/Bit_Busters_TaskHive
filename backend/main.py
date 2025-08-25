# FastAPI imports commented out - using Node.js mock server instead
# from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import FileResponse
import asyncio
import json
import uuid
from typing import List, Dict, Any
# from pydantic import BaseModel
import os
from datetime import datetime

# from coordinator import TaskCoordinator

# app = FastAPI(title="TaskHive API", version="1.0.0")

# CORS middleware for frontend communication
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# WebSocket connection manager (commented out - using Node.js mock server)
# class ConnectionManager:
#     def __init__(self):
#         self.active_connections: List[WebSocket] = []
#         self.task_coordinators: Dict[str, TaskCoordinator] = {}

#     async def connect(self, websocket: WebSocket):
#         await websocket.accept()
#         self.active_connections.append(websocket)
#         print(f"WebSocket connected. Total connections: {len(self.active_connections)}")

#     def disconnect(self, websocket: WebSocket):
#         self.active_connections.remove(websocket)
#         print(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

#     async def send_personal_message(self, message: str, websocket: WebSocket):
#         await websocket.send_text(message)

#     async def broadcast(self, message: str):
#         for connection in self.active_connections:
#             try:
#                 await connection.send_text(message)
#             except:
#                 # Remove dead connections
#                 self.active_connections.remove(connection)

# manager = ConnectionManager()

# Pydantic models (commented out - using Node.js mock server)
# class TaskRequest(BaseModel):
#     task_description: str
#     user_id: str = "default_user"

# class TaskResponse(BaseModel):
#     task_id: str
#     status: str
#     message: str

# API Routes (commented out - using Node.js mock server)
# @app.get("/")
# async def root():
#     return {"message": "TaskHive API is running! 🚀"}

# @app.post("/start-task", response_model=TaskResponse)
# async def start_task(task_request: TaskRequest):
#     """Start a new task workflow with all agents"""
#     try:
#         task_id = str(uuid.uuid4())
        
#         # Create new coordinator for this task
#         coordinator = TaskCoordinator(
#             task_id=task_id,
#             task_description=task_request.task_description,
#             websocket_manager=manager
#         )
        
#         manager.task_coordinators[task_id] = coordinator
        
#         # Start the task workflow asynchronously
#         asyncio.create_task(coordinator.run_workflow())
        
#         return TaskResponse(
#             task_id=task_id,
#             status="started",
#             message="Task workflow initiated successfully"
#         )
    
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to start task: {str(e)}")

# @app.get("/task-status/{task_id}")
# async def get_task_status(task_id: str):
#     """Get the current status of a task"""
#     if task_id not in manager.task_coordinators:
#         raise HTTPException(status_code=404, detail="Task not found")
    
#     coordinator = manager.task_coordinators[task_id]
#     return {
#         "task_id": task_id,
#         "status": coordinator.get_status(),
#         "progress": coordinator.get_progress(),
#         "agents": coordinator.get_agent_statuses()
#     }

# @app.get("/download-report/{task_id}")
# async def download_report(task_id: str):
#     """Download the generated PDF report for a task"""
#     if task_id not in manager.task_coordinators:
#         raise HTTPException(status_code=404, detail="Task not found")
    
#     coordinator = manager.task_coordinators[task_id]
#     report_path = coordinator.get_report_path()
    
#     if not os.path.exists(report_path):
#         raise HTTPException(status_code=404, detail="Report not generated yet")
    
#     return FileResponse(
#         path=report_path,
#         filename=f"taskhive_report_{task_id}.pdf",
#         media_type="application/pdf"
#     )

# WebSocket endpoint (commented out - using Node.js mock server)
# @app.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await manager.connect(websocket)
#     try:
#         while True:
#             # Keep connection alive and handle incoming messages
#             data = await websocket.receive_text()
#             message = json.loads(data)
            
#             # Handle different message types
#             if message.get("type") == "ping":
#                 await manager.send_personal_message(
#                     json.dumps({"type": "pong", "timestamp": datetime.now().isoformat()}),
#                     websocket
#                 )
            
#     except WebSocketDisconnect:
#         manager.disconnect(websocket)
#     except Exception as e:
#         print(f"WebSocket error: {e}")
#         manager.disconnect(websocket)

# Health check endpoint (commented out - using Node.js mock server)
# @app.get("/health")
# async def health_check():
#     return {
#         "status": "healthy",
#         "timestamp": datetime.now().isoformat(),
#         "active_connections": len(manager.active_connections),
#         "active_tasks": len(manager.task_coordinators)
#     }

# Main execution (commented out - using Node.js mock server)
# if __name__ == "__main__":
#     import uvicorn
#     print("🚀 Starting TaskHive Backend...")
#     print("📡 WebSocket endpoint: ws://localhost:8000/ws")
#     print("🌐 API documentation: http://localhost:8000/docs")
#     uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

# Note: This file is now using the Node.js mock server (mock-server.js) instead of FastAPI
print("✅ FastAPI code commented out - using Node.js mock server for preview")
