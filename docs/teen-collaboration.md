# Teen version: collaboration gameplan

How the teen self-report version gets built **with two teenage
co-developers** (see the roadmap in the main README) — set up so the work
is genuinely theirs, publicly credited, and a real learning process rather
than an AI demo.

## Their own AI + GitHub (the tooling decision)

The deciding constraint is age policy, not price:

- **Anthropic requires users to be 18+**, so Claude accounts are out for
  teens (and account-sharing violates the terms).
- **GitHub allows 13+.** The plan: each contributor gets **their own GitHub
  account** with **GitHub Copilot Free** (no cost; completions plus a
  monthly chat/agent allowance — plenty at a teen's pace).
- If they qualify for the **GitHub Student Developer Pack** (13+, enrolled
  students; high schoolers are eligible), Copilot Pro is free — including
  agent mode that can take an issue and open a PR.
- Free supplement: **Gemini CLI** (Google allows 13+) for a
  terminal-agent experience.
- *Verify current tiers/limits before signup — they shift often.*

Copilot is the right choice pedagogically, not just financially: it lives
**inside** GitHub, so using it teaches the actual workflow — issues,
branches, PRs, review — instead of doing GitHub *for* them.

## Working structure (the learning design)

1. **Own accounts, fork-and-PR.** They fork the repo and submit pull
   requests (protects `main`, and mirrors how open source actually works).
   Commits land under their own names — the public PR history *is* the
   CV artifact.
2. **Review is the teaching channel.** Every PR gets a real review; nothing
   merges without it. Comments explain the *why*, not just the fix.
3. **Issues as assignments.** Each task is a scoped GitHub issue that
   points at prior art, e.g. "add a caffeine field to the evening form —
   see how screen-time was specced in
   [teen-screen-time.md](specs/teen-screen-time.md)."
4. **AI as pair programmer, not ghostwriter.** Copilot in the editor while
   they drive teaches; an autonomous agent that delivers finished PRs
   teaches almost nothing. Keep the agent-mode toys for after they can
   review its output critically.
5. **Contributions stay genuinely theirs and visibly credited** — named in
   the README and release notes as the teen version ships.

## Boundaries with the rest of the project

- This favors **teen *mode* in the shared codebase** (the roadmap's open
  question): shared fixes, and their PRs land in the repo people actually
  visit.
- The teen version is fully independent of the consultant-sync commercial
  track (sleep consultants work with young children, not teens). Teen work
  stays in this public, noncommercially-licensed repo; any commercial
  backend lives elsewhere. The two never tangle, so their contributions
  are never entangled with a product someone monetizes.
