# Task Hunter Lens

A small, offline decision aid for paid online tasks. Enter an opportunity, estimate its reward, fees, effort, acceptance chance and payout chance, then compare its expected net return per hour. The estimates are yours; this app does not verify listings or guarantee payment.

## Run

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. No account, API key, or build step is required. Data is stored in this browser's local storage. Use **Load examples** to try an illustrative comparison; those entries are not live jobs.

## Scoring

`(reward − fees) × acceptance chance × payout chance ÷ estimated total hours`

Chances are percentages and the score is denominated in expected euros per hour. This is a prioritization heuristic, not a calibrated probability model. The real decision also depends on eligibility, deadlines, platform terms and evidence of payment.

## Hackathon

New project for Build With AI: Basics, started September 29, 2026. The Devpost Learn Skill Pack was installed and used to prepare `devpost/scope.md`, `devpost/prd.md`, and `devpost/spec.md`. The plans are drafts pending participant review. The required public repository and demo video are not yet submitted.

## Privacy

Entries remain on the device in browser storage. Clearing browser storage deletes them. No analytics or backend.
