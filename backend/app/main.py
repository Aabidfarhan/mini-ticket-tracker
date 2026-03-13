from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional, List


from .database import Base, engine, get_db
from .models.ticket import Ticket,TicketStatus
from . import schemas



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
Base.metadata.create_all(bind=engine)


# CREATE TICKET
@app.post("/tickets", response_model=schemas.TicketResponse)
def create_ticket(ticket: schemas.TicketCreate, db: Session = Depends(get_db)):

    new_ticket = Ticket(
        title=ticket.title,
        description=ticket.description
    )

    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)

    return new_ticket


# LIST TICKETS (Pagination + Filter)
@app.get("/tickets", response_model=List[schemas.TicketResponse])
def list_tickets(
    limit: int = 10,
    offset: int = 0,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):

    query = db.query(Ticket).order_by(Ticket.id.desc())

    if status:
        query = query.filter(Ticket.status == TicketStatus(status))

    tickets = query.offset(offset).limit(limit).all()

    return tickets


# GET TICKET BY ID
@app.get("/tickets/{ticket_id}", response_model=schemas.TicketResponse)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):

    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return ticket


# UPDATE TICKET
@app.patch("/tickets/{ticket_id}", response_model=schemas.TicketResponse)
def update_ticket(
    ticket_id: int,
    ticket_update: schemas.TicketUpdate,
    db: Session = Depends(get_db)
):

    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if ticket_update.status is not None:
        ticket.status = ticket_update.status


    if ticket_update.description is not None:
        ticket.description = ticket_update.description

    db.commit()
    db.refresh(ticket)

    return ticket


# DELETE TICKET
@app.delete("/tickets/{ticket_id}")
def delete_ticket(ticket_id: int, db: Session = Depends(get_db)):

    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    db.delete(ticket)
    db.commit()

    return {"message": "Ticket deleted"}