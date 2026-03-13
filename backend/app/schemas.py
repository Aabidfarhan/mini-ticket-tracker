from pydantic import BaseModel, Field
from typing import Optional
from .models.ticket import TicketStatus
from datetime import date, datetime


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
    created_at: Optional[datetime]

    class Config:
        from_attributes = True