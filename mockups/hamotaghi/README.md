# Hamotaghi — redesign delivery

This folder contains the redesigned Hamotaghi project and every artifact from the review.

## Contents

| Path | What it is |
|---|---|
| `project/` | Redesigned Next.js project, ready to run |
| `before-after.html` | Side-by-side before/after gallery |
| `screenshots/before/` | Original screenshots |
| `screenshots/after/` | Final screenshots |
| `REDESIGN_REPORT.md` | What changed, why, and verification results |

## Run the project

```bash
cd project
npm install
npm run dev
```

Then open:

- `http://localhost:3000/`
- `http://localhost:3000/design-system`

Production checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Notes

- The packaged `hamotaghi-web-redesigned.zip` is kept in the Desktop delivery folder; this repository tracks the extracted source, screenshots, and reports.
- The original `hamotaghi-web.zip` in the parent folder was **not modified**.
- Input values stay Latin per `FIGMA_SPEC.md`; Persian digits are used only in display text.
- The accessible status roles (`statusText.*`, `statusStroke.*`) and the ESLint guardrails are documented in `project/DESIGN_SYSTEM.md`.
