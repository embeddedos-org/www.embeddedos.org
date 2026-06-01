/* EmbeddedOS — main.js v2.0 */
'use strict';

/* ── Mobile nav ── */
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.getElementById('nav-links');
if (mobileBtn && navLinks) {
  mobileBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    mobileBtn.setAttribute('aria-expanded', open);
  });
}

/* ── Scroll-to-top ── */
const scrollBtn = document.querySelector('.scroll-to-top');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Animate on scroll ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

/* ── Product card mouse glow ── */
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  });
});

/* ── Tabs ── */
document.querySelectorAll('.tabs').forEach(tabGroup => {
  tabGroup.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      const container = tabGroup.closest('.tabs-container') || tabGroup.parentElement;
      tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      container.querySelectorAll('.tab-panel').forEach(p => {
        p.classList.toggle('active', p.dataset.panel === target);
      });
    });
  });
});

/* ── Copy code blocks ── */
document.querySelectorAll('.code-block__copy').forEach(btn => {
  btn.addEventListener('click', () => {
    const pre = btn.closest('.code-block').querySelector('pre');
    navigator.clipboard.writeText(pre.innerText).then(() => {
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy', 2000);
    });
  });
});

/* ── Newsletter ── */
const nForm = document.getElementById('newsletterForm');
if (nForm) {
  nForm.addEventListener('submit', e => {
    e.preventDefault();
    const msg = document.getElementById('newsletterMsg');
    if (msg) { msg.style.display = 'block'; }
    nForm.reset();
  });
}

/* ── Animated counter ── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    const val = target < 10 ? (ease * target).toFixed(1) : Math.round(ease * target);
    el.textContent = prefix + val + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.counted) {
      e.target.dataset.counted = '1';
      animateCounter(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ── EoS RTOS Scheduler Simulation ── */
function initSchedulerSim(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = 200;

  const tasks = [
    { name: 'T1:Sensor', priority: 1, period: 20, color: '#3b82f6', phase: 0 },
    { name: 'T2:Control', priority: 2, period: 35, color: '#8b5cf6', phase: 5 },
    { name: 'T3:Comms', priority: 3, period: 50, color: '#22d3ee', phase: 10 },
    { name: 'T4:UI', priority: 4, period: 80, color: '#34d399', phase: 15 },
  ];
  const rowH = (H - 30) / tasks.length;
  const timeScale = W / 160;
  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H - 30); ctx.stroke();
    }

    // Time axis
    ctx.fillStyle = 'rgba(255,255,255,.3)';
    ctx.font = '10px JetBrains Mono, monospace';
    for (let i = 0; i <= 160; i += 20) {
      const x = i * timeScale;
      ctx.fillText(i + 'ms', x + 2, H - 12);
    }

    // Tasks
    tasks.forEach((task, i) => {
      const y = i * rowH + 4;
      // Label
      ctx.fillStyle = task.color;
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText(task.name, 2, y + rowH / 2 + 4);

      // Execution blocks
      for (let time = task.phase; time < 160; time += task.period) {
        const execDur = Math.max(4, task.period * 0.25);
        const x = time * timeScale + 60;
        const w = execDur * timeScale;
        const active = t % task.period < execDur && Math.floor(t / task.period) === Math.floor(time / task.period);

        ctx.fillStyle = task.color + (active ? 'ff' : '66');
        ctx.fillRect(x, y + 2, w - 1, rowH - 8);

        if (active) {
          ctx.shadowColor = task.color;
          ctx.shadowBlur = 8;
          ctx.fillStyle = task.color;
          ctx.fillRect(x, y + 2, w - 1, rowH - 8);
          ctx.shadowBlur = 0;
        }
      }
    });

    // Current time cursor
    const cx = (t % 160) * timeScale + 60;
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H - 30); ctx.stroke();
    ctx.setLineDash([]);

    t = (t + 0.4) % 160;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── EAI Neural Network Simulation ── */
