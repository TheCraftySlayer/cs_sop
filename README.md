# BernCo Assessor SOP Library

> Customer Service and AI Operations Standard Operating Procedures for the **Office of the Bernalillo County Assessor** — Damian R. Lara, County Assessor.

A self-contained, offline-capable web library of 20 SOPs across six tracks, with animated videos, written procedures, printable desk references, a decision-tree triage, an IPRA-compliance toolset, and an A–Z glossary. Everything renders from static HTML + a single data file. No backend, no build step.

---

## Open the library

Point any modern browser at `index.html`. That's the home page. From there:

- **Search bar** — top-right of every page. Type any term, statute number, or SOP ID. Multi-word AND match, hyphen-insensitive (`14-2-8` and `14 2 8` both find the same things), `/` to focus from anywhere.
- **Triage** — "I just got a call about…" decision tree that routes you to the right SOP in 1–3 questions.
- **Start here** — four recommended learning paths: Customer Service, AI Operations, Internal Agents, LEAP.
- **Quick-ref** — six printable index cards for the most-used SOPs, laid out for US-letter landscape print.
- **Glossary** — every acronym in the library, linked back to the SOP that defines it.
- **Changelog** — chronological log of every change to every SOP.
- **IPRA Log** — interactive Inspection of Public Records Act request tracker with live deadline countdowns and a letter generator.

---

## What's in the library

| Track | Section | SOPs |
|---|---|---|
| **Customer Service** | Counter | CS01 (Veteran Exemption) |
| | RingCentral phones | CS02–CS08 |
| | Reporting (Envoy) | CS09 |
| | LEAP · District Court | CS10–CS11 |
| **AI Operations** | A.C.E. chatbot | AIO01–AIO07 |
| | Internal CustomGPT agents | BIO01, BIO04 |

**20 SOPs total** — 17 have animated videos (~3–8 min each, bilingual EN/ES, with quizzes and speaker notes), 3 are reference documents (AIO06, BIO01, BIO04).

---

## File map

```
index.html              Library home — grid, search, onboarding, "What changed" strip
triage.html             Decision-tree wizard ("I got a call about…")
glossary.html           A–Z reference, click any chip to jump to the source SOP
quick-ref.html          6 printable desk cards
changelog.html          Time-grouped changelog
MAINTAINERS.md          How to add SOPs, edit data, run the linter

lib/
  sop-data.js           Single source of truth — SOPS, SECTIONS, ONBOARDING,
                        RELATED, CHANGELOG, TRIAGE, ESCALATIONS, GLOSSARY
  sop-video.jsx         Animated-video runtime (scenes, captions, language toggle)
  animations.jsx        Timeline & playback engine
  related-footer.js     Auto-injects related-SOPs footer on every sops/*.html
  sop-updated-banner.js Auto-injects "Updated <date>" banner
  utility-nav.js        Cross-nav pills on triage/glossary/quick-ref/changelog
  video.css             Shared video styling

sops/                    One HTML per SOP (CS01, …, AIO07, BIO04, …)
sops/AIO07_request_log.html        IPRA request log (interactive)
sops/AIO07_records_inventory.html  A.C.E. records inventory worksheet

videos/                  One HTML per animated SOP video
docs/                    Source .docx files (one per SOP, for download)
sop_text/                Plain-text mirrors of the SOPs
sop_assets/              Per-SOP supporting assets (screenshots in videos, etc.)

system/
  flow.html             AI Operations flow diagram
  notify.html           AI Operations escalation matrix
  notify-cs.html        Customer Service escalation matrix
  dashboard.html        Per-SOP quiz / watch progress
  library-health.html   Lint dashboard — checks lib/sop-data.js for drift
                        (Hidden from end-user navigation; maintainers only)

assets/                  Brand assets: logos, letterhead, signature image
fonts/                   Brand fonts (Gotham Black for display)
```

---

## Standout tools

**IPRA Request Log** (`sops/AIO07_request_log.html`)
- One entry per public-records request, with sidebar list + detail panel
- Live countdown clocks: 3 business days to acknowledge, 15 calendar days to produce
- Auto-derived status (Open → Acknowledged → In production → Redacting → Ready → Closed)
- Filter chips: All / Open / Overdue / Due ≤ 3d / Closed
- Letter generator: three on-brand letterhead templates (3-day acknowledgment §14-2-8.D, burdensome notice §14-2-10, denial §14-2-11) — copy, download, or print
- All data is local to the browser; JSON import/export for portability

