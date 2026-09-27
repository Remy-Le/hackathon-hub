---
name: hackathon-roundup-format-full
description: "Render one region's parsed hackathon-roundup data.js into the full LinkedIn post (post.md) — bold-unicode headers, flag emoji, bulleted events per country/region. Use whenever the user pastes a raw hackathon-roundup block (or references an already-parsed region) and asks for the full/cleaned post. For the places-and-dates skim list, use hackathon-roundup-format-compact. For the region/country-counts-only summary, use hackathon-roundup-format-regions."
metadata:
  version: 2.0.0
---

# Hackathon roundup formatter — full post

## When to use this skill

Trigger when the user pastes a block of text shaped like the weekly "New hackathons in Europe" roundup, or asks for the full post for a region already parsed, and wants the full postable version.

## Input: `data.js`, not the raw paste directly

This skill renders from structured data — it doesn't parse the raw paste itself. Ensure `hackathon-spotlights/weekly-roundup-<published-since-date>/<region-slug>/data.js` exists for this region (run `hackathon-roundup-parse` first if it doesn't yet, or if the user just pasted fresh raw text for a region that already has a `data.js` — that's a refresh request). See `hackathon-roundup-parse` for the region-slug rule, the `data.js` shape, and its own fidelity QA against the raw source — city-exonym, date-hyphen, and price normalization already happened there; this skill only lays the already-normalized data out as bold-Unicode text. Rule 6 (outlier flagging) also already happened in that QA pass — no need to re-check it here.

## Output contract

Do not print the cleaned post inline in chat. Write it to one file instead:

- **Path**: `hackathon-spotlights/weekly-roundup-<published-since-date>/<region-slug>/post.md` for a **single-region `data.js`** (the normal case now) — the same per-region subfolder that region's carousel PNGs live in (see `CLAUDE.md`/`hackathon-roundup-pipeline`), so multiple regions in the same week never collide on a shared `post.md`. If `data.js`'s `regions` array has more than one entry (a full multi-region/pan-Europe parse), there's no single region to slug: write to the flat dated-folder root instead, `hackathon-spotlights/weekly-roundup-<published-since-date>/post.md`, matching the same single-vs-multi branch in Rule 10 below.
- **Content**: the rendered post as plain text (no markdown formatting — the bold/flags are Unicode characters, not markdown), structured regions → countries → events, footer, hashtags. The title line leads with the week's total hackathon count — see Rule 10.
- **Reply to the user**: a short confirmation with the file path written, not a copy of the full text.

## Rendering rules

### Region and country headers

Region header: flag emoji for every code in the region's `codes` (each iso2 code → its regional-indicator-symbol flag emoji pair, e.g. `at` → 🇦🇹), then the bold region name, then the event count in parens: `🇩🇪🇦🇹🇨🇭 𝗗𝗔𝗖𝗛 (𝟮𝟲)`. Country sub-header: that country's flag emoji, then its bold name: `🇦🇹 𝗔𝘂𝘀𝘁𝗿𝗶𝗮`.

### Bullets and blank-line spacing

Every event line starts with `•`. Layout:
- Exactly one blank line before each event entry (i.e., between one event's location/date/tags line and the next event's bullet line).
- One blank line between a country's last event and the next country or region header.
- No blank line between an event's bold name line and its `Location · Date · Tags` line directly beneath it — those two lines stay glued together.

```
• Event One
Vienna · 22 Sep

• Event Two
Vienna · 26-27 Sep
```

### Tags

Join every tag in the event's `tags` array with ` · `, in long form exactly as stored in `data.js` (e.g. "Artificial Intelligence (AI)", "Developer Tools / DX") — `data.js` already holds the long form verbatim, nothing to convert here. A separate short-tag form is used only by the carousel (`build-new-roundup.js`'s own conversion at render time) — out of scope for this skill.

### Price

Render `price` exactly as stored in `data.js` (already normalized: single-glyph currencies like `£`/`€` directly before the number, US dollar as `US$`, others as a code + space prefix), preceded by the 💰 emoji.

## Rule 10 — Title line: lead with the total hackathon count

The title line at the top of `post.md` leads with the week's total event count instead of the generic word "New":

`𝟰𝟴 𝗻𝗲𝘄 𝗵𝗮𝗰𝗸𝗮𝘁𝗵𝗼𝗻𝘀 𝗶𝗻 𝗘𝘂𝗿𝗼𝗽𝗲 · 𝗽𝘂𝗯𝗹𝗶𝘀𝗵𝗲𝗱 𝘀𝗶𝗻𝗰𝗲 𝟭𝟰 𝗦𝗲𝗽 𝟮𝟬𝟮𝟲, 𝟬𝟬:𝟬𝟬`

not

`𝗡𝗲𝘄 𝗵𝗮𝗰𝗸𝗮𝘁𝗵𝗼𝗻𝘀 𝗶𝗻 𝗘𝘂𝗿𝗼𝗽𝗲 · 𝗽𝘂𝗯𝗹𝗶𝘀𝗵𝗲𝗱 𝘀𝗶𝗻𝗰𝗲 𝟭𝟰 𝗦𝗲𝗽 𝟮𝟬𝟮𝟲, 𝟬𝟬:𝟬𝟬`

The count is the sum of every region's event count (from `data.js`), rendered in the same bold Mathematical Sans-Serif digit style as the rest of the title. The whole title line stays entirely bold (this rule only changes "New" → "<count> new", it doesn't touch the bold styling of the title itself). This mirrors the same "lead with the count" treatment already used on the companion carousel's cover slide, for consistency across this week's deliverables.

**Single-region `data.js`**: if `regions.length === 1`, swap "Europe" in the title for that region's own name instead, still in the same bold Mathematical Sans-Serif style, and use that region's own event count (not a Europe-wide total, since there isn't one):

`𝟰𝟲 𝗻𝗲𝘄 𝗵𝗮𝗰𝗸𝗮𝘁𝗵𝗼𝗻𝘀 𝗶𝗻 𝗪𝗲𝘀𝘁𝗲𝗿𝗻 𝗘𝘂𝗿𝗼𝗽𝗲 · 𝗽𝘂𝗯𝗹𝗶𝘀𝗵𝗲𝗱 𝘀𝗶𝗻𝗰𝗲 𝟮𝟭 𝗦𝗲𝗽 𝟮𝟬𝟮𝟲, 𝟬𝟬:𝟬𝟬`

not

`𝟰𝟲 𝗻𝗲𝘄 𝗵𝗮𝗰𝗸𝗮𝘁𝗵𝗼𝗻𝘀 𝗶𝗻 𝗘𝘂𝗿𝗼𝗽𝗲 · 𝗽𝘂𝗯𝗹𝗶𝘀𝗵𝗲𝗱 𝘀𝗶𝗻𝗰𝗲 𝟮𝟭 𝗦𝗲𝗽 𝟮𝟬𝟮𝟲, 𝟬𝟬:𝟬𝟬`

If the region name spans multiple words (e.g. "Western Europe", "Southern Europe"), bold both words the same way the region header itself is bolded.

## Do not touch

Preserve verbatim in `post.md` (the primary output):
- The bold Unicode "sans-serif bold" styling of headers, region names, country names, and event titles.
- All flag emoji.
- The region header format and structure: `🇩🇪🇦🇹🇨🇭 𝗗𝗔𝗖𝗛 (𝟳)`.
- The footer line ("All events + filter: link in the first comment 👇") and the hashtags line.
- The actual event names, dates, locations, and tags — they're already-normalized data from `data.js`, never rewrite or abbreviate them here.
