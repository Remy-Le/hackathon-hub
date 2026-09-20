---
name: hackathon-roundup-format
description: "Standardize the raw 'New hackathons in Europe' weekly LinkedIn roundup post (bold-unicode headers, flag emoji, bulleted events per country/region) into a clean, consistent version. Use whenever the user pastes this exact style of raw hackathon-roundup text and asks to clean up, standardize, or uniformize it — fixing bullet symbols, blank-line spacing, city names, and price/currency formatting per the rules below."
metadata:
  version: 1.0.0
---

# Hackathon roundup formatter

## When to use this skill

Trigger when the user pastes a block of text shaped like the weekly "New hackathons in Europe" roundup — bold-unicode region headers with flag emoji and an event count (`🇩🇪🇦🇹🇨🇭 𝗗𝗔𝗖𝗛 (𝟳)`), flag-emoji country sub-headers, and bulleted event blocks (bold event name line, then a `Location · Date · Tag · Tag` line) — and asks to clean up, standardize, or uniformize it.

## Output contract

Do not print the cleaned post inline in chat. Write it to three files instead,
all in the same dated folder:

- **Path**: `hackathon-spotlights/weekly-roundup-<published-since-date>/post.md`, where `<published-since-date>` is the "published since" date from the post itself, formatted `YYYY-MM-DD` (e.g. a post reading "published since 31 Aug" in 2026 → `weekly-roundup-2026-08-31/post.md`). This is the same dated folder used for that week's carousel PNGs (see the repo's `CLAUDE.md` for the full weekly-roundup pipeline) — the text post and the visual carousel for a given week live together in one folder. Create the folder if it doesn't exist yet.
- **Content**: the cleaned post as plain text (no markdown formatting added — the bold/flags are already Unicode characters in the source, not markdown), preserving the overall structure (regions → countries → events, footer, hashtags). The title line leads with the week's total hackathon count — see Rule 10.
- **Second file — `post-compact.md`** in the same folder: an exact copy of `post.md` except every event's `Location · Date · Tag · Tag · ...` line is trimmed to just `Location · Date`, plus any of these special chips that are present, in their original order: 💰 price, 🏨 Stay, 🖥️ Online, ✈️ Travel. Category tags (e.g. "Artificial Intelligence (AI)", "FinTech") are dropped from this version; headers, region/country counts, bullets, blank-line spacing, footer, and hashtags stay identical to `post.md`, but event name lines are de-bolded to plain text (region and country names stay bold). See Rule 7 below.
- **Third file — `post-regions.md`** in the same folder: just the region/country structure with hackathon counts, no individual events. See Rule 8 below.
- **Conditional extra file — `post-compact-single.md`** in the same folder, only when `post-compact.md` exceeds LinkedIn's 3,000-character limit: a single always-postable version that shows as many full events as fit (in original order) plus a "+N more" line. See Rule 9 below.
- **Reply to the user**: a short confirmation with all file paths written, not a copy of the full text. If Rule 6 below applies (an outlier duration or prize), add that as a one-line flag in the reply — not inside any file. If Rule 9 applies, say how many of the week's events made it into `post-compact-single.md` and its character count.

## Rule 1 — Bullets

Every event line starts with `•`. Never mix in `-` or other bullet characters, even if the source does.

## Rule 2 — Blank-line spacing

- Exactly one blank line before each event entry (i.e., between one event's location/date/tags line and the next event's bullet line).
- One blank line between a country's last event and the next country or region header.
- No blank line between an event's bold name line and its `Location · Date · Tags` line directly beneath it — those two lines stay glued together.

Before/after example:
```
• Event One
Vienna · 22 Sep
- Event Two          ← wrong bullet, no blank line
Wien · 26-27 Sep
```
becomes:
```
• Event One
Vienna · 22 Sep

• Event Two

Vienna · 26-27 Sep
```
(second example also applies Rule 3 below to fix "Wien" → "Vienna")

