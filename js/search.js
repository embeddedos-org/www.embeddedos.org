/**
 * EmbeddedOS — Site Search
 * Client-side search across all site pages with keyboard shortcuts
 */
(function () {
  'use strict';

  var PAGES = [
    { title: 'Home', url: 'index.html', desc: 'EmbeddedOS Research Foundation — Advancing AI operating systems and neural link technology' },
    { title: 'About Us', url: 'about.html', desc: 'Our mission, team, history, and the vision behind EmbeddedOS' },
    { title: 'Contact', url: 'contact.html', desc: 'Get in touch — general inquiries, support, volunteer opportunities' },
    { title: 'Donate', url: 'donate.html', desc: 'Support the foundation with one-time or recurring donations' },
    { title: 'Membership', url: 'membership.html', desc: 'Join as Individual, Academic, or Enterprise member' },
    { title: 'Certification', url: 'certification.html', desc: 'EoS certification programs and professional credentials' },
    { title: 'Internship', url: 'internship.html', desc: 'Internship program for students and early-career researchers' },
    { title: 'Careers', url: 'careers.html', desc: 'Job openings at the EmbeddedOS Research Foundation' },
    { title: 'Ecosystem', url: 'ecosystem.html', desc: 'The full EoS ecosystem — tools, libraries, and community projects' },
    { title: 'Documentation', url: 'documentation.html', desc: 'Technical documentation, API references, and developer guides' },
    { title: 'Resources', url: 'resources.html', desc: 'Whitepapers, thesis publications, and educational materials' },
    { title: 'Neural Link Architecture', url: 'research.html', desc: 'Research on neural link hardware and protocol design' },
    { title: 'Neural Link & AI', url: 'neural-link-ai.html', desc: 'Integrating AI with neural link interfaces' },
    { title: 'AI Operating Systems', url: 'ai-os.html', desc: 'Research on AI-native operating system design' },
    { title: 'Building OS with Linux/RTOS', url: 'building-os.html', desc: 'Practical guide to building embedded OS with Linux and RTOS' },
    { title: 'Future Research', url: 'future-research.html', desc: 'Emerging research directions and open problems' },
    { title: 'EoS Core', url: 'product-eos.html', desc: 'The core EmbeddedOS real-time operating system kernel' },
    { title: 'EAI — AI Engine', url: 'product-eai.html', desc: 'Embedded AI inference engine for on-device intelligence' },
    { title: 'ENI — Neural Interface', url: 'product-eni.html', desc: 'Neural interface driver and protocol stack' },
    { title: 'EIPC — Secure IPC', url: 'product-eipc.html', desc: 'Secure inter-process communication framework' },
    { title: 'eBoot — Bootloader', url: 'product-eboot.html', desc: 'Secure, verified bootloader for embedded devices' },
    { title: 'eBuild — Build System', url: 'product-ebuild.html', desc: 'Cross-platform build system for EoS projects' },
    { title: 'eApps — App Framework', url: 'product-eapps.html', desc: 'Application framework for EoS ecosystem apps' },
    { title: 'EoSim — Simulator', url: 'product-eosim.html', desc: 'Hardware simulator and emulation environment' },
    { title: 'EoStudio — IDE', url: 'product-eostudio.html', desc: 'Integrated development environment for EoS' },
    { title: 'eDB — Database', url: 'product-edb.html', desc: 'Embedded database engine optimized for constrained environments' },
    { title: 'eBowser — Browser', url: 'product-ebowser.html', desc: 'Lightweight embedded web browser' },
    { title: 'eOffice — Office Suite', url: 'product-eoffice.html', desc: 'Lightweight office productivity suite for EoS' },
    { title: 'eServiceApps', url: 'product-eserviceapps.html', desc: 'Service application templates and microservice toolkit' },
    { title: 'Privacy Policy', url: 'privacy.html', desc: 'How we collect, use, and protect your data' },
    { title: 'Terms of Service', url: 'terms.html', desc: 'Terms and conditions for using EmbeddedOS services' },
    { title: 'Code of Conduct', url: 'code-of-conduct.html', desc: 'Community standards and expected behavior' },
    { title: 'Open Source Licenses', url: 'licenses.html', desc: 'License information for EoS open-source components' }
  ];

  // Build search overlay DOM
  var overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'Site search');
  overlay.insertAdjacentHTML('afterbegin', '<div class="search-box">' +
      '<div class="search-input-wrap">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>' +
        '<input type="text" class="search-input" placeholder="Search EmbeddedOS…" aria-label="Search">' +
        '<button class="search-close" aria-label="Close search">&times);</button>' +
      '</div>' +
      '<div class="search-results" role="listbox"></div>' +
      '<div class="search-hint">Press <kbd>Esc</kbd> to close · <kbd>/</kbd> to open</div>' +
    '</div>';
  document.body.appendChild(overlay);

  var input = overlay.querySelector('.search-input');
  var results = overlay.querySelector('.search-results');
  var closeBtn = overlay.querySelector('.search-close');

  function openSearch() {
    overlay.classList.add('active');
    input.value = '';
    results.textContent = '';
    setTimeout(function () { input.focus(); }, 100);
  }

  function closeSearch() {
    overlay.classList.remove('active');
    input.value = '';
    results.textContent = '';
  }

  function performSearch(query) {
    if (!query || query.length < 2) {
      results.textContent = '';
      return;
    }

    var q = query.toLowerCase();
    var matches = PAGES.filter(function (page) {
      return page.title.toLowerCase().indexOf(q) !== -1 ||
             page.desc.toLowerCase().indexOf(q) !== -1 ||
             page.url.toLowerCase().indexOf(q) !== -1;
    });

    if (matches.length === 0) {
      results.textContent = '';
      var hint = document.createElement('div');
      hint.className = 'search-hint';
      hint.style.marginTop = '2rem';
      hint.textContent = 'No results found for "' + query + '"';
      results.appendChild(hint);
      return;
    }

    var html = '';
    matches.forEach(function (page) {
      html += '<a class="search-result-item" href="' + page.url + '" role="option">' +
        '<div class="title">' + highlightMatch(page.title, q) + '</div>' +
        '<div class="desc">' + highlightMatch(page.desc, q) + '</div>' +
      '</a>';
    });
    // Safe: html is built from internal page metadata (no user input)
    var frag = document.createRange().createContextualFragment(html);
    results.textContent = '';
    results.appendChild(frag);
  }

  function highlightMatch(text, query) {
    var idx = text.toLowerCase().indexOf(query);
    if (idx === -1) return text;
    return text.substring(0, idx) +
      '<mark style="background:#fbbf24;color:#000;border-radius:2px;padding:0 2px">' +
      text.substring(idx, idx + query.length) +
      '</mark>' +
      text.substring(idx + query.length);
  }

  // Event listeners
  input.addEventListener('input', function () {
    performSearch(this.value.trim());
  });

  closeBtn.addEventListener('click', closeSearch);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeSearch();
  });

  // Keyboard: "/" to open, Escape to close, arrow keys to navigate results
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !overlay.classList.contains('active')) {
      var tag = (document.activeElement || {}).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeSearch();
    }
  });

  input.addEventListener('keydown', function (e) {
    var items = results.querySelectorAll('.search-result-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[0].focus();
    }
  });

  results.addEventListener('keydown', function (e) {
    var items = Array.from(results.querySelectorAll('.search-result-item'));
    var idx = items.indexOf(document.activeElement);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      (items[idx + 1] || items[0]).focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (idx <= 0) { input.focus(); }
      else { items[idx - 1].focus(); }
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  });

  // Expose global open function for nav search buttons
  window.EosSearch = { open: openSearch, close: closeSearch };
})();
