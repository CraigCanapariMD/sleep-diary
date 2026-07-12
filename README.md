# Pediatric Sleep Diary

**Try it:**

- **App:** https://craigcanaparimd.github.io/sleep-diary/
- **Demo (preloaded with 7 nights of sample data):** https://craigcanaparimd.github.io/sleep-diary/demo.html
  — uses its own separate storage, so it never shows or touches a real diary
  on the same phone
- **Sample exports** — what the clinic receives: [text summary](examples/sample-summary.txt) · [CSV](examples/sample-export.csv) · [PDF report](examples/sample-report.pdf)
- **Source-available** under the [PolyForm Noncommercial license](LICENSE) —
  free for families, nonprofits, academic/government institutions, research,
  and small clinical practices (≤5 clinicians); larger for-profit
  organizations and commercial products need a
  [commercial license](LICENSE): [github.com/CraigCanapariMD/sleep-diary](https://github.com/CraigCanapariMD/sleep-diary)

A small installable web app (PWA) for parents to track a child's sleep (3–14+ days)
and share results with their sleep clinic. No server, no accounts: all data stays
on the parent's phone until the parent exports it (plain-text summary for MyChart,
printable PDF report with the sleep chart, CSV for research, JSON/Google Drive for
backup). Works fully offline once opened; supports multiple children per device.

## Files (deploy all of them)

- `index.html` — the clinical app. This is what parents use.
- `sw.js` — service worker: offline support and instant loading. **Bump
  `CACHE_VERSION` at the top whenever you change `index.html`** so installed
  phones pick up the update.
- `manifest.webmanifest` — makes the app installable ("Add to Home Screen").
- `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` — app icons.
- `demo.html` — identical app, but pre-loads 7 nights of sample data on first
  open (for demonstrating to colleagues). Regenerate it after editing
  `index.html` (it is `index.html` plus one seed `<script>` block). Safe to delete.
- `plan.html` — the **clinician-side plan builder** (see below) and
  `qrcodegen.js` (its QR library — Nayuki, MIT). Safe to delete if you don't
  use plans.

## How families use it (no accounts, nothing to install from a store)

Parents scan a QR code or open the clinic's link, then "Add to Home Screen."
That's it — no GitHub, no app store, no sign-up. Everything below this point
is for the **clinician or developer** hosting the app.

## Deploy on GitHub Pages (~2 minutes, one-time, clinician/developer only)

1. Sign in at github.com → **+** (top right) → **New repository**.
   Name it `sleep-diary`, leave it **Public**, click **Create repository**.
2. On the new repo page: **uploading an existing file** link → drag in **all
   the files above** → **Commit changes**.
3. Repo **Settings** → **Pages** (left sidebar) → under "Build and deployment",
   Source = **Deploy from a branch**, Branch = **main** / **(root)** → **Save**.
4. Wait ~1 minute. Your app is live at:
   `https://YOUR-USERNAME.github.io/sleep-diary/`

Updating later: edit/replace files in the repo (remember the `CACHE_VERSION`
bump in `sw.js`). Pages redeploys automatically; installed phones get the new
version on their next online open.

## Clinic handout (suggested wording)

> 1. Open the camera and scan this QR code (or type the link).
> 2. **iPhone:** tap Share → "Add to Home Screen." **Android:** tap menu (⋮) →
>    "Add to Home screen" / "Install app." This keeps your diary safe on your
>    phone and lets it work without internet.
> 3. Each morning, tap **Add last night** (about 1 minute — it starts from
>    the previous night's times, so you only change what's different).
> 4. At your next visit — or when we ask — open the **Share** tab and either
>    **Copy summary** and paste it into a MyChart message, or
>    **Print / save PDF** and attach the report.
> 5. The diary is saved **only on your phone** — it is never uploaded, and it
>    won't appear on another device or in a different browser. Keep using the
>    same phone and browser/app icon, and save a backup now and then from the
>    Share tab.

Generate the QR code from your Pages URL with any QR generator.

## What the app does

