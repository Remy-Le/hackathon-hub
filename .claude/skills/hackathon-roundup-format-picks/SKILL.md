---
name: hackathon-roundup-format-picks
description: "Render one region's parsed hackathon-roundup data.js into the short 'curated 3 picks' LinkedIn post (post-picks.md): plain-text headline with the region's event count, the top 3 events picked by a fixed automatic rule, footer pointing to the first comment. Use when the user asks for the picks / '3 picks' / short curated format for a region. For the full post, use hackathon-roundup-format-full. For the places-and-dates skim list, use hackathon-roundup-format-compact. For the region/country-counts-only summary, use hackathon-roundup-format-regions."
metadata:
  version: 1.0.0
---

# Hackathon roundup formatter — picks

## When to use this skill

Trigger when the user wants the short "3 picks" version of a region already parsed (about 300-450 characters, plain text, no region/country headers). Origin: in the Oct 2026 LinkedIn analytics, curated "3 picks" posts out-reached full-listing posts for the same region (Southern Europe 935 vs 813, Central & Eastern Europe 725 vs 338 impressions), so this format exists to test that on more regions.

Only worth using on a region with **4 or more events** — with 3 or fewer, the picks are the whole list and the test is meaningless; keep the base format there.

## Input: `data.js`, not the raw paste directly

Renders from `hackathon-spotlights/weekly-roundup-<published-since-date>/<region-slug>/data.js` (run `hackathon-roundup-parse` first if missing). Normalization (city exonyms, date hyphens, prices) already happened there.

## Output contract

Write `post-picks.md` to the same per-region folder as `post.md` and the carousel PNGs (flat dated-folder root only for a multi-region `data.js`). Do not print the post inline; reply with the path, the 3 picks chosen, and the UTF-16 length.

## Rule 1 — Pick the 3 events automatically

Rank every event in the region, in this order, and take the top 3:
1. Highest prize (`price`). Compare numerically after rough conversion to euros (US$ and £ ≈ 1 : 1 with €, CHF ≈ 1 : 1; this is a ranking aid, not displayed). Events without a price rank below every event with one.
2. More `perks` (✈️ Travel, 🏨 Stay, 🖥️ Online) ranks higher.
3. Soonest date.

Show the picks in rank order, numbered `1)`, `2)`, `3)`. In the reply, tell the user if a pick looks odd (e.g. an event more than 6 months away) so they can swap it — the rule is automatic, but the user can override.

## Rule 2 — Post layout (plain text, no bold Unicode)

```
<Region> just got <N> new hackathons.
Here are our 3 picks:

1) <event name>
<loc> · <date>
<price> prize
<perks, if any, joined with " · ">

2) ...

3) ...

All events + filter: link in the first comment 👇
```

- `<N>` is the sum of the region's event counts (the true total, not 3).
- Headline and event names are plain ASCII/Unicode text — never Mathematical Sans-Serif Bold (this follows the Oct 7 posts that performed well, and keeps the format test from changing two things at once).
- Omit the price line when the event has no `price`; omit the perks line when it has no `perks`.
- No flags, no region/country headers, no hashtags, no category tags.
- Do not abbreviate or rewrite event names, cities or dates.

## Rule 3 — First comment

Append the same human-readable section as `post.md` below the post, headed `First comment (paste in Buffer, not part of the post):`, with the region link only:

`https://hackathonhub.eu/events?addedSince=<YYYY-MM-DD>&addedUntil=<addedSince + 6 days>&country=<CODES>&utm_source=linkedin&utm_medium=social&utm_campaign=roundup-picks`

`<CODES>` are the region's `codes` upper-cased and comma-joined, with the comma URL-encoded as `%2C`. The `utm_campaign` is `roundup-picks` here and `roundup-full` on the base-format posts, so clicks can be compared between formats. Confirm with the user that the site accepts the extra UTM parameters before the first scheduling.

## Rule 4 — Length

LinkedIn counts UTF-16 units. A picks post is far under the 3,000 cap; still measure `text.length` of the post portion (excluding the first-comment section) and report it.

## Do not touch

The footer line `All events + filter: link in the first comment 👇`, event names, cities, dates and prices as given by `data.js`.
