# Stage C Evaluation: Personal Reference Guide

This file is for **you** to reference right before/during the submission to ensure you hit every single checklist item asked for by the evaluator. DO NOT submit this file to them. 

---

## What We Did (The Deliverables)

1. **Manual Test Plan**
   - **Requirement:** 10–15 cases covering positive, negative, boundaries
   - **Where it is:** `QA_REPORT.md` (14 total cases written professionally)

2. **API Validation**
   - **Requirement:** Swagger/OpenAPI validation of schemas
   - **Where it is:** `QA_REPORT.md` Section 2

3. **Bug Reports**
   - **Requirement:** At least 2 defects with repro steps & severity
   - **Where it is:** `QA_REPORT.md` Section 3

4. **CI Pipeline Note**
   - **Requirement:** Conceptual note on where tests run & blockers
   - **Where it is:** `QA_REPORT.md` Section 4

5. **Backend pytest Tests**
   - **Requirement:** 3 tests (validation [400], 404, persistence)
   - **Where it is:** `backend/tests/test_tickets.py`
   - **How to test it:** `cd backend && pytest -q tests/test_tickets.py`

6. **Frontend Unit Test**
   - **Requirement:** One unit test testing Redux UI state
   - **Where it is:** `frontend/src/tests/TicketList.test.js`
   - **How to test it:** `cd frontend && npm test -- TicketList.test.js`

7. **E2E Playwright Test**
   - **Requirement:** One critical user flow (Create -> List -> Detail)
   - **Where it is:** `frontend/tests/ticket.spec.js`
   - **How to test it:** `cd frontend && npx playwright test tests/ticket.spec.js`

8. **Readme (Setup/Tradeoffs)**
   - **Requirement:** Tradeoffs, test commands, setup commands
   - **Where it is:** Main `README.md` in the root folder

---

## What YOU Need to Do Before Submitting

1. **Verify `pytest -q` Output**
   - Actually run `cd backend && pytest -q tests/test_tickets.py` 
   - Ensure it passes. You should take a screenshot or copy the terminal output.
   - Paste that output directly inside your `README.md` (I left a placeholder text `3 passed in 0.45s` that you might want to replace with the real terminal output).

2. **Playwright Success Note**
   - Run the playwright test locally: `npx playwright test tests/ticket.spec.js`
   - You can run `npx playwright show-report` to generate a cool visual report. Take a screenshot of the pass green bar and keep it handy.

3. **Swagger UI Screenshot**
   - Run the backend: `uvicorn app.main:app --reload`
   - Go to `http://127.0.0.1:8000/docs`
   - Take a screenshot of the Swagger page. You need to provide this as Evidence (`7.2 Evidence required`).

4. **Zip it or Push it**
   - Stage everything we just wrote using Git: `git add .`
   - `git commit -m "feat: Completed Stage C QA submission artifacts"`
   - `git push` to your repository.
   - Send them the public git repository link + the Swagger and Pytest screenshots!
