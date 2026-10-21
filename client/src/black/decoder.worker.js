/* The scroll story's decoding worker, for browsers that can draw on the main thread only (no OffscreenCanvas):
   decodes a frame strip and crops it into one bitmap per frame, nearest-to-wanted first, two at a time. */
let Q = [];
let busy = 0;
let WANT = 0;

function run() {
  Q = Q.filter(j => {
    if (Math.abs(j.id - WANT) > 2) {
      self.postMessage({ id: j.id, g: j.g, err: "stale" });
      return false;
    }
    return true;
  });
  Q.sort((a, b) => Math.abs(a.id - WANT) - Math.abs(b.id - WANT));
  while (busy < 2 && Q.length) dec(Q.shift());
}
function dec(d) {
  busy++;
  const t0 = performance.now();
  createImageBitmap(d.blob)
    .then(bm => {
      const J = [];
      for (let j = 0; j < d.n; j++)
        J.push(
          d.rw === d.fw
            ? createImageBitmap(bm, j * d.fw, 0, d.fw, d.fh)
            : createImageBitmap(bm, j * d.fw, 0, d.fw, d.fh, {
                resizeWidth: d.rw,
                resizeHeight: d.rh,
                resizeQuality: "high",
              })
        );
      return Promise.all(J).then(o => {
        bm.close();
        self.postMessage(
          { id: d.id, g: d.g, frames: o, ms: performance.now() - t0 },
          o
        );
      });
    })
    .catch(err => self.postMessage({ id: d.id, g: d.g, err: String(err) }))
    .then(() => {
      busy--;
      run();
    });
}
self.onmessage = e => {
  const d = e.data;
  if (d.t === "ping") {
    self.postMessage({ t: "pong" });
    return;
  }
  if (d.t === "want") {
    WANT = d.w;
    run();
    return;
  }
  Q.push(d);
  run();
};
