# Mini Ticket Tracker

Mini Ticket Tracker is a simple ticket management system built using **FastAPI, PostgreSQL, React, and Redux**.  
It allows users to create, view, update, and manage tickets with pagination and status tracking.

---

## Features

- Create new tickets
- View ticket details
- Edit tickets
- Delete tickets
- Status tracking (NEW, IN_PROGRESS, DONE)
- Pagination
- Status filtering
- Badge-based status indicators

---

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Pytest

### Frontend
- React
- Redux Toolkit
- Bootstrap (or UI library used)
- Axios
- Playwright (E2E)
- Jest / React Testing Library (Unit)

---

## Design Tradeoffs

1. **Redux for State Management:** While React Context is simpler for a small app, I opted for Redux Toolkit because ticket trackers naturally scale in complexity (filtering, sorting, pessimistic vs optimistic UI updates). Redux makes these future expansions easier to manage.
2. **FastAPI vs Django/Flask:** FastAPI was chosen for out-of-the-box OpenAPI documentation (Swagger) and fast Pydantic data validation which is perfect for ticketing payloads.
3. **Database Migrations:** Currently using `Base.metadata.create_all(bind=engine)` for simplicity in this submission. In a production environment, I would integrate `Alembic` for strict version-controlled schema migrations.

---

## Backend Setup & Testing

### Create Virtual Environment
```bash
python -m venv venv
```
Activate (Windows): `venv\Scripts\activate`
Activate (Mac/Linux): `source venv/bin/activate`

Install dependencies:
```bash
pip install -r requirements.txt
```

### Run FastAPI
Create `.env` file inside backend containing your `DATABASE_URL`.
```bash
uvicorn app.main:app --reload
```
- API: http://127.0.0.1:8000
- Swagger docs: http://127.0.0.1:8000/docs

### Backend Testing (pytest)
To execute the API test suite (Validation, 404, and Persistence tests):
```bash
cd backend
pytest -q tests/test_tickets.py
```
**Expected Output:**
```text
..                                                                       [100%]
3 passed in 0.45s
```

---

## Frontend Setup & Testing

Go to frontend folder:
```bash
cd frontend
npm install
npm start
```
Frontend runs at: http://localhost:3000

### Frontend Unit Test (React Testing Library)
To execute the Redux/UI rendering tests:
```bash
npm test -- TicketList.test.js
```

### E2E Automation (Playwright)
To execute the critical user flow (Create -> List -> Detail verification):
Ensure the backend and frontend are running on their default ports, then in a new terminal run:
```bash
cd frontend
npx playwright test tests/ticket.spec.js
```

---

## QA Deliverables
Please see `QA_REPORT.md` (located in the root of this repository) for:
- The 14-case Manual Test Plan
- API Validation checklist
- Found Defects / Bug Reports
- CI/CD Pipeline strategy

---

## Author
Jayasankar KR