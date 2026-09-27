---
name: hackathon-roundup-format-regions
description: "Render one region's parsed hackathon-roundup data.js into the region/country-counts-only structural summary (post-regions.md), with no individual events listed. Use whenever the user pastes a raw hackathon-roundup block (or references an already-parsed region) and asks for the region breakdown, country counts, or structural summary. For the full post, use hackathon-roundup-format-full. For the places-and-dates skim list, use hackathon-roundup-format-compact."
metadata:
  version: 2.0.0
---

# Hackathon roundup formatter — regions summary

## When to use this skill

Trigger when the user pastes a block of text shaped like the weekly "New hackathons in Europe" roundup, or asks for the regions summary for a region already parsed, and wants the region/country-counts summary or structural breakdown, with no individual events.

## Input: `data.js`, not the raw paste directly

This skill renders from structured data — it doesn't parse the raw paste itself. Ensure `hackathon-spotlights/weekly-roundup-<published-since-date>/<region-slug>/data.js` exists for this region (run `hackathon-roundup-parse` first if it doesn't yet, or if the user just pasted fresh raw text for a region that already has a `data.js` — that's a refresh request). See `hackathon-roundup-parse` for the region-slug rule, the `data.js` shape, and its own fidelity QA against the raw source. Since this output is just counts, most of that normalization (cities, dates, prices, tags) is irrelevant here anyway — only event counts per country/region matter, which is just `.length` on the already-structured data.

## Output contract

Do not print the summary inline in chat. Write it to a file instead, in the same dated folder used for that week's other deliverables:

- **Path**: `hackathon-spotlights/weekly-roundup-<published-since-date>/<region-slug>/post-regions.md` for a **single-region `data.js`** (the normal case now, see `hackathon-roundup-parse` for the region-slug rule) — the same per-region subfolder that region's carousel PNGs live in (see `CLAUDE.md`/`hackathon-roundup-pipeline`), so multiple regions in the same week never collide on a shared `post-regions.md`. If `data.js`'s `regions` array has more than one entry (a full multi-region/pan-Europe parse), there's no single region to slug: write to the flat dated-folder root instead, `hackathon-spotlights/weekly-roundup-<published-since-date>/post-regions.md`.
- **Content**: just the region/country structure with hackathon counts, no individual events — see Rule 8 below.
- **Reply to the user**: a short confirmation with the file path written, not a copy of the full text.

## Rule 8 — `post-regions.md`: region → country → count, no events

`post-regions.md` is a structural summary.

For each region: flag emoji for every code in `codes`, bold region name, bold total event count in parens — `🇩🇪🇦🇹🇨🇭 𝗗𝗔𝗖𝗛 (𝟯𝟰)`. Under it, one line per country: that country's flag emoji + bold country name + bold event count in parens (`countries[i].events.length`), e.g. `🇦🇹 𝗔𝘂𝘀𝘁𝗿𝗶𝗮 (𝟯)`. No bullets, no event names, dates, tags, or chips.

For a region made up of non-country events (e.g. "Online / Remote"), don't add a separate country-style line under it — the region header's own count is enough, since there's no real country to name.

One blank line between regions; no blank line between a region header and its first country line, or between consecutive country lines. No footer, no hashtags — this file is an internal structural view, not something meant to be posted as-is.

Every country's count must sum to its region's total. Cross-check this before writing the file — it should always hold since both come from the same `data.js`, but a mismatch means something's wrong with the data, not just the summary.

## Rule 10 — Title line: lead with the total hackathon count

The title line at the top of `post-regions.md` leads with the week's total event count instead of the generic word "New":

`𝟰𝟴 𝗻𝗲𝘄 𝗵𝗮𝗰𝗸𝗮𝘁𝗵𝗼𝗻𝘀 𝗶𝗻 𝗘𝘂𝗿𝗼𝗽𝗲 · 𝗽𝘂𝗯𝗹𝗶𝘀𝗵𝗲𝗱 𝘀𝗶𝗻𝗰𝗲 𝟭𝟰 𝗦𝗲𝗽 𝟮𝟬𝟮𝟲, 𝟬𝟬:𝟬𝟬`

not

`𝗡𝗲𝘄 𝗵𝗮𝗰𝗸𝗮𝘁𝗵𝗼𝗻𝘀 𝗶𝗻 𝗘𝘂𝗿𝗼𝗽𝗲 · 𝗽𝘂𝗯𝗹𝗶𝘀𝗵𝗲𝗱 𝘀𝗶𝗻𝗰𝗲 𝟭𝟰 𝗦𝗲𝗽 𝟮𝟬𝟮𝟲, 𝟬𝟬:𝟬𝟬`

The count is the sum of every region's event count (from `data.js`), rendered in the same bold Mathematical Sans-Serif digit style as the rest of the title. This mirrors the same "lead with the count" treatment already used on the companion carousel's cover slide, for consistency across this week's deliverables.

## Do not touch

- The actual event counts as facts — never round or approximate a country/region count.
- All flag emoji, exactly as given.
- The bold Unicode styling of region names, country names, and counts.
- The region header format and structure: `🇩🇪🇦🇹🇨🇭 𝗗𝗔𝗖𝗛 (𝟳)`.
