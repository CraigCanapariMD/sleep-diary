# Build log — how this app came to be

A running record of how a practicing physician (no formal software training)
built, shipped, and maintains a clinical tool with an AI coding agent
(Claude Code). Kept as source material for talks/slides on "vibe-coding" real
clinical solutions. **Convention: every working session appends an entry below.**

---

## The problem (the part only a clinician could specify)

Paper sleep diaries are the workhorse of pediatric sleep medicine and they
fail constantly: families forget them, fill them in from memory the night
before clinic, lose the paper, and nobody computes sleep latency, efficiency,
WASO, or regularity from a hand-drawn grid. Commercial apps harvest data,
require accounts, and don't produce clinic-ready output.

**The spec, in one sentence:** a diary that takes a parent ~1 minute each
morning, keeps every byte of data on the parent's own phone (no server, no
accounts, nothing for a hospital privacy office to review), and exports
physician-grade summaries the family can paste into MyChart.

## Design principles (decided up front, enforced throughout)

1. **Data lives on the parent's phone.** No backend, no analytics, no PHI in
   transit. Sharing is always patient-initiated.
2. **Initials and age *group* only** — never names or DOB.
3. **Evidence-based numbers**: metrics clinicians actually use (TST, SOL, SE,
   WASO, midsleep ± SD, Sleep Regularity Index), age comparison against NSF
   recommendations (Hirshkowitz 2015, re-certified Dzierzewski 2026), chart
   modeled on the Mindell & Owens log.
4. **Zero-friction distribution**: a QR code in clinic. No app store required
   (though a store version is scaffolded — see NATIVE.md).
5. **Free to run**: single HTML file on GitHub Pages. Hosting cost: $0.

## Division of labor (the honest version, for the talk)

- **Physician**: the problem, the clinical requirements, the metrics that
  matter, the privacy posture, the NSF reference values and citations, every
  design judgment call (MIT license, age bands, what the report must contain)
  — and QA, on a real iPhone, in real time.
- **AI agent**: all code, testing in a browser it drives itself, docs,
  git/deploy mechanics, and the "what are our options" analyses (PWA vs
  native, what a store submission entails) that informed the judgment calls.
- **Stack chosen for maintainability by a non-engineer**: one HTML file, no
  framework, no build step for the web version. Anyone (or any future AI
  session) can read it top to bottom.

---

## Timeline

### 2026-06-10 — v1 in an afternoon
Single-file web app: diary entry, Mindell-style chart, summary statistics
(including the Sleep Regularity Index), text/CSV export, optional Google
Drive backup. Deployed on GitHub Pages. Commits `e490de1`, `925df1e`.

### 2026-07-11 — v2 sprint: from web page to installable, shippable product
One session. The v2 feature work landed in a ~30-minute commit window
(16:03–16:31) because the physician reviewed a written improvement plan
first, then said "do all of it."

- **16:03 `e3061f4` v2**: real PWA (manifest, service worker, offline, app
  icons), durable storage (IndexedDB + persistence request — protects weeks
  of family data from iOS eviction), multi-child profiles, prefill-from-last-
  night entry, overwrite guard, missed-night catch-up chips, backup nudges,
  print/PDF physician report with the chart, NSF age-band comparison, shared
  "Fossil" brand system with dark mode, accessibility fixes.
- **16:04 `d0dc4d5`**: open-sourced under MIT — any clinic can rehost.
- **16:11–16:14 `933a6b9`, `d9d1dc0`**: Capacitor iOS/Android shell —
  native projects, icons/splash, local-notification daily reminders, OS
  share sheet, and NATIVE.md documenting the store-submission path.
- **16:21–16:31 — the QA loop, physician on iPhone, agent fixing live:**
  - `4491e8e`: chart was silently truncated on desktop (hidden macOS
    scrollbars) — spotted from a screenshot.
  - `e6071bf`: iOS time inputs overflowed their columns; a literal "null"
    rendered on fresh installs; header collided with the iOS clock. All
    three from one phone screenshot.
  - `cb57425`: install banner — one-tap install on Android, Share→Add-to-
    Home-Screen instructions on iOS (Apple allows no install API).
  - `9a38baf`: updates now apply on the same open (auto-reload when the new
    service worker takes control) after the two-open update dance confused
    the first real user (the physician).

