# Spec: REDCap integration (research mode)

**Status:** proposed · **Priority:** Phase A soon, Phase B when a study exists
**Goal:** let the diary feed a REDCap project so it can be used as a research
instrument, without breaking the app's core promise (no server, no accounts,
data stays on the phone unless the family sends it).

## The architectural tension, resolved

The app's whole compliance posture is "nothing ever leaves the phone unless
the parent exports it." Research requires data to leave the phone. The
resolution: **research participation is an explicit, opt-in mode**, activated
by an enrollment code the study team gives the family, with consent handled
by the study's own IRB process. Families not in a study see nothing new.
Sending remains patient-initiated (a tap), exactly like the MyChart
copy-paste flow — we extend the existing posture rather than replacing it.

A second, harder constraint: **a REDCap API token can never ship in the
app.** `index.html` is world-readable; a token grants project-wide API
access. So the app never talks to REDCap directly. Two supported paths:

## Phase A — CSV import path (near-zero code; ship this first)

The CSV export was designed for this (README: "Suitable for REDCap import").
What's missing is everything on the REDCap side, plus two columns. Deliver:

1. **`redcap/` folder in this repo** containing:
   - A REDCap **data dictionary** (instrument metadata CSV) — one repeating
     instrument `sleep_night`, fields mapped 1:1 from `buildCSV()`
     (index.html:1206): `date` (date_ymd), `lights_out`/`sleep_onset`/
     `final_wake`/`out_of_bed` (time HH:MM validation), `sol_min`/`tst_min`/
     `tib_min`/`waso_min`/`nap_sleep_min` (integer), `se_pct` (number),
     `n_awakenings`/`n_parent_interventions`/`n_naps` (integer),
     `awakenings_detail`/`naps_detail`/`notes` (notes). Plus a one-time
     `enrollment` instrument (age band, enrollment date).
   - Ideally a full **project XML** so a coordinator creates the entire
     project in one upload (Project Setup → upload XML).
   - A short **coordinator guide**: create project, enable repeating
     instruments, import each participant's CSV.
2. **"Export for research (REDCap)" button** in the Share tab — a variant of
   `buildCSV()` that emits `record_id, redcap_repeat_instrument,
   redcap_repeat_instance` columns and **omits `child_initials` and (by
   default) `notes`** (free text is the PHI leak risk). `record_id` = a
   participant code the family types once into settings;
   `redcap_repeat_instance` = days since first entry + 1, which makes
   re-imports idempotent (same night always lands in the same instance).

Data flow: family emails the CSV / brings it to a visit / uploads it via a
REDCap survey file-upload field. Nothing new transits any server we run.
This phase is mostly authoring, not engineering — roughly one session.

## Phase B — direct "Send to study" via a relay

When a real protocol exists, add live submission:

- **Enrollment QR/link** from the coordinator encodes
  `{studyName, relayUrl, participantCode}`. Scanning it puts the app in
  research mode for that child (banner in Settings; "Leave study" always
  available).
- **Relay**: a minimal serverless function (Cloudflare Worker / institutional
  server — we ship the ~100-line source in `redcap/relay/`) that holds the
  REDCap API token as a secret, accepts `{participantCode, records[]}`,
  validates the code format against the study allowlist, and forwards to
  REDCap's API (`content=record`, repeating instances computed as in Phase A,
  `overwriteBehavior=normal` so resends update rather than duplicate). It is
  **stateless — it stores nothing** — which keeps the compliance review small.
  The study team deploys it; the public app only knows its URL from the
  enrollment QR.
- **In-app UX**: Share tab gains "Send to study" showing exactly which fields
  will be sent before the first send; per-night sent/unsent state
  (`e.sentToStudyAt`) with catch-up sending when back online; toast + summary
  of what was accepted. Follows the Google Drive backup pattern already in
  the codebase (index.html:1399 — optional service, disabled until
  configured, clearly explained to the user).
- **Fields sent**: participant code + the Phase A research columns. Never
  initials; notes only if the study's enrollment payload sets
  `includeNotes:true` and the app tells the family so.

## Phase C — later options

- Auto-send after each morning entry (with consent language up front).
- Reverse channel: the enrollment payload or relay can deliver per-arm
  configuration — including a clinician plan (see
  [clinician-plan-push.md](clinician-plan-push.md)) — turning REDCap into a
  light two-way backend for trials of behavioral interventions.
- Teen fields (`screen_off`, `screen_in_bed`, caffeine — see
  [teen-screen-time.md](teen-screen-time.md)) get columns in the data
  dictionary from day one so the instruments don't fork.

## State model changes (additive, migration-safe)

```js
child.research = {
  participantCode: "P014",       // Phase A: typed; Phase B: from QR
  studyName: "…", relayUrl: "…", // Phase B only
  enrolledAt: "2026-09-01"
}
entry.sentToStudyAt = "…"         // Phase B per-night sync state
```
`migrateState()` (index.html:357) just tolerates absence, as it already does
for `drive`.

## Open decisions

- Repeat-instance keying: days-since-first-entry (idempotent, gaps leave
  empty instances) vs. sequential (compact, but resends can duplicate).
  **Recommend days-since-first-entry.**
- Whether Phase A participant code lives in Settings or a dedicated
  "Research" card in Share. **Recommend Share card** — keeps Settings clean
  for the 99% non-research users.
