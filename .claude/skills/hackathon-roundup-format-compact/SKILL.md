---
name: hackathon-roundup-format-compact
description: "Render one region's parsed hackathon-roundup data.js into the compact places-and-dates skim post (post-compact.md, plus a single-post-fit post-compact-single.md when the compact version would exceed LinkedIn's 3,000-character limit). Use whenever the user pastes a raw hackathon-roundup block (or references an already-parsed region) and asks for the compact/skim/short version, or a version that fits in one LinkedIn post. For the full post, use hackathon-roundup-format-full. For the region/country-counts-only summary, use hackathon-roundup-format-regions."
metadata:
  version: 2.0.0
---

# Hackathon roundup formatter — compact

## When to use this skill

Trigger when the user pastes a block of text shaped like the weekly "New hackathons in Europe" roundup, or asks for the compact version for a region already parsed, and wants the compact/skim/places-and-dates version, or a version that fits in a single LinkedIn post.

## Input: `data.js`, not the raw paste directly

This skill renders from structured data — it doesn't parse the raw paste itself. Ensure `hackathon-spotlights/weekly-roundup-<published-since-date>/<region-slug>/data.js` exists for this region (run `hackathon-roundup-parse` first if it doesn't yet, or if the user just pasted fresh raw text for a region that already has a `data.js` — that's a refresh request). See `hackathon-roundup-parse` for the region-slug rule, the `data.js` shape, and its own fidelity QA against the raw source — city-exonym, date-hyphen, and price normalization, plus outlier flagging (its old Rule 6), already happened there; no need to re-check any of it here.

## Output contract

Do not print the cleaned post inline in chat. Write it to file(s) instead, in the same dated folder used for that week's other deliverables:

- **Path**: `hackathon-spotlights/weekly-roundup-<published-since-date>/<region-slug>/post-compact.md` for a **single-region `data.js`** (the normal case now, see `hackathon-roundup-parse` for the region-slug rule) — the same per-region subfolder that region's carousel PNGs live in (see `CLAUDE.md`/`hackathon-roundup-pipeline`), so multiple regions in the same week never collide on a shared `post-compact.md`. If `data.js`'s `regions` array has more than one entry (a full multi-region/pan-Europe parse), there's no single region to slug: write to the flat dated-folder root instead, `hackathon-spotlights/weekly-roundup-<published-since-date>/post-compact.md`.
- **Content of `post-compact.md`**: locations and dates only — see Rule 7 below.
- **Conditional extra file — `post-compact-single.md`** in the same folder as `post-compact.md` (region subfolder or flat root, matching whichever applied above), only when `post-compact.md` exceeds LinkedIn's 3,000-character limit: a single always-postable version that shows as many full events as fit (in original order) plus a "+N more" line. See Rule 9 below.
- **Reply to the user**: a short confirmation with the file path(s) written, not a copy of the full text. If Rule 9 applies, say how many of the week's events made it into `post-compact-single.md` and its character count.

## Rendering rules

### Region and country headers

Region header: flag emoji for every code in the region's `codes`, then the bold region name, then the event count in parens: `🇩🇪🇦🇹🇨🇭 𝗗𝗔𝗖𝗛 (𝟭𝟴)`. Country sub-header: that country's flag emoji, then its bold name: `🇦🇹 𝗔𝘂𝘀𝘁𝗿𝗶𝗮`.

### Bullets and blank-line spacing

Every event line starts with `•`. Exactly one blank line before each event entry; one blank line between a country's last event and the next country or region header; no blank line between an event's name line and its `Location · Date · Tags` line directly beneath it.

## Rule 7 — `post-compact.md`: strip category tags, keep special chips

`post-compact.md` is a places-and-dates-only skim version.

On each event's second line, keep only the location, the date, and any of
these chips that appear, in their original order and exact formatting:
- 💰 price (already normalized in `data.js`: single-glyph currencies directly before the number, US dollar as `US$`, others as a code + space prefix)
- 🏨 Stay
- 🖥️ Online
- ✈️ Travel

Drop every category tag (long-form tag text). If an event line has no chips,
it ends right after the date, e.g. `Bari · 1 Oct`. If it has chips, e.g.
`Vallendar · 25-26 Sep · 💰 €5,000 · 🏨 Stay`.

One more difference from the full post: event name lines (the `•` line) are
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
blank-line spacing, footer, and hashtags stay the same shape as `data.js`.

The title line follows Rule 10 below.

## Rule 9 — LinkedIn's 3,000-character limit: `post-compact-single.md` always fits in one post