- **Diary**: one entry per night — lights out, sleep onset, final wake, out of
  bed, awakenings (time, duration, whether a parent helped), naps, and notes.
  New entries prefill from the previous night. Missed nights are surfaced as
  one-tap catch-up chips. Replacing an already-recorded night asks first.
- **Chart**: Mindell & Owens–style shaded log, one row per day, noon → noon.
- **Summary**: mean ± SD lights-out / onset / wake / midsleep; sleep latency,
  night TST, TIB, sleep efficiency (TST÷TIB), WASO, awakenings and parental
  interventions per night, nap sleep, 24-h TST, Sleep Regularity Index
  (Phillips et al., 5-min epochs, consecutive days) — plus, if an age group is
  set, a comparison of mean 24-h sleep against the National Sleep Foundation
  recommended ranges (Hirshkowitz et al., *Sleep Health* 2015; re-certified by
  Dzierzewski et al., *Sleep Health* 2026): within recommended / "may be
  appropriate" / outside.
- **Share**: copy-paste text summary (MyChart), printable PDF report including
  the chart, CSV export, JSON backup file, optional Google Drive backup.
- **Multiple children** per device, each with their own diary, initials, and
  age group.
- **Clinician sleep plans**: a clinician builds a plan at `plan.html`
  (targets, an optional stepped bedtime schedule, a nightly checklist, a
  note) and hands the family a QR code or link. The plan travels entirely
  inside the link's `#` fragment — no server involved. The family taps
  "Add this plan"; the diary then shows each night's computed target while
  they log, draws dashed target lines on the chart, and adds a plan-adherence
  table to the summary, text export, and PDF report. Families can remove a
  plan at any time; plans never modify entries.

## Privacy / compliance posture

- No data is transmitted to, or stored by, the clinic, Yale, or GitHub.
  GitHub Pages serves the static files only; it never receives diary entries.
- Diary data is stored in the browser's IndexedDB (with a localStorage mirror)
  and the app requests persistent storage so the OS won't silently evict it.
  "Add to Home Screen" gives the app its own storage partition on iOS.
- Parents are asked for initials only, never names or DOB (age *group* only).
- Sharing is patient-initiated (paste into MyChart / PDF / email attachment),
  mirroring existing patient-generated-data workflows.
- The optional Google Drive backup writes one file to the **parent's own**
  Google account using the `drive.file` scope (the app can only access the one
  file it created). Disabled until configured — see below.

## Enabling Google Drive backup (optional)

1. console.cloud.google.com → create a project (e.g., "Sleep Diary").
2. **APIs & Services → OAuth consent screen**: External; fill app name,
   support email, developer contact. Add scope
   `https://www.googleapis.com/auth/drive.file`.
3. **APIs & Services → Library**: enable the **Google Drive API**.
4. **Credentials → Create credentials → OAuth client ID → Web application**.
   Under "Authorized JavaScript origins" add your Pages origin, e.g.
   `https://YOUR-USERNAME.github.io` (origin only — no path).
5. Copy the client ID into `index.html`: find `const GOOGLE_CLIENT_ID = "";`
   and paste it between the quotes. Commit (and bump `CACHE_VERSION` in `sw.js`).
6. Before clinic-wide rollout, submit the consent screen for verification;
   unverified apps are capped at ~100 test users and show a warning screen.

## Data dictionary (CSV export)

One row per night: `child_initials, date, lights_out, sleep_onset, final_wake,
out_of_bed, sol_min, tst_min, tib_min, se_pct, waso_min, n_awakenings,
n_parent_interventions, awakenings_detail, n_naps, nap_sleep_min, naps_detail,
notes`. Times are 24-h clock; durations are minutes. Suitable for REDCap import.

## NSF sleep-duration reference values (hours, by age)

| Age group | Recommended | May be appropriate |
|---|---|---|
| Newborn 0–3 mo | 14–17 | 11–13, 18–19 |
| Infant 4–11 mo | 12–15 | 10–11, 16–18 |
| Toddler 1–2 y | 11–14 | 9–10, 15–16 |
| Preschool 3–5 y | 10–13 | 8–9, 14 |
| School age 6–13 y | 9–11 | 7–8, 12 |
| Teen 14–17 y | 8–10 | 7, 11 |
| Young adult 18–25 y | 7–9 | 6, 10–11 |

