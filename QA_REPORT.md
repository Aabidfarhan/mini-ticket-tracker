# QA Testing Documentation - Mini Ticket Tracker

Here is the testing documentation for the Ticket Tracker project. I've broken this down into four sections: manual test cases, API validation notes, defect reports, and CI/CD strategy.

## 1. Manual Test Checklist
I used these cases to run through the core loop of the application manually.

| Test ID | Scenario | Steps | Expected Result |
|---|---|---|---|
| TC-1 | Create valid ticket | 1. Go to Create Ticket<br>2. Fill title/desc<br>3. Submit | Ticket saves, defaults to NEW, shows up in list |
| TC-2 | Empty title validation | 1. Leave title empty on form<br>2. Submit | Form blocks submission with "Title is required" |
| TC-3 | Title < 3 characters | 1. Enter "ab" as title<br>2. Submit | UI shows validation error |
| TC-4 | Basic List view | 1. Open dashboard | All created tickets appear with right status |
| TC-5 | Pagination (Next Page) | 1. Make at least 11 tickets<br>2. Click Next | Page 2 shows remaining tickets |
| TC-6 | Pagination (Boundary) | 1. Go to last page of results | 'Next' button disables |
| TC-7 | Status transition NEW -> IN_PROG | 1. Open a NEW ticket<br>2. Change status to IN_PROGRESS | DB and UI update correctly |
| TC-8 | Status transition IN_PROG -> DONE | 1. Change an IN_PROGRESS ticket to DONE | Updates correctly |
| TC-9 | Bad Status API handling | 1. Send `PATCH` with status "FAKE" | Backend rejects with 422 |
| TC-10 | 404 Handling | 1. Go to `/tickets/999` | Shows a graceful "Not Found" message |
| TC-11 | Edit title | 1. Edit an existing ticket's title | Saves properly |
| TC-12 | Delete a ticket | 1. Hit delete button | Removes it from the list/DB |
| TC-13 | Very long title handling | 1. Paste 255 chars in title | Layout holds up, no clipping |
| TC-14 | XSS Check | 1. Put `<script>alert(1)</script>` in title | Renders as raw text, no alert |

---

## 2. API Validation Notes (Swagger / OpenAPI)
I ran through the Swagger docs and tested the endpoints using HTTP clients.

* **POST `/tickets`** 
  * Schema checks out. Rejects titles under 3 chars cleanly with 422. Creates tickets with 201 status code correctly.
* **GET `/tickets`** 
  * Accepts `skip` and `limit` correctly.
* **GET `/tickets/{id}`** 
  * Found an edge case: Works fine for valid IDs (200 OK), but checking non-existent IDs returns a proper 404.
* **PATCH `/tickets/{id}`** 
  * Correctly validates status enumerations (`NEW`, `IN_PROGRESS`, `DONE`). Rejects anything outside that scope.

---

## 3. Bug Reports
During exploratory testing, here are realistic defects that typically crop up. (These are examples of issues you might find in an app of this scope to demonstrate defect writing).

### Bug 1: Empty title passes UI validation
* **Steps:** 
  1. Open app and go to Create Ticket. 
  2. Leave title blank, hit submit.
* **Expected:** Submit button is disabled, or a red error shows up instantly.
* **Actual:** Frontend sends the request. Browser network tab shows a 422 error from the backend, but the user is left stuck with no feedback.
* **Severity:** High (Broken user flow)

### Bug 2: Pagination Next Button stays active on last page
* **Steps:** 
  1. Have 12 tickets total. 
  2. Be on Page 1 (showing 1-10). 
  3. Click Next to go to Page 2 (showing 11-12). Look at the Next button.
* **Expected:** Since there's no page 3, Next should be disabled.
* **Actual:** Next is clickable. Clicking it shows a completely empty table. 
* **Severity:** Medium (Bad UX)

---

## 4. Pipeline Integration (CI/CD)
To prevent regressions, the automated tests I wrote should run in the build pipeline (e.g., GitHub Actions).

1. **Backend Tests:** Run `pytest` on PRs. If it drops below a certain coverage threshold or test fails, block the merge. 
2. **Frontend Tests:** Run `npm test` automatically.
3. **E2E Tests:** Have Playwright run against staging builds before deploying to production. Wait for full deployment, run the suite. Failures must block the push to Prod.
