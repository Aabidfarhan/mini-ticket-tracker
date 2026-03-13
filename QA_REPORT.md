# QA Test Execution Report
**Project:** Mini Ticket Tracker  
**Environment:** Local Integration (Stage C)  
**Scope:** Functional Validation, API Verification, E2E Automation

---

## 1. Manual Test Execution (Functional)

### Overview
Functional validation of the core creation, state transition, and pagination flows.

| Test ID | Scenario | Execution Steps | Expected Result | Status |
|---|---|---|---|---|
| TC-01 | Ticket Creation (Happy Path) | 1. Navigate to Create Ticket<br>2. Input valid alphanumeric title and description<br>3. Submit form | Record persists; State initializes as `NEW`; UI redirects/updates list view. | PASS |
| TC-02 | Required Field Validation (Title) | 1. Leave title field empty<br>2. Attempt submission | Form submission blocked; UI displays "Title is required" validation message. | FAIL (See Bug 1) |
| TC-03 | Boundary Analysis (Min Length) | 1. Input 2-character string in title field<br>2. Submit form | Validation error triggers indicating minimum length requirement (3 chars). | PASS |
| TC-04 | List View Rendering | 1. Access Dashboard route | Grid/List populates with existing records showing localized status badges. | PASS |
| TC-05 | Pagination (Forward Traversal) | 1. Generate >10 records<br>2. Trigger pagination 'Next' action | Viewlet updates to display index 11+. | PASS |
| TC-06 | Pagination (Upper Boundary) | 1. Navigate to final available page | 'Next' control enters disabled/read-only state. | FAIL (See Bug 2) |
| TC-07 | State Transition: NEW -> IN_PROG | 1. Select a `NEW` ticket<br>2. Update status to `IN_PROGRESS` | State mutates successfully in persistence layer and reflects on UI. | PASS |
| TC-08 | State Transition: IN_PROG -> DONE | 1. Select an `IN_PROGRESS` ticket<br>2. Update status to `DONE` | State mutates successfully. | PASS |
| TC-09 | Invalid State Mutation (API Layer) | 1. Transmit `PATCH` payload with illegal status string | API layer rejects payload; Returns `422 Unprocessable Entity`. | PASS |
| TC-10 | Not Found Exception Handling | 1. Navigate to `/tickets/{invalid_id}` | Application intercepts failure and routes to graceful 404 view. | PASS |
| TC-11 | Data Permutation (Edit) | 1. Modify existing ticket title string | Payload accepted; Record updates successfully. | PASS |
| TC-12 | Record Deletion | 1. Trigger delete action on existing record | Record is hard-deleted from persistence layer; UI remounts. | PASS |
| TC-13 | Boundary Analysis (Max Length) | 1. Input 255-character string in title | View handles string without breaking layout containment or truncating illegally. | PASS |
| TC-14 | Malicious Payload (XSS) | 1. Input `<script>alert(1)</script>` | DOM sanitizes input; Renders strictly as encoded string. | PASS |

---

## 2. API Schema & Endpoint Validation 

### Tooling: Postman / Swagger UI

* **`POST /tickets`** 
  * Schema strictly enforces properties. Sub-minimum length strings cleanly rejected with `422 Unprocessable Entity`. 
  * Valid payloads return `201 Created` with accurate, serialized response mapping.
* **`GET /tickets`** 
  * Query parameters (`skip`, `limit`) handle integer parsing correctly. 
  * No observable degradation on null result sets.
* **`GET /tickets/{id}`** 
  * Happy path executes in `< 50ms`. 
  * Requesting non-existent resources correctly drops to a standardized `404 Not Found` rather than throwing internal `500` server faults.
* **`PATCH /tickets/{id}`** 
  * Validates ENUM equivalents accurately. Illegal status transitions are rejected at the routing layer before database interaction occurs.

---

## 3. Defect Tracking Index

### DEF-001: Frontend Validation Bypass on Empty Payload
* **Severity:** High 
* **Component:** React UI (CreateTicket Form)
* **Reproduction Steps:** 
  1. Initialize application and navigate to Create Ticket view.
  2. Leave the "Title" input empty.
  3. Trigger form submission.
* **Expected Behavior:** Client-side validation prevents the HTTP request; triggers localized error toast or inline warning ("Title is required").
* **Actual Behavior:** Client transmits empty payload to API. API responds with `422 Unprocessable Entity` (visible in Network tab), but UI swallows the exception gracefully, abandoning the user on the form with no feedback.

### DEF-002: Pagination Component Fails to Disable on Final Index
* **Severity:** Medium 
* **Component:** React UI (TicketList Pagination)
* **Reproduction Steps:** 
  1. Seed database with exactly 12 records.
  2. Navigate to Dashboard (Index 0-10 visible).
  3. Traverse to Page 2 (Index 11-12 visible). 
  4. Observe the 'Next' pagination control.
* **Expected Behavior:** Since the record count ceiling has been reached, the 'Next' control should mount in a disabled state.
* **Actual Behavior:** Control remains actionable. Triggering the action requests an empty offset (`?skip=20&limit=10`), resulting in the view unmounting all data and displaying an empty data table.

---

## 4. CI/CD Integration Strategy

To enforce quality gates prior to staging deployment, the following automated triggers are recommended for the repository pipeline (e.g., GitHub Actions / GitLab CI):

1. **Pre-Merge (Backend):** Execute `$ pytest` on isolated PR branches. Configured to fail the orchestrator build if branch coverage drops below 80% or if any single unit test panics.
2. **Pre-Merge (Frontend):** Execute `$ npm test` headless suite. Enforces structural integrity of the Redux store connections.
3. **Release Gate (E2E):** Execute `$ npx playwright test` against ephemeral staging containers. Build orchestrator must block downstream merge to `main` or Production branch upon any UI flow failure.
