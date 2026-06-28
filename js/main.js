/* EmbeddedOS — main.js v3.0 — Premium interactions */
'use strict';

/* ═══════════════════════════════════════════════════
   NAVBAR — scroll elevation + active page indicator
═══════════════════════════════════════════════════ */
const navbar = document.querySelector('.navbar');
if (navbar) {
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile nav ── */
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks  = document.getElementById('nav-links');
if (mobileBtn && navLinks) {
  mobileBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    mobileBtn.setAttribute('aria-expanded', open);
    // Animate hamburger lines
    const lines = mobileBtn.querySelectorAll('.hamburger-line');
    if (open) {
      lines[0].style.transform = 'translateY(7px) rotate(45deg)';
      lines[1].style.opacity   = '0';
      lines[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      lines.forEach(l => { l.style.transform = ''; l.style.opacity = ''; });
    }
  });
  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      mobileBtn.setAttribute('aria-expanded', 'false');
      mobileBtn.querySelectorAll('.hamburger-line').forEach(l => {
        l.style.transform = ''; l.style.opacity = '';
      });
    }
  });
}

/* ═══════════════════════════════════════════════════
   SCROLL-TO-TOP
═══════════════════════════════════════════════════ */
const scrollBtn = document.querySelector('.scroll-top, .scroll-to-top');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ═══════════════════════════════════════════════════
   ANIMATE ON SCROLL — staggered entrance
═══════════════════════════════════════════════════ */
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 55);
      scrollObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));

/* ═══════════════════════════════════════════════════
   PRODUCT CARD — radial mouse glow
═══════════════════════════════════════════════════ */
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
  });
});

/* ═══════════════════════════════════════════════════
   TABS
═══════════════════════════════════════════════════ */
document.querySelectorAll('.tabs').forEach(tabGroup => {
  tabGroup.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target    = btn.dataset.tab;
      const container = tabGroup.closest('.tabs-container') || tabGroup.parentElement;
      tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      container.querySelectorAll('.tab-panel').forEach(p => {
        p.classList.toggle('active', p.dataset.panel === target);
      });
    });
  });
});

/* ═══════════════════════════════════════════════════
   COPY CODE BLOCKS
═══════════════════════════════════════════════════ */
document.querySelectorAll('.code-block__copy').forEach(btn => {
  btn.addEventListener('click', () => {
    const pre = btn.closest('.code-block, .code-block-wrap')?.querySelector('pre, .code-block');
    if (!pre) return;
    navigator.clipboard.writeText(pre.innerText).then(() => {
      btn.textContent = '✓ Copied!';
      btn.style.color = '#34d399';
      setTimeout(() => { btn.textContent = 'Copy'; btn.style.color = ''; }, 2000);
    }).catch(() => {
      btn.textContent = 'Failed';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
  });
});

/* ═══════════════════════════════════════════════════
   NEWSLETTER FORM
═══════════════════════════════════════════════════ */
const nForm = document.getElementById('newsletterForm');
if (nForm) {
  nForm.addEventListener('submit', e => {
    e.preventDefault();
    const msg = document.getElementById('newsletterMsg');
    const btn = nForm.querySelector('button[type="submit"]');
    if (btn) { btn.textContent = '✓ Subscribed!'; btn.style.background = 'linear-gradient(135deg,#10b981,#34d399)'; }
    if (msg) { msg.style.display = 'block'; }
    nForm.reset();
    setTimeout(() => {
      if (btn) { btn.textContent = 'Subscribe'; btn.style.background = ''; }
    }, 4000);
  });
}

/* ═══════════════════════════════════════════════════
   ANIMATED COUNTERS
═══════════════════════════════════════════════════ */
document.querySelectorAll('[data-target]').forEach(el => {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const val    = target < 10 ? target.toFixed(1) : Math.round(target).toLocaleString();
  el.textContent = prefix + val + suffix;
});
function animateCounter(el) {
  if (el._animated) return;
  el._animated = true;
  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix || '';
  const prefix   = el.dataset.prefix || '';
  const duration = 1400;
  const start    = performance.now();
  function step(now) {
    const p    = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    const val  = target < 10
      ? (ease * target).toFixed(1)
      : Math.round(ease * target).toLocaleString();
    el.textContent = prefix + val + suffix;
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = prefix + (target < 10 ? target.toFixed(1) : Math.round(target).toLocaleString()) + suffix;
  }
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting && !e.target._animated) animateCounter(e.target); });
}, { threshold: 0.3 });
document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ═══════════════════════════════════════════════════
   HERO ORB PARALLAX
