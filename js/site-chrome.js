/* EmbeddedOS Site Chrome — single source of truth for navbar + footer.
   Injected on EVERY page. Replaces any existing .navbar / .footer on load so
   the whole site shares ONE menu, ONE footer and ONE information architecture.
   Styling lives in css/theme-light.css (loaded as a normal <link> and ensured
   here as a fallback). The baked-in HTML on each page is a graceful no-JS
   fallback. Class names match theme-light.css. */
(function () {
  'use strict';

  document.documentElement.classList.add('site-chrome-pending');

  function ensureThemeStyles() {
    var href = '/css/theme-light.css';
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if ((links[i].getAttribute('href') || '').indexOf('theme-light.css') !== -1) return;
    }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }

  /* ---- Unified information architecture ---------------------------------- */
  var MENU = [
    { type: 'link', href: '/index.html', label: 'Home' },
    { type: 'group', label: 'Products', items: [
      { href: '/products.html',            label: 'All products' },
      { href: '/product-eos.html',         label: 'EoS (RTOS)' },
      { href: '/product-eos-platform.html',label: 'eos-platform' },
      { href: '/product-eboot.html',       label: 'eBootloader' },
      { href: '/product-ebuild.html',      label: 'eBuild' },
      { href: '/product-eai.html',         label: 'EAI' },
      { href: '/product-eni.html',         label: 'ENI' },
      { href: '/product-eipc.html',        label: 'EIPC' },
      { href: '/product-eapps.html',       label: 'eApps' },
      { href: '/product-eosim.html',       label: 'EoSim' },
      { href: '/product-eostudio.html',    label: 'EoStudio' },
      { href: '/product-edb.html',         label: 'eDB' },
      { href: '/product-ebowser.html',     label: 'eBowser' },
      { href: '/product-eoffice.html',     label: 'eOffice' },
      { href: '/product-eserviceapps.html',label: 'eServiceApps' },
      { href: '/ecosystem.html',           label: 'Ecosystem' },
      { href: '/ecosystem-map.html',       label: 'Ecosystem map' }
    ]},
    { type: 'group', label: 'Research', items: [
      { href: '/research.html',       label: 'Neural Link Architecture' },
      { href: '/neural-link-ai.html', label: 'Neural Link & AI' },
      { href: '/ai-os.html',          label: 'AI Operating Systems' },
      { href: '/building-os.html',    label: 'Building OS (Linux/RTOS)' },
      { href: '/future-research.html',label: 'Future Research' },
      { href: '/resources.html',      label: 'Theses & Papers' }
    ]},
    { type: 'group', label: 'Learn', items: [
      { href: '/getting-started.html',label: 'Getting Started' },
      { href: '/documentation.html',  label: 'Documentation' },
      { href: '/docs/index.html',     label: 'Docs' },
      { href: '/books.html',          label: 'Books' },
      { href: '/flow.html',           label: 'Flow' },
      { href: '/kids.html',           label: 'Kids' },
      { href: '/hardware-lab.html',   label: 'Hardware Lab' },
      { href: '/stacks/index.html',   label: 'Stacks' },
      { href: '/faq.html',            label: 'FAQ' },
      { href: '/roadmap.html',        label: 'Roadmap' },
      { href: '/changelog.html',      label: 'Changelog' }
    ]},
    { type: 'group', label: 'Community', items: [
      { href: '/get-involved.html', label: 'Get Involved' },
      { href: '/news.html',         label: 'News' },
      { href: '/events.html',       label: 'Events' },
      { href: '/community.html',    label: 'Community' },
      { href: '/sponsors.html',     label: 'Sponsors' },
      { href: '/index.html#health-devices', label: 'Health Devices' }
    ]},
    { type: 'group', label: 'Foundation', items: [
      { href: '/about.html',        label: 'About' },
      { href: '/organization.html', label: 'Organization' },
      { href: '/projects.html',     label: 'Projects' },
      { href: '/vision.html',       label: 'Vision' },
      { href: '/membership.html',   label: 'Membership' },
      { href: '/certification.html',label: 'Certification' },
      { href: '/internship.html',   label: 'Internship' },
      { href: '/careers.html',      label: 'Careers' },
      { href: '/contact.html',      label: 'Contact' }
    ]}
  ];

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function currentFile() {
    var p = (window.location.pathname || '/').replace(/\/+$/, '');
    if (p === '' ) return '/index.html';
    if (/\/$/.test(window.location.pathname) || p.indexOf('.') === -1) return p + '/index.html';
    return p;
  }

  function isActive(href, cur) {
    var h = href.split('#')[0];
    if (!h) return false;
    return h === cur || ('/' + h.replace(/^\//, '')) === cur;
  }

  function buildNavInner() {
    var cur = currentFile();
    var out = ['<div class="nav-inner">'];
    out.push('<a href="/index.html" class="logo"><span class="logo-icon">EoS</span> EmbeddedOS</a>');
    out.push('<button class="nav-toggle" type="button" aria-label="Menu" aria-expanded="false">&#9776;</button>');
    out.push('<div class="nav-links" id="nav-links">');

    MENU.forEach(function (m) {
      if (m.type === 'link') {
        var a = isActive(m.href, cur) ? ' class="active"' : '';
        out.push('<a href="' + esc(m.href) + '"' + a + '>' + esc(m.label) + '</a>');
      } else {
        var childActive = m.items.some(function (it) { return isActive(it.href, cur); });
        out.push('<details class="nav-dropdown"' + (childActive ? ' open' : '') + '>');
        out.push('<summary>' + esc(m.label) + '</summary>');
        out.push('<div class="nav-dropdown__menu">');
        m.items.forEach(function (it) {
          var a = isActive(it.href, cur) ? ' class="active"' : '';
          out.push('<a href="' + esc(it.href) + '"' + a + '>' + esc(it.label) + '</a>');
        });
        out.push('</div></details>');
      }
    });

    out.push('<a href="/donate.html" class="nav-github nav-donate">Donate</a>');
    out.push('<a href="/membership.html" class="nav-cta">Join Now</a>');
    out.push('<button class="nav-search-btn" type="button" aria-label="Search" title="Search (/)">&#128269;</button>');
    out.push('</div></div>');
    return out.join('');
  }

  var FOOTER_INNER_HTML = [
    '<div class="footer-inner">',
      '<div class="footer-brand">',
        '<h3>EmbeddedOS</h3>',
        '<p>A 501(c)(3) nonprofit building the world’s most complete open-source embedded AI stack — from RTOS kernel to neural interfaces.</p>',
        '<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.9rem">',
          '<span class="badge badge-blue">MIT</span>',
          '<span class="badge badge-green">Open Source</span>',
          '<span class="badge badge-purple">Community</span>',
        '</div>',
      '</div>',
      '<div><h4>Products</h4><ul>',
        '<li><a href="/products.html">All products</a></li>',
        '<li><a href="/product-eos.html">EoS (RTOS)</a></li>',
        '<li><a href="/product-eai.html">EAI</a></li>',
        '<li><a href="/product-eni.html">ENI</a></li>',
        '<li><a href="/product-eboot.html">eBootloader</a></li>',
        '<li><a href="/ecosystem.html">Ecosystem</a></li>',
      '</ul></div>',
      '<div><h4>Learn</h4><ul>',
        '<li><a href="/getting-started.html">Getting Started</a></li>',
        '<li><a href="/documentation.html">Documentation</a></li>',
        '<li><a href="/books.html">Books</a></li>',
        '<li><a href="/flow.html">Flow</a></li>',
        '<li><a href="/kids.html">Kids</a></li>',
        '<li><a href="/hardware-lab.html">Hardware Lab</a></li>',
      '</ul></div>',
      '<div><h4>Research</h4><ul>',
        '<li><a href="/research.html">Neural Link Architecture</a></li>',
        '<li><a href="/neural-link-ai.html">Neural Link & AI</a></li>',
        '<li><a href="/ai-os.html">AI Operating Systems</a></li>',
        '<li><a href="/future-research.html">Future Research</a></li>',
        '<li><a href="/resources.html">Theses & Papers</a></li>',
      '</ul></div>',
      '<div><h4>Foundation</h4><ul>',
        '<li><a href="/about.html">About</a></li>',
        '<li><a href="/organization.html">Organization</a></li>',
        '<li><a href="/membership.html">Membership</a></li>',
        '<li><a href="/careers.html">Careers</a></li>',
        '<li><a href="/donate.html">Donate</a></li>',
        '<li><a href="/contact.html">Contact</a></li>',
      '</ul></div>',
      '<div><h4>Connect</h4><ul class="social-list">',
        '<li><a class="social-link" href="https://github.com/embeddedos-org" target="_blank" rel="noopener"><span class="social-icon">⚙</span> GitHub</a></li>',
        '<li><a class="social-link" href="https://www.youtube.com/@EmbeddedOS_ORG" target="_blank" rel="noopener"><span class="social-icon">▶</span> YouTube</a></li>',
        '<li><a class="social-link" href="https://www.linkedin.com/company/embedded-operating-systems-research-foundation" target="_blank" rel="noopener"><span class="social-icon">in</span> LinkedIn</a></li>',
        '<li><a class="social-link" href="https://x.com/EmbeddedOS_ORG" target="_blank" rel="noopener"><span class="social-icon">\u{1D54F}</span> X</a></li>',
      '</ul></div>',
    '</div>',
    '<div class="footer-bottom">',
      '&copy; 2025–2026 EmbeddedOS Research Foundation • Licensed under MIT • ',
      '<a href="/privacy.html">Privacy</a> • <a href="/terms.html">Terms</a> • ',
      '<a href="/code-of-conduct.html">Code of Conduct</a> • <a href="/security.html">Security</a>',
    '</div>'
  ].join('');

  function inject() {
    try {
      ensureThemeStyles();
      var nav = document.querySelector('header.navbar, nav.navbar');
      if (!nav) {
        nav = document.createElement('header');
        nav.className = 'navbar';
        document.body.insertBefore(nav, document.body.firstChild);
      }
      nav.className = 'navbar site-chrome-nav';
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Main navigation');
      nav.innerHTML = buildNavInner();

      var footer = document.querySelector('footer.footer') || document.querySelector('footer');
      if (!footer) {
        footer = document.createElement('footer');
        document.body.appendChild(footer);
      }
      footer.className = 'footer site-chrome-footer';
      footer.setAttribute('role', 'contentinfo');
      footer.innerHTML = FOOTER_INNER_HTML;

      document.documentElement.classList.add('site-chrome-ready');
      document.documentElement.classList.remove('site-chrome-pending');

      var toggle = nav.querySelector('.nav-toggle');
      if (toggle) {
        toggle.addEventListener('click', function () {
          var links = nav.querySelector('.nav-links');
          if (!links) return;
          var open = links.classList.toggle('open');
          toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
      }

      /* single-open dropdowns on desktop */
      var dds = nav.querySelectorAll('details.nav-dropdown');
      dds.forEach(function (d) {
        d.addEventListener('toggle', function () {
          if (d.open) dds.forEach(function (o) { if (o !== d) o.open = false; });
        });
      });

      var searchBtn = nav.querySelector('.nav-search-btn');
      if (searchBtn) {
        searchBtn.addEventListener('click', function () {
          if (typeof EosSearch !== 'undefined' && typeof EosSearch.open === 'function') EosSearch.open();
        });
      }
    } catch (e) {
      document.documentElement.classList.remove('site-chrome-pending');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
