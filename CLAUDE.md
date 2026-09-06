# Hackathon Hub — marketing content repo

LinkedIn marketing content and content pipelines for Hackathon Hub. No app code — this repo is copy, HTML/image assets for social graphics, and small Node scripts that render those graphics.

## Weekly roundup pipeline ("New hackathons in Europe")

A recurring LinkedIn post + matching visual carousel, published roughly weekly, covering newly-published hackathons across Europe grouped by region/country.

For a full week's run, use the `hackathon-roundup-pipeline` skill (`.claude/skills/hackathon-roundup-pipeline/SKILL.md`): it takes one pasted raw roundup, produces both deliverables, publishes the carousel as a review artifact, and runs a consistency / no-ai-slop / double-check QA pass across the two. It calls the two skills below as sub-steps. The steps are also documented here for reference.

Two separate deliverables come from the same underlying event data — keep them in sync but don't conflate their formats:

1. **The text post** — raw bold-unicode LinkedIn text (flag emoji region/country headers, bulleted events). Before publishing a new one, run the `hackathon-roundup-format` skill (`.claude/skills/hackathon-roundup-format/SKILL.md`) on it — it fixes bullet symbols, blank-line spacing, city names (English exonyms), and price/currency formatting per rules worked out with the user. That skill is the source of truth for those rules; don't re-derive them. The skill writes its cleaned output to `hackathon-spotlights/weekly-roundup-YYYY-MM-DD/post.md` (not printed inline) — same dated folder as that week's PNGs below.

2. **The visual carousel** — a set of 1350×1350 PNGs (LinkedIn carousel format: one cover slide + one slide per region, "Option A" layout from `hackathon-spotlights/weekly-roundup-layouts.html`). Pipeline for a new week:
   - Edit `hackathon-spotlights/build-new-roundup.js` in place: update the `REGIONS` data array, the `WEEK` string, and the `<meta>` / `<h1>` / intro `<p>` dates for the new week's events.
   - Update the `names` array in `hackathon-spotlights/render-pngs.js` to match the new slide count (cover + one per region-page; a region paginates every 4 events).
   - Run `node build-new-roundup.js` → produces `weekly-roundup-new.html` (a standalone Option-A-only carousel page).
   - Publish `weekly-roundup-new.html` as a per-week review artifact (favicon 🇪🇺) and check it before rendering PNGs.
   - Render to PNGs with `node render-pngs.js` (uses local `playwright` install in `hackathon-spotlights/` — Chromium must be installed once via `npx playwright install chromium`). Output lands in `weekly-roundup-new-pngs/` (gitignored); copy the finished set into the dated folder.
   - **Important Playwright gotcha**: the review page ships zoomed to 0.42 (`.scaler{zoom:var(--z,.42)}`) and horizontally scrolled inside `.stage`. `render-pngs.js` reads `weekly-roundup-new.html`, string-replaces the zoom rule to nothing and strips the review chrome (`.wrap` max-width, `.stage` overflow, header/controls) *before* loading via `page.setContent`, so each 1350×1350 card lays out full-size from the first paint. Don't change zoom at runtime (via the `--z` var or an injected stylesheet) — Chromium doesn't reliably repaint backgrounds on a runtime `zoom` change and leaves stale page-background pixels behind the card edges. Screenshots render at `deviceScaleFactor: 2` → 2700×2700 PNGs.
   - Save the output folder as `hackathon-spotlights/weekly-roundup-YYYY-MM-DD/`, dated to the "published since" date named in that week's post (not the render date). This is the same folder the text post's `post.md` lands in.

Tag naming differs deliberately between the two deliverables: the text post keeps long-form tags ("Artificial Intelligence (AI)"), the carousel visual uses short-form tags ("AI") to fit the card layout. This is intentional, not an inconsistency to fix.

## Housekeeping

- `hackathon-spotlights/node_modules/` (from the local `playwright` install) is gitignored — don't commit it, just `npm install playwright` again if a fresh checkout needs it.
- `.agents/*.md` are marketing-skill context docs (ICP, positioning, etc.), not memory — static reference material, not auto-updated.