═══════════════════════════════════════════════════ */
const orbs = document.querySelectorAll('.hero__orb');
if (orbs.length) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        orbs.forEach((orb, i) => {
          const speed = [0.15, 0.1, 0.2][i] || 0.12;
          orb.style.transform = `translateY(${y * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════
   CARD TILT EFFECT (subtle 3D on hover)
═══════════════════════════════════════════════════ */
document.querySelectorAll('.usecase-card, .position-card, .binary-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width  - 0.5;
    const cy = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-3px) rotateX(${-cy * 4}deg) rotateY(${cx * 4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ═══════════════════════════════════════════════════
   FAQ — smooth open/close animation
═══════════════════════════════════════════════════ */
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      const answer = item.querySelector('.faq-a');
      if (answer) {
        answer.style.animation = 'fadeInUp .25s cubic-bezier(0.23,1,0.32,1) both';
      }
    }
  });
});

/* ═══════════════════════════════════════════════════
   ACTIVE NAV LINK — highlight current page
═══════════════════════════════════════════════════ */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
    link.setAttribute('aria-current', 'page');
  }
});

/* ═══════════════════════════════════════════════════
   BUTTON RIPPLE EFFECT
═══════════════════════════════════════════════════ */
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size   = Math.max(r.width, r.height) * 2;
    ripple.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      width:${size}px; height:${size}px;
      left:${e.clientX - r.left - size/2}px;
      top:${e.clientY - r.top  - size/2}px;
      background:rgba(255,255,255,.15);
      transform:scale(0); animation:ripple .5s ease-out forwards;
    `;
    if (!this.style.position || this.style.position === 'static') {
      this.style.position = 'relative';
    }
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

/* Add ripple keyframe once */
if (!document.getElementById('ripple-style')) {
  const s = document.createElement('style');
  s.id = 'ripple-style';
  s.textContent = '@keyframes ripple { to { transform:scale(1); opacity:0; } }';
  document.head.appendChild(s);
}

/* ═══════════════════════════════════════════════════
   CANVAS SIMULATIONS
═══════════════════════════════════════════════════ */

/* ── EoS RTOS Scheduler ── */
function initSchedulerSim(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = 200;
  const tasks = [
    { name: 'T1:Sensor',  priority: 1, period: 20, color: '#3b82f6', phase: 0  },
    { name: 'T2:Control', priority: 2, period: 35, color: '#8b5cf6', phase: 5  },
    { name: 'T3:Comms',   priority: 3, period: 50, color: '#22d3ee', phase: 10 },
    { name: 'T4:UI',      priority: 4, period: 80, color: '#34d399', phase: 15 },
  ];
  const rowH = (H - 30) / tasks.length;
  const timeScale = W / 160;
  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#080e1a'; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(255,255,255,.04)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H - 30); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,.25)';
    ctx.font = '10px JetBrains Mono, monospace';
    for (let i = 0; i <= 160; i += 20) ctx.fillText(i + 'ms', i * timeScale + 2, H - 12);
    tasks.forEach((task, i) => {
      const y = i * rowH + 4;
      ctx.fillStyle = task.color; ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText(task.name, 2, y + rowH / 2 + 4);
      for (let time = task.phase; time < 160; time += task.period) {
        const execDur = Math.max(4, task.period * 0.25);
        const x = time * timeScale + 60;
        const w = execDur * timeScale;
        const active = t % task.period < execDur && Math.floor(t / task.period) === Math.floor(time / task.period);
        ctx.fillStyle = task.color + (active ? 'ff' : '55');
        ctx.fillRect(x, y + 2, w - 1, rowH - 8);
        if (active) {
          ctx.shadowColor = task.color; ctx.shadowBlur = 10;
          ctx.fillStyle = task.color; ctx.fillRect(x, y + 2, w - 1, rowH - 8);
          ctx.shadowBlur = 0;
        }
      }
    });
    const cx = (t % 160) * timeScale + 60;
    ctx.strokeStyle = 'rgba(241,245,249,.6)'; ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H - 30); ctx.stroke();
    ctx.setLineDash([]);
    t = (t + 0.4) % 160;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── EAI Neural Network ── */
function initNeuralSim(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = 220;
  const layers = [
    { nodes: 4, label: 'Input',    x: 0.1 },
    { nodes: 6, label: 'Hidden 1', x: 0.3 },
    { nodes: 6, label: 'Hidden 2', x: 0.5 },
    { nodes: 4, label: 'Hidden 3', x: 0.7 },
    { nodes: 2, label: 'Output',   x: 0.9 },
  ];
  let frame = 0;
  const activations = layers.map(l => new Array(l.nodes).fill(0));
  function getNodePos(li, ni) {
    const layer = layers[li];
    const spacing = Math.min(40, (H - 40) / layer.nodes);
    const startY  = H / 2 - (layer.nodes - 1) * spacing / 2;
    return { x: layer.x * W, y: startY + ni * spacing };
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#080e1a'; ctx.fillRect(0, 0, W, H);
    layers.forEach((layer, li) => {
      for (let ni = 0; ni < layer.nodes; ni++)
        activations[li][ni] = (Math.sin(frame * 0.04 + li * 1.2 + ni * 0.8) + 1) / 2;
    });
    layers.forEach((layer, li) => {
      if (li === layers.length - 1) return;
      for (let ni = 0; ni < layer.nodes; ni++) {
        for (let nj = 0; nj < layers[li + 1].nodes; nj++) {
          const p1 = getNodePos(li, ni), p2 = getNodePos(li + 1, nj);
          const s  = (activations[li][ni] + activations[li + 1][nj]) / 2;
          ctx.strokeStyle = `rgba(59,130,246,${s * 0.4})`; ctx.lineWidth = s * 1.5;
          ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
        }
      }
    });
    const colors = ['#3b82f6','#8b5cf6','#8b5cf6','#22d3ee','#34d399'];
    layers.forEach((layer, li) => {
      for (let ni = 0; ni < layer.nodes; ni++) {
        const { x, y } = getNodePos(li, ni);
        const act = activations[li][ni];
        ctx.shadowColor = colors[li]; ctx.shadowBlur = act * 14;
        ctx.fillStyle = colors[li]; ctx.globalAlpha = 0.3 + act * 0.7;
        ctx.beginPath(); ctx.arc(x, y, 7 + act * 4, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      }
      ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'center'; ctx.fillText(layer.label, layer.x * W, H - 6);
    });
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(52,211,153,.85)'; ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.fillText('INT4 • 11 tok/s • 312MB flash', 8, 16);
    frame++; requestAnimationFrame(draw);
  }
  draw();
}

/* ── ENI Neural Signal ── */
function initNeuralSignalSim(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = 200;
  const channels = 8, channelH = (H - 20) / channels;
  let offset = 0;
  const data = Array.from({ length: channels }, () => new Float32Array(W));
  const colors = ['#3b82f6','#8b5cf6','#22d3ee','#34d399','#fb7185','#fbbf24','#fb923c','#a78bfa'];
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#080e1a'; ctx.fillRect(0, 0, W, H);
    for (let ch = 0; ch < channels; ch++) {
      data[ch].copyWithin(0, 1);
      const noise = (Math.random() - 0.5) * 0.08;
      const spike = Math.random() < 0.002 ? (Math.random() * 2 - 1) * 0.8 : 0;
      const lfp   = Math.sin(offset * 0.03 + ch * 0.7) * 0.15;
      data[ch][W - 1] = noise + spike + lfp;
      const baseY = ch * channelH + channelH / 2 + 10, amp = channelH * 0.4;
      ctx.strokeStyle = colors[ch % colors.length]; ctx.lineWidth = 1; ctx.globalAlpha = 0.85;
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const y = baseY - data[ch][x] * amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke(); ctx.globalAlpha = 1;
      ctx.fillStyle = colors[ch % colors.length]; ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(`Ch${ch + 1}`, 2, baseY + 3);
    }
    ctx.fillStyle = 'rgba(52,211,153,.85)'; ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.fillText('LIVE: 1024-ch neural recording • 30kHz • < 5μV noise floor', 8, 9);
    offset++; requestAnimationFrame(draw);
  }
  draw();
}

/* ── IPC Latency ── */
function initIPCSim(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = 180;
  const bars = [
    { label: 'eIPC (EoS)',  value: 0.8, color: '#34d399' },
    { label: 'Unix Socket', value: 12,  color: '#64748b' },
    { label: 'D-Bus',       value: 45,  color: '#64748b' },
    { label: 'gRPC (local)',value: 28,  color: '#64748b' },
    { label: 'ZeroMQ',      value: 8,   color: '#64748b' },
  ];
  const maxVal = 50; let animP = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#080e1a'; ctx.fillRect(0, 0, W, H);
    const barW = (W - 80) / bars.length - 8, startX = 60;
    bars.forEach((bar, i) => {
      const x = startX + i * (barW + 8), maxH = H - 50;
      const bh = Math.min((bar.value / maxVal) * maxH * animP, maxH), y = H - 30 - bh;
      ctx.fillStyle = bar.color; ctx.globalAlpha = bar.label.startsWith('eIPC') ? 1 : 0.45;
      ctx.fillRect(x, y, barW, bh);
      if (bar.label.startsWith('eIPC')) {
        ctx.shadowColor = bar.color; ctx.shadowBlur = 14;
        ctx.fillRect(x, y, barW, bh); ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
      ctx.fillStyle = bar.color; ctx.font = 'bold 10px JetBrains Mono, monospace'; ctx.textAlign = 'center';
      ctx.fillText(bar.value + 'μs', x + barW / 2, y - 4);
      ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(bar.label, x + barW / 2, H - 14);
    });
    ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(255,255,255,.2)';
    ctx.font = '9px JetBrains Mono, monospace'; ctx.fillText('μs latency', 2, 14);
    if (animP < 1) { animP = Math.min(animP + 0.025, 1); requestAnimationFrame(draw); }
  }
  const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) { draw(); obs.disconnect(); } }, { threshold: 0.3 });
  obs.observe(canvas);
}

