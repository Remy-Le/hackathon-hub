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

Do not print the cleaned post inline in chat. Write it to a file instead:

- **Path**: `hackathon-spotlights/weekly-roundup-<published-since-date>/post.md`, where `<published-since-date>` is the "published since" date from the post itself, formatted `YYYY-MM-DD` (e.g. a post reading "published since 31 Aug" in 2026 → `weekly-roundup-2026-08-31/post.md`). This is the same dated folder used for that week's carousel PNGs (see the repo's `CLAUDE.md` for the full weekly-roundup pipeline) — the text post and the visual carousel for a given week live together in one folder. Create the folder if it doesn't exist yet.
- **Content**: the cleaned post as plain text (no markdown formatting added — the bold/flags are already Unicode characters in the source, not markdown), preserving the overall structure (regions → countries → events, footer, hashtags).
- **Reply to the user**: a short confirmation with the file path, not a copy of the full text. If Rule 6 below applies (an outlier duration or prize), add that as a one-line flag in the reply — not inside the file.

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

- Currencies with one common single-glyph symbol get that symbol immediately before the number, with no letter-code prefix: `£1,000`, `€6,000`, `$250,000` — not `US$250,000` or `USD 250,000`.
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

## Do not touch

Preserve verbatim:
- The bold Unicode "sans-serif bold" styling of headers, region names, country names, and event titles.
- All flag emoji, exactly as given, for both regions (multi-flag headers) and individual countries.
- The region header format and structure: `🇩🇪🇦🇹🇨🇭 𝗗𝗔𝗖𝗛 (𝟳)`.
- The footer line ("All events + filter: link in the first comment 👇") and the hashtags line.
- The actual event names, dates, and locations beyond the city-name normalization in Rule 3 — never rewrite or abbreviate an event's title.