**Talking point from this day:** the fastest QA loop in medicine — clinician
finds a bug on their phone, texts a screenshot, the fix is live in under
five minutes, total infrastructure cost still $0.

---

## Suggested slide skeleton (draft, refine when building the deck)

1. Title: "Vibe-coding clinical tools: a sleep diary in two afternoons"
2. The clinical problem — a photo of a crumpled paper sleep diary
3. Why commercial apps don't fit (privacy, accounts, no clinical output)
4. The one-sentence spec; the five design principles
5. What "vibe-coding" actually looked like (prompt → plan → "do all of it")
6. Live demo / screenshots: entry flow, chart, summary, MyChart paste
7. The physician report (print/PDF with the shaded chart)
8. Privacy architecture: no server — literally nothing to breach
9. The QA loop: my iPhone screenshot → fixed and live in minutes
10. Division of labor: what I did vs. what the AI did
11. Costs: $0 hosting, $0 software; App Store path = $99/yr if wanted
12. What's next: store apps (scaffolded), reminders, adoption in clinic
13. Lessons for colleagues: start with the problem you own; keep data local;
    one file beats a framework; test on your own phone; open-source it

---

## Session entries (append going forward)

*Template: date · what changed & why · commit range · anything
presentation-worthy (bugs found by real use, judgment calls, costs, time).*

### 2026-07-11 (retroactive founding entry)
Everything above. Also: Xcode installed (components downloading) toward
running the iOS shell in the simulator; live site confirmed at
https://craigcanaparimd.github.io/sleep-diary/.

### 2026-07-11 (later) — install prompts, instant updates, sample exports
User-QA-driven polish: smart install banner (one-tap install on Android;
Share→Add-to-Home-Screen instructions on iOS, which allows no install API);
auto-reload when an updated service worker takes control (updates now appear
on the same open — added after the two-open update dance confused real-device
testing); iPhone entry-form fixes from a phone screenshot (input overflow,
stray "null", header vs. status bar). Added "Try it" links to the README and
an examples/ folder with real exports from the 7-night demo dataset — text
summary, CSV, and the one-page PDF report — generated via a new `?print` URL
mode (also handy for automated report snapshots). Commits `cb57425`…this one.
Talking point: the sample PDF in examples/ is the single best "here's what
your clinic receives" slide asset.

Roadmap decision made today: a **teen self-report version** (first-person
language, self-entry, evening device/screen use and caffeine fields, school
vs. weekend nights) to be built *with the author's teenage sons as credited
co-developers* — giving them shipped, public, open-source work for their CVs.
For the talk, this becomes the closing slide: the tool didn't just solve a
clinic problem, it became a family software apprenticeship.

### 2026-07-11 (evening) — demo sandboxing + "your data lives here" copy
Physician QA again: the demo link showed his real diary. Root cause — demo
and app share a browser origin, so they shared storage; a new family opening
the demo first would have started their real diary polluted with sample data.
Demo now uses its own storage key (fully sandboxed, verified). Also added
plain-language copy in-app and in the clinic handout: the diary lives only on
this phone in this browser — it won't appear on other devices; use backups.
Talking point: "local-only data" is a privacy win parents must be TOLD about,
or it reads as a bug.

### 2026-07-11 (night) — roadmap session: three directions specced
No code changed (no CACHE_VERSION bump needed). Wrote full specs for the
three roadmap directions into `docs/specs/` and linked them from the README:

1. **REDCap research backend** — resolved the core tension (local-first app
   vs. research data capture) with opt-in research mode; Phase A is just a
   shipped REDCap data dictionary + an "Export for research" CSV variant
   (record_id / repeat-instance columns, initials & notes stripped), Phase B
   a stateless serverless relay so the REDCap API token never ships in the
   world-readable app.