/* ── Health Sensor ── */
function initHealthSim(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = 200;
  let t = 0;
  const ecgData = new Float32Array(W);
  function ecgSample(x) {
    const mod = x % 100;
    if (mod < 5)  return Math.sin(mod / 5 * Math.PI) * 0.3;
    if (mod >= 20 && mod < 22) return -0.15;
    if (mod >= 22 && mod < 24) return 1.0;
    if (mod >= 24 && mod < 26) return -0.3;
    if (mod >= 26 && mod < 28) return 0.1;
    return (Math.random() - 0.5) * 0.04;
  }
  function draw() {
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#080e1a'; ctx.fillRect(0, 0, W, H);
    ecgData.copyWithin(0, 1); ecgData[W - 1] = ecgSample(t);
    const midY = H * 0.35, amp = H * 0.25;
    ctx.strokeStyle = '#fb7185'; ctx.lineWidth = 1.5;
    ctx.shadowColor = '#fb7185'; ctx.shadowBlur = 6;
    ctx.beginPath();
    for (let x = 0; x < W; x++) {
      const y = midY - ecgData[x] * amp;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke(); ctx.shadowBlur = 0;
    const spo2Y = H * 0.72, spo2Amp = H * 0.12;
    ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 1.5;
    ctx.shadowColor = '#3b82f6'; ctx.shadowBlur = 6;
    ctx.beginPath();
    for (let x = 0; x < W; x++) {
      const y = spo2Y - Math.sin((x + t * 2) * 0.08) * spo2Amp;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke(); ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(251,113,133,.85)'; ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.fillText('ECG: 72 BPM', 8, 14);
    ctx.fillStyle = 'rgba(59,130,246,.85)';
    ctx.fillText('SpO₂: 98%  Temp: 36.7°C', 8, H - 8);
    t++; requestAnimationFrame(draw);
  }
  draw();
}

/* ── eDB Query Simulation ── */
function initDBSim(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = 180;
  const metrics = [
    { label: 'Read IOPS',   value: 0, target: 42000, color: '#3b82f6', unit: '' },
    { label: 'Write IOPS',  value: 0, target: 18000, color: '#8b5cf6', unit: '' },
    { label: 'Latency P99', value: 0, target: 2.1,   color: '#34d399', unit: 'ms' },
    { label: 'Cache Hit',   value: 0, target: 99.4,  color: '#fbbf24', unit: '%' },
  ];
  let animP = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#080e1a'; ctx.fillRect(0, 0, W, H);
    const colW = W / metrics.length;
    metrics.forEach((m, i) => {
      const cur = m.target * animP;
      const x = i * colW + colW * 0.1, w = colW * 0.8;
      const maxH = H - 60, bh = (cur / m.target) * maxH, y = H - 30 - bh;
      ctx.fillStyle = m.color; ctx.globalAlpha = 0.25;
      ctx.fillRect(x, H - 30 - maxH, w, maxH);
      ctx.globalAlpha = 1;
      ctx.shadowColor = m.color; ctx.shadowBlur = 10;
      ctx.fillRect(x, y, w, bh); ctx.shadowBlur = 0;
      ctx.fillStyle = m.color; ctx.font = 'bold 11px JetBrains Mono, monospace'; ctx.textAlign = 'center';
      const display = m.target < 10 ? cur.toFixed(1) : Math.round(cur).toLocaleString();
      ctx.fillText(display + m.unit, x + w / 2, y - 5);
      ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(m.label, x + w / 2, H - 14);
    });
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(52,211,153,.85)'; ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.fillText('AES-XTS encrypted • WAL mode • B-Tree index', 8, 14);
    if (animP < 1) { animP = Math.min(animP + 0.018, 1); requestAnimationFrame(draw); }
  }
  const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) { draw(); obs.disconnect(); } }, { threshold: 0.3 });
  obs.observe(canvas);
}

