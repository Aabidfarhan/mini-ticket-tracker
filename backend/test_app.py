from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

response = client.post("/tickets", json={"title": "Test", "description": "Test desc"})
print("Create response:", response.status_code, response.json())

response = client.get("/tickets")
print("List response:", response.status_code, response.json())

