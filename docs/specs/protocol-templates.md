# Spec: protocol templates & education packs

**Status:** proposed · extends [clinician-plan-push.md](clinician-plan-push.md)
**Goal:** the plan builder shouldn't start from a blank form. A clinician picks
a named protocol — a sleep-training method for young children, or a circadian
protocol for a delayed-phase teen — and the builder prefills targets, schedule,
and checklist, with paired "what to expect" education that appears in the
family's diary night by night.

## Architecture principle: parameters travel, content ships

A QR capsule holds ~500 bytes comfortably; a psychoeducation handout does not.
So the split is:

- **The capsule carries parameters + a pack reference**:
  `protocol:{ id:"gradext", params:{…} }, eduPack:"gradext@1"`.
- **The app ships the content**: education packs live in this repo
  (`docs/edu-packs/` or inlined in index.html), versioned (`@1`) so an old
  capsule renders the content it was prescribed with. Content is curated,
  cited, and reviewed like any clinical text in the app — not typed into a
  QR by hand.

This also means education content is improvable for everyone at once (bump
the pack, bump `CACHE_VERSION`) without touching any family's plan.

## Template library v1

Each template = prefill for the builder (all editable before issuing — the
template is a starting point, the plan is the clinician's) + an education
pack keyed to plan night number.

### Young children — behavioral sleep training
(Evidence base: Mindell et al., *Sleep* 2006 behavioral-treatment review;
Mindell & Owens, *A Clinical Guide to Pediatric Sleep*.)

- **Bedtime fading + positive routine** — start bedtime at the child's
  *actual* sleep-onset time, step 15 min earlier every 2–3 nights (the
  existing fade engine, unchanged); checklist seeds a consistent 3-step
  routine. Edu pack: why a *later* bedtime is the treatment at first.
- **Graduated extinction (timed check-ins)** — new schedule parameter:
  per-night check-in intervals with escalation (night 1: 3/5/10 min,
  night 2: 5/10/12, …). The diary shows *tonight's* intervals in the plan
  strip; the morning entry already counts parental interventions, so the
  report shows the response curve. Edu pack: night-keyed — the extinction
  burst warning lands on nights 2–4, exactly when it happens.
- **Camping out / parental presence fading** — schedule parameter is
  *position*, stepping every N nights (beside bed → middle of room →
  doorway → out). Tonight's position shows in the plan strip.
- **Bedtime pass** (preschool+) — checklist-only template, no schedule.

### Teens — delayed sleep phase
(Evidence base: AASM practice guideline for intrinsic circadian rhythm
sleep-wake disorders, Auger et al., *JCSM* 2015; evidence for chronotherapy
is modest — the supervision framing below reflects that.)

- **Phase advance** — the standard first-line: fade engine runs on both ends
  (bedtime and *wake time* step earlier together, wake-anchor emphasized);
  checklist seeds morning bright light within 30 min of waking, evening
  light/screen restriction, no caffeine after 2 PM, and — if the clinician
  adds it — a melatonin *timing* item. The app displays the clinician's
  prescribed clock time only; it never computes or suggests a dose or time
  (same posture as the whole app: display, don't advise).
- **Chronotherapy (progressive phase delay)** — bedtime moves 2–3 h *later*
  each day, around the clock, until it reaches the target — then hard
  maintenance. Needs real machinery:
  - Fade engine gains a `delay` mode with modular (around-the-clock) time
    math; "reaches target on night N" still computes.
  - The noon-to-noon chart becomes the killer visual: the planned sleep
    window marches across the chart day by day and the family's actual bars
    either track it or don't.
  - **Supervision guardrails**: the builder shows a warning banner on this
    template (week-long commitment, school/work coordination, relapse risk
    without strict maintenance — and the maintenance plan is issued as a
    *follow-up capsule*). The template cannot be issued without a review
    date. Edu pack is day-keyed ("today you sleep 6 AM–2 PM; protect the
    schedule, no naps").

## Capsule schema additions (v1 → v1.1, backward compatible)

```js
plan.protocol = { id:"gradext" }                  // omitted for custom plans
plan.eduPack  = "gradext@1"                        // content version pin
plan.fade.mode = "advance" | "delay"              // delay = modular math
plan.checkIns  = { night1:[3,5,10], escalate:[2,2,2], capMin:15 }  // gradext
plan.position  = { steps:["beside bed","middle of room","doorway","outside door"], everyNights:3 } // campout
```

Old apps ignore unknown fields; old capsules lack them — both directions safe.

## Diary-side rendering

- **Plan strip** (morning entry): protocol-aware line — tonight's bedtime,
  check-in intervals, or camp-out position, computed from night number.
- **"What to expect" card**: one short paragraph from the edu pack, keyed to
  plan night (falls back to the pack's general text). Tone rules: plain
  language, second person, no scare copy, cited at the pack level.
- **Chart**: target ticks already specced; chronotherapy adds the marching
  planned window; graduated extinction annotates rows with intervention
  counts vs. planned check-ins.
- **Report/PDF**: names the protocol and pack version, so the next clinician
  knows exactly what was prescribed.

## Safety & scope

- Templates are **clinician tools**: the app never surfaces protocol choice
  to families and never recommends one. plan.html is explicit that the
  clinician owns every field after prefill.
- No dosing, ever. Melatonin appears only as a clinician-typed timing
  instruction, labeled "as prescribed."
- Education packs carry citations and a "not medical advice / your
  clinician's plan governs" footer.
- Chronotherapy template: warning banner + required review date + follow-up
  maintenance capsule pattern.

## Authoring & phasing

- Packs are plain Markdown/JSON in-repo; Craig is editor-of-record. Each pack
  ≤ ~6 short night-keyed snippets + 1 general blurb — deliberately small.
- **v1**: fading, graduated extinction, phase advance (all reuse or lightly
  extend the fade engine) + their packs.
- **v1.1**: camping out (position schedule), bedtime pass, chronotherapy
  (delay-mode math + marching chart window).
- Mockup: `plan-builder-mockup.html` now includes a protocol picker with
  prefills and a "what to expect" preview to make this concrete.
