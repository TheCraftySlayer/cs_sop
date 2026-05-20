/* Utility-page cross-nav. Drops a pill-row of links into the top-bar
   of triage / glossary / quick-ref / changelog pages so they can reach
   each other without bouncing back through the index.

   Page sets `window.UTIL_PAGE = 'triage' | 'glossary' | 'quickref' | 'changelog'`
   before this script loads. Current page is omitted from the row. */
(function () {
  const CURRENT = window.UTIL_PAGE || '';
  const LINKS = [
    { id: 'triage',    href: 'triage.html',    label: 'Triage',    primary: true,
      svg: '<svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 1.5L7 4M7 1.5L4.5 4M7 1.5L9.5 4M4 6L1.5 9.5M4 6L4 9.5M4 6L7 9.5M10 6L12.5 9.5M10 6L10 9.5M10 6L7 9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="11.5" r="1" fill="currentColor"/></svg>' },
    { id: 'glossary',  href: 'glossary.html',  label: 'Glossary',
      svg: '<svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 2h8v10H3zM3 2v10M5 5h4M5 7h4M5 9h3" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round"/></svg>' },
    { id: 'quickref',  href: 'quick-ref.html', label: 'Quick-ref',
      svg: '<svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="2" y="3" width="10" height="8" rx="1" stroke="currentColor" stroke-width="1.3"/><path d="M4.5 6h5M4.5 8h3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>' },
    { id: 'changelog', href: 'changelog.html', label: 'Changelog',
      svg: '<svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.3"/><path d="M7 4v3l2 1.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>' }
  ];

  const style = document.createElement('style');
  style.textContent = `
    .util-nav {
      display: flex; gap: 8px; align-items: center;
      padding-left: 24px; border-left: 1px solid #cfd8d3;
      flex-wrap: wrap;
    }
    .util-nav a {
      display: inline-flex; align-items: center; gap: 7px;
      padding: 7px 13px; border: 1px solid #cfd8d3; border-radius: 999px;
      font-size: 12px; font-weight: 600; color: #013942;
      text-decoration: none; letter-spacing: 0.04em;
      transition: all 180ms cubic-bezier(0.4, 0, 0.2, 1);
      background: #faf8f4;
      font-family: "Montserrat", system-ui, sans-serif;
    }
    .util-nav a:hover { background: #e8f1ee; border-color: #285952; color: #285952; }
    .util-nav a svg { color: #e47756; }
    .util-nav a.primary { background: #e47756; color: #faf8f4; border-color: #e47756; }
    .util-nav a.primary svg { color: #faf8f4; }
    .util-nav a.primary:hover { background: #c95f3f; border-color: #c95f3f; color: #faf8f4; }
    @media (max-width: 760px) {
      .util-nav { padding-left: 0; border-left: 0; width: 100%; order: 5; }
    }
    @media print { .util-nav { display: none; } }
  `;
  document.head.appendChild(style);

  const nav = document.createElement('nav');
  nav.className = 'util-nav';
  nav.setAttribute('aria-label', 'Reference utilities');
  nav.innerHTML = LINKS
    .filter(l => l.id !== CURRENT)
    .map(l => `<a class="${l.primary ? 'primary' : ''}" href="${l.href}">${l.svg}${l.label}</a>`)
    .join('');

  // Insert into top-bar after the .crumb (if any), else at start of top-bar
  const topbar = document.querySelector('.top-bar');
  if (!topbar) return;
  const crumb = topbar.querySelector('.crumb');
  if (crumb && crumb.nextSibling) topbar.insertBefore(nav, crumb.nextSibling);
  else if (crumb) topbar.appendChild(nav);
  else topbar.insertBefore(nav, topbar.firstChild);
})();
