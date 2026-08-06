# Customer Research: ICP for Hackathon Hub

*Compiled: 2026-07-21*
*Mode: Digital watering-hole research (Mode 2), proxy-source approach — Hackathon Hub itself has no reviews/testimonials yet (confirmed in `.agents/product-marketing.md`), so this leans on competitor discourse, organizer guides, and industry essays rather than direct reviews of Hackathon Hub.*

**Tooling caveat (read before using this for messaging):** Reddit was not directly accessible (WebFetch blocked, search results returned no indexed Reddit threads). This means the "participant voice" section below is thinner and lower-confidence than the "organizer/sponsor voice" section, which drew on published organizer guides and essays with real quotes. **Treat this as a first pass, not a substitute for talking to 5-10 real participants and organizers directly** — see Research Gaps at the end.

---

## New Competitive Intel (not previously in product-marketing.md)

Search surfaced direct competitors in the exact "EU hackathon aggregator" niche that weren't identified before:

- **HackTrack EU** (`euro-hackathons.vercel.app`, open-source on GitHub) — "an up-to-date platform listing all the hackathons happening across Europe." A near-identical value prop to Hackathon Hub, built as an open-source side project.
- **Hackalist** — "a list of hackathons from around the world," filterable by travel reimbursement, prizes, high-schooler eligibility, free/paid.
- **HackEvents** — self-described "world's leading search engine for hackathons," browsable by country/city including a Europe/Germany filter.
- **HackerLeague / hackathon.com** — global "find & organize hackathons" directories, long-running, not EU-specific.

**Implication:** Hackathon Hub's "no one aggregates Europe" claim needs sharpening — the real differentiation isn't "we're the only aggregator" (there are several, including open-source ones), it's *depth of EU coverage + community layer (leaderboard, ambassadors) + no-ads/no-tracking stance*. Worth confirming whether these tools have gained any real usage/community before treating them as active threats. **Confidence: Medium** (found via search, not confirmed via usage data).

---

## Segment 1: Hackathon Participants ("Hackers")

