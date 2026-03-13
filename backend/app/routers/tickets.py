from pydantic import BaseModel, Field
from fastapi import APIRouter
from typing import Optional
from datetime import datetime
from enum import Enum

router = APIRouter()

class TicketStatus(str, Enum):
    NEW = "NEW"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"


class TicketCreate(BaseModel):
    title: str = Field(..., min_length=3)
    description: Optional[str] = None


class TicketUpdate(BaseModel):
    status: Optional[TicketStatus] = None
    description: Optional[str] = None


class TicketResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: TicketStatus
    created_at: datetime

    class Config:
        from_attributes = True