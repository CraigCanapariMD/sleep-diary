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
