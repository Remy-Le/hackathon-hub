# First-Comment Filter Links — Automation Plan

*Plan for making `hackathon-roundup-parse` generate each region's hackathonhub.eu filter links automatically, instead of Rémy pasting them by hand every week. Not yet implemented — this is the plan to implement next time this skill is touched.*

---

## 1. Problem statement

For the weekly-roundup-2026-09-21 batch, Rémy manually pasted hackathonhub.eu filter links (one master "all new events" link, 5 by-region links, and one link per country) and asked that they be appended to each region's `post.md` as a "first comment" section, plus set as the actual first-comment on the DACH post already scheduled to Buffer.

This doesn't scale:
- The links are 100% mechanical — `https://hackathonhub.eu/events?addedSince=<date>&addedUntil=<date>&country=<codes>` — derived entirely from the week's date range and each region's/country's ISO2 codes, both of which `data.js` already knows or can easily compute.
- Two of that week's 8 regions (western-europe, northern-europe) weren't scheduled to Buffer yet when the links were provided, so until they were written into `post.md`, the only record of them was chat history.
- Doing this by hand means re-deriving ~15-25 URLs per region, per week, forever.

## 2. Proposed `data.js` schema addition

Extends the shape documented in `.claude/skills/hackathon-roundup-parse/SKILL.md`:

```js
module.exports = {
  week: "SINCE 21 SEP 2026",
  addedSince: "2026-09-21",   // NEW — ISO date, from the raw paste's "published since" header
  addedUntil: "2026-09-27",   // NEW — addedSince + 6 days (weekly cadence)
  regions: [ /* existing shape — already has codes[] per region, code per country */ ],
  extraFlags: {},
};
```

## 3. Link-generation rule

Computed at parse time from `addedSince`/`addedUntil` plus each region's/country's existing `codes`/`code` fields — no new per-country data needed beyond what `data.js` already stores.

- **Master link**: `https://hackathonhub.eu/events?addedSince=<addedSince>&addedUntil=<addedUntil>` — always present.
- **Region link**: only for the 5 fixed named regions (DACH, Western Europe, Northern Europe, Southern Europe, Central & Eastern Europe) — `...&country=<region's codes, comma-joined, URL-encoded as %2C>`. One-off multi-region collections (Hacktoberfest, NASA Space Apps, etc.) get no region link — there's no single region to link to.
- **Per-country links**: one per country actually present in that `data.js`'s events, `...&country=<ISO2>`.
- **Online/Remote-type blocks** with no real country: master link only, no region or per-country links.
- **Joint multi-country events** (e.g. this week's Sofia/Birkirkara Bulgaria+Malta event): one extra combined link, codes comma-joined the same way as the region link.

## 4. New `data.js` field to store the computed result

So `hackathon-roundup-parse` computes it once and format skills just read it — matching the existing "parse once, render many times" architecture already established for the rest of `data.js`:

```js
firstComment: {
  master: "https://hackathonhub.eu/events?addedSince=2026-09-21&addedUntil=2026-09-27",
  region: "https://hackathonhub.eu/events?addedSince=2026-09-21&addedUntil=2026-09-27&country=DE%2CAT%2CCH", // or null
  countries: [
    { code: "AT", name: "Austria", url: "https://hackathonhub.eu/events?addedSince=2026-09-21&addedUntil=2026-09-27&country=AT" },
    // ...
  ],
}
```

## 5. Consumer

Only `hackathon-roundup-format-full` renders this into `post.md`'s "First comment (paste in Buffer, not part of the post)" section. The footer line itself ("All events + filter: link in the first comment 👇") is already a fixed line in that skill's "Do not touch" list. `hackathon-roundup-format-compact` and `hackathon-roundup-format-regions` are unaffected — they don't render this section.

## 6. Open questions (to confirm with Rémy before implementing)

- Is `addedUntil = addedSince + 6 days` always correct, or does it sometimes need to come from the raw paste text itself (e.g. a holiday week with a longer gap between roundups)?
- Should `hackathon-roundup-pipeline`'s Buffer-scheduling step — currently ad hoc, done via direct Buffer MCP calls rather than a skill — also read `firstComment.master`/region link to auto-set `metadata.linkedin.firstComment` when creating the Buffer post? That would close the gap hit this session: `post.md` having the link, but Buffer's actual first-comment field still needing a separate manual edit.
- No backfill needed for already-published weeks (like 2026-09-21) — those already have the links hand-written into `post.md`.
