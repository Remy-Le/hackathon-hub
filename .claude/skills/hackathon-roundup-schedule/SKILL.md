---
name: hackathon-roundup-schedule
description: "Schedule one region's already-rendered hackathon-roundup post (post.md / post-compact.md / post-compact-single.md) to Buffer as a LinkedIn post. Use when the user asks to schedule, post, or publish a region's roundup to Buffer/LinkedIn, or gives a day/time to schedule it for. Covers the two separate character-limit caps (post body vs. first comment), which text variant to use at which event count, and the Buffer MCP mechanics/gotchas (edit_post re-validation, image-asset URL requirement, org/channel selection)."
metadata:
  version: 1.0.0
---

# Hackathon roundup — Buffer scheduling

Schedules one region's rendered text post to Buffer/LinkedIn. Assumes `hackathon-roundup-format-full` (and, if needed, `hackathon-roundup-format-compact`) has already produced `post.md` for that region — this skill doesn't render text, it picks which already-rendered variant to post and handles the Buffer mechanics.

## Buffer setup

- `mcp__buffer__get_account` may return **more than one organization** on the account. Confirm which org owns the actual company LinkedIn page before listing channels — don't assume the first one. For Hackathon Hub, the page lives under the org owned by `support@hackathon-hub.de`, not a personal-email-owned org.
- `mcp__buffer__list_channels` on that org to find the LinkedIn channel: `service: "linkedin"`, `type: "page"`, name "Hackathon Hub". Reuse its `channelId` for the rest of the session instead of re-listing per post.

## Step 1 — Pick the text variant: post-body length decision tree

LinkedIn's post-body limit is **3,000 characters, counted as UTF-16 code units** (JavaScript's `.length` — not a codepoint or byte count). This is the same counting rule `hackathon-roundup-format-compact`'s Rule 9 already documents for `post-compact-single.md`; it applies here too, to whichever variant ends up posted.

1. **Start with `post.md`, stripped of its bold-Unicode styling.** `post.md` uses Mathematical Sans-Serif Bold Unicode characters (capitals `U+1D5D4`-`U+1D5ED`, lowercase `U+1D5EE`-`U+1D607`, digits `U+1D7EC`-`U+1D7F5`) for headers, region/country names, and event titles. These are outside the Basic Multilingual Plane, so each one costs **2 UTF-16 units** instead of 1 — converting them back to plain ASCII can nearly halve the effective length before any content is actually removed. Do this conversion programmatically (map codepoint ranges back to `A-Z`/`a-z`/`0-9`), not by hand.
2. **Measure the stripped text's `.length`.** If it's ≤2,900 (safety margin under the 3,000 cap), post this as-is. This was enough for DACH (2,904), Central & Eastern Europe (1,964), Online/Remote (1,095), and Hacktoberfest (2,405) in practice — none of these needed tags removed, only bold stripped.
3. **If it doesn't fit even after stripping bold** (this happens once a region has roughly 25+ events — the driver is event *count*, not styling): ensure `hackathon-spotlights/weekly-roundup-<date>/<region-slug>/post-compact.md` exists (run `hackathon-roundup-format-compact` if not). This drops category tags and de-bolds event names, which cuts far more than bold-stripping alone — e.g. Western Europe went from 5,091 (bold-stripped full) to 2,771 (compact); Southern Europe from 3,168 to 1,883. Re-verify: keeping tags but only de-bolding titles does **not** get you there (tested at 5,222 for Western Europe, barely different from the full bold-stripped version) — tags are the real weight, so don't try a "partial" strip.
4. **If even `post-compact.md` doesn't fit** (a multi-region one-off collection, 40+ events total — e.g. NASA Space Apps at 58 events across 7 regions came in at 4,720 even fully compact): ensure `post-compact-single.md` exists (same skill, its Rule 9 — full event blocks kept in original order until the 2,900-unit budget is spent, then a `+N more hackathons in the carousel.` line, then the footer). Use that.
5. **Never split one region's post across multiple LinkedIn posts** — always cut content (via the compact/single fallbacks above), never posts.

## Step 2 — Build the first comment: a separate, smaller cap

Buffer/LinkedIn's first-comment field has its **own limit — 1,250 characters** — much smaller than the 3,000-char post cap, and easy to miss since it's not documented in the `create_post`/`edit_post` tool schemas themselves (only surfaces as a live API rejection: `"Invalid post: LinkedIn first comment cannot exceed 1250 characters."`).

Each region's `post.md` already carries a human-readable "First comment (paste in Buffer, not part of the post)" section (master link, region link if applicable, per-country links) — use that as the source, but budget-check before sending as `metadata.linkedin.firstComment`:

- **Master link only, or master + a handful of per-country links (up to ~10-12 countries): fine as-is.** Central & Eastern Europe (7 country lines), Southern Europe (7), Hacktoberfest (8) all fit comfortably under 1,250 with full per-country breakdowns.
- **Once a region has too many countries for that to fit (roughly 15+), don't send the per-country list — coarsen to region-grouped links instead.** Group the countries present into that post's natural region clusters and combine each cluster's codes into one link (`&country=AT%2CDE%2CCH` style, comma-joined, URL-encoded as `%2C`), one link per cluster instead of one per country. NASA Space Apps' 23-country list would have been ~2,400+ characters; regrouped into 6 region-cluster links + the master link, it came to 791.
- **Always measure the actual string length before sending** — don't estimate from country count alone; build the string first, check `.length`, and only then call `create_post`/`edit_post`.
- If even the region-grouped version doesn't fit (shouldn't normally happen), fall back further to the master link alone.

## Step 3 — Buffer MCP mechanics and gotchas

- **Scheduling a specific time**: `mode: "customScheduled"` + `dueAt` (ISO 8601 with UTC offset — build the offset from `get_account`'s `timezone`/`currentTime`, don't hardcode) + `schedulingType: "automatic"` (auto-publish; use `"notification"` instead only if the user wants manual approval before it goes out).
- **`mcp__buffer__edit_post` re-validates the whole post, it does not merge a partial update.** If you only want to change `metadata` (e.g. adding `firstComment` after the fact), you still must resend `text` (and `assets`, if any) in the same call — omitting them fails with `"Invalid post: Post must have either text or media."` This is how the DACH post's `firstComment` was added after its initial `create_post` call: the full `text` was resent unchanged alongside the new `metadata`.
- **Image assets require public URLs, not local file paths.** `create_post`/`edit_post`'s `assets[].image.url` must be a direct link Buffer's servers can fetch — local carousel PNGs (`hackathon-spotlights/weekly-roundup-<date>/<region-slug>/*.png`) can't be attached as-is. There is no upload tool in this Buffer MCP connection. If the user wants the carousel attached, the images need to be hosted somewhere public first (Google Drive with public sharing, a Claude Artifact's asset store, or self-hosted) — flag this rather than silently posting text-only, and confirm with the user which hosting route they want before proceeding.

## Relationship to other files/skills

- The "First comment" section already appended to the bottom of each `post.md` (below the `All events + filter: link in the first comment 👇` footer line) is the **human-readable record** of the links — keep it and Buffer's actual `metadata.linkedin.firstComment` field in sync, but they are two different things: one is a file for people to read later, the other is what Buffer actually attaches to the LinkedIn post.
- See `first-comment-links-plan.md` (repo root) for the plan to have `hackathon-roundup-parse` generate these links automatically from `data.js` in future weeks, instead of deriving/pasting them by hand each time.
