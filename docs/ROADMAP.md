# Roadmap — November 2026

**Status:** approved by Craig 2026-11-09. This is the working plan; the README
roadmap summarizes it. Decisions D1–D5 are settled (see the end).

**Inputs:** README roadmap; docs/HANDOFF.md (pre-security-review plan);
Dr. Danielle Garay meeting, 9/8/26 (items cited as **G1–G15**); and three
papers:

- Carney et al. 2012, *The Consensus Sleep Diary* (SLEEP 35:287) — **CSD**
- Dietch & Taylor 2021, CSD vs. EEG/actigraphy/questionnaire (JCSM 17:1389)
- McHill, St Hilaire, Czeisler, Klerman et al. 2026, *Required components of a
  sleep-wake online daily diary* (npj Biol Timing Sleep 3:45)

## Guiding principles

1. **No real users yet, so changes are cheap now.** There's no migration
   risk: every change to the stored data shape is free today and costly once
   families have diaries. Settle the data shape before the clinic pilot.
2. **Usability beats completeness.** Parents of young children log about one
   minute each morning. A new field must either default itself or be
   switched on by a clinician for that patient.
3. **Show, don't nag.** Consistency checks are visual and inline (McHill: people
   clean their own data when they *see* it). The only blocking dialog stays
   the existing "check the times" confirm on save.
4. **CSD wording for any new question.** It's validated, at a 3rd–6th grade
   reading level, past tense, second person. It also lets the app be described
   as a *CSD-aligned pediatric/proxy diary*, and no such diary exists yet.
5. **Still no server.** Everything is generated on the device. The security
   review covers static hosting only.

---

## Phase 1 — Data shape and data quality (no outside dependencies; start now)

**Built 2026-11-09 in v2.5.0** (all of 1.1–1.8 and the D1 setting; see the
BUILDLOG entry of that date for what was verified and what is left to decide).

Everything here can be built without clinical sign-off. It settles what data
gets stored before any family uses the app.

| # | Item | Source | Burden on parent |
|---|---|---|---|
| 1.1 | **"Got into bed" time, teens only.** Shown when the age band is Teenager (14–17) or older (D1); it defaults to lights out. Parent-view diaries don't see it, because for young children getting into bed and lights out are effectively the same moment (Craig, 2026-11-09) | G1, CSD Core #1 | one field, teens only |
| 1.2 | **Second efficiency metric, teens only (same rule as 1.1)**: TST ÷ (got into bed → out of bed), shown next to the current SE (unchanged) | G2 | none |
| 1.3 | **Live one-row preview** of the night in the entry form: a mini chart row that redraws as times change, so AM/PM slips are obvious | McHill | none |
| 1.4 | **Age-aware plausibility notes** (inline, non-blocking): night sleep or naps far outside the NSF range for the age group, a nap overlapping the night, etc. | McHill | none |
| 1.5 | **Silent `loggedAt` timestamp** on each entry, plus a data-quality line in the clinician report ("11 of 14 nights logged the next morning") | McHill, Dietch | none |
| 1.6 | **Checklist reworded for the next morning**, in past tense ("Did you…last night"). The flow already runs in the morning; only the wording is written for bedtime | G10, CSD | none |
| 1.7 | **Clinician report: sleep-timing graph** (onset/wake by night, with plan targets), not only mean ± SD. SE shown as a weekly mean with a one-line caveat | G9, Dietch | none |
| 1.8 | **"How did your child sleep last night?"**: one optional tap on CSD Core #8's 5-point scale (Very poor · Poor · Fair · Good · Very good). Teen view uses the CSD wording "How would you rate the quality of your sleep?" CBT-i Coach uses the same CSD wording and scale (its item 9), shown as five tappable faces with the chosen label underneath. Do the same: faces read well at low literacy, with text labels for accessibility. Shown per night in the table and as a distribution in the report | D5, CSD Core #8, CBT-i Coach | one optional tap |
| 1.9 | **The nap question** (added 2026-11-09, Craig): children who usually nap see one-tap answers in the nap section: their usual nap, or "No nap that day". "Usually naps" is learned from the diary (a nap on 3 of the last 7 logged days); until there is a week of data the age group decides: asked for newborn through preschooler and for teenagers and young adults, not for school age. An unanswered day is stored as "not recorded", not zero, and is left out of the nap and 24-hour averages; the report says "Naps answered on N of M days" | Craig | one optional tap |
| 1.10 | **Sleep-onset context and BISQ-aligned night-waking help** (added 2026-11-13). Two optional questions under "Fell asleep", for every age group below Teenager: where a parent was (in bed with child · in the room · out of the room) and where the child fell asleep (own bed or crib in own room · own bed or crib in parents' room · parents' bed · somewhere else). Carried forward from the previous night and shown as one line; a hidden flag records whether the answer was carried or confirmed. On camping-out and bedtime-fading plans the parent's place is asked fresh each night. Night-waking help splits "Comforted in room" into "Picked up, held or rocked" and "Soothed without picking up"; "Fed" is offered under age 3 only. The report gets one line ("Parent present at sleep onset: 9 of 14 nights (confirmed 9) · own bed 12 of 14") | Garay 11/13; BISQ (Sadeh 2004), BISQ-R (Mindell 2019) | none most nights (carried forward) |

