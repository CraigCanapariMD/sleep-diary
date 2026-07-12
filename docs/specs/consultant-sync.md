# Spec: consultant sync & caseload dashboard

**Status:** proposed · groundwork only — no app changes yet
**Track:** commercial (sleep consultants / coaches, **not** clinical care —
see "What this is not" below). The backend and dashboard implementation will
live in a **separate private repo**; this spec stays here because it defines
the *family-app side of the contract*, which is part of this codebase.

**Goal:** a sleep consultant invites a family; the family's diary (already
local-first, no accounts) starts pushing entries to the consultant's
dashboard. The consultant sees their whole caseload — fresh charts, adherence,
"no log in 3 days" flags — instead of chasing parents for screenshots and
paper logs.

## Design principles

1. **The family app stays local-first.** Sync is opt-in, invite-driven, and
   additive. A family that never meets a consultant never sees any of this.
   Nothing in the current export/report/backup path changes.
2. **No parent accounts, ever.** The invite code *is* the relationship —
   same interaction family already knows from QR onboarding and the
   [plan capsule](clinician-plan-push.md).
3. **Pseudonymous by construction.** The backend stores entries keyed by an
   opaque share code. The child's name never travels; the consultant labels
   the client on *their* side ("J.T., 4yo"). Sleep times + notes only.
   (Parents should still be warned not to put identifying details in notes —
   one line in the consent screen.)
4. **Reuse the shapes we already have.** Entry objects are keyed by `date`
   per child and the backup format is versioned (`peds-sleep-diary-backup`
   v2). Sync is therefore an **idempotent upsert on `(shareCode, date)`** —
   no UUIDs, no conflict resolution beyond last-write-wins per night, which
   matches how `applyBackup()` already merges.

## Flow

1. Consultant (logged into the dashboard) clicks "Invite client" → gets a QR
   / link: `https://…/sleep-diary/#connect=<code>`.
2. Family scans/taps. App detects `#connect=`, fetches the invite preview
   from the backend (consultant display name + practice), and asks:
   *"Share this diary with **Jane Smith, Certified Sleep Consultant**? She
   will see sleep times, checklist adherence, and notes for the child you
   choose. You can stop sharing anytime in Settings."*
3. On accept: the connection `{code, consultantName, childId, since}` is
   stored in `state`, all existing entries for that child are pushed, and
   every subsequent save queues a push (flushed on save / app open / online
   event — an outbox array in `state`, so offline logging is unaffected).
4. Disconnect (family side, Settings): removes the connection and asks the
   backend to delete that share code's data. Revoke (consultant side): code
   stops accepting writes; app notices on next push and tells the family.

## Sync payload (versioned, mirrors backup v2)

```js
POST /sync  { v:1, code:"<shareCode>",
              entries:[ { date:"2026-09-14", lightsOut:"20:45", onset:"21:10",
                          wake:"06:30", outOfBed:"06:40", awakenings:[…],
                          naps:[…], adherence:{…}, notes:"…" }, … ] }
```

Server upserts each entry on `(code, date)`. Response can carry a consultant
plan capsule (same schema as [clinician-plan-push.md](clinician-plan-push.md))
— which would let consultants push/update plans *without* an in-person QR
scan, the first place sync and plans compose.

## Dashboard MVP (private repo)

- Caseload list: client label, last log date, nights logged / expected,
  stale flag (no entry in 3 days).
- Client detail: the same sleep chart families see (the chart rendering in
  `index.html` is the single biggest reuse candidate — consider extracting it
  to a shared module when this work starts), adherence table, notes stream.
- Invite management: create / revoke codes.
- Likely stack: Supabase (Postgres + row-level security keyed to consultant
  auth) or equivalent; nothing exotic. Free pilot tier before any billing.

## What this is not

- **Not a medical device and not for clinical care.** Terms of service will
  say coaching/consulting use only. No HIPAA claims are made and no BAA is
  offered; clinicians who want a caseload view have the export → MyChart flow
  and the [REDCap path](redcap-research-backend.md).
- **Not a change to the family product.** If a pilot consultant stops using
  it, families keep a fully working diary.
- **No teen-mode interaction.** Consultants work with infants/young children;
  the teen self-report roadmap is independent of this track.

## Phasing

- **Phase 0 (now):** this spec. Validate demand — conversations with
  practicing consultants using `demo.html` + [sample exports](../../examples/)
  as the pitch. No code.
- **Phase 1:** ✅ shipped 2026-07-12 — app-side hooks behind the
  `SYNC_ENDPOINT` flag (empty = fully inert): `#connect=` handler with
  fragment scrubbing, consent card, per-child outbox (`sync.pending` dates),
  `syncFlush()` on save / app open / `online` event, delete tombstones
  (`{date, deleted:true}`), revocation handling (403/410 clears the
  connection), and a Share-tab status card with "Stop sharing" (DELETE +
  server-side purge request). Verified end-to-end against a mocked backend.
- **Phase 2:** dashboard MVP, 2–3 pilot consultants, free.
- **Phase 3:** billing, terms of service, commercial-license alignment
  (the PolyForm NC license already reserves monetized products to the
  copyright holder).