## Rule 3 — City names: prefer the English exonym

Use the common English form of a city name when one exists. Known pairs seen so far:

| Local/native form | Use instead |
|---|---|
| Wien | Vienna |
| München | Munich |
| Nürnberg | Nuremberg |
| Antwerpen | Antwerp |
| Den Haag | The Hague |
| Torino | Turin |

Cities that stay as-is (no common English exonym, or already English): Espoo, Bergen, Maastricht, Carcavelos, Friedrichshafen, Hamburg, Berlin, Madrid, Stockholm, Dublin, Liverpool, Leeds, Manchester, Birmingham, London.

This list will grow. For any city not listed above, apply the same logic: if it has a well-known English exonym (the way an English-language newspaper would write it), use that; otherwise keep the local spelling.

## Rule 3b — Date ranges: plain hyphen, not en-dash

Write a date range with a plain hyphen (`26-27 Sep`), not a typographic en-dash (`26–27 Sep`). En-dashes read as an AI-writing tell to readers even when used correctly for a numeric range, so this project standardizes on the hyphen everywhere in this post format.

## Rule 4 — Price/currency formatting

- Currencies with one common single-glyph symbol get that symbol immediately before the number, with no letter-code prefix: `£1,000`, `€6,000` — except the US dollar, which keeps the `US` prefix on the glyph (`US$250,000`, not `$250,000` or `USD 250,000`), since a bare `$` on a Europe-focused post is ambiguous (could read as any dollar currency, or even loosely as euros). If the source already writes `US$...`, keep it that way; if the source writes a bare `$` for a dollar amount, add the `US` prefix.
- Currencies without a common single symbol keep a code + space prefix: `NOK 20,000`, `SEK 15,000`, `DKK 10,000`.
- Keep the 💰 emoji exactly where the source has it, immediately before the price.

## Rule 5 — Tag naming

Keep tags in the long form already used in this post style (e.g. "Artificial Intelligence (AI)", "Developer Tools / DX", "HealthTech / Digital Health", "Data Science & Analytics", "Robotics & Autonomous Systems"). Do not shorten, invent, merge, or drop tags — just carry them through, separated by ` · `.

Note: a separate short-tag form (e.g. "AI", "Dev Tools") is used only in the companion visual/carousel artifact pipeline for this same weekly content — that is a different deliverable and out of scope here. This skill only formats the raw text post.

## Rule 6 — Flag outliers, don't silently alter them

Do not change or "fix" the underlying facts. If you notice:
- an event's date span longer than ~4–5 days (most hackathons run 1–3 days), or
- a prize amount far outside the rest of the batch (e.g. 10x+ the next-highest prize),

leave the number as given, but add one short line after the cleaned post flagging it for the user to double-check — unless the user has already confirmed that exact figure earlier in the conversation, in which case say nothing.

## Rule 7 — `post-compact.md`: strip category tags, keep special chips

