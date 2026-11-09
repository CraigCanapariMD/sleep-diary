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


### Picking up dinner after working on this all afternoon
Came up with some more ideas-- 1-3 below; the money one was #3-- pushing clinician plans. After seeing Claude's plan, changed the license



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

### 2026-07-11 (late night, cont.) — clinician plans SHIPPED (spec → mockup → feature in one evening)
The plan-push spec became real code. `plan.html` (clinician-side) is the
morning's mockup promoted to production: real QR codes (vendored Nayuki
qrcodegen, MIT, compiled from the official TypeScript), a printable family
handout with scan-me instructions, and an app link derived from the page's
own directory so rehosted copies work unchanged. Diary-side (`index.html`):
`#plan=` capsules are decoded on load and the fragment immediately scrubbed
from the URL bar; an accept card lets the family add or decline; the entry
form gains a plan strip showing THAT night's computed target (fade schedules
and chronotherapy's around-the-clock delay mode both implemented) plus
checklist tap-offs stored per entry; the chart draws dashed terracotta
target ticks (appended after the bars so they stay visible); Summary, the
MyChart text export, and the PDF report all gained a plan-adherence table.
Verified end-to-end in the browser: built a bedtime-fading plan dated 3 days
back, accepted it, logged two nights, and confirmed the numbers by hand —
+10 and +25 min lights-out deviations reported as +18 mean, tick x-positions
exact to the pixel. CACHE_VERSION 2.1.6 → 2.2.0, demo/www rebuilt.
Talking point: the entire "backend" for pushing a treatment plan into a
patient-held app is base64 in a URL fragment — zero infrastructure, zero
PHI exposure, and it shipped the same day it was designed.

### 2026-07-11 (last call) — REDCap Phase A shipped
The research on-ramp, exactly as specced this morning: a `redcap/` folder
with a ready-made data dictionary (enrollment + repeating `sleep_night`
instrument, 18-column format validated; teen screen fields included now so
instruments won't fork later) and a coordinator guide, plus a "Research use"
card in the Share tab — participant code in, REDCap-ready CSV out
(record_id = code, repeat instance = days since first night so re-imports
update instead of duplicate; initials and free-text notes deliberately
stripped). Verified in-browser: seeded two nights, captured the actual
download blob, checked every computed metric by hand (SOL 20 min, SE 94.1%
— correct). CACHE_VERSION 2.2.0 → 2.2.1. Talking point: the app went from
"suitable for REDCap import" (a README aspiration) to a working research
instrument in one commit, because the CSV schema was designed for it from
day one.

### 2026-07-12 — Consultant SaaS groundwork (spec only, no code)
Strategy session: ruled OUT hosted-PHI/HIPAA territory for the foreseeable
future (business-associate liability isn't worth it; clinicians already have
the MyChart export and the REDCap path). Ruled IN a commercial track aimed at
sleep consultants — not covered entities, real caseload-tracking pain, and
the PolyForm NC license already reserves monetized products. Wrote
`docs/specs/consultant-sync.md`: invite-code/QR connect flow (same pattern
as plan capsules), pseudonymous sync as idempotent upserts on
(shareCode, date) — which falls out of the existing backup-v2/merge design —
family app stays local-first with no accounts, dashboard + backend to live
in a separate private repo. Phasing starts with demand validation using
demo.html before any code. Also queued: a Yale Ventures conversation before
the product takes money. Zero changes to index.html; CACHE_VERSION untouched.
Talking point: the app's "no server" constraint turned out to be the design
asset — sync bolts on as an outbox, not a rewrite.

### 2026-07-12 (later) — Adversarial review + data-loss hardening + sync Phase 1
Went hunting for bugs in index.html and found a real data-loss one: restoring
a backup on a new phone silently dropped the clinician plan and study code
(applyBackup only merged entries+settings) — fixed; `sync` consent
deliberately does NOT restore, it belongs to the device where it was given.
Storage hardening: state now carries meta.savedAt and load keeps the NEWER
of IndexedDB vs localStorage (before, a stale IndexedDB copy silently beat a
fresher localStorage one); the debounced save flushes on pagehide/
visibility-hidden so swiping the app away within 250 ms of "Save night" can
no longer lose the entry; backup nudge starts at 3 nights (was 5); the iOS
install banner now warns that Safari-logged nights do NOT carry into the
home-screen app (separate storage container) and walks through
backup-file → restore. Correctness: WASO is clipped to the [onset, wake]
window so TST agrees with the chart; naps that cross noon warn instead of
vanishing silently; saving a night with inconsistent times (the classic
AM/PM slip) now asks for confirmation — one bad night drags every mean in
the report. Consultant sync Phase 1 (docs/specs/consultant-sync.md) is in,
behind an empty SYNC_ENDPOINT so production behavior is unchanged:
#connect= invite → consent card → per-child outbox → idempotent pushes,
delete tombstones, revocation, Stop sharing. Everything verified in the
browser: unit checks by hand (WASO 45 where 30+15-clipped+0-outside, TST
565 = 610−45), and the full sync lifecycle against a mocked backend —
invite GET, consent, save → POST payload, delete → tombstone, stop →
DELETE. CACHE_VERSION 2.2.1 → 2.3.0, demo/www rebuilt. Talking point: the
scariest bug wasn't in the sleep math — it was the backup that quietly
forgot the doctor's plan.

### 2026-09-08 — Naps become start time + duration
Craig's call: the nap entry asked for four clock times (into bed, fell
asleep, woke, out of bed) while a night awakening asked for one time and a
number of minutes. Two different mental models for the same "how long was
my kid asleep" question, and the four-field one is the harder ask at 6 AM.
Naps now match awakenings — "Fell asleep at" plus "Slept for (minutes)" —
with a small "Woke at 2:25 PM" line under the pair so a mistyped duration is
visible before it reaches the chart. The stored `woke` time is derived from
the pair, so the chart, the summary table, the REDCap export and the
consultant-sync payload all keep reading the one field they already read;
nothing downstream changed. Nights recorded under the old form still open
correctly: `napDur()` falls back to the elapsed time between asleep and
woke, and the export keeps printing their in-bed/out-of-bed pair
(`napDetail()` drops it only when it is absent). The dropped in-bed/out-of-bed
nap times were never surfaced anywhere — `napInBed` was computed and then
used by nothing — so the only loss is the nap in-bed arrows on the chart for
new entries. CACHE_VERSION 2.3.0 → 2.4.0, demo sample data and www rebuilt,
REDCap dictionary note updated for the new naps_detail shape.
Talking point: the feature wasn't "add a field," it was "notice that two
screens asked the same question two different ways" — the kind of thing you
only see when the person specifying it also uses it.

