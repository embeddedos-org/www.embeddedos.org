/* The scroll story's drawing worker: owns the OffscreenCanvas, decodes frame strips (AVIF, several frames side by
   side) into bitmaps and draws the frame the page asks for. A strip far from the wanted one is dropped from the
   queue before it is decoded. When the page switches frame sets (or the canvas grows), the decoded frames are held
   and stay drawable, scaled, until the new set covers the current frame, so the canvas never flashes black. */
let cv;
let cx;
let P = {};
let F = {};
let H = [];
let G = 0;
let atlas = null;
let last = null;
let live = false;
let Q = [];
let busy = 0;
let WANT = 0;
// how many strips either side of the wanted one are still worth decoding (sent with "want"; 8 frames)
let SPAN = 2;
let ST = [0, 0, 0, 0];

function hold() {
  for (const k in F) F[k].forEach((b, j) => H.push({ i: k * P.PER + j, b }));
  F = {};
}
function unhold() {
  H.forEach(h => h.b.close());
  H = [];
}
function run() {
  Q = Q.filter(j => {
    if (Math.abs(j.id - WANT) > SPAN) {
      postMessage({ t: "fail", id: j.id });
      return false;
    }
    return true;
  });
  Q.sort((a, b) => Math.abs(a.id - WANT) - Math.abs(b.id - WANT));
  while (busy < 2 && Q.length) strip(Q.shift());
}
function strip(d) {
  busy++;
  const w = P.DW;
  const h = P.DH;
  const g = G;
  const t0 = performance.now();
  const n = Math.min(P.PER, P.T - d.id * P.PER);
  createImageBitmap(d.blob)
    .then(bm => {
      const J = [];
      for (let j = 0; j < n; j++)
        J.push(
          w === P.FW
            ? createImageBitmap(bm, j * P.FW, 0, P.FW, P.FH)
            : createImageBitmap(bm, j * P.FW, 0, P.FW, P.FH, {
                resizeWidth: w,
                resizeHeight: h,
                resizeQuality: "high",
              })
        );
      return Promise.all(J).then(a => {
        bm.close();
        if (g !== G) {
          a.forEach(b => b.close());
          return;
        }
        if (w !== P.DW) {
          a.forEach(b => b.close());
          postMessage({ t: "fail", id: d.id });
          return;
        }
        F[d.id] = a;
        if (H.length && last && Math.floor(Math.round(last.f) / P.PER) === d.id)
          unhold();
        postMessage({ t: "have", id: d.id, g, ms: performance.now() - t0 });
        if (last) draw(last);
      });
    })
    .catch(() => postMessage({ t: "fail", id: d.id }))
    .then(() => {
      busy--;
      run();
    });
}
function near(i) {
  let b = null;
  let bd = 17;
  for (const k in F) {
    const f = F[k];
    for (let j = 0; j < f.length; j++) {
      const d = Math.abs(k * P.PER + j - i);
      if (d < bd) {
        bd = d;
        b = f[j];
      }
    }
  }
  for (const h of H) {
    const e = Math.abs(h.i - i);
    if (e < bd) {
      bd = e;
      b = h.b;
    }
  }
  return b;
}
// 2 = the frame itself, 3 = the nearest decoded frame, 1 = the thumbnail atlas, 0 = nothing yet
function blit(i, a) {
  if (i < 0) i = 0;
  if (i >= P.T) i = P.T - 1;
  const f = F[Math.floor(i / P.PER)];
  const j = i % P.PER;
  cx.globalAlpha = a;
  if (f && f[j]) {
    cx.drawImage(f[j], 0, 0, P.DW, P.DH);
    return 2;
  }
  const nb = near(i);
  if (nb) {
    cx.drawImage(nb, 0, 0, P.DW, P.DH);
    return 3;
  }
  if (atlas && live) {
    cx.drawImage(
      atlas,
      (i % P.AC) * P.TW,
      Math.floor(i / P.AC) * P.TH,
      P.TW,
      P.TH,
      0,
      0,
      P.DW,
      P.DH
    );
    return 1;
  }
  return 0;
}
function draw(d) {
  let ok;
  const fl = Math.floor(d.f);
  const fr = d.f - fl;
  if (d.blend) {
    ok = blit(fl, 1);
    if (ok === 2 && fr > 0.03 && fl + 1 < P.T) {
      const f2 = F[Math.floor((fl + 1) / P.PER)];
      if (f2 && f2[(fl + 1) % P.PER]) blit(fl + 1, fr);
    }
  } else ok = blit(Math.round(d.f), 1);
  cx.globalAlpha = 1;
  ST[ok]++;
  if (ok === 2 && !live) {
    live = true;
    postMessage({ t: "live" });
  }
}
function size(d) {
  P.DW = d.DW;
  P.DH = d.DH;
  cv.width = d.DW;
  cv.height = d.DH;
  cx.imageSmoothingEnabled = true;
  cx.imageSmoothingQuality = "high";
}
onmessage = e => {
  const d = e.data;
  switch (d.t) {
    case "ping":
      postMessage({ t: "pong" });
      break;
    case "stats":
      postMessage({
        t: "stats",
        s: ST,
        q: Q.length,
        busy,
        F: Object.keys(F).join(","),
      });
      ST = [0, 0, 0, 0];
      break;
    case "init":
      cv = d.canvas;
      P = d;
      G = d.g || 0;
      cx = cv.getContext("2d", { alpha: false });
      size(d);
      break;
    case "res":
      G = d.g;
      unhold();
      hold();
      size(d);
      if (last) draw(last);
      break;
    case "set":
      G = d.g;
      unhold();
      hold();
      Q = [];
      if (atlas) {
        atlas.close();
        atlas = null;
      }
      for (const k of ["FW", "FH", "TW", "TH", "PER"]) P[k] = d[k];
      if (P.DW !== d.DW) size(d);
      if (last) draw(last);
      break;
    case "atlas":
      createImageBitmap(d.blob).then(
        b => {
          atlas = b;
          if (last) draw(last);
        },
        () => {
          /* the atlas only covers frames not decoded yet */
        }
      );
      break;
    case "drop": {
      const f = F[d.id];
      if (f) {
        f.forEach(b => b.close());
        delete F[d.id];
      }
      break;
    }
    case "want":
      WANT = d.w;
      if (d.s) SPAN = d.s;
      run();
      break;
    case "strip":
      Q.push(d);
      run();
      break;
    case "draw":
      last = d;
      draw(d);
      break;
  }
};