`post-compact.md` is a places-and-dates-only skim version, derived from the
already-cleaned `post.md` (apply Rules 1-6 first, then derive the compact file
from the result — don't clean it separately).

On each event's second line, keep only the location, the date, and any of
these chips that appear, in their original order and exact formatting:
- 💰 price (per Rule 4)
- 🏨 Stay
- 🖥️ Online
- ✈️ Travel

Drop every category tag (long-form tag text). If an event line has no chips,
it ends right after the date, e.g. `Bari · 1 Oct`. If it has chips, e.g.
`Vallendar · 25-26 Sep · 💰 €5,000 · 🏨 Stay`.

One more difference from `post.md`: event name lines (the `•` line) are
converted from the Mathematical Sans-Serif Bold Unicode styling to plain
ASCII text — `• Legal Hackathon`, not `• 𝗟𝗲𝗴𝗮𝗹 𝗛𝗮𝗰𝗸𝗮𝘁𝗵𝗼𝗻`. Region headers
(`🇩🇪🇦🇹🇨🇭 𝗗𝗔𝗖𝗛 (𝟭𝟴)`) and country headers (`🇦🇹 𝗔𝘂𝘀𝘁𝗿𝗶𝗮`) keep their bold
styling — only the event name itself drops it, since at skim-list density the
bold weight on every single title added visual noise without adding
information the region/country level doesn't already carry. Converting is a
straight per-character mapping back from the bold-letter/bold-digit Unicode
ranges (capitals U+1D5D4-U+1D5ED, lowercase U+1D5EE-U+1D607, digits
U+1D7EC-U+1D7F5) to plain ASCII — everything else in the name (flags,
punctuation, symbols like `×` or `@`) is already plain and passes through
unchanged.

Do not touch anything else: bullets, headers, region/country counts,
blank-line spacing, footer, and hashtags are identical between the two files.

## Rule 8 — `post-regions.md`: region → country → count, no events

`post-regions.md` is a structural summary, derived from the already-cleaned
`post.md` (apply Rules 1-6 first, then derive this file from the result).

Keep the header line and every region header exactly as in `post.md` (flag
emoji, bold region name, bold total count in parens). Under each region,
replace the country sub-headers + bulleted events with one line per country:
flag emoji + bold country name + bold hackathon count in parens, e.g.
`🇦🇹 𝗔𝘂𝘀𝘁𝗿𝗶𝗮 (𝟯)`. No bullets, no event names, dates, tags, or chips.

If a region has no country sub-headers in `post.md` (events listed directly
under the region), still break its events out by country here — count how
many events belong to each country and list each as its own line, the same as
regions that do have sub-headers. Don't skip this step just because the
source didn't need it.

For a region made up of non-country events (e.g. "Online / Remote"), don't
add a separate country-style line under it — the region header's own count is
enough, since there's no real country to name.

One blank line between regions; no blank line between a region header and its
first country line, or between consecutive country lines. No footer, no
hashtags — this file is an internal structural view, not something meant to
be posted as-is.

Every country's count must sum to its region's `(N)`. Cross-check this before
writing the file.

## Rule 9 — LinkedIn's 3,000-character limit: `post-compact-single.md` always fits in one post

LinkedIn's post limit is 3,000 characters, counted as UTF-16 code units (like JavaScript's `.length`) — every bold-unicode character (used throughout this post format: headers, region/country names, event names) costs 2 units instead of 1, same for flag emoji. Don't count with a plain `wc -m`/byte or codepoint count — it under-reports badly. Measure the real length with `[...text].length` for codepoints as a sanity check, but treat `text.length` (UTF-16 units) as the number that matters, since it's the stricter and more likely one LinkedIn's own counter uses.

Stripping the bold styling does **not** reliably fix this — for a heavy week (40+ events) even a plain-text version can still exceed 3,000 codepoints. The actual driver is event count, which varies week to week. **This has to be exactly one LinkedIn post, always** — never split across multiple posts. So when the full list doesn't fit, cut content, not posts.

After writing `post-compact.md`, measure its length (UTF-16 units). If it's ≤ 2,900 (a safety margin under the 3,000 cap), `post-compact.md` is postable as-is and no further file is needed.

If it's over 2,900, write one more file, **`post-compact-single.md`**, in the same dated folder — the actual thing that gets posted to LinkedIn that week:

