import asyncio
from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseAgent(ABC):
    """Base class for all TaskHive agents"""
    
    def __init__(self, name: str, role: str, emoji: str, color: str):
        self.name = name
        self.role = role
        self.emoji = emoji
        self.color = color
        self.status = "idle"
        self.progress = 0
    
    @abstractmethod
    async def execute(self, input_data: Any) -> Dict[str, Any]:
        """Execute the agent's main task"""
        pass
    
    async def simulate_work(self, duration: float = 2.0, steps: int = 10):
        """Simulate work progress with delays"""
        step_duration = duration / steps
        for i in range(steps + 1):
            self.progress = int((i / steps) * 100)
            await asyncio.sleep(step_duration)
    
    def get_status(self) -> Dict[str, Any]:
        """Get current agent status"""
        return {
            "name": self.name,
            "role": self.role,
            "status": self.status,
            "progress": self.progress,
            "color": self.color,
            "emoji": self.emoji
        }
