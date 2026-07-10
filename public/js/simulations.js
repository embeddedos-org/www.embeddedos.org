/**
 * EmbeddedOS Foundation — Product Page Canvas Simulations
 * Each product has a unique animated visualization of its core behavior.
 */

(function () {
  'use strict';

  const COLORS = {
    blue:   '#3b82f6',
    violet: '#8b5cf6',
    cyan:   '#06b6d4',
    green:  '#10b981',
    amber:  '#f59e0b',
    red:    '#ef4444',
    text:   'rgba(255,255,255,0.7)',
    dim:    'rgba(255,255,255,0.2)',
    bg:     '#03050d',
    surface:'rgba(255,255,255,0.04)',
  };

  function resizeCanvas(canvas) {
    const wrap = canvas.parentElement;
    const w = wrap.clientWidth - 32;
    canvas.width = Math.max(w, 300);
    canvas.height = Math.round(canvas.width * 0.4);
  }

  function lerp(a, b, t) { return a + (b - a) * t; }
  function rand(min, max) { return Math.random() * (max - min) + min; }

  // ── EoS Scheduler ──────────────────────────────────────────────────────────
  function initEosScheduler(canvas) {
    const ctx = canvas.getContext('2d');
    const tasks = Array.from({length: 8}, (_, i) => ({
      id: i,
      name: ['idle', 'net', 'usb', 'audio', 'sensor', 'crypto', 'display', 'kernel'][i],
      priority: rand(1, 10),
      progress: rand(0, 1),
      color: [COLORS.blue, COLORS.violet, COLORS.cyan, COLORS.green, COLORS.amber, COLORS.red, COLORS.blue, COLORS.violet][i],
      active: false,
    }));
    let tick = 0;

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, W, H);

      // Title
      ctx.fillStyle = COLORS.text;
      ctx.font = `bold ${Math.round(W/50)}px monospace`;
      ctx.fillText('EoS RTOS — Priority Scheduler', 16, 24);

      const rowH = (H - 50) / tasks.length;
      const barMaxW = W - 200;

      tasks.forEach((task, i) => {
        const y = 40 + i * rowH;
        task.progress += (task.active ? 0.008 : 0.001) * (task.priority / 5);
        if (task.progress > 1) task.progress = 0;

        // Row bg
        ctx.fillStyle = task.active ? 'rgba(59,130,246,0.08)' : COLORS.surface;
        ctx.fillRect(0, y, W, rowH - 2);

        // Task name
        ctx.fillStyle = task.active ? task.color : COLORS.dim;
        ctx.font = `${task.active ? 'bold' : 'normal'} ${Math.round(W/65)}px monospace`;
        ctx.fillText(task.name.padEnd(8), 12, y + rowH * 0.65);

        // Priority badge
        ctx.fillStyle = task.color + '33';
        ctx.fillRect(90, y + 4, 40, rowH - 10);
        ctx.fillStyle = task.color;
        ctx.font = `bold ${Math.round(W/70)}px monospace`;
        ctx.fillText(`P${Math.round(task.priority)}`, 95, y + rowH * 0.65);

        // Progress bar
        const bx = 145, bw = barMaxW, bh = Math.max(6, rowH * 0.3);
        const by = y + (rowH - bh) / 2;
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(bx, by, bw, bh);
        ctx.fillStyle = task.active ? task.color : task.color + '66';
        ctx.fillRect(bx, by, bw * task.progress, bh);

        // Status dot
        ctx.fillStyle = task.active ? COLORS.green : COLORS.dim;
        ctx.beginPath();
        ctx.arc(W - 16, y + rowH / 2, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Rotate active task
      if (tick % 60 === 0) {
        tasks.forEach(t => t.active = false);
        // Pick highest priority incomplete task
        const sorted = [...tasks].sort((a, b) => b.priority - a.priority);
        sorted[0].active = true;
      }
      tick++;
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ── EAI Inference Pipeline ─────────────────────────────────────────────────
  function initEaiInference(canvas) {
    const ctx = canvas.getContext('2d');
    const stages = ['Input', 'Quantize', 'Graph Opt', 'Kernel', 'SIMD', 'Output'];
    const colors = [COLORS.blue, COLORS.violet, COLORS.cyan, COLORS.green, COLORS.amber, COLORS.red];
    let packets = [];
    let tick = 0;

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = COLORS.text;
      ctx.font = `bold ${Math.round(W/50)}px monospace`;
      ctx.fillText('EAI — Inference Pipeline', 16, 24);

      const stageW = (W - 40) / stages.length;
      const stageH = H * 0.45;
      const stageY = H * 0.25;

      // Draw stages
      stages.forEach((name, i) => {
        const x = 20 + i * stageW;
        ctx.fillStyle = colors[i] + '22';
        ctx.strokeStyle = colors[i] + '88';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x + 4, stageY, stageW - 8, stageH, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = colors[i];
        ctx.font = `bold ${Math.round(W/75)}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(name, x + stageW / 2, stageY + stageH * 0.5);

        // Arrow
        if (i < stages.length - 1) {
          ctx.strokeStyle = COLORS.dim;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x + stageW - 4, stageY + stageH / 2);
          ctx.lineTo(x + stageW + 4, stageY + stageH / 2);
          ctx.stroke();
        }
      });
      ctx.textAlign = 'left';

      // Spawn packets
      if (tick % 40 === 0) {
        packets.push({ x: 20, stage: 0, progress: 0, color: colors[Math.floor(rand(0, 6))], size: rand(6, 12) });
      }

      // Move packets
      packets = packets.filter(p => p.stage < stages.length);
      packets.forEach(p => {
        p.progress += 0.025;
        if (p.progress >= 1) {
          p.stage++;
          p.progress = 0;
        }
        const targetX = 20 + (p.stage + p.progress) * stageW;
        const y = stageY + stageH / 2 + Math.sin(tick * 0.1 + p.size) * 8;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(targetX, y, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Throughput meter
      ctx.fillStyle = COLORS.dim;
      ctx.font = `${Math.round(W/80)}px monospace`;
      ctx.fillText(`Throughput: ${(packets.length * 12.5).toFixed(0)} inf/s`, 16, H - 12);

      tick++;
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ── ENI Neural Signal ──────────────────────────────────────────────────────
  function initEniNeural(canvas) {
    const ctx = canvas.getContext('2d');
    const channels = 8;
    const signals = Array.from({length: channels}, (_, i) => ({
      phase: rand(0, Math.PI * 2),
      freq: rand(0.5, 2),
      amp: rand(0.3, 0.8),
      noise: rand(0.05, 0.15),
      color: [COLORS.blue, COLORS.violet, COLORS.cyan, COLORS.green, COLORS.amber, COLORS.red, COLORS.blue, COLORS.violet][i],
    }));
    let tick = 0;
    const history = Array.from({length: channels}, () => []);

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = COLORS.text;
      ctx.font = `bold ${Math.round(W/50)}px monospace`;
      ctx.fillText('ENI — 8-Channel Neural Acquisition', 16, 24);

      const rowH = (H - 40) / channels;

      signals.forEach((sig, i) => {
        const y = 36 + i * rowH + rowH / 2;
        const val = Math.sin(tick * 0.05 * sig.freq + sig.phase) * sig.amp + (Math.random() - 0.5) * sig.noise;
        history[i].push(val);
        if (history[i].length > W - 80) history[i].shift();

        // Channel label
        ctx.fillStyle = sig.color;
        ctx.font = `bold ${Math.round(W/80)}px monospace`;
        ctx.fillText(`CH${i + 1}`, 8, y + 4);

        // Waveform
        ctx.beginPath();
        ctx.strokeStyle = sig.color;
        ctx.lineWidth = 1.5;
        history[i].forEach((v, j) => {
          const px = 60 + j;
          const py = y + v * (rowH * 0.4);
          j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.stroke();

        // Spike detection
        if (Math.abs(val) > 0.6) {
          ctx.fillStyle = sig.color + 'cc';
          ctx.beginPath();
          ctx.arc(W - 20, y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      tick++;
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ── EIPC Message Bus ───────────────────────────────────────────────────────
  function initEipcIpc(canvas) {
    const ctx = canvas.getContext('2d');
    const processes = [
      { name: 'kernel', x: 0.5, y: 0.5, color: COLORS.blue },
      { name: 'net',    x: 0.2, y: 0.2, color: COLORS.cyan },
      { name: 'usb',    x: 0.8, y: 0.2, color: COLORS.violet },
      { name: 'audio',  x: 0.15,y: 0.7, color: COLORS.green },
      { name: 'sensor', x: 0.85,y: 0.7, color: COLORS.amber },
      { name: 'app',    x: 0.5, y: 0.85,color: COLORS.red },
    ];
    let messages = [];
    let tick = 0;

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = COLORS.text;
      ctx.font = `bold ${Math.round(W/50)}px monospace`;
      ctx.fillText('EIPC — Zero-Copy IPC Message Bus', 16, 24);

      const area = { x: 0, y: 30, w: W, h: H - 30 };

      // Draw connections
      processes.forEach((p, i) => {
        processes.forEach((q, j) => {
          if (i >= j) return;
          ctx.strokeStyle = 'rgba(59,130,246,0.06)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(area.x + p.x * area.w, area.y + p.y * area.h);
          ctx.lineTo(area.x + q.x * area.w, area.y + q.y * area.h);
          ctx.stroke();
        });
      });

      // Draw messages
      if (tick % 25 === 0) {
        const src = processes[Math.floor(rand(0, processes.length))];
        const dst = processes[Math.floor(rand(0, processes.length))];
        if (src !== dst) {
          messages.push({ src, dst, t: 0, color: src.color });
        }
      }
      messages = messages.filter(m => m.t < 1);
      messages.forEach(m => {
        m.t += 0.02;
        const x = lerp(area.x + m.src.x * area.w, area.x + m.dst.x * area.w, m.t);
        const y = lerp(area.y + m.src.y * area.h, area.y + m.dst.y * area.h, m.t);
        ctx.fillStyle = m.color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw processes
      processes.forEach(p => {
        const px = area.x + p.x * area.w;
        const py = area.y + p.y * area.h;
        const r = W / 25;
        ctx.fillStyle = p.color + '33';
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = p.color;
        ctx.font = `bold ${Math.round(W/80)}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(p.name, px, py + 4);
      });
      ctx.textAlign = 'left';

      tick++;
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ── eBootloader Chain of Trust ─────────────────────────────────────────────
  function initEbootChain(canvas) {
    const ctx = canvas.getContext('2d');
    const stages = ['ROM BL0', 'BL1', 'BL2', 'BL31', 'Application'];
    const colors = [COLORS.red, COLORS.amber, COLORS.green, COLORS.cyan, COLORS.blue];
    let currentStage = 0;
    let stageProgress = 0;
    let tick = 0;

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = COLORS.text;
      ctx.font = `bold ${Math.round(W/50)}px monospace`;
      ctx.fillText('eBootloader — Chain of Trust Verification', 16, 24);

      const stageW = (W - 40) / stages.length;
      const stageH = H * 0.4;
      const stageY = H * 0.3;

      stages.forEach((name, i) => {
        const x = 20 + i * stageW;
        const isActive = i === currentStage;
        const isDone = i < currentStage;

        ctx.fillStyle = isDone ? colors[i] + '44' : isActive ? colors[i] + '22' : 'rgba(255,255,255,0.03)';
        ctx.strokeStyle = isDone ? colors[i] : isActive ? colors[i] : COLORS.dim;
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.beginPath();
        ctx.roundRect(x + 4, stageY, stageW - 8, stageH, 8);
        ctx.fill();
        ctx.stroke();

        // Lock icon for verified
        if (isDone) {
          ctx.fillStyle = colors[i];
          ctx.font = `${Math.round(W/60)}px monospace`;
          ctx.textAlign = 'center';
          ctx.fillText('✓', x + stageW / 2, stageY + stageH * 0.45);
        }

        ctx.fillStyle = isActive ? colors[i] : isDone ? colors[i] + 'cc' : COLORS.dim;
        ctx.font = `bold ${Math.round(W/80)}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(name, x + stageW / 2, stageY + stageH * 0.75);

        // Progress bar for active
        if (isActive) {
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          ctx.fillRect(x + 8, stageY + stageH - 12, stageW - 16, 6);
          ctx.fillStyle = colors[i];
          ctx.fillRect(x + 8, stageY + stageH - 12, (stageW - 16) * stageProgress, 6);
        }

        // Arrow
        if (i < stages.length - 1) {
          ctx.strokeStyle = i < currentStage ? colors[i] : COLORS.dim;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x + stageW - 4, stageY + stageH / 2);
          ctx.lineTo(x + stageW + 4, stageY + stageH / 2);
          ctx.stroke();
        }
      });
      ctx.textAlign = 'left';

      // Status
      ctx.fillStyle = COLORS.dim;
      ctx.font = `${Math.round(W/80)}px monospace`;
      ctx.fillText(currentStage < stages.length ? `Verifying ${stages[currentStage]}...` : 'Boot complete ✓', 16, H - 12);

      stageProgress += 0.008;
      if (stageProgress >= 1) {
        stageProgress = 0;
        currentStage = (currentStage + 1) % stages.length;
      }
      tick++;
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ── eBuild Pipeline ────────────────────────────────────────────────────────
  function initEbuildPipeline(canvas) {
    const ctx = canvas.getContext('2d');
    const steps = ['Source', 'Config', 'CMake', 'Ninja', 'Link', 'SDK'];
    const colors = [COLORS.blue, COLORS.violet, COLORS.cyan, COLORS.green, COLORS.amber, COLORS.red];
    let buildProgress = 0;
    let buildStep = 0;
    let logs = [];
    const logMessages = [
      '-- Configuring done', '-- Build files written', 'Compiling kernel/sched.c',
      'Compiling drivers/uart.c', 'Linking libeos.a', 'Generating SDK headers',
      'Build succeeded in 1.2s', 'Artifacts: eos.elf, eos.bin',
    ];

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = COLORS.text;
      ctx.font = `bold ${Math.round(W/50)}px monospace`;
      ctx.fillText('eBuild — Cross-Compilation Pipeline', 16, 24);

      // Pipeline steps
      const stageW = (W * 0.6) / steps.length;
      steps.forEach((name, i) => {
        const x = 16 + i * stageW;
        const y = H * 0.15;
        const h = H * 0.35;
        const isDone = i < buildStep;
        const isActive = i === buildStep;

        ctx.fillStyle = isDone ? colors[i] + '44' : isActive ? colors[i] + '22' : 'rgba(255,255,255,0.03)';
        ctx.strokeStyle = isDone ? colors[i] : isActive ? colors[i] : COLORS.dim;
        ctx.lineWidth = isActive ? 2 : 1;
        ctx.beginPath();
        ctx.roundRect(x + 2, y, stageW - 4, h, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isActive ? colors[i] : isDone ? colors[i] : COLORS.dim;
        ctx.font = `bold ${Math.round(W/90)}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(name, x + stageW / 2, y + h * 0.55);
        if (isDone) ctx.fillText('✓', x + stageW / 2, y + h * 0.8);
        ctx.textAlign = 'left';

        if (isActive) {
          ctx.fillStyle = 'rgba(255,255,255,0.1)';
          ctx.fillRect(x + 4, y + h - 10, stageW - 8, 5);
          ctx.fillStyle = colors[i];
          ctx.fillRect(x + 4, y + h - 10, (stageW - 8) * buildProgress, 5);
        }
      });

      // Log area
      const logX = W * 0.62;
      const logY = H * 0.12;
      const logH = H * 0.75;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(logX, logY, W - logX - 8, logH, 6);
      ctx.fill();
      ctx.stroke();

      ctx.font = `${Math.round(W/90)}px monospace`;
      const maxLogs = Math.floor(logH / 18);
      logs.slice(-maxLogs).forEach((log, i) => {
        ctx.fillStyle = i === logs.slice(-maxLogs).length - 1 ? COLORS.green : COLORS.dim;
        ctx.fillText(log, logX + 8, logY + 16 + i * 18);
      });

      buildProgress += 0.01;
      if (buildProgress >= 1) {
        buildProgress = 0;
        buildStep = (buildStep + 1) % steps.length;
        logs.push(logMessages[buildStep % logMessages.length]);
        if (logs.length > 20) logs.shift();
      }

      requestAnimationFrame(draw);
    }
    draw();
  }

  // ── Generic animated simulation for remaining products ─────────────────────
  function initGenericSim(canvas, title, nodeNames, nodeColors) {
    const ctx = canvas.getContext('2d');
    const nodes = nodeNames.map((name, i) => ({
      name,
      x: 0.1 + (i % 4) * 0.25,
      y: 0.25 + Math.floor(i / 4) * 0.5,
      color: nodeColors[i % nodeColors.length],
      pulse: rand(0, Math.PI * 2),
    }));
    let packets = [];
    let tick = 0;

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = COLORS.text;
      ctx.font = `bold ${Math.round(W/50)}px monospace`;
      ctx.fillText(title, 16, 24);

      const area = { x: 0, y: 30, w: W, h: H - 30 };

      // Connections
      nodes.forEach((n, i) => {
        nodes.forEach((m, j) => {
          if (i >= j) return;
          ctx.strokeStyle = 'rgba(59,130,246,0.06)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(area.x + n.x * area.w, area.y + n.y * area.h);
          ctx.lineTo(area.x + m.x * area.w, area.y + m.y * area.h);
          ctx.stroke();
        });
      });

      // Packets
      if (tick % 30 === 0 && nodes.length >= 2) {
        const src = nodes[Math.floor(rand(0, nodes.length))];
        const dst = nodes[Math.floor(rand(0, nodes.length))];
        if (src !== dst) packets.push({ src, dst, t: 0, color: src.color });
      }
      packets = packets.filter(p => p.t < 1);
      packets.forEach(p => {
        p.t += 0.025;
        const x = lerp(area.x + p.src.x * area.w, area.x + p.dst.x * area.w, p.t);
        const y = lerp(area.y + p.src.y * area.h, area.y + p.dst.y * area.h, p.t);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Nodes
      nodes.forEach(n => {
        const px = area.x + n.x * area.w;
        const py = area.y + n.y * area.h;
        const pulse = Math.sin(tick * 0.05 + n.pulse) * 0.3 + 0.7;
        const r = W / 22;

        ctx.fillStyle = n.color + '22';
        ctx.strokeStyle = n.color + Math.round(pulse * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = n.color;
        ctx.font = `bold ${Math.round(W/85)}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(n.name, px, py + 4);
      });
      ctx.textAlign = 'left';

      tick++;
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ── Dispatcher ─────────────────────────────────────────────────────────────
  const simMap = {
    'canvas-eos-scheduler':   () => initEosScheduler(document.getElementById('canvas-eos-scheduler')),
    'canvas-eai-inference':   () => initEaiInference(document.getElementById('canvas-eai-inference')),
    'canvas-eni-neural':      () => initEniNeural(document.getElementById('canvas-eni-neural')),
    'canvas-eipc-ipc':        () => initEipcIpc(document.getElementById('canvas-eipc-ipc')),
    'canvas-eboot-chain':     () => initEbootChain(document.getElementById('canvas-eboot-chain')),
    'canvas-ebuild-pipeline': () => initEbuildPipeline(document.getElementById('canvas-ebuild-pipeline')),
    'canvas-eosim-sim':       () => {
      const c = document.getElementById('canvas-eosim-sim');
      if (c) initGenericSim(c, 'EoSim — QEMU + HIL Bridge', ['QEMU', 'GDB', 'HIL', 'Periph', 'Target'], [COLORS.blue, COLORS.violet, COLORS.cyan, COLORS.green, COLORS.amber]);
    },
    'canvas-eostudio-ide':    () => {
      const c = document.getElementById('canvas-eostudio-ide');
      if (c) initGenericSim(c, 'EoStudio — RTOS-Aware IDE', ['Editor', 'Debug', 'RTOS', 'Flash', 'Serial'], [COLORS.blue, COLORS.cyan, COLORS.violet, COLORS.green, COLORS.amber]);
    },
    'canvas-edb-metrics':     () => {
      const c = document.getElementById('canvas-edb-metrics');
      if (c) initGenericSim(c, 'eDB — Embedded Database Metrics', ['Query', 'WAL', 'B-Tree', 'Cache', 'AES', 'Storage'], [COLORS.blue, COLORS.violet, COLORS.cyan, COLORS.green, COLORS.amber, COLORS.red]);
    },
    'canvas-eapps-apps':      () => {
      const c = document.getElementById('canvas-eapps-apps');
      if (c) initGenericSim(c, 'eApps — Application Runtime', ['Launcher', 'Sandbox', 'IPC', 'Store', 'Update'], [COLORS.blue, COLORS.violet, COLORS.cyan, COLORS.green, COLORS.amber]);
    },
    'canvas-ebowser-browser': () => {
      const c = document.getElementById('canvas-ebowser-browser');
      if (c) initGenericSim(c, 'eBowser — Embedded Browser Engine', ['HTML', 'CSS', 'JS', 'Net', 'Render'], [COLORS.blue, COLORS.violet, COLORS.cyan, COLORS.green, COLORS.amber]);
    },
    'canvas-eoffice-office':  () => {
      const c = document.getElementById('canvas-eoffice-office');
      if (c) initGenericSim(c, 'eOffice — Embedded Office Suite', ['Docs', 'Sheets', 'Slides', 'PDF', 'Sync'], [COLORS.blue, COLORS.violet, COLORS.cyan, COLORS.green, COLORS.amber]);
    },
    'canvas-eserviceapps':    () => {
      const c = document.getElementById('canvas-eserviceapps');
      if (c) initGenericSim(c, 'eServiceApps — System Services', ['Auth', 'Log', 'Config', 'Update', 'Monitor'], [COLORS.blue, COLORS.violet, COLORS.cyan, COLORS.green, COLORS.amber]);
    },
    'canvas-eos-platform':    () => {
      const c = document.getElementById('canvas-eos-platform');
      if (c) initGenericSim(c, 'EoS Platform — Full Stack', ['EoS', 'EAI', 'ENI', 'EIPC', 'eDB', 'eApps'], [COLORS.blue, COLORS.violet, COLORS.cyan, COLORS.green, COLORS.amber, COLORS.red]);
    },
  };

  // Initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function () {
    Object.entries(simMap).forEach(([id, init]) => {
      const canvas = document.getElementById(id);
      if (canvas) {
        resizeCanvas(canvas);
        init();
        window.addEventListener('resize', () => resizeCanvas(canvas));
      }
    });
  });

})();