### What we could verify (proxy sources)
No direct Reddit verbatim was retrievable. The clearest signal on participant behavior/pain came from:
- The proliferation of competing "find a hackathon" aggregators (HackTrack EU, Hackalist, HackEvents, hackathon.com) — the *existence* of multiple scrappy tools solving the same problem is itself evidence the discovery pain is real and unsolved by any single dominant player. **Confidence: Medium** (inferred from market structure, not direct quotes).
- Organizer-side sources confirming a chronic 30-50% no-show/drop-off rate between registration and attendance (MLH guide, AngelHack, HackerEarth) — implies participants over-register speculatively across many events/channels because no single source tells them what's actually worth committing to. **Confidence: High** (consistent across 3+ organizer-guide sources).
- General "how to find a hackathon" content (Medium's "HackLife Guide," hackathon.com, HackerEarth) treats discovery itself as a solved-by-listicle problem — i.e., participants are expected to check 5+ separate sources (Devpost, MLH, Meetup, Facebook groups, local dev Slacks) rather than one place. **Confidence: High**, corroborates the founder's "scattered across Luma, Devpost, LinkedIn, Discord..." framing already in the product-marketing doc.

### Provisional Persona: European Hackathon Participant
*(Provisional — built from proxy sources + founder narrative, not first-party interviews. Replace with real evidence once outreach is done.)*

**Profile:** Student or early-career developer/designer, 18-28, based in an EU country, active in at least one dev community (uni CS society, Discord, local meetup).

**Primary JTBD:** Find a hackathon worth committing a weekend to — matched to skill level, location, language, and (often) prize/travel support — without manually checking half a dozen sources.

**Trigger events:** Semester break approaching; saw a friend post about a hackathon after it already happened (FOMO); actively building a portfolio/resume for job hunting; wants to meet cofounders.

**Top pains (proxy-sourced):**
1. Discovery is fragmented across Luma/Devpost/Discord/uni pages/Facebook groups — no single source of truth for Europe specifically (founder narrative + market structure evidence).
2. Global-first directories (Devpost, MLH) are comparatively thin on non-flagship European events — long tail of smaller/regional hackathons goes undiscovered.
3. High rate of "found out after it already happened" — the asymmetry between organizer promotion effort and participant reach.

**Desired outcomes:** A shortlist of relevant events filtered by what actually matters to them (location, language, prize, dates) in one pass; a way to signal/prove their track record across events (leaderboard appeal).

**Objections/hesitations:** Skepticism that a community-submitted list is complete or current (vs. official MLH/Devpost data); "why would I use a Phase-1 platform over Devpost, which I already know."

**Alternatives considered:** Devpost, MLH, university-specific channels, Discord/Slack event channels, word of mouth, doing nothing (missing events).

**Key vocabulary (verbatim, from founder/proxy sources — not yet confirmed as participant-native language):** "scattered," "dead pages," "found out after it was already over."

---

## Segment 2: Event Organizers & Sponsors

This segment had far better source material — organizer guides, sponsorship essays, and one HN thread (blocked by rate-limit on this pass) yielded real, citable language.

### Top Themes (ranked by frequency × intensity)

#### Theme 1: Promotion is a sorting problem, not a reach problem
**Summary:** Organizers don't lack visibility tools — they lack a way to get the *right* participants to commit through to submission, not just register.
**Frequency:** Appeared in 2 independent organizer-focused sources (AngelHack, HackerEarth), consistent with MLH's own guide framing.
**Intensity:** High — framed as the "core insight" of one guide.
**Representative quotes:**
- "Promoting a hackathon isn't a reach problem. It's a sorting problem. You don't need more people seeing the event; you need the right people deciding to show up, form a team, and build through to submission." — AngelHack, *How To Promote Your Hackathon*
- "Teams draft a single message and push it across every channel and every city. Senior builders, domain experts, students, and solo registrants each respond to different cues, so generic copy reaches everyone and converts no one." — AngelHack
**Implications:** Hackathon Hub's "automatic categorization & filters" and free listing pitch addresses *reach*, not *sorting*. Messaging to organizers should emphasize getting the right regional/thematic audience (via ambassador network + filters) rather than raw exposure numbers — otherwise it's solving a problem organizers say isn't their real bottleneck.

#### Theme 2: No-shows and drop-off are structural, expected, and costly
**Summary:** Organizers universally plan for 30-50% of registrants not showing up, and treat this as a normal tax on running events.
**Frequency:** 3+ sources (MLH guide, AngelHack, HackerEarth).
**Intensity:** High — treated as a known cost of doing business, not a surprise.
**Representative quotes:**
- "Most events have a 30-50% drop-off in attendance, so the goal is to over-market and overbook." — AngelHack
- "Statistically about 50% of hackers that register for events show up." — organizer-guide synthesis
**Implications:** A platform that helps organizers reach participants with *demonstrated* intent/track record (e.g., leaderboard-ranked hackers who show a history of participation) is more valuable than raw registration volume — this is a concrete angle for positioning the leaderboard as a B2B value-add, not just a participant gamification feature.

#### Theme 3: Sponsorship recruiting ROI is real but fragile and hard to prove
**Summary:** Companies sponsor primarily for recruiting/evangelism, but the economics are thin and increasingly scrutinized.
**Frequency:** 2 strong sources (Hackonomics 101 essay, MLH sponsorship guide).
**Intensity:** High — emotionally loaded language about mission drift.
**Representative quotes:**
- "[Twilio] want[s] students/future developers/hackers[s] to know about their telephony API, and to use it at their next gig and tell their friends about it." — Hackonomics 101
- On rising costs pushing out mission-driven sponsors, replaced by "recruiters with deep pockets."
- Only ~10% of attendees at a typical 100-person hackathon end up meeting a future employer there, and sponsor overhead (travel, staff time) can roughly double the effective cost of a sponsorship.
**Implications:** Sponsors are cost- and ROI-sensitive, and skeptical of vague "brand visibility" pitches. Hackathon Hub's sponsor pitch ("logo visibility," "sponsor the ambassador program") is currently reach/branding-flavored — pairing it with harder recruiting-funnel proof (e.g., "X sponsors met Y candidates across Z countries") would land better with this audience once that data exists.

#### Theme 4: Finding sponsors/leads is a constant, unsolved grind for organizers
**Summary:** Organizers report chronic difficulty sourcing new sponsor leads, treated as an ever-present task rather than a solvable one-time problem.
**Frequency:** 1 direct quote source (BoilerMake), corroborated generally by multiple "tips for getting sponsors" guides existing as a genre.
**Intensity:** Medium — pragmatic rather than emotionally charged.
**Representative quote:**
- "Every hackathon organizer always struggles to find new leads for hackathons." — BoilerMake, *6 Tips for Getting Sponsorship for a Hackathon*
**Implications:** This is exactly the gap Hackathon Hub's ambassador network claims to fill ("actively contact companies, universities, and communities to secure sponsorships"). This is a genuinely differentiated wedge — worth leading with in organizer-facing copy, if ambassador-sourced sponsorships can be evidenced.

### Provisional Personas

**Persona: University/Community Hackathon Organizer**
- Profile: Student society lead or community volunteer running an annual or recurring hackathon; resource- and time-constrained; usually a small, rotating team.
- JTBD: Get enough of the *right* participants to register and actually show up, and secure enough sponsorship to fund prizes/logistics — with minimal ongoing marketing effort.
- Top pains: Chronic sponsor-lead sourcing grind (BoilerMake quote); generic promotion reaching the wrong audience (AngelHack); 30-50% no-show tax eating into planning.
- Desired outcomes: Predictable turnout of qualified participants; a repeatable sponsor pipeline instead of starting from zero each year.
- Objections: "Will listing here actually reach people who'll show up, or just inflate registration numbness that ends in more no-shows?"
- Alternatives: MLH affiliation (if eligible), Devpost listing, own social/uni channels, personal network of past sponsors.

**Persona: Corporate Sponsor / Recruiting Stakeholder**
- Profile: HR/recruiting or innovation-team stakeholder evaluating hackathon sponsorship as a talent-pipeline or brand-visibility tactic; budget-conscious, ROI-scrutinized.
- JTBD: Get in front of qualified European technical talent and convert a defensible number of them into hires or brand affinity, at a cost that beats third-party recruiters (~20-25% of salary/hire).
- Top pains: Difficult-to-prove ROI (~10% of attendees ever meet a sponsor); overhead costs (travel/staff time) can roughly double effective spend; sponsorship increasingly perceived as "recruiters with deep pockets" crowding out genuine community goodwill.
- Desired outcomes: Clear, comparable metrics on reach/conversion; access to a wider European pool than one company could reach alone via one-off event sponsorships.
- Objections: "How is this different/better than sponsoring directly through MLH or a known national hackathon?"; "There's no pricing or case study — what am I actually buying?"
- Alternatives: MLH sponsorship, direct sponsorship of known events (Junction, national uni hackathons), third-party recruiters, career fairs.

---

## Research Gaps — What's Still Unverified

1. **No first-party Hackathon Hub customer voice at all** (no reviews, no testimonials, confirmed in product-marketing.md) — everything above is proxy/adjacent, not "our actual users said X."
2. **Participant segment is thin** — direct Reddit/Discord access wasn't available through my tooling this pass. Recommend manually pulling 10-15 threads from r/hackathons, national CS Discord servers, or X/LinkedIn hackathon hashtags, or better: interview 5-10 actual Hackathon Hub users directly (ambassadors would be a fast, willing sample — they're already engaged).
3. **New competitors (HackTrack EU, Hackalist, HackEvents) are unvalidated as real threats** — unknown usage/traction. Worth a 30-minute check (site traffic estimate, GitHub stars/activity, social presence) before deciding how much they matter competitively.
4. **Sponsor-side data is generic industry knowledge (mostly US/MLH-context), not EU-specific** — European corporate sponsorship dynamics (budget cycles, works councils, GDPR-related data concerns for attendee lists) are unverified and could differ meaningfully from the US-heavy sources found here.
5. **No churn/rejection data** — nothing here reflects why an organizer or sponsor *chose not to* use Hackathon Hub. That's high-value and only obtainable through direct outreach.

**Recommended next step:** A short structured outreach round — 5 participants, 5 organizers, 3 sponsor-side contacts (ambassadors likely have warm intros to all three) — using the JTBD/pain questions above as an interview guide, would upgrade nearly every claim in this document from Medium/Provisional confidence to High.
