# Contributing

Thanks for helping! This is a sleep diary that families and sleep clinicians
use, so we keep changes small, careful and easy to review.

## The one rule that matters most

**Use made-up data only. Never real patient data.** Not a real child's
sleep, not a real name, not a screenshot of someone's diary. If you need test
data, use [`examples/synthetic-backup.json`](examples/synthetic-backup.json)
or invent your own. Every PR is checked for this.

## How a change gets in: fork → branch → pull request

1. **Fork** the repo on GitHub (the "Fork" button, top right). You now have
   your own copy.
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/sleep-diary.git
   cd sleep-diary
   ```
3. **Make a branch** for each issue, named after it:
   ```bash
   git checkout -b fix-label-wording
   ```
4. **Change things, then commit with sign-off** (the `-s` matters, see below):
   ```bash
   git add -A
   git commit -s -m "Short description of what changed"
   ```
5. **Push** your branch to your fork:
   ```bash
   git push -u origin fix-label-wording
   ```
6. On GitHub, open a **pull request** from your branch to `main` here. Fill
   in the checklist. Craig reviews it, comments, and merges when it's ready.
   Review comments are normal. They're how everyone learns, not a sign
   something went wrong.

Before starting new work, update your fork's `main` (the "Sync fork" button
on GitHub, then `git pull` on your computer's `main`), and branch from that.

One issue per pull request. Small PRs get reviewed fast.

## Run the app on your computer

The app is one file, `index.html`. No install is needed to try it. Serve the
folder and open it in a browser:

```bash
python3 -m http.server 8000
```

Then go to <http://localhost:8000/>. (Opening `index.html` by double-click
mostly works too, but offline mode and some features need the server.)

**Load test data:** open the **Share** tab → **Restore from file** → pick
`examples/synthetic-backup.json`. You get three weeks of a made-up toddler's
sleep. Use a private/incognito window so it doesn't mix with anything else
in your browser.

Two house rules if you change `index.html`:

- Bump `CACHE_VERSION` in `sw.js`, or installed copies won't update.
- Don't edit `demo.html` or `www/` by hand. They're generated. Run
  `npm install` once, then `npm run build`.

## Sign your commits (DCO)

Every commit needs a `Signed-off-by:` line. `git commit -s` adds it for you.
It means you're agreeing to the
[Developer Certificate of Origin](https://developercertificate.org/): you
wrote this change (or have the right to submit it) and it can be shared
under this project's [license](LICENSE). The line uses the name and email in
your git settings, so check them first:

```bash
git config user.name
git config user.email
```

Tip: GitHub can give you a private `noreply` email for commits
(Settings → Emails) if you'd rather not publish your real one.

Forgot `-s` on your last commit? `git commit --amend -s --no-edit`, then
`git push --force-with-lease` (only on your own branch, never on `main`).

## Using AI tools

Copilot and similar tools are fine as a helper. You still need to understand
every line you submit and be able to explain it in review.

## Credit

Contributors are listed in [CONTRIBUTORS.md](CONTRIBUTORS.md). Your first
merged PR adds your name.
