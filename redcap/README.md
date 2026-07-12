# Using the Pediatric Sleep Diary with REDCap

This folder makes the diary usable as a research instrument with **zero new
infrastructure** ("Phase A" of
[the REDCap spec](../docs/specs/redcap-research-backend.md)): families keep
using the same local-only app, and your coordinator imports each
participant's export into REDCap. No diary data ever transits a server you
don't control — the file goes from the family to your team however your
protocol specifies (secure email, upload field on a REDCap survey, or handed
over at a visit).

## One-time project setup (coordinator, ~10 minutes)

1. **Create the project** in your institution's REDCap.
2. **Upload the data dictionary**: Project Setup → Design your data
   collection instruments → **Data Dictionary** → upload
   [`sleep_diary_data_dictionary.csv`](sleep_diary_data_dictionary.csv).
   You get two instruments: `enrollment` and `sleep_night`.
3. **Make `sleep_night` repeating**: Project Setup → Enable optional modules
   → **Repeating instruments** → set `sleep_night` to repeat. (This is a
   project setting; a data dictionary cannot switch it on for you.)
4. Move the project to **production** per your local REDCap policy.

## Enrolling a family

1. Create a record with a **participant code** as `record_id` (e.g. `P014`)
   and fill in the `enrollment` form (date, age band).
2. Give the family the code. They enter it once in the diary app:
   **Share tab → Research use → Participant code.**

## Receiving data

The family taps **“Download REDCap CSV”** in the Share tab and sends you the
file. It contains:

- `record_id` — the participant code (never the child's initials),
- `redcap_repeat_instrument` / `redcap_repeat_instance` — instance numbers
  are **days since the participant's first recorded night**, so re-imports
  of overlapping exports update the same rows instead of duplicating them,
- one `sleep_night` row per night with times and app-computed metrics.

**The export deliberately omits initials and free-text notes** — the only
identifier is the code, and the code-to-family link lives only in your
enrollment records.

Import via **Data Import Tool** → upload the CSV (UTF-8, dates already
Y-M-D, `overwriteBehavior` normal). Repeat whenever the family sends an
updated export; already-imported nights are simply refreshed.

## Field notes

- Times are 24-hour clock; durations are minutes; metrics (`sol_min`,
  `tst_min`, `se_pct`, `waso_min`, …) are computed by the app exactly as
  defined in the [main README](../README.md)'s data dictionary.
- `screen_off`, `screen_in_bed`, `screen_after_lights_out` are reserved for
  the planned teen self-report version
  ([spec](../docs/specs/teen-screen-time.md)) and arrive blank from parent
  diaries — included now so instruments won't need versioning later.
- Consent, IRB approval, and the security of the transport channel are the
  study's responsibility; the app itself neither uploads nor stores anything
  off the family's device. For direct in-app submission (no file handling),
  see Phase B in [the spec](../docs/specs/redcap-research-backend.md).
