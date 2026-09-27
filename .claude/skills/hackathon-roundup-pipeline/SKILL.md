---
name: hackathon-roundup-pipeline
description: "Run the carousel pipeline for one region's raw 'New hackathons' roundup paste: build the 1350x1350 carousel, publish it as a review artifact, then run a carousel-rendering QA pass. Use when the user pastes one region's raw roundup block and wants its carousel built or updated, or says 'new roundup', 'build the carousel', 'run the roundup pipeline', 'update the roundup'. This skill is carousel-only — it does not produce the LinkedIn text post. For the text post, use hackathon-roundup-format-full, hackathon-roundup-format-compact, or hackathon-roundup-format-regions directly."
metadata:
  version: 3.0.0
---

# Hackathon roundup pipeline

Builds and publishes the carousel for one region's raw roundup paste. It does not touch the text post — `hackathon-roundup-format-full`, `hackathon-roundup-format-compact`, and `hackathon-roundup-format-regions` are separate, standalone skills the user runs directly when they want `post.md`/`post-compact.md`/`post-regions.md`. This skill never invokes them.

Parsing the raw paste is not this skill's job either — that's `hackathon-roundup-parse`, the shared step both this skill and the three text-post skills consume, so the raw text only ever gets parsed once per region.

## What the build script is

`hackathon-spotlights/build-new-roundup.js` is a generic renderer, not a per-run file to edit. Each run reads a per-run `data.js` (produced by `hackathon-roundup-parse`, see below) holding that run's event data (a `regions` array — normally just one entry now — and a `week` label). Running `node build-new-roundup.js --data=<path/to/data.js> --out=<path/to/output.html>` reads the shared card design out of `weekly-roundup-layouts.html`, plugs the data-file's event data into it, and writes the HTML at `--out`: the finished carousel (cover slide + one slide per region-page) that gets published as the review artifact and later screenshotted to PNGs by `render-pngs.js`. Nothing about the run is hand-edited into the script itself, so N regions can be built concurrently (by separate sessions or subagents) with zero shared-file writes.

The cover slide's headline is the region's event count (`TOTAL`, auto-computed from `regions`), not a generic title: `"${TOTAL} new hackathons in <region> this week"`, with `${TOTAL}` and `"this week"` both in the accent blue (`#1e96f0`). `<region>` is derived automatically: the single region's own name when `regions.length === 1` (the normal case now), or `"Europe"` otherwise. This lives in `slideCover()` in both `weekly-roundup-layouts.html` (source of truth for the card design) and `build-new-roundup.js` (its own escaped copy) — keep the two in sync if either changes. No manual edit needed for `TOTAL`, the region label, the headline font size, or the brand/copy strings: all are derived from the data file.

## When to use

The user pastes one region's raw roundup block (bold-unicode region header with flag emoji and a count like `🇩🇪🇦🇹🇨🇭 𝗗𝗔𝗖𝗛 (𝟮𝟲)`, flag-emoji country sub-headers, bulleted events) and wants that region's carousel built or refreshed, or asks to build the carousel for a region already parsed into `data.js`.

## When not to use

If the user only wants the raw text tidied into a LinkedIn post and no carousel, use `hackathon-roundup-format-full`, `hackathon-roundup-format-compact`, or `hackathon-roundup-format-regions` directly, whichever output they need — this skill does not produce or update those files.

## Stage 1 - Carousel build

Ensure `hackathon-spotlights/weekly-roundup-<published-since-date>/<region-slug>/data.js` exists for this region — if it doesn't yet (or the user just pasted fresh raw text for a region that already has one, which is a refresh request), run `hackathon-roundup-parse` first. See that skill for the region-slug rule, the `data.js` shape, and its own QA pass against the raw source — this skill doesn't re-parse or re-verify raw-source fidelity, it trusts `data.js`.

Everything that used to be hand-typed — the brand/copy strings, the headline font size, the `<meta>`/`<h1>`/intro `<p>` text, and `render-pngs.js`'s slide-name list — is derived automatically from `data.js`: the region label (the single region's own name, or `"Europe"` when `regions.length > 1`), the headline size bucket, and `window.__slideNames` all come out of `regions`/`week`. There is nothing to hand-edit or grep-to-confirm, and never edit `build-new-roundup.js`/`render-pngs.js` themselves — they stay generic and shared.

### Tags: long form (in `data.js`) to carousel short form