### 2026-11-09 — Roadmap session: Garay notes + three diary papers
No code this session; a planning pass that produced docs/ROADMAP.md. The
Yale ITS intake date still isn't set, so the time went to deciding what the
app should store before any family uses it. Inputs: the 9/8 meeting with
Dr. Garay (15 items, checked one by one against the code: only "no crying
tracker" and "camping out isn't the default" were already true) and three
papers: the Consensus Sleep Diary (Carney 2012), its validation against EEG
and actigraphy (Dietch & Taylor 2021), and McHill/Czeisler/Klerman 2026 on
online diaries. The papers changed the plan more than expected. The CSD
already has, in validated 3rd-grade wording, most of what Danielle asked for
(got into bed, caffeine, alcohol, sleep meds, "woke earlier than planned"),
so new questions copy its wording. Dietch: diaries are accurate for sleep
*timing* but overestimate sleep efficiency by ~7% with wide error, so the
report leads with timing and judges SE on weekly means. McHill: people clean
their own data when they *see* it, which turns "consistency checks" into a
live one-row preview of the night instead of pop-ups. Decisions: parent/teen
is asked once at setup (it's whoever's phone it is); "got into bed" and the
second efficiency number ("SE from getting into bed", next to "SE from
lights out") are teen-band only; a once-a-day *morning* reminder .ics, plus
a chronotherapy calendar generated in the family's diary because phones
don't print; "How did your child sleep last night?" on the CSD's 5-point
scale, shown as faces the way CBT-i Coach does it. Phase 1 goes in before
the security-review freeze.
Talking point: the 2012 consensus diary had already answered half of the
clinician's wish list. The work was reading it, not inventing the questions.

### 2026-11-09 (later) — Opening the repo to a first outside contributor
Craig's 16-year-old son is joining as a contributor (the plan in
docs/teen-collaboration.md, now real). Set up for fork-and-PR: CONTRIBUTING.md
written for a beginner (synthetic data only, never real patient data; fork →
branch → signed-off commit → PR; run it with `python3 -m http.server`),
CONTRIBUTORS.md, a PR template with a checklist, and
examples/synthetic-backup.json, three weeks of a made-up toddler in the app's
own backup format, verified by restoring it in the app (21 nights, no time
warnings). `main` is now protected: PRs required, no force pushes, no
deletion, admins can still push. Four "good first issue" tasks opened, two of
them teen-version groundwork: teen wording for the entry form and a
synthetic teen diary with a late body clock. Open question parked for a
lawyer: the DCO covers the noncommercial license, not the commercial one.
Talking point: the first contributor's onboarding doc leads with "made-up
data only" — in a medical app, that's the rule that matters most.

### 2026-11-09 (evening) — Roadmap Phase 1: data shape and data quality
All eight Phase 1 items and the D1 setting, in one pass, before any family
has a diary to migrate. New per-night fields, all optional: `intoBed`
(Teenager and Young adult age bands only; it starts equal to lights out and
follows it until the two are set apart), `quality` (1–5, the Consensus Sleep
Diary's anchors, five tappable faces with the chosen label underneath),
`loggedAt` (set silently on the first save, never changed by an edit) and
`editedAt`. New per-diary setting: `settings.reporter` (parent or teen),
asked once in Setup, defaulting from the age band; it picks the wording of
the quality question and nothing else yet. `computeNight()` is untouched:
the second efficiency number lives in a separate `bedMetrics()`, so a diary
with none of the new fields produces the same numbers and the same table
columns as before. The entry form now draws the night as one chart row that
redraws on every keystroke, with "Worth a look" notes underneath (24-hour
sleep more than 2 h outside the recommended range for the age, a nap
overlapping the night, a nap over 4 h, an awakening outside the sleep
window, over 3 h to fall asleep). None of them block; the save-time confirm
is still the only dialog. The plan checklist is reworded for the morning at
render time, by exact match on the label text from plan.html's library, so
a clinician's custom item is never rewritten beyond "tonight" → "last
night", and reports keep the original wording. The report and Summary tab
gained a sleep-timing graph (lights out and sleep onset in one panel, wake
in another, plan targets dashed) and sleep efficiency by week with a
one-line caveat from Dietch & Taylor. Both CSVs and the REDCap dictionary
carry seven new columns. Verified in the browser: the synthetic toddler
backup restores to the same 21 nights, SE 90%, same table columns; a new
night stamps `loggedAt` and an edit leaves it alone; the demo's new made-up
teenager shows SE 88% from lights out against 79% from getting into bed
(checked one night by hand: 420 ÷ 520 min = 80.8%); an AM/PM slip empties
the preview bar. CACHE_VERSION 2.4.0 → 2.5.0, demo and www rebuilt.
Same day, Craig's call: the age comparison moved from the NSF ranges to the
AASM consensus statement the AAP endorsed (Paruthi 2016). Teenager now
starts at 13, which settles the roadmap's "what about 13-year-olds" note;
newborns keep the NSF range because the AASM gives none under 4 months, and
young adults use the adult statement's "7 or more hours". The comparison is
now within / below / above; the "may be appropriate" band is gone.
Craig also settled the checklist wording: "Woke up at the planned wake time";
the chair item reads "Chair stayed in the same spot or moved farther away",
because families set their own pace; and morning bright light came out of
the phase-advance plan altogether (impossible on school days for most teens,
and possibly mistimed in a true phase delay).
Talking point: the form didn't get a single new pop-up. The check is a
picture of the night, drawn while you type.

### 2026-11-09 (night) — The nap question
Craig's point: an empty nap list meant two different things, "skipped the
nap" and "forgot to log it", and the usual fix (a reminder) is exactly the
nagging the app avoids. Resolution: children who usually nap see one-tap
answers in the nap section, their usual nap ("+ Usual nap (1:05 PM, 70
min)") or "No nap that day". Nothing is filled in until tapped. "Usually
naps" is learned from the diary (a nap on 3 of the last 7 logged days; the
usual nap is the median start and length); until there is a week of data
the age group decides. Craig's correction to the first draft: teenagers do
nap, so they are asked by default and school-age children are not. An
unanswered day is stored as "not recorded" rather than zero (`napAsked`
without `noNap`), left out of the nap and 24-hour averages, and counted in
the report ("Naps answered on 8 of 9 days"). Entries from before the
question existed still count as zero and are not re-asked on edit. New
export column `nap_status`. Verified in the browser on the demo toddler
(usual-nap chip adds the nap and draws it in the preview; "No nap" saves
as a real zero; an untouched section saves as not recorded and drops out
of the nap mean) and on fresh school-age, toddler and unset-age diaries.
Still CACHE_VERSION 2.5.0 (same unreleased PR). Not changed: a morning nap
is still drawn at the right-hand end of the previous day's chart row.
Talking point: the fix for missing data wasn't a reminder. It was letting
"nothing happened" be an answer.

## Other tboughts

Two compelling articles in NYT on 7/12/26
Helen Ouyang-- on risks of AI scribes
Cunff- on risk of AI search
specifically the fact that when you're searching in AI, you don't always know what the right question is, but you're going to get the right answer to the question you asked. Clicking through links on the Internet reminds me of when I used to go to the library for my English degree, and the book I was looking for was not the right one. It was the one on the shelf next to it. And that curiosity drives learning and also serendipity.
