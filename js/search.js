/* EmbeddedOS — Enhanced Search with fuzzy matching, keyboard nav, recent searches */
var EosSearch = (function () {
  'use strict';

  var pages = [
    { t: 'Home', u: 'index.html', d: 'The Operating System for Every Device', k: 'homepage landing embedded os' },
    { t: 'Get Started', u: 'getting-started.html', d: 'Choose your path and get running in minutes', k: 'install setup quickstart tutorial' },
    { t: 'Documentation Hub', u: 'docs/index.html', d: 'Complete developer documentation for all components', k: 'api reference guide docs' },
    { t: 'Platform Flow', u: 'flow.html', d: 'EoS platform build and deployment flow', k: 'pipeline architecture diagram' },
    { t: 'Kids Guide', u: 'kids.html', d: 'Welcome young explorers to EmbeddedOS', k: 'children learning education beginner' },
    { t: 'Hardware Lab', u: 'hardware-lab.html', d: 'Pick your board and get EoS running on real hardware', k: 'stm32 raspberry pi board flash' },
    { t: 'Book Library', u: 'books.html', d: 'Official reference books for EmbeddedOS ecosystem', k: 'pdf download guide manual' },
    { t: 'App Store', u: 'eApps/index.html', d: '60+ apps across all platforms', k: 'applications marketplace download' },
    { t: 'EoS Kernel', u: 'docs/eos.html', d: 'Modular RTOS kernel with HAL and multicore framework', k: 'rtos hal driver scheduler task' },
    { t: 'eBoot Bootloader', u: 'docs/eboot.html', d: 'Secure A/B bootloader with verified boot chain', k: 'bootloader secure boot firmware update ota' },
    { t: 'ebuild CLI', u: 'docs/ebuild.html', d: 'Unified build system with cross-compilation', k: 'cmake make build compile toolchain sdk' },
    { t: 'EIPC Protocol', u: 'docs/eipc.html', d: 'Secure real-time IPC framework with Go and C SDKs', k: 'ipc message passing socket shared memory' },
    { t: 'EAI Framework', u: 'docs/eai.html', d: 'Embedded AI for on-device LLM inference', k: 'ai ml machine learning neural network llm' },
    { t: 'ENI Neural Interface', u: 'docs/eni.html', d: 'Brain-computer interface framework', k: 'bci neural eeg neuralink brain' },
    { t: 'EoSim Simulator', u: 'docs/eosim.html', d: 'Multi-architecture simulation platform', k: 'simulator emulator qemu renode test' },
    { t: 'EoStudio', u: 'docs/eostudio.html', d: 'Unified design suite with 12 editors', k: 'ide editor cad 3d design ui ux' },
    { t: 'eApps Suite', u: 'docs/eosuite.html', d: '60+ apps for all platforms', k: 'apps suite lvgl mobile desktop' },
    { t: 'eDB Database', u: 'docs/edb.html', d: 'Unified multi-model database', k: 'database sql nosql key-value sqlite' },
    { t: 'eBrowser', u: 'docs/ebrowser.html', d: 'Lightweight web browser engine for embedded devices', k: 'browser html css rendering engine' },
    { t: 'eOffice Suite', u: 'docs/eoffice.html', d: 'AI-powered office suite with 11 apps', k: 'office docs sheets slides email' },
    { t: 'EmbeddedOS Stacks', u: 'stacks/index.html', d: 'Opinionated, version-pinned bundles of canonical product repos (eFab manifests)', k: 'stack stacks bundle manifest efab profile recipe' },
    { t: 'eai-edge Stack', u: 'stacks/eai-edge.html', d: 'Intelligent edge node: ENI + EIPC + eAI (eFab profile)', k: 'eai-edge edge bci neural ai inference manifest pipeline' },
    { t: 'Health Devices', u: 'health.html', d: 'HEALTH-KEY ULTRA, HEALTH-BAND Neuro, HEALTH-RING, HEALTH-LAB — patent-pending biosensing devices', k: 'health ecg emg spo2 glucose biosensor wearable medical' },
    { t: 'Aerospace', u: 'aerospace.html', d: 'AeroSwift Personal and Transit VTOL aircraft with EoS avionics', k: 'aerospace vtol aircraft aeroswift avionics flight drone' },
    { t: 'Patents', u: 'patents.html', d: 'EmbeddedOS patent applications — HEALTH-KEY ULTRA and HEALTH-BAND Neuro', k: 'patent intellectual property ip provisional application' },
    { t: 'Partners', u: 'partners.html', d: 'EmbeddedOS ecosystem partners and collaborators', k: 'partners sponsors collaborators ecosystem' },
    { t: 'Research', u: 'research.html', d: 'EmbeddedOS Foundation research: neural interfaces, embedded AI, RTOS', k: 'research academic papers publications neural ai rtos' },
    { t: 'Resources', u: 'resources.html', d: 'Documentation, books, stacks, hardware lab, and more', k: 'resources learning tutorials guides' },
    { t: 'Events', u: 'events.html', d: 'EmbeddedOS conferences, hackathons, and community meetups', k: 'events conference hackathon meetup workshop' },
    { t: 'Membership', u: 'membership.html', d: 'Join the EmbeddedOS Foundation — Individual, Supporter, Sponsor, Enterprise', k: 'membership join foundation donate sponsor' },
    { t: 'Contact', u: 'contact.html', d: 'Get in touch with the EmbeddedOS Foundation', k: 'contact email support help' },
    { t: 'About', u: 'about.html', d: 'About the Embedded Operating Systems Research Foundation', k: 'about foundation nonprofit 501c3 mission' },
    { t: 'Donate', u: 'donate.html', d: 'Support EmbeddedOS — tax-deductible donations to a 501(c)(3) nonprofit', k: 'donate support fund contribute' },
    { t: 'Vision', u: 'vision.html', d: 'EmbeddedOS vision: the OS for every device', k: 'vision mission goals future' },
    { t: 'Organization', u: 'organization.html', d: 'Embedded Operating Systems Research Foundation — 501(c)(3) nonprofit', k: 'organization foundation board governance' },
    { t: 'All Projects', u: 'projects.html', d: '22 open-source EmbeddedOS repositories across 6 categories', k: 'projects repositories github open source' },
    { t: 'News', u: 'news.html', d: 'Latest EmbeddedOS news, articles, and announcements', k: 'news blog articles announcements updates' },
    { t: 'Ecosystem', u: 'ecosystem.html', d: 'The EmbeddedOS ecosystem — tools, integrations, and community', k: 'ecosystem integrations tools community' },
    { t: 'Internships', u: 'internship.html', d: 'Internships and fellowships at the EmbeddedOS Foundation', k: 'internship fellowship job career student' },
    { t: 'Careers', u: 'careers.html', d: 'Open positions at the EmbeddedOS Foundation', k: 'careers jobs hiring positions' },
    { t: 'Certification', u: 'certification.html', d: 'EmbeddedOS developer certification programs', k: 'certification exam developer badge' },
    { t: 'AI OS', u: 'ai-os.html', d: 'EmbeddedOS eAI — embedded AI inference engine', k: 'ai artificial intelligence inference edge tinyml' },
    { t: 'Neural Link AI', u: 'neural-link-ai.html', d: 'eNI — EmbeddedOS neural interface platform for BCI', k: 'neural bci brain computer interface neuralink' },
    { t: 'Building an OS', u: 'building-os.html', d: 'How EmbeddedOS was designed and built from scratch', k: 'build os kernel design architecture from scratch' },
    { t: 'Future Research', u: 'future-research.html', d: 'Long-term research directions for the EmbeddedOS ecosystem', k: 'future research roadmap long-term vision' },
    { t: 'Licenses', u: 'licenses.html', d: 'EmbeddedOS MIT license information', k: 'license mit open source legal' },
    { t: 'Privacy Policy', u: 'privacy.html', d: 'EmbeddedOS privacy policy', k: 'privacy data gdpr policy' },
    { t: 'Terms of Use', u: 'terms.html', d: 'EmbeddedOS terms of use', k: 'terms conditions legal use' },
  ];

  var overlay, input, results, selectedIdx = -1;
  var RECENT_KEY = 'eos_recent_searches';
  var MAX_RECENT = 5;

  function init() {
    overlay = document.getElementById('eos-search-overlay');
    input = document.getElementById('eos-search-input');
    results = document.getElementById('eos-search-results');
    if (!overlay || !input || !results) return;

    input.addEventListener('input', function () {
      selectedIdx = -1;
      filter(input.value);
    });
    input.addEventListener('keydown', handleKeyboard);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
  }

  function open() {
    if (!overlay) init();
    if (!overlay) return;
    overlay.hidden = false;
    input.value = '';
    selectedIdx = -1;
    renderRecent();
    input.focus();
  }

  function close() {
    if (overlay) overlay.hidden = true;
    selectedIdx = -1;
  }

  function fuzzyMatch(text, query) {
    var lower = text.toLowerCase();
    var q = query.toLowerCase();
    if (lower.includes(q)) return 2;
    // simple token match
    var tokens = q.split(/\s+/);
    var matched = tokens.filter(function (tok) { return lower.includes(tok); });
    if (matched.length === tokens.length) return 1.5;
    if (matched.length > 0) return matched.length / tokens.length;
    return 0;
  }

  function filter(query) {
    if (!query.trim()) { renderRecent(); return; }
    var scored = pages.map(function (p) {
      var score = fuzzyMatch(p.t, query) * 3 +
                  fuzzyMatch(p.d, query) * 2 +
                  fuzzyMatch(p.k || '', query);
      return { page: p, score: score };
    }).filter(function (s) { return s.score > 0; })
      .sort(function (a, b) { return b.score - a.score; });

    render(scored.map(function (s) { return s.page; }));
  }

  function render(items) {
    if (!items.length) {
      results.innerHTML = '<li class="search-result-item" style="color:var(--text-secondary);padding:12px">No results found.</li>';
      return;
    }
    results.innerHTML = items.map(function (p, i) {
      return '<li class="search-result-item" data-idx="' + i + '">' +
        '<a href="' + p.u + '" onclick="EosSearch.saveRecent(\'' + p.t.replace(/'/g, "\\'") + '\')">' +
        '<strong>' + p.t + '</strong><span>' + p.d + '</span></a></li>';
    }).join('');
  }

  function renderRecent() {
    var recent = getRecent();
    if (recent.length) {
      var recentPages = recent.map(function (name) {
        return pages.find(function (p) { return p.t === name; });
      }).filter(Boolean);
      if (recentPages.length) {
        results.innerHTML = '<li style="padding:4px 12px;font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px">Recent</li>' +
          recentPages.map(function (p) {
            return '<li class="search-result-item"><a href="' + p.u + '"><strong>' + p.t + '</strong><span>' + p.d + '</span></a></li>';
          }).join('');
        return;
      }
    }
    render(pages);
  }

  function handleKeyboard(e) {
    var items = results.querySelectorAll('.search-result-item a');
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIdx = Math.min(selectedIdx + 1, items.length - 1);
      updateSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIdx = Math.max(selectedIdx - 1, 0);
      updateSelection(items);
    } else if (e.key === 'Enter' && selectedIdx >= 0 && items[selectedIdx]) {
      e.preventDefault();
      items[selectedIdx].click();
    }
  }

  function updateSelection(items) {
    items.forEach(function (a, i) {
      a.parentElement.style.background = i === selectedIdx ? 'var(--bg-hover)' : '';
    });
    if (items[selectedIdx]) items[selectedIdx].scrollIntoView({ block: 'nearest' });
  }

  function getRecent() {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveRecent(name) {
    try {
      var recent = getRecent().filter(function (r) { return r !== name; });
      recent.unshift(name);
      if (recent.length > MAX_RECENT) recent = recent.slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    } catch (e) { /* localStorage unavailable */ }
  }

  // Global keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault(); open();
    }
    if (e.key === 'Escape') close();
  });

  document.addEventListener('DOMContentLoaded', init);

  return { open: open, close: close, filter: filter, saveRecent: saveRecent, pages: pages };
})();
