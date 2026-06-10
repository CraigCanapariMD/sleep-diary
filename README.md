# Pediatric Sleep Diary

A single-file web app for parents to track a child's sleep (3–14+ days) and share
results with their sleep clinic. No server, no accounts: all data stays in the
parent's browser until the parent exports it (plain-text summary for MyChart,
CSV for research, JSON/Google Drive for backup).

## Files

- `index.html` — the clinical app. This is what parents use.
- `demo.html` — identical, but pre-loads 7 nights of sample data on first open
  (for demonstrating to colleagues). Safe to delete.

## Deploy on GitHub Pages (~2 minutes)

1. Sign in at github.com → **+** (top right) → **New repository**.
   Name it `sleep-diary`, leave it **Public**, click **Create repository**.
2. On the new repo page: **uploading an existing file** link → drag in
   `index.html` (and `demo.html`, `README.md` if you like) → **Commit changes**.
3. Repo **Settings** → **Pages** (left sidebar) → under "Build and deployment",
   Source = **Deploy from a branch**, Branch = **main** / **(root)** → **Save**.
4. Wait ~1 minute. Your app is live at:
   `https://YOUR-USERNAME.github.io/sleep-diary/`

Updating later: edit/replace `index.html` in the repo (the pencil icon or
re-upload). Pages redeploys automatically. Parents who added it to their home
screen get the new version on next load — no reinstall.

## Clinic handout (suggested wording)

> 1. Open the camera and scan this QR code (or type the link).
> 2. **iPhone:** tap Share → "Add to Home Screen." **Android:** tap menu (⋮) →
>    "Add to Home screen." This keeps your diary safe on your phone.
> 3. Each morning, tap **Add last night** (about 1 minute).
> 4. At your next visit — or when we ask — open the **Share** tab, tap
>    **Copy summary**, and paste it into a MyChart message to the clinic.

Generate the QR code from your Pages URL with any QR generator. "Add to Home
Screen" matters on iPhone: it prevents iOS from purging the diary's storage
after 7 days of not opening Safari to that site.

## Privacy / compliance posture

- No data is transmitted to, or stored by, the clinic, Yale, or GitHub.
  GitHub Pages serves the static page only; it never receives diary entries.
- Parents are asked for initials only, never names or DOB.
- Sharing is patient-initiated (paste into MyChart / email attachment),
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
   and paste it between the quotes. Commit.
6. Before clinic-wide rollout, submit the consent screen for verification;
   unverified apps are capped at ~100 test users and show a warning screen.

## Data dictionary (CSV export)

One row per night: `date, lights_out, sleep_onset, final_wake, out_of_bed,
sol_min, tst_min, tib_min, se_pct, waso_min, n_awakenings,
n_parent_interventions, awakenings_detail, n_naps, nap_sleep_min, naps_detail,
notes`. Times are 24-h clock; durations are minutes. Suitable for REDCap import.

Summary metrics shown in-app: mean ± SD lights-out / onset / wake / midsleep;
mean sleep latency, night TST, TIB, sleep efficiency (TST÷TIB), WASO,
awakenings and parental interventions per night, nap sleep, 24-h TST, and the
Sleep Regularity Index (Phillips et al., 5-min epochs, consecutive days).

## License / attribution

Chart format inspired by the Mindell & Owens pediatric sleep log. The app code
may be reused by other institutions; add a license file (MIT suggested) before
publicizing.