2. **Teen screen-time tracking** — ≤3-tap morning capture (screen-off time,
   in bed y/n), rendered as a glyph on the chart rows so screen-off sits
   visually next to sleep onset; "juxtaposition, not judgment" is the design
   principle. Scoped into four separable PRs for the teen co-developers.
3. **Clinician-pushed plans** — the sleeper favorite: a static plan.html
   builder emits a QR/link with the plan JSON in the URL *fragment* (never
   hits any server, PHI-safe by construction); the diary shows tonight's
   computed targets while logging, stair-steps bedtime-fading targets on the
   chart, and adds an adherence table to the PDF report.

Judgment call for the talk: all three were designed to preserve the app's
"no server, no accounts" posture — plans travel by QR, research needs a
deliberate opt-in, and the only new infrastructure anywhere (the REDCap
relay) is owned by the study team, not the app. Session run as a spec-writing
sprint on the last day of the Fable model preview.

### 2026-07-11 (night, cont.) — plan builder mockup
Answered "what would the clinician interface look like?" with a working
high-fidelity mockup: `docs/specs/plan-builder-mockup.html` (Fossil-branded,
self-contained, clearly flagged as a mockup). Five form cards (who/when,
targets, bedtime fading, checklist chips, family note) beside a sticky live
preview: a phone frame showing the exact plan strip the family will see in
the diary's morning entry, a stair-step SVG of the fading schedule, and the
generated link + byte count (~500 bytes) with an illustrative QR. Verified in
the browser: fade math computes "reaches 9:30 PM target on night 13," chips
live-update the phone preview and payload size. Real QR encoder (MIT
qrcodegen) to be vendored when this graduates from mockup to plan.html.
Talking point: the clinician tool is itself serverless — the "backend" for
pushing a treatment plan is a URL fragment.

### 2026-07-11 (late night) — protocol templates & education packs
Craig's idea, immediately specced and mocked: the plan builder shouldn't
start blank. New `docs/specs/protocol-templates.md` — named protocols
(bedtime fading, graduated extinction, camping out; phase advance and
chronotherapy for teen DSPS) prefill the whole builder, paired with
night-keyed "what to expect" education shown in the family's diary. Key
architecture: **parameters travel in the QR capsule; education content ships
with the app** (versioned packs, e.g. `gradext@1`), so capsules stay ~500-700
bytes and clinical text stays curated and citable in-repo. Mockup upgraded to
match: protocol picker with five working prefills, a supervision warning
banner on chronotherapy, and a `delay` mode in the fade engine — real modular
around-the-clock math ("3:00 AM, 3 h later every night, reaches 9:30 PM on
night 8"). Caught a genuine clinical bug in preview: the wake time stayed
anchored at 7 AM mid-chronotherapy; fixed so the whole sleep window shifts
together (night 1: 3:00 AM–12:30 PM). Dev war story for the talk: the diary's
own service worker (registered when the preview opened the app root) kept
serving a stale mockup during testing — the offline feature biting its own
developer.

### 2026-07-11 (license change) — MIT → PolyForm Noncommercial + small-practice grant
Craig's call after a real business-model discussion: the diary (and
especially the upcoming plan-builder/protocol tech) stays free for families,
nonprofits, academia, government, research, AND any practice with ≤5
licensed clinicians regardless of profit status — but larger for-profit
groups using it in patient care, and anyone building it into a paid product,
need a commercial license (canapari@gmail.com). Implementation: LICENSE is
now PolyForm Noncommercial 1.0.0 (verbatim, fetched from the canonical repo)
with an "additional grant" section on top — clinician headcount chosen over
revenue thresholds because even a solo pediatric practice clears typical
small-business revenue caps. Pre-2026-07-11 versions remain MIT (that grant
can't be revoked). README/package.json updated; "open source" wording
changed to "source-available" throughout. Timing was deliberate: relicensing
is trivial while there's exactly one copyright holder — after the boys'
credited contributions land, any change needs every contributor's sign-off.
Talking point: licenses enforce themselves through big organizations'
compliance departments — the small honest users you'd never chase are
exactly the ones you exempted anyway.