function initNeuralSim(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = 220;

  const layers = [
    { nodes: 4, label: 'Input', x: 0.1 },
    { nodes: 6, label: 'Hidden 1', x: 0.3 },
    { nodes: 6, label: 'Hidden 2', x: 0.5 },
    { nodes: 4, label: 'Hidden 3', x: 0.7 },
    { nodes: 2, label: 'Output', x: 0.9 },
  ];

  let frame = 0;
  const activations = layers.map(l => new Array(l.nodes).fill(0));

  function getNodePos(layerIdx, nodeIdx) {
    const layer = layers[layerIdx];
    const x = layer.x * W;
    const total = layer.nodes;
    const spacing = Math.min(40, (H - 40) / total);
    const startY = H / 2 - (total - 1) * spacing / 2;
    return { x, y: startY + nodeIdx * spacing };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    // Update activations with wave
    layers.forEach((layer, li) => {
      layer.nodes_arr = layer.nodes_arr || [];
      for (let ni = 0; ni < layer.nodes; ni++) {
        activations[li][ni] = (Math.sin(frame * 0.04 + li * 1.2 + ni * 0.8) + 1) / 2;
      }
    });

    // Draw connections
    layers.forEach((layer, li) => {
      if (li === layers.length - 1) return;
      for (let ni = 0; ni < layer.nodes; ni++) {
        for (let nj = 0; nj < layers[li + 1].nodes; nj++) {
          const p1 = getNodePos(li, ni);
          const p2 = getNodePos(li + 1, nj);
          const strength = (activations[li][ni] + activations[li + 1][nj]) / 2;
          ctx.strokeStyle = `rgba(59,130,246,${strength * 0.4})`;
          ctx.lineWidth = strength * 1.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    });

    // Draw nodes
    layers.forEach((layer, li) => {
      for (let ni = 0; ni < layer.nodes; ni++) {
        const { x, y } = getNodePos(li, ni);
        const act = activations[li][ni];
        const r = 7 + act * 4;
        const colors = ['#3b82f6', '#8b5cf6', '#8b5cf6', '#22d3ee', '#34d399'];
        ctx.shadowColor = colors[li];
        ctx.shadowBlur = act * 12;
        ctx.fillStyle = colors[li];
        ctx.globalAlpha = 0.3 + act * 0.7;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
      }
      // Layer label
      const lx = layers[li].x * W;
      ctx.fillStyle = 'rgba(255,255,255,.35)';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(layer.label, lx, H - 6);
    });
    ctx.textAlign = 'left';

    // INT4 badge
    ctx.fillStyle = 'rgba(52,211,153,.8)';
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.fillText('INT4 • 11 tok/s • 312MB flash', 8, 16);

    frame++;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── ENI Neural Signal Simulation ── */
function initNeuralSignalSim(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = 200;

  const channels = 8;
  const channelH = (H - 20) / channels;
  let offset = 0;
  const data = Array.from({ length: channels }, () => new Float32Array(W));

  function generateSpike(ch) {
    return Math.random() < 0.002 ? (Math.random() * 2 - 1) * 0.8 : 0;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    for (let ch = 0; ch < channels; ch++) {
      // Shift data left
      data[ch].copyWithin(0, 1);
      // Add new sample: baseline noise + occasional spike
      const noise = (Math.random() - 0.5) * 0.08;
      const spike = generateSpike(ch);
      const lfp = Math.sin(offset * 0.03 + ch * 0.7) * 0.15;
      data[ch][W - 1] = noise + spike + lfp;

      const baseY = ch * channelH + channelH / 2 + 10;
      const amp = channelH * 0.4;
      const colors = ['#3b82f6','#8b5cf6','#22d3ee','#34d399','#fb7185','#fbbf24','#fb923c','#a78bfa'];

      ctx.strokeStyle = colors[ch % colors.length];
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const y = baseY - data[ch][x] * amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Channel label
      ctx.fillStyle = colors[ch % colors.length];
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(`Ch${ch + 1}`, 2, baseY + 3);
    }

    // Header
    ctx.fillStyle = 'rgba(52,211,153,.8)';
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.fillText('LIVE: 1024-ch neural recording • 30kHz • < 5μV noise floor', 8, 9);

    offset++;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── IPC Latency Simulation ── */
function initIPCSim(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = 180;

  const bars = [
    { label: 'eIPC (EoS)', value: 0.8, color: '#34d399' },
    { label: 'Unix Socket', value: 12, color: '#64748b' },
    { label: 'D-Bus', value: 45, color: '#64748b' },
    { label: 'gRPC (local)', value: 28, color: '#64748b' },
    { label: 'ZeroMQ', value: 8, color: '#64748b' },
  ];
  const maxVal = 50;
  let animP = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    const barW = (W - 80) / bars.length - 8;
    const startX = 60;

    bars.forEach((bar, i) => {
      const x = startX + i * (barW + 8);
      const maxH = H - 50;
      const bh = Math.min((bar.value / maxVal) * maxH * animP, maxH);
      const y = H - 30 - bh;

      // Bar
      ctx.fillStyle = bar.color;
      ctx.globalAlpha = bar.label.startsWith('eIPC') ? 1 : 0.5;
      ctx.fillRect(x, y, barW, bh);
      if (bar.label.startsWith('eIPC')) {
        ctx.shadowColor = bar.color;
        ctx.shadowBlur = 12;
        ctx.fillRect(x, y, barW, bh);
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      // Value
      ctx.fillStyle = bar.color;
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(bar.value + 'μs', x + barW / 2, y - 4);

      // Label
      ctx.fillStyle = 'rgba(255,255,255,.4)';
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillText(bar.label, x + barW / 2, H - 14);
    });
    ctx.textAlign = 'left';

    // Y axis
    ctx.fillStyle = 'rgba(255,255,255,.25)';
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillText('μs latency', 2, 14);

    if (animP < 1) { animP = Math.min(animP + 0.025, 1); requestAnimationFrame(draw); }
  }

  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { draw(); obs.disconnect(); }
  }, { threshold: 0.3 });
  obs.observe(canvas);
}

/* ── Health Sensor Simulation ── */
function initHealthSim(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = canvas.offsetWidth;
  const H = canvas.height = 200;

  let t = 0;
  const ecgData = new Float32Array(W);
  let ecgOffset = 0;

  function ecgSample(x) {
    const mod = x % 100;
    if (mod < 5) return Math.sin(mod / 5 * Math.PI) * 0.3;
    if (mod >= 20 && mod < 22) return -0.15;
    if (mod >= 22 && mod < 24) return 1.0;
    if (mod >= 24 && mod < 26) return -0.3;
    if (mod >= 26 && mod < 28) return -0.1;
    if (mod >= 35 && mod < 45) return Math.sin((mod - 35) / 10 * Math.PI) * 0.25;
    return (Math.random() - 0.5) * 0.02;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, W, H);

    // ECG trace
    ecgData.copyWithin(0, 1);
    ecgData[W - 1] = ecgSample(ecgOffset++);

    const ecgBaseY = 70;
    const ecgAmp = 50;
    ctx.strokeStyle = '#fb7185';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#fb7185';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    for (let x = 0; x < W; x++) {
      const y = ecgBaseY - ecgData[x] * ecgAmp;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // SpO2 wave
    const spo2BaseY = 130;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x < W; x++) {
      const y = spo2BaseY + Math.sin((x + t) * 0.06) * 18 + (Math.random() - 0.5) * 1.5;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Temp wave
    const tempBaseY = 170;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < W; x++) {
      const y = tempBaseY + Math.sin((x + t) * 0.02) * 5 + (Math.random() - 0.5) * 0.8;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Metrics overlay
    const metrics = [
      { label: 'ECG', value: '72 BPM', color: '#fb7185', y: 14 },
      { label: 'SpO₂', value: '98%', color: '#3b82f6', y: 28 },
      { label: 'Temp', value: '36.7°C', color: '#fbbf24', y: 42 },
    ];
    metrics.forEach(m => {
      ctx.fillStyle = m.color;
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.fillText(`${m.label}: ${m.value}`, 8, m.y);
    });

    // HEALTH-KEY badge
    ctx.fillStyle = 'rgba(255,255,255,.3)';
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillText('HEALTH-KEY ULTRA • 9 sensors • 21 metrics • 48×18×9.5mm', 8, H - 6);

    t++;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── Init all simulations ── */
document.addEventListener('DOMContentLoaded', () => {
  initSchedulerSim('sim-scheduler');
  initNeuralSim('sim-neural');
  initNeuralSignalSim('sim-eni');
  initIPCSim('sim-ipc');
  initHealthSim('sim-health');
});