Source: Hirshkowitz M, et al. *Sleep Health* 2015;1(1):40–43; re-certified by
Dzierzewski JM, et al. *Sleep Health* 2026 (10-year systematic review).

## Brand

Styled with the shared Canapari "Fossil" brand system — see
[`../brand-styleguide.md`](../brand-styleguide.md). Tokens are pasted into the
`<style>` block of `index.html`; light and dark themes both supported.

## Roadmap

Three directions now have full written specs in [`docs/specs/`](docs/specs/):

- **[Clinician-pushed sleep plans](docs/specs/clinician-plan-push.md)** — a
  physician/psychologist/sleep coach builds a plan (targets, bedtime-fading
  schedule, nightly checklist) on a static `plan.html` page and hands it to
  the family as a QR code / link; the diary then shows tonight's targets
  while logging, overlays them on the chart, and reports adherence back on
  the PDF. No server — the plan travels in the URL fragment. Extended by
  **[protocol templates & education packs](docs/specs/protocol-templates.md)**:
  prefilled sleep-training methods (bedtime fading, graduated extinction,
  camping out) and delayed-sleep-phase protocols (phase advance,
  chronotherapy) with night-keyed "what to expect" content for families.
- **[Teen screen-time tracking](docs/specs/teen-screen-time.md)** — part of
  the teen version below: last-screen-off time and screens-in-bed captured in
  ≤3 taps, rendered on the sleep chart next to sleep onset, with
  screen-to-sleep buffer and school/weekend stats in the summary.
- **[REDCap research backend](docs/specs/redcap-research-backend.md)** —
  Phase A ships a REDCap data dictionary + "Export for research" CSV (no
  infrastructure); Phase B adds opt-in enrollment via QR and one-tap "Send to
  study" through a tiny stateless relay that keeps the API token off the
  client.

- **Teen self-report version** — a variant written *for adolescents, not
  parents*: first-person language, self-entry each morning, and fields that
  matter clinically for teens — evening device/screen use (what, until when,
  in bed or not), caffeine, school night vs. weekend patterns. The existing
  metrics (midsleep, SRI, weekday/weekend drift) are especially relevant to
  adolescent delayed sleep phase. Planned as a collaboration with two teenage
  co-developers (the author's sons), who will contribute as named,
  credited contributors on this public repo — real shipped open-source work.
  Open question: teen *mode* inside this app (shared codebase, shared fixes)
  vs. a separate teen-owned fork; leaning mode-plus-credit, decide when work
  starts.
- **App Store / Google Play releases** via the Capacitor shell already in
  this repo (see [NATIVE.md](NATIVE.md)) — enables reliable daily reminder
  notifications.
- **Clinic pilot** — QR handout, feedback from real families, then iterate.

## License / attribution

Source-available under the [PolyForm Noncommercial License 1.0.0 with an
additional small-practice grant](LICENSE). In plain English:

- **Always free**: families and personal use; nonprofit and academic
  hospitals and clinics; educational, government, public-health, and
  research institutions (including rehosting and modifying the app —
  keep the license file and copyright notice).
- **Also free**: direct patient care by any practice with **five or fewer
  licensed clinicians**, regardless of profit status. (Care must be
  delivered by licensed clinicians — this tier doesn't cover coaching or
  consulting services.)
- **Commercial license required** (contact canapari@gmail.com): patient care
  in larger for-profit healthcare organizations, and incorporating this
  software into any paid product or service (apps, platforms, EHR
  integrations, coaching programs, white-labels) at any size.

Versions published on or before 2026-07-11 were MIT-licensed and remain so.
Chart format inspired by the Mindell & Owens pediatric sleep log. Not a
medical device; provides no diagnosis or treatment advice. NSF reference
values are cited in the app and above.
