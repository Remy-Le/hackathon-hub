---
name: hackathon-roundup-pipeline
description: "Run the full weekly 'New hackathons in Europe' pipeline from one pasted raw roundup: produce both deliverables (cleaned LinkedIn text post AND the 1350x1350 carousel), publish the carousel as a review artifact, then run a consistency / no-ai-slop / double-check QA pass across both. Use when the user pastes a new week's raw roundup and wants the carousel built or updated, or says 'new roundup', 'new week', 'build the carousel', 'run the roundup pipeline', 'update the roundup'. For a text-post-only cleanup with no carousel, use hackathon-roundup-format instead."
metadata:
  version: 1.0.0
---

# Hackathon roundup pipeline

Orchestrates the weekly roundup. It calls two other skills as sub-steps (`hackathon-roundup-format` for the text, `no-ai-slop` for the copy) and drives the carousel build scripts. It does not re-derive their rules.

## What the build script is

`hackathon-spotlights/build-new-roundup.js` is a small Node file that holds one week's event data (the `REGIONS` array and a `WEEK` label). Running `node build-new-roundup.js` reads the shared card design out of `weekly-roundup-layouts.html`, plugs the event data into it, and writes `weekly-roundup-new.html`: the finished carousel (cover slide + one slide per region) that gets published as the review artifact and later screenshotted to PNGs by `render-pngs.js`.

## When to use

The user pastes a block shaped like the weekly roundup (bold-unicode region headers with flag emoji and a count like `🇩🇪🇦🇹🇨🇭 𝗗𝗔𝗖𝗛 (𝟭𝟲)`, flag-emoji country sub-headers, bulleted events) and wants the carousel built or refreshed for that week.

## When not to use

If the user only wants the raw text tidied and no carousel, use `hackathon-roundup-format` directly. This skill is for a full week's run of both deliverables.

## Stage 1 - Text post

Invoke the `hackathon-roundup-format` skill on the raw text. It writes `hackathon-spotlights/weekly-roundup-<published-since-date>/post.md` and derives `<published-since-date>` (e.g. "published since 31 Aug" in 2026 -> `2026-08-31`). That date is the dated-folder key for the whole week; reuse it in Stage 3.

## Stage 2 - Carousel build

Parse the *same* raw text into the `REGIONS` shape and edit `hackathon-spotlights/build-new-roundup.js` **in place** (do not copy it to a dated file). Update:

- `REGIONS` - the week's events.
- `WEEK` - e.g. `"SINCE 6 SEP 2026"`.
- The three date-bearing copy strings: the `<meta name="description">` "since X" date, the `<h1>` if it names a date, and the intro `<p>` "published since X" date plus its list of region names. The `<title>` has no date.
- `hackathon-spotlights/render-pngs.js` - the `names` array (see below).

### Data model

```
{ name, codes:["iso2", ...], countries:[
    { code:"iso2", name, events:[
        { name, loc, date, tags:["short", ...], price?, perks?:["✈️ Travel", ...] }
    ]}
]}
```

### Tags: long form to carousel short form

The text post keeps long-form tags; the carousel uses short forms to fit the card. This mapping is the source of truth (`hackathon-roundup-format` Rule 5 points here). Every raw tag must resolve to exactly one short tag. If a raw tag is not in this table and has no obvious short form, stop and ask the user rather than guessing.

| Long form (post) | Short form (carousel) |
|---|---|
| Artificial Intelligence (AI) | AI |
| Developer Tools / DX | Dev Tools |
| Internet of Things (IoT) | IoT |
| Data Science & Analytics | Data Science |
| Robotics & Autonomous Systems | Robotics |
| HealthTech / Digital Health | HealthTech |
| Industry 4.0 / Smart Manufacturing | Industry 4.0 |
| API & Platform Engineering | API & Platform Eng |
| DevOps & Cloud Computing | DevOps & Cloud |
| SpaceTech / Aerospace | SpaceTech |
| NeuroTech / Neuroinformatics | NeuroTech |
| Accessibility & Assistive Tech | Accessibility |
| GovTech / Public Sector | GovTech |
| MarTech / AdTech | MarTech |
| Mobility & Transportation | Mobility |
| Digital Identity & Privacy | Digital Identity |
| Gaming & Game Development | Gaming |

Pass through unchanged (long form == short form): FinTech, Blockchain, Web3, Open Source, Social Impact, Sustainability, Smart Cities, Energy Systems, Cybersecurity, HRTech, ClimateTech, Bioinformatics, Digital Humanities, Reproducible Research.

Add new rows here when a new tag appears.

### Cities

Same as `hackathon-roundup-format` Rule 3: use the English exonym (Wien -> Vienna, München -> Munich, Скопје -> Skopje, and so on). Keep `loc: "Online"` for online events.

### Date ranges

Plain hyphen, not en-dash, in `date:` values too (`"26-27 Sep"`, not `"26–27 Sep"`). The PNGs are reader-facing, so the same reasoning as `hackathon-roundup-format` Rule 3b applies.

### Price

Carry the exact string the formatted `post.md` uses (`hackathon-roundup-format` Rule 4 form): `"£1,000"`, `"€6,000"`, `"$250,000"`, `"CHF 2,000"`, `"NOK 20,000"`. Inside the JS template literal a `$` must be written `\$` (`price:"\$250,000"`). A bare number with no symbol or code (`price:"1,000"`) is a gap: keep it but flag it in Stage 4.

### Perks

Carry `✈️ Travel`, `🏨 Stay`, and similar perk chips from the raw text into `perks:[...]`, in source order. Missing a perk that the raw text has is a Stage 4 finding.

