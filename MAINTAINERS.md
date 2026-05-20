# Maintaining the SOP library

> **TL;DR — almost every change happens in one file: [`lib/sop-data.js`](lib/sop-data.js).** This file is the single source of truth for SOP metadata, the index grid, the onboarding paths, the changelog, the glossary, the triage decision tree, and SOP cross-references. Edit it, save, refresh — done.

---

## What's where

| File / folder | Purpose | Edit when… |
|---|---|---|
| `lib/sop-data.js` | **Single source of truth.** SOPS, SECTIONS, ONBOARDING, RELATED, CHANGELOG, TRIAGE, ESCALATIONS, GLOSSARY. | Almost any data change |
| `sops/<ID>.html` | The actual written SOP document. | The procedure itself changes |
| `videos/<ID>_*.html` | The animated video version of the SOP. | The video changes |
| `index.html` | Library home page. **Cards and onboarding steps are rendered from `sop-data.js`** — don't hand-edit them. | Only for top-bar, hero, or layout changes |
| `triage.html` | Decision-tree wizard. Reads from `SOP_LIB.TRIAGE`. | Visual chrome only |
| `glossary.html` | A–Z reference. Reads from `SOP_LIB.GLOSSARY`. | Visual chrome only |
| `changelog.html` | Time-grouped log of changes. Reads from `SOP_LIB.CHANGELOG`. | Visual chrome only |
| `quick-ref.html` | 5 printable index cards. **Hand-written** — there's no data backing this. | Quick-ref content changes |
| `lib/related-footer.js` | Auto-injects "Related SOPs" footer into every `sops/*.html` page. | Bug fixes only |
| `lib/sop-updated-banner.js` | Auto-injects "Updated <date>" banner at top of `sops/*.html`. | Bug fixes only |
| `lib/utility-nav.js` | Cross-nav pills on triage / glossary / quick-ref / changelog. | Add a new utility page |
| `system/flow.html`, `system/notify.html`, `system/dashboard.html` | Auxiliary pages linked from the top-bar. | Their own content |

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

That entry will appear in **three places automatically**:
- The "What changed" strip on the index home page (top 3 entries).
- `changelog.html` (full timeline, grouped by month).
- A banner at the top of `sops/CS04.html` showing the most recent change.

`kind` is `'updated'` or `'new'`. Date is ISO `YYYY-MM-DD`. Trim the changelog to ~12 entries occasionally — older entries can be removed once they're no longer interesting.

---

### 🟢 To add a brand-new SOP

1. **Write the SOP page**: copy an existing `sops/<ID>.html` as a template and rename. The auto-inject scripts at the bottom (`sop-data.js`, `related-footer.js`, `sop-updated-banner.js`) require no changes — they auto-detect the SOP id from the filename.
2. **Optionally write a video page**: `videos/<ID>_<slug>.html`.
3. **Open `lib/sop-data.js`** and add an entry to the `SOPS` object. Use a neighboring entry as the template — every field is documented in the file's header comment. Critical fields:
   - `section` — must match an existing `SECTIONS[].id` for the card to render.
   - `chipClass` — `'cs' | 'aio' | 'bio' | 'ref'` (controls body chip color).
   - `thumbId` / `thumbSub` — what shows on the big card thumbnail.
   - `watch` — omit (or set falsy) for document-only SOPs.
4. **Optionally add to `RELATED`** — both an entry for the new SOP and any back-references from sibling SOPs that should point to it.
5. **Optionally add to `ONBOARDING`** if it belongs on a learning path.
6. **Log it in `CHANGELOG`** with `kind: 'new'`.

Refresh `index.html`. The card appears in the right section, search picks it up, the related footer works, the updated banner works.

---

### 🟡 To add or edit a glossary term

1. Open `lib/sop-data.js`.
2. Find the `GLOSSARY` array. Add an entry:

   ```js
   { term: 'KB', expand: 'Knowledge Base',
     def: 'One-sentence definition.',
     sops: ['AIO03','AIO06'] },
   ```

   - `term` is the headword shown in the card.
   - `expand` (optional) is the long-form acronym expansion.
   - `def` is the body text.
   - `sops` is the list of SOP ids where this term appears — they render as chips that link back.

Order in the array doesn't matter; `glossary.html` groups and sorts alphabetically.

---

### 🔵 To add a branch to the triage tree

1. Open `lib/sop-data.js`.
2. Find `TRIAGE`. Each key is a **node**; nodes branch via `options[*].go` (to another node id) or terminate via `options[*].sop` (route to an SOP) / `options[*].escalate` (route to an escalation in `ESCALATIONS`).
3. Add or modify nodes. Pattern:

   ```js
   'my-new-node': {
     title: 'The question the user sees.',
     eyebrow: 'Step N · Short label for the breadcrumb',
     options: [
       { label: 'Short button text', detail: 'Subtext explaining when to pick this.', sop: 'CS04' },
       { label: 'Another choice',    detail: 'When to pick this one.',                go: 'another-node' },
       { label: 'Escalate',          detail: 'Out of scope.',                          escalate: 'pii' }
     ]
   }
   ```

4. If you added an escalation key, add a matching entry to `ESCALATIONS` with `eyebrow`, `h` (headline), `body`, and `cta` (`{label, href}`).

---

### 🟣 To change a learning path on the index

1. Open `lib/sop-data.js`.
2. Find `ONBOARDING`. Two keys (`cs`, `aio`) each have a `steps` array. Each step has `id`, `shortName`, `order`. Reorder, add, or remove. `shortName` is the deliberately-short label shown on the dark onboarding card — keep it under ~24 characters.

---

### ⚪ To update a quick-reference card

Quick-ref cards (`quick-ref.html`) are hand-written. They live as 5 `<article class="card">` blocks. To edit content for an existing card, just edit the markup. To add a 6th card, copy an existing `<article class="card">` block and customize.

These are intentionally **not** data-driven — they're hand-tuned for print and live editing on the page is the fastest way to iterate.

---

## When in doubt

- **All cross-cutting data** (titles, blurbs, durations, relationships, changelog, glossary, triage) → `lib/sop-data.js`.
- **Per-SOP content** (the actual procedure) → `sops/<ID>.html`.
- **Visual chrome** (layouts, styles, hero copy) → the specific page (`index.html`, `triage.html`, etc.).

Don't hand-edit the `<article class="card">` markup in `index.html` — those cards are generated on page load from `SOP_LIB.SOPS`. Changes will be wiped on next render.
