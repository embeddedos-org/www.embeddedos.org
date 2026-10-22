/* The homepage's Black Edition behaviour: the ray-traced scroll story, the making-of film, the industry explorer
   and the board showcase. mountBlack(host) wires everything inside host and returns a function that undoes all of
   it (listeners, observers, animation frames, workers, downloads, videos), so leaving the page releases the story.

   Every piece reads markup that is already in the page and works without this file: the poster stands in for the
   story, the film has its own controls, every chapter and every board is in the HTML. */

const D = document;
const W = window;

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const sm = x => {
  x = clamp(x, 0, 1);
  return x * x * (3 - 2 * x);
};
const win = (x, a, b, c, d) =>
  sm((x - a) / (b - a)) * (1 - sm((x - c) / (d - c)));
const pad = (n, w) => String(n).padStart(w, "0");
// piecewise-linear keyframes [u, ...values], optionally eased between keys
function pl(K, u, ease) {
  if (u <= K[0][0]) return K[0].slice(1);
  for (let i = 1; i < K.length; i++)
    if (u <= K[i][0]) {
      const a = K[i - 1];
      const b = K[i];
      let t = (u - a[0]) / (b[0] - a[0]);
      if (ease) t = t * t * (3 - 2 * t);
      const o = [];
      for (let j = 1; j < a.length; j++) o.push(a[j] + (b[j] - a[j]) * t);
      return o;
    }
  return K[K.length - 1].slice(1);
}

const SMALL_Q = "(orientation: portrait), (max-width: 800px)";

/** The machine and the screen, read once: which frame set is sharp here, and whether this is a weak machine. */
export function frameTier() {
  const n = navigator;
  const c = n.connection || {};
  const small = W.matchMedia(SMALL_Q).matches;
  const dpr = Math.min(2, W.devicePixelRatio || 1);
  const weak =
    (n.hardwareConcurrency || 4) <= 2 ||
    (n.deviceMemory || 4) <= 2 ||
    !!c.saveData;
  const slow = /(^|-)2g|3g/.test(c.effectiveType || "");
  const need = Math.max(innerWidth, innerHeight * 1.6) * 1.12 * dpr;
  // 2560 (d) for Retina and wide screens; 1920 (h) for 1x laptops, where it looks the same at two-thirds the
  // bytes; 1280 (m) for phones. A weak machine never takes d; a 2G/3G connection takes m.
  const set =
    small || slow || need <= 1331 ? "m" : need <= 1997 || weak ? "h" : "d";
  return { set, weak, small, slow };
}

