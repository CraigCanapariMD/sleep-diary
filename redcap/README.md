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
- `se_pct` is sleep efficiency counted from lights out. In the Teenager and
  Young adult age groups the app also asks "Got into bed" (`got_into_bed`,
  CSD Core item 1) and computes `tib_from_bed_min` and `se_from_bed_pct`
  from it; all three are blank in younger children's diaries.
- `sleep_quality` is the optional CSD Core item 8 rating (1 = Very poor …
  5 = Very good). `logged_at` (phone's local time) and `logged_lag_days`
  record when the night was first entered, so backfilled nights can be
  told apart; `reported_by` is the diary's parent/teen setting.
- `nap_status` separates a day with no nap (`no_nap`) from a day where the
  nap question was shown but not answered (`not_recorded`); leave the
  latter out of nap and 24-hour totals. `not_asked` is a child who doesn't
  usually nap, or a night entered before v2.5.0.
- `screen_off`, `screen_in_bed`, `screen_after_lights_out` are reserved for
  the planned teen self-report version
  ([spec](../docs/specs/teen-screen-time.md)) and arrive blank from parent
  diaries — included now so instruments won't need versioning later.
- Consent, IRB approval, and the security of the transport channel are the
  study's responsibility; the app itself neither uploads nor stores anything
  off the family's device. For direct in-app submission (no file handling),
  see Phase B in [the spec](../docs/specs/redcap-research-backend.md).