**Labels for 1.2** (D3, decided): *SE from lights out* (existing metric) and
*SE from getting into bed* (new). They replace the working name "teenage time".

Versioning: one `CACHE_VERSION` minor bump for the phase; demo data updated
to include a teen sample diary with nights where "got into bed" differs
from lights out.

## Phase 2 — Clinical content in the plan builder (needs Garay review)

Builds on Phase 1's fields. Each template stays `draft:true` until Danielle
signs off its [TBD] values.

| # | Item | Source |
|---|---|---|
| 2.1 | **Sleep restriction**: clinician sets the bed/rise window; the app shows it and tracks adherence; **no auto-titration**. Weekly mean SE shown against an 85–95% band | G5, Dietch |
| 2.2 | **Stimulus control** text, including "if your bed is your only seat: sit on the edge, sideways, back to the wall" | G6 |
| 2.3 | **Clinician-switched optional questions** in CSD-M wording: caffeine (count + last time), alcohol (teen view only), sleep medicine/melatonin (what, dose, time), exercise, food, nightmares (+ count), CPAP use | G3, G4, CSD-M 12–14 |
| 2.4 | **Early morning awakening**: "Did you wake earlier than planned? How much?" (CSD 6c/6d), an optional item for CBT-I and teen plans | G9, CSD-M |
| 2.5 | **Young-child methods**: bedtime game (3+), adapted bedtime game (~2 y), bedtime pass; camping out kept but not the default; a one-line reminder for each | G12 |
| 2.6 | **Bedtime game metric**: "Did your child fall asleep before you came back?" and "How long were you out of the room?" | G13 |
| 2.7 | **Printable nightly schedule** for chronotherapy and phase advance (each night's bed/wake target on the handout) | G7 |
| 2.8 | **Pre-visit capsule**: the QR/link carries short provider instructions ("Please log 7 nights before your 12/3 visit"); supports the diary-return-rate QI project | G14 |

Note for 2.5 (Craig, 2026-11-09): families move the camping-out chair faster
or slower depending on how it's going, so "move every 3 nights" can't be
ticked truthfully. For now the diary shows that item as "Chair stayed in the
same spot or moved farther away". The better design is one nightly choice of
where the chair was (beside bed / middle of room / doorway / out), replacing
both chair items in plan.html.

Explicitly **not** built: crying tracker, check-in timer (G11). The night-waking
log stays as is.

**Blocked on:** Danielle's adapted bedtime game materials (2.5); [TBD] values
for 2.1/2.2; her view on 2.3's list.

## Phase 3 — Clinic release (security review)

Unchanged from HANDOFF.md step 4 onward: remove the unused consultant-sync
code, keep Drive backup off, add a CSP, review how untrusted input is
handled, add the disclaimer, SECURITY.md, tag `clinic-v1.0`, then the
one-page description and data-flow diagram. **Freeze when the intake date is
set**, and ship whatever of Phases 1–2 is finished; drafts stay gated.

Reminders for the review ("how do families get reminded?"): see decision D2.

## Phase 4 — After the pilot starts (let real use decide)

- **Parent view vs. teen view** (G8): teen wording, self-entry, and adult-scale
  CSD items (alcohol). Depends on decision D1.
- **Teen screen time** (spec exists), built with the teen co-developers.
- **Education packs** (spec exists).
- **App Store / Play releases** (reliable notifications), **Drive backup**
  (OAuth registration only).
- **Later protocol modules**: CBT for nightmares, CBT for narcolepsy.
- **Progress view, shown to parents only when progress is real** (Garay
  11/13). Deferred until the Phase 2 plans are more mature (Craig,
  2026-11-13): the comparison anchors on plan start dates and plan types, so
  it should wait for those to settle.
  Draft rules (thresholds [TBD] with Dr. Garay):

  - **Windows.** Baseline = the 7 nights before the plan started (or the first 7
    logged nights without a plan). Recent = the latest 7 nights. Each window
    needs at least 5 logged nights, or nothing is shown.
  - **Wait out the extinction burst.** No comparison until 7 nights into a plan;
    early nights of graduated extinction often look worse before better.
  - **"Real" means:** the recent *median* beats the baseline median by at least
    the metric's threshold, in the good direction. Medians, so one bad night
    doesn't erase a win or one good night fake one.
  - **Candidate metrics (age-dependent) and placeholder thresholds:** time to
    fall asleep (10 min shorter); night wakings (0.5 fewer per night); minutes
    awake at night (15 min less); nights needing help (2 fewer per week);
    bedtime consistency (SD 15 min smaller); bedtime closer to the plan target;
    falling asleep with a parent out of the room / in own bed (2 more nights per
    week; counts only answers the parent confirmed, not carried-forward
    defaults, item 1.9); total sleep moving into the NSF range. Teens: SE from
    getting into bed; time from getting into bed to lights out.
  - **Show at most three**, largest relative change first, as before → after in
    everyday words. No scores, no red, no "you missed". If nothing qualifies,
    show nothing, or at most a neutral "keep logging" line (Danielle's call).
  - **Clinician report** always shows weekly means for the same metrics, better
    or worse, so the visit isn't skewed by what the parent saw.
  - Plain description of change, not causation: "since the plan started", never
    "the plan worked".

## Research track (separate from the clinic build)

- **CSD mapping** in the REDCap data dictionary: every field labeled with its
  CSD item equivalent (or "pediatric extension"). This costs almost nothing
  and positions the app as a CSD-aligned proxy diary.
- **Sleep Well Be Well** (G15): **spec only**. Weekly feedback, the personal
  bedtime goal (15 min earlier per week × 3 when mean bedtime exceeds a TBD
  threshold), age branching (6–12 mo vs. 3–5 y), REDCap export. No app
  development charged to the R61/R33; any SWBW-specific build stays in a
  clearly separate fork once ownership of work under the award is settled.
- **Proxy-report validation**: no published validation of parent-proxy diaries
  against actigraphy in this age range. The planned SWBW actigraphy work could
  be a paper in its own right.
- **REDCap Phase B**: waits for a real protocol.

Commercial track (consultant sync): parked. Its code gets removed from the
clinic build in Phase 3 and stays recoverable in git.

---

## Decisions (all settled 2026-11-09)

- **D1. Who fills it in — DECIDED 2026-11-09:** age sets the *default* view
  (under 13 parent, 13+ teen) and a "Who's filling this in? Parent / Teen"
  setting can override it. **Asked once per diary at setup, never per
  entry**: it's whoever's phone the diary is on (Craig, 2026-11-09). Editable
  later in settings. Phase 1 adds the setting; the teen wording itself stays
  in Phase 4.
  **Age 13 note:** the app's NSF age bands put 13-year-olds in "School age
  (6–13)", so the band alone can't tell 13 from 12. The setup default
  follows the band (Teenager → teen view).
  **Teen-only fields (1.1, 1.2) follow the age band — DECIDED 2026-11-09:**
  shown for the Teenager (14–17) and Young adult (18–25) bands. 13-year-olds
  wait for a later refinement (e.g. asking exact age).
  **Updated 2026-11-09 (Craig):** the app now uses the AASM age groups
  (Paruthi 2016, AAP-endorsed), where Teenager is 13–18, so 13-year-olds get
  the teen default and the teen-only fields. The two notes above are
  superseded.
- **D2. Calendar files — DECIDED 2026-11-09:** (a) one daily *morning*
  reminder .ics, default ~30 min after the child's usual wake time, parent
  picks the time; (b) chronotherapy / phase-advance plans are still built in
  plan.html (start date, interval, step size, target), and the family's
  diary offers "Add this schedule to my calendar" — one event per night at
  the target bedtime, computed from the same plan settings the chart already
  uses. A revised plan means a fresh .ics, with a "delete the old schedule
  first" note. The printed handout stays for clinic printing.
  *Original note:* HANDOFF step 2 planned .ics downloads (a nightly
  "fill in the diary" reminder, plus chronotherapy bedtime events). G7 says
  "no calendar invites." Proposal: drop the chronotherapy calendar events
  (replaced by the printable schedule, 2.7); **keep** the single nightly-reminder
  .ics, because it answers the security review's reminder question with no
  server and no notifications permission.
- **D3. 1.2 label — DECIDED 2026-11-09:** "SE from lights out" (the existing
  metric) and "SE from getting into bed" (the new one). Replaces the working
  name "teenage time".
- **D4. Phase 1 before the freeze — DECIDED 2026-11-09: yes.**
- **D5. Sleep quality rating — DECIDED 2026-11-09:** ask it, in Phase 1
  (item 1.8). Parent wording "How did your child sleep last night?" with the
  CSD's 5-point anchors so it stays comparable. Optional, never required to
  save. The CSD-M "how rested/refreshed" item stays out for now.

## Not doing (and why)

- Entry windows that lock entries, or edit deadlines (McHill): research-staff
  tooling that would hurt usability.
- Daily staff review or twice-daily emails: these need a server and staff.
- A self-estimated "total sleep" question (CSD-M #8): we already calculate it.
- "Leave the day blank if you missed it" (CSD): backfilling is allowed, made
  visible by the `loggedAt` timestamp instead.
- Crying tracker, check-in timer (G11).
