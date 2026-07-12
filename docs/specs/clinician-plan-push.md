# Spec: clinician-pushed sleep plans

**Status:** proposed · **Priority:** highest clinical leverage of the three
roadmap directions; needs no new infrastructure
**Goal:** let a physician, psychologist, or sleep coach hand a family a
structured nightly plan that lives inside the diary — so every morning's
logging happens *against the plan*, and the next visit's report shows
adherence, not just raw sleep.

## How a plan travels with no server: the "plan capsule"

The app has no backend and should not grow one for this. A plan is small
(<2 KB of JSON). It travels as a **QR code or link** whose payload is encoded
in the URL *fragment*:

```
https://…/sleep-diary/#plan=<base64url(JSON)>
```

Fragments are never sent to the server — GitHub Pages doesn't even see them
in logs — so this is PHI-safe by construction (and the payload contains no
identifiers anyway; it's addressed to whoever scans it). The family scans the
QR in clinic (or taps the link from a MyChart message), the app opens,
detects `#plan=`, shows a preview ("Plan from Dr. Canapari — Bedtime plan
starting Mon Sep 14. Add it to J.T.'s diary?"), and stores it on accept.
This mirrors how families already onboard (QR → Add to Home Screen).

## `plan.html` — the clinician-side builder

A new static page in this repo (brand-styled, no accounts, works offline like
everything else). The clinician fills a form and gets a QR + copyable link.
Form sections:

1. **Who/when**: clinician name & role (displayed to family), start date,
   review date.
2. **Targets**: bedtime and wake time; optional separate weekend targets
   (teens). Rendered as dashed target lines on the family's chart.
3. **Schedule (optional)** — the piece paper handouts can't do:
   - *Bedtime fading / advance*: shift bedtime by N minutes every K nights
     from a start time until the target (direction handles both fading and
     phase-advance/chronotherapy-lite). The app computes **tonight's**
     target automatically — the family never does date math.
0. **Protocol templates** (see [protocol-templates.md](protocol-templates.md)):
   pick a named method — bedtime fading, graduated extinction, camping out,
   phase advance, chronotherapy — and every section below prefills, paired
   with a night-keyed "what to expect" education pack in the family's diary.
4. **Nightly checklist**: pick from a template library + free-text items.
   Templates seeded from actual practice: "Screens off 60 min before bed,"
   "Out of bed if awake > 20 min," "No caffeine after 2 PM," "Same wake time
   7 days/week," graduated-extinction check intervals, etc.
5. **Note to family**: short free text.

## Plan schema (versioned)

```js
{ v:1,
  from:{ name:"Dr. C", role:"Sleep physician" },
  start:"2026-09-14", review:"2026-09-28",
  targets:{ bedtime:"21:00", wake:"07:00",
            weekendBedtime:null, weekendWake:null },
  fade:{ from:"22:30", stepMin:15, everyNights:3 },   // optional
  checklist:[ {id:"screens60", label:"Screens off 60 min before bed"},
              {id:"custom1",  label:"…"} ],
  note:"…" }
```

Stored per child as `child.plan`; accepting a new capsule replaces it and
archives the old one to `child.planHistory` (visits produce revised plans —
the history is itself clinically interesting). Additive to the state model;
`migrateState()` tolerates absence.

## Where the plan shows up (the "reflected when logging" part)

- **Entry form**: a compact plan strip at the top — *tonight's* computed
  targets ("Target bedtime 9:45 PM · wake 7:00 AM") and the checklist as
  tap-toggles stored per entry (`entry.adherence = {screens60:true, …}`).
  Gentle diff after times are entered: "lights out 32 min after target" —
  informational tone, no red.
- **Chart**: dashed target ticks per row for bedtime/wake. Under a fade
  schedule the ticks **stair-step night by night** — the family literally
  sees the plan's staircase next to their actual bars. Adherence dot at
  row's edge (full/partial/empty for checklist completion).
- **Summary**: adherence % per checklist item, mean deviation from bedtime /
  wake targets, split before/after plan start if the diary spans it.
- **Share/PDF**: the report gains a plan box (who prescribed, targets,
  adherence table) — the return visit starts from "here's what we tried and
  what actually happened" instead of re-deriving it from memory.

## Safety & scope guardrails

- The app **displays** a clinician-entered plan; it never generates or
  adjusts one. No dosing, no diagnosis — same "not a medical device" posture
  as today, stated on plan.html and in the accept dialog.
- The family can decline, pause ("hide plan"), or remove a plan at any time;
  logging never requires plan interaction (checklist untouched = simply
  unreported, not "failed").
- Capsule contains no patient identifiers; it's a generic prescription until
  the family accepts it into a local child profile.

## Phasing

- **v1**: plan.html builder → QR/link → accept → entry-form strip +
  checklist + chart target ticks + PDF plan box. All static, ship anytime.
- **v1.5**: auto-check synergy — "screens off by X" checklist items satisfy
  themselves from the teen `screen.off` field
  ([teen-screen-time.md](teen-screen-time.md)).
- **v2 (only if a study needs it)**: deliver capsules through the REDCap
  enrollment payload / relay
  ([redcap-research-backend.md](redcap-research-backend.md)) so trial arms
  can push standardized plans remotely — the capsule format is the same.

## Open decisions

- QR generation on plan.html without dependencies: vendor a tiny MIT QR
  encoder into the page (keeps the zero-build rule) vs. link-only v1.
  **Recommend vendoring the encoder** — clinic workflow is scan-a-QR.
- Whether plan.html lives in this repo/Pages site (discoverable by any
  clinician who finds the project — good for adoption) or is unlisted.
  **Recommend in-repo and linked from the README** — it's a feature, not a
  liability.
