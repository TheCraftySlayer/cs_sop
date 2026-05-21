# Maintaining the SOP library

> **TL;DR — almost every change happens in one file: [`lib/sop-data.js`](lib/sop-data.js).** This file is the single source of truth for SOP metadata, the index grid, the onboarding paths, the changelog, the glossary, the triage decision tree, and SOP cross-references. Edit it, save, refresh — done.
>
> **Check what's drifting at `system/library-health.html`.** That page lints the whole library against `lib/sop-data.js` and flags missing entries, broken cross-references, asymmetric RELATED pairs, dead onboarding links, and stale SOPs.

---

## What's where

| File / folder | Purpose | Edit when… |
|---|---|---|
| `lib/sop-data.js` | **Single source of truth.** SOPS, SECTIONS, ONBOARDING, RELATED, CHANGELOG, TRIAGE, ESCALATIONS, GLOSSARY. | Almost any data change |
| `sops/<ID>.html` | The actual written SOP document. | The procedure itself changes |
| `videos/<ID>_*.html` | The animated video. Bilingual (EN/ES), can include `<script id="speaker-notes">`. | The video changes |
| `index.html` | Library home. **Cards + onboarding rendered from `sop-data.js`** — do not hand-edit them. | Top-bar nav, hero, or layout |
| `triage.html` | Decision-tree wizard. Reads from `SOP_LIB.TRIAGE`. | Visual chrome only |
| `glossary.html` | A–Z reference. Reads from `SOP_LIB.GLOSSARY`. | Visual chrome only |
| `changelog.html` | Time-grouped log. Reads from `SOP_LIB.CHANGELOG`. | Visual chrome only |
| `quick-ref.html` | 6 printable index cards (CS01, AIO01, AIO05, AIO07, CS09, CS11). **Hand-written** — there's no data backing this. | Quick-ref content changes |
| `sops/AIO07_request_log.html` | Interactive IPRA Request Log: list/detail split, live countdown, letter generator. Saves to localStorage. | The form fields or letter templates change |
| `sops/AIO07_records_inventory.html` | Fillable A.C.E. Records Inventory worksheet (Part A.1). | Default record categories change |
| `lib/related-footer.js` | Auto-injects "Related SOPs" footer into every `sops/*.html` page. | Bug fixes only |
| `lib/sop-updated-banner.js` | Auto-injects "Updated <date>" banner at top of `sops/*.html`. | Bug fixes only |
| `lib/utility-nav.js` | Cross-nav pills on triage / glossary / quick-ref / changelog. | Add a new utility page |
| `lib/sop-video.jsx`, `lib/animations.jsx` | The video runtime — scenes, timeline, captions, language toggle. Posts `slideIndexChanged` to parent for the speaker-notes pane. | Engine-level changes |
| `system/flow.html` | AIO operations flow diagram (with AIO07 stewardship lane at bottom). | Visual chrome only |
| `system/notify.html` | AI Operations escalation matrix. | AIO triggers change |
| `system/notify-cs.html` | **Customer Service** escalation matrix (counter, phone, LEAP, Envoy). | CS triggers change |
| `system/dashboard.html` | Training progress per-SOP. | Add SOPs to `AIO_SOPS` / `CS_SOPS` + `VIDEO_PATHS` |
| `system/flow.html`, `system/library-health.html` | Auxiliary pages linked from the top-bar. | Their own content |

---

## Recipes

### 🔴 To log a change to an existing SOP

1. Open `lib/sop-data.js`.
2. Add a new entry at the **top** of `CHANGELOG`:

   ```js
   { date: '2026-05-20', sop: 'CS04', kind: 'updated',
     summary: 'One-line, past-tense description of what changed.' },
   ```

3. Save.

That entry appears in **three places automatically**:
- The "What changed" strip on the index home page (top 3 entries).
- `changelog.html` (full timeline, grouped by month).
- A banner at the top of `sops/CS04.html` showing the most recent change.

`kind` is `'updated'` or `'new'`. Date is ISO `YYYY-MM-DD`. Trim to ~12 entries occasionally.

---

### 🟢 To add a brand-new SOP

1. **Write the SOP page**: copy an existing `sops/<ID>.html`, rename, edit. The auto-inject scripts at the bottom (`sop-data.js`, `related-footer.js`, `sop-updated-banner.js`) require no changes — they auto-detect the SOP id from the filename.
2. **Optionally write a video page**: `videos/<ID>_<slug>.html`. To add speaker notes, include a `<script type="application/json" id="speaker-notes">` array in `<head>` — one entry per scene.
3. **Open `lib/sop-data.js`** and add an entry to the `SOPS` object. Critical fields:
   - `section` — must match an existing `SECTIONS[].id`.
   - `chipClass` — `'cs' | 'aio' | 'bio' | 'ref'`.
   - `thumbId` / `thumbSub` — what shows on the big card thumbnail.
   - `watch` — omit (or set falsy) for document-only SOPs.
   - `searchTags` — generous; the new search supports multi-word AND matching plus hyphen-folding (so `14-2-8` matches `14 2 8`).
