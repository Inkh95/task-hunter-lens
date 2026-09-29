---
doc: spec
status: draft
---
# Task Hunter Lens — Technical Spec

## How This Works, In Plain Language
The browser shows a form and a list. Each saved entry has its own numbers. A small calculation ranks them; local storage remembers them on this device. Nothing is sent to a server.

## The Core Journey Through the System
Form input is validated, turned into a task record, saved locally, scored and rendered as a ranked card. Editing a record recalculates immediately. PRD ref: `prd.md > The Core Journey`.

## Stack
Plain HTML, CSS, and JavaScript, with no runtime dependencies. This keeps the proof of concept easy to run and inspect. Implementation choice proposed by the agent, awaiting review.

## Where It Runs and How Someone Tries It
Run `python3 -m http.server 8000`, open `http://localhost:8000` in a desktop or mobile browser. No key required. Record a screen demo for Devpost; deployment is optional.

## Look and Feel
Dark navy base, warm coral and teal accents, spacious cards, accessible contrast, direct copy. This is a proposed implementation direction.

## Components
- Form: collects and validates assumptions. PRD ref: `Features and Behavior`.
- Score module: pure calculation and sorting. PRD ref: `Features and Behavior`.
- Board: renders ranked tasks and status actions. PRD ref: `The Core Journey`.
- Storage: reads and writes local browser storage. PRD ref: `States and Boundaries`.

## Data Model
Task: id, title, url, source, reward, fee, hours, acceptance probability, payout probability, deadline, status, demo flag, created date. Local storage holds an array and a schema version.

## File Structure
```
index.html
styles.css
src/app.js
src/scoring.js
devpost/learner-profile.md
devpost/scope.md
devpost/prd.md
devpost/spec.md
```

## External Services and Dependencies
None.

## Important Failure Modes
- Invalid numbers → inline error with the affected field.
- Browser storage unavailable → app still works this session and signals that changes cannot persist.
- Malformed old storage → start with empty board and show a recovery notice.

## What Was Simplified and Why
Manual inputs instead of platform feeds: clear, demonstrable core decision without unsupported live-data claims.

## Decisions and Open Issues
Manual, offline scope follows the user's payment-focused goal. Technology and styling are agent proposals; review before declaring the plan approved.
