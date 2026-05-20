/* Injects a slim "Updated <date>" banner at the top of an SOP page, if there's
   a matching entry in the changelog. Needs window.SOP_LIB (sop-data.js) and
   either window.SOP_ID or <body data-sop="…">. Sits below the top-bar. */
(function () {
  if (!window.SOP_LIB) return;
  const { CHANGELOG } = window.SOP_LIB;
  const id = window.SOP_ID
    || document.body?.dataset?.sop
    || (location.pathname.match(/([A-Z]+\d+)\.html$/) || [])[1];
  if (!id) return;

  // Find most-recent changelog entry for this SOP
  const entry = CHANGELOG
    .filter(e => e.sop === id)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!entry) return;

  const ROOT = location.pathname.includes('/sops/') ? '../' : './';

  // Format date: "May 12, 2026"
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const [yy, mm, dd] = entry.date.split('-');
  const pretty = `${MONTHS[parseInt(mm,10)-1]} ${parseInt(dd,10)}, ${yy}`;

  const style = document.createElement('style');
  style.textContent = `
    .sop-updated-banner{
      background:#faf8f4;
      border-bottom:1px solid #cfd8d3;
      padding:10px 56px;
      font-family:"Montserrat",system-ui,sans-serif;
      display:flex;align-items:center;gap:16px;flex-wrap:wrap;
      position:relative;z-index:5;
    }
    .sop-updated-banner .sub-kind{
      font-size:10.5px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;
      padding:3px 9px;border-radius:999px;
    }
    .sop-updated-banner .sub-kind.updated{ color:#285952; background:#e8f1ee; }
    .sop-updated-banner .sub-kind.new{ color:#e47756; background:rgba(228,119,86,0.14); }
    .sop-updated-banner .sub-date{
      font-family:"Gotham Display","Montserrat",sans-serif;
      font-size:12px;font-weight:900;color:#013942;
      letter-spacing:0.08em;text-transform:uppercase;
    }
    .sop-updated-banner .sub-sum{
      flex:1;min-width:200px;
      font-size:13px;color:#1a2620;line-height:1.4;
    }
    .sop-updated-banner .sub-link{
      font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;
      color:#e47756;text-decoration:none;
      border:1px solid #cfd8d3;border-radius:999px;
      padding:7px 13px;background:#faf8f4;
      transition:all 180ms cubic-bezier(0.4,0,0.2,1);white-space:nowrap;
    }
    .sop-updated-banner .sub-link:hover{
      border-color:#e47756;background:#e47756;color:#faf8f4;
    }
    @media print { .sop-updated-banner { display:none; } }
  `;
  document.head.appendChild(style);

  const banner = document.createElement('div');
  banner.className = 'sop-updated-banner';
  banner.innerHTML = `
    <span class="sub-kind ${entry.kind}">${entry.kind}</span>
    <span class="sub-date">${pretty}</span>
    <span class="sub-sum">${entry.summary}</span>
    <a class="sub-link" href="${ROOT}changelog.html">Full changelog →</a>
  `;

  // Insert after the first .top-bar (sticky). Falls back to body start.
  const topbar = document.querySelector('.top-bar');
  if (topbar && topbar.parentNode) {
    topbar.parentNode.insertBefore(banner, topbar.nextSibling);
  } else {
    document.body.insertBefore(banner, document.body.firstChild);
  }
})();
