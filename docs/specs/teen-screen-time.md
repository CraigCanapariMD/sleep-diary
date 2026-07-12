# Spec: screen-time tracking in the teen version

**Status:** proposed · **Priority:** build as part of the planned teen
self-report version, with the teen co-developers
**Goal:** capture evening screen use with near-zero logging burden and make
it *visible on the sleep chart*, so a teenager (and their clinician) can see
the relationship between screens and sleep instead of being lectured about it.

## Clinical rationale

Evening device use is the modifiable behavior most associated with adolescent
delayed sleep phase: it delays lights-out, lengthens sleep-onset latency, and
in-bed use is the highest-risk pattern. The metrics this app already computes
(midsleep, SOL, SRI, school-vs-weekend drift) are exactly the ones screen use
perturbs — so the design principle is **juxtaposition, not judgment**: put
screen-off next to sleep onset on the same chart row and let the pattern
speak. No warnings, no red text, no "screen time score."

## Logging design (target: ≤3 extra taps each morning)

The morning entry form (`entryForm()`, index.html:867) gains a "Screens last
night" mini-section, first-person like the rest of the teen variant:

| Field | Prompt | Control |
|---|---|---|
| `screen.off` | "When did you last look at a screen?" | time field, prefilled from previous night (same pattern as all time fields) |
| `screen.inBed` | "Were you in bed?" | yes/no chips |
| `screen.none` | "No screens after dinner" | one-tap chip that skips the section |

Derived, never asked: `screenAfterLO = screen.off > lightsOut` (computed with
the existing minutes-from-noon helpers).

**v2, only if the teens want it:** device/category multi-select (phone /
gaming / TV / laptop) and a session start time (enables a true duration band
on the chart). Deliberately not in v1 — every added tap costs adherence.
Caffeine ("last caffeine at…") is a sibling field in the broader teen spec
and shares this section's layout.

## Data model (additive, migration-safe)

```js
entry.screen = { off:"23:40", inBed:true, none:false }
```
Absent on old/parent-mode entries; `computeNight()` and `migrateState()`
tolerate absence. Nothing else in the schema moves.

## Chart rendering (the headline feature)

In `buildChartSVG()` (index.html:1002), each noon-to-noon row gains a screen
marker, honest about what we actually captured (a point in time, not a span):

- A small **device glyph / tick at `screen.off`** on the row, just above the
  sleep bar. Neutral ink color when screens ended before lights-out; accent
  (amber) when `screenAfterLO` or `inBed` — the only visual emphasis anywhere.
- If v2 session-start lands, upgrade to a thin hatched **band** ending at
  `screen.off`, rendered above the in-bed bar so overlap with the sleep
  window is immediately visible.
- Legend line added only when any entry has screen data, so the parent
  version's chart is pixel-identical to today's.

The intended "aha" is vertical: scanning down the rows, screen-off ticks that
sit inside the sleep window on exactly the nights with long onset latency.

## Summary metrics

Added to `computeSummary()` output and the Summary tab, school/weekend split
where the teen version already splits:

- Mean screen-off time ± SD; mean **screen-to-sleep buffer** (sleep onset −
  screen-off, can be negative).
- % of nights with screens in bed; % with screens after lights-out.
- Side-by-side comparison: mean SOL on screens-in-bed nights vs. other nights
  (means only, with n's — no statistics theater on a 2-week diary).

## Exports

- CSV (`buildCSV()`): append `screen_off, screen_in_bed, screen_after_lights_out`
  (blank for parent-mode entries) — also added to the REDCap data dictionary
  from day one (see [redcap-research-backend.md](redcap-research-backend.md)).
- Text summary + PDF report: one line ("Screens: off 11:12 PM ± 38 min;
  in bed 9/14 nights; screen-to-sleep buffer −22 min").

## Synergy with clinician plans

If a plan (see [clinician-plan-push.md](clinician-plan-push.md)) includes a
"screens off by 9:30" checklist item, it can **auto-check from `screen.off`**
rather than relying on a self-report checkbox — logging once serves both.

## Co-developer scoping (credited work, genuinely theirs)

Cleanly separable tasks suitable for the teen contributors, each a real
shippable PR on the public repo:

1. Entry-form section — HTML + prefill logic (pattern-match `timeField()`).
2. Chart glyph + legend — self-contained SVG work in `buildChartSVG()`.
3. Summary stats + copy — pure functions plus wording they'd actually accept
   as teenagers (they are the target-audience review board).
4. Demo dataset: extend `demo.html` seed data with realistic teen screen
   patterns (their call what "realistic" means — that's the point).