- Walk events in their existing region → country order (same order as `post-compact.md`) and keep adding full event blocks (name + location/date/chips, exactly as in `post-compact.md`, including the blank-line spacing rules) for as long as the running total stays under the 2,900-unit budget, reserving room for the cutoff line and footer as you go.
- Stop as soon as the next event wouldn't fit. Region and country headers are only included if at least one of their events made it in; a region or country header's own count (e.g. `(𝟭𝟲)`) is **not** adjusted down to match a partial list under it — leave it as the true weekly total, per Rule 8's counts, even if the post itself only shows some of that region's events. This is a known, accepted tradeoff: which events make the cut is not editorially curated, it is simply "however many fit in original order."
- After the last included event, add one line: `+<N> more hackathons in the carousel.` (bold the `+<N> more hackathons` portion only, Mathematical Sans-Serif Bold matching the rest of the post; ` in the carousel.` stays plain), where `<N>` is the exact count of events left out. This points the reader to the companion carousel (which covers every event, not just the ones that fit here) rather than duplicating the footer's own link-out — the real footer line right after it already handles "link in the first comment."
- Then the real footer (`All events + filter: link in the first comment 👇`) and hashtags, unchanged.
- Verify the final UTF-16 length is ≤ 3,000 before finishing — don't assume the budget math worked, measure the actual output.
- `post-compact.md` itself still gets written in full regardless (it's the reference/skim file for the whole week) — `post-compact-single.md` is only produced when needed, as the version that actually gets posted.
- Mention in your reply to the user how many of the week's events made it into `post-compact-single.md` (e.g. "26 of 48") and its final character count.

## Rule 10 — Title line: lead with the total hackathon count

The shared title line at the top of every file (`post.md`, `post-compact.md`, `post-compact-single.md`, and `post-regions.md`) leads with the week's total event count instead of the generic word "New":

`𝟰𝟴 𝗻𝗲𝘄 𝗵𝗮𝗰𝗸𝗮𝘁𝗵𝗼𝗻𝘀 𝗶𝗻 𝗘𝘂𝗿𝗼𝗽𝗲 · 𝗽𝘂𝗯𝗹𝗶𝘀𝗵𝗲𝗱 𝘀𝗶𝗻𝗰𝗲 𝟭𝟰 𝗦𝗲𝗽 𝟮𝟬𝟮𝟲, 𝟬𝟬:𝟬𝟬`

not

`𝗡𝗲𝘄 𝗵𝗮𝗰𝗸𝗮𝘁𝗵𝗼𝗻𝘀 𝗶𝗻 𝗘𝘂𝗿𝗼𝗽𝗲 · 𝗽𝘂𝗯𝗹𝗶𝘀𝗵𝗲𝗱 𝘀𝗶𝗻𝗰𝗲 𝟭𝟰 𝗦𝗲𝗽 𝟮𝟬𝟮𝟲, 𝟬𝟬:𝟬𝟬`

The count is the same `TOTAL` used in Rule 8 (sum of every region's event count), rendered in the same bold Mathematical Sans-Serif digit style as the rest of the title. The whole title line stays entirely bold (this rule only changes "New" → "<count> new", it doesn't touch the bold styling of the title itself, unlike Rule 7 which de-bolds event names specifically). This mirrors the same "lead with the count" treatment already used on the companion carousel's cover slide, for consistency between the two deliverables.

## Do not touch

Preserve verbatim, in `post.md` specifically (the primary output, cleaned but otherwise faithful to the source):
- The bold Unicode "sans-serif bold" styling of headers, region names, country names, and event titles.
- All flag emoji, exactly as given, for both regions (multi-flag headers) and individual countries.
- The region header format and structure: `🇩🇪🇦🇹🇨🇭 𝗗𝗔𝗖𝗛 (𝟳)`.
- The footer line ("All events + filter: link in the first comment 👇") and the hashtags line.
- The actual event names, dates, and locations beyond the city-name normalization in Rule 3 — never rewrite or abbreviate an event's title.

The derived files (`post-compact.md`, `post-compact-single.md`, `post-regions.md`) are explicitly *not* bound by the bold-styling protection above — Rule 7 deliberately de-bolds event names in those files, and Rule 10 deliberately changes the title line's wording in all four files. What stays protected everywhere, including the derived files: the actual event names/dates/locations as facts, the flag emoji, and the footer/hashtags content.
