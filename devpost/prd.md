---
doc: prd
status: draft
---
# Task Hunter Lens — Product Requirements

An offline decision board for prioritizing paid online tasks. Source: `scope.md > The Core Loop`.

## The Core Journey
1. Open the board and inspect two clearly labelled example opportunities.
2. Add a real opportunity with title, URL, reward, fee, expected hours, acceptance probability, payout probability, and deadline.
3. Read expected net return per hour and the underlying calculation.
4. Compare entries, edit assumptions, and mark a task as shortlisted, applied, accepted, or paid.
5. Return later and find the board saved in the same browser.

## Screens and Layout
A single responsive page: header with honest status, entry form, ranked opportunity cards, and a concise calculation explainer.

## Look and Feel
Proposed direction: editorial dark navy with warm accent, large readable numbers, clear labels, restrained motion. Product decisions remain reviewable.

## Features and Behavior
- Inputs are validated; reward and hours must be positive, fees cannot exceed reward, probabilities remain 0–100%.
- Score = (reward − fee) × acceptance probability × payout probability ÷ estimated total hours. This is a planning estimate, not a measured or guaranteed payment rate.
- Ranking changes immediately after create or edit; completed and discarded entries are visually separated.
- Demo entries are marked as examples and cannot be mistaken for live opportunities.
- Local browser storage preserves manually entered entries and statuses. Reset examples is available.

## States and Boundaries
- Empty: prompt to add a task; examples are optional.
- Invalid: inline message, no entry saved.
- Saved: entries persist locally on this device only.
- No payout verification: status is self-reported, never presented as confirmed by a platform.

## What We're Building
One end-to-end working local app with editable ranking and honest explanation.

## Deferred From the POC
Automated task discovery, login, payment verification and outreach.

## Non-Goals
No guaranteed income, automated applications, scraping or remote user data.

## Open Questions
Review the assumption that manual entry and a local decision board are the right initial product.