`data.js` holds long-form tags verbatim (`hackathon-roundup-parse`'s job) — the carousel needs the short form to fit the card. That conversion is a code-level concern now: `build-new-roundup.js` has a `LONG_TO_SHORT_TAGS` table and a `shortTag()` function, applied automatically at render time. Add a new row there (not in this doc) when a genuinely new tag category appears with no obvious short form.

### Flags

Every country `code` needs a `FLAGS` entry. All flags — the base set in `weekly-roundup-layouts.html` and every hand-added one via `extraFlags` — are real flag artwork from the [hampusborgos/country-flags](https://github.com/hampusborgos/country-flags) repo (MIT-licensed SVGs), never hand-drawn approximations, no exceptions (even "simple-looking" flags like Portugal/Spain/Slovakia carry a coat of arms a few `<rect>`s can't represent).

To add a country not yet covered:
1. Download the source file: `https://raw.githubusercontent.com/hampusborgos/country-flags/main/svg/<code>.svg` — save it to `hackathon-spotlights/flags/<code>.svg` (source-of-truth copy, kept in the repo for reuse).
2. Add it to the single-line `const FLAGS = {...}` object literal in `weekly-roundup-layouts.html` (the base set) if it's a common European country likely to recur.
3. Otherwise (a one-off for this run only), add `<code>: "flags/<code>.svg"` to this run's `data.js` under `extraFlags` — `build-new-roundup.js` reads, base64-encodes and embeds it automatically. `FLAGS.online` (the one non-country pictogram) stays hand-drawn in the script since it isn't a real flag.

Never hand-code flag geometry (bands, crosses, emblems) from memory — always fetch the real SVG.

### render-pngs.js slide names

`render-pngs.js` reads `window.__slideNames` straight from the rendered page, which `build-new-roundup.js` computes from `regions`: `cover` first, then one entry per region-page, `NN-<region-slug>[-<pageNo>]` (e.g. `01-dach-1`), matching the naming already used in published folders. No hand-maintained array.

### Run it

```
cd hackathon-spotlights
node build-new-roundup.js --data=weekly-roundup-<date>/<region-slug>/data.js --out=weekly-roundup-<date>/<region-slug>/carousel.html
```

Confirm it logs `done` and writes the HTML at `--out`.

## Stage 2 - Review artifact

Publish the generated HTML (from `--out` above) as a **new artifact** (one per region), favicon `🇪🇺`. Give the user the URL and tell them to move the share pin so viewers see the new version. Do not render PNGs at this stage; the user reviews the artifact first.

## Stage 3 - QA pass (carousel rendering only)

Write a report in chat (not a file). Raw-source fidelity (event counts, dates/cities/prices, tags carried through, country membership) was already verified by `hackathon-roundup-parse`'s own QA pass — don't re-check it here. This pass only covers how `data.js` rendered into the carousel.

### A. Carousel internals

- `window.__slideNames` length equals `cover + sum of region pages` (check the rendered page or `render-pngs.js`'s "found cards" log line).
- Every long-form tag in `data.js` resolves through `build-new-roundup.js`'s `LONG_TO_SHORT_TAGS` table to a short form; an unmapped tag passes through unchanged — flag that as worth a second look, it likely needs a new table row.
- Every country `code` has a `FLAGS` glyph (no silent empty flag box).
- The region's `codes` array lists every country that has events.
- Pagination does not leave a country header as the last line of a slide with its events pushed to the next slide.
- `week` in `data.js` is this run's actual "published since" date.

### B. no-ai-slop on the editorial copy only

Run the `no-ai-slop` skill against these strings only: the cover subline, the cover headline accent word ("this week"), the intro `<p>`, and the `<h2>`. Do **not** touch event names, cities or tags: they are verbatim data. Check for em-dashes (use a hyphen or colon), banned vocabulary, negative parallelism, and whether "this week" is accurate for the actual published-since span (flag it if the span is much longer than a week).

### C. Worth double-checking (do not auto-fix, list for the user)

- A flag newly added this run via `extraFlags` (real artwork, but worth a quick visual glance since it wasn't in the base set before).

If the user already confirmed one of these figures earlier in the conversation, do not re-flag it.

## Output contract

- The generated carousel HTML at `hackathon-spotlights/weekly-roundup-<date>/<region-slug>/carousel.html` (from a `data.js` this skill did not itself write — see `hackathon-roundup-parse`).
- `build-new-roundup.js` and `render-pngs.js` themselves are untouched.
- One new artifact URL for the region, handed to the user.
- The Stage 3 report in chat.

Stop there. PNG render is a separate step the user triggers after reviewing the artifact:

```
cd hackathon-spotlights
node render-pngs.js --html=weekly-roundup-<date>/<region-slug>/carousel.html --outdir=weekly-roundup-<date>/<region-slug>
```

`render-pngs.js` strips the review-page zoom and chrome before screenshotting (see the Playwright note in `CLAUDE.md`) and writes 2700×2700 PNGs directly into `--outdir` — no separate staging folder or manual copy step, since `--outdir` already is the region's dated folder.

## Do not touch

- Event titles, and dates as facts — those are `hackathon-roundup-parse`'s normalization job, not this skill's.
- Flag emoji.
- The deliberate long-form (`data.js`) / short-form (carousel card) tag split.
- The `--z: 1` `addInitScript` in `render-pngs.js` (Playwright zoom-repaint gotcha, see `CLAUDE.md`).
- The text post (`post.md`/`post-compact.md`/`post-regions.md`) — this skill never writes or edits those; that's `hackathon-roundup-format-full`/`-format-compact`/`-format-regions`'s job, run separately.
