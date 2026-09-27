---
name: hackathon-roundup-parse
description: "Parse one region's raw 'New hackathons' roundup paste into a structured data.js file, and run a fidelity QA pass against the raw source. This is the single shared parse step that hackathon-roundup-pipeline (carousel) and the three hackathon-roundup-format-* (text post) skills all consume instead of each re-parsing the raw paste independently. Use directly when the user just wants the region parsed without building anything yet, or let it be invoked automatically by those other skills when a region's data.js doesn't exist yet."
metadata:
  version: 1.0.0
---

# Hackathon roundup parser

Turns one region's raw roundup paste into a structured `data.js` file — the single shared representation that the carousel pipeline and all three text-post skills read, instead of each independently re-parsing the same raw text. This is the fix for a duplication problem: before this skill existed, `hackathon-roundup-pipeline` parsed the raw paste into carousel data (with manual long→short tag conversion) while each of `hackathon-roundup-format-full`/`-compact`/`-regions` separately re-applied nearly the same cleanup rules to the same text. Now there's one parse, one QA pass, and four consumers.

## When to use

- Directly: the user pastes one region's raw roundup block and just wants it parsed into `data.js` — no carousel or post file yet.
- Automatically, from `hackathon-roundup-pipeline` or the `hackathon-roundup-format-*` skills: whenever they need `<region-slug>/data.js` for a region and it doesn't exist yet, they run this skill first.

## Re-parse rule

If the user pastes raw text again for a region that already has a `data.js`, treat it as a refresh: re-run this skill, overwrite `data.js`, and re-run the QA pass below. Only skip parsing when the user references an already-parsed region without giving new raw text (e.g. "now build the carousel for the western-europe data we already have") — in that case, reuse the existing `data.js` as-is.

## Region-slug rule (canonical — other skills reference this, don't restate it)

`<region-slug>`: lowercase the region name, collapse runs of spaces/punctuation to a single hyphen, trim leading/trailing hyphens. Examples: "DACH" → `dach`, "Western Europe" → `western-europe`, "Central & Eastern Europe" → `central-eastern-europe`, "Online / Remote" → `online-remote`. This is the same slug used for that region's carousel-PNG subfolder and, since the recent per-region-subfolder change, the text-post files too.

## Output

`hackathon-spotlights/weekly-roundup-<published-since-date>/<region-slug>/data.js`, where `<published-since-date>` is the "published since" date from the post itself, formatted `YYYY-MM-DD`.

```js
module.exports = {
  week: "SINCE 21 SEP 2026",
  regions: [ /* normally a single-entry array, one raw paste = one region */ ],
  extraFlags: {}, // code -> path to an already-fetched SVG; filled in later if a new country's flag is needed (see Flags below)
};
```

### Data model

```
{ name, codes:["iso2", ...], countries:[
    { code:"iso2", name, events:[
        { name, loc, date, tags:["long form", ...], price?, perks?:["✈️ Travel", ...] }
    ]}
]}
```

**Tags stay long-form here** — exactly as they appear in the raw paste (e.g. `"Artificial Intelligence (AI)"`, not `"AI"`). Short-forming for the carousel card is a rendering concern, not a parsing one: `build-new-roundup.js` has its own `LONG_TO_SHORT_TAGS` table and converts at render time. Don't shorten, invent, merge, or drop a tag here — carry it through verbatim. If a tag looks like a typo or genuinely new category, keep it as written; noting it as unfamiliar is a Stage-QA (D) item below, not something to silently "fix."

### Cities: prefer the English exonym

Use the common English form of a city name when one exists. Known pairs so far:

| Local/native form | Use instead |
|---|---|
| Wien | Vienna |
| München | Munich |
| Nürnberg | Nuremberg |
| Antwerpen | Antwerp |
| Den Haag | The Hague |
| Torino | Turin |

Cities that stay as-is (no common English exonym, or already English): Espoo, Bergen, Maastricht, Carcavelos, Friedrichshafen, Hamburg, Berlin, Madrid, Stockholm, Dublin, Liverpool, Leeds, Manchester, Birmingham, London.

This list will grow. For any city not listed above: if it has a well-known English exonym (the way an English-language newspaper would write it), use that; otherwise keep the local spelling. Keep `loc: "Online"` for online events.

### Date ranges: plain hyphen, not en-dash

Write a date range with a plain hyphen (`"26-27 Sep"`), not a typographic en-dash (`"26–27 Sep"`) — en-dashes read as an AI-writing tell even when used correctly for a numeric range.

### Price

`"£1,000"`, `"€6,000"`, `"US$250,000"`, `"CHF 2,000"`, `"NOK 20,000"`. US dollar amounts keep the `US` prefix on the glyph (`US$250,000`, not a bare `$250,000`) since a lone `$` is ambiguous on a Europe-focused graphic — add the prefix if the source has a bare `$`. Currencies without a common single symbol keep a code + space prefix. Inside the `data.js` template literal-adjacent code a `$` must be escaped as `\$` if it ends up inside a JS template literal downstream — write the plain value here (`price:"US$250,000"`); the carousel script handles its own escaping. A bare number with no symbol or code is a gap: keep it but flag it in the QA pass (section D below).

### Perks

Carry `✈️ Travel`, `🏨 Stay`, and similar perk chips from the raw text into `perks:[...]`, in source order.

### Region grouping

Fixed set of groups: DACH, Western Europe, Northern Europe, Southern Europe, Central & Eastern Europe, Southeast Europe, plus one-off blocks (Online/Remote, Hacktoberfest, NASA Space Apps, etc.). A single raw paste is normally already scoped to one of these. North Macedonia and Türkiye are Southeast Europe.

### Flag emoji → iso2 `code`

Map each country's flag emoji to its iso2 code (🇦🇹 → `at`, 🇩🇪 → `de`, etc.) for `code`/`codes`. Every country in `codes` needs a `FLAGS` glyph at render time — that's a carousel-rendering concern owned by `hackathon-roundup-pipeline` (see its Flags section), but flag this skill's reply if you see a country code that doesn't look like it's in the base set already (`weekly-roundup-layouts.html`'s `FLAGS` object), so the carousel step knows to fetch artwork and fill `extraFlags` before building.

## QA pass (raw-source fidelity)

Report in chat (not a file). This is the one fidelity check every downstream consumer relies on — the carousel and text-post skills don't re-verify this themselves.

### A. Consistency with the raw source

- Every event in the raw paste appears in `data.js`, and nothing extra was added.
- The raw header's count `(N)` equals `data.js`'s event count equals the events you actually count.
- Every event's date, city, and price string matches the raw source (after exonym/hyphen/price normalization).
- Every tag is carried through verbatim (long-form), none dropped or added.
- Country membership under the region matches the raw source.

### D. Worth double-checking (do not auto-fix, list for the user)

- An event's date span longer than about 4 to 5 days.
- An end date earlier than the start date.
- A prize about 10x or more the rest of the batch.
- A price with no currency symbol or code (bare number).
- A perk in the raw text missing from `data.js`.
- An event title shortened or abbreviated versus the raw source.
- A country placed in a region a reader would not expect.
- A tag that doesn't look like an established category (possible typo or genuinely new one).

If the user already confirmed one of these figures earlier in the conversation, do not re-flag it.

## Do not touch

- Event titles, and dates as facts (normalize the dash and the city name only).
- Flag emoji.
- Tag wording — long-form, verbatim, never shortened here.