/* ── eBuild Pipeline Simulation ── */
function initBuildSim(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = 160;
  const stages = [
    { label: 'Parse',   dur: 120,  color: '#3b82f6' },
    { label: 'Resolve', dur: 80,   color: '#8b5cf6' },
    { label: 'Compile', dur: 1800, color: '#22d3ee' },
    { label: 'Link',    dur: 340,  color: '#34d399' },
    { label: 'Sign',    dur: 60,   color: '#fbbf24' },
  ];
  const total = stages.reduce((s, st) => s + st.dur, 0);
  let animP = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#080e1a'; ctx.fillRect(0, 0, W, H);
    const barH = 28, startY = (H - stages.length * (barH + 8)) / 2;
    let elapsed = 0;
    stages.forEach((st, i) => {
      const y = startY + i * (barH + 8);
      const fullW = (st.dur / total) * (W - 160);
      const curW  = fullW * Math.min(animP * (total / elapsed || 1), 1);
      ctx.fillStyle = 'rgba(255,255,255,.04)'; ctx.fillRect(160, y, W - 160, barH);
      ctx.fillStyle = st.color; ctx.globalAlpha = 0.85;
      ctx.shadowColor = st.color; ctx.shadowBlur = 8;
      ctx.fillRect(160, y, Math.min(curW * animP * stages.length, fullW), barH);
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      ctx.fillStyle = st.color; ctx.font = '11px JetBrains Mono, monospace'; ctx.textAlign = 'right';
      ctx.fillText(st.label, 148, y + barH / 2 + 4);
      ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.font = '10px JetBrains Mono, monospace'; ctx.textAlign = 'left';
      ctx.fillText(st.dur + 'ms', 164 + fullW + 4, y + barH / 2 + 4);
      elapsed += st.dur;
    });
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(52,211,153,.85)'; ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.fillText(`Total: ${(total/1000).toFixed(2)}s  |  Incremental: ~${Math.round(total*0.08)}ms`, 8, H - 8);
    if (animP < 1) { animP = Math.min(animP + 0.012, 1); requestAnimationFrame(draw); }
  }
  const obs = new IntersectionObserver(e => { if (e[0].isIntersecting) { draw(); obs.disconnect(); } }, { threshold: 0.3 });
  obs.observe(canvas);
}

/* ── Auto-init simulations ── */
initSchedulerSim('schedulerCanvas');
initNeuralSim('neuralCanvas');
initNeuralSignalSim('neuralSignalCanvas');
initIPCSim('ipcCanvas');
initHealthSim('healthCanvas');
initDBSim('dbCanvas');
initBuildSim('buildCanvas');
