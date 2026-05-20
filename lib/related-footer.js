/* Auto-injects a "Related SOPs" footer + a small "back to library" / "see related" affordance
   into any SOP page. The host page should declare its own SOP id in <body data-sop="CS01">,
   OR via window.SOP_ID = 'CS01' before this script loads.
   Designed to be visually consistent with the BernCo Assessor design system. */
(function () {
  if (!window.SOP_LIB) return;
  const { SOPS, RELATED } = window.SOP_LIB;

  const id = window.SOP_ID
    || document.body?.dataset?.sop
    || (location.pathname.match(/([A-Z]+\d+)\.html$/) || [])[1];
  if (!id || !RELATED[id]) return;

  // Resolve relative path back to project root from /sops/<id>.html
  const ROOT = location.pathname.includes('/sops/') ? '../' : './';

  const style = document.createElement('style');
  style.textContent = `
    .related-footer{
      background:#f4f8f6;border-top:2px solid #cfd8d3;
      padding:48px 56px 64px;font-family:"Montserrat",system-ui,sans-serif;
    }
    .related-footer .rf-head{
      display:flex;align-items:baseline;justify-content:space-between;
      gap:24px;flex-wrap:wrap;margin-bottom:24px;max-width:1080px;
    }
    .related-footer .rf-eyebrow{
      font-size:11px;font-weight:700;color:#5a6b65;
      letter-spacing:0.18em;text-transform:uppercase;
    }
    .related-footer h2{
      font-family:"Gotham Display","Montserrat",sans-serif;
      font-size:34px;font-weight:900;color:#285952;
      text-transform:uppercase;letter-spacing:-0.01em;
      margin:4px 0 0;line-height:1;
    }
    .related-footer .rf-back{
      font-size:12px;font-weight:700;letter-spacing:0.14em;
      text-transform:uppercase;color:#013942;text-decoration:none;
      border:1px solid #cfd8d3;border-radius:999px;
      padding:9px 16px;background:#faf8f4;
      transition:all 180ms cubic-bezier(0.4,0,0.2,1);
    }
    .related-footer .rf-back:hover{
      border-color:#285952;color:#285952;background:#e8f1ee;
    }
    .related-footer .rf-grid{
      display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
      gap:16px;max-width:1080px;
    }
    .related-footer .rf-card{
      display:flex;flex-direction:column;gap:10px;
      background:#faf8f4;border:1px solid #cfd8d3;border-radius:12px;
      padding:22px 22px 20px;text-decoration:none;color:inherit;
      transition:all 180ms cubic-bezier(0.4,0,0.2,1);position:relative;
    }
    .related-footer .rf-card:hover{
      border-color:#285952;transform:translateY(-2px);
      box-shadow:0 12px 28px rgba(15,30,27,0.10);
    }
    .related-footer .rf-card .rf-id{
      font-family:"Gotham Display","Montserrat",sans-serif;
      font-size:11px;font-weight:900;letter-spacing:0.22em;
      color:#e47756;text-transform:uppercase;
    }
    .related-footer .rf-card h3{
      font-family:"Gotham Display","Montserrat",sans-serif;
      font-size:19px;font-weight:900;line-height:1.05;
      color:#285952;text-transform:uppercase;letter-spacing:-0.005em;
      margin:0;
    }
    .related-footer .rf-card .rf-why{
      font-size:13px;color:#1a2620;line-height:1.5;margin:2px 0 0;
    }
    .related-footer .rf-card .rf-arrow{
      position:absolute;top:18px;right:20px;
      width:30px;height:30px;border-radius:50%;
      background:#e8f1ee;color:#285952;
      display:flex;align-items:center;justify-content:center;
      transition:all 180ms cubic-bezier(0.4,0,0.2,1);
    }
    .related-footer .rf-card:hover .rf-arrow{
      background:#e47756;color:#faf8f4;transform:translate(2px,-2px);
    }
    @media print { .related-footer { display:none; } }
  `;
  document.head.appendChild(style);

  const items = RELATED[id]
    .map(r => ({ ...r, meta: SOPS[r.id] }))
    .filter(r => r.meta);

  if (!items.length) return;

  const arrow = '<svg class="rf-arrow" width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  const cards = items.map(r => `
    <a class="rf-card" href="${ROOT}sops/${r.id}.html">
      ${arrow.replace('class="rf-arrow"', 'class="rf-arrow"')}
      <div class="rf-id">SOP ${r.id} · ${r.meta.track}</div>
      <h3>${r.meta.title}</h3>
      <p class="rf-why">${r.why}</p>
    </a>
  `).join('');

  const footer = document.createElement('section');
  footer.className = 'related-footer';
  footer.innerHTML = `
    <div class="rf-head">
      <div>
        <div class="rf-eyebrow">If you came here you may also need</div>
        <h2>Related SOPs</h2>
      </div>
      <a class="rf-back" href="${ROOT}index.html">← All SOPs</a>
    </div>
    <div class="rf-grid">${cards}</div>
  `;
  document.body.appendChild(footer);
})();
