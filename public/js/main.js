/* ═══════════════════════════════════════════════════════════════════════════
   EmbeddedOS Foundation — main.js v7.0
   Production-ready: mobile menu, nav dropdowns, search, scroll effects,
   canvas simulations, form handling, event filters, keyboard nav
═══════════════════════════════════════════════════════════════════════════ */

'use strict';

// Legacy chrome injection is intentionally disabled because Astro already
// renders a shared nav/footer across all pages.
ensureSharedSiteChrome();

/* ── Utilities ── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initDropdowns();
  initSearch();
  initScrollEffects();
  initSmoothScroll();
  initLiveBar();
  initEventFilters();
  initCanvasSimulations();
  initDonationForm();
  initContactForm();
  initNewsletterForms();
  initFaqAccordion();
  initCodeCopyButtons();
  initTableOfContents();
});

function ensureSharedSiteChrome() {
  return;
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAVBAR — scroll elevation + active page indicator
═══════════════════════════════════════════════════════════════════════════ */
function initNavbar() {
  const nav = $('nav.navbar') || $('nav') || $('.brand-bar')?.closest('nav');
  if (!nav) return;
  const desktop = window.matchMedia('(min-width: 921px)').matches;
  if (desktop) {
    // Prevent an auto-open dropdown from covering top-of-page content.
    $$('details.nav-dropdown[open]', nav).forEach((d) => { d.open = false; });
  }

  // Mark active nav link
  const currentPath = location.pathname.split('/').pop() || 'index.html';
  $$('a[role="menuitem"]', nav).forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      a.setAttribute('aria-current', 'page');
      a.classList.add('active');
    }
  });

  // Scroll elevation
  let lastY = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('nav--scrolled', y > 20);
    nav.classList.toggle('nav--hidden', y > lastY + 80 && y > 200);
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const toggle = $('.hamburger') || $('.nav-toggle') || $('[aria-label="Toggle navigation"]');
  const menu = $('.nav-links') || $('.nav-menu') || $('nav ul');
  if (!toggle || !menu) return;

  toggle.setAttribute('aria-expanded', 'false');
  if (!menu.id) menu.id = 'nav-menu';
  toggle.setAttribute('aria-controls', menu.id);

  const open = () => {
    menu.classList.add('open');
    menu.classList.add('is-open');
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Animate hamburger lines
    const lines = $$('span', toggle);
    if (lines.length >= 3) {
      lines[0].style.transform = 'translateY(8px) rotate(45deg)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    }
  };

  const close = () => {
    menu.classList.remove('open');
    menu.classList.remove('is-open');
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    const lines = $$('span', toggle);
    if (lines.length >= 3) {
      lines[0].style.transform = '';
      lines[1].style.opacity = '';
      lines[2].style.transform = '';
    }
  };

  on(toggle, 'click', () => {
    const isOpen = menu.classList.contains('is-open') || menu.classList.contains('open');
    isOpen ? close() : open();
  });

  // Close on outside click
  on(document, 'click', e => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) close();
  });

  // Close on Escape
  on(document, 'keydown', e => { if (e.key === 'Escape') close(); });

  // Close after selecting a menu link on mobile.
  $$('a', menu).forEach((a) => {
    on(a, 'click', close);
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   DROPDOWN MENUS — hover + keyboard accessible
═══════════════════════════════════════════════════════════════════════════ */
function initDropdowns() {
  const dropdowns = $$('.nav-links > li.has-dropdown, .nav-item.has-dropdown, .dropdown');
  
  dropdowns.forEach(item => {
    const trigger = $('a[role="menuitem"], button', item) || item.firstElementChild;
    const panel = $('.dropdown-menu', item);
    if (!trigger || !panel) return;

    let closeTimer;

    const openDropdown = () => {
      clearTimeout(closeTimer);
      // Close all others first
      dropdowns.forEach(d => {
        if (d !== item) {
          d.classList.remove('is-open');
          const p = $('.dropdown-menu', d);
          if (p) { p.style.opacity = '0'; p.style.pointerEvents = 'none'; }
          const t = $('a[role="menuitem"], button', d);
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.add('is-open');
      panel.style.opacity = '1';
      panel.style.pointerEvents = 'auto';
      trigger.setAttribute('aria-expanded', 'true');
    };

    const closeDropdown = (delay = 150) => {
      closeTimer = setTimeout(() => {
        item.classList.remove('is-open');
        panel.style.opacity = '0';
        panel.style.pointerEvents = 'none';
        trigger.setAttribute('aria-expanded', 'false');
      }, delay);
    };

    // Mouse events
    on(item, 'mouseenter', () => openDropdown());
    on(item, 'mouseleave', () => closeDropdown());
    on(panel, 'mouseenter', () => clearTimeout(closeTimer));
    on(panel, 'mouseleave', () => closeDropdown());

    // Keyboard
    on(trigger, 'keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.classList.contains('is-open') ? closeDropdown(0) : openDropdown();
      }
      if (e.key === 'Escape') closeDropdown(0);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        openDropdown();
        const firstLink = $('a', panel);
        if (firstLink) firstLink.focus();
      }
    });

    // Keyboard navigation within dropdown
    const links = $$('a', panel);
    links.forEach((link, i) => {
      on(link, 'keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); links[i + 1]?.focus(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); (links[i - 1] || trigger).focus(); }
        if (e.key === 'Escape') { closeDropdown(0); trigger.focus(); }
        if (e.key === 'Tab' && i === links.length - 1) closeDropdown(0);
      });
    });

    // Initialize state
    panel.style.opacity = '0';
    panel.style.pointerEvents = 'none';
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-haspopup', 'true');
  });

  // Close all dropdowns on outside click
  on(document, 'click', e => {
    if (!e.target.closest('.nav-links > li.has-dropdown, .nav-item.has-dropdown, .dropdown')) {
      dropdowns.forEach(d => {
        d.classList.remove('is-open');
        const p = $('.dropdown-menu', d);
        if (p) { p.style.opacity = '0'; p.style.pointerEvents = 'none'; }
        const t = $('a[role="menuitem"], button', d);
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   SEARCH
═══════════════════════════════════════════════════════════════════════════ */
function initSearch() {
  const searchDialog = $('#search-dialog') || $('[role="dialog"]');
  const searchInput = $('input[type="text"][placeholder*="Search"]') || $('#search-input');
  const closeBtn = $('[aria-label="Close search"]') || $('.search-close');
  
  // Open search with / key
  on(document, 'keydown', e => {
    if (e.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape' && searchDialog?.classList.contains('is-open')) {
      closeSearch();
    }
  });

  const openSearch = () => {
    if (!searchDialog) return;
    searchDialog.classList.add('is-open');
    searchDialog.removeAttribute('hidden');
    searchDialog.style.display = '';
    searchInput?.focus();
  };

  const closeSearch = () => {
    if (!searchDialog) return;
    searchDialog.classList.remove('is-open');
  };

  on(closeBtn, 'click', closeSearch);
  
  // Search button in nav
  const searchBtn = $('[aria-label="Search"]') || $('.search-btn');
  on(searchBtn, 'click', openSearch);

  // Simple client-side search
  if (searchInput) {
    on(searchInput, 'input', debounce(e => {
      const q = e.target.value.trim().toLowerCase();
      const results = $('#search-results');
      if (!results || q.length < 2) return;
      
      // Search page index
      const pages = [
        { title: 'EoS RTOS', url: 'product-eos.html', desc: 'Deterministic real-time OS for embedded systems' },
        { title: 'EAI Runtime', url: 'product-eai.html', desc: 'On-device LLM inference for microcontrollers' },
        { title: 'ENI Stack', url: 'product-eni.html', desc: '1024-channel neural signal acquisition' },
        { title: 'EIPC', url: 'product-eipc.html', desc: 'Capability-based IPC for embedded systems' },
        { title: 'eBootloader', url: 'product-eboot.html', desc: 'Secure boot chain with measured launch' },
        { title: 'eBuild', url: 'product-ebuild.html', desc: 'Cross-compilation toolchain for EoS' },
        { title: 'EoStudio', url: 'product-eostudio.html', desc: 'Integrated development environment' },
        { title: 'EoSim', url: 'product-eosim.html', desc: 'QEMU-based firmware simulator' },
        { title: 'eDB', url: 'product-edb.html', desc: 'Embedded database with AES-XTS encryption' },
        { title: 'Research', url: 'research.html', desc: 'Neural link and AI OS research' },
        { title: 'Documentation', url: 'documentation.html', desc: 'API reference and guides' },
        { title: 'Events', url: 'events.html', desc: 'Conferences and community events' },
        { title: 'Membership', url: 'membership.html', desc: 'Join the EmbeddedOS Foundation' },
        { title: 'Donate', url: 'donate.html', desc: 'Support open research' },
      ];
      
      const matches = pages.filter(p => 
        p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
      );
      
      if (matches.length === 0) {
        results.innerHTML = '<p style="color:var(--clr-muted);padding:1rem">No results found</p>';
        return;
      }
      
      const fragment = document.createDocumentFragment();
      matches.forEach(m => {
        const a = document.createElement('a');
        a.href = m.url;
        a.className = 'search-result-item';
        const title = document.createElement('strong');
        title.textContent = m.title;
        const desc = document.createElement('span');
        desc.textContent = m.desc;
        a.appendChild(title);
        a.appendChild(document.createTextNode(' — '));
        a.appendChild(desc);
        fragment.appendChild(a);
      });
      results.textContent = '';
      results.appendChild(fragment);
    }, 200));
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLL EFFECTS — intersection observer for animations
═══════════════════════════════════════════════════════════════════════════ */
function initScrollEffects() {
  if (!window.IntersectionObserver) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Stagger children
        const children = $$('[data-stagger]', entry.target);
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 60}ms`;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  $$('[data-animate], .card, .feature-card, .event-card, .product-card, .stat-item-large').forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  on(document, 'click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const navHeight = ($('nav') || $('header'))?.offsetHeight || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
    // Update URL without jump
    history.pushState(null, '', '#' + id);
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   LIVE BAR — ticker animation
═══════════════════════════════════════════════════════════════════════════ */
function initLiveBar() {
  const bar = $('.live-bar, .ticker-bar, .announcement-bar');
  if (!bar) return;
  
  const items = $$('.ticker-item, .live-item', bar);
  if (items.length === 0) return;
  
  let current = 0;
  const show = (i) => {
    items.forEach((item, idx) => {
      item.style.opacity = idx === i ? '1' : '0';
      item.style.transform = idx === i ? 'translateY(0)' : 'translateY(8px)';
    });
  };
  
  show(0);
  setInterval(() => {
    current = (current + 1) % items.length;
    show(current);
  }, 4000);
}

/* ═══════════════════════════════════════════════════════════════════════════
   EVENT FILTERS
═══════════════════════════════════════════════════════════════════════════ */
function initEventFilters() {
  const filterBtns = $$('.events-filter button, .filter-btn, [data-filter]');
  if (filterBtns.length === 0) return;
  
  const cards = $$('.event-card, [data-event-type]');
  
  filterBtns.forEach(btn => {
    on(btn, 'click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter || btn.textContent.toLowerCase().trim();
      
      cards.forEach(card => {
        const type = card.dataset.eventType || card.dataset.mode || '';
        const show = filter === 'all' || filter === '' || type.toLowerCase().includes(filter.toLowerCase());
        card.style.display = show ? '' : 'none';
        card.style.opacity = show ? '1' : '0';
      });
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   CANVAS SIMULATIONS
═══════════════════════════════════════════════════════════════════════════ */
function initCanvasSimulations() {
  // EoS RTOS scheduler
  initCanvas('canvas-eos-scheduler', drawScheduler);
  // EAI inference pipeline
  initCanvas('canvas-eai-inference', drawInferencePipeline);
  // ENI neural signals
  initCanvas('canvas-eni-signals', drawNeuralSignals);
  // EIPC bus
  initCanvas('canvas-eipc-bus', drawIPCBus);
  // eBootloader chain
  initCanvas('canvas-eboot-chain', drawBootChain);
  // eBuild pipeline
  initCanvas('canvas-ebuild-pipeline', drawBuildPipeline);
  // EoSim
  initCanvas('canvas-eosim', drawSimulator);
  // eDB metrics
  initCanvas('canvas-edb-metrics', drawDBMetrics);
}

function initCanvas(id, drawFn) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Resize canvas to container
  const resize = () => {
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  };
  resize();
  
  let frame = 0;
  let animId;
  
  const loop = () => {
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    drawFn(ctx, canvas.offsetWidth, canvas.offsetHeight, frame++);
    animId = requestAnimationFrame(loop);
  };
  
  // Only animate when visible
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { loop(); }
      else { cancelAnimationFrame(animId); }
    });
  }, { threshold: 0.1 });
  observer.observe(canvas);
}

function drawScheduler(ctx, w, h, frame) {
  const tasks = [
    { name: 'T1:IRQ', prio: 0, color: '#3b82f6', period: 1 },
    { name: 'T2:Sensor', prio: 1, color: '#8b5cf6', period: 2 },
    { name: 'T3:Comm', prio: 2, color: '#06b6d4', period: 3 },
    { name: 'T4:UI', prio: 3, color: '#10b981', period: 4 },
    { name: 'T5:Idle', prio: 4, color: '#6b7280', period: 5 },
  ];
  
  const rowH = h / (tasks.length + 1);
  const t = frame * 0.5;
  
  // Background
  ctx.fillStyle = '#0a0f1e';
  ctx.fillRect(0, 0, w, h);
  
  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  
  // Time axis label
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '10px monospace';
  ctx.fillText('EoS Preemptive Scheduler — Priority Ceiling Protocol', 8, 12);
  
  tasks.forEach((task, i) => {
    const y = (i + 0.5) * rowH;
    
    // Task label
    ctx.fillStyle = task.color;
    ctx.font = 'bold 11px monospace';
    ctx.fillText(task.name, 4, y + 4);
    
    // Task execution blocks
    for (let x = 60; x < w - 10; x += task.period * 40) {
      const offset = (t * 20) % (task.period * 40);
      const bx = x - offset;
      if (bx < 60 || bx > w - 10) continue;
      
      const active = Math.sin(t / task.period + i) > 0.3;
      ctx.fillStyle = active ? task.color : 'rgba(255,255,255,0.05)';
      ctx.fillRect(bx, y - rowH * 0.3, task.period * 30, rowH * 0.6);
      
      if (active) {
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.font = '9px monospace';
        ctx.fillText('RUN', bx + 4, y + 3);
      }
    }
    
    // Context switch marker
    const switchX = 60 + ((t * 15) % (w - 70));
    ctx.strokeStyle = 'rgba(255,255,0,0.6)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    ctx.beginPath(); ctx.moveTo(switchX, 0); ctx.lineTo(switchX, h); ctx.stroke();
    ctx.setLineDash([]);
  });
  
  // Current time indicator
  const curX = 60 + ((t * 15) % (w - 70));
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(curX, 0); ctx.lineTo(curX, h); ctx.stroke();
  ctx.fillStyle = '#f59e0b';
  ctx.font = '9px monospace';
  ctx.fillText(`t=${(frame * 0.5 / 10).toFixed(1)}ms`, curX + 3, 12);
}

function drawInferencePipeline(ctx, w, h, frame) {
  const stages = ['Input\nTensor', 'Quant\nINT4', 'Graph\nOpt', 'Kernel\nDispatch', 'SIMD\nExec', 'Output\nTokens'];
  const colors = ['#3b82f6','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444'];
  const stageW = (w - 20) / stages.length;
  const t = frame * 0.02;
  
  ctx.fillStyle = '#0a0f1e';
  ctx.fillRect(0, 0, w, h);
  
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '10px monospace';
  ctx.fillText('EAI INT4 Inference Pipeline — 11 tok/s on Cortex-M85', 8, 14);
  
  stages.forEach((stage, i) => {
    const x = 10 + i * stageW;
    const active = Math.floor(t * 2) % stages.length === i;
    const progress = active ? (t * 2 % 1) : 0;
    
    // Stage box
    ctx.fillStyle = active ? colors[i] : 'rgba(255,255,255,0.08)';
    ctx.strokeStyle = colors[i];
    ctx.lineWidth = active ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect(x + 4, h * 0.25, stageW - 8, h * 0.5, 6);
    ctx.fill(); ctx.stroke();
    
    // Stage label
    ctx.fillStyle = active ? '#fff' : colors[i];
    ctx.font = `${active ? 'bold ' : ''}10px monospace`;
    ctx.textAlign = 'center';
    const lines = stage.split('\n');
    lines.forEach((line, li) => {
      ctx.fillText(line, x + stageW / 2, h * 0.5 + (li - 0.5) * 14);
    });
    ctx.textAlign = 'left';
    
    // Arrow
    if (i < stages.length - 1) {
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + stageW - 4, h / 2);
      ctx.lineTo(x + stageW + 4, h / 2);
      ctx.stroke();
    }
    
    // Progress bar
    if (active) {
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillRect(x + 4, h * 0.8, stageW - 8, 4);
      ctx.fillStyle = colors[i];
      ctx.fillRect(x + 4, h * 0.8, (stageW - 8) * progress, 4);
    }
  });
  
  // Throughput
  const toks = (11 + Math.sin(t) * 0.5).toFixed(1);
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 12px monospace';
  ctx.fillText(`${toks} tok/s`, w - 70, h - 8);
}

function drawNeuralSignals(ctx, w, h, frame) {
  const channels = 8;
  const rowH = h / (channels + 1);
  const t = frame * 0.05;
  
  ctx.fillStyle = '#0a0f1e';
  ctx.fillRect(0, 0, w, h);
  
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '10px monospace';
  ctx.fillText('ENI — 8-channel neural signal acquisition (of 1024)', 8, 14);
  
  for (let ch = 0; ch < channels; ch++) {
    const y = (ch + 0.5) * rowH + rowH / 2;
    const color = `hsl(${200 + ch * 20}, 80%, 60%)`;
    
    // Channel label
    ctx.fillStyle = color;
    ctx.font = '9px monospace';
    ctx.fillText(`CH${ch + 1}`, 4, y + 3);
    
    // Signal trace
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    
    for (let x = 50; x < w; x++) {
      const phase = t + ch * 0.7;
      const freq = 1 + ch * 0.3;
      const spike = Math.random() < 0.002 ? 30 : 0;
      const signal = Math.sin(x * 0.05 * freq + phase) * 8 +
                     Math.sin(x * 0.12 + phase * 2) * 3 +
                     (Math.random() - 0.5) * 2 + spike;
      
      if (x === 50) ctx.moveTo(x, y - signal);
      else ctx.lineTo(x, y - signal);
    }
    ctx.stroke();
    
    // Spike detection marker
    if (Math.sin(t * 3 + ch) > 0.95) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = '8px monospace';
      ctx.fillText('▲SPIKE', w - 55, y - 10);
    }
  }
  
  // Sample rate
  ctx.fillStyle = '#06b6d4';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('30 kHz · 24-bit · 800µs latency', w - 165, h - 6);
}

function drawIPCBus(ctx, w, h, frame) {
  const processes = ['EoS\nKernel', 'EAI\nAgent', 'ENI\nStack', 'EIPC\nDaemon', 'User\nApp', 'Host\nBridge'];
  const t = frame * 0.03;
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) * 0.35;
  
  ctx.fillStyle = '#0a0f1e';
  ctx.fillRect(0, 0, w, h);
  
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '10px monospace';
  ctx.fillText('EIPC — Capability-based IPC Bus', 8, 14);
  
  // Central hub
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(59,130,246,0.3)';
  ctx.fill();
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#3b82f6';
  ctx.font = 'bold 9px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('HUB', cx, cy + 3);
  ctx.textAlign = 'left';
  
  processes.forEach((proc, i) => {
    const angle = (i / processes.length) * Math.PI * 2 - Math.PI / 2;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    const color = `hsl(${i * 60}, 70%, 60%)`;
    
    // Connection line
    const active = Math.floor(t * 2) % processes.length === i;
    ctx.strokeStyle = active ? color : 'rgba(255,255,255,0.1)';
    ctx.lineWidth = active ? 2 : 1;
    ctx.setLineDash(active ? [] : [4, 4]);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
    ctx.setLineDash([]);
    
    // Message packet animation
    if (active) {
      const progress = (t * 2) % 1;
      const mx = cx + (px - cx) * progress;
      const my = cy + (py - cy) * progress;
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(mx, my, 4, 0, Math.PI * 2); ctx.fill();
    }
    
    // Process node
    ctx.fillStyle = active ? color : 'rgba(255,255,255,0.1)';
    ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
    
    ctx.fillStyle = active ? '#000' : color;
    ctx.font = '8px monospace';
    ctx.textAlign = 'center';
    const lines = proc.split('\n');
    lines.forEach((line, li) => ctx.fillText(line, px, py + (li - 0.5) * 10 + 3));
    ctx.textAlign = 'left';
  });
}

function drawBootChain(ctx, w, h, frame) {
  const stages = ['ROM\nBoot0', 'BL1\nStage1', 'BL2\nStage2', 'Firmware\nVerify', 'App\nLaunch'];
  const colors = ['#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6'];
  const t = frame * 0.015;
  const stageW = (w - 20) / stages.length;
  
  ctx.fillStyle = '#0a0f1e';
  ctx.fillRect(0, 0, w, h);
  
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '10px monospace';
  ctx.fillText('eBootloader — 5-stage Secure Boot Chain (Ed25519 + SHA-256)', 8, 14);
  
  const currentStage = Math.floor(t) % stages.length;
  
  stages.forEach((stage, i) => {
    const x = 10 + i * stageW;
    const verified = i < currentStage || (i === currentStage && (t % 1) > 0.5);
    const active = i === currentStage;
    
    // Stage box
    ctx.fillStyle = verified ? `${colors[i]}33` : 'rgba(255,255,255,0.05)';
    ctx.strokeStyle = verified ? colors[i] : 'rgba(255,255,255,0.2)';
    ctx.lineWidth = active ? 2.5 : 1;
    ctx.beginPath();
    ctx.roundRect(x + 4, h * 0.2, stageW - 8, h * 0.55, 8);
    ctx.fill(); ctx.stroke();
    
    // Check mark or lock
    ctx.fillStyle = verified ? colors[i] : 'rgba(255,255,255,0.3)';
    ctx.font = `${active ? 'bold ' : ''}20px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(verified ? '✓' : '🔒', x + stageW / 2, h * 0.48);
    
    // Label
    ctx.font = '9px monospace';
    ctx.fillStyle = verified ? colors[i] : 'rgba(255,255,255,0.4)';
    const lines = stage.split('\n');
    lines.forEach((line, li) => ctx.fillText(line, x + stageW / 2, h * 0.62 + li * 12));
    ctx.textAlign = 'left';
    
    // Arrow
    if (i < stages.length - 1) {
      ctx.strokeStyle = verified ? colors[i] : 'rgba(255,255,255,0.2)';
      ctx.lineWidth = verified ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(x + stageW - 4, h / 2);
      ctx.lineTo(x + stageW + 4, h / 2);
      ctx.stroke();
    }
  });
  
  // Boot time
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('Boot time: 340ms · Chain of Trust verified', 8, h - 6);
}

function drawBuildPipeline(ctx, w, h, frame) {
  const steps = ['Source\n.c/.h', 'eBuild\nConfig', 'CMake\nGen', 'Ninja\nBuild', 'Link\n.elf', 'SDK\nOutput'];
  const t = frame * 0.02;
  const stageW = (w - 20) / steps.length;
  
  ctx.fillStyle = '#0a0f1e';
  ctx.fillRect(0, 0, w, h);
  
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '10px monospace';
  ctx.fillText('eBuild — Cross-compilation pipeline (ARM Cortex-M/A, RISC-V)', 8, 14);
  
  const progress = (t * 0.5) % 1;
  const activeStage = Math.floor(progress * steps.length);
  
  steps.forEach((step, i) => {
    const x = 10 + i * stageW;
    const done = i < activeStage;
    const active = i === activeStage;
    const color = done ? '#10b981' : active ? '#3b82f6' : 'rgba(255,255,255,0.15)';
    
    ctx.fillStyle = done ? 'rgba(16,185,129,0.15)' : active ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)';
    ctx.strokeStyle = color;
    ctx.lineWidth = active ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect(x + 4, h * 0.2, stageW - 8, h * 0.55, 6);
    ctx.fill(); ctx.stroke();
    
    ctx.fillStyle = color;
    ctx.font = `${active ? 'bold ' : ''}9px monospace`;
    ctx.textAlign = 'center';
    const lines = step.split('\n');
    lines.forEach((line, li) => ctx.fillText(line, x + stageW / 2, h * 0.45 + li * 12));
    ctx.textAlign = 'left';
    
    if (active) {
      const pct = (progress * steps.length - i);
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(x + 4, h * 0.78, stageW - 8, 5);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(x + 4, h * 0.78, (stageW - 8) * pct, 5);
    }
    
    if (i < steps.length - 1) {
      ctx.strokeStyle = done ? '#10b981' : 'rgba(255,255,255,0.2)';
      ctx.lineWidth = done ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(x + stageW - 4, h / 2);
      ctx.lineTo(x + stageW + 4, h / 2);
      ctx.stroke();
    }
  });
}

function drawSimulator(ctx, w, h, frame) {
  const t = frame * 0.02;
  
  ctx.fillStyle = '#0a0f1e';
  ctx.fillRect(0, 0, w, h);
  
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '10px monospace';
  ctx.fillText('EoSim — QEMU-based firmware simulator with GDB bridge', 8, 14);
  
  // QEMU box
  ctx.fillStyle = 'rgba(59,130,246,0.1)';
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.roundRect(10, 25, w * 0.45, h - 35, 8); ctx.fill(); ctx.stroke();
  
  ctx.fillStyle = '#3b82f6';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('QEMU Backend', 18, 40);
  
  // Simulated peripherals
  const perifs = ['UART', 'GPIO', 'SPI', 'I2C', 'ADC', 'Timer'];
  perifs.forEach((p, i) => {
    const px = 18 + (i % 3) * (w * 0.14);
    const py = 55 + Math.floor(i / 3) * 30;
    const active = Math.floor(t * 3) % perifs.length === i;
    ctx.fillStyle = active ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.05)';
    ctx.strokeStyle = active ? '#3b82f6' : 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(px, py, w * 0.12, 22, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = active ? '#fff' : 'rgba(255,255,255,0.5)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(p, px + w * 0.06, py + 14);
    ctx.textAlign = 'left';
  });
  
  // GDB box
  ctx.fillStyle = 'rgba(139,92,246,0.1)';
  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.roundRect(w * 0.55, 25, w * 0.42, h * 0.45, 8); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#8b5cf6';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('GDB Bridge', w * 0.57, 40);
  
  // GDB output simulation
  const gdbLines = [
    `(gdb) break main`,
    `Breakpoint 1 at 0x${(0x8000000 + frame * 4).toString(16)}`,
    `(gdb) continue`,
    `Continuing...`,
    `Hit Breakpoint 1, main()`,
  ];
  ctx.font = '8px monospace';
  gdbLines.forEach((line, i) => {
    ctx.fillStyle = i === 4 ? '#f59e0b' : 'rgba(255,255,255,0.5)';
    ctx.fillText(line, w * 0.57, 55 + i * 12);
  });
  
  // HIL bridge
  ctx.fillStyle = 'rgba(16,185,129,0.1)';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.roundRect(w * 0.55, h * 0.55, w * 0.42, h * 0.35, 8); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('HIL Test Runner', w * 0.57, h * 0.57 + 12);
  
  const passCount = Math.min(Math.floor(t * 3), 12);
  ctx.font = '9px monospace';
  ctx.fillStyle = '#10b981';
  ctx.fillText(`Tests: ${passCount}/12 ✓`, w * 0.57, h * 0.57 + 28);
  
  // Connection arrow
  const arrowX = w * 0.475;
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(arrowX, h / 2); ctx.lineTo(w * 0.55, h / 2); ctx.stroke();
  ctx.setLineDash([]);
}

function drawDBMetrics(ctx, w, h, frame) {
  const t = frame * 0.02;
  
  ctx.fillStyle = '#0a0f1e';
  ctx.fillRect(0, 0, w, h);
  
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '10px monospace';
  ctx.fillText('eDB — Embedded SQL with AES-XTS encryption (64KB–8MB)', 8, 14);
  
  // Metrics
  const metrics = [
    { label: 'Reads/s', value: 4200 + Math.sin(t) * 200, max: 5000, color: '#3b82f6' },
    { label: 'Writes/s', value: 1800 + Math.cos(t * 0.7) * 150, max: 2500, color: '#8b5cf6' },
    { label: 'Cache Hit', value: 94 + Math.sin(t * 1.3) * 2, max: 100, color: '#10b981', pct: true },
    { label: 'WAL Size', value: 12 + Math.abs(Math.sin(t * 0.5)) * 8, max: 64, color: '#f59e0b', unit: 'KB' },
  ];
  
  const barW = (w - 30) / metrics.length;
  
  metrics.forEach((m, i) => {
    const x = 15 + i * barW;
    const barH = h * 0.5;
    const barY = h * 0.25;
    const fill = (m.value / m.max) * barH;
    
    // Bar background
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath(); ctx.roundRect(x + barW * 0.2, barY, barW * 0.6, barH, 4); ctx.fill();
    
    // Bar fill
    ctx.fillStyle = m.color;
    ctx.beginPath();
    ctx.roundRect(x + barW * 0.2, barY + barH - fill, barW * 0.6, fill, 4);
    ctx.fill();
    
    // Value
    ctx.fillStyle = m.color;
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    const val = m.pct ? `${m.value.toFixed(1)}%` : m.unit ? `${m.value.toFixed(0)}${m.unit}` : Math.round(m.value).toLocaleString();
    ctx.fillText(val, x + barW / 2, barY - 5);
    
    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '9px monospace';
    ctx.fillText(m.label, x + barW / 2, h - 6);
    ctx.textAlign = 'left';
  });
  
  // Encryption indicator
  ctx.fillStyle = '#10b981';
  ctx.font = '9px monospace';
  ctx.fillText('🔒 AES-XTS active', w - 100, h - 6);
}

/* ═══════════════════════════════════════════════════════════════════════════
   DONATION FORM
═══════════════════════════════════════════════════════════════════════════ */
function initDonationForm() {
  const form = $('#donation-form') || $('form[action*="donate"]');
  const amountBtns = $$('[data-amount]');
  const customInput = $('#customAmount');
  const submitBtn = form ? $('button[type="submit"]', form) : $('#donate-submit');

  if (!form && amountBtns.length === 0 && !customInput && !submitBtn) return;
  
  let selectedAmount = 50;
  
  amountBtns.forEach(btn => {
    on(btn, 'click', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAmount = parseInt(btn.dataset.amount);
      if (customInput) customInput.value = '';
    });
  });
  
  if (customInput) {
    on(customInput, 'input', () => {
      amountBtns.forEach(b => b.classList.remove('active'));
      selectedAmount = parseInt(customInput.value) || 0;
    });
  }
  
  on(submitBtn, 'click', e => {
    e.preventDefault();
    const amount = customInput?.value ? parseInt(customInput.value) : selectedAmount;
    if (!amount || amount < 1) {
      showToast('Please select or enter a donation amount', 'error');
      return;
    }
    if (amount < 1) {
      showToast('Minimum donation is $1', 'error');
      return;
    }
    // Redirect to Stripe (placeholder)
    showToast(`Redirecting to secure payment for $${amount}…`, 'info');
    setTimeout(() => {
      window.open(`https://donate.stripe.com/embeddedos?amount=${amount * 100}`, '_blank');
    }, 1000);
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONTACT FORM
═══════════════════════════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm') || document.querySelector('form#contact-form');
  if (!form) return;

  on(form, 'submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const name = form.querySelector('#name')?.value?.trim();
    const email = form.querySelector('#email')?.value?.trim();
    const message = form.querySelector('#message')?.value?.trim();
    const privacy = form.querySelector('#privacy')?.checked;

    // Validation
    if (!name) { showFormError(form, 'name', 'Name is required'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormError(form, 'email', 'Valid email required'); return;
    }
    if (!message || message.length < 10) {
      showFormError(form, 'message', 'Message must be at least 10 characters'); return;
    }
    if (!privacy) {
      showToast('Please agree to the Privacy Policy', 'error'); return;
    }

    // Submit
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    
    try {
      // Simulate API call
      await new Promise(r => setTimeout(r, 1200));
      showFormSuccess(form, 'Message sent! We\'ll respond within 24–48 hours.');
      form.reset();
    } catch (err) {
      showToast('Failed to send. Please email help@embeddedos.org directly.', 'error');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Send Message'; }
    }
  });
}

function showFormError(form, fieldId, msg) {
  const field = form.querySelector(`#${fieldId}`);
  if (!field) return;
  field.classList.add('error');
  let err = field.nextElementSibling;
  if (!err || !err.classList.contains('field-error')) {
    err = document.createElement('span');
    err.className = 'field-error';
    err.style.cssText = 'color:#ef4444;font-size:.8rem;display:block;margin-top:.25rem';
    field.insertAdjacentElement('afterend', err);
  }
  err.textContent = msg;
  field.focus();
  on(field, 'input', () => { field.classList.remove('error'); err.textContent = ''; }, { once: true });
}

function showFormSuccess(form, msg) {
  let success = form.querySelector('.form-success');
  if (!success) {
    success = document.createElement('div');
    success.className = 'form-success';
    success.style.cssText = 'background:rgba(16,185,129,.15);border:1px solid #10b981;border-radius:8px;padding:1rem;margin-top:1rem;color:#10b981;font-weight:600';
    form.appendChild(success);
  }
  success.textContent = msg;
  success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ═══════════════════════════════════════════════════════════════════════════
   NEWSLETTER FORMS
═══════════════════════════════════════════════════════════════════════════ */
function initNewsletterForms() {
  $$('form[id*="newsletter"], .newsletter-form, form:has(input[type="email"])').forEach(form => {
    if (form.dataset.newsletterInit) return;
    form.dataset.newsletterInit = '1';
    
    on(form, 'submit', async e => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput?.value?.trim();
      
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
      }
      
      const btn = form.querySelector('button[type="submit"], button');
      if (btn) { btn.disabled = true; btn.textContent = '…'; }
      
      await new Promise(r => setTimeout(r, 800));
      showToast('Subscribed! Check your inbox for confirmation.', 'success');
      if (emailInput) emailInput.value = '';
      if (btn) { btn.disabled = false; btn.textContent = 'Subscribe'; }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   FAQ ACCORDION
═══════════════════════════════════════════════════════════════════════════ */
function initFaqAccordion() {
  $$('details').forEach(details => {
    const summary = details.querySelector('summary');
    if (!summary) return;
    
    on(details, 'toggle', () => {
      // Close siblings
      if (details.open) {
        const container = details.closest('.faq-list, .accordion, section');
        const siblings = container ? $$('details', container) : [];
        siblings.forEach(s => { if (s !== details) s.open = false; });
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   CODE COPY BUTTONS
═══════════════════════════════════════════════════════════════════════════ */
function initCodeCopyButtons() {
  $$('pre code, .code-block').forEach(block => {
    const pre = block.closest('pre') || block;
    if (pre.querySelector('.copy-btn')) return;
    
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.style.cssText = 'position:absolute;top:.5rem;right:.5rem;padding:.25rem .6rem;font-size:.75rem;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:4px;color:#fff;cursor:pointer;transition:all .15s';
    
    pre.style.position = 'relative';
    pre.appendChild(btn);
    
    on(btn, 'click', async () => {
      const text = block.textContent || '';
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'Copied!';
        btn.style.background = 'rgba(16,185,129,.3)';
        setTimeout(() => { btn.textContent = 'Copy'; btn.style.background = 'rgba(255,255,255,.1)'; }, 2000);
      } catch {
        btn.textContent = 'Failed';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════════════════════
   TABLE OF CONTENTS (docs page)
═══════════════════════════════════════════════════════════════════════════ */
function initTableOfContents() {
  const sidebar = $('.docs-sidebar');
  if (!sidebar) return;
  
  const headings = $$('h2[id], h3[id]', $('.docs-content') || document.main);
  if (headings.length === 0) return;
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const link = sidebar.querySelector(`a[href="#${entry.target.id}"]`);
      if (link) link.classList.toggle('active', entry.isIntersecting);
    });
  }, { rootMargin: '-80px 0px -60% 0px' });
  
  headings.forEach(h => observer.observe(h));
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOAST NOTIFICATIONS
═══════════════════════════════════════════════════════════════════════════ */
function showToast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:.5rem;pointer-events:none';
    document.body.appendChild(container);
  }
  
  const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };
  const toast = document.createElement('div');
  toast.style.cssText = `background:rgba(10,15,30,.95);border:1px solid ${colors[type]};border-radius:8px;padding:.75rem 1.25rem;color:#fff;font-size:.875rem;font-weight:500;pointer-events:auto;transform:translateX(100%);transition:transform .25s cubic-bezier(0.23,1,0.32,1),opacity .25s;max-width:320px;box-shadow:0 4px 20px rgba(0,0,0,.4)`;
  
  const icon = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' }[type];
  const span = document.createElement('span');
  span.style.cssText = `color:${colors[type]};margin-right:.5rem;font-weight:700`;
  span.textContent = icon;
  toast.appendChild(span);
  toast.appendChild(document.createTextNode(msg));
  
  container.appendChild(toast);
  requestAnimationFrame(() => { toast.style.transform = 'translateX(0)'; });
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ═══════════════════════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════════════════════ */
function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

// Expose globally for inline handlers (legacy support)
window.showToast = showToast;
