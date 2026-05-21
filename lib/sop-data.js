/* ============================================================================
   SOP LIBRARY — single source of truth
   ============================================================================
   This file drives:
     - index.html   (grid cards, onboarding paths, "What changed" strip)
     - triage.html  (decision tree)
     - glossary.html (acronym terms)
     - changelog.html (timeline)
     - per-SOP "Updated" banner (lib/sop-updated-banner.js)
     - per-SOP "Related SOPs" footer (lib/related-footer.js)

   To add a new SOP, change copy, or log a change, edit this file ONLY.
   See MAINTAINERS.md at the project root for step-by-step recipes.
   ============================================================================ */

(function () {

  /* --------------------------------------------------------------------------
     SECTIONS — the grouped rows of the index grid, in display order.
     -------------------------------------------------------------------------- */
  const SECTIONS = [
    { id: 'counter',   title: 'Counter procedures',
      sub: 'Walk-in services performed at the counter and in IASWorld.' },
    { id: 'phones',    title: 'RingCentral phone-system SOPs',
      sub: 'Run on top of CS02. All edits require a snapshot, save, verify, and change-log entry.' },
    { id: 'reporting', title: 'Reporting',
      sub: 'Exporting visitor data with the right filters, in the right format.' },
    { id: 'aio',       title: 'AI Operations',
      sub: 'Daily reviews and monitoring of the A.C.E. chatbot — knowledge gaps, risk signals, and escalation triggers.',
      headerLink: { href: 'system/flow.html', text: 'See how these fit together →' } },
    { id: 'bio',       title: 'AI Operations · Internal Agents',
      sub: 'Internal CustomGPT agents serving office staff, the 33-county Assessor Affiliate, and new-hire onboarding. Narrower audiences, higher stakes, separate change-control track from the public A.C.E. chatbot.',
      titleColor: '#3b2660' },
    { id: 'leap',      title: 'LEAP · District Court',
      sub: 'Operational Services — Case Entry for District Court Assessor Authorizations.' }
  ];

  /* --------------------------------------------------------------------------
     SOPS — every SOP in the library, keyed by id.

     Fields:
       title:        Card / page headline.
       track:        Used by triage results and related-footer ("Customer Service").
       chipClass:    'cs' | 'aio' | 'bio' | 'ref' — body chip styling.
       chipLabel:    Text inside the chip.
       thumbId:      Big number/badge shown inside the 16:9 thumb.
       thumbSub:     Small uppercase label above the thumb id ("SOP CS01 · Reference").
       section:      Matches a SECTIONS[].id — which row of the index grid it lives in.
       dur:          Duration string ("8:36") or document label ("Baseline doc").
       blurb:        One-sentence body description (also used in triage result card).
       searchTags:   Space-separated keywords for index search.
       displayTags:  Visible tag chips at the bottom of the card body.
       watch:        Path to the video page (null/omitted if document-only).
       read:         Path to the written SOP.
       docOnly:      true for reference docs without a video.
     -------------------------------------------------------------------------- */
  const SOPS = {
    CS01: {
      title: 'Veteran Exemption Entry', track: 'Customer Service',
      chipClass: 'cs', chipLabel: 'Customer Service',
      thumbId: '01', thumbSub: 'SOP CS01', section: 'counter', dur: '8:36',
      blurb: 'Receive a Veterans certificate, verify it, endorse the back, and apply the exemption in IASWorld — all the way to commit.',
      searchTags: 'iasworld counter veteran exemption certificate vetx vetw vetp upc',
      displayTags: ['IASWorld','Counter','7 steps'],
      watch: 'videos/CS01_Veteran_Exemption.html', read: 'sops/CS01.html'
    },
    CS02: {
      title: 'RingCentral Admin Portal', track: 'Customer Service',
      chipClass: 'cs', chipLabel: 'Customer Service',
      thumbId: '02', thumbSub: 'SOP CS02 · Reference', section: 'phones', dur: '3:23',
      blurb: 'Sign in and find a call queue. The starting point for every other phone SOP.',
      searchTags: 'ringcentral portal login admin sign in queue extension reference',
      displayTags: ['RingCentral','Prerequisite'],
      watch: 'videos/CS02_RingCentral_Admin_Portal.html', read: 'sops/CS02.html'
    },
    CS03: {
      title: 'Queue Member Management', track: 'Customer Service',
      chipClass: 'cs', chipLabel: 'Customer Service',
      thumbId: '03', thumbSub: 'SOP CS03', section: 'phones', dur: '3:20',
      blurb: 'Add, remove, or temporarily disable people in a phone queue. Two toggles, one outcome.',
      searchTags: 'ringcentral queue member roster add remove disable ring status',
      displayTags: ['RingCentral','Roster'],
      watch: 'videos/CS03_Queue_Member_Management.html', read: 'sops/CS03.html'
    },
    CS04: {
      title: 'Queue Routing & Wait Settings', track: 'Customer Service',
      chipClass: 'cs', chipLabel: 'Customer Service',
      thumbId: '04', thumbSub: 'SOP CS04', section: 'phones', dur: '3:35',
      blurb: 'Choose how a queue distributes calls, how long callers wait, and where the overflow goes.',
      searchTags: 'ringcentral routing rotating fixed simultaneous longest idle wait overflow group',
      displayTags: ['RingCentral','Routing'],
      watch: 'videos/CS04_Queue_Routing.html', read: 'sops/CS04.html'
    },
    CS05: {
      title: 'Holiday & Custom Rules', track: 'Customer Service',
      chipClass: 'cs', chipLabel: 'Customer Service',
      thumbId: '05', thumbSub: 'SOP CS05', section: 'phones', dur: '5:01',
      blurb: 'Holiday closures, scheduled time-of-day routing, A.C.E. chatbot forwarding, and the snow-day Office Closed switch.',
      searchTags: 'holiday custom rules ace chatbot office closed weekly schedule date range',
      displayTags: ['RingCentral','Holidays'],
      watch: 'videos/CS05_Holiday_and_Custom_Rules.html', read: 'sops/CS05.html'
    },
    CS06: {
      title: 'Greetings, Music & Blocked Calls', track: 'Customer Service',
      chipClass: 'cs', chipLabel: 'Customer Service',
      thumbId: '06', thumbSub: 'SOP CS06', section: 'phones', dur: '3:27',
      blurb: "The caller's audio experience — welcome greeting, wait announcements, hold music — and how to filter junk traffic.",
      searchTags: 'greeting hold music blocked calls trusted numbers wait announcement payphone',
      displayTags: ['RingCentral','Audio'],
      watch: 'videos/CS06_Greeting_Music_Blocked.html', read: 'sops/CS06.html'
    },
    CS07: {
      title: 'Queue Identity & Administration', track: 'Customer Service',
      chipClass: 'cs', chipLabel: 'Customer Service',
      thumbId: '07', thumbSub: 'SOP CS07', section: 'phones', dur: '3:20',
      blurb: 'Names, extensions, managers, PINs, direct numbers, voicemail. Rare changes, heavy consequences.',
      searchTags: 'queue identity admin name extension pin sms manager voicemail direct numbers',
      displayTags: ['RingCentral','Admin'],
      watch: 'videos/CS07_Queue_Identity.html', read: 'sops/CS07.html'
    },
    CS08: {
      title: "Route a User's Number into the Queue", track: 'Customer Service',
      chipClass: 'cs', chipLabel: 'Customer Service',
      thumbId: '08', thumbSub: 'SOP CS08', section: 'phones', dur: '3:23',
      blurb: "Send calls dialed to an agent's direct line through the queue — one rule, one condition, one action.",
      searchTags: 'did direct number routing forward switchboard called number condition extension',
      displayTags: ['RingCentral','Routing'],
      watch: 'videos/CS08_Custom_DID_Routing.html', read: 'sops/CS08.html'
    },
    CS09: {
      title: 'Envoy Visitor Data Export', track: 'Customer Service',
      chipClass: 'cs', chipLabel: 'Customer Service',
      thumbId: '09', thumbSub: 'SOP CS09', section: 'reporting', dur: '7:09',
      blurb: 'Pull visitor sign-in data out of Envoy. Filter first — the Alvarado account is shared with the whole county.',
      searchTags: 'envoy visitor data export analytics csv pdf sso microsoft sign-in flow multiple types',
      displayTags: ['Envoy','Reporting','Critical'],
      watch: 'videos/CS09_Envoy_Export.html', read: 'sops/CS09.html'
    },
    CS10: {
      title: 'Missing AA Record for Case Entry', track: 'LEAP',
      chipClass: 'cs', chipLabel: 'Customer Service',
      thumbId: '10', thumbSub: 'SOP CS10 · Sub-procedure', section: 'leap', dur: '4:24',
      blurb: 'Sub-procedure for CS11. Use when the Hearings page is blank after pulling up the parcel.',
      searchTags: 'leap district court case entry missing aa record hearings blank DIST claim for refund iasworld',
      displayTags: ['LEAP','Sub-procedure'],
      watch: 'videos/CS10_Missing_AA_Record.html', read: 'sops/CS10.html'
    },
    CS11: {
      title: 'Case Entry for District Court AAs', track: 'LEAP',
      chipClass: 'cs', chipLabel: 'Customer Service',
      thumbId: '11', thumbSub: 'SOP CS11', section: 'leap', dur: '7:36',
      blurb: 'Full Case Entry procedure for District Court Claims for Refund — IASWorld setup, record creation, notes, email, and physical packet handoff.',
      searchTags: 'leap district court case entry assessor authorization claim for refund stipulated final judgement iasworld AUT',
      displayTags: ['LEAP','IASWorld','14 steps'],
      watch: 'videos/CS11_Case_Entry_District_Court.html', read: 'sops/CS11.html'
    },
    AIO01: {
      title: 'Daily Chatbot Operations Check', track: 'AI Operations',
      chipClass: 'aio', chipLabel: 'AI Operations',
      thumbId: 'A1', thumbSub: 'SOP AIO01', section: 'aio', dur: '2:45',
      blurb: '10-minute morning review of the A.C.E. chatbot. Triage missing content, check risk monitoring, and know when to escalate.',
      searchTags: 'ai operations chatbot ace customgpt analyze missing content risk monitoring daily check',
      displayTags: ['AI Operations','A.C.E.','Daily'],
      watch: 'videos/AIO01_Daily_Check.html', read: 'sops/AIO01.html'
    },
    AIO02: {
      title: 'Weekly Chatbot Conversation Review', track: 'AI Operations',
      chipClass: 'aio', chipLabel: 'AI Operations',
      thumbId: 'A2', thumbSub: 'SOP AIO02', section: 'aio', dur: '3:16',
      blurb: 'Monday morning, 30 minutes. Sample 20 conversations, tag them, run the Spanish canary, export the backup.',
      searchTags: 'ai operations chatbot ace weekly conversation review sample 20 tag good wrong empty spanish canary export backup customgpt ask',
      displayTags: ['AI Operations','A.C.E.','Weekly'],
      watch: 'videos/AIO02_Weekly_Check.html', read: 'sops/AIO02.html'
    },
    AIO03: {
      title: 'Chatbot Change Management', track: 'AI Operations',
      chipClass: 'aio', chipLabel: 'AI Operations',
      thumbId: 'A3', thumbSub: 'SOP AIO03', section: 'aio', dur: '4:59',
      blurb: 'How to change A.C.E. safely — Persona, KB files, Actions, and Configuration. Source, screenshot, save, test, publish, log.',
      searchTags: 'ai operations chatbot ace change management persona kb file actions configuration save publish customgpt',
      displayTags: ['AI Operations','A.C.E.','4 change types'],
      watch: 'videos/AIO03_Change_Management.html', read: 'sops/AIO03.html'
    },
    AIO04: {
      title: 'Monthly Chatbot Metrics Report', track: 'AI Operations',
      chipClass: 'aio', chipLabel: 'AI Operations',
      thumbId: 'A4', thumbSub: 'SOP AIO04', section: 'aio', dur: '3:05',
      blurb: 'First of the month, 30 minutes. Three places to collect from, one tracker row, one email summary. Month-over-month thresholds for governance.',
      searchTags: 'ai operations chatbot ace monthly metrics report executive governance tracker thresholds persona failure not found spanish customgpt analyze',
      displayTags: ['AI Operations','A.C.E.','Monthly'],
      watch: 'videos/AIO04_Monthly_Metrics.html', read: 'sops/AIO04.html'
    },
    AIO05: {
      title: 'Chatbot Incident Response', track: 'AI Operations',
      chipClass: 'aio', chipLabel: 'AI Operations',
      thumbId: 'A5', thumbSub: 'SOP AIO05', section: 'aio', dur: '3:29',
      blurb: 'Four classes of A.C.E. incident. Severity order, contain-before-notify for PII, and when to escalate.',
      searchTags: 'ai operations chatbot ace incident response pii outage abusive user threat customgpt deploy',
      displayTags: ['AI Operations','A.C.E.','Critical'],
      watch: 'videos/AIO05_Incident_Response.html', read: 'sops/AIO05.html'
    },
    AIO06: {
      title: 'A.C.E. Configuration & Sources Baseline', track: 'AI Operations · Reference',
      chipClass: 'ref', chipLabel: 'AI Ops · Reference',
      thumbId: 'A6', thumbSub: 'SOP AIO06 · Reference', section: 'aio', dur: 'Baseline doc',
      blurb: 'The authoritative "as configured" snapshot. What every Personalize tab is set to, every KB source, every Action. Reference for AIO03 change control.',
      searchTags: 'ai operations chatbot ace baseline configuration reference snapshot persona kb sources customgpt audit',
      displayTags: ['AI Operations','A.C.E.','Reference'],
      docOnly: true, read: 'sops/AIO06.html'
    },
    AIO07: {
      title: 'Records Retention & IPRA Response', track: 'AI Operations',
      chipClass: 'aio', chipLabel: 'AI Operations',
      thumbId: 'A7', thumbSub: 'SOP AIO07', section: 'aio', dur: '5:11',
      blurb: 'Retain A.C.E. records and respond to IPRA requests. Part A is ongoing custody & archive; Part B is the 3-day acknowledge / 15-day produce-or-deny clock.',
      searchTags: 'ai operations chatbot ace records retention ipra public records request custodian redact pii ppii lgrrds nmsa 14-2 14-3 archive disposition vendor custody',
      displayTags: ['AI Operations','A.C.E.','Part A + B'],
      watch: 'videos/AIO07_Records_Retention_IPRA.html', read: 'sops/AIO07.html'
    },
    BIO01: {
      title: 'Internal Agent Change Management', track: 'Internal Agent',
      chipClass: 'bio', chipLabel: 'Internal Agent',
      thumbId: 'B1', thumbSub: 'SOP BIO01', section: 'bio', dur: 'Source SOP',
      blurb: 'Same Save+Publish discipline as the public agent, with stricter reviews: County Attorney sign-off for Compliance Expert persona edits; Assessor review for every Paralegal change.',
      searchTags: 'ai operations internal agent compliance expert paralegal onboarding change management persona kb assessor county attorney',
      displayTags: ['Internal','3 agents','A / B / C / D'],
      docOnly: true, read: 'sops/BIO01.html'
    },
    BIO04: {
      title: 'Internal Agent Configuration & Sources Baseline', track: 'Internal Agent · Reference',
      chipClass: 'bio', chipLabel: 'Internal Reference',
      thumbId: 'B4', thumbSub: 'SOP BIO04 · Reference', section: 'bio', dur: 'Baseline doc',
      blurb: 'Per-agent inventory across Compliance Expert, Paralegal, and Onboarding. Canary queries, KB sources, Paralegal access details, open audit items.',
      searchTags: 'ai operations internal agent baseline configuration paralegal compliance expert onboarding canary kb sources customgpt',
      displayTags: ['Internal','3 agents','Reference'],
      docOnly: true, read: 'sops/BIO04.html'
    }
  };

  /* --------------------------------------------------------------------------
     ONBOARDING — recommended learning paths shown on the index.
     Each step: { id, shortName, order }
     -------------------------------------------------------------------------- */
  const ONBOARDING = {
    cs: {
      label: 'Customer Service',
      steps: [
        { id: 'CS02', shortName: 'RingCentral Admin Portal', order: 'Start · 1' },
        { id: 'CS03', shortName: 'Queue Members',            order: 'Then · 2'  },
        { id: 'CS04', shortName: 'Routing & Wait',           order: 'Then · 3'  },
        { id: 'CS05', shortName: 'Holiday & Custom Rules',   order: 'Then · 4'  },
        { id: 'CS06', shortName: 'Greetings & Blocking',     order: 'Then · 5'  },
        { id: 'CS01', shortName: 'Veteran Exemption',        order: 'Finally · 6' }
      ]
    },
    aio: {
      label: 'AI Operations',
      steps: [
        { id: 'AIO01', shortName: 'Daily Check',         order: 'Start · 1' },
        { id: 'AIO02', shortName: 'Weekly Review',       order: 'Then · 2'  },
        { id: 'AIO04', shortName: 'Monthly Metrics',     order: 'Then · 3'  },
        { id: 'AIO03', shortName: 'Change Management',   order: 'Then · 4'  },
        { id: 'AIO05', shortName: 'Incident Response',   order: 'Finally · 5' },
        { id: 'AIO06', shortName: 'Config Baseline',     order: 'Reference' },
        { id: 'AIO07', shortName: 'Records & IPRA',      order: 'Reference' }
      ]
    },
    bio: {
      label: 'Internal Agents',
      steps: [
        { id: 'BIO04', shortName: 'Per-Agent Baseline', order: 'Start · 1' },
        { id: 'BIO01', shortName: 'Change Management',  order: 'Then · 2'  }
      ]
    },
    leap: {
      label: 'LEAP · District Court',
      steps: [
        { id: 'CS11', shortName: 'Case Entry (full)', order: 'Start · 1' },
        { id: 'CS10', shortName: 'Missing AA Record', order: 'Then · 2'  }
      ]
    }
  };

  /* --------------------------------------------------------------------------
     RELATED — manually curated cross-references.
     id -> [{ id, why }]
     -------------------------------------------------------------------------- */
  const RELATED = {
    CS01: [
      { id: 'CS11', why: 'Both are IASWorld counter procedures — similar validate/commit discipline.' }
    ],
    CS02: [
      { id: 'CS03', why: 'CS02 is the prereq — every phone SOP starts here.' },
      { id: 'CS04', why: 'CS02 gets you to the queue; CS04 configures routing.' },
      { id: 'CS07', why: 'Identity edits start from the same Admin Portal landing.' }
    ],
    CS03: [
      { id: 'CS02', why: 'Sign-in prerequisite.' },
      { id: 'CS04', why: 'Adding/removing members affects routing distribution.' },
      { id: 'CS08', why: "Member's direct number (DID) routing lives in CS08." }
    ],
    CS04: [
      { id: 'CS03', why: 'Roster changes change effective routing — review both.' },
      { id: 'CS05', why: 'Holiday & custom rules layer on top of base routing.' },
      { id: 'CS06', why: 'Wait-time announcements are configured in CS06.' },
      { id: 'CS02', why: 'CS02 gets you into the portal; CS04 is where you configure routing.' },
      { id: 'CS08', why: "DID routing into the queue is governed by CS04's overall settings." }
    ],
    CS05: [
      { id: 'CS04', why: 'Custom rules override the base routing defined in CS04.' },
      { id: 'CS06', why: 'Office-Closed greeting audio lives in CS06.' },
      { id: 'AIO01', why: 'A.C.E. chatbot forwarding ties to daily AIO checks.' }
    ],
    CS06: [
      { id: 'CS04', why: 'Wait announcements are surfaced by routing/wait settings.' },
      { id: 'CS05', why: 'Different greetings play for holiday vs business hours.' }
    ],
    CS07: [
      { id: 'CS02', why: 'Same Admin Portal — identity panel is one tab over.' },
      { id: 'CS08', why: "DID/direct-number assignment is identity-adjacent." }
    ],
    CS08: [
      { id: 'CS07', why: 'Identity holds the DID; CS08 routes it into a queue.' },
      { id: 'CS04', why: 'The destination queue is governed by CS04.' },
      { id: 'CS03', why: "The member must be on the queue roster (CS03) for CS08 routing to land calls correctly." }
    ],
    CS09: [
      { id: 'AIO04', why: 'Both are recurring reporting/export procedures.' }
    ],
    CS10: [
      { id: 'CS11', why: 'CS10 is a sub-procedure of CS11 — used when the Hearings page is blank.' }
    ],
    CS11: [
      { id: 'CS10', why: 'Run CS10 first if the AA record is missing.' },
      { id: 'CS01', why: 'Both are IASWorld counter procedures.' }
    ],
    AIO01: [
      { id: 'AIO02', why: 'Daily check escalates patterns to the weekly review.' },
      { id: 'AIO05', why: 'Daily triage may surface an incident — AIO05 takes over.' },
      { id: 'AIO06', why: 'Reference the baseline when something looks different than expected.' },
      { id: 'AIO04', why: 'Daily metrics roll up into the monthly report.' },
      { id: 'CS05', why: 'A.C.E. chatbot forwarding (CS05 holiday rules) is part of the daily check.' }
    ],
    AIO02: [
      { id: 'AIO01', why: 'Weekly aggregates the daily signal.' },
      { id: 'AIO04', why: 'Weekly tags feed the monthly metrics report.' },
      { id: 'AIO03', why: 'Weekly findings can trigger a change via AIO03.' }
    ],
    AIO03: [
      { id: 'AIO06', why: 'Every change must be reflected in the AIO06 baseline.' },
      { id: 'AIO05', why: 'Bad change → roll back via incident response.' },
      { id: 'BIO01', why: 'Internal-agent equivalent change-control procedure.' },
      { id: 'AIO02', why: 'Weekly findings can trigger a change via AIO03.' },
      { id: 'AIO07', why: 'Every AIO03 change log is a record inventoried under AIO07.' }
    ],
    AIO04: [
      { id: 'AIO02', why: 'Weekly tags are the input for monthly thresholds.' },
      { id: 'AIO01', why: 'Daily metrics roll up into the monthly report.' },
      { id: 'CS09', why: 'Both are recurring reporting/export procedures.' }
    ],
    AIO05: [
      { id: 'AIO01', why: 'Most incidents are spotted during the daily check.' },
      { id: 'AIO03', why: 'Containment may require a configuration change.' },
      { id: 'AIO06', why: 'Reference the baseline to confirm what "normal" is.' },
      { id: 'AIO07', why: 'PII discovered during an IPRA search runs AIO05 in parallel.' }
    ],
    AIO06: [
      { id: 'AIO03', why: 'Update the baseline immediately after every change.' },
      { id: 'AIO01', why: 'Daily check verifies live config against this baseline.' },
      { id: 'AIO07', why: 'The baseline is one of the record categories inventoried under AIO07.' },
      { id: 'AIO05', why: 'During an incident, reference the baseline to confirm what "normal" is.' },
      { id: 'BIO04', why: 'Internal-agent counterpart baseline.' }
    ],
    AIO07: [
      { id: 'AIO05', why: 'PII discovered during an IPRA search — contain-before-notify takes over.' },
      { id: 'AIO06', why: 'Baseline & sources are responsive records — inventory them here.' },
      { id: 'BIO04', why: 'Internal-agent baseline & sources, also responsive under IPRA.' },
      { id: 'AIO03', why: 'AIO03 change logs are part of the retention inventory.' },
      { id: 'BIO01', why: 'BIO01 change logs (internal agents) are part of the retention inventory.' }
    ],
    BIO01: [
      { id: 'BIO04', why: 'Reference the per-agent baseline before changing anything.' },
      { id: 'AIO03', why: 'Public-agent equivalent — same discipline, different reviewers.' },
      { id: 'AIO07', why: 'Every BIO01 change log is a record inventoried under AIO07.' }
    ],
    BIO04: [
      { id: 'BIO01', why: 'Source SOP for changes against this baseline.' },
      { id: 'AIO06', why: 'Public-agent counterpart baseline.' },
      { id: 'AIO07', why: 'Internal-agent baseline & sources are responsive records under IPRA.' }
    ]
  };

  /* --------------------------------------------------------------------------
     CHANGELOG — most recent first.
     { date: 'YYYY-MM-DD', sop: 'CS09', kind: 'updated' | 'new', summary: '...' }
     -------------------------------------------------------------------------- */
  const CHANGELOG = [
    { date: '2026-05-21', sop: 'AIO07', kind: 'updated',
      summary: 'Statute citations tightened — denials now cite 14-2-11; fee rule split (free electronic / reasonable for physical, 14-2-9(C)).' },
    { date: '2026-05-21', sop: 'AIO07', kind: 'new',
      summary: 'New SOP: A.C.E. records retention & IPRA response — Part A standing custody, Part B request handling.' },
    { date: '2026-05-12', sop: 'CS09', kind: 'updated',
      summary: 'Clarified Alvarado-shared-account filter step before any export.' },
    { date: '2026-05-08', sop: 'AIO05', kind: 'updated',
      summary: 'PII incident path now reads "contain-before-notify" — order matters.' },
    { date: '2026-05-05', sop: 'CS11', kind: 'updated',
      summary: 'Added physical-packet handoff confirmation as step 14.' },
    { date: '2026-04-29', sop: 'BIO04', kind: 'new',
      summary: 'New baseline document published — covers Paralegal access details.' },
    { date: '2026-04-22', sop: 'CS05', kind: 'updated',
      summary: 'Office-Closed snow-day toggle moved out of holiday rules into its own panel.' },
    { date: '2026-04-15', sop: 'AIO04', kind: 'updated',
      summary: 'Month-over-month thresholds re-baselined: persona failure ≤ 2%.' }
  ];

  /* --------------------------------------------------------------------------
     TRIAGE — decision-tree for "I just got a call about…"
     Nodes either branch (options[*].go) or terminate (.sop or .escalate).
     -------------------------------------------------------------------------- */
  const TRIAGE = {
    root: {
      title: 'What is the caller asking about?',
      eyebrow: 'Step 1 · What kind of call',
      options: [
        { label: 'Phone system', detail: 'RingCentral queue, routing, hold music, voicemail, blocked numbers.', go: 'phones' },
        { label: 'Counter walk-in', detail: 'Someone is at the counter (or asking about) a Veteran Exemption.', go: 'counter' },
        { label: 'District Court case', detail: 'LEAP / Case Entry for Assessor Authorizations.', go: 'leap' },
        { label: 'A.C.E. chatbot', detail: 'Public A.C.E. chatbot misbehaving, broken, or saying something wrong.', go: 'ace' },
        { label: 'Internal AI agent', detail: 'Compliance Expert, Paralegal, or Onboarding CustomGPT.', go: 'internal' },
        { label: 'Visitor / sign-in data', detail: 'Someone needs an Envoy report or visitor export.', go: 'envoy' },
        { label: 'Records request / IPRA', detail: 'Someone is requesting A.C.E. records (logs, persona, config) — or asking about retention.', go: 'records' }
      ]
    },
    records: {
      title: 'Who received the request, and what does it look like?',
      eyebrow: 'Step 2 · IPRA / records',
      options: [
        { label: 'A formal IPRA request from the public', detail: 'In writing, addressed to the office. Statutory clock applies.', sop: 'AIO07' },
        { label: 'Media, oversight body, or litigation-related', detail: 'Treat as IPRA but flag for upstream notify before responding.', go: 'records-sensitive' },
        { label: 'Active PII exposure surfaced during a search', detail: 'A.C.E. is leaking PII right now while we look at logs.', escalate: 'records-pii' },
        { label: 'Internal: how long do we keep this data?', detail: 'Retention/disposition question about an A.C.E. record category.', sop: 'AIO07' },
        { label: "It's a vague ‘can I have the chatbot transcripts’ question", detail: 'Coach the requester to put it in writing, then run AIO07 Part B.', sop: 'AIO07' }
      ]
    },
    'records-sensitive': {
      title: 'Have you notified the Assessor or Deputy yet?',
      eyebrow: 'Step 3 · Notify before responding',
      options: [
        { label: 'Not yet', detail: 'AIO07 B.6 requires notify-before-respond for media, oversight, or litigation.', escalate: 'records-notify' },
        { label: 'Yes — cleared to proceed', detail: 'Continue Part B with the normal clock.', sop: 'AIO07' },
        { label: 'It also implicates Paralegal content', detail: 'Possible attorney-client privilege — notify before responding.', escalate: 'records-notify' }
      ]
    },
    phones: {
      title: 'What about the phone system?',
      eyebrow: 'Step 2 · Phone-system topic',
      options: [
        { label: 'Add or remove a person', detail: 'Someone joining, leaving, or out today and needs to be off the queue.', sop: 'CS03' },
        { label: 'Calls are routing wrong', detail: 'Wait times, overflow, or distribution order is off.', go: 'phones-routing' },
        { label: 'Holiday / closed / snow day', detail: 'Office closure, holiday hours, time-of-day routing.', sop: 'CS05' },
        { label: 'Greeting, hold music, junk calls', detail: 'Greeting wording, on-hold audio, blocked numbers.', sop: 'CS06' },
        { label: 'Rename queue / change ext / PIN', detail: 'Identity, voicemail, direct numbers, manager.', sop: 'CS07' },
        { label: "Route someone's direct line through the queue", detail: 'A user wants calls to their DID to land in the queue.', sop: 'CS08' },
        { label: "I'm not signed in yet", detail: "First time in the Admin Portal — start here.", sop: 'CS02' }
      ]
    },
    'phones-routing': {
      title: 'Is the issue who picks up, or how long callers wait?',
      eyebrow: 'Step 3 · Routing vs wait',
      options: [
        { label: 'Who picks up / order', detail: 'Rotating, fixed, longest-idle, simultaneous, group.', sop: 'CS04' },
        { label: 'How long they wait / overflow', detail: 'Wait time, announcements, where overflow goes.', sop: 'CS04' },
        { label: 'Both — the whole queue is misbehaving', detail: 'Open CS04 for the full routing & wait reference.', sop: 'CS04' }
      ]
    },
    counter: {
      title: 'Do they have a Veteran certificate in hand?',
      eyebrow: 'Step 2 · Counter intake',
      options: [
        { label: 'Yes — they have the certificate', detail: 'Verify, endorse, and apply in IASWorld.', sop: 'CS01' },
        { label: "No — they're asking about eligibility", detail: 'Send to Veterans Services Department.', escalate: 'vet-eligibility' },
        { label: "It's a renewal / status change", detail: 'Same SOP — applicant status (F/L/P) on User Fields.', sop: 'CS01' }
      ]
    },
    leap: {
      title: 'Pull up the parcel — is the Hearings page blank?',
      eyebrow: 'Step 2 · LEAP case entry',
      options: [
        { label: 'Hearings page has an AA record', detail: 'Continue with normal case entry.', sop: 'CS11' },
        { label: 'Hearings page is blank', detail: 'No AA record — run the sub-procedure first.', sop: 'CS10' },
        { label: "I'm not sure what to look for", detail: 'Start with the full CS11 walkthrough.', sop: 'CS11' }
      ]
    },
    ace: {
      title: 'What did A.C.E. do?',
      eyebrow: 'Step 2 · Chatbot triage',
      options: [
        { label: 'Said something wrong / made up an answer', detail: 'Persona failure or hallucination — review and possibly escalate.', go: 'ace-wrong' },
        { label: 'Leaked PII / sensitive info', detail: 'Incident: contain before notifying.', escalate: 'pii' },
        { label: 'Is down / not responding', detail: 'Outage incident path.', sop: 'AIO05' },
        { label: 'Routine daily check', detail: '10-minute morning review.', sop: 'AIO01' },
        { label: 'I want to change something on A.C.E.', detail: 'Persona, KB, Actions, or Configuration.', sop: 'AIO03' },
        { label: "I need this month's metrics report", detail: 'First-of-month governance summary.', sop: 'AIO04' }
      ]
    },
    'ace-wrong': {
      title: 'Is the user upset, or did you just catch it in review?',
      eyebrow: 'Step 3 · Severity',
      options: [
        { label: 'Caller is upset / making a complaint', detail: 'Treat as incident — AIO05.', sop: 'AIO05' },
        { label: 'Caught during daily check', detail: 'Tag in the daily review and consider a change.', sop: 'AIO01' },
        { label: 'Recurring pattern across the week', detail: 'Bring it to the weekly review.', sop: 'AIO02' }
      ]
    },
    internal: {
      title: 'Which internal agent, and what do you need?',
      eyebrow: 'Step 2 · Internal agent',
      options: [
        { label: 'I need to change an internal agent', detail: 'Compliance Expert, Paralegal, or Onboarding.', sop: 'BIO01' },
        { label: 'What is this agent configured with?', detail: 'Per-agent baseline reference.', sop: 'BIO04' },
        { label: "It's misbehaving (not the public chatbot)", detail: 'Treat as incident — log + escalate.', escalate: 'internal-incident' }
      ]
    },
    envoy: {
      title: 'Who is the data for?',
      eyebrow: 'Step 2 · Envoy export',
      options: [
        { label: 'Assessor staff / internal report', detail: 'Filter to Assessor visitor types first.', sop: 'CS09' },
        { label: 'Another county department', detail: 'Same SOP — Alvarado account is shared county-wide.', sop: 'CS09' },
        { label: 'Records request / external', detail: 'Same SOP, then route through records-request process.', sop: 'CS09' }
      ]
    }
  };

  const ESCALATIONS = {
    'vet-eligibility': {
      eyebrow: 'Out of scope · refer',
      h: 'Refer the caller to Veterans Services.',
      body: 'Eligibility determination is not done at the Assessor counter. Refer the caller to Veterans Services Department; once they have a certificate, return here and pick CS01.',
      cta: { label: 'See when to notify the Assessor', href: 'system/notify.html' }
    },
    pii: {
      eyebrow: 'Incident · contain first',
      h: 'Possible PII exposure — go straight to AIO05.',
      body: 'Do not discuss specifics with the caller. Open AIO05 and follow the contain-before-notify path. The Assessor & Deputy are notified only after containment is in motion.',
      cta: { label: 'Open AIO05 · Incident Response', href: 'sops/AIO05.html' }
    },
    'internal-incident': {
      eyebrow: 'Internal incident',
      h: 'Log it and escalate.',
      body: 'Internal agent incidents follow the BIO change-control track. Pull up BIO04 to confirm the agent baseline, then log and escalate per the Notify guide.',
      cta: { label: 'See escalation matrix', href: 'system/notify.html' }
    },
    'records-pii': {
      eyebrow: 'Records search · active exposure',
      h: 'Run AIO05 in parallel — contain before notifying.',
      body: 'If a records search reveals A.C.E. is currently leaking PII, the live exposure is a Type C incident. Pause the agent first, then continue the IPRA response on its own clock. AIO07 step B.6 says explicitly to run AIO05 in addition to this SOP.',
      cta: { label: 'Open AIO05 · Incident Response', href: 'sops/AIO05.html' }
    },
    'records-notify': {
      eyebrow: 'IPRA · notify before responding',
      h: 'Notify the Assessor or Deputy first.',
      body: 'Media, oversight bodies, anticipated litigation, Paralegal/privilege, security-relevant configuration exposure, or the 14-2-10 burdensome route — each one triggers an upstream notify before you respond. The clock keeps ticking, so do it today.',
      cta: { label: 'Open AIO07 · Records Retention & IPRA', href: 'sops/AIO07.html' }
    }
  };

  /* --------------------------------------------------------------------------
     GLOSSARY — A→Z reference terms.
     -------------------------------------------------------------------------- */
  const GLOSSARY = [
    { term: 'A.C.E.', expand: "Assessor's Community Educator", def: "The bilingual AI chatbot deployed by the Bernalillo County Assessor's Office to answer public questions about assessment, exemptions, and related topics. Subject of all AIO procedures.", sops: ['AIO01','AIO02','AIO03','AIO04','AIO05','AIO06'] },
    { term: 'AA', expand: 'Assessor Authorization', def: 'The hearings record that authorizes the Assessor to act on a Claim for Refund. CS10 covers the case where this record is missing.', sops: ['CS10','CS11'] },
    { term: 'AIO', expand: 'AI Operations', def: 'The track for SOPs covering the public A.C.E. chatbot — daily/weekly/monthly checks, change management, incidents, and the configuration baseline.', sops: ['AIO01','AIO02','AIO03','AIO04','AIO05','AIO06'] },
    { term: 'Alvarado', expand: 'Shared Envoy account', def: 'The county-wide Envoy sign-in account. Because it is shared, always filter to Assessor visitor types before any export — CS09 covers this.', sops: ['CS09'] },
    { term: 'BIO', expand: 'Internal Agent Operations', def: 'Internal AI-agent track — Compliance Expert, Paralegal, and Onboarding CustomGPTs. Stricter reviewers, separate change-control from AIO.', sops: ['BIO01','BIO04'] },
    { term: 'Canary', expand: 'Spanish canary query', def: 'A standing reference query in Spanish that tests the chatbot weekly to catch language-quality regressions.', sops: ['AIO02','BIO04'] },
    { term: 'Case Entry', def: 'IASWorld procedure that creates the AA record for a District Court Claim for Refund. Full walkthrough in CS11.', sops: ['CS10','CS11'] },
    { term: 'Change Management', def: 'The Save → Screenshot → Test → Publish → Log discipline used for any A.C.E. (or internal-agent) change. AIO03 is public; BIO01 is internal.', sops: ['AIO03','BIO01'] },
    { term: 'Claim for Refund', def: 'District Court filing that initiates LEAP case entry. Triggers CS11.', sops: ['CS11'] },
    { term: 'Compliance Expert', def: 'One of three internal CustomGPT agents. Persona edits require County Attorney sign-off.', sops: ['BIO01','BIO04'] },
    { term: 'CS', expand: 'Customer Service', def: 'Phone, counter, and reporting SOPs. The largest track in the library.', sops: ['CS01','CS02','CS11'] },
    { term: 'CustomGPT', def: 'The platform hosting both the public A.C.E. and the internal agents.', sops: ['AIO03','AIO06','BIO01','BIO04'] },
    { term: 'DID', expand: 'Direct Inward Dial', def: "A direct phone number assigned to a single user. CS08 covers routing a user's DID into a queue.", sops: ['CS07','CS08'] },
    { term: 'DIST', def: "The IASWorld record code for a District Court Authorization. Surfaces in CS11.", sops: ['CS11'] },
    { term: 'Envoy', def: 'Visitor sign-in system. CS09 covers data export with the shared-account caveat.', sops: ['CS09'] },
    { term: 'EX Details', def: 'IASWorld screen used in CS01 — Reason Code and Add override.', sops: ['CS01'] },
    { term: 'Hearings page', def: 'IASWorld tab where AA records appear during case entry. If blank, run CS10.', sops: ['CS10','CS11'] },
    { term: 'Holiday Rule', def: "RingCentral closure-day routing rule. CS05 covers full-day and partial-day variants.", sops: ['CS05'] },
    { term: 'IASWorld', def: 'Property assessment system of record. Backbone of CS01, CS10, CS11.', sops: ['CS01','CS10','CS11'] },
    { term: 'IPRA', expand: 'Inspection of Public Records Act', def: 'New Mexico public-records statute (Section 14-2-1 et seq. NMSA 1978). AIO07 covers how the office acknowledges, identifies, redacts, and produces A.C.E. records on request.', sops: ['AIO07'] },
    { term: 'LGRRDS', expand: 'Local Government Records Retention and Disposition Schedules', def: 'The state schedule (administered by SRCA) used to map each A.C.E. record category to a retention rule. AIO07 step A.4.', sops: ['AIO07'] },
    { term: 'PPII', expand: 'Protected Personal Identifier Information', def: 'The personal identifiers defined at Section 14-2-6(F) NMSA 1978 that must be redacted before release. Distinct from incident-time PII (AIO05) — this is the IPRA-redaction definition used in AIO07.', sops: ['AIO07','AIO05'] },
    { term: 'Records custodian', def: 'The office position statutorily designated to receive IPRA requests. In AIO07 the statutory clock starts when the custodian receives the request, not when it reaches the AI Project Lead.', sops: ['AIO07'] },
    { term: 'IVR', expand: 'Interactive Voice Response', def: 'The phone-tree experience callers go through before reaching a queue.', sops: ['CS04','CS05','CS06'] },
    { term: 'KB', expand: 'Knowledge Base', def: "The collection of source documents the chatbot reads from. AIO03 governs KB changes; AIO06 is the as-is inventory.", sops: ['AIO03','AIO06','BIO04'] },
    { term: 'LEAP', def: 'Operational Services case-management workflow for District Court Claims for Refund. CS10 + CS11.', sops: ['CS10','CS11'] },
    { term: 'LUC', expand: 'Land Use Code', def: 'IASWorld property classification. CS01 lists the valid LUCs for Veteran Exemption.', sops: ['CS01'] },
    { term: 'Office Closed', def: 'Snow-day / emergency-closure toggle. CS05 — moved into its own panel as of April 2026.', sops: ['CS05'] },
    { term: 'Onboarding agent', def: 'Internal CustomGPT used for new-hire orientation. Covered by BIO01 / BIO04.', sops: ['BIO01','BIO04'] },
    { term: 'Overflow', def: "Where calls go when nobody picks up in the primary queue. CS04 configures this.", sops: ['CS04'] },
    { term: 'Paralegal agent', def: 'Internal CustomGPT serving the 33-county Assessor Affiliate. Every change needs Assessor review.', sops: ['BIO01','BIO04'] },
    { term: 'Persona', def: 'The chatbot’s identity / tone / boundaries. AIO03 governs changes; AIO06 holds the baseline.', sops: ['AIO03','AIO06','BIO04'] },
    { term: 'PII', expand: 'Personally Identifiable Information', def: "If A.C.E. leaks PII live, it's an incident — contain before notifying (AIO05). For PII discovered while answering a records request, redact under AIO07 (and run AIO05 in parallel if it's an active exposure).", sops: ['AIO05','AIO07'] },
    { term: 'PIN', def: 'Voicemail / admin PIN for a queue. CS07 covers changes.', sops: ['CS07'] },
    { term: 'Queue', def: 'A RingCentral phone queue. Every CS phone SOP operates on queues.', sops: ['CS02','CS03','CS04','CS05','CS06','CS07','CS08'] },
    { term: 'REXM', def: "IASWorld note code used when removing a Veteran Exemption. CS01.", sops: ['CS01'] },
    { term: 'RingCentral', def: 'The phone-system platform. CS02 is the entry point; CS03-CS08 layer on top.', sops: ['CS02','CS03','CS04','CS05','CS06','CS07','CS08'] },
    { term: 'Routing', def: 'How calls distribute across queue members — rotating, fixed, longest-idle, simultaneous, group. CS04.', sops: ['CS04'] },
    { term: 'Snapshot', def: "Pre-change screenshot of any RingCentral or CustomGPT screen. Required before edits.", sops: ['CS02','CS04','AIO03','BIO01'] },
    { term: 'SOP', expand: 'Standard Operating Procedure', def: "The animated/written procedure documents in this library.", sops: [] },
    { term: 'Tracker', def: 'The monthly chatbot metrics tracker — one row per month, fed by AIO02 weekly tags.', sops: ['AIO02','AIO04'] },
    { term: 'User Fields', def: 'IASWorld panel where Applicant Status (F/L/P) lives for Vet Exemption.', sops: ['CS01'] },
    { term: 'VETX / VP## / VTW', def: 'Note codes for Veteran Exemption — green cert, partial-disability percent, 100%. CS01.', sops: ['CS01'] }
  ];

  window.SOP_LIB = { SOPS, SECTIONS, ONBOARDING, RELATED, CHANGELOG, TRIAGE, ESCALATIONS, GLOSSARY };
})();