export function mountBlack(host) {
  const off = [];
  const on = (t, ev, fn, o) => {
    t.addEventListener(ev, fn, o);
    off.push(() => t.removeEventListener(ev, fn, o));
  };
  const observe = (cb, opts, el) => {
    if (!("IntersectionObserver" in W) || !el) return null;
    const io = new IntersectionObserver(cb, opts);
    io.observe(el);
    off.push(() => io.disconnect());
    return io;
  };
  const timers = new Set();
  const later = (fn, ms) => {
    const id = setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
    return id;
  };
  off.push(() => timers.forEach(clearTimeout));
  let disposed = false;
  off.push(() => {
    disposed = true;
  });

  const root = host;
  const $ = id => host.querySelector("#" + id);
  let reduce = false;
  let hoverable = false;
  try {
    reduce = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
    hoverable = W.matchMedia("(hover: hover) and (pointer: fine)").matches;
  } catch {
    /* matchMedia missing: keep the defaults */
  }
  const tier = frameTier();
  let lite = tier.weak;
  root.classList.toggle("lite", lite);
  const motion = !reduce && !lite;

  const canCine = !reduce && !!D.createElement("canvas").getContext;
  if (canCine) off.push(story());
  off.push(film());
  off.push(explorer());
  off.push(showcase($("bshow")));
  off.push(reveals());

  return () => {
    for (let i = off.length - 1; i >= 0; i--) {
      try {
        if (off[i]) off[i]();
      } catch {
        /* keep releasing the rest */
      }
    }
    off.length = 0;
  };

  /* ---------------------------------------------------------------- the scroll story */
  function story() {
    const stop = [];
    let alive = true;
    stop.push(() => {
      alive = false;
    });
    const dead = () => disposed || !alive;
    const onS = (t, ev, fn, o) => {
      t.addEventListener(ev, fn, o);
      stop.push(() => t.removeEventListener(ev, fn, o));
    };
    const tierNow = frameTier();
    const TOTAL = 239;
    const UNITS = 12.2;
    // frame for each scroll position: unhurried moves, long holds where the text sits
    const FMAP = [
      [0, 0],
      [0.5, 4],
      [2.4, 60],
      [3.6, 76],
      [4.6, 92],
      [5.8, 112],
      [8.2, 184],
      [9.6, 238],
      [12.2, 238],
    ];
    // camera: [u, x (× viewport width), y (× viewport height), scale]
    const CAM_L = [
      [0, 0, 0.3, 0.78],
      [0.5, 0, 0.3, 0.78],
      [2.1, 0, 0, 1],
      [2.5, 0.1, 0, 1],
      [4.2, 0.1, 0, 1],
      [4.8, -0.08, 0, 1],
      [6.2, -0.08, 0, 1],
      [6.8, 0, -0.12, 0.8],
      [8.3, 0, -0.12, 0.8],
      [9.5, 0.17, 0, 1.12],
      [12.2, 0.17, 0, 1.12],
    ];
    const CAM_P = [
      [0, 0.05, 0.2, 0.88],
      [0.5, 0.05, 0.2, 0.88],
      [2.1, 0, -0.08, 1.5],
      [4.2, 0, -0.08, 1.5],
      [4.8, 0, -0.1, 1.3],
      [6.2, 0, -0.1, 1.3],
      [6.8, 0, -0.1, 1],
      [8.3, 0, -0.1, 1],
      [9.5, 0, -0.14, 1.35],
      [12.2, 0, -0.14, 1.35],
    ];
    // text windows [fade in from, fully in, fade out from, gone]
    const W1 = [2.5, 2.85, 4.0, 4.35];
    const W2 = [4.9, 5.25, 6.05, 6.4];
    const W3 = [6.95, 7.3, 8.15, 8.5];
    const W4 = 9.45;
    const TR = [9.7, 11.5];
    const storyEl = $("bk-story");
    const stage = $("bk-stage");
    const cam = $("bk-cam");
    if (!storyEl || !stage || !cam) return null;
    // the frames' folder, as the page names it (data.ts MEDIA_HOME)
    const MEDIA = (storyEl.getAttribute("data-media") || "/media/") + "story/";
    root.classList.add("cine");
    root.style.setProperty("--units", UNITS);
    stop.push(() => root.classList.remove("cine", "live"));

    const small = tierNow.small;
    // this instance's own copy: the opening keyframes are moved down to clear the hero's text (size())
    const CAM = (small ? CAM_P : CAM_L).map(k => k.slice());
    const CAM_Y0 = CAM[0][2];
    // The canvas is made here, not in the markup: once handed to a worker it cannot be taken back, and a remount
    // needs a fresh one.
    const canvas = D.createElement("canvas");
    canvas.className = "seq";
    canvas.setAttribute("aria-hidden", "true");
    cam.appendChild(canvas);
    stop.push(() => canvas.remove());

    // Frames are ray-traced at 2560×1600 (AVIF) in three sets, packed side by side in strips of 2 (d, h) or
    // 4 (m) frames so no file passes the site's 260 KB image budget. A machine that decodes too slowly steps
    // down one set while it runs.
    const SETS = { d: [2560, 1600, 2], h: [1920, 1200, 2], m: [1280, 800, 4] };
    const ORDER = "dhm";
    let SET;
    let FW;
    let FH;
    let TW;
    let TH;
    let base;
    let CPER;
    const AC = 16;
    function useSet(name) {
      const t = SETS[name];
      SET = name;
      FW = t[0];
      FH = t[1];
      TW = 128; // one shared thumbnail atlas (128×80 per frame) serves every set
      TH = 80;
      base = MEDIA + SET + "/";
      CPER = t[2];
      // windows are set in frames, so strips of 2 or 4 frames behave alike: decode ~8 frames around the scroll
      // position, keep ~12-16 decoded, fetch ~24 ahead
      SPAN = Math.max(2, Math.round(8 / CPER));
      LRU_MAX = SPAN + 1;
      AHEAD = Math.round(24 / CPER);
    }
    let SPAN = 2;
    let LRU_MAX = 4;
    let AHEAD = 6;
    useSet(tierNow.set);
    let NC = Math.ceil(TOTAL / CPER);
    let DW = 0;
    let DH = 0;
    // decode only as many pixels as this screen can show (the camera zooms up to 1.12× on desktop, 1.5× on phones)
    function fitW() {
      const dpr = Math.min(2, W.devicePixelRatio || 1);
      const css = small
        ? innerWidth * 1.6 * 1.5
        : Math.max(innerWidth, innerHeight * 1.6) * 1.12;
      return Math.min(FW, Math.max(640, Math.ceil((css * dpr) / 16) * 16));
    }
    DW = fitW();
    DH = Math.round((DW * FH) / FW);

    // the opening strips of the chosen set, fetched alongside the rest of the page's first work
    for (let i = 0; i < 4; i++) {
      const l = D.createElement("link");
      l.rel = "preload";
      l.as = "fetch";
      l.crossOrigin = "anonymous";
      l.href = base + "s" + pad(i, 3) + ".avif";
      D.head.appendChild(l);
      stop.push(() => l.remove());
    }

    let ema = 16;
    let slow = 0;
    let eco = false;
    let lastKey = "";
    let dir = 1;
    let blobs = new Array(NC);
    let state = [];
    let bitmaps = {};
    let lru = [];
    let atlas = null;
    let wanted = 0;
    let inflight = 0;
    let decoding = {};
    let gen = 0;
    let abort = W.AbortController ? new AbortController() : null;
    let held = [];
    let decMs = [];
    let stepAt = 0;
    let quiet = false;
    for (let z = 0; z < NC; z++) state[z] = 0;
    const conn = navigator.connection || {};
    const fastNet =
      !conn.saveData && !/(^|-)2g|3g/.test(conn.effectiveType || "4g");
    let prefetchAll = false;
    let canStream = false;
    let worker = null;
    let drawer = null;
    let offs = false;
    let ctx = null;
    let sharp = false;
    let ready = false;
    stop.push(() => {
      if (abort) abort.abort();
      if (drawer) drawer.terminate();
      if (worker) worker.terminate();
      if (!offs) release(Object.keys(bitmaps).flatMap(k => bitmaps[k] || []));
      release(held.map(h => h.b));
      if (atlas && atlas.close) atlas.close();
    });

    function goLive() {
      if (!root.classList.contains("live")) root.classList.add("live");
    }
    function chunkUrl(i) {
      return base + "s" + pad(i, 3) + ".avif";
    }
    function mkWorker(kind) {
      try {
        return kind === "drawer"
          ? new Worker(new URL("./drawer.worker.js", import.meta.url))
          : new Worker(new URL("./decoder.worker.js", import.meta.url));
      } catch {
        return null;
      }
    }
    // A worker that cannot start never answers, so each one must answer a ping before it is trusted; the canvas
    // is only handed to the drawing worker after that.
    function probe(wk, ms, cb) {
      if (!wk) return cb(false);
      let done = false;
      const t = later(() => {
        if (!done) {
          done = true;
          cb(false);
        }
      }, ms);
      wk.onerror = () => {
        if (!done) {
          done = true;
          clearTimeout(t);
          cb(false);
        }
      };
      wk.onmessage = e => {
        if (!done && e.data && e.data.t === "pong") {
          done = true;
          clearTimeout(t);
          cb(true);
        }
      };
      try {
        wk.postMessage({ t: "ping" });
      } catch {
        done = true;
        clearTimeout(t);
        cb(false);
      }
    }
    function startOffscreen() {
      const oc = canvas.transferControlToOffscreen();
      drawer.postMessage(
        {
          t: "init",
          canvas: oc,
          FW,
          FH,
          DW,
          DH,
          TW,
          TH,
          AC,
          PER: CPER,
          T: TOTAL,
          g: gen,
        },
        [oc]
      );
      drawer.postMessage({ t: "want", w: wanted, s: SPAN });
      drawer.onmessage = e => {
        const d = e.data;
        if (d.t === "have") {
          if (d.g !== gen) return; // decoded before a set switch or a resize; the drawer has already moved it aside
          delete decoding[d.id];
          noteDecode(d.ms);
          if (Math.abs(d.id - wanted) > SPAN) {
            drawer.postMessage({ t: "drop", id: d.id });
            return;
          }
          bitmaps[d.id] = true;
          touch(d.id);
          dirty = true;
        } else if (d.t === "fail") {
          if (d.g === gen) delete decoding[d.id]; // a stale reply must not clear a newer request
        } else if (d.t === "live") goLive();
      };
      offs = true;
    }
    function startMain() {
      ctx = canvas.getContext("2d", { alpha: false });
      const wk = mkWorker("decoder"); // until it answers, strips decode on the main thread
      probe(wk, 1500, ok => {
        if (dead()) return;
        for (const k in decoding) delete decoding[k];
        if (!ok) {
          if (wk) wk.terminate();
          dirty = true;
          return;
        }
        worker = wk;
        worker.onmessage = e => {
          const d = e.data;
          const i = d.id;
          if (d.g !== undefined && d.g !== gen) {
            if (d.frames) d.frames.forEach(f => f.close());
            return;
          }
          delete decoding[i];
          if (d.err || !d.frames) return;
          noteDecode(d.ms);
          if (Math.abs(i - wanted) > SPAN) {
            d.frames.forEach(f => f.close());
            return;
          }
          bitmaps[i] = d.frames;
          touch(i);
          unhold(i);
          dirty = true;
        };
        worker.postMessage({ t: "want", w: wanted, s: SPAN });
        dirty = true;
      });
    }
    function boot(after) {
      if (canvas.transferControlToOffscreen && W.Worker && W.OffscreenCanvas) {
        drawer = mkWorker("drawer");
        probe(drawer, 1500, ok => {
          if (dead()) return;
          if (ok) startOffscreen();
          else {
            if (drawer) drawer.terminate();
            drawer = null;
            startMain();
          }
          ready = true;
          size();
          after();
        });
      } else {
        startMain();
        ready = true;
        after();
      }
    }
    function release(list) {
      list.forEach(x => {
        if (x && x.close) x.close();
      });
    }
    function touch(i) {
      const k = lru.indexOf(i);
      if (k >= 0) lru.splice(k, 1);
      lru.push(i);
      while (lru.length > LRU_MAX) {
        const old = lru.shift();
        if (offs) drawer.postMessage({ t: "drop", id: old });
        else if (bitmaps[old] && bitmaps[old].forEach) release(bitmaps[old]);
        delete bitmaps[old];
      }
    }
    function ensureBitmap(i) {
      if (
        !ready ||
        i < 0 ||
        i >= NC ||
        bitmaps[i] ||
        decoding[i] ||
        state[i] !== 2
      )
        return;
      const src = blobs[i];
      decoding[i] = true;
      if (offs) {
        drawer.postMessage({ t: "strip", id: i, blob: src });
        return;
      }
      if (worker) {
        worker.postMessage({
          id: i,
          blob: src,
          fw: FW,
          fh: FH,
          n: Math.min(CPER, TOTAL - i * CPER),
          rw: DW,
          rh: DH,
          g: gen,
        });
        return;
      }
      // no worker allowed: decode and crop on the main thread (the browser still decodes off-thread), 2 at a time
      if (Object.keys(decoding).length > 2 && i !== wanted) {
        delete decoding[i];
        return;
      }
      const n = Math.min(CPER, TOTAL - i * CPER);
      const w = DW;
      const h = DH;
      const fw = FW;
      const fh = FH;
      const g = gen;
      const t0 = performance.now();
      createImageBitmap(src)
        .then(bm => {
          const J = [];
          for (let j = 0; j < n; j++)
            J.push(
              w === fw
                ? createImageBitmap(bm, j * fw, 0, fw, fh)
                : createImageBitmap(bm, j * fw, 0, fw, fh, {
                    resizeWidth: w,
                    resizeHeight: h,
                    resizeQuality: "high",
                  })
            );
          return Promise.all(J).then(o => {
            bm.close();
            if (g !== gen || dead()) {
              o.forEach(f => f.close());
              return;
            }
            delete decoding[i];
            noteDecode(performance.now() - t0);
            if (Math.abs(i - wanted) > SPAN || w !== DW) {
              o.forEach(f => f.close());
              return;
            }
            bitmaps[i] = o;
            touch(i);
            unhold(i);
            dirty = true;
          });
        })
        .catch(() => {
          if (g === gen) delete decoding[i];
        });
    }
    function pump() {
      const ahead = AHEAD;
      const behind = 1;
      const cap = 6;
      while (inflight < cap) {
        let best = -1;
        let bd = 1e9;
        for (let i = 0; i < NC; i++) {
          if (state[i] !== 0) continue;
          const rel = (i - wanted) * dir;
          if (!prefetchAll && (rel < -behind || rel > ahead)) continue;
          const d = Math.abs(rel) + (rel < 0 ? 1.5 : 0);
          if (d < bd) {
            bd = d;
            best = i;
          }
        }
        if (best < 0) return;
        state[best] = 1;
        inflight++;
        const i = best;
        const g = gen;
        fetch(chunkUrl(i), abort ? { signal: abort.signal } : undefined)
          .then(r => {
            if (!r.ok) throw new Error(String(r.status));
            return r.blob();
          })
          .then(
            b => {
              if (g !== gen || dead()) return;
              blobs[i] = b;
              state[i] = 2;
              inflight--;
              if (Math.abs(i - wanted) <= SPAN) ensureBitmap(i);
              dirty = true;
              pump();
            },
            () => {
              if (g !== gen || dead()) return;
              state[i] = 3;
              inflight--;
              pump();
            }
          );
      }
    }
    function drawFrame(i, alpha) {
      if (i < 0) i = 0;
      if (i >= TOTAL) i = TOTAL - 1;
      const si = Math.floor(i / CPER);
      const j = i % CPER;
      const bm = bitmaps[si];
      ctx.globalAlpha = alpha;
      if (bm && bm[j]) {
        ctx.drawImage(bm[j], 0, 0, DW, DH);
        return 2;
      }
      ensureBitmap(si);
      // not decoded yet: hold the nearest sharp frame (within 16) instead of the blurry thumbnail
      let nb = null;
      let bd = 17;
      for (const k in bitmaps) {
        const fs = bitmaps[k];
        if (!fs || !fs.length) continue;
        for (let q = 0; q < fs.length; q++) {
          const dd = Math.abs(k * CPER + q - i);
          if (dd < bd && fs[q]) {
            bd = dd;
            nb = fs[q];
          }
        }
      }
      for (const h of held) {
        const he = Math.abs(h.i - i);
        if (he < bd) {
          bd = he;
          nb = h.b;
        }
      }
      if (nb) {
        ctx.drawImage(nb, 0, 0, DW, DH);
        return 3;
      }
      if (atlas && sharp) {
        ctx.drawImage(
          atlas,
          (i % AC) * TW,
          Math.floor(i / AC) * TH,
          TW,
          TH,
          0,
          0,
          DW,
          DH
        );
        return 1;
      }
      return 0;
    }

    let vh = 0;
    let vw = 0;
    let top0 = 0;
    let shown = 0;
    let dirty = true;
    let last = 0;
    function size() {
      const r = stage.getBoundingClientRect();
      vw = r.width;
      vh = r.height;
      const want = fitW();
      if (want > DW + 160 && ready) {
        // window grew: decode sharper frames, keeping the old ones on screen until they arrive
        DW = want;
        DH = Math.round((DW * FH) / FW);
        gen++;
        if (offs) drawer.postMessage({ t: "res", DW, DH, g: gen });
        else holdAll();
        bitmaps = {};
        lru = [];
        decoding = {};
      }
      if (!offs && ctx) {
        if (canvas.width !== DW) canvas.width = DW;
        if (canvas.height !== DH) canvas.height = DH;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }
      top0 = storyEl.getBoundingClientRect().top + W.scrollY;
      // The board opens just below the hero's text, whatever that text's height on this screen: frame 0's top edge
      // sits 20.5% down the camera's frame, so the camera starts low enough to keep it under the last line.
      const s0 = sc[0];
      if (s0) {
        const textBottom = s0.offsetTop + s0.offsetHeight;
        const camW = small ? innerWidth * 1.6 : Math.max(innerWidth, vh * 1.6);
        const camH = (camW / 1.6) * CAM[0][3];
        const y0 = Math.max(
          CAM_Y0,
          (textBottom + 18 + camH * 0.295 - vh / 2) / vh
        );
        CAM[0][2] = y0;
        CAM[1][2] = y0;
      }
      camKey = "";
      uiKey = -1;
      dirty = true;
    }

    /* scenes, camera, traces */
    const sc = [0, 1, 2, 3, 4].map(i => $("bk-sc" + i));
    const scrL = $("bk-scr-l");
    const scrR = $("bk-scr-r");
    const scrB = $("bk-scr-b");
    let tr = null;
    let trS = [];
    let trE = null;
    let trP = null;
    let trV = null;
    let trKey = -1;
    let dimKey = -1;
    function setOp(el, o, ty) {
      if (!el) return;
      const os = o < 0.003 ? "0" : o > 0.997 ? "1" : o.toFixed(3);
      if (el._o !== os) {
        el.style.opacity = os;
        el._o = os;
        const vis = o > 0.02;
        if (el._on !== vis) {
          el.classList.toggle("on", vis);
          el._on = vis;
        }
      }
      if (ty !== undefined) {
        const ts = ty ? "translate3d(0," + ty.toFixed(1) + "px,0)" : "none";
        if (el._t !== ts) {
          el.style.transform = ts;
          el._t = ts;
        }
      }
    }
    stop.push(() =>
      [...sc, scrL, scrR, scrB].forEach(el => {
        if (!el) return;
        el.style.opacity = "";
        el.style.transform = "";
        el.classList.remove("on");
        el._o = el._t = el._on = undefined;
      })
    );
    let camKey = "";
    let uiKey = -1;
    function camAt(u) {
      const c = pl(CAM, u, true);
      const x = Math.round(c[0] * vw * 2) / 2;
      const y = Math.round(c[1] * vh * 2) / 2;
      const s = Math.round(c[2] * 1000) / 1000;
      const k = x + "|" + y + "|" + s;
      if (k !== camKey) {
        camKey = k;
        cam.style.transform =
          "translate(-50%,-50%) translate3d(" +
          x +
          "px," +
          y +
          "px,0) scale(" +
          s +
          ")";
      }
    }
    stop.push(() => {
      cam.style.transform = "";
    });
    const wo = (u, w) => win(u, w[0], w[1], w[2], w[3]);
    const rise = (u, a) => (1 - sm((u - a) / 0.35)) * 24;
    function ui(u) {
      const qk = Math.round(u * 600);
      if (qk === uiKey) return;
      uiKey = qk;
      const o0 = 1 - sm(u / 0.6);
      setOp(sc[0], o0, -50 * (1 - o0));
      const o1 = wo(u, W1);
      const o2 = wo(u, W2);
      const o3 = wo(u, W3);
      const o4 = sm((u - W4) / 0.35);
      setOp(sc[1], o1, rise(u, W1[0]));
      setOp(sc[2], o2, rise(u, W2[0]));
      setOp(sc[3], o3, rise(u, W3[0]));
      setOp(sc[4], o4, rise(u, W4));
      if (small) setOp(scrB, Math.max(o1, o2, o3, o4));
      else {
        setOp(scrL, o1);
        setOp(scrR, o2);
        setOp(scrB, o3);
      }
      // traces: outline, then front copper ring by ring from the RP2350A, then back copper, then pads; the
      // render dims beneath
      if (tr) {
        const p = clamp((u - TR[0]) / (TR[1] - TR[0]), 0, 1);
        const k = Math.round(p * 500);
        if (k !== trKey) {
          trKey = k;
          const pe = sm(p / 0.22);
          const pf = sm((p - 0.06) / 0.8);
          const pb = sm((p - 0.22) / 0.62);
          const pp = sm((p - 0.78) / 0.22);
          if (trE) trE.style.strokeDashoffset = (1 - pe).toFixed(3);
          for (const t of trS) {
            const q = clamp(((t.b ? pb : pf) - t.g * 0.07) / 0.51, 0, 1);
            const v = Math.round(t.m * (1 - q));
            if (t.v !== v) {
              t.v = v;
              t.el.style.strokeDashoffset = v;
            }
          }
          if (trP) trP.style.opacity = pp.toFixed(3);
          if (trV) trV.style.opacity = pp.toFixed(3);
        }
        const dk =
          Math.round((1 - 0.68 * sm((u - TR[0] - 0.15) / 1.2)) * 200) / 200;
        if (dk !== dimKey) {
          dimKey = dk;
          canvas.style.setProperty("--dim", dk);
        }
      }
    }
    const frameAt = u => pl(FMAP, u, false)[0];
    function insertTraces() {
      // the board's routing, drawn from its KiCad file; fetched once the page is idle
      fetch(MEDIA + "traces.svg", abort ? { signal: abort.signal } : undefined)
        .then(r =>
          r.ok ? r.text() : Promise.reject(new Error(String(r.status)))
        )
        .then(svg => {
          if (dead() || tr || !/^<svg class="traces"/.test(svg.trim())) return;
          cam.insertAdjacentHTML("beforeend", svg);
          tr = cam.querySelector(".traces");
          stop.push(() => tr && tr.remove());
          trS = [...tr.querySelectorAll(".t-f,.t-b")].map(el => ({
            el,
            g: +el.getAttribute("data-g"),
            m: +el.getAttribute("data-m"),
            b: el.classList.contains("t-b"),
            v: -1,
          }));
          trE = tr.querySelector(".t-edge");
          trP = tr.querySelector(".t-pad");
          trV = tr.querySelector(".t-via");
          dirty = true;
          uiKey = -1;
        })
        .catch(() => {
          /* the story reads without the routing overlay */
        });
    }

    // Frames decoded before a set switch stay drawable (scaled) until the new set covers the current frame.
    function holdAll() {
      unhold(-1);
      Object.keys(bitmaps).forEach(k =>
        (bitmaps[k] || []).forEach((b, j) => held.push({ i: k * CPER + j, b }))
      );
    }
    function unhold(si) {
      if (
        !held.length ||
        (si >= 0 && si !== Math.floor(Math.round(frameAt(shown)) / CPER))
      )
        return;
      release(held.map(h => h.b));
      held = [];
    }
    function switchSet(name) {
      if (name === SET || !SETS[name]) return;
      gen++;
      if (abort) {
        abort.abort();
        abort = new AbortController();
      }
      if (!offs) holdAll();
      useSet(name);
      NC = Math.ceil(TOTAL / CPER);
      DW = fitW();
      DH = Math.round((DW * FH) / FW);
      blobs = new Array(NC);
      state = [];
      for (let z = 0; z < NC; z++) state[z] = 0;
      bitmaps = {};
      lru = [];
      decoding = {};
      inflight = 0;
      decMs = [];
      stepAt = performance.now();
      wanted = Math.floor(frameAt(shown) / CPER);
      if (offs)
        drawer.postMessage({
          t: "set",
          FW,
          FH,
          TW,
          TH,
          PER: CPER,
          DW,
          DH,
          g: gen,
        });
      else {
        if (atlas && atlas.close) atlas.close();
        atlas = null;
      }
      if (offs) drawer.postMessage({ t: "want", w: wanted, s: SPAN });
      else if (worker) worker.postMessage({ t: "want", w: wanted, s: SPAN });
      size();
      getAtlas();
      dirty = true;
      pump();
    }
    function stepDown() {
      if (small || performance.now() - stepAt < 3000) return;
      const nx = ORDER.charAt(ORDER.indexOf(SET) + 1);
      if (nx) switchSet(nx);
    }
    // A strip's frames must decode at 25+ frames a second (two decodes run at once), i.e. under 80 ms a frame;
    // a machine slower than that for 4 strips in a row moves to the next smaller set.
    function noteDecode(ms) {
      if (!(ms > 0) || !quiet) return; // decodes while the page itself is still loading are not a fair measure
      decMs.push(ms / CPER);
      if (decMs.length > 4) decMs.shift();
      if (decMs.length === 4 && Math.min(...decMs) > 80) stepDown();
    }
    function probeGpu() {
      // a software renderer (no GPU) gets no cross-fades and a smaller set; no WebGL at all is not a slow GPU
      try {
        const tc = D.createElement("canvas");
        const tg =
          tc.getContext("webgl") || tc.getContext("experimental-webgl");
        if (!tg) return;
        const ex = tg.getExtension("WEBGL_debug_renderer_info");
        const rn = ex
          ? String(tg.getParameter(ex.UNMASKED_RENDERER_WEBGL))
          : "";
        const tl = tg.getExtension("WEBGL_lose_context");
        if (tl) tl.loseContext();
        if (/swiftshader|llvmpipe|software|basic render/i.test(rn)) {
          lite = true;
          root.classList.add("lite");
          stepDown();
        }
      } catch {
        /* keep the current set */
      }
    }
    let raf = 0;
    // the frame loop sleeps while the story is off screen (it wakes a little before the story scrolls back in)
    let awake = true;
    if ("IntersectionObserver" in W) {
      const sleeper = new IntersectionObserver(
        es => {
          if (dead()) return;
          awake = es[es.length - 1].isIntersecting;
          if (awake && !raf) {
            dirty = true;
            raf = W.requestAnimationFrame(tick);
          }
        },
        { rootMargin: "300px 0px" }
      );
      sleeper.observe(storyEl);
      stop.push(() => sleeper.disconnect());
    }
    function tick(now) {
      if (!awake) {
        raf = 0;
        last = 0;
        return;
      }
      raf = W.requestAnimationFrame(tick);
      const dt = last ? Math.min(100, now - last) : 16;
      last = now;
      const u = clamp((W.scrollY - top0) / Math.max(1, vh), 0, UNITS);
      const diff = u - shown;
      if (Math.abs(diff) > 0.0004 || dirty) {
        const kf = Math.abs(diff) > 3 ? 1 : 1 - Math.exp(-dt / 55); // the frame follows the scroll closely (55 ms)
        shown += diff * kf;
        if (Math.abs(u - shown) < 0.0004) shown = u;
        if (Math.abs(diff) > 0.002) dir = diff > 0 ? 1 : -1;
        if (canStream && !prefetchAll && shown > 0.5) {
          prefetchAll = true; // the reader is in the story: stream the rest of it
          pump();
        }
        const f = frameAt(shown);
        const nw = Math.floor(f / CPER);
        if (nw !== wanted) {
          wanted = nw;
          if (bitmaps[wanted]) touch(wanted);
          if (offs) drawer.postMessage({ t: "want", w: wanted, s: SPAN });
          else if (worker)
            worker.postMessage({ t: "want", w: wanted, s: SPAN });
          pump();
        }
        for (let k = 0; k <= SPAN; k++) ensureBitmap(wanted + k * dir);
        const blend = !lite && !eco;
        const key = blend ? f.toFixed(2) : String(Math.round(f));
        if (ready && (key !== lastKey || dirty)) {
          if (offs) drawer.postMessage({ t: "draw", f, blend });
          else if (ctx) {
            const fl = Math.floor(f);
            const fr = f - fl;
            const n1 = fl + 1;
            const b1 = bitmaps[Math.floor(n1 / CPER)];
            let ok;
            if (blend) {
              ok = drawFrame(fl, 1);
              if (ok === 2 && fr > 0.03 && n1 < TOTAL && b1 && b1[n1 % CPER])
                drawFrame(n1, fr);
              ctx.globalAlpha = 1;
            } else ok = drawFrame(Math.round(f), 1);
            if (ok === 2) {
              sharp = true;
              goLive();
            }
          }
          lastKey = dirty ? "" : key;
          dirty = false;
        }
        camAt(shown);
        ui(shown);
        if (root.classList.contains("live")) {
          // a busy machine first stops cross-fading (sharpness kept); if it is still slow, a smaller set
          ema = ema * 0.9 + dt * 0.1;
          slow = ema > 24 ? slow + 1 : Math.max(0, slow - 2);
          if (!eco && slow > 30) {
            eco = true;
            slow = 0;
          }
        }
      }
    }
    stop.push(() => W.cancelAnimationFrame(raf));
    function getAtlas() {
      const g = gen;
      fetch(MEDIA + "atlas.avif", abort ? { signal: abort.signal } : undefined)
        .then(r =>
          r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))
        )
        .then(b => {
          if (g !== gen || dead()) return;
          if (offs) {
            drawer.postMessage({ t: "atlas", blob: b });
            dirty = true;
            return;
          }
          return createImageBitmap(b).then(bm => {
            if (g !== gen || dead()) {
              bm.close();
              return;
            }
            atlas = bm;
            dirty = true;
          });
        })
        .catch(() => {
          /* the atlas only covers frames not decoded yet */
        });
    }
    // idle work is cancelled with the story, and does nothing if the story has gone
    const idleIds = [];
    stop.push(() => {
      if (W.cancelIdleCallback) idleIds.forEach(id => W.cancelIdleCallback(id));
    });
    const idle = (fn, t) => {
      const run = () => {
        if (!dead()) fn();
      };
      if (W.requestIdleCallback)
        idleIds.push(W.requestIdleCallback(run, { timeout: t }));
      else later(run, t / 3);
    };
    function afterLoad() {
      later(() => {
        quiet = true;
      }, 1500);
      if (!lite) idle(probeGpu, 1500);
      const ga = () => {
        if (dead()) return;
        if (ready) getAtlas();
        else later(ga, 120);
      };
      idle(ga, 800);
      idle(insertTraces, 2500);
      // The rest of the story streams in only on a connection that says it is fast (Chromium's Network
      // Information: 4G at 5 Mbit/s or more, no Save-Data), and only once the reader has scrolled into the story;
      // otherwise strips arrive just ahead of the scroll position (~24 frames).
      canStream =
        fastNet && conn.effectiveType === "4g" && (conn.downlink || 0) >= 5;
    }
    boot(() => {
      dirty = true;
      pump();
    });
    size();
    onS(
      W,
      "resize",
      () => {
        if (W.matchMedia(SMALL_Q).matches !== small) {
          // phone ↔ desktop layout changed: the camera path and frame set differ, so start over
          stopAll();
          stop.length = 0;
          const again = story();
          if (again) stop.push(again);
          return;
        }
        size();
      },
      { passive: true }
    );
    pump();
    if (D.readyState === "complete") afterLoad();
    else onS(W, "load", afterLoad, { once: true });
    raf = W.requestAnimationFrame(tick);
    function stopAll() {
      for (let i = stop.length - 1; i >= 0; i--) {
        try {
          if (stop[i]) stop[i]();
        } catch {
          /* keep releasing the rest */
        }
      }
    }
    return () => {
      stopAll();
      stop.length = 0;
    };
  }

  /* ---------------------------------------------------------------- the making-of film */
  function film() {
    // Short segments (cut at the chapters), played back to back on two stacked videos; the next is always loaded behind the
    // current one, so cuts are seamless and a chapter jump starts at once. H.264 MP4, from this site (the CSP
    // allows media from 'self' only, so no blob: fallback; Apache serves Range requests, so seeking is direct).
    const player = $("bk-player");
    if (!player) return null;
    const V = [$("bk-fv"), $("bk-fv2")];
    const fpp = $("bk-fpp");
    const pbig = $("bk-pbig");
    const ftrack = $("bk-ftrack");
    const ffill = $("bk-ffill");
    const ftime = $("bk-ftime");
    const chs = [...host.querySelectorAll("#bk-fchap button")];
    const SEG = player.getAttribute("data-segs").split(",").map(Number);
    const NS = SEG.length - 1;
    const FD = SEG[NS];
    const cn = navigator.connection;
    // weak machines and slow networks get the 720p film
    const hd =
      Math.min(innerWidth, 1600) * Math.min(W.devicePixelRatio || 1, 2) >
        1400 &&
      !tier.weak &&
      !(cn && (cn.saveData || /2g|3g/.test(cn.effectiveType || "")));
    const FB = player.getAttribute("data-base") + (hd ? "1080" : "720") + "/s";
    let act = 0;
    let cur = 0;
    const has = [-1, -1];
    let fRaf = 0;
    let idleT = 0;
    let userPaused = false;
    let playing = false;
    let swapping = false;
    const segUrl = k => FB + pad(k, 2) + ".mp4";
    function vsrc(v, u, ok) {
      if (v._u === u) {
        if (v.readyState >= 2) {
          if (ok) ok();
        } else if (ok) v._cb.push(ok);
        return;
      }
      v._cb = ok ? [ok] : [];
      v._u = u;
      v.onloadeddata = () => {
        if (v._u !== u) return;
        const cb = v._cb;
        v._cb = [];
        cb.forEach(f => f());
      };
      // a segment that will not load stops the film where it is, with the play button back, instead of leaving
      // it waiting at the next cut
      v.onerror = () => {
        if (v._u !== u) return;
        v._cb = [];
        v._u = "";
        swapping = false;
        playing = false;
        setUi(false);
      };
      v.preload = "auto";
      v.src = u;
      v.load();
    }
    function segAt(t) {
      for (let k = NS - 1; k > 0; k--) if (t >= SEG[k] - 0.001) return k;
      return 0;
    }
    function put(i, k, ok) {
      has[i] = k;
      vsrc(V[i], segUrl(k), ok);
    }
    function ahead() {
      const n = (cur + 1) % NS;
      const i = 1 - act;
      if (has[i] !== n) put(i, n);
    }
    function show(i, k) {
      const o = V[act];
      act = i;
      cur = k;
      player.classList.add("started");
      V[i].classList.add("on");
      o.classList.remove("on");
      o.pause();
      swapping = false;
      V[i].removeAttribute("aria-hidden");
      o.setAttribute("aria-hidden", "true");
      ahead();
      ftick();
    }
    function at(i, lt, then) {
      const v = V[i];
      if (!(lt > 0.05)) {
        if (v.currentTime > 0.05) v.currentTime = 0;
        return then();
      }
      v.currentTime = lt;
      then();
    }
    function go(k, lt, run) {
      if (k === cur && has[act] === k) {
        at(act, lt, () => {
          if (run) start();
          ftick();
        });
        return;
      }
      const i = 1 - act;
      const v = V[i];
      swapping = true;
      put(i, k, () => {
        at(i, lt, () => {
          if (run) {
            const pr = v.play();
            if (pr && pr.catch)
              pr.catch(() => {
                swapping = false;
              });
            if (v.requestVideoFrameCallback)
              v.requestVideoFrameCallback(() => show(i, k));
            else
              v.addEventListener("playing", () => show(i, k), { once: true });
          } else if (lt > 0.05)
            v.addEventListener("seeked", () => show(i, k), { once: true });
          else show(i, k);
        });
      });
    }
    function start() {
      playing = true;
      const v = V[act];
      // play once the segment's first frame is in; a refused play() (autoplay policy, data saver) leaves the big
      // play button up instead of a stuck "playing" state
      put(act, cur, () => {
        if (!playing || V[act] !== v) return;
        const pr = v.play();
        if (pr && pr.catch)
          pr.catch(() => {
            if (v.paused) {
              playing = false;
              setUi(false);
              ftick();
            }
          });
      });
    }
    function fplay() {
      userPaused = false;
      start();
    }
    function fstop() {
      playing = false;
      V[act].pause();
    }
    const mmss = t => {
      t = Math.max(0, Math.floor(t));
      return Math.floor(t / 60) + ":" + pad(t % 60, 2);
    };
    const now = () =>
      SEG[cur] + (has[act] === cur ? V[act].currentTime || 0 : 0);
    function ftick() {
      fRaf = 0;
      const t = Math.min(now(), FD);
      let k = -1;
      ffill.style.transform = "scaleX(" + (t / FD).toFixed(4) + ")";
      ftrack.setAttribute("aria-valuenow", String(Math.round((100 * t) / FD)));
      const ts = mmss(t) + " / " + mmss(FD);
      if (ftime._t !== ts) {
        ftime.textContent = ts;
        ftime._t = ts;
        ftrack.setAttribute("aria-valuetext", mmss(t) + " of " + mmss(FD));
      }
      chs.forEach((c, i) => {
        if (t >= +c.dataset.t - 0.05) k = i;
      });
      chs.forEach((c, i) => {
        const o = i === k;
        if (c._on !== o) {
          c.classList.toggle("on", o);
          c._on = o;
        }
      });
      if (playing && !swapping && V[act].ended) go((cur + 1) % NS, 0, true);
      if (playing) fRaf = W.requestAnimationFrame(ftick);
    }
    function seek(t) {
      t = clamp(t, 0, FD - 0.05);
      const k = segAt(t);
      playing = !userPaused;
      go(k, t - SEG[k], playing);
    }
    function wake() {
      player.classList.remove("idle");
      clearTimeout(idleT);
      idleT = later(() => player.classList.add("idle"), 2200);
    }
    function setUi(o) {
      player.classList.toggle("playing", o);
      if (o) player.classList.add("started");
      fpp.setAttribute("aria-label", o ? "Pause film" : "Play film");
    }
    const toggle = () => {
      if (playing) {
        userPaused = true;
        fstop();
      } else fplay();
    };
    V.forEach((v, i) => {
      on(v, "play", () => {
        if (i !== act && !swapping) return;
        setUi(true);
        wake();
        if (!fRaf) fRaf = W.requestAnimationFrame(ftick);
      });
      on(v, "pause", () => {
        if (i !== act || swapping || v.ended) return;
        playing = false;
        setUi(false);
        ftick();
      });
      on(v, "ended", () => {
        if (i === act && playing && !swapping) go((cur + 1) % NS, 0, true);
      });
      on(v, "click", toggle);
    });
    on(fpp, "click", toggle);
    on(pbig, "click", fplay);
    on(player, "pointermove", wake, { passive: true });
    chs.forEach(c =>
      on(c, "click", () => {
        userPaused = false;
        seek(+c.dataset.t);
      })
    );
    const trackSeek = x => {
      const r = ftrack.getBoundingClientRect();
      seek(clamp((x - r.left) / r.width, 0, 1) * FD);
    };
    on(ftrack, "click", e => trackSeek(e.clientX));
    on(ftrack, "keydown", e => {
      const to =
        e.key === "ArrowRight" || e.key === "ArrowUp"
          ? now() + 5
          : e.key === "ArrowLeft" || e.key === "ArrowDown"
            ? now() - 5
            : e.key === "PageUp"
              ? now() + 15
              : e.key === "PageDown"
                ? now() - 15
                : e.key === "Home"
                  ? 0
                  : e.key === "End"
                    ? FD
                    : null;
      if (to === null) return;
      e.preventDefault();
      // the film loops, so End while playing would run out and start again: it stops on the last frame
      if (e.key === "End" && playing) {
        userPaused = true;
        fstop();
      }
      seek(to);
    });
    host
      .querySelectorAll('a[href="#film"]')
      .forEach(a => on(a, "click", () => later(fplay, 650)));
    ftick();
    observe(
      es => {
        const e = es[0];
        if (e.isIntersecting && has[act] < 0) put(act, 0);
        if (
          e.intersectionRatio >= 0.55 &&
          !reduce &&
          !lite &&
          !userPaused &&
          !playing
        )
          fplay();
        else if (e.intersectionRatio < 0.2 && playing) fstop();
        if (e.intersectionRatio >= 0.2 && has[1 - act] < 0 && has[act] >= 0)
          ahead();
      },
      { threshold: [0, 0.2, 0.55], rootMargin: "300px 0px" },
      player
    );
    return () => {
      W.cancelAnimationFrame(fRaf);
      V.forEach(v => {
        v.pause();
        v.onloadeddata = null;
        v.removeAttribute("src");
        v.load();
      });
    };
  }

  /* ---------------------------------------------------------------- the industry explorer */
  function explorer() {
    // One chapter at a time: the list selects and the chapter's device clip plays while the explorer is on screen.
    // It never changes chapter by itself (a tour switched the text under the reader and, on phones, moved the page
    // by the difference in panel heights). Without this script every chapter shows, in order.
    const ix = host.querySelector(".bk-ix");
    if (!ix) return null;
    const list = ix.querySelector(".bk-ix-list");
    const tabs = [...ix.querySelectorAll('.bk-ix-list [role="tab"]')];
    const panels = tabs.map(t =>
      host.querySelector("#" + t.getAttribute("aria-controls"))
    );
    if (!tabs.length || panels.some(p => !p)) return null;
    ix.classList.add("js");
    panels.forEach(p => (p.tabIndex = 0));
    let cur = 0;
    let inView = false;
    // Each chapter's clip is watched, not the explorer: with its notes a chapter can be several screens tall on a
    // phone, and the explorer as a whole would never count as in view. A clip plays while a third of it is on screen.
    const figs = panels.map(p => p.querySelector(".bk-chap-media"));
    const ratio = new Map();
    // the list runs down the side on wide screens and across on phones
    const narrow = W.matchMedia("(max-width: 900px)");
    const orient = () =>
      list.setAttribute(
        "aria-orientation",
        narrow.matches ? "horizontal" : "vertical"
      );
    orient();
    on(narrow, "change", orient);
    const play = i => {
      const v = panels[i].querySelector("video");
      const fig = panels[i].querySelector(".bk-chap-media");
      if (!v || !fig || !motion) return;
      const u = fig.getAttribute("data-clip") + ".mp4";
      if (v.getAttribute("src") !== u) {
        v.preload = "auto";
        v.setAttribute("src", u);
      } else if (v.ended || v.currentTime > 0.1) v.currentTime = 0;
      const pr = v.play();
      if (pr && pr.then)
        pr.then(
          () => fig.classList.add("playing"),
          () => {
            /* autoplay refused: the poster stays */
          }
        );
    };
    function show(i) {
      const prev = cur;
      cur = i;
      tabs.forEach((b, k) => {
        b.setAttribute("aria-selected", String(k === i));
        b.tabIndex = k === i ? 0 : -1;
      });
      panels.forEach((p, k) => p.classList.toggle("on", k === i));
      if (prev !== i) {
        const v = panels[prev].querySelector("video");
        if (v) v.pause();
        const f = panels[prev].querySelector(".bk-chap-media");
        if (f) f.classList.remove("playing");
      }
      if (list.scrollWidth > list.clientWidth + 4)
        list.scrollTo({
          left: tabs[i].offsetLeft - 16,
          behavior: reduce ? "auto" : "smooth",
        });
      inView = false;
      check(); // the new chapter's clip starts once the observer has measured it
    }
    tabs.forEach((b, i) => {
      on(b, "click", e => {
        e.preventDefault();
        show(i);
      });
      on(b, "keydown", e => {
        const n = tabs.length;
        const k = /Arrow(Down|Right)/.test(e.key)
          ? (cur + 1) % n
          : /Arrow(Up|Left)/.test(e.key)
            ? (cur - 1 + n) % n
            : e.key === "Home"
              ? 0
              : e.key === "End"
                ? n - 1
                : -1;
        if (k < 0) return;
        e.preventDefault();
        show(k);
        tabs[k].focus();
      });
    });
    // A link to one chapter (#ch-…) opens it and brings it into view. The browser's own jump happens before the
    // story grows to its scroll length and the other chapters fold away, so the scroll is set again once the
    // layout has settled (and left alone if the reader has scrolled meanwhile).
    const land = k => {
      let moved = false;
      const mark = () => {
        moved = true;
      };
      ["wheel", "touchstart", "keydown"].forEach(ev =>
        on(W, ev, mark, { once: true, passive: true })
      );
      const go = () => {
        if (moved || disposed) return;
        const top = panels[k].getBoundingClientRect().top + W.scrollY - 64 - 24;
        W.scrollTo({ top: Math.max(0, top), behavior: "auto" });
      };
      W.requestAnimationFrame(() => W.requestAnimationFrame(go));
      later(go, 700);
      later(() => {
        ["wheel", "touchstart", "keydown"].forEach(ev =>
          W.removeEventListener(ev, mark)
        );
      }, 800);
    };
    const fromHash = () => {
      const k = panels.findIndex(p => "#" + p.id === location.hash);
      if (k >= 0) {
        show(k);
        land(k);
      }
    };
    on(W, "hashchange", fromHash);
    fromHash();
    function check() {
      const v = (ratio.get(figs[cur]) || 0) > 0.35;
      if (v && !inView) {
        inView = true;
        play(cur);
      } else if (!v && inView) {
        inView = false;
        const vd = panels[cur].querySelector("video");
        if (vd) vd.pause();
      }
    }
    if ("IntersectionObserver" in W) {
      const io = new IntersectionObserver(
        es => {
          es.forEach(e => ratio.set(e.target, e.intersectionRatio));
          check();
        },
        { threshold: [0, 0.35] }
      );
      figs.forEach(f => f && io.observe(f));
      off.push(() => io.disconnect());
    }
    return () => {
      ix.classList.remove("js");
      list.setAttribute("aria-orientation", "vertical");
      panels.forEach(p => {
        p.removeAttribute("tabindex");
        const v = p.querySelector("video");
        if (v) {
          v.pause();
          v.removeAttribute("src");
          v.load();
        }
      });
    };
  }

  /* ---------------------------------------------------------------- the board showcase */
  function showcase(el) {
    // The strip selects a board; its image crosses over on the stage and its pane shows. A fine pointer gets a
    // lens over the full-resolution render; touch swipes. It never changes board by itself. The board settles onto
    // the stage as the section scrolls in.
    if (!el) return null;
    const base = el.getAttribute("data-base");
    const tabs = [...el.querySelectorAll(".bs-strip [role=tab]")];
    const panes = [...el.querySelectorAll(".bs-pane")];
    const stageEl = el.querySelector(".bs-stage");
    const fig = el.querySelector(".bs-fig");
    const slots = [...el.querySelectorAll(".bs-img")];
    const lens = el.querySelector(".bs-lens");
    const count = el.querySelector(".bs-count b");
    const N = tabs.length;
    let cur = 0;
    let slot = 0;
    let seen = false;
    let avif = null;
    if (!N || slots.length < 2) return null;
    el.classList.add("js");
    const useAvif = () => {
      if (avif === null) {
        const c = slots[0].querySelector("img").currentSrc;
        if (c) avif = /\.avif$/.test(c);
      }
      return avif !== false;
    };
    const url = (i, kind) => base + tabs[i].getAttribute("data-s") + kind;
    const warm = {};
    function preload(i) {
      i = (i + N) % N;
      if (warm[i]) return;
      warm[i] = new Image();
      warm[i].decoding = "async";
      warm[i].src = url(i, useAvif() ? ".avif" : ".webp");
    }
    let inLens = false;
    let lensSrc = "";
    let lx = 0;
    let ly = 0;
    let lr = 0;
    function select(i, user) {
      i = (i + N) % N;
      if (i === cur) return;
      const dirn = i > cur === !(Math.abs(i - cur) > N / 2) ? 1 : -1; // wrapping round counts as forward
      cur = i;
      tabs.forEach((t, k) => {
        const o = k === i;
        t.setAttribute("aria-selected", String(o));
        t.tabIndex = o ? 0 : -1;
        t.parentNode.classList.toggle("on", o);
      });
      panes.forEach((p, k) => p.classList.toggle("on", k === i));
      if (count) count.textContent = pad(i + 1, 2);
      const nx = slots[1 - slot];
      const im = nx.querySelector("img");
      const so = nx.querySelector("source");
      el.style.setProperty("--dir", dirn);
      nx.classList.remove("on");
      nx.classList.add("pre");
      if (so) so.srcset = url(i, ".avif");
      im.src = url(i, ".webp");
      im.alt = tabs[i].getAttribute("data-alt");
      const go = () => {
        if (cur !== i || disposed) return;
        void nx.offsetWidth;
        nx.classList.remove("pre");
        slots[slot].classList.remove("on");
        slots[slot].setAttribute("aria-hidden", "true");
        nx.classList.add("on");
        nx.removeAttribute("aria-hidden");
        slot = 1 - slot;
        lensSrc = "";
        if (inLens) loadLens();
      };
      (im.decode ? im.decode() : Promise.resolve()).then(go, go);
      preload(i + dirn);
      const strip = el.querySelector(".bs-strip");
      if (user && strip.scrollWidth > strip.clientWidth)
        tabs[i].scrollIntoView({
          block: "nearest",
          inline: "nearest",
          behavior: reduce ? "auto" : "smooth",
        });
    }
    tabs.forEach((t, k) => {
      on(t, "click", e => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return; // new tab or window: follow the link
        e.preventDefault();
        select(k, true);
      });
      on(t, "keydown", e => {
        const d =
          e.key === "ArrowRight"
            ? 1
            : e.key === "ArrowLeft"
              ? -1
              : e.key === "Home"
                ? -cur
                : e.key === "End"
                  ? N - 1 - cur
                  : 0;
        if (d) {
          e.preventDefault();
          select(cur + d, true);
          tabs[cur].focus();
        }
      });
    });
    const bp = el.querySelector(".bs-p");
    const bn = el.querySelector(".bs-n");
    if (bp) on(bp, "click", () => select(cur - 1, true));
    if (bn) on(bn, "click", () => select(cur + 1, true));
    // touch: a horizontal swipe on the stage changes the board
    let sx = 0;
    let sy = 0;
    on(
      stageEl,
      "touchstart",
      e => {
        sx = e.touches[0].clientX;
        sy = e.touches[0].clientY;
      },
      { passive: true }
    );
    on(
      stageEl,
      "touchend",
      e => {
        const t = e.changedTouches[0];
        const dx = t.clientX - sx;
        if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(t.clientY - sy) * 1.4)
          select(cur + (dx < 0 ? 1 : -1), true);
      },
      { passive: true }
    );
    // lens: the board at the render's own resolution under a fine pointer (the stage image where a board has none)
    function loadLens() {
      const u = tabs[cur].hasAttribute("data-lens")
        ? url(cur, "-lens.avif")
        : slots[slot].querySelector("img").currentSrc;
      if (!u || u === lensSrc) return;
      lensSrc = u;
      const im = new Image();
      im.onload = () => {
        if (lensSrc === u) lens.style.backgroundImage = "url(" + u + ")";
      };
      // a lens image that will not load (missing, or AVIF on an older Safari) falls back to the stage image
      im.onerror = () => {
        const st = slots[slot].querySelector("img").currentSrc;
        if (lensSrc === u && st && st !== u) {
          lensSrc = st;
          lens.style.backgroundImage = "url(" + st + ")";
        }
      };
      im.src = u;
    }
    function moveLens() {
      lr = 0;
      const r = slots[slot].querySelector("img").getBoundingClientRect();
      const sr = stageEl.getBoundingClientRect();
      const px = (lx - r.left) / r.width;
      const py = (ly - r.top) / r.height;
      const inside = px > 0.02 && px < 0.98 && py > 0.02 && py < 0.98;
      el.classList.toggle("lens", inside);
      stageEl.style.setProperty(
        "--lx",
        Math.round(((lx - sr.left) / sr.width) * 100) + "%"
      );
      stageEl.style.setProperty(
        "--ly",
        Math.round(((ly - sr.top) / sr.height) * 100) + "%"
      );
      if (!inside) return;
      const Z = 2.4;
      const L = lens.offsetWidth / 2;
      lens.style.left = lx - sr.left + "px";
      lens.style.top = ly - sr.top + "px";
      lens.style.backgroundSize =
        Math.round(r.width * Z) + "px " + Math.round(r.height * Z) + "px";
      lens.style.backgroundPosition =
        Math.round(L - px * r.width * Z) +
        "px " +
        Math.round(L - py * r.height * Z) +
        "px";
    }
    if (hoverable && lens) {
      on(stageEl, "pointerenter", e => {
        if (e.pointerType !== "mouse") return;
        inLens = true;
        loadLens();
      });
      on(stageEl, "pointerleave", () => {
        inLens = false;
        el.classList.remove("lens");
      });
      on(stageEl, "pointermove", e => {
        if (e.pointerType !== "mouse") return;
        lx = e.clientX;
        ly = e.clientY;
        if (!lr) lr = W.requestAnimationFrame(moveLens);
      });
    }
    // the board settles onto the stage as the section scrolls in (a few degrees of tilt, a touch of scale)
    let fq = 0;
    let fk = "";
    function settle() {
      fq = 0;
      const r = stageEl.getBoundingClientRect();
      let p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      p = clamp(p, -1, 1);
      const k = (p * 13).toFixed(2) + "|" + (1 - Math.abs(p) * 0.06).toFixed(3);
      if (k !== fk) {
        fk = k;
        fig.style.setProperty("--rx", (p * 13).toFixed(2) + "deg");
        fig.style.setProperty("--sc", (1 - Math.abs(p) * 0.06).toFixed(3));
      }
    }
    observe(
      es => {
        const v = es[0].isIntersecting && es[0].intersectionRatio >= 0.5;
        if (v !== seen) {
          seen = v;
          if (v) preload(cur + 1);
        }
      },
      { threshold: [0, 0.5] },
      stageEl
    );
    if (motion) {
      on(
        W,
        "scroll",
        () => {
          if (!fq) fq = W.requestAnimationFrame(settle);
        },
        { passive: true }
      );
      settle();
    }
    return () => {
      W.cancelAnimationFrame(fq);
      W.cancelAnimationFrame(lr);
      el.classList.remove("js", "lens");
    };
  }

  /* ---------------------------------------------------------------- reveals */
  function reveals() {
    // headings and blocks rise in as they arrive; nothing is hidden before that moment
    if (
      !motion ||
      !W.Element ||
      !Element.prototype.animate ||
      !("IntersectionObserver" in W)
    )
      return null;
    const io = new IntersectionObserver(
      es =>
        es.forEach(e => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          if (e.boundingClientRect.top < innerHeight * 0.55) return;
          e.target.animate(
            [
              { opacity: 0, transform: "translateY(28px)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 900, easing: "cubic-bezier(.2,.7,.2,1)" }
          );
        }),
      { threshold: 0.01, rootMargin: "0px 0px -8% 0px" }
    );
    host
      .querySelectorAll(
        ".bk-sec h2, .bk-sec-h .bk-lead, .bk-chap .card, .bs-stage"
      )
      .forEach(el => io.observe(el));
    return () => io.disconnect();
  }
}