4. **Add to `RELATED`** — and make sure to add the back-references on sibling SOPs that should point to the new one. The library-health page lints for asymmetric pairs.
5. **Optionally add to `ONBOARDING`** if it belongs on a learning path.
6. **If it has a video, also wire it into `system/dashboard.html`**: add to the `AIO_SOPS` or `CS_SOPS` array and to `VIDEO_PATHS`. And to `triage.html`'s `slugForVideo` map.
7. **Log it in `CHANGELOG`** with `kind: 'new'`.

Refresh `index.html`. Card appears, search picks it up, related footer works, updated banner works.

---

### 🟡 To add or edit a glossary term

Open `lib/sop-data.js`, find `GLOSSARY`, add an entry:

```js
{ term: 'KB', expand: 'Knowledge Base',
  def: 'One-sentence definition.',
  sops: ['AIO03','AIO06'] },
```

`term`, optional `expand`, `def`, and the list of `sops` where it appears (renders as clickable chips). Order doesn't matter — `glossary.html` groups and sorts alphabetically.

---

### 🔵 To add a branch to the triage tree

In `lib/sop-data.js`, find `TRIAGE`. Each key is a node; nodes branch via `options[*].go` (to another node) or terminate via `options[*].sop` (route to an SOP) / `options[*].escalate` (route to an escalation in `ESCALATIONS`).

```js
'my-new-node': {
  title: 'The question the user sees.',
  eyebrow: 'Step N · Short label',
  options: [
    { label: 'Short button text', detail: 'Subtext.', sop: 'CS04' },
    { label: 'Another choice',    detail: 'When to pick.',  go: 'another-node' },
    { label: 'Escalate',          detail: 'Out of scope.',  escalate: 'pii' }
  ]
}
```

If you added an `escalate` key, also add a matching entry to `ESCALATIONS` with `eyebrow`, `h`, `body`, and `cta`.

---

### 🟣 To change a learning path on the index

Open `lib/sop-data.js`, find `ONBOARDING`. **Four keys: `cs`, `aio`, `bio`, `leap`.** Each has a `steps` array of `{ id, shortName, order }`. Reorder, add, or remove. `shortName` is the short label shown on the dark onboarding card — keep under ~24 characters. The cards link to the SOP read page, not the video.

---

### ⚪ To update a quick-reference card

Quick-ref cards (`quick-ref.html`) are hand-written. They live as 6 `<article class="card">` blocks for CS01, AIO01, AIO05, AIO07, CS09, CS11. To edit content, just edit the markup. To add a card, copy an existing `<article class="card">` block and customize, then bump the count in the hero meta-row.

Hand-tuned for print on US-letter landscape — not data-driven by design.

---

### 🛠 To add an external URL or cross-SOP reference in body text

The library auto-styles these. Just write:

- `<a href="CS04.html">CS04</a>` for cross-SOP links inside `sops/*.html` (note: relative to the same folder).
- `<a href="https://…" target="_blank" rel="noopener">https://…</a>` for external resources.

The `.doc a` style is included in every SOP page's `<style>` block. Run the URL linkifier (described below) to catch any bare URLs that slipped in.

---

## Library Health — the maintenance dashboard

Open `system/library-health.html`. It reads `lib/sop-data.js` and reports:

- **SOPs missing from key indexes** — onboarding paths, related-footer, glossary, triage.
- **Asymmetric `RELATED` pairs** — A→B exists but B→A does not.
- **Dead references** — `RELATED` entries pointing at SOPs that don't exist.
- **Unreachable from Triage** — SOPs that no triage path can route a user to.
- **Stale changelog** — SOPs that haven't been logged in the changelog this year.
- **Section-coverage** — SOPs whose `section` doesn't match any `SECTIONS[].id`.

Fix anything red; the page re-checks on refresh.

---

## When in doubt

- **Cross-cutting data** (titles, blurbs, durations, relationships, changelog, glossary, triage) → `lib/sop-data.js`.
- **Per-SOP content** (the actual procedure) → `sops/<ID>.html`.
- **Visual chrome** (layouts, styles, hero copy) → the specific page.
- **Drift detection** → `system/library-health.html`.

Don't hand-edit the `<article class="card">` markup in `index.html` — those cards are generated from `SOP_LIB.SOPS`. Changes will be wiped on next render.
