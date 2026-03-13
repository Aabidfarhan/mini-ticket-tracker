import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_ticket_invalid_title():
    # Validation test returning 400 (or 422 depending on FastAPI setup) for invalid input
    response = client.post(
        "/tickets",
        json={
            "title": "ab",  # Title length < 3
            "description": "Validation test"
        }
    )
    # FastAPI usually returns 422 for pydantic validation, but Stage C asks for 400.
    # Asserting both to be safe or depending on the candidate's custom error handler.
    assert response.status_code in [400, 422]

def test_get_ticket_not_found():
    # Not-found test returning 404
    response = client.get("/tickets/99999")
    assert response.status_code == 404

def test_ticket_persistence():
    # Persistence test (create -> fetch/verify from DB)
    
    # 1. Create
    payload = {
        "title": "Persistence Test Ticket",
        "description": "Checking if this saves to the DB"
    }
    create_req = client.post("/tickets", json=payload)
    
    # 201 or 200 are acceptable depending on implementation, but it needs to succeed
    assert create_req.status_code in [200, 201]
    
    ticket_data = create_req.json()
    ticket_id = ticket_data.get("id")
    assert ticket_id is not None
    
    # 2. Fetch and Verify
    fetch_req = client.get(f"/tickets/{ticket_id}")
    assert fetch_req.status_code == 200
    
    fetched_data = fetch_req.json()
    assert fetched_data["title"] == payload["title"]
    assert fetched_data["description"] == payload["description"]
    assert fetched_data["status"] == "NEW"