### Region grouping

Fixed set of groups: DACH, Western Europe, Northern Europe, Southern Europe, Central & Eastern Europe, Southeast Europe. Put a new country in the geographically correct existing group. North Macedonia and Türkiye are Southeast Europe. Do not create a one-country group unless nothing fits, and flag it in Stage 4 if you do.

### Flags

Every country `code` needs a `FLAGS` entry. The base set (about 20 European countries) comes from `weekly-roundup-layouts.html`. Anything missing needs a hand-added line in `build-new-roundup.js` right after the `${flagsLine}` injection. Two ways:

- **Simple flags** (bands, a cross): inline SVG shapes, e.g. `FLAGS.xx = '<rect width="3" height="2" fill="..."/>...';`
- **Detailed flags** (a sun with rays, a crescent and star, a coat of arms): a trimmed raster embedded as a data URI, which matches the real flag exactly:
  `FLAGS.xx = '<image x="0" y="0" width="3" height="2" preserveAspectRatio="none" href="data:image/png;base64,..."/>';`
  Save the source PNG to `hackathon-spotlights/flags/<code>.png`, trim any transparent border to the flag's bounding box (a short Chromium/canvas script, since there is no image lib installed), base64 it, and inject. `FLAGS.mk` (North Macedonia) and `FLAGS.tr` (Türkiye) are done this way; use them as the pattern.

Flag `<image>` data URIs add ~30-40KB each to `weekly-roundup-new.html`; that is fine. Note in the Stage 4 report which flags are hand-added and whether each is an exact raster or an approximate SVG.

### render-pngs.js names array

Rewrite `names` so it is index-matched to the rendered slides: `cover` first, then one entry per region-page. A region's page count is `ceil(region event count / MAX_EVENTS_PER_SLIDE)` where `MAX_EVENTS_PER_SLIDE = 4`. Naming: `NN-<region-slug>[-<pageNo>]`, e.g. `05-western-europe-1`. A shorter array is tolerated (the script falls back to `slide-NN`) but keep it complete.

### Run it

```
cd hackathon-spotlights && node build-new-roundup.js
```

Confirm it logs `done` and rewrites `weekly-roundup-new.html`.

## Stage 3 - Review artifact

Publish `hackathon-spotlights/weekly-roundup-new.html` as a **new artifact** (one per week), favicon `🇪🇺`. Give the user the URL and tell them to move the share pin so viewers see the new version. Do not render PNGs at this stage; the user reviews the artifact first.

## Stage 4 - QA pass

Write a report in chat (not a file). Group the findings, most-consequential first. Apply A, B and C fixes only after the user confirms; leave D for the user.

### A. Cross-deliverable consistency (post.md vs carousel)

- Same event set in both.
- Each region header count `(N)` in `post.md` equals the carousel region's event count equals the events you actually count.
- Every event's date, city and price string is identical between the two.
- Every long-form tag in `post.md` resolves through the tag table to a short-form tag in the carousel, and none is dropped or added.
- Region membership is the same in both.

### B. Carousel internals

- `render-pngs.js` `names` length equals `cover + sum of region pages`.
- Every country `code` has a `FLAGS` glyph (no silent empty flag box).
- Each region's `codes` array lists every country that has events that week.
- Pagination does not leave a country header as the last line of a slide with its events pushed to the next slide.
- `WEEK` and all date-bearing copy strings are bumped to this week.

### C. no-ai-slop on the editorial copy only

Run the `no-ai-slop` skill against these strings only: the cover subline, the cover headline accent word ("this week"), the intro `<p>`, and the `<h2>`. Do **not** touch event names, cities or tags: they are verbatim data, same "Do not touch" logic as `hackathon-roundup-format`. Check for em-dashes (use a hyphen or colon), banned vocabulary, negative parallelism, and whether "this week" is accurate for the actual published-since span (flag it if the span is much longer than a week).

### D. Worth double-checking (do not auto-fix, list for the user)

- An event's date span longer than about 4 to 5 days.
- An end date earlier than the start date.
- A prize about 10x or more the rest of the batch.
- A price with no currency symbol or code (bare number).
- "US$" in the raw text rendered as a bare "$" in the carousel (ambiguous on a Europe graphic).
- A perk in the raw text missing from the carousel.
- An event title shortened or abbreviated versus the raw source.
- A hand-added (approximate) flag.
- A one-country region group.
- A country placed in a region a reader would not expect.

If the user already confirmed one of these figures earlier in the conversation, do not re-flag it.

## Output contract

- `post.md` written by `hackathon-roundup-format`.
- `build-new-roundup.js` and `render-pngs.js` edited in place.
- `weekly-roundup-new.html` regenerated.
- One new artifact URL for the week, handed to the user.
- The Stage 4 report in chat.

Stop there. PNG render is a separate step the user triggers after reviewing the artifact:

```
cd hackathon-spotlights && node render-pngs.js
```

`render-pngs.js` strips the review-page zoom and chrome before screenshotting (see the Playwright note in `CLAUDE.md`); it writes 2700×2700 PNGs to `weekly-roundup-new-pngs/` (gitignored). Copy the finished set into `hackathon-spotlights/weekly-roundup-<published-since-date>/` (same folder as `post.md`), replacing any earlier render for that week.

## Do not touch

- Event titles, and dates as facts (normalize the dash and the city name only).
- Flag emoji in the text post.
- The deliberate long-form / short-form tag split between the two deliverables.
- The `--z: 1` `addInitScript` in `render-pngs.js` (Playwright zoom-repaint gotcha, see `CLAUDE.md`).
