# Hackathon Hub — marketing content repo

LinkedIn marketing content and content pipelines for Hackathon Hub. No app code — this repo is copy, HTML/image assets for social graphics, and small Node scripts that render those graphics.

## Weekly roundup pipeline ("New hackathons in Europe")

A recurring LinkedIn post + matching visual carousel, published roughly weekly, covering newly-published hackathons across Europe grouped by region/country.

Two separate deliverables come from the same underlying event data — keep them in sync but don't conflate their formats:

1. **The text post** — raw bold-unicode LinkedIn text (flag emoji region/country headers, bulleted events). Before publishing a new one, run the `hackathon-roundup-format` skill (`.claude/skills/hackathon-roundup-format/SKILL.md`) on it — it fixes bullet symbols, blank-line spacing, city names (English exonyms), and price/currency formatting per rules worked out with the user. That skill is the source of truth for those rules; don't re-derive them. The skill writes its cleaned output to `hackathon-spotlights/weekly-roundup-YYYY-MM-DD/post.md` (not printed inline) — same dated folder as that week's PNGs below.

2. **The visual carousel** — a set of 1350×1350 PNGs (LinkedIn carousel format: one cover slide + one slide per region, "Option A" layout from `hackathon-spotlights/weekly-roundup-layouts.html`). Pipeline for a new week:
   - Copy `hackathon-spotlights/build-new-roundup.js`, update the `REGIONS` data array and `WEEK` string for the new week's events.
   - Run `node build-new-roundup.js` → produces `weekly-roundup-new.html` (a standalone Option-A-only carousel page).
   - Render to PNGs with `node render-pngs.js` (uses local `playwright` install in `hackathon-spotlights/` — Chromium must be installed once via `npx playwright install chromium`).
   - **Important Playwright gotcha**: don't toggle the page's CSS `--z` zoom variable *after* load to force 100% zoom before screenshotting — Chromium's `zoom` CSS property doesn't reliably repaint the background on a runtime zoom change, leaving stale page-background pixels behind the card's right/bottom edges. Instead set `--z: 1` via `page.addInitScript` so it's zoom-1 from the very first paint.
   - Save the output folder as `hackathon-spotlights/weekly-roundup-YYYY-MM-DD/`, dated to the "published since" date named in that week's post (not the render date). This is the same folder the text post's `post.md` lands in.

Tag naming differs deliberately between the two deliverables: the text post keeps long-form tags ("Artificial Intelligence (AI)"), the carousel visual uses short-form tags ("AI") to fit the card layout. This is intentional, not an inconsistency to fix.

## Housekeeping

- `hackathon-spotlights/node_modules/` (from the local `playwright` install) is gitignored — don't commit it, just `npm install playwright` again if a fresh checkout needs it.
- `.agents/*.md` are marketing-skill context docs (ICP, positioning, etc.), not memory — static reference material, not auto-updated.