**A.C.E. Records Inventory** (`sops/AIO07_records_inventory.html`)
- Fillable matrix of the 14 record categories AIO07 requires the office to track
- Status stoplights for LGRRDS mapping progress

**Triage tree** (`triage.html`)
- "I just got a call about…" wizard, 1–3 steps to the right SOP
- Handles every SOP track plus IPRA / records requests
- Escalation cards for out-of-scope (Veterans Services referral, contain-PII-first, etc.)

**Escalation matrices** (`system/notify.html`, `system/notify-cs.html`)
- One page each for AI Operations and Customer Service, listing every same-day notify-up trigger across the library

**Library Health** (`system/library-health.html`)
- Lints `lib/sop-data.js` against every consumer
- Catches: asymmetric RELATED pairs, dead cross-references, unreachable Triage nodes, stale changelog entries, glossary-points-to-nothing
- Per-SOP inventory table showing where each SOP appears across the library
- Linked from `MAINTAINERS.md`, hidden from end users

---

## Design system

Visual identity follows the **BernCo Brand Style Guide** (Bernalillo County, March 2023) and the Assessor's lockup:

- **Bosque Green** `#285952` — primary
- **Cypress** `#013942` — deep teal for emphasis
- **Terracotta** `#e47756` — warm accent and CTAs
- **Sage** `#96aa94` — muted surfaces
- **Mist** `#e8f1ee` — page backgrounds
- **Paper** `#faf8f4` — warm white for documents

Type: **Gotham Black** for display (provided weight) + **Montserrat** for body (geometric-sans fallback). Times New Roman is used inside the IPRA letter template specifically.

Icons: **Lucide** stroke-based icon system. No emoji in public-facing materials.

---

## Browser support

Tested on current Chrome, Edge, Safari, Firefox. Uses standard HTML5 + ES2020 + plain CSS — no framework dependencies, no build step. Videos use React + Babel via CDN (pinned versions with integrity hashes). IPRA Log and Inventory persist user input to `localStorage` only — no data leaves the browser.

Offline: the entire library works from a local filesystem or fileshare. The only network requests are Google Fonts (Montserrat) and the React/Babel CDN; both have graceful fallback to system fonts.

---

## Maintaining

Almost every change goes through one file: **`lib/sop-data.js`**.

Recipes for adding SOPs, logging changes, editing the glossary, extending the triage tree, and reordering onboarding paths are in [`MAINTAINERS.md`](MAINTAINERS.md). The **Library Health** page (`system/library-health.html`) flags drift in real time — open it after any edit to confirm nothing broke.

---

## Voice & content rules

Per the BernCo Brand Style Guide:

- **AP Style.** Title Case for headlines, sentence case for body.
- **Bernalillo County (BernCo)** — long form on first reference for letters/permits, BernCo OK thereafter.
- Job titles capitalized only when before a name at director-level: "County Assessor Damian R. Lara."
- Dates: `Nov. 10` with a date, `November 2026` alone (March / April / May / June / July never abbreviate).
- Time: `2 p.m.`, `10:30 a.m.`, never `2:00 PM`.
- Phone: `505-555-5005`.
- **Tagline:** `Count on us.` — always lowercase sentence, always one color. Reserved for emotive closers; deliberately omitted from formal IPRA correspondence.

---

## Compliance footing

The IPRA toolset references and implements requirements of:

- New Mexico Inspection of Public Records Act, **§ 14-2-1 et seq. NMSA 1978** (definitions, request procedure, redactions, denial)
- Public Records Act, **§ 14-3 NMSA 1978** (retention & disposition)
- **§ 14-1-8 NMSA 1978** (destruction of county records)
- Bernalillo County Ordinance 2026-1 (Code of Conduct Sec. 2-140)
- Assessor's Office AI Policy v2.0

Records retention is mapped through **AIO07** to the **Local Government Records Retention and Disposition Schedules (LGRRDS)** administered by the New Mexico State Records Center and Archives (SRCA).

---

*Office of the Bernalillo County Assessor — Damian R. Lara, County Assessor.*