LinkedIn's post limit is 3,000 characters, counted as UTF-16 code units (like JavaScript's `.length`) — every bold-unicode character (used throughout this post format: headers, region/country names) costs 2 units instead of 1, same for flag emoji. Don't count with a plain `wc -m`/byte or codepoint count — it under-reports badly. Measure the real length with `[...text].length` for codepoints as a sanity check, but treat `text.length` (UTF-16 units) as the number that matters, since it's the stricter and more likely one LinkedIn's own counter uses.

Stripping the bold styling does **not** reliably fix this — for a heavy week (40+ events) even a plain-text version can still exceed 3,000 codepoints. The actual driver is event count, which varies week to week. **This has to be exactly one LinkedIn post, always** — never split across multiple posts. So when the full list doesn't fit, cut content, not posts.

After writing `post-compact.md`, measure its length (UTF-16 units). If it's ≤ 2,900 (a safety margin under the 3,000 cap), `post-compact.md` is postable as-is and no further file is needed.

If it's over 2,900, write one more file, **`post-compact-single.md`**, alongside `post-compact.md` — the actual thing that gets posted to LinkedIn that week:

- Walk events in their existing region → country order (same order as `post-compact.md`) and keep adding full event blocks (name + location/date/chips, exactly as in `post-compact.md`, including the blank-line spacing rules) for as long as the running total stays under the 2,900-unit budget, reserving room for the cutoff line and footer as you go.
- Stop as soon as the next event wouldn't fit. Region and country headers are only included if at least one of their events made it in; a region or country header's own count (e.g. `(𝟭𝟲)`) is **not** adjusted down to match a partial list under it — leave it as the true weekly total, even if the post itself only shows some of that region's events. This is a known, accepted tradeoff: which events make the cut is not editorially curated, it is simply "however many fit in original order."
- After the last included event, add one line: `+<N> more hackathons in the carousel.` (bold the `+<N> more hackathons` portion only, Mathematical Sans-Serif Bold matching the rest of the post; ` in the carousel.` stays plain), where `<N>` is the exact count of events left out. This points the reader to the companion carousel (which covers every event, not just the ones that fit here) rather than duplicating the footer's own link-out — the real footer line right after it already handles "link in the first comment."
- Then the real footer (`All events + filter: link in the first comment 👇`) and hashtags, unchanged.
- Verify the final UTF-16 length is ≤ 3,000 before finishing — don't assume the budget math worked, measure the actual output.
- `post-compact.md` itself still gets written in full regardless (it's the reference/skim file for the whole week) — `post-compact-single.md` is only produced when needed, as the version that actually gets posted.
- Mention in your reply to the user how many of the week's events made it into `post-compact-single.md` (e.g. "26 of 48") and its final character count.

## Rule 10 — Title line: lead with the total hackathon count

The shared title line at the top of `post-compact.md` and `post-compact-single.md` leads with the week's total event count instead of the generic word "New":

`𝟰𝟴 𝗻𝗲𝘄 𝗵𝗮𝗰𝗸𝗮𝘁𝗵𝗼𝗻𝘀 𝗶𝗻 𝗘𝘂𝗿𝗼𝗽𝗲 · 𝗽𝘂𝗯𝗹𝗶𝘀𝗵𝗲𝗱 𝘀𝗶𝗻𝗰𝗲 𝟭𝟰 𝗦𝗲𝗽 𝟮𝟬𝟮𝟲, 𝟬𝟬:𝟬𝟬`

not

`𝗡𝗲𝘄 𝗵𝗮𝗰𝗸𝗮𝘁𝗵𝗼𝗻𝘀 𝗶𝗻 𝗘𝘂𝗿𝗼𝗽𝗲 · 𝗽𝘂𝗯𝗹𝗶𝘀𝗵𝗲𝗱 𝘀𝗶𝗻𝗰𝗲 𝟭𝟰 𝗦𝗲𝗽 𝟮𝟬𝟮𝟲, 𝟬𝟬:𝟬𝟬`

The count is the sum of every region's event count, rendered in the same bold Mathematical Sans-Serif digit style as the rest of the title. The whole title line stays entirely bold (this rule only changes "New" → "<count> new", it doesn't touch the bold styling of the title itself — unlike Rule 7, which de-bolds event names specifically). This mirrors the same "lead with the count" treatment already used on the companion carousel's cover slide, for consistency across this week's deliverables.

## Do not touch

What stays protected in both `post-compact.md` and `post-compact-single.md`:
- The actual event names/dates/locations as facts, already normalized upstream in `data.js` (beyond the de-bolding in Rule 7 — never rewrite or abbreviate an event's title).
- All flag emoji, exactly as given.
- The footer line ("All events + filter: link in the first comment 👇") and the hashtags line.
- The bold Unicode styling of region names, country names, and headers (only event name lines get de-bolded, per Rule 7).
