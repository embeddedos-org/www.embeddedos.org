import anime from "animejs";
function mountStory(HS) {
  const ac = new AbortController();
  const signal = ac.signal;
  let disposed = false;
  window.IO_LITE = true;
  const __on = (t, type, fn, o) =>
    t.addEventListener(
      type,
      fn,
      o && typeof o === "object" ? { ...o, signal } : { capture: !!o, signal }
    );
  const __raf = fn => (disposed ? 0 : requestAnimationFrame(fn));
  const timers = [];
  const __every = (fn, ms) => {
    const id = setInterval(fn, ms);
    timers.push(id);
    return id;
  };
  const OBS = [];
  class ResizeObserverT extends ResizeObserver {
    constructor(cb) {
      super(cb);
      OBS.push(this);
    }
  }
  class IntersectionObserverT extends IntersectionObserver {
    constructor(cb, o) {
      super(cb, o);
      OBS.push(this);
    }
  }
  class MutationObserverT extends MutationObserver {
    constructor(cb) {
      super(cb);
      OBS.push(this);
    }
  }
  window.IO_SPOTS = [
    {
      id: "ehealth365-design",
      ch: 1,
      a: 0.31,
      b: 0.5,
      anchor: "ehealth365:hero",
      color: "#EF4444",
    },
    {
      id: "ehealth365-eos",
      ch: 1,
      a: 0.52,
      b: 0.79,
      anchor: "ehealth365:board",
      color: "#34D399",
    },
    {
      id: "emedical-design",
      ch: 3,
      a: 0.31,
      b: 0.5,
      anchor: "emedical:hero",
      color: "#F472B6",
    },
    {
      id: "emedical-eos",
      ch: 3,
      a: 0.52,
      b: 0.79,
      anchor: "emedical:board",
      color: "#34D399",
    },
    {
      id: "eaerospace-design",
      ch: 7,
      a: 0.31,
      b: 0.5,
      anchor: "eaerospace:hero",
      color: "#22D3EE",
    },
    {
      id: "eaerospace-eos",
      ch: 7,
      a: 0.52,
      b: 0.79,
      anchor: "eaerospace:board",
      color: "#34D399",
    },
    {
      id: "erobotics-design",
      ch: 8,
      a: 0.31,
      b: 0.5,
      anchor: "erobotics:hero",
      color: "#A78BFA",
    },
    {
      id: "erobotics-eos",
      ch: 8,
      a: 0.52,
      b: 0.79,
      anchor: "erobotics:board",
      color: "#34D399",
    },
    {
      id: "eenergy-design",
      ch: 12,
      a: 0.31,
      b: 0.5,
      anchor: "eenergy:hero",
      color: "#F59E0B",
    },
    {
      id: "eenergy-eos",
      ch: 12,
      a: 0.52,
      b: 0.79,
      anchor: "eenergy:board",
      color: "#34D399",
    },
    {
      id: "esmartcity-design",
      ch: 13,
      a: 0.31,
      b: 0.5,
      anchor: "esmartcity:hero",
      color: "#60A5FA",
    },
    {
      id: "esmartcity-eos",
      ch: 13,
      a: 0.52,
      b: 0.79,
      anchor: "esmartcity:board",
      color: "#34D399",
    },
    {
      id: "eedgeai-design",
      ch: 15,
      a: 0.31,
      b: 0.5,
      anchor: "eedgeai:hero",
      color: "#818CF8",
    },
    {
      id: "eedgeai-eos",
      ch: 15,
      a: 0.52,
      b: 0.79,
      anchor: "eedgeai:board",
      color: "#34D399",
    },
    {
      id: "rbt-board",
      ch: 20,
      a: 0.31,
      b: 0.54,
      anchor: "robot:chestA",
      color: "#34D399",
    },
    {
      id: "rbt-boot",
      ch: 20,
      a: 0.56,
      b: 0.79,
      anchor: "robot:waistA",
      color: "#34D399",
    },
    {
      id: "rbt-eyes",
      ch: 21,
      a: 0.31,
      b: 0.54,
      anchor: "robot:eyes",
      color: "#22D3EE",
    },
    {
      id: "rbt-lidar",
      ch: 21,
      a: 0.56,
      b: 0.79,
      anchor: "robot:lidar",
      color: "#5EEAD4",
    },
    {
      id: "rbt-drives",
      ch: 22,
      a: 0.31,
      b: 0.54,
      anchor: "robot:kneeR",
      color: "#A78BFA",
    },
    {
      id: "rbt-balance",
      ch: 22,
      a: 0.56,
      b: 0.79,
      anchor: "robot:imu",
      color: "#FBBF24",
    },
    {
      id: "rbt-grip",
      ch: 23,
      a: 0.31,
      b: 0.54,
      anchor: "robot:gripR",
      color: "#A78BFA",
    },
    {
      id: "rbt-check",
      ch: 23,
      a: 0.56,
      b: 0.79,
      anchor: "robot:eyes",
      color: "#22D3EE",
    },
    {
      id: "rbt-stop",
      ch: 24,
      a: 0.31,
      b: 0.54,
      anchor: "robot:chestA",
      color: "#EF4444",
    },
    {
      id: "rbt-ota",
      ch: 24,
      a: 0.56,
      b: 0.79,
      anchor: "robot:chestA",
      color: "#34D399",
    },
  ];
  (function () {
    var S = (window.IO = {
      target: 0,
      reduce: false,
      paused: false,
      bounds: [],
      chapter: 0,
      forced: null,
      capture: false,
      noAdapt: false,
      debugTime: null,
    });
    if (/capture/.test(location.hash)) {
      S.capture = true;
      S.noAdapt = true;
    }
    try {
      S.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {}
    var NAMES = [
      "Intro",
      "eHealth365",
      "eosHealth",
      "eMedical",
      "eRadar360",
      "eTransport",
      "ePAM",
      "eAerospace",
      "eRobotics",
      "eAgriTech",
      "eFrontier",
      "eIndustrial",
      "eEnergy",
      "eSmartCity",
      "eMining",
      "eEdgeAI",
      "eElectronics",
      "eConsumer",
      "eCybersecurity",
      "eDefense",
      "Robot · wake",
      "Robot · see",
      "Robot · walk",
      "Robot · hands",
      "Robot · safety",
      "Every industry",
    ];
    var COLORS = [
      "#F97316",
      "#EF4444",
      "#FB7185",
      "#F472B6",
      "#F97316",
      "#38BDF8",
      "#2DD4BF",
      "#22D3EE",
      "#A78BFA",
      "#10B981",
      "#C084FC",
      "#34D399",
      "#F59E0B",
      "#60A5FA",
      "#A8A29E",
      "#818CF8",
      "#FBBF24",
      "#8B5CF6",
      "#06B6D4",
      "#9CA3AF",
      "#34D399",
      "#34D399",
      "#34D399",
      "#34D399",
      "#34D399",
      "#38BDF8",
    ];
    var CARDTO = [
      null,
      0.28,
      0.84,
      0.28,
      0.84,
      0.84,
      0.84,
      0.28,
      0.28,
      0.84,
      0.84,
      0.84,
      0.28,
      0.28,
      0.84,
      0.28,
      0.84,
      0.84,
      0.84,
      0.84,
      0.26,
      0.26,
      0.26,
      0.26,
      0.26,
      null,
    ];
    S.cardTo = CARDTO;
    var HOLD =
      window.IO_LITE && window.matchMedia
        ? window.matchMedia("(max-width: 760px)")
        : null;
    var N = NAMES.length;
    var LAST = N - 1;
    var TOTAL = String(LAST).padStart(2, "0");
    var track = document.getElementById("track");
    var spacers = Array.prototype.slice.call(
      document.querySelectorAll("#spacers > div")
    );
    var cards = Array.prototype.slice.call(document.querySelectorAll(".card"));
    var rail = Array.prototype.slice.call(
      document.querySelectorAll("#rail button")
    );
    var barNow = document.getElementById("bar-now");
    var cue = document.getElementById("cue");
    var pause = document.getElementById("pause");
    var b = [];
    function measure() {
      var y = window.scrollY || window.pageYOffset;
      var top = track.getBoundingClientRect().top + y;
      b = spacers.map(function (el) {
        return el.getBoundingClientRect().top + y;
      });
      b[0] = top;
      b.push(top + track.offsetHeight - window.innerHeight);
      S.bounds = b;
    }
    function computeT() {
      if (S.forced !== null) return S.forced;
      var s = window.scrollY || window.pageYOffset;
      if (s <= b[0]) return 0;
      for (var i = 0; i < N; i++) {
        if (s < b[i + 1]) return i + (s - b[i]) / Math.max(1, b[i + 1] - b[i]);
      }
      return N;
    }
    function sm(v) {
      v = v < 0 ? 0 : v > 1 ? 1 : v;
      return v * v * (3 - 2 * v);
    }
    function splitWords(root) {
      var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      var nodes = [],
        n;
      while ((n = walker.nextNode())) nodes.push(n);
      var words = [];
      nodes.forEach(function (node) {
        var parts = node.nodeValue.split(/(\s+)/);
        if (parts.length < 2 && !node.nodeValue.trim()) return;
        var frag = document.createDocumentFragment();
        parts.forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) {
            frag.appendChild(document.createTextNode(p));
            return;
          }
          var w = document.createElement("span");
          w.className = "w";
          var inner = document.createElement("span");
          inner.textContent = p;
          w.appendChild(inner);
          frag.appendChild(w);
          words.push(inner);
        });
        node.parentNode.replaceChild(frag, node);
      });
      root.classList.add("split");
      return words;
    }
    function revealWords(words, o) {
      if (!words || !words.length) return;
      var k = words.length;
      for (var i = 0; i < k; i++) {
        var p = sm(o * 1.35 - (i / Math.max(1, k - 1)) * 0.35);
        if (words[i]._p === p) continue;
        words[i]._p = p;
        words[i].style.transform =
          p >= 1 ? "" : "translateY(" + ((1 - p) * 105).toFixed(1) + "%)";
      }
    }
    function countUp(els, o) {
      if (!els) return;
      for (var i = 0; i < els.length; i++) {
        var el = els[i],
          tgt = +el.getAttribute("data-count"),
          dec = +(el.getAttribute("data-dec") || 0);
        var p = sm((o - 0.15) / 0.85),
          v = tgt * (1 - Math.pow(1 - p, 3));
        var txt = (p >= 1 ? tgt : v).toFixed(dec);
        if (el._t !== txt) {
          el._t = txt;
          el.firstChild.nodeValue = txt;
        }
      }
    }
    S.revealWords = revealWords;
    S.countUp = countUp;
    S.splitWords = splitWords;
    var reduceType = S.reduce;
    cards.forEach(function (c) {
      var heroStatic = window.IO_LITE && c.classList.contains("hero-card");
      if (!reduceType && !heroStatic)
        c._words = [].concat.apply(
          [],
          [].slice.call(c.querySelectorAll("h1, h2")).map(splitWords)
        );
      c._counts = [].slice.call(c.querySelectorAll("[data-count]"));
    });
    var kws = [].slice
      .call(document.querySelectorAll("#kinetic .kw"))
      .map(function (el) {
        return {
          el,
          t0: +el.getAttribute("data-t0"),
          t1: +el.getAttribute("data-t1"),
          x0: +el.getAttribute("data-x0"),
          x1: +el.getAttribute("data-x1"),
          a: +(el.getAttribute("data-a") || 0.1),
          vis: false,
        };
      });
    var rbs = [].slice
      .call(document.querySelectorAll("#kinetic .ribbon"))
      .map(function (el) {
        var spd = el.getAttribute("data-speed");
        return {
          el,
          tr: el.querySelector(".rb-track"),
          t0: +el.getAttribute("data-t0"),
          t1: +el.getAttribute("data-t1"),
          dir: +(el.getAttribute("data-dir") || -1),
          auto: spd === "auto",
          sp: spd === "auto" ? 100 : +(spd || 60),
          vis: false,
        };
      });
    function ribbonSpeeds() {
      rbs.forEach(function (r) {
        if (!r.auto) return;
        var vw = Math.max(1, window.innerWidth);
        r.sp = Math.max(10, ((r.tr.scrollWidth - vw * 0.72) / vw) * 100);
      });
    }
    ribbonSpeeds();
    __on(window, "resize", ribbonSpeeds);
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(ribbonSpeeds);
    var legend = document.getElementById("legend");
    if (rbs.length) HS.classList.add("has-ribbons");
    var legendOn = false;
    function kinetic(T) {
      var anyRibbon = false;
      kws.forEach(function (k) {
        var on = T > k.t0 - 0.01 && T < k.t1 + 0.01;
        if (on !== k.vis) {
          k.vis = on;
          k.el.style.visibility = on ? "visible" : "hidden";
        }
        if (!on) return;
        var p = (T - k.t0) / (k.t1 - k.t0),
          o = sm(p / 0.16) * (1 - sm((p - 0.84) / 0.16));
        var x = k.x0 + (k.x1 - k.x0) * (reduceType ? 0.5 : p);
        k.el.style.opacity = (o * k.a).toFixed(3);
        k.el.style.transform = "translate3d(" + x.toFixed(2) + "vw, 0, 0)";
      });
      rbs.forEach(function (r) {
        var on = T > r.t0 - 0.01 && T < r.t1 + 0.01;
        if (on !== r.vis) {
          r.vis = on;
          r.el.style.visibility = on ? "visible" : "hidden";
        }
        if (!on) return;
        anyRibbon = true;
        var p = (T - r.t0) / (r.t1 - r.t0),
          o = sm(p / 0.12) * (1 - sm((p - 0.88) / 0.12));
        var x = r.dir < 0 ? -p * r.sp : -r.sp + p * r.sp;
        r.el.style.opacity = o.toFixed(3);
        r.tr.style.transform =
          "translate3d(" +
          (reduceType ? -r.sp * 0.25 : x).toFixed(2) +
          "vw, 0, 0)";
      });
      if (legend && anyRibbon !== legendOn) {
        legendOn = anyRibbon;
        legend.classList.toggle("on", anyRibbon);
      }
    }
    var fbSpots = null;
    function spotFallback(T) {
      if (!HS.classList.contains("no-gl")) return;
      if (!fbSpots)
        fbSpots = (window.IO_SPOTS || [])
          .map(function (d) {
            return {
              d,
              el: document.querySelector('.spot[data-spot="' + d.id + '"]'),
              o: -1,
            };
          })
          .filter(function (x) {
            return x.el;
          });
      fbSpots.forEach(function (x) {
        var g0 = x.d.ch + x.d.a,
          g1 = x.d.ch + x.d.b;
        var o =
          T < g0 || T > g1
            ? 0
            : sm((T - g0) / 0.035) * (1 - sm((T - (g1 - 0.035)) / 0.035));
        if (o === x.o) return;
        x.o = o;
        x.el.style.opacity = o.toFixed(3);
        x.el.style.visibility = o > 0 ? "visible" : "hidden";
        x.el.style.transform =
          "translateY(" + ((1 - o) * 14).toFixed(1) + "px)";
        if (o > 0.5) x.el.removeAttribute("inert");
        else x.el.setAttribute("inert", "");
      });
    }
    var lastCh = -1;
    function paint(T) {
      cards.forEach(function (c, i) {
        var to = CARDTO[i] == null || (HOLD && HOLD.matches) ? 0.84 : CARDTO[i];
        var inA =
          i === 0
            ? 1
            : sm(
                (T -
                  (i -
                    0.06 +
                    (i === LAST && HOLD && HOLD.matches ? 0.45 : 0))) /
                  0.14
              );
        var outA = i === LAST && to >= 0.84 ? 1 : 1 - sm((T - (i + to)) / 0.12);
        var o = Math.max(0, Math.min(inA, outA));
        if (c._o !== o) {
          c._o = o;
          c.style.opacity = o.toFixed(3);
          c.style.visibility = o > 0 ? "visible" : "hidden";
          c.style.transform = "translateY(" + ((1 - o) * 16).toFixed(1) + "px)";
          revealWords(c._words, o);
          countUp(c._counts, o);
        }
        var on = o > 0.5;
        if (c._on !== on) {
          c._on = on;
          if (on) c.removeAttribute("inert");
          else c.setAttribute("inert", "");
        }
      });
      kinetic(T);
      spotFallback(T);
    }
    S.paint = paint;
    function update() {
      var T = (S.target = computeT());
      if (!S.follow) paint(T);
      var ch = Math.min(LAST, Math.floor(T + 0.02));
      S.chapter = ch;
      if (ch !== lastCh) {
        lastCh = ch;
        rail.forEach(function (btn) {
          var i = +btn.getAttribute("data-i");
          btn.classList.toggle("now", i === ch);
          btn.classList.toggle("done", i < ch);
          if (i === ch) btn.setAttribute("aria-current", "step");
          else btn.removeAttribute("aria-current");
        });
        if (barNow) barNow.style.setProperty("--now-c", COLORS[ch]);
        if (barNow)
          barNow.innerHTML =
            ch === 0
              ? "Scroll to begin"
              : "<b>" +
                String(ch).padStart(2, "0") +
                "</b> / " +
                TOTAL +
                " · " +
                NAMES[ch];
      }
      cue.style.opacity = T < 0.25 ? "1" : "0";
    }
    var queued = false;
    function onScroll() {
      if (queued) return;
      queued = true;
      __raf(function () {
        queued = false;
        update();
      });
    }
    rail.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var i = +btn.getAttribute("data-i");
        var top = b[i] + (b[i + 1] - b[i]) * 0.4;
        if (S.lenis) S.lenis.scrollTo(top, { duration: 1.6 });
        else window.scrollTo({ top, behavior: S.reduce ? "auto" : "smooth" });
      });
    });
    if (pause)
      pause.addEventListener("click", function () {
        S.paused = !S.paused;
        pause.setAttribute("aria-pressed", S.paused ? "true" : "false");
        document.getElementById("pause-l").textContent = S.paused
          ? "Resume"
          : "Pause";
      });
    __on(window, "scroll", onScroll, { passive: true });
    __on(window, "resize", function () {
      measure();
      update();
    });
    measure();
    update();
    if (window.ResizeObserver)
      new ResizeObserverT(function () {
        measure();
        update();
      }).observe(track);
    S.refresh = function () {
      measure();
      update();
    };
    window.IO_DEBUG = {
      setT: function (v) {
        S.forced = v;
        update();
      },
      release: function () {
        S.forced = null;
        update();
      },
      clean: function (on) {
        HS.classList.toggle("clean", !!on);
        if (S.relayout) S.relayout();
      },
      setTime: function (v) {
        S.debugTime = v;
      },
    };
    setTimeout(function () {
      if (!HS.classList.contains("gl-ready")) {
        HS.classList.add("no-gl");
        update();
      }
    }, 2e4);
    new MutationObserverT(function () {
      if (HS.classList.contains("no-gl")) update();
    }).observe(HS, { attributes: true, attributeFilter: ["class"] });
    document.querySelectorAll(".block").forEach(function (block) {
      var btn = block.querySelector(".copy");
      var pre = block.querySelector("pre");
      if (!btn || !pre) return;
      btn.addEventListener("click", function () {
        function done(t) {
          btn.textContent = t;
          setTimeout(function () {
            btn.textContent = "Copy";
          }, 1600);
        }
        function fallback() {
          var r = document.createRange();
          r.selectNodeContents(pre);
          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(r);
          done("Selected, press ⌘C");
        }
        try {
          navigator.clipboard.writeText(pre.innerText).then(function () {
            done("Copied");
          }, fallback);
        } catch (e) {
          fallback();
        }
      });
    });
  })();
  (function () {
    var TRACE = {
      pick: {
        layers: ["apps", "hal", "services", "ipc", "ai"],
        lines: [
          [
            "eos_motor_ctrl_run_trajectory(…): the reach, joint by joint",
            "s-work",
            "Working",
          ],
          [
            "RS-485 to the eGripper-3F over the UART driver",
            "s-part",
            "STM32F4 only",
          ],
          ["eipc_client_send_intent(…) to eAI", "s-none", "Not wired yet"],
          [
            "eAI checks the part: default build returns stub inference",
            "s-docs",
            "Stub",
          ],
        ],
      },
      wave: {
        layers: ["kernel", "services", "hal"],
        lines: [
          [
            "eos_task_create(gesture, …): a low-priority task",
            "s-work",
            "Working",
          ],
          [
            "eos_motor_ctrl_set_position(…) on shoulder and elbow",
            "s-work",
            "Working",
          ],
          [
            "8 motors per image today; this body has 30 joints",
            "s-part",
            "Limit",
          ],
        ],
      },
      stop: {
        layers: ["kernel", "services"],
        lines: [
          [
            "eos_motor_ctrl_emergency_stop(…): every joint, one call each",
            "s-work",
            "Working",
          ],
          [
            "The scheduler runs the stop task ahead of everything else",
            "s-work",
            "Working",
          ],
          [
            "A whole-body safety case is still to be written",
            "s-none",
            "Not yet",
          ],
        ],
      },
      update: {
        layers: ["services", "boot"],
        lines: [
          [
            "OTA service: A/B state machine with SHA-256 checks",
            "s-part",
            "No flash writes",
          ],
          [
            "eBoot verifies the new image's Ed25519 signature",
            "s-work",
            "Host-tested",
          ],
          [
            "Anti-rollback and the slot switch on real hardware",
            "s-docs",
            "Next",
          ],
        ],
      },
    };
    var reduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var capture = /capture/.test(location.hash);
    function ready(fn) {
      if (document.readyState !== "loading") fn();
      else __on(document, "DOMContentLoaded", fn);
    }
    function esc(t) {
      return String(t)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
    function all(root, sel) {
      return Array.prototype.slice.call(root.querySelectorAll(sel));
    }
    function withAnime(fn) {
      var s = document.getElementById("anime-js"),
        done = false;
      function go() {
        if (!done) {
          done = true;
          fn();
        }
      }
      if (anime || reduce || capture || !s) return go();
      s.addEventListener("load", go);
      s.addEventListener("error", go);
      setTimeout(go, 1200);
    }
    function unhide() {
      HS.classList.add("anim-off");
    }
    function safe(fn) {
      return function () {
        try {
          return fn.apply(this, arguments);
        } catch (e) {
          unhide();
          if (window.console)
            console.warn("animation skipped:", e && e.message);
        }
      };
    }
    var LOOPS = [],
      loopIO =
        "IntersectionObserver" in window
          ? new IntersectionObserverT(function (es) {
              es.forEach(function (e) {
                LOOPS.forEach(function (l) {
                  if (l.el === e.target) {
                    l.on = e.isIntersecting;
                    if (l.on) l.a.play();
                    else l.a.pause();
                  }
                });
              });
            })
          : null;
    function loop(el, a) {
      if (!a || !el) return a;
      LOOPS.push({ el, a, on: true });
      if (loopIO) loopIO.observe(el);
      return a;
    }
    var PARTS = [
      {
        id: "u1",
        ref: "U1",
        name: "Application processor",
        x: 0,
        z: 0,
        color: "#F97316",
        bus: "All buses start here",
        path: null,
        w: 2.3,
        d: 2.3,
        what: "The SoC in the middle runs everything: the EoS kernel, its drivers, services and apps. Its pins fan out on copper buses to every other part on this board.",
        eos: "eBoot verifies the image, then jumps to the EoS kernel on this chip.",
        st: ["Illustrative board", "info"],
      },
      {
        id: "u6",
        ref: "U6",
        name: "LPDDR4 SDRAM",
        x: 3.15,
        z: -0.15,
        color: "#22D3EE",
        bus: "LPDDR4 memory bus",
        path: [
          [1.36, -0.07],
          [2.15, -0.07],
          [2.4, -0.12],
          [2.63, -0.12],
        ],
        w: 1,
        d: 0.75,
        what: "Fast RAM beside the processor holds the running kernel, task stacks and data. A wide memory bus with length-matched traces links it to U1.",
        eos: "The EoS heap allocates from RAM and validates every block header.",
        st: ["Heap working", "code"],
      },
      {
        id: "u7",
        ref: "U7",
        name: "eMMC storage",
        x: -3,
        z: 0,
        color: "#38BDF8",
        bus: "eMMC (SDIO-style) bus",
        path: [
          [-1.36, -0.05],
          [-2.55, -0.05],
        ],
        w: 0.9,
        d: 0.7,
        what: "An eMMC module stores files and data across power cycles, on its own bus from the processor.",
        eos: "EoS defines flash and SDIO classes in its extended HAL; both return stub values today.",
        st: ["Flash + SDIO HAL stubbed", "docs"],
      },
      {
        id: "u2",
        ref: "U2",
        name: "QSPI NOR boot flash",
        x: -3.3,
        z: -1.7,
        color: "#FBBF24",
        bus: "QSPI bus",
        path: [
          [-1.36, -0.7],
          [-1.6, -0.7],
          [-1.6, -1.1],
          [-2.2, -1.7],
          [-2.8, -1.7],
        ],
        w: 1,
        d: 0.62,
        what: "A small SPI NOR flash holds the bootloader and two signed firmware slots, A and B. The QSPI bus is the first thing U1 reads at power-on.",
        eos: "Stage 0 checks stage 1 against a build-time SHA-256.",
        st: ["Verified boot working", "code"],
      },
      {
        id: "y1",
        ref: "Y1",
        name: "Crystal oscillator",
        x: 1.55,
        z: -1.35,
        color: "#A78BFA",
        bus: "Clock input",
        path: [
          [1.15, -1.36],
          [1.3, -1.36],
        ],
        w: 0.5,
        d: 0.28,
        what: "A quartz crystal gives the processor a steady clock. Every timer, baud rate and scheduler tick is counted from it.",
        eos: "The EoS Cortex-M port uses SysTick for the tick, NVIC for interrupts and PendSV to switch tasks.",
        st: ["Port written, not built", "docs"],
      },
      {
        id: "u3",
        ref: "U3",
        name: "PMIC and power inductors",
        x: 0,
        z: -2.65,
        color: "#F472B6",
        bus: "Power rails",
        path: [
          [0, -1.36],
          [0, -2.3],
        ],
        w: 0.7,
        d: 0.7,
        what: "The power-management IC and its two inductors turn one input into the voltage rails U1, the memory and the radios need.",
        eos: "EoS has a 14-function power API: sleep modes, wake sources, battery, clock gating and CPU frequency.",
        st: ["Power service is a stub", "docs"],
      },
      {
        id: "j1",
        ref: "J1",
        name: "USB-C connector",
        x: -4.72,
        z: 0,
        color: "#38BDF8",
        bus: "USB 2.0",
        path: [
          [-1.36, 0.5],
          [-3.9, 0.5],
          [-4.15, 0.27],
          [-4.39, 0.27],
        ],
        w: 0.62,
        d: 0.95,
        what: "The USB-C port powers the board and connects it to a computer for flashing, a serial console and data.",
        eos: "ebuild builds and flashes boards from one command line; it knows 171 microcontrollers.",
        st: ["USB HAL stubbed", "docs"],
      },
      {
        id: "u4",
        ref: "U4",
        name: "Wi-Fi + Bluetooth LE module",
        x: -3.45,
        z: 2.2,
        color: "#F0ABFC",
        bus: "SDIO bus",
        path: [
          [-1.36, 0.7],
          [-2, 0.7],
          [-2.6, 1.3],
          [-2.6, 2.2],
          [-2.85, 2.2],
        ],
        w: 1.2,
        d: 0.85,
        what: "A shielded radio module adds Wi-Fi and Bluetooth LE; the zig-zag copper beside it is a PCB antenna, ANT1. U1 talks to the module over SDIO.",
        eos: "EoS defines Wi-Fi and BLE in its extended HAL.",
        st: ["HAL classes stubbed", "docs"],
      },
      {
        id: "u5",
        ref: "U5",
        name: "IMU + environment sensor",
        x: 3.35,
        z: 1.95,
        color: "#A78BFA",
        bus: "I²C bus",
        path: [
          [1.36, 0.6],
          [1.9, 0.6],
          [1.9, 1.45],
          [2.4, 1.95],
          [2.95, 1.95],
        ],
        w: 0.8,
        d: 0.8,
        what: "A motion and environment sensor reports acceleration, rotation and temperature to U1 over the I²C bus.",
        eos: "The EoS sensor service keeps a registry of up to 16 sensors with filtering (average, median, low-pass) and calibration.",
        st: ["Sensor service in code", "code"],
      },
      {
        id: "m1",
        ref: "M1",
        name: "Servo motor and connector",
        x: 3.6,
        z: -2.15,
        color: "#F472B6",
        bus: "PWM",
        path: [
          [1.36, -0.6],
          [2, -0.6],
          [2.6, -1.2],
          [2.6, -2.15],
          [3.08, -2.15],
        ],
        r: 0.52,
        what: "A small servo on connector J4 is the board's actuator. U1 drives it with a PWM signal and reads its position back.",
        eos: "The EoS motor service runs PID speed and position loops, trajectories and an emergency stop (working code).",
        st: ["Motor service working", "code"],
      },
      {
        id: "j2",
        ref: "J2",
        name: "2×12 GPIO expansion header",
        x: 0,
        z: 3.25,
        color: "#34D399",
        bus: "GPIO · SPI · I²C · UART",
        path: [
          [-0.4, 1.36],
          [-0.4, 2.99],
        ],
        w: 5,
        d: 0.52,
        what: "24 pins break out GPIO, SPI, I²C and UART, so add-on boards and sensors can plug straight in.",
        eos: "The Linux host back end drives GPIO through sysfs, with real timing.",
        st: ["GPIO working on Linux", "code"],
      },
      {
        id: "j3",
        ref: "J3",
        name: "Debug header, reset and LEDs",
        x: 1.75,
        z: 2.4,
        color: "#22D3EE",
        bus: "SWD",
        path: [
          [0.8, 1.36],
          [0.8, 1.82],
          [1.33, 2.2],
          [1.39, 2.2],
        ],
        w: 0.72,
        d: 0.36,
        what: "The 10-pin SWD header J3 lets a debugger flash and step the processor. SW1 resets it, and D1 to D3 show power, activity and radio.",
        eos: "The EoS GDB stub speaks the remote serial protocol: registers, memory, breakpoints, step and continue.",
        st: ["GDB stub working", "code"],
      },
      {
        id: "sw1",
        ref: "SW1",
        name: "Reset button",
        x: 2.25,
        z: -2.7,
        color: "#22D3EE",
        bus: "Reset line",
        path: null,
        w: 0.36,
        d: 0.36,
        what: "Pressing SW1 resets the processor; eBoot then runs its checks again from stage 0.",
        eos: "eBoot's two stages run on every reset (host-tested).",
        st: ["Host-tested", "part"],
      },
      {
        id: "leds",
        ref: "D1–D3",
        name: "Status LEDs",
        x: -2,
        z: -2.75,
        color: "#34D399",
        bus: "GPIO",
        path: null,
        w: 0.9,
        d: 0.12,
        what: "Three LEDs: power (green), activity (amber) and radio (blue).",
        eos: "An LED is a GPIO pin; GPIO works on the Linux host back end.",
        st: ["GPIO on Linux", "code"],
      },
      {
        id: "l1",
        ref: "L1",
        name: "Power inductor",
        x: -0.95,
        z: -2.65,
        color: "#F472B6",
        bus: "Buck converter 1",
        path: null,
        w: 0.52,
        d: 0.52,
        what: "A ferrite inductor that stores energy for one of U3's switching regulators.",
        eos: "The EoS power API keeps bookkeeping only today.",
        st: ["Power service stub", "docs"],
      },
      {
        id: "l2",
        ref: "L2",
        name: "Power inductor",
        x: 0.95,
        z: -2.65,
        color: "#F472B6",
        bus: "Buck converter 2",
        path: null,
        w: 0.52,
        d: 0.52,
        what: "The second inductor, for U3's other switching regulator.",
        eos: "The EoS power API keeps bookkeeping only today.",
        st: ["Power service stub", "docs"],
      },
    ];
    var mapRef = { m: null };
    ready(function () {
      withAnime(
        safe(function () {
          var A = anime;
          var animate = !!A && !reduce && !capture;
          var late = true;
          var onScreen = function (el) {
            var r = el.getBoundingClientRect();
            return r.top < innerHeight && r.bottom > 0;
          };
          var html = HS;
          var map = setupMap(A, animate);
          mapRef.m = map;
          var card = document.querySelector(".cmd-card");
          var trace = card && card.querySelector(".trace");
          var hud = card ? all(card, ".hud span") : [];
          var btns = card ? all(card, ".cmd") : [];
          var used = false,
            typing = null;
          function command(name, auto) {
            var c = TRACE[name];
            if (!c) return;
            if (!auto) {
              used = true;
              if (window.IO && window.IO.robotCommand)
                window.IO.robotCommand(name);
            }
            btns.forEach(function (b) {
              b.setAttribute(
                "aria-pressed",
                b.dataset.cmd === name ? "true" : "false"
              );
            });
            hud.forEach(function (s) {
              s.classList.toggle("on", c.layers.indexOf(s.dataset.l) >= 0);
            });
            if (typing) typing.pause();
            trace.innerHTML = c.lines
              .map(function (l) {
                return (
                  '<li><span class="tx"></span><span class="st ' +
                  l[1] +
                  '">' +
                  esc(l[2]) +
                  "</span></li>"
                );
              })
              .join("");
            var lis = all(trace, "li");
            if (!animate) {
              lis.forEach(function (li, i) {
                li.querySelector(".tx").textContent = c.lines[i][0];
              });
              return;
            }
            A({
              targets: hud.filter(function (s) {
                return s.classList.contains("on");
              }),
              scale: [1, 1.16, 1],
              duration: 650,
              delay: A.stagger(90),
              easing: "easeOutQuad",
            });
            A.set(all(trace, ".st"), { opacity: 0, scale: 0.6 });
            typing = A.timeline({ easing: "linear" });
            lis.forEach(function (li, i) {
              var text = c.lines[i][0],
                o = { n: 0 },
                tx = li.querySelector(".tx");
              typing.add({
                targets: o,
                n: text.length,
                round: 1,
                duration: Math.min(1100, text.length * 16),
                update: function () {
                  tx.textContent = text.slice(0, o.n);
                },
              });
              typing.add(
                {
                  targets: li.querySelector(".st"),
                  opacity: [0, 1],
                  scale: [0.6, 1],
                  duration: 420,
                  easing: "easeOutBack",
                },
                "-=80"
              );
            });
          }
          btns.forEach(function (b) {
            b.addEventListener("click", function () {
              command(b.dataset.cmd);
            });
          });
          function split(el) {
            if (!el) return [];
            if (el._words) return el._words;
            var words = el.textContent.trim().split(/\s+/);
            el.setAttribute("aria-label", el.textContent.trim());
            el.innerHTML = words
              .map(function (w) {
                return (
                  '<span class="w" aria-hidden="true"><span class="wi">' +
                  esc(w) +
                  "</span></span>"
                );
              })
              .join(" ");
            el._words = all(el, ".wi");
            return el._words;
          }
          if (!animate) {
            if (card && "MutationObserver" in window)
              new MutationObserverT(function () {
                if (card.hasAttribute("inert")) {
                  used = false;
                  return;
                }
                if (!used)
                  setTimeout(function () {
                    if (!used && !card.hasAttribute("inert"))
                      command("pick", true);
                  }, 600);
              }).observe(card, {
                attributes: true,
                attributeFilter: ["inert"],
              });
            return;
          }
          html.classList.add("anim");
          var cards = all(document, ".card, .spot");
          function parts(c) {
            if (c.classList.contains("spot"))
              return {
                eb: c.querySelector(".spot-k"),
                words: split(c.querySelector("h3")),
                rest: all(c, ".what, .how li, .facts > div, .src"),
                chips: all(c, ".chips span"),
              };
            return {
              eb: c.querySelector(".eyebrow"),
              words: split(c.querySelector("[data-split]")),
              rest: all(c, ".lead, .fact, .console .trace"),
              chips: all(
                c,
                ".pill, .cta .btn, .cmd, .hud span, .hero-stats > div, .hint"
              ),
            };
          }
          function hide(c) {
            var p = parts(c);
            A.set(p.eb, { opacity: 0, translateX: -24 });
            A.set(p.words, { translateY: "108%", rotate: 4 });
            A.set(p.rest, { opacity: 0, translateY: 16 });
            A.set(p.chips, { opacity: 0, translateY: 10, scale: 0.92 });
          }
          function countUp(els) {
            els.forEach(function (el) {
              var n = +el.dataset.n,
                o = { v: 0 };
              A({
                targets: o,
                v: n,
                round: 1,
                duration: 1800,
                easing: "easeOutExpo",
                update: function () {
                  el.textContent = o.v.toLocaleString("en-US");
                },
              });
            });
          }
          function play(c) {
            var p = parts(c);
            var tl = A.timeline({ easing: "easeOutExpo" });
            tl.add({
              targets: p.eb,
              opacity: [0, 1],
              translateX: [-24, 0],
              duration: 700,
            })
              .add(
                {
                  targets: p.words,
                  translateY: ["108%", "0%"],
                  rotate: [4, 0],
                  duration: 1e3,
                  delay: A.stagger(40),
                },
                60
              )
              .add(
                {
                  targets: p.rest,
                  opacity: [0, 1],
                  translateY: [16, 0],
                  duration: 800,
                  delay: A.stagger(90),
                },
                260
              )
              .add(
                {
                  targets: p.chips,
                  opacity: [0, 1],
                  translateY: [10, 0],
                  scale: [0.92, 1],
                  duration: 700,
                  delay: A.stagger(45),
                },
                420
              );
            countUp(all(c, "[data-n]"));
            if (c === card && !used)
              setTimeout(function () {
                if (!used && !c.hasAttribute("inert")) command("pick", true);
              }, 900);
          }
          function leave(c) {
            if (c === card) used = false;
            var p = parts(c);
            A({
              targets: p.words,
              translateY: "-108%",
              duration: 380,
              easing: "easeInQuad",
              delay: A.stagger(12),
            });
            A({
              targets: [p.eb].concat(p.rest, p.chips),
              opacity: 0,
              duration: 300,
              easing: "easeInQuad",
            });
          }
          cards.forEach(function (c) {
            if (!(late && !c.hasAttribute("inert"))) hide(c);
          });
          var mo = new MutationObserverT(
            safe(function (list) {
              list.forEach(function (m) {
                if (m.target.hasAttribute("inert")) leave(m.target);
                else play(m.target);
              });
            })
          );
          cards.forEach(function (c) {
            mo.observe(c, { attributes: true, attributeFilter: ["inert"] });
            if (!c.hasAttribute("inert") && !late) play(c);
          });
          var secs = all(document, "[data-reveal]").filter(function (s) {
            return !(late && onScreen(s));
          });
          secs.forEach(function (s) {
            all(s, "[data-split]").forEach(function (h) {
              A.set(split(h), { translateY: "108%" });
            });
            A.set(all(s, "[data-fade]"), { opacity: 0, translateY: 24 });
            A.set(all(s, "[data-stagger] > *"), {
              opacity: 0,
              translateY: 40,
              scale: 0.96,
            });
            A.set(all(s, ".hp-layer"), { opacity: 0, translateX: -40 });
            all(s, ".hp-layer").forEach(function (l) {
              l.style.setProperty("--bar", "0");
            });
          });
          function cols(grid) {
            var kids = grid.children;
            if (!kids.length) return 1;
            var top = kids[0].offsetTop,
              n = 0;
            for (var i = 0; i < kids.length && kids[i].offsetTop === top; i++)
              n++;
            return Math.max(1, n);
          }
          function reveal(s) {
            var tl = A.timeline({ easing: "easeOutExpo" });
            tl.add({
              targets: all(s, "[data-split] .wi"),
              translateY: ["108%", "0%"],
              duration: 1e3,
              delay: A.stagger(35),
            }).add(
              {
                targets: all(s, "[data-fade]"),
                opacity: [0, 1],
                translateY: [24, 0],
                duration: 900,
                delay: A.stagger(90),
              },
              150
            );
            all(s, "[data-stagger]").forEach(function (g2) {
              var kids = Array.prototype.slice.call(g2.children),
                c = cols(g2);
              var d =
                g2.hasAttribute("data-grid") && c > 1
                  ? A.stagger(70, {
                      grid: [c, Math.ceil(kids.length / c)],
                      from: "center",
                    })
                  : A.stagger(80);
              tl.add(
                {
                  targets: kids,
                  opacity: [0, 1],
                  translateY: [40, 0],
                  scale: [0.96, 1],
                  duration: 900,
                  delay: d,
                },
                260
              );
            });
            var layers = all(s, ".hp-layer");
            if (layers.length) {
              tl.add(
                {
                  targets: layers,
                  opacity: [0, 1],
                  translateX: [-40, 0],
                  duration: 800,
                  delay: A.stagger(90),
                },
                300
              );
              layers.forEach(function (l, i) {
                var o = { b: 0 };
                A({
                  targets: o,
                  b: 1,
                  duration: 700,
                  delay: 500 + i * 90,
                  easing: "easeOutCubic",
                  update: function () {
                    l.style.setProperty("--bar", o.b);
                  },
                });
              });
              setTimeout(
                safe(function () {
                  runSignal(s);
                }),
                1300
              );
            }
            countUp(all(s, "[data-n]"));
            if (s.id === "board-map" && map) map.reveal();
            all(s, ".hp-orb").forEach(function (o, i) {
              loop(
                s,
                A({
                  targets: o,
                  translateX: [0, A.random(-80, 80)],
                  translateY: [0, A.random(-50, 50)],
                  scale: [0.9, 1.2],
                  duration: A.random(4200, 6800),
                  delay: i * 400,
                  direction: "alternate",
                  loop: true,
                  easing: "easeInOutSine",
                })
              );
            });
          }
          function runSignal(s) {
            var dot = s.querySelector(".hp-dot"),
              rail = s.querySelector(".hp-rail"),
              layers = all(s, ".hp-layer");
            if (!dot || !rail) return;
            var ys = layers.map(function (l) {
              return l.offsetTop + l.offsetHeight / 2;
            });
            var tl = loop(
              s,
              A.timeline({ loop: true, easing: "easeInOutSine" })
            );
            tl.add({
              targets: dot,
              opacity: [0, 1],
              top: ys[0],
              duration: 300,
            });
            var seq = ys
              .map(function (y, i) {
                return i;
              })
              .concat(
                ys
                  .map(function (y, i) {
                    return ys.length - 2 - i;
                  })
                  .filter(function (i) {
                    return i >= 0;
                  })
              );
            seq.forEach(function (i, k) {
              if (k === 0) return;
              tl.add({ targets: dot, top: ys[i], duration: 520 });
              tl.add(
                {
                  targets: layers[i],
                  scale: [1, 1.012, 1],
                  duration: 520,
                  easing: "easeOutQuad",
                  begin: function () {
                    layers[i].classList.add("hit");
                  },
                  complete: function () {
                    layers[i].classList.remove("hit");
                  },
                },
                "-=120"
              );
            });
            tl.add({ targets: dot, opacity: 0, duration: 400 });
          }
          var waiting = secs.slice();
          function show(s) {
            var i = waiting.indexOf(s);
            if (i < 0) return;
            waiting.splice(i, 1);
            if (io) io.unobserve(s);
            s.setAttribute("data-shown", "");
            safe(reveal)(s);
          }
          var io =
            "IntersectionObserver" in window
              ? new IntersectionObserverT(
                  function (es) {
                    es.forEach(function (e) {
                      if (e.isIntersecting) show(e.target);
                    });
                  },
                  { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
                )
              : null;
          if (io)
            secs.forEach(function (s) {
              io.observe(s);
            });
          var sweepOn = false;
          function sweep() {
            sweepOn = false;
            waiting.slice().forEach(function (s) {
              if (s.getBoundingClientRect().top < innerHeight * 0.9) show(s);
            });
          }
          __on(
            window,
            "scroll",
            function () {
              if (!sweepOn && waiting.length) {
                sweepOn = true;
                __raf(sweep);
              }
            },
            { passive: true }
          );
          __every(function () {
            if (waiting.length) sweep();
          }, 1500);
          sweep();
          var g = document.querySelector(".hall-nodes");
          if (g) {
            var hues = [
              "#EF4444",
              "#FB7185",
              "#F472B6",
              "#F97316",
              "#38BDF8",
              "#2DD4BF",
              "#22D3EE",
              "#A78BFA",
              "#10B981",
              "#C084FC",
              "#34D399",
              "#F59E0B",
              "#60A5FA",
              "#A8A29E",
              "#818CF8",
              "#FBBF24",
              "#8B5CF6",
              "#06B6D4",
              "#9CA3AF",
            ];
            g.innerHTML = hues
              .map(function (h) {
                return (
                  '<circle class="node" r="6" cx="200" cy="80" style="--c:' +
                  h +
                  '"></circle>'
                );
              })
              .join("");
            var nodes = all(g, "circle"),
              st = { a: 0 };
            var hallHost = document.getElementById("ecad-hall");
            var ringA = loop(
              hallHost,
              A({
                targets: st,
                a: Math.PI * 2,
                duration: 4e4,
                loop: true,
                easing: "linear",
                update: function () {
                  nodes.forEach(function (n, i) {
                    var a = st.a + (i / nodes.length) * Math.PI * 2;
                    n.setAttribute("cx", (200 + Math.cos(a) * 170).toFixed(1));
                    n.setAttribute("cy", (80 + Math.sin(a) * 52).toFixed(1));
                    n.setAttribute(
                      "r",
                      (5 + (2.5 * (Math.sin(a) + 1)) / 2).toFixed(2)
                    );
                  });
                },
              })
            );
            if (hallHost && "MutationObserver" in window)
              new MutationObserverT(function () {
                if (!hallHost.classList.contains("hall-live")) return;
                LOOPS = LOOPS.filter(function (l) {
                  return l.a !== ringA;
                });
                ringA.pause();
              }).observe(hallHost, {
                attributes: true,
                attributeFilter: ["class"],
              });
          }
          all(document, ".hp-card").forEach(function (el) {
            el.addEventListener("pointermove", function (e) {
              if (e.pointerType !== "mouse") return;
              var r = el.getBoundingClientRect(),
                x = (e.clientX - r.left) / r.width - 0.5,
                y = (e.clientY - r.top) / r.height - 0.5;
              A({
                targets: el,
                rotateY: x * 9,
                rotateX: -y * 9,
                translateZ: 6,
                duration: 400,
                easing: "easeOutQuad",
              });
            });
            el.addEventListener("pointerleave", function () {
              A({
                targets: el,
                rotateY: 0,
                rotateX: 0,
                translateZ: 0,
                duration: 900,
                easing: "spring(1, 90, 12, 0)",
              });
            });
          });
          all(document, ".hp-btn").forEach(function (el) {
            el.addEventListener("pointermove", function (e) {
              if (e.pointerType !== "mouse") return;
              var r = el.getBoundingClientRect();
              A({
                targets: el,
                translateX: (e.clientX - r.left - r.width / 2) * 0.22,
                translateY: (e.clientY - r.top - r.height / 2) * 0.3,
                duration: 300,
                easing: "easeOutQuad",
              });
            });
            el.addEventListener("pointerleave", function () {
              A({
                targets: el,
                translateX: 0,
                translateY: 0,
                duration: 900,
                easing: "spring(1, 90, 12, 0)",
              });
            });
          });
        })
      );
    });
    function setupMap(A, animate) {
      var root = document.getElementById("board-map");
      if (!root || typeof PARTS === "undefined") return null;
      var NS = "http://www.w3.org/2000/svg";
      var X = function (x) {
          return (x + 5) * 100;
        },
        Y = function (z) {
          return (z + 3.6) * 100;
        };
      var svg = root.querySelector(".hp-board svg"),
        gT = svg.querySelector(".traces"),
        gP = svg.querySelector(".parts"),
        gD = svg.querySelector(".pulses"),
        gH = svg.querySelector(".holes");
      function el(tag, attrs, parent) {
        var e = document.createElementNS(NS, tag);
        for (var k in attrs) e.setAttribute(k, attrs[k]);
        if (parent) parent.appendChild(e);
        return e;
      }
      [
        [-4.55, -3.15],
        [4.55, -3.15],
        [-4.55, 3.15],
        [4.55, 3.15],
      ].forEach(function (h) {
        el("circle", { class: "hole", cx: X(h[0]), cy: Y(h[1]), r: 17 }, gH);
      });
      var buses = {},
        nodes = {},
        pulses = [];
      PARTS.forEach(function (p) {
        if (p.path) {
          var d = p.path
            .map(function (q, i) {
              return (
                (i ? "L" : "M") + X(q[0]).toFixed(1) + " " + Y(q[1]).toFixed(1)
              );
            })
            .join(" ");
          el("path", { class: "base", d }, gT);
          var bus = el(
            "path",
            { class: "bus", d, style: "--c:" + p.color },
            gT
          );
          buses[p.id] = bus;
          pulses.push({
            path: bus,
            dot: el(
              "circle",
              {
                class: "pulse",
                r: 5,
                cx: -20,
                cy: -20,
                style: "--c:" + p.color,
              },
              gD
            ),
          });
        }
        var g = el(
          "g",
          {
            class: "mp",
            tabindex: "0",
            role: "button",
            "aria-label": p.ref + ", " + p.name,
            style: "--c:" + p.color,
          },
          gP
        );
        if (p.r)
          el(
            "circle",
            { class: "body", cx: X(p.x), cy: Y(p.z), r: p.r * 100 },
            g
          );
        else
          el(
            "rect",
            {
              class: "body",
              x: X(p.x) - p.w * 50,
              y: Y(p.z) - p.d * 50,
              width: p.w * 100,
              height: p.d * 100,
              rx: Math.min(10, p.w * 20, p.d * 20),
            },
            g
          );
        if (p.id === "u1")
          el(
            "rect",
            {
              class: "body",
              x: X(0) - 55,
              y: Y(0) - 55,
              width: 110,
              height: 110,
              rx: 6,
              style: "fill: rgba(249,115,22,0.12)",
            },
            g
          );
        var small = (p.w || p.r * 2) < 0.6 || (p.d || p.r * 2) < 0.3;
        var t = el(
          "text",
          {
            x: X(p.x),
            y: Y(p.z) + (small ? -(p.d || 0.3) * 50 - 8 : 5),
            "text-anchor": "middle",
          },
          g
        );
        t.textContent = p.ref.split(" · ")[0];
        if (p.id === "u1") {
          var s2 = el(
            "text",
            { class: "sub", x: X(0), y: Y(0) + 24, "text-anchor": "middle" },
            g
          );
          s2.textContent = "EoS runs here";
        }
        nodes[p.id] = g;
        g.addEventListener("click", function () {
          select(p.id);
        });
        g.addEventListener("pointerenter", function (e) {
          if (e.pointerType === "mouse") show(p.id);
        });
        g.addEventListener("pointerleave", function (e) {
          if (e.pointerType === "mouse") show(pinned);
        });
        g.addEventListener("focus", function () {
          show(p.id);
        });
        g.addEventListener("blur", function () {
          show(pinned);
        });
        g.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            select(p.id);
          }
        });
      });
      var list = root.querySelector(".hp-parts");
      var btns = PARTS.map(function (p) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = p.ref;
        b.title = p.name;
        b.style.setProperty("--c", p.color);
        b.setAttribute("aria-pressed", "false");
        b.addEventListener("click", function () {
          select(p.id);
        });
        b.addEventListener("pointerenter", function (e) {
          if (e.pointerType === "mouse") show(p.id);
        });
        b.addEventListener("pointerleave", function (e) {
          if (e.pointerType === "mouse") show(pinned);
        });
        list.appendChild(b);
        return b;
      });
      var det = root.querySelector(".hp-detail"),
        cur = null,
        pinned = null;
      var ST = {
        code: ["s-work", ""],
        part: ["s-code", ""],
        docs: ["s-docs", ""],
        warn: ["s-plan", ""],
        none: ["", ""],
        info: ["", ""],
      };
      function fill(p) {
        det.style.setProperty("--c", p.color);
        det.querySelector(".ref").textContent = p.ref;
        det.querySelector("h3").textContent = p.name;
        det.querySelector(".bus").textContent = "Bus · " + p.bus;
        det.querySelector(".what").textContent = p.what;
        det.querySelector(".eos span").textContent = p.eos;
        var pill = det.querySelector(".st-pill");
        pill.className = "hp-pill st-pill " + (ST[p.st[1]] || [""])[0];
        pill.textContent = p.st[0];
      }
      function select(id) {
        pinned = id;
        btns.forEach(function (b, i) {
          b.setAttribute("aria-pressed", PARTS[i].id === id ? "true" : "false");
        });
        show(id);
      }
      function show(id) {
        if (!id || id === cur) return;
        var prev = cur;
        cur = id;
        var p = PARTS.filter(function (q) {
          return q.id === id;
        })[0];
        Object.keys(nodes).forEach(function (k) {
          nodes[k].classList.toggle("on", k === id);
        });
        Object.keys(buses).forEach(function (k) {
          buses[k].classList.toggle("on", k === id);
        });
        if (animate && prev && nodes[prev])
          A({
            targets: nodes[prev],
            scale: 1,
            duration: 300,
            easing: "easeOutQuad",
          });
        if (!animate) {
          fill(p);
          return;
        }
        var kids = all(det, ".ref, h3, .bus, .what, .eos, .st-pill");
        A.remove(kids);
        fill(p);
        A({
          targets: kids,
          opacity: [0, 1],
          translateY: [10, 0],
          duration: 460,
          delay: A.stagger(35),
          easing: "easeOutExpo",
        });
        A({
          targets: nodes[id],
          scale: [1, 1.08],
          duration: 600,
          easing: "easeOutElastic(1, .6)",
        });
      }
      nodes.u1 && nodes.u1.style.setProperty("transform-box", "fill-box");
      Object.keys(nodes).forEach(function (k) {
        nodes[k].style.transformBox = "fill-box";
        nodes[k].style.transformOrigin = "center";
      });
      select("u1");
      function runPulses() {
        pulses.forEach(function (q, i) {
          var L = q.path.getTotalLength(),
            o = { t: 0 };
          loop(
            root,
            A({
              targets: o,
              t: 1,
              duration: 900 + L * 3.2,
              delay: i * 140,
              loop: true,
              easing: "easeInOutSine",
              update: function () {
                var pt = q.path.getPointAtLength(o.t * L);
                q.dot.setAttribute("cx", pt.x);
                q.dot.setAttribute("cy", pt.y);
              },
            })
          );
        });
      }
      if (!animate) return { reveal: function () {}, select };
      var traces = all(svg, ".base, .bus"),
        partEls = all(svg, ".mp");
      A.set(traces, { strokeDashoffset: A.setDashoffset });
      A.set(partEls, { opacity: 0, scale: 0.6 });
      return {
        select,
        reveal: function () {
          var tl = A.timeline({ easing: "easeOutExpo" });
          tl.add(
            {
              targets: partEls,
              opacity: [0, 1],
              scale: [0.6, 1],
              duration: 800,
              delay: A.stagger(55, { from: 0 }),
            },
            200
          )
            .add(
              {
                targets: traces,
                strokeDashoffset: [A.setDashoffset, 0],
                duration: 1400,
                delay: A.stagger(60),
                easing: "easeInOutSine",
              },
              500
            )
            .add({
              targets: {},
              duration: 1,
              complete: function () {
                traces.forEach(function (t) {
                  t.style.strokeDasharray = "none";
                });
                runPulses();
              },
            });
        },
      };
    }
  })();
  async function runEngine() {
    const S = window.IO;
    const root = HS;
    const stage = document.getElementById("stage");
    const canvas = document.getElementById("gl");
    const labelsEl = document.getElementById("labels");
    const cardsEl = document.getElementById("cards");
    function fail(err) {
      root.classList.add("no-gl");
      if (err)
        console.warn(
          "3D model unavailable:",
          err && err.message ? err.message : err
        );
    }
    function softwareOnly() {
      try {
        const c = document.createElement("canvas");
        const o = { failIfMajorPerformanceCaveat: true };
        const gl = c.getContext("webgl2", o) || c.getContext("webgl", o);
        if (!gl) return true;
        const info = gl.getExtension("WEBGL_debug_renderer_info");
        const name = String(
          gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER)
        );
        const lose = gl.getExtension("WEBGL_lose_context");
        if (lose) lose.loseContext();
        return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(
          name
        );
      } catch (e) {
        return true;
      }
    }
    function engaged() {
      root.classList.add("gl-wait");
      return new Promise(go => {
        const evs = ["scroll", "wheel", "pointerdown", "touchstart", "keydown"];
        let timer = 0;
        const fire = () => {
          evs.forEach(e => removeEventListener(e, fire, true));
          clearTimeout(timer);
          root.classList.remove("gl-wait");
          if (stage.isConnected) go();
        };
        evs.forEach(e =>
          addEventListener(e, fire, { capture: true, passive: true })
        );
        const arm = () => {
          timer = setTimeout(
            () =>
              window.requestIdleCallback
                ? requestIdleCallback(fire, { timeout: 2e3 })
                : fire(),
            6e3
          );
        };
        if (document.readyState === "complete") arm();
        else addEventListener("load", arm, { once: true });
      });
    }
    let THREE,
      EffectComposer,
      RenderPass,
      UnrealBloomPass,
      OutputPass,
      RoomEnvironment,
      mergeGeometries,
      RoundedBoxGeometry,
      ShaderPass,
      GTAOPass;
    if (softwareOnly()) fail(new Error("no hardware graphics acceleration"));
    else
      try {
        if (window.IO_LITE && !S.capture) await engaged();
        const mods = await Promise.all([
          import("three"),
          import("three/addons/postprocessing/EffectComposer.js"),
          import("three/addons/postprocessing/RenderPass.js"),
          import("three/addons/postprocessing/UnrealBloomPass.js"),
          import("three/addons/postprocessing/OutputPass.js"),
          import("three/addons/environments/RoomEnvironment.js"),
          import("three/addons/utils/BufferGeometryUtils.js"),
          import("three/addons/geometries/RoundedBoxGeometry.js"),
          import("three/addons/postprocessing/ShaderPass.js"),
          /\bao\b/.test(location.hash)
            ? import("three/addons/postprocessing/GTAOPass.js")
            : Promise.resolve({}),
        ]);
        if (disposed) return;
        THREE = mods[0];
        EffectComposer = mods[1].EffectComposer;
        RenderPass = mods[2].RenderPass;
        UnrealBloomPass = mods[3].UnrealBloomPass;
        OutputPass = mods[4].OutputPass;
        RoomEnvironment = mods[5].RoomEnvironment;
        mergeGeometries = mods[6].mergeGeometries;
        RoundedBoxGeometry = mods[7].RoundedBoxGeometry;
        ShaderPass = mods[8].ShaderPass;
        GTAOPass = mods[9].GTAOPass;
      } catch (e) {
        fail(e);
      }
    function startStory(build) {
      if (!THREE) return;
      try {
        runStory(build);
      } catch (e) {
        fail(e);
      }
    }
    function runStory(build) {
      const IS_MOBILE = window.matchMedia("(max-width: 760px)").matches;
      const LOW = IS_MOBILE || (navigator.hardwareConcurrency || 8) <= 4;
      const TEX = LOW ? 1024 : 2048;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        powerPreference: "high-performance",
      });
      renderer.info.autoReset = false;
      renderer.debug.checkShaderErrors = /debug/.test(location.hash);
      canvas.addEventListener("webglcontextlost", () =>
        root.classList.add("gl-lost")
      );
      canvas.addEventListener("webglcontextrestored", () =>
        root.classList.remove("gl-lost")
      );
      let dpr = Math.min(window.devicePixelRatio || 1, LOW ? 1.25 : 1.5);
      renderer.setPixelRatio(dpr);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(395796);
      scene.fog = new THREE.FogExp2(395796, 0.026);
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environmentIntensity = 0.26;
      const camera = new THREE.PerspectiveCamera(35, 1, 0.03, 160);
      camera.layers.enable(1);
      const FX = 1;
      const fx = obj => {
        obj.traverse(c => c.layers.set(FX));
        return obj;
      };
      const rt = new THREE.WebGLRenderTarget(4, 4, {
        type: THREE.HalfFloatType,
        samples: LOW || dpr >= 1.25 ? 0 : 4,
      });
      const composer = new EffectComposer(renderer, rt);
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);
      const sanitize = new ShaderPass({
        uniforms: { tDiffuse: { value: null } },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform sampler2D tDiffuse; varying vec2 vUv; void main(){ vec4 c = texture2D(tDiffuse, vUv); if (any(isnan(c)) || any(isinf(c))) c = vec4(0.0, 0.0, 0.0, 1.0); gl_FragColor = vec4(min(c.rgb, vec3(48.0)), c.a); }`,
      });
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(256, 256),
        0.85,
        0.5,
        0.7
      );
      composer.addPass(bloom);
      const outputPass = new OutputPass();
      composer.addPass(outputPass);
      const GUARD =
        " if (any(isnan(texel)) || any(isinf(texel))) texel = vec4(0.0, 0.0, 0.0, 1.0); texel.rgb = min(texel.rgb, vec3(48.0));";
      const hpMat = bloom.materialHighPassFilter,
        outMat = outputPass.material;
      const hpSrc = hpMat.fragmentShader.replace(
        "vec4 texel = texture2D( tDiffuse, vUv );",
        "vec4 texel = texture2D( tDiffuse, vUv );" + GUARD
      );
      const outSrc = outMat.fragmentShader.replace(
        "gl_FragColor = texture2D( tDiffuse, vUv );",
        "vec4 texel = texture2D( tDiffuse, vUv );" +
          GUARD +
          " gl_FragColor = texel;"
      );
      if (hpSrc !== hpMat.fragmentShader && outSrc !== outMat.fragmentShader) {
        hpMat.fragmentShader = hpSrc;
        outMat.fragmentShader = outSrc;
        hpMat.needsUpdate = outMat.needsUpdate = true;
        outputPass.needsSwap = false;
        composer.renderTarget2.samples = 0;
      } else composer.insertPass(sanitize, 1);
      let useBloom = true;
      const hemi = new THREE.HemisphereLight(10205439, 728378, 0.55);
      scene.add(hemi);
      const key = new THREE.DirectionalLight(16769732, 1.6);
      key.position.set(6, 10, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(8378623, 0.8);
      rim.position.set(-8, 5, -7);
      scene.add(rim);
      const C = h => new THREE.Color(h);
      const HDR = (h, k) => new THREE.Color(h).multiplyScalar(k);
      const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
      const range = (v, a, b) => clamp01((v - a) / (b - a));
      const smooth = t => t * t * (3 - 2 * t);
      const sr = (v, a, b) => smooth(range(v, a, b));
      const easeOut = t => 1 - Math.pow(1 - t, 3);
      const lerp = (a, b, t) => a + (b - a) * t;
      const bump = (v, c, w) => Math.exp(-Math.pow((v - c) / w, 2));
      const win =
        (a, b, f = 0.05) =>
        T =>
          sr(T, a, a + f) * (1 - sr(T, b - f, b));
      function mulberry32(seed) {
        return () => {
          seed |= 0;
          seed = (seed + 1831565813) | 0;
          let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
      }
      const rand = mulberry32(918945);
      const maxAniso = renderer.capabilities.getMaxAnisotropy();
      function canvasTex(w, h, draw) {
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const g = c.getContext("2d");
        draw(g, w, h);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = Math.min(8, maxAniso);
        return t;
      }
      const rbox = (w, h, d, r = 0.02, s = 2) =>
        new RoundedBoxGeometry(w, h, d, s, r);
      const world = new THREE.Group();
      scene.add(world);
      function mesh(geo, mat, x = 0, y = 0, z = 0, parent = world) {
        const m = new THREE.Mesh(geo, mat);
        m.position.set(x, y, z);
        parent.add(m);
        return m;
      }
      const glowMaterial = (color, opacity = 0) =>
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
      const glowLine = (color, opacity = 0) =>
        new THREE.LineBasicMaterial({
          color,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
      const dummy = new THREE.Object3D();
      const tmpV = new THREE.Vector3();
      const tmpC = new THREE.Color();
      const VS_UV = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
      const FS_UP = `uniform float uTime; uniform float uOpacity; uniform vec3 uColor; varying vec2 vUv;
      void main(){ float f = pow(fract(vUv.y * 4.0 - uTime * 1.1), 5.0); float a = (0.45 + 2.2 * f) * uOpacity; gl_FragColor = vec4(uColor * a, a); }`;
      const FS_DOWN = `uniform float uTime; uniform float uOpacity; uniform vec3 uColor; varying vec2 vUv;
      void main(){ float f = pow(fract(vUv.y * 3.0 + uTime * 0.9), 6.0); float a = (0.3 + 2.0 * f) * uOpacity; gl_FragColor = vec4(uColor * a, a); }`;
      const FS_HEAD = `uniform float uOpacity; uniform float uHead; uniform vec3 uColor; varying vec2 vUv;
      void main(){ float lit = step(vUv.y, uHead); float h = exp(-(((vUv.y - uHead) * 28.0) * ((vUv.y - uHead) * 28.0))); float a = (lit * 1.0 + h * 4.0) * uOpacity; gl_FragColor = vec4(uColor * a, a); }`;
      const SPOTS = (window.IO_SPOTS || []).map(d => ({
        ...d,
        el: document.querySelector(`.spot[data-spot="${d.id}"]`),
        o: -1,
        on: false,
      }));
      const leadersEl = document.getElementById("leaders");
      const anchorsEl = document.getElementById("anchors");
      const NS = "http://www.w3.org/2000/svg";
      const wires = [0, 1].map(() => {
        const solid = document.createElementNS(NS, "path");
        const dash = document.createElementNS(NS, "path");
        dash.setAttribute("class", "dash");
        if (leadersEl) leadersEl.append(solid, dash);
        const ring = document.createElement("div");
        ring.className = "anchor";
        ring.appendChild(document.createElement("b"));
        if (anchorsEl) anchorsEl.appendChild(ring);
        return { solid, dash, ring, o: 0, c: "" };
      });
      SPOTS.forEach(sp => {
        if (!sp.el) return;
        sp.words =
          S.reduce || !S.splitWords
            ? []
            : [].concat(
                ...[...sp.el.querySelectorAll("h3")].map(h => S.splitWords(h))
              );
        sp.counts = [...sp.el.querySelectorAll("[data-count]")];
      });
      const V = (x, y, z) => new THREE.Vector3(x, y, z);
      const labels = [];
      function label(html, color, pos, vis) {
        const el = document.createElement("div");
        el.className = "tag";
        el.style.setProperty("--c", color);
        const dot = document.createElement("i");
        const text = document.createElement("span");
        text.innerHTML = html;
        el.append(dot, text);
        labelsEl.appendChild(el);
        labels.push({
          el,
          pos: typeof pos === "function" ? pos : () => pos,
          vis,
          v: new THREE.Vector3(),
          o: -1,
          left: false,
        });
        return { el, text };
      }
      const HOV = [];
      const hoverable = spec => {
        HOV.push({ r: 46, ...spec, v: new THREE.Vector3() });
      };
      const pixelUniforms = [];
      const ctx = {
        THREE,
        mergeGeometries,
        RoundedBoxGeometry,
        S,
        scene,
        world,
        camera,
        renderer,
        bloom,
        key,
        rim,
        LOW,
        IS_MOBILE,
        TEX,
        C,
        HDR,
        clamp01,
        range,
        smooth,
        sr,
        easeOut,
        lerp,
        bump,
        win,
        mulberry32,
        rand,
        canvasTex,
        rbox,
        mesh,
        glowMaterial,
        glowLine,
        dummy,
        tmpV,
        tmpC,
        VS_UV,
        FS_UP,
        FS_DOWN,
        FS_HEAD,
        label,
        V,
        pixelUniforms,
        composer,
        passes: { render: renderPass, bloom, output: outputPass },
        pmrem,
        ShaderPass,
        hemi,
        fx,
        FX,
        spots: SPOTS,
        hoverable,
        RoomEnvironment,
      };
      const story = build(ctx);
      let gtao = null,
        aoCam = null;
      if (story.ao && !LOW && GTAOPass && !/noao/.test(location.hash)) {
        aoCam = new THREE.PerspectiveCamera();
        gtao = new GTAOPass(scene, aoCam, 512, 512);
        gtao.output = GTAOPass.OUTPUT.Default;
        gtao.blendIntensity = story.ao.intensity ?? 1;
        gtao.updateGtaoMaterial({
          radius: story.ao.radius ?? 0.3,
          distanceExponent: 1,
          thickness: story.ao.thickness ?? 1,
          scale: 1,
          samples: 16,
          distanceFallOff: 1,
          screenSpaceRadius: false,
        });
        gtao.updatePdMaterial({
          lumaPhi: 10,
          depthPhi: 2,
          normalPhi: 3,
          radius: 6,
          radiusExponent: 1,
          rings: 2,
          samples: 16,
        });
        const seeThrough = m =>
          m &&
          (m.blending === THREE.AdditiveBlending ||
            (m.transparent && m.opacity < 0.62) ||
            m.userData.noAO);
        gtao._overrideVisibility = function () {
          const cache = this._visibilityCache;
          this.scene.traverse(o => {
            if (!o.visible) return;
            const hide =
              o.isPoints ||
              o.isLine ||
              o.isLine2 ||
              o.isSprite ||
              (o.isMesh &&
                (Array.isArray(o.material)
                  ? o.material.every(seeThrough)
                  : seeThrough(o.material)));
            if (hide) {
              o.visible = false;
              cache.push(o);
            }
          });
        };
        composer.insertPass(gtao, 2);
      }
      const KEYS = story.keys || [
        [0, [0, 0, 6], [0, 0, 0], 35],
        [1, [0, 0, 6], [0, 0, 0], 35],
      ];
      const RM = story.rm || [0];
      const KP = KEYS.map(k => new THREE.Vector3(...k[1]));
      const KQ = KEYS.map(k => new THREE.Vector3(...k[2]));
      const camPos = new THREE.Vector3(),
        camTgt = new THREE.Vector3();
      function cr(a, b, c, d, t, out) {
        const t2 = t * t,
          t3 = t2 * t;
        const f = (p0, p1, p2, p3) =>
          0.5 *
          (2 * p1 +
            (-p0 + p2) * t +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
            (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
        return out.set(
          f(a.x, b.x, c.x, d.x),
          f(a.y, b.y, c.y, d.y),
          f(a.z, b.z, c.z, d.z)
        );
      }
      function cameraAt(T, time2) {
        let fov;
        if (S.reduce) {
          const k = RM[Math.min(RM.length - 1, Math.floor(T + 0.02))];
          camPos.copy(KP[k]);
          camTgt.copy(KQ[k]);
          fov = KEYS[k][3];
        } else {
          let i = 0;
          while (i < KEYS.length - 2 && T > KEYS[i + 1][0]) i++;
          const t = clamp01((T - KEYS[i][0]) / (KEYS[i + 1][0] - KEYS[i][0]));
          const a = Math.max(0, i - 1),
            d = Math.min(KEYS.length - 1, i + 2);
          cr(KP[a], KP[i], KP[i + 1], KP[d], t, camPos);
          cr(KQ[a], KQ[i], KQ[i + 1], KQ[d], t, camTgt);
          fov = lerp(KEYS[i][3], KEYS[i + 1][3], smooth(t));
          const amp = Math.min(1, camPos.distanceTo(camTgt) / 8);
          camPos.x += Math.sin(time2 * 0.21) * 0.07 * amp;
          camPos.y += Math.sin(time2 * 0.17 + 1.3) * 0.05 * amp;
          camPos.z += Math.cos(time2 * 0.19) * 0.07 * amp;
          const sway = story.sway ? sr(T, story.sway[0], story.sway[1]) : 0;
          if (sway > 0) {
            const ang = Math.sin(time2 * 0.12) * 0.22 * sway;
            const c = Math.cos(ang),
              s = Math.sin(ang),
              x = camPos.x,
              z = camPos.z;
            camPos.x = x * c - z * s;
            camPos.z = x * s + z * c;
          }
        }
        if (camera.aspect < 0.95)
          fov = THREE.MathUtils.radToDeg(
            2 *
              Math.atan(
                (Math.tan(THREE.MathUtils.degToRad(fov) / 2) * 0.95) /
                  camera.aspect
              )
          );
        camera.position.copy(camPos);
        camera.lookAt(camTgt);
        if (Math.abs(camera.fov - fov) > 1e-3) {
          camera.fov = fov;
          camera.updateProjectionMatrix();
        }
      }
      let stageW = 1,
        stageH = 1,
        cardsRight = 0,
        cardsLeft = 1e9,
        barBottom = 64,
        stageRect = { left: 0, top: 0 };
      const CARD_EL = [...document.querySelectorAll(".card")];
      const scrims = [...document.querySelectorAll(".scrim")];
      let sideS = 1,
        sideApplied = 2;
      const LIFT = !!window.IO_LITE;
      let liftS = -1,
        liftApplied = -1,
        liftTop = 1e9,
        liftEl = null,
        liftGen = -1;
      function liftTarget(h) {
        if (!LIFT || stageW > 760) return h * 0.15;
        let best = 0,
          el = null;
        for (const c of CARD_EL)
          if ((c._o || 0) > best) {
            best = c._o;
            el = c;
          }
        if (!el) {
          liftEl = null;
          return Math.max(0, (barBottom - 26) / 2);
        }
        if (el !== liftEl || liftGen !== layoutGen) {
          liftEl = el;
          liftGen = layoutGen;
          liftTop =
            el.getBoundingClientRect().top -
            stage.getBoundingClientRect().top -
            (1 - (el._o || 0)) * 16;
        }
        const top = barBottom - 26,
          bottom = Math.min(h, liftTop - 10);
        return Math.max(0, Math.min(h * 0.36, h / 2 - (top + bottom) / 2));
      }
      function sideTarget() {
        let best = 0,
          side = 1;
        for (const c of CARD_EL)
          if ((c._o || 0) > best) {
            best = c._o;
            side = c.dataset.side === "right" ? -1 : 1;
          }
        for (const sp of SPOTS)
          if (sp.el && sp.o > best) {
            best = sp.o;
            side = sp.el.dataset.side === "right" ? -1 : 1;
          }
        return side;
      }
      function applyView(w, h, force) {
        if (
          !force &&
          Math.abs(sideS - sideApplied) < 2e-3 &&
          Math.abs(liftS - liftApplied) < 0.5
        )
          return;
        sideApplied = sideS;
        liftApplied = liftS;
        if (root.classList.contains("clean")) camera.clearViewOffset();
        else if (w > 1100)
          camera.setViewOffset(
            w,
            h,
            -w * (S.sideShift || 0.13) * sideS,
            0,
            w,
            h
          );
        else if (w > 900)
          camera.setViewOffset(w, h, -w * 0.13 * sideS, 0, w, h);
        else if (w > 760)
          camera.setViewOffset(w, h, -w * 0.08 * sideS, 0, w, h);
        else camera.setViewOffset(w, h, 0, liftS < 0 ? h * 0.15 : liftS, w, h);
        camera.updateProjectionMatrix();
        if (scrims.length > 1 && w > 760) {
          scrims[0].style.opacity = ((1 + sideS) / 2).toFixed(3);
          scrims[1].style.opacity = ((1 - sideS) / 2).toFixed(3);
        }
      }
      let layoutGen = 0;
      function resize() {
        const w = stage.clientWidth,
          h = stage.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        composer.setSize(w, h);
        camera.aspect = w / h;
        applyView(w, h, true);
        const px = renderer.getPixelRatio() * (h / 900);
        pixelUniforms.forEach(u => (u.value = px));
        if (story.onResize) story.onResize(w, h);
        stageW = w;
        stageH = h;
        const pad = Math.min(96, Math.max(16, w * 0.06)),
          colW = Math.min(450, w * 0.38);
        cardsRight = w > 760 ? pad + colW + 16 : 0;
        cardsLeft = w > 760 ? w - pad - colW - 16 : w;
        const bar = document.querySelector('header[role="banner"]');
        barBottom =
          (bar ? bar.getBoundingClientRect().bottom : 56) + (w > 760 ? 8 : 34);
        const sr0 = stage.getBoundingClientRect();
        stageRect = { left: sr0.left, top: sr0.top };
        layoutGen++;
      }
      const placed = [];
      function updateLabels(T) {
        placed.length = 0;
        for (const L of labels) {
          let o = L.vis(T);
          if (o > 0.01) {
            L.v.copy(L.pos()).project(camera);
            if (L.v.z > 1 || Math.abs(L.v.x) > 1.1 || Math.abs(L.v.y) > 1.1)
              o = 0;
          }
          let x = 0,
            y = 0;
          if (o > 0.01) {
            x = (L.v.x * 0.5 + 0.5) * stageW;
            y = (-L.v.y * 0.5 + 0.5) * stageH;
            if (
              (sideS >= 0 ? x < cardsRight : x > cardsLeft) ||
              y < barBottom ||
              y > stageH - 26
            )
              o = 0;
            else if (LIFT && stageW <= 760 && liftEl && y > liftTop - 18) o = 0;
          }
          if (o <= 0.01) {
            if (L.o !== 0) {
              L.el.style.opacity = "0";
              L.el.style.visibility = "hidden";
              L.o = 0;
            }
            continue;
          }
          const left =
            stageW <= 760
              ? x > stageW * 0.5
              : sideS < 0
                ? x > cardsLeft - 250
                : x > stageW * 0.74;
          if (left !== L.left) {
            L.left = left;
            L.el.classList.toggle("left", left);
          }
          if (!L.o) L.el.style.visibility = "visible";
          L.el.style.opacity = o.toFixed(3);
          L.o = o;
          L.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
          L.x = x;
          L.y = y;
          placed.push(L);
        }
        if (placed.length > 1) separateLabels();
      }
      function separateLabels() {
        placed.sort((a, b) => a.y - b.y);
        for (let i = 0; i < placed.length; i++) {
          const A = placed[i];
          if (A.w == null) {
            A.sp = A.el.querySelector("span");
            A.w = A.sp ? A.sp.offsetWidth : 0;
            A.h = A.sp ? A.sp.offsetHeight : 0;
          }
          const ax0 = A.left ? A.x - 20 - A.w : A.x + 20,
            ax1 = ax0 + A.w;
          let dy = 0;
          for (let k = 0; k < i; k++) {
            const B = placed[k];
            const bx0 = B.left ? B.x - 20 - B.w : B.x + 20,
              bx1 = bx0 + B.w;
            if (ax1 < bx0 - 4 || bx1 < ax0 - 4) continue;
            const ay0 = A.y - 34 + dy,
              by0 = B.y - 34 + B.dyNow;
            if (ay0 < by0 + B.h + 4 && by0 < ay0 + A.h + 4)
              dy = by0 + B.h + 4 - (A.y - 34);
          }
          A.dyNow = dy;
          if (A.sp && Math.abs((A.dy || 0) - dy) > 0.5) {
            A.dy = dy;
            A.sp.style.transform = dy ? `translateY(${dy.toFixed(1)}px)` : "";
          }
        }
      }
      const spotV = new THREE.Vector3();
      function panelRect(sp) {
        if (sp.rectGen !== layoutGen || !sp.rect) {
          const r = sp.el.getBoundingClientRect();
          const ty = (1 - sp.o) * 14;
          sp.rect = {
            left: r.left - stageRect.left,
            right: r.right - stageRect.left,
            top: r.top - stageRect.top - ty,
            bottom: r.bottom - stageRect.top - ty,
          };
          sp.rectGen = layoutGen;
        }
        return sp.rect;
      }
      function updateSpots(T, time2) {
        let slot = 0;
        for (const sp of SPOTS) {
          if (!sp.el) continue;
          const g0 = sp.ch + sp.a,
            g1 = sp.ch + sp.b;
          const o =
            T < g0 || T > g1
              ? 0
              : sr(T, g0, g0 + 0.035) * (1 - sr(T, g1 - 0.035, g1));
          if (o > 0 && sp.o <= 0) sp.rectGen = -1;
          if (o !== sp.o) {
            sp.o = o;
            sp.el.style.opacity = o.toFixed(3);
            sp.el.style.visibility = o > 0 ? "visible" : "hidden";
            sp.el.style.transform = `translateY(${((1 - o) * 14).toFixed(1)}px)`;
            if (S.revealWords) S.revealWords(sp.words, o);
            if (S.countUp) S.countUp(sp.counts, o);
            const on = o > 0.5;
            if (on !== sp.on) {
              sp.on = on;
              if (on) sp.el.removeAttribute("inert");
              else sp.el.setAttribute("inert", "");
            }
          }
          if (o < 0.02 || slot > 1 || !sp.anchor || !story.anchor) continue;
          const p = story.anchor(sp.anchor, spotV, T, time2);
          if (!p) continue;
          spotV.project(camera);
          if (
            spotV.z > 1 ||
            Math.abs(spotV.x) > 1.05 ||
            Math.abs(spotV.y) > 1.05
          )
            continue;
          const ax = (spotV.x * 0.5 + 0.5) * stageW,
            ay = (-spotV.y * 0.5 + 0.5) * stageH;
          const r = panelRect(sp);
          const w = wires[slot++];
          let d;
          if (stageW > 760) {
            const right = (r.left + r.right) / 2 > stageW / 2;
            const sx = right ? r.left - 18 : r.right + 18,
              sy = Math.min(Math.max(r.top + 30, barBottom), stageH - 40);
            const ex = right
              ? Math.min(sx - 24, ax + 34)
              : Math.max(sx + 24, ax - 34);
            const end = right ? ax + 12 : ax - 12;
            d = `M${sx.toFixed(1)} ${sy.toFixed(1)} H${(sx + (ex - sx) * 0.42).toFixed(1)} L${ex.toFixed(1)} ${ay.toFixed(1)} H${end.toFixed(1)}`;
          } else {
            const sx = Math.min(Math.max(ax, 30), stageW - 30),
              sy = r.top - 10;
            d = `M${sx.toFixed(1)} ${sy.toFixed(1)} V${((sy + ay) / 2).toFixed(1)} L${ax.toFixed(1)} ${(ay + 12).toFixed(1)}`;
          }
          w.solid.setAttribute("d", d);
          w.dash.setAttribute("d", d);
          if (w.c !== sp.color) {
            w.c = sp.color;
            w.solid.setAttribute("stroke", sp.color);
            w.dash.setAttribute("stroke", sp.color);
            w.ring.style.setProperty("--c", sp.color);
          }
          const k =
            o *
            (stageW > 760 && (r.left + r.right) / 2 > stageW / 2
              ? Math.min(1, (r.left - ax) / 60 + 0.4)
              : Math.min(1, (ax - (cardsRight - 16)) / 60 + 0.4));
          w.solid.style.opacity = (k * 0.35).toFixed(3);
          w.dash.style.opacity = (k * 0.9).toFixed(3);
          w.dash.style.strokeDashoffset = (-time2 * 22).toFixed(1);
          w.ring.style.opacity = o.toFixed(3);
          w.ring.style.transform = `translate3d(${ax.toFixed(1)}px, ${ay.toFixed(1)}px, 0)`;
          w.o = o;
        }
        for (let i = slot; i < wires.length; i++) {
          const w = wires[i];
          if (w.o !== 0) {
            w.o = 0;
            w.solid.style.opacity = "0";
            w.dash.style.opacity = "0";
            w.ring.style.opacity = "0";
          }
        }
      }
      function render() {
        if (gtao)
          gtao.enabled =
            LADDER[rung].ao && (!story.aoWanted || story.aoWanted(Ts));
        if (gtao && gtao.enabled) {
          aoCam.copy(camera, false);
          aoCam.layers.set(0);
        }
        if (useBloom) composer.render();
        else renderer.render(scene, camera);
      }
      S.relayout = resize;
      new ResizeObserverT(resize).observe(stage);
      if (document.fonts && document.fonts.ready)
        document.fonts.ready.then(() => layoutGen++);
      resize();
      let running = !document.hidden,
        visible = true,
        last = performance.now(),
        time = 0,
        Ts = S.target || 0;
      let Tvel = 0,
        idleFor = 0,
        idleSkip = 0;
      let powerOn = S.reduce ? 1 : 0,
        t0 = performance.now(),
        warm = 0,
        ready = false;
      new IntersectionObserverT(([e]) => {
        visible = e.isIntersecting;
      }).observe(stage);
      __on(document, "visibilitychange", () => {
        running = !document.hidden;
        last = performance.now();
      });
      const BASE_DPR = dpr;
      const LADDER = [
        { ao: true, scale: 1, bloom: true },
        { ao: false, scale: 1, bloom: true },
        { ao: false, scale: 0.86, bloom: true },
        { ao: false, scale: 0.86, bloom: false },
        { ao: false, scale: 0.74, bloom: false },
        { ao: false, scale: 0.62, bloom: false },
      ];
      let rung = 3,
        ema = 1 / 60,
        slowFor = 0,
        fastFor = 0,
        lastSwitch = 0,
        crawlFor = 0;
      let refresh = 1 / 60,
        winMin = 1,
        winT = 0,
        cap = LOW ? 2 : 1,
        climbedAt = -1e9;
      function giveUp() {
        alive = false;
        S.follow = false;
        if (S.paint) S.paint(S.target);
        root.classList.remove("gl-ready");
        root.classList.add("no-gl");
        try {
          renderer.dispose();
        } catch (e) {}
        console.warn(
          "3D model paused: this device draws it too slowly, so the still image is shown"
        );
      }
      S.quality = () => rung;
      function applyRung() {
        const L = LADDER[rung];
        useBloom = L.bloom;
        const want = Math.max(0.5, BASE_DPR * L.scale);
        if (Math.abs(renderer.getPixelRatio() - want) > 0.01) {
          renderer.setPixelRatio(want);
          composer.setPixelRatio(want);
          resize();
        }
      }
      applyRung();
      function adapt(dt, now, moving) {
        if (S.noAdapt) return;
        winMin = Math.min(winMin, dt);
        winT += dt;
        if (winT > 2) {
          refresh = Math.min(1 / 30, Math.max(1 / 240, winMin));
          winMin = 1;
          winT = 0;
        }
        warm += dt;
        if (warm < 2.2) return;
        ema += (dt - ema) * 0.06;
        if (ema > refresh * 1.3) {
          slowFor += dt;
          fastFor = 0;
        } else if (ema < refresh * 1.08) {
          if (moving) fastFor += dt;
          slowFor = 0;
        } else slowFor = fastFor = 0;
        crawlFor =
          rung === LADDER.length - 1 && ema > refresh * 2.2
            ? crawlFor + (moving ? dt : 0)
            : 0;
        if (crawlFor > 4) return giveUp();
        if (now - lastSwitch < 1500) {
          slowFor = 0;
          return;
        }
        if (slowFor > 1.2 && rung < LADDER.length - 1) {
          if (now - climbedAt < 5e3) cap = rung + 1;
          rung++;
          applyRung();
          lastSwitch = now;
          slowFor = 0;
          ema = refresh;
        } else if (fastFor > 6 && rung > cap && now - lastSwitch > 4e3) {
          rung--;
          applyRung();
          lastSwitch = now;
          climbedAt = now;
          fastFor = 0;
        }
      }
      S.info = () => ({
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        textures: renderer.info.memory.textures,
        geometries: renderer.info.memory.geometries,
        tier: rung,
        dpr: renderer.getPixelRatio(),
        bloom: useBloom,
        ao: !!(gtao && gtao.enabled),
      });
      let alive = true;
      S.disposeGL = () => {
        alive = false;
        try {
          renderer.dispose();
          renderer.forceContextLoss();
        } catch (_) {}
      };
      function frame(now) {
        if (!alive) return;
        __raf(frame);
        const dt = Math.max(0, Math.min(0.05, (now - last) / 1e3));
        last = now;
        if (!running || !visible) return;
        try {
          if (S.debugTime != null) time = S.debugTime;
          else if (!S.paused && !S.reduce) time += dt;
          powerOn = S.reduce || S.capture ? 1 : clamp01((now - t0) / 2600);
          if (S.forced !== null) {
            Ts = S.target;
            Tvel = 0;
          } else {
            const omega = 2 / 0.24,
              x = omega * dt,
              ex = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
            const change = Ts - S.target,
              temp = (Tvel + omega * change) * dt;
            Tvel = (Tvel - omega * temp) * ex;
            Ts = S.target + (change + temp) * ex;
            if (Math.abs(Ts - S.target) < 1e-5 && Math.abs(Tvel) < 1e-5)
              Ts = S.target;
          }
          const moving =
            Math.abs(Ts - S.target) > 1e-4 ||
            Math.abs(Tvel) > 1e-4 ||
            S.hoverBusy ||
            S.orbitBusy;
          idleFor = moving ? 0 : idleFor + dt;
          if (
            idleFor > (LOW || rung >= 3 ? 1.2 : 2.5) &&
            !S.capture &&
            (idleSkip = (idleSkip + 1) % 2) === 1
          )
            return;
          sideS +=
            (sideTarget() - sideS) * (S.capture ? 1 : 1 - Math.exp(-dt * 6));
          const lt = liftTarget(stageH);
          liftS =
            liftS < 0 || S.capture
              ? lt
              : liftS + (lt - liftS) * (1 - Math.exp(-dt * 5));
          applyView(stageW, stageH, false);
          if (S.follow && S.paint) S.paint(Ts);
          if (story.camera) story.camera(Ts, time, dt);
          else cameraAt(Ts, time);
          story.update(Ts, time, dt, easeOut(powerOn));
          renderer.info.reset();
          render();
          updateLabels(Ts);
          if (SPOTS.length) updateSpots(Ts, time);
          if (!ready) {
            ready = true;
            S.follow = !!window.IO_LITE;
            root.classList.remove("no-gl");
            root.classList.add("gl-ready");
          }
          adapt(dt, now, moving);
          if (S.hoverTick) S.hoverTick(Ts, time);
        } catch (err) {
          alive = false;
          fail(err);
          console.error(err);
        }
      }
      async function prewarm() {
        const shown = [],
          culled = [];
        scene.traverse(o => {
          if (!o.visible) {
            shown.push(o);
            o.visible = true;
          }
          if ((o.isMesh || o.isPoints || o.isLine) && o.frustumCulled) {
            culled.push(o);
            o.frustumCulled = false;
          }
        });
        try {
          const rt0 = new THREE.WebGLRenderTarget(32, 32);
          if (
            renderer.compileAsync &&
            renderer.extensions.has("KHR_parallel_shader_compile")
          ) {
            await renderer.compileAsync(scene, camera);
            renderer.setRenderTarget(rt0);
            await renderer.compileAsync(scene, camera);
          } else {
            renderer.compile(scene, camera);
            renderer.setRenderTarget(rt0);
          }
          renderer.render(scene, camera);
          renderer.setRenderTarget(null);
          rt0.dispose();
          composer.render();
        } catch (e) {
          console.warn("warm-up skipped:", e && e.message);
        }
        for (const o of shown) o.visible = false;
        for (const o of culled) o.frustumCulled = true;
      }
      const hoverEl = document.getElementById("hovercard");
      if (hoverEl && HOV.length) {
        let px = -1,
          py = -1,
          on = false,
          pinUntil = 0,
          cur = null,
          hoverH = 180,
          hoverW = 300,
          ringEl = document.getElementById("hoverring");
        const overUi = t =>
          t && t.closest && t.closest(".card, .spot, .bar, .rail, a, button");
        __on(
          window,
          "pointermove",
          e => {
            if (e.pointerType === "touch") return;
            px = e.clientX;
            py = e.clientY;
            on = !overUi(e.target);
          },
          { passive: true }
        );
        __on(
          window,
          "pointerdown",
          e => {
            if (e.pointerType !== "touch") return;
            px = e.clientX;
            py = e.clientY;
            on = !overUi(e.target);
            pinUntil = performance.now() + 3800;
          },
          { passive: true }
        );
        __on(document, "pointerleave", e => {
          if (e.pointerType !== "touch") on = false;
        });
        __on(
          window,
          "scroll",
          () => {
            if (performance.now() > pinUntil) return;
            pinUntil = 0;
          },
          { passive: true }
        );
        S.hoverReset = () => {
          pinUntil = 0;
          on = false;
        };
        S.hoverTick = (T, time2) => {
          const touchPinned = pinUntil > performance.now();
          let best = null,
            bd = 1e9;
          if (
            on &&
            !S.orbitDrag &&
            (touchPinned || pinUntil === 0) &&
            !root.classList.contains("clean")
          ) {
            const x0 = px - stageRect.left,
              y0 = py - stageRect.top;
            for (const hv of HOV) {
              if (hv.when && !(hv.when(T) > 0.5)) continue;
              const p = hv.pos(hv.v);
              if (!p) continue;
              hv.v.project(camera);
              if (hv.v.z > 1 || Math.abs(hv.v.x) > 1 || Math.abs(hv.v.y) > 1)
                continue;
              const sx = (hv.v.x * 0.5 + 0.5) * stageW,
                sy = (-hv.v.y * 0.5 + 0.5) * stageH;
              const d = Math.hypot(sx - x0, sy - y0),
                de = d + (hv.pen || 0);
              if (d < hv.r && de < bd) {
                bd = de;
                best = hv;
                best._sx = sx;
                best._sy = sy;
              }
            }
          }
          S.hoverBusy = !!best;
          if (best !== cur) {
            if (cur && cur.on) cur.on(false);
            if (best && best.on) best.on(true);
            canvas.style.cursor = best ? "pointer" : "";
            cur = best;
            hoverEl.classList.toggle("on", !!best);
            if (ringEl) ringEl.classList.toggle("on", !!best);
            if (best) {
              hoverEl.style.setProperty("--c", best.color || "#34D399");
              if (ringEl)
                ringEl.style.setProperty("--c", best.color || "#34D399");
              hoverEl.innerHTML = best.html;
              hoverH = hoverEl.offsetHeight || 180;
              hoverW = hoverEl.offsetWidth || 300;
            }
          }
          if (best) {
            const narrow = stageW <= 760;
            const flip =
              !narrow &&
              (sideS < 0
                ? best._sx - 22 - 330 > cardsRight * 0 + 24
                : best._sx + 22 + 330 > stageW - 24);
            let cy = best._sy - 18,
              cx = flip ? best._sx - 22 : best._sx + 22;
            if (best.tag)
              cy =
                best._sy + 16 + hoverH < stageH - 12
                  ? best._sy + 16
                  : best._sy - 50 - hoverH;
            if (narrow) {
              cx = Math.min(
                Math.max(best._sx - hoverW / 2, 12),
                stageW - hoverW - 12
              );
              cy =
                best._sy + 30 + hoverH < stageH - 12
                  ? best._sy + 30
                  : best._sy - 30 - hoverH;
            }
            cy = Math.min(Math.max(cy, barBottom), stageH - 40);
            hoverEl.classList.toggle("flip", flip);
            hoverEl.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
            if (ringEl)
              ringEl.style.transform = `translate3d(${best._sx.toFixed(1)}px, ${best._sy.toFixed(1)}px, 0)`;
          }
        };
      }
      prewarm().then(() => {
        __raf(frame);
      });
    }
    startStory(ctx => {
      const {
        scene,
        world,
        camera,
        renderer,
        bloom,
        composer,
        pmrem,
        ShaderPass: ShaderPass2,
        key,
        rim,
        hemi,
        LOW,
        IS_MOBILE,
        TEX,
        C,
        HDR,
        clamp01,
        range,
        smooth,
        sr,
        easeOut,
        lerp,
        bump,
        win,
        mulberry32,
        rand,
        canvasTex,
        rbox,
        glowMaterial,
        glowLine,
        dummy,
        tmpV,
        tmpC,
        label,
        V,
      } = ctx;
      const TAU = Math.PI * 2;
      const easeInOut = t =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const easeInOutSine = t => -(Math.cos(Math.PI * t) - 1) / 2;
      const easeOutBack = t =>
        1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);
      const PORTRAIT = window.innerHeight > window.innerWidth * 1.05;
      const TXS = LOW ? 512 : 1024;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.95;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      scene.background = new THREE.Color(197898);
      scene.fog = new THREE.FogExp2(197898, 0.03);
      bloom.strength = 0.55;
      bloom.radius = 0.45;
      bloom.threshold = 1.15;
      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color(461588);
      const softbox = (w, h, pos, k, col = 16777215) => {
        const m = new THREE.Mesh(
          new THREE.PlaneGeometry(w, h),
          new THREE.MeshBasicMaterial({
            color: new THREE.Color(col).multiplyScalar(k),
            side: THREE.DoubleSide,
          })
        );
        m.position.set(pos[0], pos[1], pos[2]);
        m.lookAt(0, 0.6, 0);
        envScene.add(m);
      };
      softbox(9, 4, [0, 9, 3], 2.6);
      softbox(2.6, 8, [-8, 3.5, 2.5], 1.6);
      softbox(2.6, 8, [8, 3.5, -2.5], 1.25, 13623551);
      softbox(12, 2.2, [0, 2, -10], 0.5, 14477055);
      softbox(14, 14, [0, -5, 0], 0.12, 3824784);
      scene.environment = pmrem.fromScene(envScene, 0.035).texture;
      scene.environmentIntensity = 0.85;
      hemi.intensity = 0.12;
      key.color.set(16773342);
      key.intensity = 1.6;
      key.castShadow = true;
      key.shadow.mapSize.set(LOW ? 1024 : 2048, LOW ? 1024 : 2048);
      key.shadow.camera.near = 0.5;
      key.shadow.camera.far = 40;
      key.shadow.bias = -25e-5;
      key.shadow.normalBias = 0.025;
      key.shadow.radius = 5;
      scene.add(key.target);
      rim.color.set(10275583);
      rim.intensity = 1.3;
      const fill = new THREE.DirectionalLight(12900607, 0.3);
      scene.add(fill, fill.target);
      function aimLights(focus2, spread) {
        key.position.set(focus2.x + 4.5, 9, focus2.z + 5.5);
        key.target.position.copy(focus2);
        const cam = key.shadow.camera;
        if (cam.right !== spread) {
          cam.left = -spread;
          cam.right = spread;
          cam.top = spread;
          cam.bottom = -spread;
          cam.updateProjectionMatrix();
        }
        rim.position.set(focus2.x - 6, 5, focus2.z - 7);
        fill.position.set(focus2.x - 6, 3, focus2.z + 6);
        fill.target.position.copy(focus2);
      }
      const grain = new ShaderPass2({
        uniforms: {
          tDiffuse: { value: null },
          uTime: { value: 0 },
          uAmount: { value: 0.028 },
          uVig: { value: 0.32 },
          uSharp: { value: 0 },
          uTexel: { value: new THREE.Vector2(1 / 1600, 1 / 900) },
        },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime; uniform float uAmount; uniform float uVig; uniform float uSharp; uniform vec2 uTexel; varying vec2 vUv;
        float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
        void main(){ vec4 c = texture2D(tDiffuse, vUv);
          if (uSharp > 0.0) {
            vec3 nb = (texture2D(tDiffuse, vUv + vec2(uTexel.x, 0.0)).rgb + texture2D(tDiffuse, vUv - vec2(uTexel.x, 0.0)).rgb + texture2D(tDiffuse, vUv + vec2(0.0, uTexel.y)).rgb + texture2D(tDiffuse, vUv - vec2(0.0, uTexel.y)).rgb) * 0.25;
            c.rgb = clamp(c.rgb + (c.rgb - nb) * uSharp, 0.0, 1.0);
          }
          float n = hash(floor(vUv * vec2(1600.0, 900.0)) + floor(uTime * 24.0)) - 0.5;
          c.rgb += n * uAmount; float d = distance(vUv, vec2(0.5)); c.rgb *= 1.0 - uVig * smoothstep(0.32, 0.9, d); gl_FragColor = c; }`,
      });
      composer.addPass(grain);
      const noiseTex = (seed, draw) =>
        canvasTex(256, 256, (g, w, h) => {
          const R = mulberry32(seed);
          draw(g, w, h, R);
        });
      const brushed = noiseTex(177, (g, w, h, R) => {
        g.fillStyle = "#8a8a8a";
        g.fillRect(0, 0, w, h);
        for (let i = 0; i < 900; i++) {
          const y = R() * h,
            v = 110 + R() * 60;
          g.fillStyle = `rgba(${v},${v},${v},0.35)`;
          g.fillRect(0, y, w, 0.6 + R());
        }
      });
      brushed.colorSpace = THREE.NoColorSpace;
      brushed.wrapS = brushed.wrapT = THREE.RepeatWrapping;
      const MAT = {
        alu: (color = 11844806, rough = 0.42) =>
          new THREE.MeshPhysicalMaterial({
            color,
            metalness: 1,
            roughness: rough,
            roughnessMap: brushed,
            anisotropy: 0.55,
            clearcoat: 0.1,
          }),
        anod: (color = 1778224, rough = 0.36) =>
          new THREE.MeshPhysicalMaterial({
            color,
            metalness: 0.85,
            roughness: rough,
            roughnessMap: brushed,
            clearcoat: 0.25,
            clearcoatRoughness: 0.4,
          }),
        steel: (rough = 0.28) =>
          new THREE.MeshStandardMaterial({
            color: 13225686,
            metalness: 1,
            roughness: rough,
          }),
        chrome: () =>
          new THREE.MeshStandardMaterial({
            color: 15922423,
            metalness: 1,
            roughness: 0.08,
          }),
        blackMetal: (rough = 0.42) =>
          new THREE.MeshStandardMaterial({
            color: 1382430,
            metalness: 0.8,
            roughness: rough,
          }),
        gold: () =>
          new THREE.MeshStandardMaterial({
            color: 14923874,
            metalness: 1,
            roughness: 0.22,
          }),
        copper: () =>
          new THREE.MeshStandardMaterial({
            color: 13666908,
            metalness: 1,
            roughness: 0.3,
          }),
        plastic: (color = 1711912, rough = 0.55) =>
          new THREE.MeshPhysicalMaterial({
            color,
            metalness: 0,
            roughness: rough,
            clearcoat: 0.05,
          }),
        gloss: (color = 1053724) =>
          new THREE.MeshPhysicalMaterial({
            color,
            metalness: 0,
            roughness: 0.28,
            clearcoat: 1,
            clearcoatRoughness: 0.08,
          }),
        rubber: (color = 1447964) =>
          new THREE.MeshPhysicalMaterial({
            color,
            metalness: 0,
            roughness: 0.88,
            sheen: 0.4,
            sheenRoughness: 0.8,
            sheenColor: new THREE.Color(3817552),
          }),
        ceramic: (color = 15328991) =>
          new THREE.MeshPhysicalMaterial({
            color,
            metalness: 0,
            roughness: 0.3,
            clearcoat: 0.6,
            clearcoatRoughness: 0.2,
          }),
        glass: (tint = 10467542, opacity = 0.22) =>
          new THREE.MeshPhysicalMaterial({
            color: tint,
            metalness: 0,
            roughness: 0.04,
            transparent: true,
            opacity,
            clearcoat: 1,
            clearcoatRoughness: 0.02,
            envMapIntensity: 1.6,
            depthWrite: false,
          }),
        emissive: (color, k = 1.6, base = 724758) =>
          new THREE.MeshStandardMaterial({
            color: base,
            emissive: color,
            emissiveIntensity: k,
            roughness: 0.4,
            metalness: 0.1,
          }),
        led: (color, k = 3) =>
          new THREE.MeshBasicMaterial({
            color: new THREE.Color(color).multiplyScalar(k),
            toneMapped: true,
          }),
        pcb: (tone = "navy") => {
          const base = {
            navy: ["#0d2442", "#16345c"],
            green: ["#123b28", "#1d5a3c"],
            black: ["#0c0f14", "#1a2029"],
            brown: ["#3a2a1a", "#523b24"],
          }[tone] || ["#0d2442", "#16345c"];
          const tex = canvasTex(TXS, TXS, (g, w, h) => {
            const R = mulberry32(2507 + tone.length);
            g.fillStyle = base[0];
            g.fillRect(0, 0, w, h);
            g.strokeStyle = base[1];
            g.lineWidth = w * 4e-3;
            for (let i = 0; i < 70; i++) {
              let x = R() * w,
                y = R() * h;
              g.beginPath();
              g.moveTo(x, y);
              for (let k = 0; k < 3; k++) {
                const a = ((R() * 8) | 0) * (Math.PI / 4),
                  L = (0.05 + R() * 0.2) * w;
                x += Math.cos(a) * L;
                y += Math.sin(a) * L;
                g.lineTo(x, y);
              }
              g.stroke();
            }
            g.fillStyle = "#caa24e";
            for (let i = 0; i < 160; i++) {
              g.beginPath();
              g.arc(R() * w, R() * h, w * 4e-3, 0, TAU);
              g.fill();
            }
          });
          return new THREE.MeshPhysicalMaterial({
            map: tex,
            roughness: 0.42,
            metalness: 0.1,
            clearcoat: 0.7,
            clearcoatRoughness: 0.25,
          });
        },
        carbon: () => {
          const tex = canvasTex(256, 256, (g, w, h) => {
            g.fillStyle = "#101216";
            g.fillRect(0, 0, w, h);
            for (let y = 0; y < h; y += 16)
              for (let x = 0; x < w; x += 16) {
                const on = ((x + y) / 16) % 2 === 0;
                const gr = g.createLinearGradient(
                  x,
                  y,
                  on ? x + 16 : x,
                  on ? y : y + 16
                );
                gr.addColorStop(0, "#1b1f26");
                gr.addColorStop(0.5, "#2b313b");
                gr.addColorStop(1, "#15181e");
                g.fillStyle = gr;
                g.fillRect(x + 1, y + 1, 14, 14);
              }
          });
          tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(4, 4);
          return new THREE.MeshPhysicalMaterial({
            map: tex,
            metalness: 0.3,
            roughness: 0.35,
            clearcoat: 1,
            clearcoatRoughness: 0.12,
          });
        },
        screen: (draw, w = 512, h = 320, k = 1.25) => {
          const c = document.createElement("canvas");
          c.width = w;
          c.height = h;
          const g = c.getContext("2d");
          const tex = new THREE.CanvasTexture(c);
          tex.colorSpace = THREE.SRGBColorSpace;
          const mat = new THREE.MeshStandardMaterial({
            color: 131845,
            emissive: 16777215,
            emissiveMap: tex,
            emissiveIntensity: k,
            roughness: 0.18,
            metalness: 0.1,
          });
          const redraw = t => {
            draw(g, w, h, t || 0);
            tex.needsUpdate = true;
          };
          redraw(0);
          mat.userData.redraw = redraw;
          return mat;
        },
      };
      const GEO = {
        rbox: (w, h, d, r = 0.02, s = 3) =>
          new RoundedBoxGeometry(
            w,
            h,
            d,
            s,
            Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4)
          ),
        cyl: (rt2, rb, h, n = 48, open = false) =>
          new THREE.CylinderGeometry(rt2, rb, h, n, 1, open),
        torus: (r, t, rs = 16, ts = 64, arc = TAU) =>
          new THREE.TorusGeometry(r, t, rs, ts, arc),
        sphere: (r, ws = 32, hs = 16) => new THREE.SphereGeometry(r, ws, hs),
        lathe: (pts, n = 64) =>
          new THREE.LatheGeometry(
            pts.map(([r, y]) => new THREE.Vector2(r, y)),
            n
          ),
        tube: (pts, r = 0.02, n = 64, rs = 8) =>
          new THREE.TubeGeometry(
            new THREE.CatmullRomCurve3(
              pts.map(p => new THREE.Vector3(p[0], p[1], p[2]))
            ),
            n,
            r,
            rs,
            false
          ),
        extrude: (pts, depth, bevel = 0.01) => {
          const s = new THREE.Shape(
            pts.map(([x, y]) => new THREE.Vector2(x, y))
          );
          return new THREE.ExtrudeGeometry(s, {
            depth,
            bevelEnabled: bevel > 0,
            bevelThickness: bevel,
            bevelSize: bevel,
            bevelSegments: 3,
            curveSegments: 24,
          });
        },
        merge: list =>
          mergeGeometries(
            list.map(g => (g.index ? g.toNonIndexed() : g)),
            false
          ),
        at: (geo, pos = [0, 0, 0], rot = [0, 0, 0], scl = 1) => {
          const g = geo.clone();
          const m = new THREE.Matrix4().compose(
            new THREE.Vector3(pos[0], pos[1], pos[2]),
            new THREE.Quaternion().setFromEuler(
              new THREE.Euler(rot[0], rot[1], rot[2])
            ),
            typeof scl === "number"
              ? new THREE.Vector3(scl, scl, scl)
              : new THREE.Vector3(scl[0], scl[1], scl[2])
          );
          g.applyMatrix4(m);
          return g;
        },
      };
      const BW = 0.9,
        BD = 0.6,
        BH = 0.05;
      const boardTex = canvasTex(
        TXS * 2,
        Math.round(TXS * 2 * (BD / BW)),
        (g, w, h) => {
          const R = mulberry32(49374);
          const gr = g.createLinearGradient(0, 0, w, h);
          gr.addColorStop(0, "#0f2a4c");
          gr.addColorStop(1, "#0a1d36");
          g.fillStyle = gr;
          g.fillRect(0, 0, w, h);
          g.strokeStyle = "#1a3d6b";
          g.lineWidth = w * 35e-4;
          g.lineCap = "round";
          for (let i = 0; i < 90; i++) {
            let x = w * 0.5 + (R() - 0.5) * w * 0.25,
              y = h * 0.5 + (R() - 0.5) * h * 0.25;
            g.beginPath();
            g.moveTo(x, y);
            for (let k = 0; k < 3; k++) {
              const a = ((R() * 8) | 0) * (Math.PI / 4),
                L = (0.06 + R() * 0.22) * w;
              x = Math.max(w * 0.04, Math.min(w * 0.96, x + Math.cos(a) * L));
              y = Math.max(h * 0.05, Math.min(h * 0.95, y + Math.sin(a) * L));
              g.lineTo(x, y);
            }
            g.stroke();
          }
          g.fillStyle = "#d9b25c";
          for (let i = 0; i < 26; i++) {
            const x = w * (0.02 + (i / 25) * 0.96);
            g.fillRect(x - w * 8e-3, 0, w * 0.016, h * 0.03);
            g.fillRect(x - w * 8e-3, h * 0.97, w * 0.016, h * 0.03);
          }
          for (let i = 0; i < 180; i++) {
            g.beginPath();
            g.arc(R() * w, R() * h, w * 26e-4, 0, TAU);
            g.fill();
          }
          g.strokeStyle = "rgba(230, 238, 250, 0.55)";
          g.lineWidth = w * 22e-4;
          g.strokeRect(w * 0.36, h * 0.3, w * 0.28, h * 0.4);
          g.strokeRect(w * 0.08, h * 0.16, w * 0.16, h * 0.24);
          g.strokeRect(w * 0.08, h * 0.6, w * 0.16, h * 0.24);
          g.strokeRect(w * 0.74, h * 0.2, w * 0.16, h * 0.18);
        }
      );
      const boardEmit = canvasTex(
        TXS,
        Math.round(TXS * (BD / BW)),
        (g, w, h) => {
          const R = mulberry32(49374);
          g.fillStyle = "#000";
          g.fillRect(0, 0, w, h);
          g.strokeStyle = "rgba(249, 115, 22, 0.9)";
          g.lineWidth = w * 3e-3;
          for (let i = 0; i < 90; i++) {
            let x = w * 0.5 + (R() - 0.5) * w * 0.25,
              y = h * 0.5 + (R() - 0.5) * h * 0.25;
            g.beginPath();
            g.moveTo(x, y);
            for (let k = 0; k < 3; k++) {
              const a = ((R() * 8) | 0) * (Math.PI / 4),
                L = (0.06 + R() * 0.22) * w;
              x = Math.max(w * 0.04, Math.min(w * 0.96, x + Math.cos(a) * L));
              y = Math.max(h * 0.05, Math.min(h * 0.95, y + Math.sin(a) * L));
              g.lineTo(x, y);
            }
            if (R() < 0.45) g.stroke();
          }
        }
      );
      const boardMat = new THREE.MeshPhysicalMaterial({
        map: boardTex,
        emissive: 16777215,
        emissiveMap: boardEmit,
        emissiveIntensity: 0.35,
        roughness: 0.4,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
      });
      const boardEdgeMat = new THREE.MeshStandardMaterial({
        color: 793648,
        roughness: 0.6,
        metalness: 0.2,
      });
      function buildBoard() {
        const g = new THREE.Group();
        const pcb = new THREE.Mesh(new THREE.BoxGeometry(BW, BH, BD), [
          boardEdgeMat,
          boardEdgeMat,
          boardMat,
          boardEdgeMat,
          boardEdgeMat,
          boardEdgeMat,
        ]);
        g.add(pcb);
        const epoxy = MAT.plastic(1053464, 0.62);
        const cpu = new THREE.Mesh(GEO.rbox(0.25, 0.04, 0.24, 8e-3), epoxy);
        cpu.position.set(0, BH / 2 + 0.02, 0);
        g.add(cpu);
        const dieMat = new THREE.MeshPhysicalMaterial({
          color: 1778496,
          metalness: 0.7,
          roughness: 0.18,
          iridescence: 1,
          iridescenceIOR: 1.8,
          iridescenceThicknessRange: [200, 600],
          clearcoat: 1,
        });
        const dieTop = new THREE.Mesh(
          GEO.rbox(0.15, 0.012, 0.14, 4e-3),
          dieMat
        );
        dieTop.position.set(0, BH / 2 + 0.046, 0);
        g.add(dieTop);
        const mem = new THREE.Mesh(
          GEO.merge([
            GEO.at(GEO.rbox(0.14, 0.03, 0.2, 6e-3), [
              -0.3,
              BH / 2 + 0.015,
              -0.1,
            ]),
            GEO.at(GEO.rbox(0.14, 0.03, 0.2, 6e-3), [
              -0.3,
              BH / 2 + 0.015,
              0.14,
            ]),
          ]),
          epoxy
        );
        g.add(mem);
        const can = new THREE.Mesh(
          GEO.rbox(0.13, 0.03, 0.11, 0.01),
          MAT.steel(0.35)
        );
        can.position.set(0.3, BH / 2 + 0.015, -0.1);
        g.add(can);
        const pas = [];
        const R = mulberry32(48879);
        for (let i = 0; i < 46; i++) {
          const x = (R() - 0.5) * BW * 0.86,
            z = (R() - 0.5) * BD * 0.8;
          if (Math.abs(x) < 0.17 && Math.abs(z) < 0.16) continue;
          if (x < -0.2 && Math.abs(z) < 0.28) continue;
          pas.push(
            GEO.at(
              GEO.rbox(0.028, 0.014, 0.016, 3e-3, 1),
              [x, BH / 2 + 7e-3, z],
              [0, R() < 0.5 ? 0 : Math.PI / 2, 0]
            )
          );
        }
        g.add(new THREE.Mesh(GEO.merge(pas), MAT.ceramic(9071178)));
        const pads = [];
        for (let i = 0; i < 26; i++) {
          const x = -BW / 2 + 0.02 + (i / 25) * (BW - 0.04);
          pads.push(
            GEO.at(GEO.cyl(9e-3, 9e-3, BH + 2e-3, 12), [x, 0, BD / 2]),
            GEO.at(GEO.cyl(9e-3, 9e-3, BH + 2e-3, 12), [x, 0, -BD / 2])
          );
        }
        g.add(new THREE.Mesh(GEO.merge(pads), MAT.gold()));
        const led = new THREE.Mesh(
          GEO.rbox(0.03, 0.012, 0.02, 4e-3, 1),
          MAT.led(16486972, 4)
        );
        led.position.set(0.34, BH / 2 + 6e-3, 0.2);
        g.add(led);
        g.traverse(c => {
          if (c.isMesh) {
            c.castShadow = true;
            c.receiveShadow = true;
          }
        });
        return { g, led, dieMat };
      }
      const DEVICES = {};
      const PED_TOP = 0.24;
      function device(id) {
        const root2 = new THREE.Group();
        const spin = new THREE.Group();
        const body = new THREE.Group();
        root2.add(spin);
        spin.add(body);
        const d = {
          id,
          root: root2,
          spin,
          body,
          parts: [],
          xrayMats: [],
          labels: [],
          anims: [],
          edgeMeshes: [],
          slotSpec: { pos: [0, 0.35, 0], rot: [0, 0, 0], scale: 1 },
          frameSpec: {
            dist: 4.4,
            height: 1.65,
            targetY: 0.75,
            fov: 32,
            yaw0: -0.5,
            yaw1: 0.42,
          },
          footR: 1.25,
        };
        d.part = (obj, mat, o = {}) => {
          const m = obj && obj.isObject3D ? obj : new THREE.Mesh(obj, mat);
          if (o.pos) m.position.set(o.pos[0], o.pos[1], o.pos[2]);
          if (o.rot) m.rotation.set(o.rot[0], o.rot[1], o.rot[2]);
          if (o.scale !== void 0) {
            if (typeof o.scale === "number") m.scale.setScalar(o.scale);
            else m.scale.set(o.scale[0], o.scale[1], o.scale[2]);
          }
          m.traverse(c => {
            if (c.isMesh) {
              c.castShadow = o.cast !== false;
              c.receiveShadow = o.receive !== false;
            }
          });
          (o.parent || body).add(m);
          if (o.edge) d.edgeMeshes.push(m);
          if (o.static) return m;
          d.parts.push({
            m,
            hp: m.position.clone(),
            hq: m.quaternion.clone(),
            from: new THREE.Vector3(...(o.from || [0, 0.9, 0])),
            fq: new THREE.Quaternion().setFromEuler(
              new THREE.Euler(...(o.spin || [0, 0, 0]))
            ),
            delay: o.delay,
            sq: new THREE.Quaternion(),
          });
          return m;
        };
        d.xray = mat => {
          mat.transparent = true;
          mat.userData.base = mat.opacity;
          mat.userData.env = mat.envMapIntensity ?? 1;
          mat.userData.color = mat.color ? mat.color.clone() : null;
          mat.userData.metal = mat.metalness ?? 0;
          mat.userData.rough = mat.roughness ?? 0.5;
          mat.userData.em = mat.emissive ? mat.emissive.clone() : null;
          d.xrayMats.push(mat);
          return mat;
        };
        d.slot = o => Object.assign(d.slotSpec, o);
        d.label = (html, color, pos, when = [0.46, 0.8]) =>
          d.labels.push({
            html,
            color,
            pos: new THREE.Vector3(pos[0], pos[1], pos[2]),
            when,
          });
        d.anim = fn => d.anims.push(fn);
        d.frame = o => Object.assign(d.frameSpec, o);
        d.footprint = r => (d.footR = r);
        return d;
      }
      function finalizeDevice(d) {
        const n = d.parts.length;
        d.parts.forEach((r, i) => {
          if (r.delay === void 0) r.delay = n > 1 ? i / (n - 1) : 0;
          r.sq.copy(r.hq).multiply(r.fq);
        });
        d.body.updateMatrixWorld(true);
        const inv = new THREE.Matrix4().copy(d.body.matrixWorld).invert();
        const geos = [];
        d.edgeMeshes.forEach(m => {
          m.traverse(c => {
            if (!c.isMesh) return;
            c.updateMatrixWorld(true);
            const eg = new THREE.EdgesGeometry(c.geometry, 28);
            eg.applyMatrix4(
              new THREE.Matrix4().multiplyMatrices(inv, c.matrixWorld)
            );
            geos.push(eg);
          });
        });
        d.edgeMat = glowLine(HDR(3718648, 1.3), 0);
        if (geos.length) {
          d.edgeLines = new THREE.LineSegments(
            mergeGeometries(geos),
            d.edgeMat
          );
          d.body.add(d.edgeLines);
        }
        d.lastA = -1;
        return d;
      }
      function poseDevice(d, a) {
        if (Math.abs(a - d.lastA) < 1e-4) return;
        d.lastA = a;
        for (const r of d.parts) {
          const t = clamp01((a - r.delay * 0.52) / 0.48);
          const e = easeInOut(t);
          r.m.position.copy(r.hp).addScaledVector(r.from, 1 - e);
          r.m.quaternion.slerpQuaternions(r.sq, r.hq, e);
        }
      }
      DEVICES.eaerospace = () => {
        const d = device("eaerospace");
        const ACC = 2282478;
        const BY = 0.66;
        d.slot({ pos: [0, BY - 0.01, 0], rot: [0, 0, 0], scale: 0.46 });
        const carbon = MAT.carbon();
        const dark = MAT.anod(1448740, 0.45);
        const steel = MAT.steel(0.3);
        const lower = d.xray(MAT.gloss(13225686));
        d.part(GEO.rbox(0.66, 0.1, 0.5, 0.06), lower, {
          pos: [0, BY - 0.07, 0],
          from: [0, -0.3, 0],
          delay: 0,
          edge: true,
        });
        const arms = [],
          pods = [],
          bells = [],
          ledsF = [],
          ledsR = [];
        const MOT = [
          [0.62, 0.62],
          [-0.62, 0.62],
          [0.62, -0.62],
          [-0.62, -0.62],
        ];
        MOT.forEach(([x, z]) => {
          const len = Math.hypot(x, z) - 0.2;
          const ang = Math.atan2(z, x);
          const mid = [
            Math.cos(ang) * (0.2 + len / 2),
            BY,
            Math.sin(ang) * (0.2 + len / 2),
          ];
          arms.push(
            GEO.at(GEO.cyl(0.032, 0.032, len, 18), mid, [0, -ang, Math.PI / 2])
          );
          pods.push(GEO.at(GEO.cyl(0.085, 0.095, 0.1, 28), [x, BY + 0.01, z]));
          bells.push(
            GEO.at(GEO.cyl(0.075, 0.082, 0.055, 28), [x, BY + 0.085, z])
          );
          (z > 0 ? ledsF : ledsR).push(
            GEO.at(GEO.rbox(0.05, 0.02, 0.03, 8e-3, 1), [
              x * 1.12,
              BY - 0.04,
              z * 1.12,
            ])
          );
        });
        d.part(GEO.merge(arms), carbon, { from: [0, 0.4, 0], delay: 0.2 });
        d.part(GEO.merge(pods), dark, { from: [0, 0.55, 0], delay: 0.32 });
        d.part(GEO.merge(bells), MAT.alu(10134445, 0.45), {
          from: [0, 0.7, 0],
          delay: 0.4,
        });
        d.part(GEO.merge(ledsF), MAT.led(ACC, 3), {
          from: [0, 0.55, 0],
          delay: 0.34,
          cast: false,
        });
        d.part(GEO.merge(ledsR), MAT.led(16728128, 2.6), {
          from: [0, 0.55, 0],
          delay: 0.34,
          cast: false,
        });
        const legs = [];
        [-1, 1].forEach(sx => {
          legs.push(
            GEO.tube(
              [
                [sx * 0.16, BY - 0.12, 0.14],
                [sx * 0.24, 0.3, 0.17],
                [sx * 0.34, 0.05, 0.19],
              ],
              0.016,
              20,
              8
            )
          );
          legs.push(
            GEO.tube(
              [
                [sx * 0.16, BY - 0.12, -0.14],
                [sx * 0.24, 0.3, -0.17],
                [sx * 0.34, 0.05, -0.19],
              ],
              0.016,
              20,
              8
            )
          );
        });
        d.part(GEO.merge(legs), carbon, { from: [0, -0.35, 0], delay: 0.1 });
        d.part(
          GEO.merge([
            GEO.at(
              GEO.cyl(0.026, 0.026, 0.62, 14),
              [0.34, 0.05, 0],
              [Math.PI / 2, 0, 0]
            ),
            GEO.at(
              GEO.cyl(0.026, 0.026, 0.62, 14),
              [-0.34, 0.05, 0],
              [Math.PI / 2, 0, 0]
            ),
          ]),
          MAT.rubber(1382171),
          { from: [0, -0.35, 0], delay: 0.12 }
        );
        d.part(
          GEO.merge([
            GEO.at(GEO.rbox(0.24, 0.12, 0.2, 0.03), [0, BY - 0.24, 0.02]),
            GEO.at(GEO.cyl(0.05, 0.05, 0.1, 16), [0, BY - 0.15, 0.02]),
          ]),
          dark,
          { from: [0, -0.5, 0], delay: 0.5 }
        );
        const props = [];
        const bladeMat = MAT.plastic(1711395, 0.4);
        const bladeGeo = GEO.merge([
          GEO.at(
            GEO.rbox(0.4, 8e-3, 0.06, 4e-3, 1),
            [0.22, 0, 0],
            [0.12, 0, 0]
          ),
          GEO.at(
            GEO.rbox(0.4, 8e-3, 0.06, 4e-3, 1),
            [-0.22, 0, 0],
            [-0.12, 0, 0]
          ),
          GEO.at(GEO.cyl(0.03, 0.03, 0.03, 16), [0, 0, 0]),
        ]);
        const blurTex = canvasTex(256, 256, (g, w, h) => {
          const r = w / 2;
          const grd = g.createRadialGradient(r, r, 0, r, r, r);
          grd.addColorStop(0, "rgba(0,0,0,0)");
          grd.addColorStop(0.25, "rgba(160,190,215,0.05)");
          grd.addColorStop(0.78, "rgba(200,225,245,0.42)");
          grd.addColorStop(0.9, "rgba(220,235,250,0.55)");
          grd.addColorStop(1, "rgba(0,0,0,0)");
          g.fillStyle = "#000";
          g.fillRect(0, 0, w, h);
          g.fillStyle = grd;
          g.beginPath();
          g.arc(r, r, r, 0, Math.PI * 2);
          g.fill();
        });
        const blurMat = new THREE.MeshBasicMaterial({
          map: blurTex,
          color: 16777215,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        });
        const blurGeo = new THREE.RingGeometry(0.04, 0.42, 48).rotateX(
          -Math.PI / 2
        );
        MOT.forEach(([x, z], k) => {
          const g = new THREE.Group();
          g.add(new THREE.Mesh(bladeGeo, bladeMat));
          const blur = new THREE.Mesh(blurGeo, blurMat);
          g.add(blur);
          d.part(g, null, {
            pos: [x, BY + 0.125, z],
            from: [0, 0.9, 0],
            spin: [0, 2.5, 0],
            delay: 0.7 + k * 0.02,
            cast: true,
          });
          props.push({ g, dir: k % 3 === 0 ? 1 : -1, ang: k });
        });
        const top = d.xray(MAT.gloss(14672873));
        d.part(GEO.rbox(0.56, 0.12, 0.44, 0.08), top, {
          pos: [0, BY + 0.06, 0],
          from: [0, 0.9, 0],
          delay: 0.86,
          edge: true,
        });
        d.part(
          GEO.rbox(0.5, 0.012, 0.03, 6e-3),
          d.xray(MAT.emissive(ACC, 1.8, 201752)),
          { pos: [0, BY + 0.06, 0.225], from: [0, 0.9, 0], delay: 0.88 }
        );
        d.label(
          "eMR-400 · <em>multirotor inspection drone</em>",
          "#22D3EE",
          [0, BY + 0.45, 0],
          [0.46, 0.8]
        );
        d.label(
          "Core board · <em>EoS runs here</em>",
          "#22D3EE",
          [0.18, BY + 0.02, 0.18],
          [0.5, 0.8]
        );
        d.label(
          "Payload · <em>1 kg design target</em>",
          "#67E8F9",
          [0.14, BY - 0.26, 0.12],
          [0.54, 0.8]
        );
        d.label(
          "Design targets · <em>45 min · 10 km</em>",
          "#22D3EE",
          [-0.7, BY + 0.2, 0.62],
          [0.58, 0.8]
        );
        let spin = 0;
        d.anim((p, time, dt, env) => {
          const target = env.hero * (1 - env.fin);
          spin = lerp(spin, target, 1 - Math.exp(-dt * 3));
          const step = (spin * 38 + 0.15) * dt;
          for (const pr of props) {
            pr.ang += step * pr.dir;
            pr.g.children[0].rotation.y = pr.ang;
          }
          blurMat.opacity = spin * 0.55;
        });
        d.frame({
          dist: 3.9,
          height: 1.75,
          targetY: 0.58,
          fov: 32,
          yaw0: -0.55,
          yaw1: 0.4,
        });
        d.footprint(1.25);
        return d;
      };
      DEVICES.eagritech = () => {
        const d = device("eagritech");
        const TW = Math.PI * 2;
        const HEAD = 0.5;
        const rig = new THREE.Group();
        rig.rotation.y = HEAD;
        d.body.add(rig);
        const cH = Math.cos(HEAD),
          sH = Math.sin(HEAD);
        const toBody = (x, y, z) => [x * cH + z * sH, y, -x * sH + z * cH];
        const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
        const BOX_Z = -0.4,
          BW2 = 0.76,
          BL = 0.74;
        d.slot({ pos: toBody(0, 0.99, BOX_Z), rot: [0, HEAD, 0], scale: 0.7 });
        const paint = MAT.gloss(679749);
        paint.roughness = 0.4;
        paint.clearcoatRoughness = 0.22;
        const rubber = MAT.rubber(1250327);
        const rimMat = MAT.anod(9344415, 0.5);
        const iron = MAT.blackMetal(0.52);
        const trim = MAT.anod(2764856, 0.48);
        const black = MAT.plastic(658448, 0.5);
        const lamp = MAT.led(15135487, 1.5);
        const glow = MAT.led(1096065, 2);
        const lidMat = d.xray(MAT.anod(1778220, 0.42));
        const steel = MAT.steel(0.45);
        const radome = MAT.ceramic(15197663);
        radome.roughness = 0.5;
        radome.clearcoat = 0.3;
        const alu = MAT.alu(11450048, 0.46);
        const lens = MAT.gloss(395276);
        const amber = MAT.led(16096779, 2.4);
        const basisAt = (geo, u, n, w, p) =>
          geo
            .clone()
            .applyMatrix4(
              new THREE.Matrix4().makeBasis(u, n, w).setPosition(p)
            );
        const sideX = (pts, depth, bevel) =>
          GEO.extrude(pts, depth, bevel)
            .rotateY(-Math.PI / 2)
            .translate(depth / 2, 0, 0);
        const rrect = (w, h, r, n = 5) => {
          const pts = [];
          const cs = [
            [w / 2 - r, h / 2 - r, 0],
            [-w / 2 + r, h / 2 - r, Math.PI / 2],
            [-w / 2 + r, -h / 2 + r, Math.PI],
            [w / 2 - r, -h / 2 + r, Math.PI * 1.5],
          ];
          for (const [cx, cy, a0] of cs)
            for (let i = 0; i <= n; i++) {
              const a = a0 + (i / n) * (Math.PI / 2);
              pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
            }
          return pts;
        };
        const v2 = pts => pts.map(([x, y]) => new THREE.Vector2(x, y));
        const ringGeo = (w, h, r, t, depth, bevel) => {
          const s = new THREE.Shape(v2(rrect(w, h, r)));
          s.holes.push(
            new THREE.Path(
              v2(rrect(w - 2 * t, h - 2 * t, Math.max(6e-3, r - t)))
            )
          );
          return new THREE.ExtrudeGeometry(s, {
            depth,
            bevelEnabled: bevel > 0,
            bevelThickness: bevel,
            bevelSize: bevel,
            bevelSegments: 2,
            curveSegments: 6,
          });
        };
        const arcPts = (r0, r1, a0, a1, n) => {
          const pts = [];
          for (let i = 0; i <= n; i++) {
            const a = a0 + ((a1 - a0) * i) / n;
            pts.push([Math.cos(a) * r1, Math.sin(a) * r1]);
          }
          for (let i = n; i >= 0; i--) {
            const a = a0 + ((a1 - a0) * i) / n;
            pts.push([Math.cos(a) * r0, Math.sin(a) * r0]);
          }
          return pts;
        };
        function tyreGeo(R, W, rimR, nLug, lugH, lugW) {
          const hw = W / 2;
          const prof = [
            [rimR, -0.82 * hw],
            [rimR + 0.04, -0.98 * hw],
            [R - 0.07, -hw],
            [R - 0.025, -0.99 * hw],
            [R - 4e-3, -0.93 * hw],
            [R, -0.5 * hw],
            [R, 0.5 * hw],
            [R - 4e-3, 0.93 * hw],
            [R - 0.025, 0.99 * hw],
            [R - 0.07, hw],
            [rimR + 0.04, 0.98 * hw],
            [rimR, 0.82 * hw],
          ];
          const list = [GEO.lathe(prof, 36).rotateZ(-Math.PI / 2)];
          const lug = GEO.rbox(
            hw * 1.02,
            lugH,
            lugW,
            Math.min(8e-3, lugH / 2 - 2e-3),
            1
          );
          const beta = 0.55;
          const X = V3(1, 0, 0);
          for (let s = -1; s <= 1; s += 2) {
            for (let k = 0; k < nLug; k++) {
              const th = (k / nLug) * TW + (s > 0 ? Math.PI / nLug : 0);
              const n = V3(0, Math.cos(th), Math.sin(th));
              const t = V3(0, -Math.sin(th), Math.cos(th));
              const u = X.clone()
                .multiplyScalar(s * Math.cos(beta))
                .addScaledVector(t, -Math.sin(beta));
              const w = u.clone().cross(n);
              const p = V3(s * hw * 0.5, 0, 0).addScaledVector(
                n,
                R + lugH / 2 - 6e-3
              );
              list.push(basisAt(lug, u, n, w, p));
            }
          }
          return GEO.merge(list);
        }
        function rimGeo(rimR, W, hubR, nNut) {
          const hw = W / 2;
          const prof = [
            [rimR + 0.012, 0.78 * hw],
            [rimR - 0.012, 0.86 * hw],
            [rimR * 0.8, 0.55 * hw],
            [rimR * 0.62, 0.5 * hw],
            [hubR + 0.02, 0.5 * hw],
            [hubR, 0.7 * hw],
            [hubR * 0.55, 0.78 * hw],
            [1e-3, 0.8 * hw],
          ];
          const list = [GEO.lathe(prof, 36).rotateZ(-Math.PI / 2)];
          const nut = GEO.cyl(0.016, 0.016, 0.03, 6).rotateZ(Math.PI / 2);
          for (let k = 0; k < nNut; k++) {
            const a = (k / nNut) * TW;
            list.push(
              GEO.at(nut, [
                0.72 * hw,
                Math.cos(a) * hubR * 0.72,
                Math.sin(a) * hubR * 0.72,
              ])
            );
          }
          return GEO.merge(list);
        }
        const ch = [
          GEO.at(GEO.rbox(0.09, 0.12, 1.12, 0.025, 2), [-0.14, 0.34, 0.42]),
          GEO.at(GEO.rbox(0.09, 0.12, 1.12, 0.025, 2), [0.14, 0.34, 0.42]),
          GEO.at(GEO.rbox(0.36, 0.2, 0.8, 0.05, 2), [0, 0.37, 0.46]),
          GEO.at(GEO.rbox(0.9, 0.08, 0.11, 0.03, 2), [0, 0.31, 0.64]),
          GEO.at(
            GEO.cyl(0.05, 0.05, 0.16, 16),
            [0, 0.35, 0.64],
            [Math.PI / 2, 0, 0]
          ),
          GEO.at(
            GEO.cyl(0.075, 0.075, 0.9, 20),
            [0, 0.49, -0.42],
            [0, 0, Math.PI / 2]
          ),
          GEO.at(
            GEO.cyl(0.12, 0.12, 0.05, 24),
            [-0.42, 0.49, -0.42],
            [0, 0, Math.PI / 2]
          ),
          GEO.at(
            GEO.cyl(0.12, 0.12, 0.05, 24),
            [0.42, 0.49, -0.42],
            [0, 0, Math.PI / 2]
          ),
          GEO.at(GEO.rbox(0.44, 0.4, 0.62, 0.06, 2), [0, 0.47, -0.36]),
          GEO.at(GEO.rbox(0.8, 0.04, 0.62, 0.015, 2), [0, 0.79, -0.42]),
          GEO.at(GEO.rbox(0.44, 0.12, 0.34, 0.03, 2), [0, 0.87, BOX_Z]),
          GEO.at(GEO.rbox(BW2, 0.03, BL, 0.02, 2), [0, 0.935, BOX_Z]),
          GEO.at(
            GEO.rbox(0.045, 0.045, 0.4, 0.015, 1),
            [-0.19, 0.31, -0.8],
            [-0.28, 0, 0]
          ),
          GEO.at(
            GEO.rbox(0.045, 0.045, 0.4, 0.015, 1),
            [0.19, 0.31, -0.8],
            [-0.28, 0, 0]
          ),
          GEO.at(
            GEO.rbox(0.05, 0.05, 0.34, 0.015, 1),
            [0, 0.6, -0.8],
            [-0.35, 0, 0]
          ),
          GEO.at(
            GEO.cyl(0.022, 0.022, 0.52, 10),
            [0, 0.25, -0.98],
            [0, 0, Math.PI / 2]
          ),
          GEO.at(
            GEO.cyl(0.035, 0.035, 0.14, 12),
            [0, 0.42, -0.72],
            [Math.PI / 2, 0, 0]
          ),
        ];
        for (const [x, z] of [
          [-0.27, -0.17],
          [0.27, -0.17],
          [-0.27, 0.17],
          [0.27, 0.17],
        ])
          ch.push(
            GEO.at(GEO.cyl(0.012, 0.012, 0.03, 8), [x, 0.962, BOX_Z + z])
          );
        d.part(GEO.merge(ch), iron, {
          parent: rig,
          from: [0, 0, -1.25],
          delay: 0,
        });
        const rollers = [],
          steers = [];
        const rearTyre = tyreGeo(0.455, 0.3, 0.27, 20, 0.035, 0.034);
        const rearRim = rimGeo(0.27, 0.3, 0.1, 8);
        const frontTyre = tyreGeo(0.285, 0.2, 0.17, 14, 0.025, 0.026);
        const frontRim = rimGeo(0.17, 0.2, 0.07, 6);
        function wheel(side, pos, tg, rg, R, front, delay) {
          const part = new THREE.Group();
          let holder = part;
          if (front) {
            const st = new THREE.Group();
            part.add(st);
            holder = st;
            steers.push(st);
          }
          const roll = new THREE.Group();
          holder.add(roll);
          const inner = new THREE.Group();
          inner.rotation.z = side < 0 ? Math.PI : 0;
          roll.add(inner);
          inner.add(new THREE.Mesh(tg, rubber), new THREE.Mesh(rg, rimMat));
          rollers.push({ roll, R });
          d.part(part, null, {
            parent: rig,
            pos,
            from: [side * 0.95, 0.05, 0],
            spin: [2.4, 0, 0],
            delay,
          });
        }
        wheel(-1, [-0.56, 0.49, -0.42], rearTyre, rearRim, 0.49, false, 0.14);
        wheel(1, [0.56, 0.49, -0.42], rearTyre, rearRim, 0.49, false, 0.18);
        wheel(-1, [-0.5, 0.31, 0.64], frontTyre, frontRim, 0.31, true, 0.24);
        wheel(1, [0.5, 0.31, 0.64], frontTyre, frontRim, 0.31, true, 0.28);
        const bonnet = d.part(
          sideX(
            [
              [-0.06, 0.42],
              [0.9, 0.42],
              [0.95, 0.47],
              [0.95, 0.7],
              [0.87, 0.8],
              [-0.06, 0.84],
            ],
            0.5,
            0.035
          ),
          paint,
          { parent: rig, from: [0, 0.75, 0.35], delay: 0.36, edge: true }
        );
        const grille = [
          GEO.at(GEO.rbox(0.38, 0.2, 0.03, 0.012), [0, 0.54, 0.98]),
        ];
        for (let i = 0; i < 4; i++)
          for (const s of [-1, 1])
            grille.push(
              GEO.at(GEO.rbox(0.014, 0.028, 0.16, 6e-3, 1), [
                s * 0.286,
                0.56 + i * 0.05,
                0.64,
              ])
            );
        d.part(GEO.merge(grille), black, { parent: bonnet, static: true });
        const bars = [
          GEO.at(GEO.rbox(0.15, 0.07, 0.03, 0.02), [-0.16, 0.69, 0.985]),
          GEO.at(GEO.rbox(0.15, 0.07, 0.03, 0.02), [0.16, 0.69, 0.985]),
        ];
        for (let i = 0; i < 5; i++)
          bars.push(
            GEO.at(GEO.rbox(0.36, 0.012, 0.02, 5e-3, 1), [
              0,
              0.46 + i * 0.037,
              0.998,
            ])
          );
        d.part(GEO.merge(bars), trim, { parent: bonnet, static: true });
        d.part(
          GEO.merge([
            GEO.at(GEO.rbox(0.12, 0.04, 0.02, 0.012), [-0.16, 0.69, 0.997]),
            GEO.at(GEO.rbox(0.12, 0.04, 0.02, 0.012), [0.16, 0.69, 0.997]),
          ]),
          lamp,
          { parent: bonnet, static: true }
        );
        d.part(
          GEO.merge([
            GEO.at(GEO.rbox(0.36, 0.012, 0.012, 4e-3, 1), [0, 0.64, 0.995]),
            GEO.at(GEO.rbox(0.012, 0.012, 0.74, 4e-3, 1), [-0.288, 0.76, 0.42]),
            GEO.at(GEO.rbox(0.012, 0.012, 0.74, 4e-3, 1), [0.288, 0.76, 0.42]),
          ]),
          glow,
          { parent: bonnet, static: true }
        );
        const fGeo = sideX(
          arcPts(0.53, 0.57, 0.3, Math.PI - 0.12, 22),
          0.3,
          0.012
        );
        const fenders = d.part(
          GEO.merge([
            GEO.at(fGeo, [-0.56, 0.49, -0.42]),
            GEO.at(fGeo, [0.56, 0.49, -0.42]),
          ]),
          paint,
          { parent: rig, from: [0, 0.8, 0], delay: 0.46, edge: true }
        );
        const edgeArc = [];
        for (let i = 0; i <= 18; i++) {
          const a = 0.3 + ((Math.PI - 0.42) * i) / 18;
          edgeArc.push([
            0,
            0.49 + Math.sin(a) * 0.577,
            -0.42 + Math.cos(a) * 0.577,
          ]);
        }
        const trimArc = GEO.tube(edgeArc, 0.011, 36, 6);
        d.part(
          GEO.merge(
            [-0.716, -0.404, 0.404, 0.716].map(x => GEO.at(trimArc, [x, 0, 0]))
          ),
          rubber,
          { parent: fenders, static: true }
        );
        const lidar = new THREE.Group();
        lidar.add(
          new THREE.Mesh(
            GEO.rbox(0.11, 0.05, 0.11, 0.018, 2).translate(0, 0.863, 0.8),
            iron
          )
        );
        lidar.add(
          new THREE.Mesh(
            GEO.merge([
              GEO.at(GEO.cyl(0.085, 0.09, 0.035, 32), [0, 0.905, 0.8]),
              GEO.at(GEO.cyl(0.082, 0.086, 0.03, 32), [0, 1, 0.8]),
            ]),
            alu
          )
        );
        lidar.add(
          new THREE.Mesh(
            GEO.at(GEO.cyl(0.079, 0.079, 0.06, 32, true), [0, 0.9525, 0.8]),
            lens
          )
        );
        const scan = new THREE.Group();
        scan.position.set(0, 0.9525, 0.8);
        scan.add(
          new THREE.Mesh(
            GEO.rbox(0.016, 0.05, 4e-3, 15e-4, 1).translate(0, 0, 0.081),
            glow
          )
        );
        lidar.add(scan);
        d.part(lidar, null, { parent: rig, from: [0, 0.5, 0.45], delay: 0.56 });
        const lid = d.part(
          GEO.merge([
            ringGeo(BW2, BL, 0.08, 0.022, 0.2, 6e-3)
              .rotateX(-Math.PI / 2)
              .translate(0, 0.955, 0),
            GEO.extrude(rrect(BW2, BL, 0.08), 0.024, 0.012)
              .rotateX(-Math.PI / 2)
              .translate(0, 1.155, 0),
          ]),
          lidMat,
          {
            parent: rig,
            pos: [0, 0, BOX_Z],
            from: [0, 0.75, 0],
            delay: 0.66,
            edge: true,
          }
        );
        d.part(
          ringGeo(BW2 + 0.025, BL + 0.025, 0.085, 0.012, 0.01, 0)
            .rotateX(-Math.PI / 2)
            .translate(0, 0.952, 0),
          glow,
          { parent: lid, static: true }
        );
        const domeGeo = GEO.lathe(
          [
            [0.03, 0],
            [0.031, 0.03],
            [0.022, 0.05],
            [1e-3, 0.056],
          ],
          16
        );
        const beacons = new THREE.Group();
        beacons.add(
          new THREE.Mesh(
            GEO.merge([
              GEO.at(GEO.cyl(0.036, 0.042, 0.025, 16), [-0.29, 1.2, -0.12]),
              GEO.at(GEO.cyl(0.036, 0.042, 0.025, 16), [0.29, 1.2, -0.12]),
            ]),
            iron
          )
        );
        beacons.add(
          new THREE.Mesh(
            GEO.merge([
              GEO.at(domeGeo, [-0.29, 1.212, -0.12]),
              GEO.at(domeGeo, [0.29, 1.212, -0.12]),
            ]),
            amber
          )
        );
        d.part(beacons, null, { parent: rig, from: [0, 0.45, 0], delay: 0.84 });
        const mast = new THREE.Group();
        mast.add(
          new THREE.Mesh(
            GEO.merge([
              GEO.at(GEO.cyl(0.034, 0.04, 0.03, 16), [0, 1.205, -0.66]),
              GEO.at(GEO.cyl(0.016, 0.018, 0.56, 12), [0, 1.49, -0.66]),
              GEO.at(GEO.cyl(0.03, 0.03, 0.03, 16), [0, 1.765, -0.66]),
            ]),
            steel
          )
        );
        mast.add(
          new THREE.Mesh(
            GEO.at(
              GEO.lathe(
                [
                  [1e-3, 0],
                  [0.105, 0],
                  [0.11, 0.014],
                  [0.104, 0.03],
                  [0.075, 0.058],
                  [0.036, 0.07],
                  [1e-3, 0.074],
                ],
                32
              ),
              [0, 1.78, -0.66]
            ),
            radome
          )
        );
        d.part(mast, null, { parent: rig, from: [0, 0.55, 0], delay: 0.78 });
        d.part(
          GEO.merge([
            GEO.at(GEO.rbox(0.72, 0.12, 0.1, 0.04), [0, 0.43, 1.05]),
            GEO.at(GEO.rbox(0.07, 0.09, 0.14, 0.02, 2), [-0.2, 0.43, 0.96]),
            GEO.at(GEO.rbox(0.07, 0.09, 0.14, 0.02, 2), [0.2, 0.43, 0.96]),
          ]),
          trim,
          { parent: rig, from: [0, 0, 0.6], delay: 0.92 }
        );
        d.label(
          "eAgri-Tractor · <em>autonomous tractor</em>",
          "#10B981",
          toBody(0.2, 1.2, -0.14),
          [0.46, 0.8]
        );
        d.label(
          "RTK GPS · <em>navigation</em>",
          "#10B981",
          toBody(0, 1.86, -0.66),
          [0.46, 0.8]
        );
        d.label(
          "LiDAR · <em>navigation</em>",
          "#6EE7B7",
          toBody(0, 1.02, 0.8),
          [0.47, 0.8]
        );
        d.label(
          "Design speed · <em>3 m/s</em>",
          "#10B981",
          toBody(-0.74, 0.49, -0.42),
          [0.47, 0.8]
        );
        const amberC = new THREE.Color(16096779);
        let lastGo = -1;
        d.anim((p, time, dt, env) => {
          const go = env.fin > 0.5 ? 1 : sr(p, 0.02, 0.95);
          if (Math.abs(go - lastGo) > 1e-5) {
            lastGo = go;
            for (const w of rollers) w.roll.rotation.x = (go * 0.9) / w.R;
          }
          const st = 0.16 * Math.sin((p - 0.46) * 10) * env.hero;
          steers[0].rotation.y = st;
          steers[1].rotation.y = st;
          scan.rotation.y = time * 3.2;
          amber.color
            .copy(amberC)
            .multiplyScalar(1.1 + 1.6 * Math.max(0, Math.sin(time * 4.2)));
        });
        d.frame({
          dist: 5.6,
          height: 2.4,
          targetY: 0.8,
          fov: 32,
          yaw0: -0.5,
          yaw1: 0.42,
        });
        d.footprint(1.2);
        return d;
      };
      DEVICES.econsumer = () => {
        const d = device("econsumer");
        const PI = Math.PI,
          TAU2 = PI * 2;
        const ACC = 9133302;
        const R = 0.902,
          PZ = -0.66,
          HC = Math.sqrt(R * R - PZ * PZ),
          GAP = Math.asin(HC / R);
        const hub2 = d.part(new THREE.Group(), null, { static: true });
        const SLOT_P = [0, 0.205, 0.07],
          SLOT_S = 1.12;
        d.slot({ pos: SLOT_P, rot: [0, 0, 0], scale: SLOT_S });
        const baseMat = d.xray(MAT.plastic(1382172, 0.5));
        d.part(
          GEO.lathe(
            [
              [0, 6e-3],
              [0.86, 6e-3],
              [0.888, 0.014],
              [0.9, 0.036],
              [0.9, 0.07],
              [0.89, 0.078],
              [0, 0.078],
            ],
            96
          ),
          baseMat,
          { parent: hub2, from: [0, -0.5, 0], delay: 0, edge: true }
        );
        d.part(
          GEO.lathe(
            [
              [0.6, 0],
              [0.8, 0],
              [0.8, 7e-3],
              [0.6, 7e-3],
              [0.6, 0],
            ],
            64
          ),
          MAT.rubber(723983),
          { parent: hub2, from: [0, -0.5, 0], delay: 0 }
        );
        const stand = [];
        for (const sx of [-1, 1])
          for (const sz of [-1, 1])
            stand.push(
              GEO.at(GEO.cyl(0.02, 0.024, 0.1, 10), [
                sx * 0.44,
                0.128,
                SLOT_P[2] + sz * 0.28,
              ])
            );
        d.part(GEO.merge(stand), MAT.steel(0.36), {
          parent: hub2,
          from: [0, -0.4, 0],
          delay: 0.04,
        });
        d.part(
          new THREE.BoxGeometry(1.15, 0.012, 0.3),
          MAT.plastic(1522474, 0.48),
          {
            parent: hub2,
            pos: [0, 0.122, PZ + 0.18],
            from: [0, -0.3, -0.6],
            delay: 0.1,
          }
        );
        const ant = [];
        for (const t0 of [0.2, 1.2, 4.12, 5.18])
          ant.push(
            new THREE.CylinderGeometry(
              0.86,
              0.86,
              0.075,
              16,
              1,
              true,
              t0,
              0.55
            ).translate(0, 0.3, 0)
          );
        const antMat = MAT.copper();
        antMat.side = THREE.DoubleSide;
        d.part(GEO.merge(ant), antMat, {
          parent: hub2,
          from: [0, 0.4, 0],
          delay: 0.14,
        });
        const knit = canvasTex(256, 256, (g, w, h) => {
          const Rn = mulberry32(19229);
          g.fillStyle = "#8a8597";
          g.fillRect(0, 0, w, h);
          for (let x = 0; x < w; x += 8) {
            g.fillStyle = "rgba(0,0,0,0.26)";
            g.fillRect(x, 0, 2, h);
            g.fillStyle = "rgba(255,255,255,0.1)";
            g.fillRect(x + 4, 0, 2, h);
          }
          for (let y = 0; y < h; y += 6) {
            g.fillStyle = "rgba(0,0,0,0.14)";
            g.fillRect(0, y, w, 1.5);
          }
          for (let i = 0; i < 2600; i++) {
            const v = Rn() < 0.5 ? 255 : 0;
            g.fillStyle = `rgba(${v},${v},${v},${(0.05 + Rn() * 0.09).toFixed(3)})`;
            g.fillRect(Rn() * w, Rn() * h, 1 + Rn() * 2, 1 + Rn() * 1.5);
          }
        });
        knit.wrapS = knit.wrapT = THREE.RepeatWrapping;
        knit.repeat.set(18, 1.3);
        const fabric = d.xray(
          new THREE.MeshPhysicalMaterial({
            color: 3947333,
            map: knit,
            bumpMap: knit,
            bumpScale: 1.2,
            roughness: 0.92,
            metalness: 0,
            sheen: 0.8,
            sheenRoughness: 0.5,
            sheenColor: new THREE.Color(7301766),
            side: THREE.DoubleSide,
          })
        );
        d.part(
          new THREE.CylinderGeometry(
            R,
            R,
            0.332,
            128,
            1,
            true,
            PI + GAP,
            TAU2 - 2 * GAP
          ),
          fabric,
          {
            parent: hub2,
            pos: [0, 0.244, 0],
            from: [0, 0.2, 0],
            spin: [0, 1.2, 0],
            delay: 0.5,
            edge: false,
          }
        );
        const panelMat = d.xray(MAT.plastic(1053207, 0.55));
        d.part(GEO.rbox(2 * HC, 0.314, 0.02, 6e-3, 2), panelMat, {
          parent: hub2,
          pos: [0, 0.235, PZ + 0.01],
          from: [0, 0, -0.9],
          delay: 0.3,
        });
        const PY = 0.225,
          FZ = PZ - 4e-3;
        const shells = [],
          holes = [],
          tongues = [];
        const port = (x, w, h, depth, tw, th) => {
          shells.push(
            GEO.at(new THREE.BoxGeometry(w, h, depth), [x, PY, FZ + depth / 2])
          );
          holes.push(
            GEO.at(new THREE.BoxGeometry(w - 0.022, h - 0.022, 4e-3), [
              x,
              PY,
              FZ - 15e-4,
            ])
          );
          if (tw)
            tongues.push(
              GEO.at(new THREE.BoxGeometry(tw, th, 4e-3), [
                x,
                PY + (h - 0.022) * 0.18,
                FZ - 3e-3,
              ])
            );
        };
        port(-0.4, 0.23, 0.19, 0.3, 0, 0);
        holes.push(
          GEO.at(new THREE.BoxGeometry(0.07, 0.03, 4e-3), [
            -0.4,
            PY - 0.095,
            FZ - 15e-4,
          ])
        );
        port(-0.12, 0.18, 0.075, 0.24, 0.13, 0.018);
        port(0.1, 0.18, 0.075, 0.24, 0.13, 0.018);
        shells.push(
          GEO.at(GEO.rbox(0.125, 0.044, 0.12, 0.02, 2), [0.3, PY, FZ + 0.06])
        );
        holes.push(
          GEO.at(GEO.rbox(0.104, 0.024, 6e-3, 0.011, 2), [0.3, PY, FZ - 1e-3])
        );
        tongues.push(
          GEO.at(new THREE.BoxGeometry(0.068, 7e-3, 4e-3), [0.3, PY, FZ - 4e-3])
        );
        shells.push(
          GEO.at(
            GEO.cyl(0.05, 0.05, 0.12, 24),
            [0.47, PY, FZ + 0.06],
            [PI / 2, 0, 0]
          )
        );
        holes.push(
          GEO.at(
            GEO.cyl(0.035, 0.035, 6e-3, 20),
            [0.47, PY, FZ - 1e-3],
            [PI / 2, 0, 0]
          )
        );
        tongues.push(
          GEO.at(
            GEO.cyl(0.011, 0.011, 0.01, 10),
            [0.47, PY, FZ - 3e-3],
            [PI / 2, 0, 0]
          )
        );
        const portSteel = MAT.steel(0.34);
        d.part(GEO.merge(shells), portSteel, {
          parent: hub2,
          from: [0, 0, -0.9],
          delay: 0.3,
        });
        d.part(
          GEO.merge(holes),
          new THREE.MeshBasicMaterial({ color: 131587 }),
          { parent: hub2, from: [0, 0, -0.9], delay: 0.3, cast: false }
        );
        d.part(GEO.merge(tongues), MAT.plastic(2895671, 0.45), {
          parent: hub2,
          from: [0, 0, -0.9],
          delay: 0.3,
          cast: false,
        });
        const pl = GEO.merge([
          GEO.at(new THREE.BoxGeometry(0.03, 0.014, 4e-3), [
            -0.48,
            PY + 0.07,
            FZ - 3e-3,
          ]),
          GEO.at(new THREE.BoxGeometry(0.03, 0.014, 4e-3), [
            -0.32,
            PY + 0.07,
            FZ - 3e-3,
          ]),
        ]);
        const plc = new Float32Array(pl.attributes.position.count * 3),
          half = pl.attributes.position.count / 2;
        for (let i = 0; i < pl.attributes.position.count; i++)
          plc.set(i < half ? [0.35, 1.9, 0.6] : [2, 1.1, 0.2], i * 3);
        pl.setAttribute("color", new THREE.BufferAttribute(plc, 3));
        d.part(pl, new THREE.MeshBasicMaterial({ vertexColors: true }), {
          parent: hub2,
          from: [0, 0, -0.9],
          delay: 0.3,
          cast: false,
        });
        const speck = canvasTex(256, 256, (g, w, h) => {
          const Rn = mulberry32(52858);
          g.fillStyle = "#b9b8bd";
          g.fillRect(0, 0, w, h);
          for (let i = 0; i < 5e3; i++) {
            const v = Rn() < 0.6 ? 150 : 225;
            g.fillStyle = `rgba(${v},${v},${v + 4},0.35)`;
            g.fillRect(Rn() * w, Rn() * h, 1.2, 1.2);
          }
        });
        speck.wrapS = speck.wrapT = THREE.RepeatWrapping;
        speck.repeat.set(6, 2);
        const ceramic = d.xray(
          new THREE.MeshPhysicalMaterial({
            color: 7040373,
            map: speck,
            roughness: 0.64,
            metalness: 0,
            clearcoat: 0.12,
            clearcoatRoughness: 0.6,
          })
        );
        const top = d.part(
          GEO.lathe(
            [
              [0.902, 0.39],
              [0.912, 0.397],
              [0.917, 0.412],
              [0.91, 0.43],
              [0.884, 0.458],
              [0.82, 0.49],
              [0.66, 0.522],
              [0.42, 0.545],
              [0.18, 0.555],
              [0, 0.557],
            ],
            128
          ),
          ceramic,
          {
            parent: hub2,
            from: [0, 1.05, 0],
            spin: [0, -0.8, 0],
            delay: 0.86,
            edge: true,
          }
        );
        d.part(
          GEO.at(GEO.torus(0.15, 6e-3, 6, 48), [0, 0.5545, 0], [PI / 2, 0, 0]),
          MAT.plastic(4540238, 0.7),
          { parent: top, static: true, cast: false }
        );
        const dotMat = MAT.led(ACC, 1.6);
        d.part(GEO.at(GEO.cyl(0.016, 0.016, 4e-3, 12), [0, 0.556, 0]), dotMat, {
          parent: top,
          static: true,
          cast: false,
        });
        const ringMat = new THREE.ShaderMaterial({
          uniforms: {
            uT: { value: 0 },
            uK: { value: 1 },
            uC: { value: HDR(ACC, 1) },
          },
          vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
          fragmentShader: `uniform float uT; uniform float uK; uniform vec3 uC; varying vec2 vUv;
          void main(){ float a = fract(vUv.x - uT * 0.11); float h = exp(-pow((a - 0.5) * 4.0, 2.0)); gl_FragColor = vec4(uC * uK * (1.3 + 1.7 * h), 1.0); }`,
        });
        d.part(GEO.torus(0.907, 75e-4, 8, 192).rotateX(PI / 2), ringMat, {
          parent: top,
          static: true,
          pos: [0, 0.391, 0],
          cast: false,
        });
        const CELL = TXS / 4;
        const atlas = canvasTex(TXS, TXS / 2, (g, w, h) => {
          g.clearRect(0, 0, w, h);
          g.strokeStyle = "#fff";
          g.fillStyle = "#fff";
          g.lineCap = "round";
          g.lineJoin = "round";
          g.lineWidth = CELL * 0.07;
          const C2 = i => [
            ((i % 4) + 0.5) * CELL,
            (((i / 4) | 0) + 0.5) * CELL,
          ];
          const dot = (x2, y2, r) => {
            g.beginPath();
            g.arc(x2, y2, r, 0, TAU2);
            g.fill();
          };
          let [x, y] = C2(0);
          for (let k = 0; k < 3; k++) {
            g.beginPath();
            g.arc(
              x,
              y + CELL * 0.22,
              CELL * (0.13 + k * 0.13),
              -PI * 0.78,
              -PI * 0.22
            );
            g.stroke();
          }
          dot(x, y + CELL * 0.22, CELL * 0.05);
          [x, y] = C2(1);
          dot(x, y, CELL * 0.07);
          for (const s of [-1, 1])
            for (let k = 0; k < 2; k++) {
              g.beginPath();
              g.arc(
                x,
                y,
                CELL * (0.17 + k * 0.13),
                s > 0 ? -PI * 0.28 : PI * 0.72,
                s > 0 ? PI * 0.28 : PI * 1.28
              );
              g.stroke();
            }
          [x, y] = C2(2);
          const N2 = [
            [0, -0.26],
            [-0.25, 0.2],
            [0.25, 0.2],
            [0, 0.02],
          ];
          g.lineWidth = CELL * 0.05;
          g.beginPath();
          for (const [a, b] of [
            [0, 1],
            [1, 2],
            [2, 0],
            [0, 3],
            [1, 3],
            [2, 3],
          ]) {
            g.moveTo(x + N2[a][0] * CELL, y + N2[a][1] * CELL);
            g.lineTo(x + N2[b][0] * CELL, y + N2[b][1] * CELL);
          }
          g.stroke();
          for (const [a, b] of N2)
            dot(x + a * CELL, y + b * CELL, CELL * 0.065);
          [x, y] = C2(3);
          g.lineWidth = CELL * 0.065;
          g.beginPath();
          for (let k = 0; k <= 40; k++) {
            const u = k / 40,
              px = x + (u - 0.5) * CELL * 0.62,
              py = y - Math.sin(u * TAU2) * CELL * 0.16;
            if (k) g.lineTo(px, py);
            else g.moveTo(px, py);
          }
          g.stroke();
          dot(x - CELL * 0.31, y, CELL * 0.06);
          dot(x + CELL * 0.31, y, CELL * 0.06);
          [x, y] = C2(4);
          g.lineWidth = CELL * 0.065;
          g.beginPath();
          g.moveTo(x - CELL * 0.28, y - CELL * 0.02);
          g.lineTo(x, y - CELL * 0.28);
          g.lineTo(x + CELL * 0.28, y - CELL * 0.02);
          g.moveTo(x - CELL * 0.2, y - CELL * 0.08);
          g.lineTo(x - CELL * 0.2, y + CELL * 0.26);
          g.lineTo(x + CELL * 0.2, y + CELL * 0.26);
          g.lineTo(x + CELL * 0.2, y - CELL * 0.08);
          g.stroke();
          dot(x, y + CELL * 0.08, CELL * 0.06);
        });
        const tileMat = new THREE.MeshPhysicalMaterial({
          color: 1380893,
          roughness: 0.26,
          metalness: 0.15,
          clearcoat: 1,
          clearcoatRoughness: 0.16,
        });
        const glyphMat = new THREE.MeshBasicMaterial({
          map: atlas,
          color: HDR(10980346, 1.5),
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const tileGeo = GEO.rbox(0.24, 0.24, 0.035, 0.055, 3);
        const TILE = [
          [-0.78, 0.98],
          [-0.39, 1.08],
          [0, 1.12],
          [0.39, 1.08],
          [0.78, 0.98],
        ];
        const tiles = TILE.map(([x, y], i) => {
          const g = new THREE.Group();
          g.add(new THREE.Mesh(tileGeo, tileMat));
          const pg = new THREE.PlaneGeometry(0.17, 0.17);
          const uv = pg.attributes.uv,
            col = i % 4,
            row = (i / 4) | 0;
          for (let k = 0; k < uv.count; k++)
            uv.setXY(k, (col + uv.getX(k)) / 4, 1 - (row + 1 - uv.getY(k)) / 2);
          const gm = new THREE.Mesh(pg, glyphMat);
          gm.position.z = 0.0185;
          g.add(gm);
          d.part(g, null, {
            static: true,
            pos: [x, y, -0.18],
            rot: [0, -x * 0.32, 0],
            cast: false,
          });
          g.visible = false;
          return g;
        });
        d.label(
          "eHub-Pro · <em>smart home hub</em>",
          "#8B5CF6",
          [-0.66, 0.56, 0.36],
          [0.46, 0.8]
        );
        d.label(
          "Matter 1.3 · Zigbee 3.0 · Z-Wave 700 · <em>BLE 5.3 · Wi-Fi 6</em>",
          "#A78BFA",
          [-0.82, 1.36, -0.18],
          [0.5, 0.8]
        );
        d.label(
          "CPU · <em>NXP i.MX 8M Mini, quad Cortex-A53</em>",
          "#A78BFA",
          [-0.34, 0.3, 0.32],
          [0.56, 0.72]
        );
        const TURN = PI - 0.7;
        d.label(
          "GbE · USB 3.0 ×2 · USB-C · <em>12VDC, 10W</em>",
          "#8B5CF6",
          [PZ * Math.sin(TURN) - 0.02, 0.26, PZ * Math.cos(TURN) + 0.04],
          [0.7, 0.8]
        );
        const mSlot = new THREE.Matrix4().compose(
          new THREE.Vector3(...SLOT_P),
          new THREE.Quaternion(),
          new THREE.Vector3(SLOT_S, SLOT_S, SLOT_S)
        );
        let lastTurn = -1,
          lastLive = -1;
        d.anim((p, time, dt, env) => {
          const on = 1 - env.fin;
          const turn =
            on *
            easeInOut(clamp01((p - 0.6) / 0.12)) *
            (1 - easeInOut(clamp01((p - 0.86) / 0.1)));
          if (Math.abs(turn - lastTurn) > 1e-5) {
            lastTurn = turn;
            hub2.rotation.y = TURN * turn;
            hub2.updateMatrix();
            if (d.slotMatrix) d.slotMatrix.multiplyMatrices(hub2.matrix, mSlot);
          }
          const live = env.hero * on;
          ringMat.uniforms.uT.value = time;
          ringMat.uniforms.uK.value = 0.8 + 0.5 * live;
          if (live < 1e-3 && lastLive < 1e-3) return;
          lastLive = live;
          for (let i = 0; i < 5; i++) {
            const t = tiles[i],
              s = sr(live, 0.15 + i * 0.1, 0.5 + i * 0.1);
            t.visible = s > 0.01;
            t.scale.setScalar(0.4 + 0.6 * s);
            t.position.y =
              TILE[i][1] -
              0.25 * (1 - s) +
              0.022 * Math.sin(time * 1.3 + i * 1.1) * s;
          }
          dotMat.color
            .setHex(ACC)
            .multiplyScalar(
              1.2 + 0.8 * live * (0.5 + 0.5 * Math.sin(time * 2.2))
            );
        });
        d.frame({
          dist: 4.3,
          height: 1.95,
          targetY: 0.5,
          fov: 32,
          yaw0: -0.45,
          yaw1: 0.4,
        });
        d.footprint(1.05);
        return d;
      };
      DEVICES.ecybersec = () => {
        const d = device("ecybersec");
        const PI = Math.PI;
        const ACC = 440020;
        const CW = 2,
          CH = 0.2,
          CD = 1.45,
          YB = 0.3,
          ZF = CD / 2;
        const FLOOR = YB + 0.012,
          PCB_Y = FLOOR + 0.014;
        const BX = -0.3,
          BZ = -0.12,
          BY = PCB_Y + 5e-3 + 0.012 + 0.025;
        d.slot({ pos: [BX, BY, BZ], rot: [0, 0, 0], scale: 1 });
        const posts = [],
          feet = [];
        for (const sx of [-1, 1])
          for (const sz of [-1, 1]) {
            posts.push(
              GEO.at(GEO.cyl(0.042, 0.05, YB - 0.03, 20), [
                sx * 0.8,
                0.03 + (YB - 0.03) / 2,
                sz * 0.5,
              ]),
              GEO.at(GEO.cyl(0.075, 0.075, 0.014, 24), [
                sx * 0.8,
                YB - 7e-3,
                sz * 0.5,
              ]),
              GEO.at(GEO.cyl(0.1, 0.11, 0.024, 28), [sx * 0.8, 0.018, sz * 0.5])
            );
            feet.push(
              GEO.at(GEO.cyl(0.1, 0.1, 6e-3, 24), [sx * 0.8, 3e-3, sz * 0.5])
            );
          }
        d.part(GEO.merge(posts), MAT.anod(2501686, 0.42), {
          from: [0, -0.4, 0],
          delay: 0,
        });
        d.part(GEO.merge(feet), MAT.rubber(723983), {
          from: [0, -0.4, 0],
          delay: 0,
        });
        const tubMat = new THREE.MeshPhysicalMaterial({
          color: 2896443,
          metalness: 0.25,
          roughness: 0.56,
          clearcoat: 0.2,
          clearcoatRoughness: 0.5,
        });
        d.part(
          GEO.merge([
            GEO.at(GEO.rbox(CW, 0.012, CD, 5e-3, 2), [0, YB + 6e-3, 0]),
            GEO.at(GEO.rbox(0.012, CH - 0.012, CD, 4e-3, 2), [
              -CW / 2 + 6e-3,
              YB + CH / 2,
              0,
            ]),
            GEO.at(GEO.rbox(0.012, CH - 0.012, CD, 4e-3, 2), [
              CW / 2 - 6e-3,
              YB + CH / 2,
              0,
            ]),
            GEO.at(GEO.rbox(CW, CH - 0.012, 0.012, 4e-3, 2), [
              0,
              YB + CH / 2,
              -ZF + 6e-3,
            ]),
          ]),
          tubMat,
          { from: [0, -0.7, 0], delay: 0.1, edge: true }
        );
        d.part(new THREE.BoxGeometry(1.37, 0.01, 0.92), MAT.pcb("green"), {
          pos: [-0.265, PCB_Y, -0.245],
          from: [-1.6, 0, 0],
          delay: 0.02,
        });
        const chips = [
          GEO.at(new THREE.BoxGeometry(0.09, 0.012, 0.09), [
            -0.47,
            PCB_Y + 0.011,
            -0.6,
          ]),
          GEO.at(new THREE.BoxGeometry(0.06, 0.01, 0.06), [
            -0.36,
            PCB_Y + 0.01,
            -0.6,
          ]),
          GEO.at(new THREE.BoxGeometry(0.08, 0.012, 0.05), [
            0.3,
            PCB_Y + 0.011,
            0.1,
          ]),
          GEO.at(new THREE.BoxGeometry(0.05, 0.01, 0.1), [
            0.08,
            PCB_Y + 0.01,
            -0.62,
          ]),
        ];
        d.part(GEO.merge(chips), MAT.plastic(921621, 0.5), {
          from: [-1.6, 0, 0],
          delay: 0.02,
        });
        const sink = [
          GEO.at(new THREE.BoxGeometry(0.2, 0.012, 0.22), [0, 0, 0]),
        ];
        for (let i = 0; i < 9; i++)
          sink.push(
            GEO.at(new THREE.BoxGeometry(8e-3, 0.075, 0.22), [
              -0.092 + i * 0.023,
              0.043,
              0,
            ])
          );
        d.part(GEO.merge(sink), MAT.alu(6120558, 0.56), {
          pos: [0.31, PCB_Y + 0.011, -0.36],
          from: [0, 0.6, 0],
          delay: 0.3,
        });
        const cageSteel = MAT.steel(0.4);
        const cages = [];
        for (const x of [-0.8, -0.69])
          cages.push(
            GEO.at(new THREE.BoxGeometry(0.075, 0.05, 0.24), [
              x,
              PCB_Y + 0.03,
              -ZF + 0.116,
            ]),
            GEO.at(new THREE.BoxGeometry(0.085, 0.058, 0.01), [
              x,
              PCB_Y + 0.03,
              -ZF - 1e-3,
            ])
          );
        cages.push(
          GEO.at(new THREE.BoxGeometry(0.085, 0.07, 0.12), [
            -0.53,
            PCB_Y + 0.04,
            -ZF + 0.056,
          ])
        );
        d.part(GEO.merge(cages), cageSteel, { from: [0, 0.6, 0], delay: 0.24 });
        const perf = canvasTex(TXS / 2, TXS / 2, (g, w, h) => {
          g.fillStyle = "#ffffff";
          g.fillRect(0, 0, w, h);
          g.fillStyle = "#000000";
          const s = w / 24;
          for (let r = 0; r < 26; r++)
            for (let c = 0; c < 26; c++) {
              g.beginPath();
              g.arc(
                c * s + (r % 2 ? s / 2 : 0),
                r * s * 0.866,
                s * 0.3,
                0,
                PI * 2
              );
              g.fill();
            }
        });
        const psuMat = new THREE.MeshStandardMaterial({
          color: 6252144,
          map: perf,
          metalness: 0.7,
          roughness: 0.45,
        });
        d.part(GEO.rbox(0.42, 0.15, 1, 0.01, 2), psuMat, {
          pos: [0.73, FLOOR + 0.076, -0.2],
          from: [0, 0.7, 0],
          delay: 0.2,
        });
        const fan = [];
        for (const fx of [0.38, 0.54, 0.7, 0.86]) {
          const cy = FLOOR + 0.082,
            cz = ZF - 0.13;
          fan.push(
            GEO.at(new THREE.BoxGeometry(0.15, 0.012, 0.1), [
              fx,
              cy + 0.075,
              cz,
            ]),
            GEO.at(new THREE.BoxGeometry(0.15, 0.012, 0.1), [
              fx,
              cy - 0.075,
              cz,
            ])
          );
          fan.push(
            GEO.at(new THREE.BoxGeometry(0.012, 0.16, 0.1), [
              fx - 0.069,
              cy,
              cz,
            ]),
            GEO.at(new THREE.BoxGeometry(0.012, 0.16, 0.1), [
              fx + 0.069,
              cy,
              cz,
            ])
          );
          fan.push(
            GEO.at(GEO.cyl(0.03, 0.03, 0.05, 14), [fx, cy, cz], [PI / 2, 0, 0])
          );
          for (let b = 0; b < 5; b++)
            fan.push(
              GEO.at(
                new THREE.BoxGeometry(0.05, 0.012, 0.03),
                [
                  fx + Math.cos((b * 2 * PI) / 5) * 0.05,
                  cy + Math.sin((b * 2 * PI) / 5) * 0.05,
                  cz,
                ],
                [0, 0, (b * 2 * PI) / 5]
              )
            );
        }
        fan.push(
          GEO.at(GEO.rbox(0.95, 0.075, 0.25, 0.01, 2), [
            -0.48,
            FLOOR + 0.05,
            ZF - 0.14,
          ])
        );
        d.part(GEO.merge(fan), MAT.plastic(1448223, 0.5), {
          from: [0, 0, 0.9],
          delay: 0.28,
        });
        const meshMat = new THREE.ShaderMaterial({
          uniforms: {
            uT: { value: 0 },
            uO: { value: 0 },
            uC: { value: HDR(ACC, 1.15) },
            uC2: { value: HDR(6809849, 0.5) },
          },
          vertexShader: `varying vec3 vP; varying vec3 vN; void main(){ vP = position; vN = normal; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
          fragmentShader: `uniform float uT; uniform float uO; uniform vec3 uC; uniform vec3 uC2; varying vec3 vP; varying vec3 vN;
          float meander(vec2 q, float P){ vec2 c = q / P; float cx = floor(c.x); vec2 f = fract(c); float hy = mod(cx, 2.0) < 1.0 ? 0.25 : 0.75;
            float dH = abs(f.y - hy); float dV = min(f.x, 1.0 - f.x); float inR = step(0.25, f.y) * step(f.y, 0.75);
            float d = min(dH, mix(1.0, dV, inR)); float w = 0.05 + fwidth(c.y) * 0.8; return 1.0 - smoothstep(w * 0.45, w, d); }
          void main(){ vec3 n = abs(vN); vec2 q = n.y > 0.5 ? vP.xz : (n.x > 0.5 ? vP.zy : vP.xy);
            float a = meander(q, 0.042), b = meander(q + vec2(0.021, 0.021), 0.042);
            float pulse = 0.55 + 0.45 * sin(q.x * 16.0 + q.y * 9.0 - uT * 2.6);
            float topK = n.y > 0.5 ? 0.42 : 1.0; vec3 col = (uC * a * (0.45 + 0.55 * pulse) + uC2 * b * 0.4 + uC * 0.012) * uO * topK; gl_FragColor = vec4(col, 1.0); }`,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        });
        const encGeo = new THREE.BoxGeometry(0.98, 0.135, 0.68);
        const enc = d.part(new THREE.Mesh(encGeo, meshMat), null, {
          pos: [BX, PCB_Y + 5e-3 + 0.0675, BZ],
          from: [0, 0.7, 0],
          delay: 0.56,
          cast: false,
          receive: false,
        });
        const edgeMat = new THREE.LineBasicMaterial({
          color: HDR(ACC, 2),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        d.part(
          new THREE.LineSegments(new THREE.EdgesGeometry(encGeo), edgeMat),
          null,
          { parent: enc, static: true, cast: false, receive: false }
        );
        const bezelMat = MAT.anod(1185308, 0.42);
        d.part(
          GEO.merge([
            GEO.at(GEO.rbox(CW, CH - 4e-3, 0.036, 0.012, 3), [
              0,
              YB + CH / 2,
              ZF + 0.018,
            ]),
            GEO.at(GEO.rbox(0.1, CH - 4e-3, 0.012, 4e-3, 2), [
              -CW / 2 - 0.05,
              YB + CH / 2,
              ZF + 0.03,
            ]),
            GEO.at(GEO.rbox(0.1, CH - 4e-3, 0.012, 4e-3, 2), [
              CW / 2 + 0.05,
              YB + CH / 2,
              ZF + 0.03,
            ]),
          ]),
          bezelMat,
          { from: [0, 0, 1.2], delay: 0.74, edge: true }
        );
        const FZ = ZF + 0.036,
          SY = YB + 0.098;
        const SLOTS = [-0.8, -0.48, -0.16];
        const surround = [],
          black = [];
        for (const x of SLOTS) {
          surround.push(
            GEO.at(GEO.rbox(0.32, 0.052, 0.012, 0.01, 2), [x, SY, FZ + 4e-3])
          );
          black.push(
            GEO.at(new THREE.BoxGeometry(0.27, 0.012, 4e-3), [
              x,
              SY,
              FZ + 0.0105,
            ])
          );
        }
        for (const x of [-0.8, -0.69])
          black.push(
            GEO.at(new THREE.BoxGeometry(0.062, 0.036, 4e-3), [
              x,
              PCB_Y + 0.03,
              -ZF - 75e-4,
            ])
          );
        d.part(GEO.merge(surround), MAT.plastic(658448, 0.5), {
          from: [0, 0, 1.2],
          delay: 0.74,
        });
        d.part(
          GEO.merge(black),
          new THREE.MeshBasicMaterial({ color: 66051 }),
          { from: [0, 0, 1.2], delay: 0.74, cast: false }
        );
        d.part(
          new THREE.PlaneGeometry(0.62, 0.13),
          new THREE.MeshStandardMaterial({
            color: 2830650,
            map: perf,
            metalness: 0.6,
            roughness: 0.45,
          }),
          {
            pos: [0.62, YB + CH / 2, FZ + 8e-4],
            from: [0, 0, 1.2],
            delay: 0.74,
            cast: false,
          }
        );
        const ledG = new THREE.BoxGeometry(0.03, 0.012, 4e-3);
        const lit = GEO.merge([
          GEO.at(ledG, [0.06, YB + 0.14, FZ + 2e-3]),
          GEO.at(ledG, [0.12, YB + 0.14, FZ + 2e-3]),
          GEO.at(ledG, [0.18, YB + 0.14, FZ + 2e-3]),
          GEO.at(ledG, [0.24, YB + 0.14, FZ + 2e-3]),
          GEO.at(new THREE.BoxGeometry(1, 5e-3, 3e-3), [
            -0.48,
            YB + 0.032,
            FZ + 15e-4,
          ]),
        ]);
        const lc = new Float32Array(lit.attributes.position.count * 3),
          per = 36;
        const LCOL = [
          [0.1, 1.9, 2.2],
          [0.1, 1.9, 2.2],
          [0.3, 1.9, 0.5],
          [0.45, 0.22, 0.02],
          [0.05, 1.1, 1.3],
        ];
        for (let i = 0; i < lit.attributes.position.count; i++)
          lc.set(LCOL[Math.min(4, (i / per) | 0)], i * 3);
        lit.setAttribute("color", new THREE.BufferAttribute(lc, 3));
        const ledMat = new THREE.MeshBasicMaterial({ vertexColors: true });
        d.part(lit, ledMat, { from: [0, 0, 1.2], delay: 0.74, cast: false });
        const hs = [];
        for (const sx of [-1, 1]) {
          const x = sx * (CW / 2 + 0.05);
          hs.push(
            GEO.tube(
              [
                [x, YB + 0.035, FZ - 6e-3],
                [x, YB + 0.035, FZ + 0.05],
                [x, YB + 0.06, FZ + 0.072],
                [x, YB + 0.14, FZ + 0.072],
                [x, YB + 0.165, FZ + 0.05],
                [x, YB + 0.165, FZ - 6e-3],
              ],
              0.011,
              36,
              8
            )
          );
          hs.push(
            GEO.at(
              GEO.cyl(0.016, 0.016, 8e-3, 12),
              [x, YB + 0.1, ZF + 0.039],
              [PI / 2, 0, 0]
            )
          );
        }
        d.part(GEO.merge(hs), MAT.steel(0.32), {
          from: [0, 0, 1.2],
          delay: 0.76,
        });
        const cardTex = canvasTex(TXS / 2, TXS / 4, (g, w, h) => {
          const gr = g.createLinearGradient(0, 0, w, h);
          gr.addColorStop(0, "#2a3442");
          gr.addColorStop(1, "#1b2230");
          g.fillStyle = gr;
          g.fillRect(0, 0, w, h);
          g.fillStyle = "#22d3ee";
          g.fillRect(0, h * 0.06, w, h * 0.07);
          g.fillRect(0, h * 0.87, w, h * 0.07);
          g.fillStyle = "rgba(255,255,255,0.08)";
          for (let i = 0; i < 6; i++)
            g.fillRect(w * (0.1 + i * 0.14), h * 0.3, w * 0.08, h * 0.4);
        });
        const cardMat = new THREE.MeshPhysicalMaterial({
          map: cardTex,
          roughness: 0.38,
          metalness: 0.05,
          clearcoat: 0.6,
          clearcoatRoughness: 0.2,
        });
        d.part(
          GEO.merge([
            GEO.at(new THREE.BoxGeometry(0.25, 35e-4, 0.21), [
              SLOTS[0],
              SY,
              FZ + 0.09,
            ]),
            GEO.at(new THREE.BoxGeometry(0.25, 35e-4, 0.21), [
              SLOTS[1],
              SY,
              FZ + 0.09,
            ]),
          ]),
          cardMat,
          { from: [0, 0.05, 0.7], delay: 0.84 }
        );
        const lidMat = d.xray(
          new THREE.MeshPhysicalMaterial({
            color: 3883597,
            metalness: 0.25,
            roughness: 0.56,
            clearcoat: 0.2,
            clearcoatRoughness: 0.5,
          })
        );
        const lid = d.part(
          GEO.merge([
            GEO.rbox(CW + 8e-3, 0.012, CD + 4e-3, 5e-3, 3),
            GEO.at(GEO.rbox(1.5, 6e-3, 0.05, 3e-3, 2), [-0.1, 6e-3, 0.3]),
            GEO.at(GEO.rbox(1.5, 6e-3, 0.05, 3e-3, 2), [-0.1, 6e-3, -0.36]),
          ]),
          lidMat,
          {
            pos: [0, YB + CH - 6e-3, 0],
            from: [0, 1, 0],
            spin: [0, 0.25, 0],
            delay: 0.92,
            edge: true,
          }
        );
        const sc = [];
        for (const x of [-0.92, -0.46, 0, 0.46, 0.92])
          sc.push(
            GEO.at(GEO.cyl(0.015, 0.015, 6e-3, 10), [x, 8e-3, -ZF + 0.03])
          );
        for (const z of [-0.45, 0.05, 0.55])
          sc.push(
            GEO.at(GEO.cyl(0.015, 0.015, 6e-3, 10), [-CW / 2 + 0.03, 8e-3, z]),
            GEO.at(GEO.cyl(0.015, 0.015, 6e-3, 10), [CW / 2 - 0.03, 8e-3, z])
          );
        d.part(GEO.merge(sc), d.xray(MAT.steel(0.4)), {
          parent: lid,
          static: true,
        });
        d.label(
          "eHSM-9000 · <em>network-attached, dual 10GbE</em>",
          "#06B6D4",
          [0.5, YB + CH + 0.02, -0.7],
          [0.46, 0.8]
        );
        d.label(
          "M-of-N quorum · <em>smartcard operators</em>",
          "#67E8F9",
          [SLOTS[1] + 0.06, SY + 4e-3, FZ + 0.19],
          [0.5, 0.8]
        );
        d.label(
          "Active tamper mesh · <em>zeroise in &lt;50ms on breach</em>",
          "#06B6D4",
          [BX - 0.47, PCB_Y + 0.14, BZ - 0.3],
          [0.55, 0.78]
        );
        d.label(
          "Core board · <em>EoS runs here</em>",
          "#67E8F9",
          [BX - 0.22, BY + 0.05, BZ + 0.12],
          [0.57, 0.76]
        );
        let lastO = -1;
        d.anim((p, time, dt, env) => {
          const o = env.x * (1 - env.fin);
          meshMat.uniforms.uT.value = time;
          if (Math.abs(o - lastO) > 1e-4) {
            lastO = o;
            meshMat.uniforms.uO.value = o;
            edgeMat.opacity = 0.85 * o;
            enc.visible = o > 4e-3;
          }
          const live = env.hero * (1 - env.fin);
          if (live > 1e-3)
            ledMat.color.setScalar(
              0.75 + 0.25 * live * (0.5 + 0.5 * Math.sin(time * 3.1))
            );
        });
        d.frame({
          dist: 4.45,
          height: 2.25,
          targetY: 0.3,
          fov: 31,
          yaw0: -0.45,
          yaw1: 0.4,
        });
        d.footprint(1.25);
        return d;
      };
      DEVICES.edefense = () => {
        const d = device("edefense");
        const PI = Math.PI,
          TW = Math.PI * 2;
        const W = 1.24,
          H = 0.565,
          Y0 = 0.035,
          DEP = 0.92,
          RAD = 0.05,
          WALL = 0.04;
        const Y1 = Y0 + H,
          YC = Y0 + H / 2,
          ZF = DEP / 2,
          PT = 0.045,
          PZ = ZF + PT;
        const SY = 0.3,
          SZ = -0.02;
        d.slot({ pos: [0, SY, SZ], rot: [0, 0, 0], scale: 1 });
        const rr = (w, h, r) => {
          const s = new THREE.Shape(),
            x = w / 2,
            y = h / 2;
          s.moveTo(-x + r, -y);
          s.lineTo(x - r, -y);
          s.absarc(x - r, -y + r, r, -PI / 2, 0, false);
          s.lineTo(x, y - r);
          s.absarc(x - r, y - r, r, 0, PI / 2, false);
          s.lineTo(-x + r, y);
          s.absarc(-x + r, y - r, r, PI / 2, PI, false);
          s.lineTo(-x, -y + r);
          s.absarc(-x + r, -y + r, r, PI, PI * 1.5, false);
          return s;
        };
        const slab = (w, h, r, depth, bev, hole, cs = 3, bs = 2) => {
          const s = rr(w - 2 * bev, h - 2 * bev, Math.max(3e-3, r - bev));
          if (hole)
            s.holes.push(
              rr(hole[0] + 2 * bev, hole[1] + 2 * bev, hole[2] + bev)
            );
          const g = new THREE.ExtrudeGeometry(s, {
            depth: Math.max(1e-3, depth - 2 * bev),
            bevelEnabled: bev > 0,
            bevelThickness: bev,
            bevelSize: bev,
            bevelSegments: bs,
            curveSegments: cs,
          });
          return g.translate(0, 0, bev);
        };
        const fin = (t0, t1, h, len) => {
          const s = new THREE.Shape(),
            r = t1 / 2,
            f = 7e-3,
            e = 0.014,
            a = t0 / 2 + f;
          s.moveTo(-a, -e);
          s.lineTo(a, -e);
          s.lineTo(a, 0);
          s.lineTo(t0 / 2, f);
          s.lineTo(r, h - r);
          s.absarc(0, h - r, r, 0, PI, false);
          s.lineTo(-t0 / 2, f);
          s.lineTo(-a, 0);
          const g = new THREE.ExtrudeGeometry(s, {
            depth: len - 6e-3,
            bevelEnabled: true,
            bevelThickness: 3e-3,
            bevelSize: 12e-4,
            bevelSegments: 1,
            curveSegments: 2,
          });
          return g.translate(0, 0, -len / 2 + 3e-3);
        };
        const knurl = (r, len, ridges, depth = 0.075) => {
          const n = ridges * 2,
            step = TW / n;
          const g = new THREE.CylinderGeometry(
            r,
            r,
            len,
            n,
            1,
            false
          ).toNonIndexed();
          const P = g.attributes.position;
          for (let i = 0; i < P.count; i++) {
            const x = P.getX(i),
              z = P.getZ(i);
            if (x * x + z * z < r * r * 0.25) continue;
            const k = Math.round(Math.atan2(x, z) / step);
            const s = k & 1 ? 1 - depth : 1;
            P.setX(i, x * s);
            P.setZ(i, z * s);
          }
          g.computeVertexNormals();
          return g;
        };
        const hex = (r, h) => {
          const g = new THREE.CylinderGeometry(r, r, h, 6).toNonIndexed();
          g.computeVertexNormals();
          return g;
        };
        const Z = [PI / 2, 0, 0];
        const chassis = d.xray(MAT.anod(3817545, 0.45));
        chassis.metalness = 0.56;
        const panelM = d.xray(MAT.anod(4146510, 0.43));
        panelM.metalness = 0.55;
        const blk = d.xray(MAT.blackMetal(0.44));
        const capM = d.xray(MAT.blackMetal(0.55));
        const nick = d.xray(MAT.steel(0.42));
        const plateTex = canvasTex(512, 128, (g, w, h) => {
          const R = mulberry32(121255);
          g.fillStyle = "#858b94";
          g.fillRect(0, 0, w, h);
          for (let i = 0; i < 420; i++) {
            const v = 116 + R() * 46;
            g.fillStyle = `rgba(${v},${v},${v + 6},0.2)`;
            g.fillRect(0, R() * h, w, 0.6 + R());
          }
          g.strokeStyle = "rgba(28, 32, 38, 0.8)";
          g.lineWidth = 3;
          g.strokeRect(9, 9, w - 18, h - 18);
          g.strokeStyle = "rgba(28, 32, 38, 0.45)";
          g.lineWidth = 2;
          g.strokeRect(26, 26, w * 0.4, 32);
          g.strokeRect(26, 70, w * 0.4, 32);
          g.strokeRect(w * 0.5, 26, w * 0.44, 32);
          g.strokeRect(w * 0.5, 70, w * 0.19, 32);
          g.strokeRect(w * 0.73, 70, w * 0.21, 32);
        });
        const plateM = d.xray(
          new THREE.MeshStandardMaterial({
            map: plateTex,
            metalness: 0.7,
            roughness: 0.5,
          })
        );
        const rubber = MAT.rubber(724240);
        const baseM = MAT.anod(1448481, 0.52);
        const boltM = MAT.steel(0.4);
        const ledM = MAT.led(10265519, 1.6);
        const alu = MAT.alu(7568519, 0.52);
        const wedgeM = MAT.alu(11046232, 0.44);
        const copper = MAT.copper();
        copper.roughness = 0.38;
        const psuM = MAT.plastic(992281, 0.55);
        const capsM = MAT.plastic(1711913, 0.4);
        d.part(slab(1.74, 1, 0.05, 0.035, 6e-3).rotateX(-PI / 2), baseM, {
          from: [0, 0, 0.85],
          delay: 0,
          edge: true,
        });
        const bolts = [];
        for (const sx of [-1, 1])
          for (const z of [-0.36, 0, 0.36]) {
            bolts.push(
              GEO.at(GEO.cyl(0.034, 0.034, 5e-3, 20), [sx * 0.8, 0.0375, z])
            );
            bolts.push(
              GEO.at(hex(0.024, 0.018), [sx * 0.8, 0.049, z], [0, 0.3, 0])
            );
          }
        d.part(GEO.merge(bolts), boltM, { from: [0, 0.55, 0], delay: 0.1 });
        d.part(
          GEO.merge([
            GEO.at(GEO.rbox(0.15, 0.03, 0.62, 6e-3, 1), [0.505, SY - 0.04, SZ]),
            GEO.at(GEO.rbox(0.15, 0.03, 0.62, 6e-3, 1), [
              -0.505,
              SY - 0.04,
              SZ,
            ]),
          ]),
          alu,
          { from: [0, 0, -1.1], delay: 0.04 }
        );
        const coin = new THREE.Group();
        coin.add(
          new THREE.Mesh(
            GEO.rbox(0.26, 0.15, 0.22, 0.012, 1).translate(0, 0.15, SZ),
            alu
          )
        );
        coin.add(
          new THREE.Mesh(
            GEO.rbox(0.2, 0.05, 0.18, 6e-3, 1).translate(0, 0.25, SZ),
            copper
          )
        );
        d.part(coin, null, { from: [0, 0, 1], delay: 0.08 });
        const psu = new THREE.Group();
        psu.add(
          new THREE.Mesh(
            GEO.merge([
              GEO.at(
                GEO.rbox(0.46, 0.016, 0.22, 4e-3, 1),
                [-0.16, 0.085, -0.27]
              ),
              GEO.at(GEO.rbox(0.1, 0.062, 0.09, 8e-3, 1), [0, 0.124, -0.27]),
            ]),
            psuM
          )
        );
        psu.add(
          new THREE.Mesh(
            GEO.merge(
              [-0.33, -0.25, -0.17].map(x =>
                GEO.at(GEO.cyl(0.032, 0.032, 0.086, 16), [x, 0.136, -0.27])
              )
            ),
            capsM
          )
        );
        d.part(psu, null, { from: [0, 0, -1], delay: 0.12 });
        const wl = [];
        for (const sx of [-1, 1]) {
          for (const z of [-0.19, -0.01, 0.17])
            wl.push(
              GEO.at(GEO.rbox(0.032, 0.028, 0.16, 5e-3, 1), [
                sx * 0.426,
                SY + 0.039,
                SZ + z,
              ])
            );
          wl.push(
            GEO.at(
              GEO.cyl(8e-3, 8e-3, 0.03, 8),
              [sx * 0.426, SY + 0.039, SZ + 0.265],
              Z
            )
          );
        }
        d.part(GEO.merge(wl), wedgeM, { from: [0, 0.45, 0], delay: 0.2 });
        const sleeve = d.part(
          GEO.merge([
            slab(W, H, RAD, DEP, 8e-3, [
              W - 2 * WALL,
              H - 2 * WALL,
              0.015,
            ]).translate(0, YC, -ZF),
            slab(W - 2 * WALL, H - 2 * WALL, 0.015, 0.04, 4e-3).translate(
              0,
              YC,
              -ZF
            ),
          ]),
          chassis,
          { from: [0, 0, -1.5], delay: 0.34, edge: true }
        );
        const sideFin = fin(0.022, 0.012, 0.1, 0.84);
        const SFY = [0, 1, 2, 3, 4, 5].map(j => 0.118 + j * 0.08);
        const finsR = d.part(
          GEO.merge(
            SFY.map(y => GEO.at(sideFin, [W / 2, y, 0], [0, 0, -PI / 2]))
          ),
          chassis,
          { from: [0.75, 0, 0], delay: 0.5 }
        );
        const finsL = d.part(
          GEO.merge(
            SFY.map(y => GEO.at(sideFin, [-W / 2, y, 0], [0, 0, PI / 2]))
          ),
          chassis,
          { from: [-0.75, 0, 0], delay: 0.54 }
        );
        const topFin = fin(0.028, 0.015, 0.26, 0.84);
        const finsT = d.part(
          GEO.merge(
            Array.from({ length: 15 }, (_, i) =>
              GEO.at(topFin, [-0.56 + i * 0.08, Y1, 0])
            )
          ),
          chassis,
          { from: [0, 0.6, 0], delay: 0.64 }
        );
        const panel = d.part(
          slab(W, H, RAD, PT, 8e-3).translate(0, YC, ZF),
          panelM,
          { from: [0, 0, 0.95], delay: 0.82, edge: true }
        );
        d.part(
          slab(W - 8e-3, H - 8e-3, RAD - 4e-3, 0.01, 0, [
            W - 0.05,
            H - 0.05,
            0.02,
          ]).translate(0, YC, ZF - 5e-3),
          rubber,
          { parent: panel, static: true }
        );
        const blkG = [],
          capG = [],
          nickG = [];
        const CY = 0.245;
        const CONN = [
          [-0.44, 0.07],
          [-0.19, 0.056],
          [0.04, 0.056],
          [0.27, 0.056],
          [0.48, 0.048],
        ];
        for (const [cx, s] of CONN) {
          const f = 2.45 * s,
            q = 0.36 * f;
          blkG.push(
            GEO.at(slab(f, f, 0.014, 0.016, 3e-3, null, 2, 1), [cx, CY, PZ])
          );
          blkG.push(
            GEO.at(
              GEO.cyl(0.86 * s, 0.86 * s, 0.03, 24),
              [cx, CY, PZ + 0.03],
              Z
            )
          );
          nickG.push(
            GEO.at(knurl(s, 0.042, s > 0.06 ? 28 : 22), [cx, CY, PZ + 0.045], Z)
          );
          capG.push(
            GEO.at(
              GEO.lathe(
                [
                  [1e-3, 0],
                  [0.93 * s, 0],
                  [0.93 * s, 5e-3],
                  [0.78 * s, 0.011],
                  [0.3 * s, 0.015],
                  [1e-3, 0.016],
                ],
                28
              ),
              [cx, CY, PZ + 0.066],
              Z
            )
          );
          capG.push(
            GEO.at(GEO.cyl(0.2 * s, 0.2 * s, 6e-3, 12), [cx, CY, PZ + 0.084], Z)
          );
          for (const [ux, uy] of [
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
          ])
            nickG.push(
              GEO.at(
                GEO.cyl(85e-4, 85e-4, 8e-3, 8),
                [cx + ux * q, CY + uy * q, PZ + 0.02],
                Z
              )
            );
          nickG.push(
            GEO.tube(
              [
                [cx + 0.92 * s, CY - 0.28 * s, PZ + 0.05],
                [cx + 1.24 * s, CY - 0.62 * s, PZ + 0.045],
                [cx + q + 0.012, CY - q + 0.012, PZ + 0.034],
                [cx + q, CY - q, PZ + 0.025],
              ],
              32e-4,
              14,
              4
            )
          );
        }
        const TB = 0.47;
        for (const [x, y] of [
          [-0.565, 0.085],
          [0.565, 0.085],
          [-0.565, 0.552],
          [0.565, 0.552],
          [0, 0.085],
          [0, 0.552],
        ])
          nickG.push(
            GEO.at(GEO.cyl(0.013, 0.013, 7e-3, 12), [x, y, PZ + 35e-4], Z)
          );
        for (const [x, y] of [
          [-0.49, TB - 0.03],
          [-0.13, TB - 0.03],
          [-0.49, TB + 0.03],
          [-0.13, TB + 0.03],
        ])
          nickG.push(
            GEO.at(
              new THREE.SphereGeometry(75e-4, 8, 4, 0, TW, 0, PI / 2),
              [x, y, PZ + 8e-3],
              Z
            )
          );
        nickG.push(
          GEO.at(GEO.torus(0.0135, 3e-3, 6, 20), [0.12, TB, PZ + 3e-3])
        );
        blkG.push(
          GEO.at(hex(0.03, 0.012), [0.3, TB, PZ + 6e-3], [PI / 2, PI / 2, 0])
        );
        capG.push(
          GEO.at(
            GEO.lathe(
              [
                [1e-3, 0],
                [0.026, 0],
                [0.026, 8e-3],
                [0.019, 0.016],
                [1e-3, 0.019],
              ],
              24
            ),
            [0.3, TB, PZ + 0.012],
            Z
          )
        );
        nickG.push(
          GEO.at(hex(0.018, 0.012), [0.48, TB, PZ + 0.01], [PI / 2, PI / 2, 0])
        );
        nickG.push(
          GEO.at(GEO.cyl(0.024, 0.024, 4e-3, 16), [0.48, TB, PZ + 2e-3], Z)
        );
        nickG.push(
          GEO.at(GEO.cyl(6e-3, 6e-3, 0.036, 8), [0.48, TB, PZ + 0.018], Z)
        );
        d.part(GEO.merge(blkG), blk, { parent: panel, static: true });
        d.part(GEO.merge(capG), capM, { parent: panel, static: true });
        d.part(GEO.merge(nickG), nick, { parent: panel, static: true });
        d.part(GEO.rbox(0.4, 0.09, 8e-3, 8e-3, 2), plateM, {
          parent: panel,
          static: true,
          pos: [-0.31, TB, PZ + 4e-3],
        });
        d.part(GEO.cyl(0.011, 0.011, 6e-3, 16).rotateX(PI / 2), ledM, {
          parent: panel,
          static: true,
          pos: [0.12, TB, PZ + 3e-3],
        });
        d.label(
          "eRGD-2000 · <em>ruggedised mission computer</em>",
          "#9CA3AF",
          [-0.08, Y1 + 0.33, -0.12],
          [0.46, 0.8]
        );
        d.label(
          "Conduction cooling · <em>45W sustained</em>",
          "#D1D5DB",
          [0.52, Y1 + 0.09, -0.3],
          [0.5, 0.8]
        );
        d.label(
          "IP67 sealed · <em>−40 °C to +71 °C operating</em>",
          "#9CA3AF",
          [-0.36, 6e-3, 0.5],
          [0.48, 0.8]
        );
        d.label(
          "NXP i.MX 8M Plus · <em>2.3-TOPS NPU</em>",
          "#E5E7EB",
          [0.04, SY + 0.1, SZ],
          [0.55, 0.78]
        );
        const shell = [];
        for (const m of [sleeve, finsR, finsL, finsT, panel])
          m.traverse(c => c.isMesh && shell.push(c));
        const ledC = new THREE.Color(10265519);
        let lastCast = true;
        d.anim((p, time, dt, env) => {
          const cast = env.x < 0.25;
          if (cast !== lastCast) {
            lastCast = cast;
            for (const m of shell) m.castShadow = cast;
          }
          ledM.color
            .copy(ledC)
            .multiplyScalar(1.25 + 0.45 * Math.sin(time * 1.7));
        });
        d.frame({
          dist: 4.25,
          height: 1.35,
          targetY: 0.42,
          fov: 32,
          yaw0: -0.5,
          yaw1: 0.42,
        });
        d.footprint(1.05);
        return d;
      };
      DEVICES.eedgeai = () => {
        const d = device("eedgeai");
        const PI = Math.PI,
          TW = Math.PI * 2;
        const ACC = 8490232;
        const BAR_Y = 0.98,
          BAR_Z = -0.25,
          BAR_L = 2.04,
          BAR_H = 0.12,
          BAR_D = 0.06;
        const POST_X = 0.55,
          POST_S = 0.06,
          POST_Y0 = 0.035,
          POST_Y1 = BAR_Y - BAR_H / 2;
        const CS = 1.18;
        const CAM_Y = BAR_Y + BAR_H / 2 + 0.097 * CS,
          CAM_Z = BAR_Z;
        const CAM_X = [-0.84, -0.3, 0.3, 0.84];
        const BOX_W = 0.84,
          BOX_D = 0.54,
          BOX_Z = 0.15,
          BOX_Y0 = 0.047,
          BOX_H = 0.22;
        const BOX_Y1 = BOX_Y0 + BOX_H,
          BOX_ZB = BOX_Z - BOX_D / 2;
        const TRAY_T = 0.028,
          COVER_T = 0.018;
        const XC = [-0.105, -0.035, 0.035, 0.105];
        const SY = 0.137;
        d.slot({ pos: [0, SY, BOX_Z], rot: [0, 0, 0], scale: 0.7 });
        const rr = (w, h, r) => {
          const s = new THREE.Shape(),
            x = w / 2,
            y = h / 2;
          s.moveTo(-x + r, -y);
          s.lineTo(x - r, -y);
          s.absarc(x - r, -y + r, r, -PI / 2, 0, false);
          s.lineTo(x, y - r);
          s.absarc(x - r, y - r, r, 0, PI / 2, false);
          s.lineTo(-x + r, y);
          s.absarc(-x + r, y - r, r, PI / 2, PI, false);
          s.lineTo(-x, -y + r);
          s.absarc(-x + r, -y + r, r, PI, PI * 1.5, false);
          return s;
        };
        const slab = (w, h, r, depth, bev, hole, cs = 3, bs = 2) => {
          const s = rr(w - 2 * bev, h - 2 * bev, Math.max(3e-3, r - bev));
          if (hole)
            s.holes.push(
              rr(hole[0] + 2 * bev, hole[1] + 2 * bev, hole[2] + bev)
            );
          const g = new THREE.ExtrudeGeometry(s, {
            depth: Math.max(1e-3, depth - 2 * bev),
            bevelEnabled: bev > 0,
            bevelThickness: bev,
            bevelSize: bev,
            bevelSegments: bs,
            curveSegments: cs,
          });
          return g.translate(0, 0, bev);
        };
        const flat = g => g.rotateX(-PI / 2);
        const fin = (t0, t1, h, len) => {
          const s = new THREE.Shape(),
            r = t1 / 2,
            f = 6e-3,
            e = 0.012,
            a = t0 / 2 + f;
          s.moveTo(-a, -e);
          s.lineTo(a, -e);
          s.lineTo(a, 0);
          s.lineTo(t0 / 2, f);
          s.lineTo(r, h - r);
          s.absarc(0, h - r, r, 0, PI, false);
          s.lineTo(-t0 / 2, f);
          s.lineTo(-a, 0);
          const g = new THREE.ExtrudeGeometry(s, {
            depth: len - 6e-3,
            bevelEnabled: true,
            bevelThickness: 3e-3,
            bevelSize: 1e-3,
            bevelSegments: 1,
            curveSegments: 2,
          });
          return g.translate(0, 0, -len / 2 + 3e-3);
        };
        const knurl = (r, len, ridges, depth = 0.07) => {
          const n = ridges * 2,
            step = TW / n;
          const g = new THREE.CylinderGeometry(
            r,
            r,
            len,
            n,
            1,
            false
          ).toNonIndexed();
          const P = g.attributes.position;
          for (let i = 0; i < P.count; i++) {
            const x = P.getX(i),
              z = P.getZ(i);
            if (x * x + z * z < r * r * 0.25) continue;
            const k = Math.round(Math.atan2(x, z) / step);
            const s = k & 1 ? 1 - depth : 1;
            P.setX(i, x * s);
            P.setZ(i, z * s);
          }
          g.computeVertexNormals();
          return g;
        };
        const tslot = (w, h, slotsW, slotsH, len) => {
          const sw = 85e-4,
            sd = 0.011,
            c = 35e-4,
            x = w / 2,
            y = h / 2,
            P = [];
          P.push([-x + c, -y]);
          for (const u of slotsW)
            P.push(
              [u - sw, -y],
              [u - sw, -y + sd],
              [u + sw, -y + sd],
              [u + sw, -y]
            );
          P.push([x - c, -y], [x, -y + c]);
          for (const v of slotsH)
            P.push(
              [x, v - sw],
              [x - sd, v - sw],
              [x - sd, v + sw],
              [x, v + sw]
            );
          P.push([x, y - c], [x - c, y]);
          for (let i = slotsW.length - 1; i >= 0; i--) {
            const u = slotsW[i];
            P.push(
              [u + sw, y],
              [u + sw, y - sd],
              [u - sw, y - sd],
              [u - sw, y]
            );
          }
          P.push([-x + c, y], [-x, y - c]);
          for (let i = slotsH.length - 1; i >= 0; i--) {
            const v = slotsH[i];
            P.push(
              [-x, v + sw],
              [-x + sd, v + sw],
              [-x + sd, v - sw],
              [-x, v - sw]
            );
          }
          P.push([-x, -y + c]);
          return new THREE.ExtrudeGeometry(
            new THREE.Shape(P.map(([a, b]) => new THREE.Vector2(a, b))),
            { depth: len, bevelEnabled: false }
          );
        };
        const Z = [PI / 2, 0, 0];
        const baseM = MAT.anod(1711913, 0.5);
        const aluM = MAT.alu(8884379, 0.52);
        const blackM = MAT.blackMetal(0.5);
        const bodyM = MAT.anod(2567222, 0.42);
        const lensM = MAT.blackMetal(0.46);
        const knurlM = new THREE.MeshStandardMaterial({
          color: 3948874,
          metalness: 0.9,
          roughness: 0.36,
        });
        const glassM = new THREE.MeshPhysicalMaterial({
          color: 527123,
          metalness: 0,
          roughness: 0.2,
          clearcoat: 0.3,
          clearcoatRoughness: 0.2,
          iridescence: 1,
          iridescenceIOR: 1.6,
          iridescenceThicknessRange: [260, 640],
          envMapIntensity: 0.5,
        });
        const accM = MAT.led(ACC, 1);
        const irM = MAT.led(12589068, 0.2);
        const boxM = d.xray(MAT.anod(2567480, 0.44));
        const trayM = MAT.anod(1843498, 0.5);
        const portM = MAT.plastic(658448, 0.5);
        const steelM = MAT.steel(0.4);
        const cableM = MAT.rubber(2764600);
        d.part(flat(slab(1.36, 0.92, 0.06, 0.035, 6e-3)), baseM, {
          pos: [0, 0, 0.04],
          from: [0, 0, 0.6],
          delay: 0,
          edge: true,
        });
        const postGeo = tslot(
          POST_S,
          POST_S,
          [0],
          [0],
          POST_Y1 - POST_Y0
        ).rotateX(-PI / 2);
        const posts = d.part(
          GEO.merge([
            GEO.at(postGeo, [-POST_X, POST_Y0, BAR_Z]),
            GEO.at(postGeo, [POST_X, POST_Y0, BAR_Z]),
          ]),
          aluM,
          { from: [0, 0, -0.65], delay: 0.12 }
        );
        const feet = [];
        for (const sx of [-1, 1]) {
          feet.push(
            GEO.at(GEO.rbox(0.13, 0.014, 0.13, 5e-3, 1), [
              sx * POST_X,
              POST_Y0 + 7e-3,
              BAR_Z,
            ])
          );
          for (const [ux, uz] of [
            [-1, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
          ])
            feet.push(
              GEO.at(GEO.cyl(9e-3, 9e-3, 8e-3, 8), [
                sx * POST_X + ux * 0.048,
                POST_Y0 + 0.018,
                BAR_Z + uz * 0.048,
              ])
            );
        }
        d.part(GEO.merge(feet), blackM, { parent: posts, static: true });
        const barGeo = tslot(BAR_D, BAR_H, [0], [-0.03, 0.03], BAR_L)
          .rotateY(PI / 2)
          .translate(-BAR_L / 2, 0, 0);
        const bar = d.part(barGeo, aluM, {
          pos: [0, BAR_Y, BAR_Z],
          from: [0, 0.5, 0],
          delay: 0.26,
          edge: true,
        });
        const gus = [];
        const tri = GEO.extrude(
          [
            [0, 0],
            [0.1, 0],
            [0, 0.1],
          ],
          4e-3,
          2e-3
        );
        for (const sx of [-1, 1]) {
          gus.push(
            GEO.at(
              tri,
              [sx * (POST_X - POST_S / 2), -BAR_H / 2, BAR_D / 2],
              [0, 0, sx > 0 ? PI : -PI / 2]
            )
          );
          gus.push(
            GEO.at(
              tri,
              [sx * (POST_X + POST_S / 2), -BAR_H / 2, BAR_D / 2],
              [0, 0, sx > 0 ? -PI / 2 : PI]
            )
          );
        }
        for (const sx of [-1, 1])
          gus.push(
            GEO.at(GEO.rbox(0.014, BAR_H + 4e-3, BAR_D + 4e-3, 5e-3, 1), [
              sx * (BAR_L / 2 + 7e-3),
              0,
              0,
            ])
          );
        d.part(GEO.merge(gus), blackM, { parent: bar, static: true });
        const camBody = GEO.merge([
          GEO.rbox(0.17, 0.17, 0.2, 0.016, 2),
          GEO.at(GEO.rbox(0.13, 0.012, 0.16, 4e-3, 1), [0, -0.091, 0]),
        ]);
        const camLens = GEO.merge([
          GEO.at(
            GEO.lathe(
              [
                [0.04, 0],
                [0.049, 0],
                [0.049, 0.024],
                [0.054, 0.026],
                [0.054, 0.09],
                [0.0545, 0.125],
                [0.056, 0.158],
                [0.05, 0.16],
                [0.044, 0.158],
              ],
              36
            ),
            [0, 0, 0.112],
            Z
          ),
          GEO.at(
            GEO.lathe(
              [
                [0.054, 0.15],
                [0.06, 0.15],
                [0.071, 0.25],
                [0.067, 0.252],
                [0.052, 0.158],
              ],
              36
            ),
            [0, 0, 0.112],
            Z
          ),
        ]);
        const camMetal = GEO.merge([
          GEO.at(GEO.cyl(0.052, 0.052, 0.012, 32), [0, 0, 0.106], Z),
          GEO.at(knurl(0.06, 0.05, 30), [0, 0, 0.167], Z),
          GEO.at(knurl(0.0575, 0.022, 36, 0.05), [0, 0, 0.215], Z),
          GEO.at(GEO.cyl(0.02, 0.02, 0.024, 16), [0, -0.04, -0.112], Z),
          GEO.at(GEO.cyl(0.011, 0.014, 0.04, 12), [0, -0.04, -0.144], Z),
        ]);
        const camGlass = GEO.at(
          new THREE.SphereGeometry(0.09, 24, 6, 0, TW, 0, 0.536),
          [0, 0, 0.1887],
          Z
        );
        const camAcc = GEO.merge([
          GEO.rbox(0.174, 0.174, 0.01, 0.017, 2).translate(0, 0, 0.075),
          new THREE.BoxGeometry(0.014, 0.014, 4e-3).translate(
            0.05,
            0.055,
            -0.101
          ),
        ]);
        const cams = [
          [camBody, bodyM],
          [camLens, lensM],
          [camMetal, knurlM],
          [camGlass, glassM],
          [camAcc, accM],
        ].map(([g, m]) => {
          const im = new THREE.InstancedMesh(g, m, 4);
          im.frustumCulled = false;
          return d.part(im, null, { static: true });
        });
        const camFrom = CAM_X.map((x, k) => ({
          x,
          delay: 0.46 + 0.08 * k,
          fx: x * 0.15,
          fy: 0.42 + 0.05 * k,
          fz: 0.3,
        }));
        function poseCams(a) {
          for (let k = 0; k < 4; k++) {
            const c = camFrom[k];
            const u = 1 - easeInOut(clamp01((a - c.delay * 0.52) / 0.48));
            dummy.position.set(
              c.x + c.fx * u,
              CAM_Y + c.fy * u,
              CAM_Z + c.fz * u
            );
            dummy.rotation.set(-0.5 * u, (k < 2 ? -0.6 : 0.6) * u, 0);
            dummy.scale.setScalar(CS);
            dummy.updateMatrix();
            for (const m of cams) m.setMatrixAt(k, dummy.matrix);
          }
          for (const m of cams) m.instanceMatrix.needsUpdate = true;
        }
        poseCams(1);
        const R0 = 0.078,
          R1 = 0.15,
          RZ = -0.2,
          RD = 0.05,
          RL = 0.114;
        const ring = d.part(
          GEO.merge([
            GEO.at(
              GEO.lathe(
                [
                  [R0, 0],
                  [R1 - 4e-3, 0],
                  [R1, 6e-3],
                  [R1, RD - 8e-3],
                  [R1 - 8e-3, RD],
                  [R0 + 8e-3, RD],
                  [R0, RD - 8e-3],
                  [R0, 0],
                ],
                56
              ),
              [0, 0, RZ],
              Z
            ),
            GEO.at(GEO.cyl(0.055, 0.055, 0.07, 32), [0, 0, RZ + 0.025], Z),
            GEO.at(GEO.cyl(0.04, 0.046, 0.012, 32), [0, 0, RZ + 0.066], Z),
            GEO.at(GEO.rbox(0.07, 0.17, 0.012, 5e-3, 1), [0, -0.075, -0.214]),
          ]),
          MAT.anod(1909291, 0.44),
          { pos: [0, CAM_Y, 0], from: [0, 0.3, 0.45], delay: 0.38 }
        );
        const leds = [];
        for (let k = 0; k < 20; k++) {
          const a = (k / 20) * TW;
          leds.push(
            GEO.at(
              new THREE.SphereGeometry(0.011, 10, 5, 0, TW, 0, PI / 2),
              [Math.cos(a) * RL, Math.sin(a) * RL, RZ + RD - 2e-3],
              Z
            )
          );
        }
        d.part(GEO.merge(leds), irM, {
          parent: ring,
          static: true,
          cast: false,
        });
        const haloMat = new THREE.ShaderMaterial({
          uniforms: { uO: { value: 0.035 }, uC: { value: HDR(14165007, 1) } },
          vertexShader: `varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
          fragmentShader: `uniform float uO; uniform vec3 uC; varying vec2 vP; void main(){ float r = length(vP); float g = exp(-pow((r - 0.114) / 0.022, 2.0)); float a = g * uO; gl_FragColor = vec4(uC * a, a); }`,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        d.part(
          new THREE.Mesh(new THREE.RingGeometry(0.06, 0.18, 48, 1), haloMat),
          null,
          {
            parent: ring,
            static: true,
            pos: [0, 0, RZ + RD + 6e-3],
            cast: false,
            receive: false,
          }
        );
        const tray = d.part(
          flat(slab(BOX_W, BOX_D, 0.035, TRAY_T, 5e-3)),
          trayM,
          {
            pos: [0, BOX_Y0, BOX_Z],
            from: [0, 0, 0.55],
            delay: 0.06,
            edge: true,
          }
        );
        const tf = [];
        for (const [ux, uz] of [
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ])
          tf.push(
            GEO.at(GEO.cyl(0.03, 0.032, 0.012, 16), [
              ux * 0.35,
              -6e-3,
              uz * 0.21,
            ])
          );
        d.part(GEO.merge(tf), MAT.rubber(921620), {
          parent: tray,
          static: true,
        });
        const so = [];
        for (const [ux, uz] of [
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ])
          so.push(
            GEO.at(GEO.cyl(0.011, 0.011, SY - 0.0175 - BOX_Y0 - TRAY_T, 10), [
              ux * 0.28,
              (SY - 0.0175 - BOX_Y0 + TRAY_T) / 2,
              uz * 0.17,
            ])
          );
        d.part(GEO.merge(so), steelM, { parent: tray, static: true });
        const wallH = BOX_H - TRAY_T - COVER_T;
        const cover = d.part(
          GEO.merge([
            flat(
              slab(BOX_W, BOX_D, 0.035, wallH, 4e-3, [
                BOX_W - 0.036,
                BOX_D - 0.036,
                0.018,
              ])
            ).translate(0, TRAY_T, 0),
            flat(slab(BOX_W, BOX_D, 0.035, COVER_T, 5e-3)).translate(
              0,
              BOX_H - COVER_T,
              0
            ),
          ]),
          boxM,
          { pos: [0, BOX_Y0, BOX_Z], from: [0, 0.6, 0], delay: 0.8, edge: true }
        );
        const cfin = fin(0.022, 0.012, 0.055, 0.44);
        d.part(
          GEO.merge(
            Array.from({ length: 9 }, (_, i) =>
              GEO.at(cfin, [-0.32 + i * 0.08, BOX_H, 0])
            )
          ),
          boxM,
          { parent: cover, static: true }
        );
        const fz = BOX_D / 2,
          bz = -BOX_D / 2,
          py = 0.118 - BOX_Y0;
        d.part(
          GEO.merge([
            GEO.at(new THREE.BoxGeometry(0.076, 0.062, 0.012), [-0.27, py, fz]),
            GEO.at(new THREE.BoxGeometry(0.062, 0.026, 0.012), [
              -0.15,
              py + 0.02,
              fz,
            ]),
            GEO.at(new THREE.BoxGeometry(0.062, 0.026, 0.012), [
              -0.15,
              py - 0.02,
              fz,
            ]),
            GEO.at(GEO.cyl(0.013, 0.013, 0.014, 16), [-0.04, py, fz], Z),
            GEO.at(GEO.cyl(0.016, 0.016, 0.012, 20), [0.31, py, fz + 2e-3], Z),
            ...XC.map(x =>
              GEO.at(GEO.cyl(0.015, 0.015, 0.03, 16), [
                x,
                BOX_H + 0.015,
                bz + 0.026,
              ])
            ),
          ]),
          portM,
          { parent: cover, static: true }
        );
        d.part(
          GEO.merge([
            GEO.at(new THREE.BoxGeometry(0.05, 6e-3, 6e-3), [
              -0.27,
              py + 0.018,
              fz + 4e-3,
            ]),
            GEO.at(new THREE.BoxGeometry(0.046, 7e-3, 6e-3), [
              -0.15,
              py + 0.02,
              fz + 4e-3,
            ]),
            GEO.at(new THREE.BoxGeometry(0.046, 7e-3, 6e-3), [
              -0.15,
              py - 0.02,
              fz + 4e-3,
            ]),
            GEO.at(GEO.torus(0.0185, 35e-4, 6, 24), [-0.04, py, fz + 7e-3]),
            ...XC.map(x =>
              GEO.at(GEO.cyl(0.021, 0.022, 0.022, 20), [
                x,
                BOX_H + 0.011,
                bz + 0.026,
              ])
            ),
          ]),
          steelM,
          { parent: cover, static: true }
        );
        d.part(
          GEO.merge([
            GEO.at(GEO.torus(0.0205, 28e-4, 6, 28), [0.31, py, fz + 4e-3]),
            ...[0.17, 0.2, 0.23].map(x =>
              GEO.at(new THREE.BoxGeometry(0.012, 6e-3, 4e-3), [
                x,
                py + 0.035,
                fz + 2e-3,
              ])
            ),
            GEO.at(new THREE.BoxGeometry(0.62, 5e-3, 4e-3), [
              0,
              0.03,
              fz + 2e-3,
            ]),
          ]),
          accM,
          { parent: cover, static: true, cast: false }
        );
        const NS = 72,
          RS = 6,
          PER = RS * 6;
        const tubes = CAM_X.map((x, k) => {
          const xc = XC[k],
            ey = CAM_Y - 0.04 * CS,
            ez = CAM_Z - 0.164 * CS,
            zb = -0.31 - 6e-3 * k;
          return GEO.tube(
            [
              [xc, BOX_Y1 + 0.03, BOX_ZB + 0.026],
              [xc, BOX_Y1 + 0.12, BOX_ZB + 0.01],
              [xc * 1.1, 0.56, -0.2],
              [xc * 1.2, 0.84, zb + 0.01],
              [xc * 1.4, BAR_Y - 0.01, zb],
              [x * 0.55 + xc * 0.6, BAR_Y + 0.035, zb - 0.01],
              [x, ey - 0.03, ez - 0.035],
              [x, ey, ez],
            ],
            0.0105,
            NS,
            RS
          );
        });
        let nv = 0;
        for (const t of tubes) nv += t.attributes.position.count;
        const cPos = new Float32Array(nv * 3),
          cNor = new Float32Array(nv * 3),
          cUv = new Float32Array(nv * 2),
          cIdx = [];
        let off = 0;
        const offs = tubes.map(t => {
          cPos.set(t.attributes.position.array, off * 3);
          cNor.set(t.attributes.normal.array, off * 3);
          cUv.set(t.attributes.uv.array, off * 2);
          const o = off;
          off += t.attributes.position.count;
          return o;
        });
        for (let j = 0; j < NS; j++)
          for (let c = 0; c < tubes.length; c++) {
            const ia = tubes[c].index.array;
            for (let q = j * PER; q < (j + 1) * PER; q++)
              cIdx.push(ia[q] + offs[c]);
          }
        const cableGeo = new THREE.BufferGeometry();
        cableGeo.setAttribute("position", new THREE.BufferAttribute(cPos, 3));
        cableGeo.setAttribute("normal", new THREE.BufferAttribute(cNor, 3));
        cableGeo.setAttribute("uv", new THREE.BufferAttribute(cUv, 2));
        cableGeo.setIndex(cIdx);
        const cables = d.part(new THREE.Mesh(cableGeo, cableM), null, {
          static: true,
        });
        const fP = [],
          fU = [];
        const FL = 1.05,
          fh = Math.tan(0.36),
          fv = Math.tan(0.235);
        for (const x of CAM_X) {
          const A = [x, CAM_Y, CAM_Z + 0.27 * CS];
          const cs = [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
          ].map(([sx, sy]) => [
            x + sx * fh * FL,
            CAM_Y + sy * fv * FL,
            A[2] + FL,
          ]);
          for (let i = 0; i < 4; i++) {
            fP.push(...A, ...cs[i], ...cs[(i + 1) % 4]);
            fU.push(0.5, 0, 0, 1, 1, 1);
          }
        }
        const frGeo = new THREE.BufferGeometry();
        frGeo.setAttribute("position", new THREE.Float32BufferAttribute(fP, 3));
        frGeo.setAttribute("uv", new THREE.Float32BufferAttribute(fU, 2));
        const frMat = new THREE.ShaderMaterial({
          uniforms: { uO: { value: 0 }, uC: { value: HDR(ACC, 1) } },
          vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
          fragmentShader: `uniform float uO; uniform vec3 uC; varying vec2 vUv;
          void main(){ float v = vUv.y; float s = (vUv.x - 0.5) / max(v, 0.001) + 0.5; float edge = 1.0 - smoothstep(0.0, 0.035, min(s, 1.0 - s));
            float fade = smoothstep(0.02, 0.14, v) * (1.0 - smoothstep(0.22, 0.72, v)); float a = (0.03 + 0.1 * edge) * fade * uO; gl_FragColor = vec4(uC * a, a); }`,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        });
        const frustum = d.part(new THREE.Mesh(frGeo, frMat), null, {
          static: true,
          cast: false,
          receive: false,
        });
        frustum.visible = false;
        d.label(
          "eVIS-600 · <em>embedded vision processor</em>",
          "#818CF8",
          [0.22, BOX_Y1 + 0.07, BOX_Z + 0.12],
          [0.46, 0.8]
        );
        d.label(
          "2.3MP global shutter · <em>hardware synchronised</em>",
          "#A5B4FC",
          [-0.84, CAM_Y + 0.13, CAM_Z],
          [0.48, 0.8]
        );
        d.label(
          "850nm IR strobe · <em>IEC 62471 Risk Group 1</em>",
          "#818CF8",
          [0.04, CAM_Y + 0.3, RZ + 0.03],
          [0.5, 0.8]
        );
        d.label(
          "NXP i.MX 8M Plus · <em>2.3-TOPS NPU</em>",
          "#C7D2FE",
          [-0.16, SY + 0.05, BOX_Z - 0.05],
          [0.55, 0.78]
        );
        const irC = new THREE.Color(12589068),
          accC = new THREE.Color(ACC);
        const shell = [];
        cover.traverse(c => c.isMesh && c.material === boxM && shell.push(c));
        let lastA = -1,
          lastGrow = -1,
          lastCast = true;
        d.anim((p, time, dt, env) => {
          const a = env.fin > 0.5 ? 1 : env.a;
          if (Math.abs(a - lastA) > 1e-4) {
            lastA = a;
            poseCams(a);
            const grow = clamp01((a - 0.8) / 0.2);
            if (grow !== lastGrow) {
              lastGrow = grow;
              cableGeo.setDrawRange(0, Math.round(grow * NS) * PER * 4);
              cables.visible = grow > 0;
            }
          }
          const cast = env.x < 0.25;
          if (cast !== lastCast) {
            lastCast = cast;
            for (const m of shell) m.castShadow = cast;
          }
          const h = env.hero * (1 - env.fin);
          const ph = (time * 1.25) % 1,
            pulse = Math.exp(-Math.pow((ph - 0.5) / 0.13, 2));
          irM.color.copy(irC).multiplyScalar(0.2 + h * (0.05 + 0.42 * pulse));
          haloMat.uniforms.uO.value = 0.035 + h * (0.03 + 0.2 * pulse);
          accM.color.copy(accC).multiplyScalar(0.9 + h * 1.3 * pulse);
          frMat.uniforms.uO.value = h * (0.75 + 0.25 * pulse);
          frustum.visible = h > 0.01;
        });
        d.frame({
          dist: 4.5,
          height: 1.45,
          targetY: 0.6,
          fov: 32,
          yaw0: -0.5,
          yaw1: 0.42,
        });
        d.footprint(1.15);
        return d;
      };
      DEVICES.eelectronics = () => {
        const d = device("eelectronics");
        d.slot({ pos: [0, 0.06, 0.12], rot: [0, 0, 0], scale: 1.55 });
        const TOP = 0.06 + 0.025 * 1.55;
        const socketMat = MAT.plastic(1316637, 0.5);
        const S2 = 1.14,
          H = 0.12,
          I = 0.72,
          t = (S2 - I) / 2;
        const socket = GEO.merge([
          GEO.at(GEO.rbox(S2, H, t, 0.015), [0, 0, -(I / 2 + t / 2)]),
          GEO.at(GEO.rbox(S2, H, t, 0.015), [0, 0, I / 2 + t / 2]),
          GEO.at(GEO.rbox(t, H, I, 0.015), [-(I / 2 + t / 2), 0, 0]),
          GEO.at(GEO.rbox(t, H, I, 0.015), [I / 2 + t / 2, 0, 0]),
        ]);
        d.part(socket, socketMat, {
          pos: [0, TOP + H / 2, 0.12],
          from: [0, 0.5, 0],
          delay: 0,
          edge: true,
        });
        const latchMat = MAT.steel(0.32);
        const latches = GEO.merge([
          GEO.at(GEO.rbox(0.06, 0.03, 0.34, 0.01), [-S2 / 2 - 0.02, 0, 0]),
          GEO.at(GEO.rbox(0.06, 0.03, 0.34, 0.01), [S2 / 2 + 0.02, 0, 0]),
        ]);
        d.part(latches, latchMat, {
          pos: [0, TOP + H - 0.01, 0.12],
          from: [0, 0.55, 0],
          delay: 0.05,
        });
        const Y0 = TOP + H;
        const P = 0.9 / 23;
        const balls = new THREE.InstancedMesh(
          GEO.sphere(0.0135, 8, 5),
          MAT.steel(0.18),
          576
        );
        const ballHome = [];
        for (let i = 0; i < 24; i++)
          for (let k = 0; k < 24; k++)
            ballHome.push([
              (i - 11.5) * P,
              (k - 11.5) * P,
              Math.hypot(i - 11.5, k - 11.5) / 16.3,
            ]);
        balls.castShadow = true;
        d.part(balls, null, { pos: [0, Y0 + 0.013, 0.12], static: true });
        const subMat = MAT.pcb("brown");
        d.part(GEO.rbox(1, 0.045, 1, 0.01), subMat, {
          pos: [0, Y0 + 0.05, 0.12],
          from: [0, 0.75, 0],
          delay: 0.25,
          edge: true,
        });
        const fingers = [];
        for (let i = 0; i < 20; i++) {
          const u = -0.44 + (i / 19) * 0.88;
          fingers.push(
            GEO.at(GEO.rbox(0.018, 4e-3, 0.05, 1e-3, 1), [u, 0, 0.47]),
            GEO.at(GEO.rbox(0.018, 4e-3, 0.05, 1e-3, 1), [u, 0, -0.47])
          );
        }
        d.part(GEO.merge(fingers), MAT.gold(), {
          pos: [0, Y0 + 0.074, 0.12],
          from: [0, 0.75, 0],
          delay: 0.25,
        });
        const underfill = MAT.plastic(6965796, 0.38);
        d.part(GEO.rbox(0.56, 0.02, 0.56, 0.02), underfill, {
          pos: [0, Y0 + 0.083, 0.12],
          from: [0, 0.95, 0],
          delay: 0.4,
        });
        const dieTex = canvasTex(TXS, TXS, (g, w, h) => {
          const R = mulberry32(42268);
          g.fillStyle = "#0b1022";
          g.fillRect(0, 0, w, h);
          const u = w / 100;
          for (let bx = 0; bx < 4; bx++)
            for (let by = 0; by < 4; by++) {
              g.fillStyle = (bx + by) % 2 ? "#1a2350" : "#212a5e";
              g.fillRect(
                (6 + bx * 12) * u,
                (6 + by * 12) * u,
                10.5 * u,
                10.5 * u
              );
              g.fillStyle = "#2c3a7c";
              for (let r = 0; r < 10; r++)
                g.fillRect(
                  (6.5 + bx * 12) * u,
                  (6.8 + by * 12 + r) * u,
                  9.5 * u,
                  0.32 * u
                );
            }
          for (let i = 0; i < 12; i++)
            for (let k = 0; k < 12; k++) {
              g.fillStyle = R() < 0.5 ? "#3b2a18" : "#4a3420";
              g.fillRect(
                (56 + i * 3.4) * u,
                (6 + k * 3.4) * u,
                2.8 * u,
                2.8 * u
              );
            }
          g.fillStyle = "#16203f";
          for (let i = 0; i < 1400; i++)
            g.fillRect(
              (56 + R() * 38) * u,
              (50 + R() * 44) * u,
              (0.3 + R() * 0.8) * u,
              (0.2 + R() * 0.5) * u
            );
          g.strokeStyle = "#8c7446";
          g.lineWidth = 0.5 * u;
          g.strokeRect(2 * u, 2 * u, 96 * u, 96 * u);
        });
        const dieEmit = canvasTex(TXS / 2, TXS / 2, (g, w, h) => {
          g.fillStyle = "#000";
          g.fillRect(0, 0, w, h);
          const u = w / 100;
          g.fillStyle = "rgba(251, 191, 36, 0.9)";
          for (let i = 0; i < 12; i++)
            for (let k = 0; k < 12; k++)
              if ((i * 7 + k * 3) % 5 < 2)
                g.fillRect(
                  (56.8 + i * 3.4) * u,
                  (6.8 + k * 3.4) * u,
                  1.2 * u,
                  1.2 * u
                );
          g.fillStyle = "rgba(125, 211, 252, 0.6)";
          for (let r = 0; r < 4; r++)
            g.fillRect(6 * u, (11 + r * 12) * u, 46 * u, 0.4 * u);
        });
        const dieMat = new THREE.MeshPhysicalMaterial({
          map: dieTex,
          emissive: 16777215,
          emissiveMap: dieEmit,
          emissiveIntensity: 0.6,
          metalness: 0.55,
          roughness: 0.16,
          iridescence: 0.9,
          iridescenceIOR: 1.9,
          iridescenceThicknessRange: [180, 520],
          clearcoat: 1,
          clearcoatRoughness: 0.05,
        });
        const dieSide = MAT.blackMetal(0.3);
        d.part(
          new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.028, 0.5), [
            dieSide,
            dieSide,
            dieMat,
            dieSide,
            dieSide,
            dieSide,
          ]),
          null,
          {
            pos: [0, Y0 + 0.103, 0.12],
            from: [0, 1.15, 0],
            spin: [0, 1.2, 0],
            delay: 0.5,
            edge: true,
          }
        );
        d.part(GEO.rbox(0.5, 8e-3, 0.5, 3e-3), MAT.plastic(9278366, 0.72), {
          pos: [0, Y0 + 0.122, 0.12],
          from: [0, 1.3, 0],
          delay: 0.62,
        });
        const lidMat = d.xray(MAT.steel(0.3));
        const lid = GEO.merge([
          GEO.at(GEO.rbox(0.94, 0.03, 0.94, 0.02), [0, 0, 0]),
          GEO.at(GEO.rbox(0.66, 0.03, 0.66, 0.02), [0, 0.028, 0]),
        ]);
        d.part(lid, lidMat, {
          pos: [0, Y0 + 0.14, 0.12],
          from: [0, 1.45, 0],
          spin: [0, -0.8, 0],
          delay: 0.72,
          edge: true,
        });
        const sinkMat = d.xray(MAT.anod(1448740, 0.5));
        const sink = [GEO.at(GEO.rbox(0.98, 0.06, 0.98, 0.015), [0, 0, 0])];
        for (let i = 0; i < 15; i++)
          sink.push(
            GEO.at(GEO.rbox(0.028, 0.44, 0.98, 6e-3, 1), [
              -0.46 + (i / 14) * 0.92,
              0.25,
              0,
            ])
          );
        d.part(GEO.merge(sink), sinkMat, {
          pos: [0, Y0 + 0.2, 0.12],
          from: [0, 1.1, -1.4],
          spin: [0.5, 0, 0],
          delay: 0.84,
        });
        d.label(
          "eASIC-Vision · <em>7 nm vision ASIC</em>",
          "#FBBF24",
          [0, Y0 + 0.78, 0.12],
          [0.46, 0.8]
        );
        d.label(
          "BGA-576 · 25 × 25 mm",
          "#FBBF24",
          [0.52, Y0 + 0.02, 0.62],
          [0.5, 0.8]
        );
        d.label(
          "Die · 32 MB on-chip SRAM",
          "#FDE68A",
          [-0.18, Y0 + 0.12, 0.3],
          [0.54, 0.76]
        );
        d.label(
          "PCIe 4.0 ×4 · MIPI CSI-2 ×4 · LPDDR5",
          "#FBBF24",
          [-0.6, TOP + 0.02, 0.8],
          [0.58, 0.8]
        );
        let lastBallA = -1;
        d.anim((p, time, dt, env) => {
          const a = env.fin > 0.5 ? 1 : env.a;
          if (Math.abs(a - lastBallA) > 1e-4) {
            lastBallA = a;
            for (let n = 0; n < 576; n++) {
              const [x, z, r] = ballHome[n];
              const e = easeInOut(clamp01((a - 0.08 - r * 0.2) / 0.22));
              dummy.position.set(x, (1 - e) * 0.6, z);
              dummy.rotation.set(0, 0, 0);
              dummy.scale.setScalar(0.2 + 0.8 * e);
              dummy.updateMatrix();
              balls.setMatrixAt(n, dummy.matrix);
            }
            balls.instanceMatrix.needsUpdate = true;
          }
          dieMat.emissiveIntensity =
            0.35 + 0.9 * env.hero * (0.6 + 0.4 * Math.sin(time * 3.2));
        });
        d.frame({
          dist: 3.5,
          height: 1.55,
          targetY: 0.42,
          fov: 30,
          yaw0: -0.6,
          yaw1: 0.38,
        });
        d.footprint(0.95);
        return d;
      };
      DEVICES.eenergy = () => {
        const d = device("eenergy");
        const ACC = 16096779;
        const HALF = Math.PI / 2;
        const NC = 7,
          NR = 5,
          P = 0.2,
          CR = 0.092,
          CH = 0.62;
        const X0 = -0.34,
          Z0 = -0.4,
          CB = 0.1;
        const cellX = i => X0 + i * P,
          cellZ = k => Z0 + k * P;
        const TW = 2.04,
          TD = 1.22,
          TR = 0.06;
        const LID_Y0 = 0.2,
          LID_Y1 = 0.82;
        const HX = 0.26,
          HW = 1.44,
          HD = 1.06;
        const BXC = -0.73,
          BYC = 0.33,
          BZC = 0.02,
          BS = 0.75;
        d.slot({ pos: [BXC, BYC, BZC], rot: [0, HALF, 0], scale: BS });
        const BOARD_TOP = BYC + 0.025 * BS,
          BOARD_BOT = BYC - 0.025 * BS;
        const BOX = (w, h, dd) => new THREE.BoxGeometry(w, h, dd);
        const tint = (geo, hex) => {
          const g = geo.index ? geo.toNonIndexed() : geo;
          const c = new THREE.Color(hex),
            n = g.attributes.position.count,
            a = new Float32Array(n * 3);
          for (let i = 0; i < n; i++) {
            a[i * 3] = c.r;
            a[i * 3 + 1] = c.g;
            a[i * 3 + 2] = c.b;
          }
          g.setAttribute("color", new THREE.BufferAttribute(a, 3));
          return g;
        };
        const T = (geo, hex, pos, rot, scl) =>
          tint(GEO.at(geo, pos, rot, scl), hex);
        const v2 = pts => pts.map(([a, b]) => new THREE.Vector2(a, b));
        const rrect = (w, h, r, n = 5) => {
          const pts = [];
          const cs = [
            [w / 2 - r, h / 2 - r, 0],
            [-w / 2 + r, h / 2 - r, HALF],
            [-w / 2 + r, -h / 2 + r, Math.PI],
            [w / 2 - r, -h / 2 + r, Math.PI * 1.5],
          ];
          for (const [cx, cy, a0] of cs)
            for (let i = 0; i <= n; i++) {
              const a = a0 + (i / n) * HALF;
              pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
            }
          return pts;
        };
        const wallRing = (w, dd, r, t, h, bevel = 4e-3) => {
          const s = new THREE.Shape(
            v2(rrect(w - 2 * bevel, dd - 2 * bevel, r))
          );
          s.holes.push(
            new THREE.Path(
              v2(rrect(w - 2 * t, dd - 2 * t, Math.max(5e-3, r - t)))
            )
          );
          return new THREE.ExtrudeGeometry(s, {
            depth: h - 2 * bevel,
            bevelEnabled: true,
            bevelThickness: bevel,
            bevelSize: bevel,
            bevelSegments: 2,
            curveSegments: 4,
          })
            .rotateX(-HALF)
            .translate(0, bevel, 0);
        };
        const slab = (w, dd, r, h, bevel = 6e-3) =>
          new THREE.ExtrudeGeometry(
            new THREE.Shape(v2(rrect(w - 2 * bevel, dd - 2 * bevel, r))),
            {
              depth: h - 2 * bevel,
              bevelEnabled: true,
              bevelThickness: bevel,
              bevelSize: bevel,
              bevelSegments: 2,
              curveSegments: 4,
            }
          )
            .rotateX(-HALF)
            .translate(0, bevel, 0);
        const hexBolt = (r, h) => GEO.cyl(r, r, h, 6);
        const trayMat = MAT.anod(1514532, 0.5);
        const holderMat = MAT.plastic(987670, 0.6);
        const brass = MAT.gold();
        brass.color.set(12098142);
        brass.roughness = 0.38;
        const nickel = MAT.steel(0.34);
        nickel.vertexColors = true;
        const copper = MAT.copper();
        copper.vertexColors = true;
        copper.roughness = 0.36;
        const wrapMat = new THREE.MeshPhysicalMaterial({
          color: 1779254,
          metalness: 0,
          roughness: 0.34,
          clearcoat: 0.7,
          clearcoatRoughness: 0.18,
        });
        const paperMat = MAT.plastic(13616818, 0.7);
        const capMat = MAT.steel(0.52);
        capMat.color.set(10725809);
        capMat.envMapIntensity = 0.75;
        const wireMat = MAT.plastic(16777215, 0.5);
        wireMat.vertexColors = true;
        const rubber = MAT.rubber(16777215);
        rubber.vertexColors = true;
        const lidMat = d.xray(
          new THREE.MeshPhysicalMaterial({
            color: 2304822,
            metalness: 0,
            roughness: 0.22,
            transparent: true,
            opacity: 0.46,
            clearcoat: 0.2,
            clearcoatRoughness: 0.32,
            envMapIntensity: 0.36,
          })
        );
        lidMat.userData.noAO = true;
        {
          const g = new THREE.Group();
          g.add(
            new THREE.Mesh(
              GEO.merge([
                GEO.at(GEO.rbox(TW, 0.05, TD, 0.022, 2), [0, 0.025, 0]),
                wallRing(TW, TD, TR, 0.035, LID_Y0 - 0.05).translate(
                  0,
                  0.05,
                  0
                ),
              ]),
              trayMat
            )
          );
          g.add(
            new THREE.Mesh(
              GEO.at(GEO.rbox(HW, 0.05, HD, 0.015, 2), [HX, 0.075, 0]),
              holderMat
            )
          );
          const so = [];
          for (const [sx, sz] of [
            [BXC - 0.185, BZC - 0.3],
            [BXC + 0.185, BZC - 0.3],
            [BXC - 0.185, BZC + 0.3],
            [BXC + 0.185, BZC + 0.3],
          ])
            so.push(
              GEO.at(hexBolt(0.016, BOARD_BOT - 0.05), [
                sx,
                (BOARD_BOT + 0.05) / 2,
                sz,
              ])
            );
          g.add(new THREE.Mesh(GEO.merge(so), brass));
          g.add(
            new THREE.Mesh(
              wallRing(
                TW - 0.012,
                TD - 0.012,
                TR - 6e-3,
                0.026,
                0.012,
                3e-3
              ).translate(0, LID_Y0 - 2e-3, 0),
              MAT.rubber(790033)
            )
          );
          d.part(g, null, { from: [0, 0, -1], delay: 0, edge: true });
        }
        const N2 = NC * NR;
        const wrapGeo = GEO.lathe(
          [
            [CR, 0],
            [CR, CH - 0.02],
            [CR - 2e-3, CH - 8e-3],
            [CR - 8e-3, CH - 2e-3],
            [CR - 0.015, CH - 15e-4],
          ],
          18
        );
        const ringG = new THREE.RingGeometry(0.043, CR - 0.012, 18, 1)
          .rotateX(-HALF)
          .translate(0, CH - 25e-4, 0);
        const capG = GEO.lathe(
          [
            [0.043, CH - 4e-3],
            [0.043, CH + 5e-3],
            [0.038, CH + 0.011],
            [5e-4, CH + 0.012],
          ],
          16
        );
        const wraps = new THREE.InstancedMesh(wrapGeo, wrapMat, N2);
        const rings = new THREE.InstancedMesh(ringG, paperMat, N2);
        const caps = new THREE.InstancedMesh(capG, capMat, N2);
        const cellInst = [wraps, rings, caps];
        const home = [];
        for (let i = 0; i < NC; i++)
          for (let k = 0; k < NR; k++)
            home.push([
              cellX(i),
              cellZ(k),
              (i + k * 0.6) / (NC - 1 + (NR - 1) * 0.6),
              i,
            ]);
        for (const m of cellInst) {
          m.frustumCulled = false;
          d.part(m, null, { static: true });
        }
        const haloTex = canvasTex(128, 128, (g, w, h) => {
          const gr = g.createRadialGradient(
            w / 2,
            h / 2,
            0,
            w / 2,
            h / 2,
            w / 2
          );
          gr.addColorStop(0, "rgba(255,255,255,1)");
          gr.addColorStop(0.35, "rgba(150,150,150,1)");
          gr.addColorStop(1, "rgba(0,0,0,1)");
          g.fillStyle = gr;
          g.fillRect(0, 0, w, h);
        });
        const haloMat = new THREE.MeshBasicMaterial({
          map: haloTex,
          color: new THREE.Color(1, 1, 1).multiplyScalar(1.6),
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const halos = new THREE.InstancedMesh(
          new THREE.PlaneGeometry(0.3, 0.3).rotateX(-HALF),
          haloMat,
          N2
        );
        const BLACK = new THREE.Color(0, 0, 0),
          AMB = new THREE.Color(ACC),
          tmpCol = new THREE.Color();
        home.forEach(([x, z], n) => {
          dummy.position.set(x, CB + CH + 0.022, z);
          dummy.rotation.set(0, 0, 0);
          dummy.scale.setScalar(1);
          dummy.updateMatrix();
          halos.setMatrixAt(n, dummy.matrix);
          halos.setColorAt(n, BLACK);
        });
        halos.instanceColor.needsUpdate = true;
        halos.renderOrder = 1;
        d.part(halos, null, { static: true, cast: false, receive: false });
        {
          const s = new THREE.Shape(v2(rrect(HW, HD, 0.03)));
          for (let i = 0; i < NC; i++)
            for (let k = 0; k < NR; k++) {
              const hp = new THREE.Path();
              hp.absarc(
                cellX(i) - HX,
                -cellZ(k),
                CR + 4e-3,
                0,
                Math.PI * 2,
                true
              );
              s.holes.push(hp);
            }
          const top = new THREE.ExtrudeGeometry(s, {
            depth: 0.035,
            bevelEnabled: false,
            curveSegments: 9,
          }).rotateX(-HALF);
          d.part(top, holderMat, {
            pos: [HX, 0.665, 0],
            from: [0, 0.75, 0],
            delay: 0.5,
          });
        }
        const SY = CB + CH + 0.015;
        let strips, power, harness;
        {
          const nb = [];
          for (let i = 0; i < NC; i++) {
            const x = cellX(i);
            nb.push(T(BOX(0.05, 6e-3, 1.03), 14999766, [x, SY, 0.02]));
            nb.push(
              T(BOX(0.05, 0.054, 6e-3), 14999766, [x, SY - 0.024, 0.538])
            );
            for (let k = 0; k < NR; k++)
              for (const [dx, dz] of [
                [-0.012, -0.02],
                [0.012, -0.02],
                [-0.012, 0.02],
                [0.012, 0.02],
              ])
                nb.push(
                  T(BOX(9e-3, 2e-3, 9e-3), 7236194, [
                    x + dx,
                    SY + 35e-4,
                    cellZ(k) + dz,
                  ])
                );
          }
          for (let i = 0; i < NC - 1; i++)
            nb.push(
              T(BOX(P + 0.05, 6e-3, 0.05), 14999766, [
                cellX(i) + P / 2,
                SY + 1e-3,
                i % 2 ? 0.47 : -0.47,
              ])
            );
          strips = d.part(GEO.merge(nb), nickel, { static: true });
        }
        const PX = -0.88,
          PZ = 0.47,
          SH = 0.26,
          SX = -0.6;
        {
          const g = new THREE.Group();
          const cu = [
            T(GEO.rbox(cellX(0) - PX + 0.06, 0.016, 0.07, 5e-3, 1), 16777215, [
              (cellX(0) + PX) / 2,
              SY + 4e-3,
              -PZ,
            ]),
            T(GEO.rbox(0.07, 0.05, 0.08, 8e-3, 1), 16777215, [SX, SH, PZ]),
            T(GEO.rbox(0.07, 0.05, 0.08, 8e-3, 1), 16777215, [PX, SH, PZ]),
            T(GEO.rbox(SX - PX - 0.06, 0.012, 0.05, 4e-3, 1), 9210502, [
              (SX + PX) / 2,
              SH + 5e-3,
              PZ,
            ]),
            T(GEO.rbox(0.03, 0.035, 0.05, 4e-3, 1), 16777215, [
              SX - 0.08,
              SH - 5e-3,
              PZ,
            ]),
            T(GEO.rbox(0.03, 0.035, 0.05, 4e-3, 1), 16777215, [
              PX + 0.08,
              SH - 5e-3,
              PZ,
            ]),
          ];
          g.add(new THREE.Mesh(GEO.merge(cu), copper));
          const st = [];
          st.push(T(hexBolt(0.018, 0.016), 13225686, [SX, SH + 0.033, PZ]));
          for (const bx of [SX, PX])
            st.push(
              T(GEO.rbox(0.07, SH - 0.075, 0.07, 0.01, 1), 2764598, [
                bx,
                0.05 + (SH - 0.075) / 2,
                PZ,
              ])
            );
          st.push(
            T(hexBolt(0.016, 0.012), 13225686, [PX + 0.04, SY + 0.018, -PZ])
          );
          g.add(new THREE.Mesh(GEO.merge(st), nickel));
          power = d.part(g, null, { static: true });
        }
        {
          const ws = [];
          const tones = [
            13883356, 10134188, 13883356, 3817286, 13883356, 10134188, 13883356,
          ];
          const PLUG = [BXC + 0.2, BOARD_TOP + 0.014, BZC + 0.12],
            XBAY = -0.5;
          for (let i = 0; i < NC; i++) {
            const x = cellX(i),
              yb = 0.66 - i * 8e-3,
              zb = 0.566 + (i % 2) * 8e-3;
            const pts = [
              [x, SY - 0.05, 0.542],
              [x - 0.01, yb + 0.012, 0.556],
              [x - 0.05, yb, zb],
            ];
            for (let s = 1; s <= 3; s++) {
              const xx = x - 0.05 + ((XBAY - x + 0.05) * s) / 3;
              if (xx < x - 0.08) pts.push([xx, yb, zb]);
            }
            pts.push(
              [XBAY - 0.04, yb - 0.02, zb - 0.02],
              [-0.565, 0.48 - i * 4e-3, 0.46 - i * 4e-3],
              [PLUG[0] + 0.01, PLUG[1] + 0.02, PLUG[2] + 0.08 - i * 0.012],
              [PLUG[0], PLUG[1] + 4e-3, PLUG[2] + 0.045 - i * 0.012]
            );
            ws.push(tint(GEO.tube(pts, 55e-4, 48, 5), tones[i]));
          }
          ws.push(
            T(GEO.rbox(0.05, 0.03, 0.12, 6e-3, 1), 15328472, [
              PLUG[0],
              PLUG[1],
              PLUG[2],
            ])
          );
          harness = d.part(GEO.merge(ws), wireMat, { static: true });
        }
        {
          const g = new THREE.Group();
          const lid = new THREE.Mesh(
            GEO.merge([
              wallRing(TW, TD, TR, 0.012, LID_Y1 - LID_Y0 - 0.02).translate(
                0,
                LID_Y0,
                0
              ),
              slab(TW, TD, TR, 0.022, 8e-3).translate(0, LID_Y1 - 0.022, 0),
            ]),
            lidMat
          );
          lid.renderOrder = 2;
          lid.castShadow = false;
          g.add(lid);
          const st = [];
          for (const [sx, sz] of [
            [-0.96, -0.55],
            [0.96, -0.55],
            [-0.96, 0.55],
            [0.96, 0.55],
            [0, -0.55],
            [0, 0.55],
          ])
            st.push(
              T(GEO.cyl(0.016, 0.016, 8e-3, 12), 13225686, [
                sx,
                LID_Y1 + 4e-3,
                sz,
              ]),
              T(BOX(0.018, 3e-3, 4e-3), 2763824, [sx, LID_Y1 + 9e-3, sz])
            );
          for (const sz of [-PZ, PZ])
            st.push(T(hexBolt(0.032, 0.02), 13225686, [PX, LID_Y1 + 0.01, sz]));
          g.add(new THREE.Mesh(GEO.merge(st), nickel));
          const posts = [
            GEO.at(GEO.cyl(0.018, 0.018, LID_Y1 - SY + 0.03, 12), [
              PX,
              (LID_Y1 + SY) / 2,
              -PZ,
            ]),
            GEO.at(GEO.cyl(0.018, 0.018, LID_Y1 - SH - 0.025 + 0.03, 12), [
              PX,
              (LID_Y1 + SH + 0.025) / 2,
              PZ,
            ]),
          ];
          g.add(
            new THREE.Mesh(GEO.merge(posts.map(p => tint(p, 16777215))), copper)
          );
          const boot = GEO.lathe(
            [
              [0.046, 0],
              [0.047, 0.03],
              [0.04, 0.06],
              [0.024, 0.078],
              [5e-4, 0.082],
            ],
            20
          );
          g.add(
            new THREE.Mesh(
              GEO.merge([
                T(boot, 14191120, [PX, LID_Y1 + 4e-3, -PZ]),
                T(boot, 1382170, [PX, LID_Y1 + 4e-3, PZ]),
              ]),
              rubber
            )
          );
          d.part(g, null, { from: [0, 0.95, 0], delay: 1, edge: true });
          lid.castShadow = false;
        }
        d.label(
          "eBMS-100A · <em>Battery management system 100A</em>",
          "#F59E0B",
          [BXC, LID_Y1 + 0.2, BZC - 0.05],
          [0.46, 0.8]
        );
        d.label(
          "Active balancing · <em>500mA per cell</em>",
          "#F59E0B",
          [cellX(4), SY + 0.01, cellZ(4)],
          [0.47, 0.8]
        );
        d.label(
          "Cell monitoring · <em>LTC6813 (18-cell, 16-bit)</em>",
          "#FCD34D",
          [cellX(3), 0.64, 0.58],
          [0.5, 0.8]
        );
        d.label(
          "MCU · <em>STM32G474</em>",
          "#F59E0B",
          [BXC + 0.05, BOARD_TOP + 0.01, BZC - 0.05],
          [0.55, 0.78]
        );
        let lastA = -1,
          lastWave = false;
        d.anim((p, time, dt, env) => {
          const a = env.fin > 0.5 ? 1 : env.a;
          if (Math.abs(a - lastA) > 1e-4) {
            lastA = a;
            dummy.rotation.set(0, 0, 0);
            dummy.scale.setScalar(1);
            for (let n = 0; n < N2; n++) {
              const h = home[n];
              const e = easeInOut(clamp01((a - 0.24 - h[2] * 0.28) / 0.18));
              dummy.position.set(h[0], CB + (1 - e) * 1.25, h[1]);
              dummy.updateMatrix();
              for (let q = 0; q < 3; q++)
                cellInst[q].setMatrixAt(n, dummy.matrix);
            }
            for (let q = 0; q < 3; q++)
              cellInst[q].instanceMatrix.needsUpdate = true;
            strips.position.y = 0.4 * (1 - easeInOut(clamp01((a - 0.7) / 0.1)));
            power.position.y = 0.4 * (1 - easeInOut(clamp01((a - 0.72) / 0.1)));
            harness.position.y =
              0.35 * (1 - easeInOut(clamp01((a - 0.76) / 0.1)));
          }
          const on = env.hero * (1 - env.fin);
          if (on > 1e-3) {
            const head = ((time * 2.4) % (NC + 4)) - 2;
            for (let n = 0; n < N2; n++) {
              const ph = home[n][3] + (n % NR) * 0.12;
              const w = Math.exp(-Math.pow((ph - head) / 0.85, 2)) * on;
              halos.setColorAt(n, tmpCol.copy(AMB).multiplyScalar(w));
            }
            halos.instanceColor.needsUpdate = true;
            lastWave = true;
          } else if (lastWave) {
            for (let n = 0; n < N2; n++) halos.setColorAt(n, BLACK);
            halos.instanceColor.needsUpdate = true;
            lastWave = false;
          }
          halos.visible = on > 1e-3;
        });
        d.frame({
          dist: 4.15,
          height: 1.5,
          targetY: 0.36,
          fov: 32,
          yaw0: -0.45,
          yaw1: 0.3,
        });
        d.footprint(1.15);
        return d;
      };
      DEVICES.efrontier = () => {
        const d = device("efrontier");
        const PI = Math.PI,
          TW = PI * 2;
        const ACC = 12616956;
        const FINISH = [
          ["gun", 4672597, 0.42, 0.85, 0.2, 0],
          ["gunD", 2237997, 0.48, 0.8, 0.15, 0],
          ["ti", 9409433, 0.4, 1, 0.05, 0],
          ["truss", 2896185, 0.42, 0.85, 0.2, 0],
          ["node", 10133157, 0.36, 1, 0.1, 0],
          ["led", 1971238, 0.4, 0, 0, ACC],
          ["black", 724240, 0.55, 0.2, 0.1, 0],
          ["lens", 329483, 0.12, 0, 1, 0],
          ["goldC", 13213770, 0.36, 1, 0, 0],
          ["silver", 12172998, 0.48, 1, 0, 0],
          ["white", 13225169, 0.6, 0, 0.1, 0],
          ["kapton", 9067036, 0.55, 0.3, 0.2, 0],
          ["green", 862746, 0.4, 0, 0, 3462041],
        ];
        const NF = FINISH.length,
          U = {};
        const pcol = new Uint8Array(NF * 4),
          porm = new Uint8Array(NF * 4),
          pemi = new Uint8Array(NF * 4);
        FINISH.forEach(([n, c, r, m, cc, e], i) => {
          pcol.set([(c >> 16) & 255, (c >> 8) & 255, c & 255, 255], i * 4);
          porm.set(
            [
              Math.round(cc * 255),
              Math.round(r * 255),
              Math.round(m * 255),
              255,
            ],
            i * 4
          );
          pemi.set([(e >> 16) & 255, (e >> 8) & 255, e & 255, 255], i * 4);
          U[n] = (i + 0.5) / NF;
        });
        const dataTex = (data, cs) => {
          const t = new THREE.DataTexture(data, NF, 1);
          t.magFilter = t.minFilter = THREE.NearestFilter;
          t.generateMipmaps = false;
          t.colorSpace = cs;
          t.needsUpdate = true;
          return t;
        };
        const palMap = dataTex(pcol, THREE.SRGBColorSpace),
          palOrm = dataTex(porm, THREE.NoColorSpace),
          palEm = dataTex(pemi, THREE.SRGBColorSpace);
        const palette = k =>
          new THREE.MeshPhysicalMaterial({
            map: palMap,
            roughness: 1,
            roughnessMap: palOrm,
            metalness: 1,
            metalnessMap: palOrm,
            clearcoat: 1,
            clearcoatMap: palOrm,
            clearcoatRoughness: 0.3,
            emissive: 16777215,
            emissiveMap: palEm,
            emissiveIntensity: k,
          });
        const PAL = palette(1.9);
        const PALX = d.xray(palette(1.9));
        const paint = (geo, name) => {
          const u = U[name],
            a = geo.attributes.uv;
          for (let i = 0; i < a.count; i++) a.setXY(i, u, 0.5);
          return geo;
        };
        const F = (geo, name, pos, rot, scl) =>
          paint(GEO.at(geo, pos, rot, scl), name);
        const lat = (pts, n = 40) => GEO.lathe(pts, n);
        const toX = g => g.rotateZ(-PI / 2);
        const Y = new THREE.Vector3(0, 1, 0);
        const strut = (a, b, r, n = 8) => {
          const A = new THREE.Vector3(...a),
            B = new THREE.Vector3(...b),
            dir = B.clone().sub(A);
          const g = GEO.cyl(r, r, dir.length(), n, true);
          g.applyMatrix4(
            new THREE.Matrix4().compose(
              A.clone().add(B).multiplyScalar(0.5),
              new THREE.Quaternion().setFromUnitVectors(Y, dir.normalize()),
              new THREE.Vector3(1, 1, 1)
            )
          );
          return g;
        };
        const TY = 0.26,
          BW2 = 1.3,
          BD2 = 0.9,
          BH2 = 0.4,
          PY = TY + BH2;
        const BX = -0.4,
          BZ = -0.14;
        const CX = 0.24,
          CZ = 0.16,
          CW = 0.54,
          CDp = 0.38,
          CH = 0.15;
        const BS = 0.52;
        d.slot({
          pos: [CX, PY + 0.03 + 0.012 + 0.025 * BS, CZ],
          rot: [0, 0, 0],
          scale: BS,
        });
        const tr = [];
        const XS = [-0.6, 0, 0.6],
          ZS = [-0.42, 0.42],
          y0 = 0.02,
          y1 = TY - 0.012;
        for (const x of XS)
          for (const z of ZS) tr.push(strut([x, y0, z], [x, y1, z], 0.018, 10));
        for (const y of [y0, y1]) {
          for (const z of ZS)
            tr.push(strut([-0.6, y, z], [0.6, y, z], 0.016, 10));
          for (const x of XS)
            tr.push(strut([x, y, -0.42], [x, y, 0.42], 0.016, 10));
        }
        for (const z of ZS)
          for (let i = 0; i < 2; i++) {
            tr.push(
              strut([XS[i], y0, z], [XS[i + 1], y1, z], 0.012),
              strut([XS[i], y1, z], [XS[i + 1], y0, z], 0.012)
            );
          }
        for (const x of [-0.6, 0.6])
          tr.push(
            strut([x, y0, -0.42], [x, y1, 0.42], 0.012),
            strut([x, y1, -0.42], [x, y0, 0.42], 0.012)
          );
        const trussGeo = paint(GEO.merge(tr), "truss");
        const nodes = [];
        for (const x of XS)
          for (const z of ZS)
            for (const y of [y0, y1])
              nodes.push(
                F(GEO.rbox(0.05, 0.05, 0.05, 0.01, 1), "node", [x, y, z])
              );
        for (const x of [-0.6, 0.6])
          for (const y of [y0, y1])
            nodes.push(
              F(GEO.rbox(0.04, 0.04, 0.04, 8e-3, 1), "node", [x, y, 0])
            );
        for (const x of [-0.6, 0.6])
          for (const z of ZS)
            nodes.push(
              F(GEO.cyl(0.03, 0.034, 0.014, 12), "gunD", [x, 7e-3, z])
            );
        d.part(GEO.merge([trussGeo, ...nodes]), PAL, {
          from: [0, 0.35, 0],
          delay: 0,
        });
        const S2 = TXS;
        const WX = [0, 0],
          WY = [0, 0];
        const wrapAt = (x, y, r, w, h, fn) => {
          const nx = (WX[1] = x < r ? w : x > w - r ? -w : 0) ? 2 : 1;
          const ny = (WY[1] = y < r ? h : y > h - r ? -h : 0) ? 2 : 1;
          for (let i = 0; i < nx; i++)
            for (let j = 0; j < ny; j++) fn(x + WX[i], y + WY[j]);
        };
        const PX = new Float32Array(16);
        const facets = (g, w, h, R, n, smin, smax, fill2) => {
          for (let i = 0; i < n; i++) {
            const cx = R() * w,
              cy = R() * h,
              s = (smin + R() * (smax - smin)) * w;
            g.fillStyle = fill2(R);
            const k = 3 + ((R() * 3) | 0);
            for (let j = 0; j < k; j++) {
              const aa = (j / k) * TW + R() * 0.9,
                rr = s * (0.45 + R() * 0.7);
              PX[j * 2] = cx + Math.cos(aa) * rr;
              PX[j * 2 + 1] = cy + Math.sin(aa) * rr * (0.55 + R() * 0.6);
            }
            wrapAt(cx, cy, s * 1.4, w, h, (px, py) => {
              const ox = px - cx,
                oy = py - cy;
              g.beginPath();
              for (let j = 0; j < k; j++) {
                if (j) g.lineTo(PX[j * 2] + ox, PX[j * 2 + 1] + oy);
                else g.moveTo(PX[0] + ox, PX[1] + oy);
              }
              g.closePath();
              g.fill();
            });
          }
        };
        const SEAMS = [0.27, 0.64],
          SEAMV = [0.42];
        const nrm = (t, R) => {
          const a = R() * TW,
            k = t * (0.3 + R() * 0.7);
          return [
            ((Math.cos(a) * k * 0.5 + 0.5) * 255) | 0,
            ((Math.sin(a) * k * 0.5 + 0.5) * 255) | 0,
            ((Math.sqrt(1 - k * k) * 0.5 + 0.5) * 255) | 0,
          ];
        };
        const mliN = canvasTex(S2, S2, (g, w, h) => {
          const R = mulberry32(14865);
          g.fillStyle = "rgb(128,128,255)";
          g.fillRect(0, 0, w, h);
          for (let i = 0; i < 80; i++) {
            const x = R() * w,
              y = R() * h,
              r = (0.06 + R() * 0.12) * w,
              a = R() * TW,
              t = 0.1 + R() * 0.08;
            const col = `${((Math.cos(a) * t * 0.5 + 0.5) * 255) | 0},${((Math.sin(a) * t * 0.5 + 0.5) * 255) | 0},250`;
            wrapAt(x, y, r, w, h, (px, py) => {
              const gr = g.createRadialGradient(px, py, 0, px, py, r);
              gr.addColorStop(0, `rgba(${col},0.95)`);
              gr.addColorStop(1, `rgba(${col},0)`);
              g.fillStyle = gr;
              g.fillRect(px - r, py - r, 2 * r, 2 * r);
            });
          }
          facets(
            g,
            w,
            h,
            R,
            1400,
            0.02,
            0.06,
            R2 => `rgba(${nrm(0.3, R2).join(",")},0.92)`
          );
          facets(
            g,
            w,
            h,
            R,
            900,
            8e-3,
            0.02,
            R2 => `rgba(${nrm(0.36, R2).join(",")},0.85)`
          );
          for (let i = 0; i < 120; i++) {
            const x = R() * w,
              y = R() * h;
            const a = R() * TW,
              L = (0.04 + R() * 0.12) * w,
              nx = -Math.sin(a),
              ny = Math.cos(a);
            wrapAt(x, y, L, w, h, (px, py) => {
              for (const side of [-1, 1]) {
                g.strokeStyle = `rgba(${((side * nx * 0.36 * 0.5 + 0.5) * 255) | 0},${((side * ny * 0.36 * 0.5 + 0.5) * 255) | 0},240,0.9)`;
                g.lineWidth = 1.2 + R() * 1.2;
                g.beginPath();
                g.moveTo(px + side * nx * 1.2, py + side * ny * 1.2);
                g.lineTo(
                  px + Math.cos(a) * L + side * nx * 1.2,
                  py + Math.sin(a) * L + side * ny * 1.2
                );
                g.stroke();
              }
            });
          }
          g.fillStyle = "rgb(128,128,255)";
          for (const sv of SEAMS)
            g.fillRect(sv * w - w * 0.012, 0, w * 0.024, h);
          for (const sv of SEAMV)
            g.fillRect(0, sv * h - h * 0.012, w, h * 0.024);
          g.fillStyle = "rgba(128,100,240,0.8)";
          for (const sv of SEAMS)
            for (const e of [-1, 1])
              g.fillRect(sv * w + e * w * 0.012 - 1, 0, 2, h);
        });
        mliN.colorSpace = THREE.NoColorSpace;
        const mliR = canvasTex(S2 / 2, S2 / 2, (g, w, h) => {
          const R = mulberry32(14866);
          g.fillStyle = "rgb(150,150,150)";
          g.fillRect(0, 0, w, h);
          facets(g, w, h, R, 700, 0.03, 0.12, R2 => {
            const v = (130 + R2() * 24) | 0;
            return `rgba(${v},${v},${v},0.92)`;
          });
          g.fillStyle = "rgb(118,118,118)";
          for (const s of SEAMS) g.fillRect(s * w - w * 0.012, 0, w * 0.024, h);
          for (const s of SEAMV) g.fillRect(0, s * h - h * 0.012, w, h * 0.024);
        });
        mliR.colorSpace = THREE.NoColorSpace;
        const mliC = canvasTex(S2, S2, (g, w, h) => {
          const R = mulberry32(14867);
          g.fillStyle = "#d6a444";
          g.fillRect(0, 0, w, h);
          facets(g, w, h, R, 700, 0.03, 0.14, R2 =>
            R2() < 0.55
              ? `rgba(238,194,104,${(0.12 + R2() * 0.12).toFixed(2)})`
              : `rgba(176,120,40,${(0.1 + R2() * 0.12).toFixed(2)})`
          );
          g.fillStyle = "#dfb062";
          for (const s of SEAMS) g.fillRect(s * w - w * 0.012, 0, w * 0.024, h);
          for (const s of SEAMV) g.fillRect(0, s * h - h * 0.012, w, h * 0.024);
          g.fillStyle = "#e9e6dc";
          for (const s of SEAMS)
            for (let k = 0; k < 6; k++) {
              g.beginPath();
              g.arc(s * w, ((k + 0.5) * h) / 6, w * 6e-3, 0, TW);
              g.fill();
            }
        });
        const mliMat = new THREE.MeshPhysicalMaterial({
          map: mliC,
          metalness: 0.7,
          roughness: 1,
          roughnessMap: mliR,
          normalMap: mliN,
          normalScale: new THREE.Vector2(1, 1),
          envMapIntensity: 1.2,
          emissive: 3810568,
          emissiveIntensity: 0.55,
        });
        for (const t of [mliN, mliR, mliC])
          t.wrapS = t.wrapT = THREE.RepeatWrapping;
        const planarUV = (geo, tile) => {
          const p = geo.attributes.position,
            n = geo.attributes.normal,
            uv = geo.attributes.uv;
          for (let i = 0; i < p.count; i++) {
            const ax = Math.abs(n.getX(i)),
              ay = Math.abs(n.getY(i)),
              az = Math.abs(n.getZ(i));
            const x = p.getX(i),
              y = p.getY(i),
              z = p.getZ(i);
            if (ay >= ax && ay >= az) uv.setXY(i, x / tile, z / tile);
            else if (ax >= az) uv.setXY(i, z / tile + 0.37, y / tile);
            else uv.setXY(i, x / tile + 0.71, y / tile);
          }
          return geo;
        };
        d.part(planarUV(GEO.rbox(BW2, BH2, BD2, 0.04, 3), 0.5), mliMat, {
          pos: [0, TY + BH2 / 2, 0],
          from: [0, 0.75, 0],
          delay: 0.12,
          edge: true,
        });
        const bus = [
          F(GEO.rbox(0.36, 0.012, 0.36, 6e-3, 1), "black", [BX, PY + 4e-3, BZ]),
          F(GEO.rbox(CW + 0.08, 0.012, CDp + 0.08, 6e-3, 1), "black", [
            CX,
            PY + 4e-3,
            CZ,
          ]),
          F(GEO.rbox(BW2 + 4e-3, 0.03, 0.024, 6e-3, 1), "silver", [
            0,
            PY - 0.03,
            BD2 / 2 + 1e-3,
          ]),
          F(GEO.rbox(BW2 + 4e-3, 0.03, 0.024, 6e-3, 1), "silver", [
            0,
            PY - 0.03,
            -BD2 / 2 - 1e-3,
          ]),
          F(GEO.rbox(0.024, 0.03, BD2 + 4e-3, 6e-3, 1), "silver", [
            BW2 / 2 + 1e-3,
            PY - 0.03,
            0,
          ]),
          F(GEO.rbox(0.024, 0.03, BD2 + 4e-3, 6e-3, 1), "silver", [
            -BW2 / 2 - 1e-3,
            PY - 0.03,
            0,
          ]),
          F(GEO.rbox(0.07, 0.05, 0.03, 8e-3, 1), "gunD", [
            -0.42,
            TY + 0.2,
            BD2 / 2 + 0.014,
          ]),
          F(
            GEO.sphere(0.018, 14, 8),
            "lens",
            [-0.42, TY + 0.2, BD2 / 2 + 0.03],
            [0, 0, 0],
            [1, 1, 0.6]
          ),
          F(
            lat(
              [
                [1e-3, 0],
                [0.034, 0],
                [0.034, 0.01],
                [0.026, 0.016],
                [1e-3, 0.018],
              ],
              24
            ),
            "silver",
            [0.46, TY + 0.2, BD2 / 2 + 1e-3],
            [PI / 2, 0, 0]
          ),
        ];
        for (const [x, z] of [
          [BX - 0.15, BZ - 0.15],
          [BX + 0.15, BZ - 0.15],
          [BX - 0.15, BZ + 0.15],
          [BX + 0.15, BZ + 0.15],
        ])
          bus.push(F(GEO.cyl(8e-3, 8e-3, 8e-3, 6), "ti", [x, PY + 0.013, z]));
        d.part(GEO.merge(bus), PAL, { from: [0, 0.95, 0], delay: 0.24 });
        const boxMat = d.xray(MAT.anod(2501169, 0.46));
        const boxY = PY + 0.012;
        const body = [
          GEO.at(GEO.rbox(CW + 0.06, 0.012, CDp + 0.05, 5e-3, 2), [
            CX,
            boxY + 6e-3,
            CZ,
          ]),
        ];
        const wt = 0.014;
        body.push(
          GEO.at(GEO.rbox(CW, CH - 0.012, wt, 5e-3, 2), [
            CX,
            boxY + 0.012 + (CH - 0.012) / 2,
            CZ + CDp / 2 - wt / 2,
          ])
        );
        body.push(
          GEO.at(GEO.rbox(CW, CH - 0.012, wt, 5e-3, 2), [
            CX,
            boxY + 0.012 + (CH - 0.012) / 2,
            CZ - CDp / 2 + wt / 2,
          ])
        );
        body.push(
          GEO.at(GEO.rbox(wt, CH - 0.012, CDp - 2 * wt, 5e-3, 2), [
            CX + CW / 2 - wt / 2,
            boxY + 0.012 + (CH - 0.012) / 2,
            CZ,
          ])
        );
        body.push(
          GEO.at(GEO.rbox(wt, CH - 0.012, CDp - 2 * wt, 5e-3, 2), [
            CX - CW / 2 + wt / 2,
            boxY + 0.012 + (CH - 0.012) / 2,
            CZ,
          ])
        );
        for (let k = 0; k < 5; k++)
          for (const sx of [-1, 1])
            body.push(
              GEO.at(new THREE.BoxGeometry(8e-3, CH - 0.04, 0.012), [
                CX + sx * (CW / 2 + 4e-3),
                boxY + CH / 2 + 6e-3,
                CZ - 0.12 + k * 0.06,
              ])
            );
        d.part(GEO.merge(body), boxMat, {
          from: [0, 1.05, 0],
          delay: 0.32,
          edge: true,
        });
        const lid = [
          GEO.at(GEO.rbox(CW + 0.012, 0.018, CDp + 0.012, 7e-3, 2), [0, 0, 0]),
          GEO.at(GEO.rbox(CW - 0.1, 8e-3, CDp - 0.1, 4e-3, 1), [0, 0.012, 0]),
        ];
        const lidPart = d.part(GEO.merge(lid), boxMat, {
          pos: [CX, boxY + CH + 9e-3, CZ],
          from: [0, 1.2, 0],
          spin: [0, 0.5, 0],
          delay: 0.6,
          edge: true,
        });
        const lidDet = [];
        for (let i = 0; i < 6; i++)
          for (const sz of [-1, 1])
            lidDet.push(
              F(GEO.cyl(65e-4, 65e-4, 5e-3, 6), "ti", [
                -CW / 2 + 0.035 + (i * (CW - 0.07)) / 5,
                0.011,
                sz * (CDp / 2 - 0.02),
              ])
            );
        for (let i = 1; i < 4; i++)
          for (const sx of [-1, 1])
            lidDet.push(
              F(GEO.cyl(65e-4, 65e-4, 5e-3, 6), "ti", [
                sx * (CW / 2 - 0.02),
                0.011,
                -CDp / 2 + 0.02 + (i * (CDp - 0.04)) / 4,
              ])
            );
        lidDet.push(
          F(new THREE.BoxGeometry(0.014, 4e-3, 8e-3), "led", [
            CW / 2 - 0.05,
            0.0105,
            CDp / 2 - 0.045,
          ])
        );
        d.part(GEO.merge(lidDet), PALX, { parent: lidPart, static: true });
        const fz = CZ + CDp / 2 + 2e-3,
          fy = boxY + 0.075;
        const fp = [];
        for (const [x, w] of [
          [-0.15, 0.07],
          [-0.06, 0.07],
        ]) {
          fp.push(
            F(GEO.rbox(w, 0.03, 0.012, 5e-3, 1), "silver", [
              CX + x,
              fy,
              fz + 6e-3,
            ])
          );
          fp.push(
            F(new THREE.BoxGeometry(w - 0.016, 0.014, 4e-3), "black", [
              CX + x,
              fy,
              fz + 0.012,
            ])
          );
        }
        for (const x of [0.03, 0.085]) {
          fp.push(
            F(
              GEO.cyl(0.016, 0.016, 0.016, 16),
              "goldC",
              [CX + x, fy, fz + 8e-3],
              [PI / 2, 0, 0]
            )
          );
          fp.push(
            F(
              GEO.cyl(9e-3, 9e-3, 4e-3, 12),
              "black",
              [CX + x, fy, fz + 0.016],
              [PI / 2, 0, 0]
            )
          );
        }
        fp.push(
          F(
            GEO.cyl(0.022, 0.022, 0.02, 18),
            "ti",
            [CX + 0.165, fy, fz + 0.01],
            [PI / 2, 0, 0]
          )
        );
        fp.push(
          F(
            GEO.cyl(0.013, 0.013, 4e-3, 14),
            "black",
            [CX + 0.165, fy, fz + 0.021],
            [PI / 2, 0, 0]
          )
        );
        fp.push(
          F(new THREE.BoxGeometry(0.01, 6e-3, 3e-3), "led", [
            CX + 0.13,
            fy + 0.04,
            fz + 2e-3,
          ])
        );
        fp.push(
          F(
            GEO.cyl(6e-3, 6e-3, 0.02, 8),
            "ti",
            [CX - 0.2, boxY + 0.03, fz + 0.01],
            [PI / 2, 0, 0]
          )
        );
        d.part(GEO.merge(fp), PALX, { from: [0, 0.35, 0.6], delay: 0.44 });
        const hz = [];
        const RZ = fz + 0.07;
        const cable = (x0, r, b) =>
          hz.push(
            paint(
              GEO.tube(
                [
                  [CX + x0, fy, fz + 0.016],
                  [CX + x0, fy - 0.03, fz + 0.05],
                  [CX + x0 - 0.05, PY + 0.022, RZ + b],
                  [BX + 0.32, PY + 0.022, RZ + b],
                  [BX + 0.13, PY + 0.026, 0.1 + b * 0.6],
                  [BX + 0.07, PY + 0.06, BZ + 0.1],
                ],
                r,
                48,
                6
              ),
              "black"
            )
          );
        cable(-0.15, 85e-4, 0);
        cable(-0.06, 85e-4, 0.022);
        cable(0.03, 65e-4, 0.042);
        for (const x of [-0.05, 0.12])
          hz.push(
            F(GEO.rbox(0.03, 0.014, 0.075, 4e-3, 1), "ti", [
              x,
              PY + 0.03,
              RZ + 0.021,
            ])
          );
        d.part(GEO.merge(hz), PAL, { from: [0, 1, 0], delay: 0.5 });
        const actX = (r, len, led) => {
          const h = len / 2;
          const prof = [
            [1e-3, -h],
            [r * 0.78, -h],
            [r * 0.82, -h + 6e-3],
            [r * 0.82, -h + len * 0.32],
            [r * 0.95, -h + len * 0.34],
            [r, -h + len * 0.38],
            [r, h - len * 0.2],
            [r * 0.96, h - len * 0.17],
            [r * 1, h - len * 0.15],
            [r * 1, h - len * 0.12],
            [r * 0.9, h - len * 0.1],
            [r * 0.9, h - 8e-3],
            [r * 0.86, h],
            [1e-3, h],
          ];
          const L = [paint(toX(lat(prof, 40)), "gun")];
          for (let k = 0; k < 4; k++)
            L.push(
              paint(
                GEO.torus(r + 2e-3, 28e-4, 4, 40)
                  .rotateY(PI / 2)
                  .translate(-h + len * 0.42 + k * len * 0.07, 0, 0),
                "gunD"
              )
            );
          L.push(
            paint(
              toX(
                lat(
                  [
                    [1e-3, h - 2e-3],
                    [r * 0.95, h - 2e-3],
                    [r * 0.97, h + 4e-3],
                    [r * 0.95, h + 0.012],
                    [1e-3, h + 0.012],
                  ],
                  40
                )
              ),
              "ti"
            )
          );
          for (let k = 0; k < 10; k++) {
            const a = (k / 10) * TW;
            L.push(
              F(
                GEO.cyl(55e-4, 55e-4, 6e-3, 6),
                "ti",
                [-h - 2e-3, Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62],
                [0, 0, PI / 2]
              )
            );
          }
          if (led)
            L.push(
              paint(
                GEO.torus(r * 0.9 + 1e-3, 22e-4, 4, 40)
                  .rotateY(PI / 2)
                  .translate(h - len * 0.1 - 4e-3, 0, 0),
                "led"
              )
            );
          return L;
        };
        const actY = (r, len, led) =>
          actX(r, len, led).map(g => g.rotateZ(PI / 2));
        const fitting = (r, y02, y12) =>
          paint(
            lat(
              [
                [1e-3, y02],
                [r * 1.5, y02],
                [r * 1.55, y02 + 6e-3],
                [r * 1.4, y02 + 0.016],
                [r * 1.12, y02 + 0.03],
                [r * 1.08, y12],
                [1e-3, y12],
              ],
              32
            ),
            "ti"
          );
        const carbon = MAT.carbon();
        carbon.roughness = 0.42;
        carbon.clearcoatRoughness = 0.3;
        const boomGeo = (r, len) => {
          const g = GEO.cyl(r, r, len, 32, true);
          g.translate(0, len / 2, 0);
          const uv = g.attributes.uv;
          for (let i = 0; i < uv.count; i++)
            uv.setXY(i, uv.getX(i) * 0.34, uv.getY(i) * len * 1.3);
          return g;
        };
        const sleeve = (r, y02, y12, x) => {
          const g = GEO.cyl(r, r, y12 - y02, 36, true);
          const uv = g.attributes.uv;
          for (let i = 0; i < uv.count; i++)
            uv.setXY(
              i,
              (uv.getX(i) * TW * r) / 0.5,
              (uv.getY(i) * (y12 - y02)) / 0.5
            );
          return g.translate(x, (y02 + y12) / 2, 0);
        };
        const tape = (r, y, x) =>
          paint(GEO.cyl(r, r, 0.016, 36, true), "silver").translate(x, y, 0);
        const link = (parent, pos, list, boom, from, delay, spin, slv) => {
          const g = new THREE.Group(),
            r = new THREE.Group();
          g.add(r);
          r.add(new THREE.Mesh(GEO.merge(list), PAL));
          if (boom) r.add(new THREE.Mesh(boom, carbon));
          if (slv) r.add(new THREE.Mesh(slv, mliMat));
          d.part(g, null, { parent, pos, from, delay, spin });
          return r;
        };
        const J1Y = PY + 0.012;
        d.part(
          GEO.merge([
            F(
              lat(
                [
                  [1e-3, 0],
                  [0.13, 0],
                  [0.13, 0.014],
                  [0.115, 0.022],
                  [1e-3, 0.022],
                ],
                40
              ),
              "gunD",
              [BX, J1Y, BZ]
            ),
            ...actY(0.09, 0.09, false).map(g =>
              g.translate(BX, J1Y + 0.022 + 0.045, BZ)
            ),
          ]),
          PAL,
          { from: [0, 1.1, 0], delay: 0.38 }
        );
        const K1 = link(
          d.body,
          [BX, J1Y + 0.112, BZ],
          [
            ...actY(0.088, 0.07, true).map(g => g.translate(0, 0.035, 0)),
            F(GEO.rbox(0.22, 0.03, 0.15, 0.01, 2), "gunD", [-0.01, 0.085, 0]),
            F(GEO.rbox(0.03, 0.15, 0.13, 0.01, 2), "gunD", [-0.095, 0.16, 0]),
            ...actX(0.075, 0.2, true).map(g => g.translate(0.02, 0.2, 0)),
          ],
          null,
          [0, 1.25, 0],
          0.46,
          [0, 1, 0]
        );
        const A_UP = 0.6,
          OX = 0.215;
        const K2 = link(
          K1,
          [0, 0.2, 0],
          [
            F(GEO.rbox(0.02, 0.14, 0.11, 6e-3, 2), "ti", [0.142, 0, 0]),
            fitting(0.042, -0.04, 0.05).translate(OX, 0, 0),
            fitting(0.042, -0.05, 0.04).rotateX(PI).translate(OX, A_UP, 0),
            paint(
              GEO.tube(
                [
                  [OX + 0.058, 0.07, 0.022],
                  [OX + 0.06, A_UP * 0.5, 0.026],
                  [OX + 0.058, A_UP - 0.07, 0.022],
                ],
                55e-4,
                24,
                5
              ),
              "black"
            ),
            F(GEO.rbox(0.03, 0.016, 0.026, 4e-3, 1), "ti", [
              OX + 0.052,
              A_UP * 0.33,
              0.018,
            ]),
            F(GEO.rbox(0.03, 0.016, 0.026, 4e-3, 1), "ti", [
              OX + 0.052,
              A_UP * 0.66,
              0.018,
            ]),
            tape(0.0515, 0.1, OX),
            tape(0.0515, A_UP - 0.1, OX),
          ],
          boomGeo(0.042, A_UP).translate(OX, 0, 0),
          [0.3, 0.45, 0],
          0.54,
          void 0,
          sleeve(0.0505, 0.1, A_UP - 0.1, OX)
        );
        const K3 = link(
          K2,
          [OX, A_UP, 0],
          [
            ...actY(0.06, 0.08, true).map(g => g.translate(0, 0.04, 0)),
            F(GEO.rbox(0.1, 0.07, 0.11, 0.012, 2), "gunD", [-0.03, 0.12, 0]),
            ...actX(0.072, 0.2, true).map(g =>
              g.rotateY(PI).translate(-0.13, 0.15, 0)
            ),
          ],
          null,
          [0, 0.4, 0],
          0.62
        );
        const A_LO = 0.54,
          OX2 = -0.182;
        const K4 = link(
          K3,
          [-0.13, 0.15, 0],
          [
            F(GEO.rbox(0.02, 0.13, 0.1, 6e-3, 2), "ti", [-0.132, 0, 0]),
            fitting(0.038, -0.04, 0.05).translate(OX2, 0, 0),
            fitting(0.038, -0.05, 0.04).rotateX(PI).translate(OX2, A_LO, 0),
            paint(
              GEO.tube(
                [
                  [OX2 - 0.054, 0.07, 0.02],
                  [OX2 - 0.056, A_LO * 0.5, 0.024],
                  [OX2 - 0.054, A_LO - 0.07, 0.02],
                ],
                5e-3,
                24,
                5
              ),
              "black"
            ),
            F(GEO.rbox(0.028, 0.015, 0.024, 4e-3, 1), "ti", [
              OX2 - 0.05,
              A_LO * 0.5,
              0.016,
            ]),
            tape(0.0475, 0.1, OX2),
            tape(0.0475, A_LO - 0.1, OX2),
          ],
          boomGeo(0.038, A_LO).translate(OX2, 0, 0),
          [-0.3, 0.45, 0],
          0.7,
          void 0,
          sleeve(0.0465, 0.1, A_LO - 0.1, OX2)
        );
        const K5 = link(
          K4,
          [OX2, A_LO, 0],
          [
            ...actY(0.055, 0.075, true).map(g => g.translate(0, 0.038, 0)),
            F(GEO.rbox(0.09, 0.06, 0.1, 0.012, 2), "gunD", [0.03, 0.105, 0]),
            ...actX(0.062, 0.17, false).map(g => g.translate(0.12, 0.135, 0)),
          ],
          null,
          [0, 0.35, 0],
          0.78
        );
        const K6 = link(
          K5,
          [0.12, 0.135, 0],
          [
            F(GEO.rbox(0.02, 0.12, 0.09, 6e-3, 2), "ti", [0.107, 0.02, 0]),
            F(GEO.rbox(0.07, 0.035, 0.09, 0.012, 2), "gunD", [0.14, 0.085, 0]),
            ...actY(0.052, 0.08, true).map(g => g.translate(0.155, 0.142, 0)),
          ],
          null,
          [0.25, 0.3, 0],
          0.84
        );
        const ee = [
          F(
            lat(
              [
                [1e-3, 0],
                [0.056, 0],
                [0.058, 4e-3],
                [0.058, 0.026],
                [0.056, 0.03],
                [1e-3, 0.03],
              ],
              40
            ),
            "ti"
          ),
          F(GEO.rbox(0.022, 0.016, 0.018, 4e-3, 1), "gunD", [0.064, 0.015, 0]),
          F(
            lat(
              [
                [1e-3, 0.03],
                [0.06, 0.03],
                [0.064, 0.04],
                [0.064, 0.15],
                [0.06, 0.158],
                [0.046, 0.158],
                [0.044, 0.15],
                [0.044, 0.06],
                [1e-3, 0.06],
              ],
              40
            ),
            "gun"
          ),
          F(
            GEO.torus(0.054, 35e-4, 4, 40).rotateX(PI / 2),
            "ti",
            [0, 0.157, 0]
          ),
          F(GEO.rbox(0.03, 0.03, 0.04, 6e-3, 1), "gunD", [0, 0.1, 0.075]),
          F(
            GEO.cyl(9e-3, 9e-3, 4e-3, 12),
            "lens",
            [0, 0.1, 0.096],
            [PI / 2, 0, 0]
          ),
        ];
        for (let k = 0; k < 3; k++) {
          const a = (k / 3) * TW;
          ee.push(
            F(
              GEO.rbox(0.014, 0.05, 0.01, 3e-3, 1),
              "ti",
              [Math.sin(a) * 0.036, 0.12, Math.cos(a) * 0.036],
              [0, a, 0]
            )
          );
        }
        const K7 = link(K6, [0.155, 0.194, 0], ee, null, [0, 0.3, 0], 0.9);
        const ftMat = MAT.led(ACC, 1.8);
        const ftRing = new THREE.Mesh(
          GEO.torus(0.0585, 26e-4, 4, 44)
            .rotateX(PI / 2)
            .translate(0, 0.015, 0),
          ftMat
        );
        K7.add(ftRing);
        const ftTag = new THREE.Object3D();
        ftTag.position.y = 0.015;
        K7.add(ftTag);
        d.label(
          "eSRB-900 · <em>radiation-tolerant controller</em>",
          "#C084FC",
          [CX - 0.16, boxY + CH + 0.03, CZ + 0.12],
          [0.46, 0.8]
        );
        d.label(
          "7 axes · <em>harmonic drive, 100:1</em>",
          "#E9D5FF",
          [BX + 0.02, J1Y + 0.32, BZ],
          [0.46, 0.8]
        );
        d.label(
          "6-axis force/torque · <em>end effector</em>",
          "#C084FC",
          [0, 1.5, 0],
          [0.47, 0.8]
        );
        const ftLabel = d.labels[d.labels.length - 1];
        d.label(
          "GR712RC · <em>rad-hard dual-core LEON3FT</em>",
          "#C084FC",
          [CX - 0.12, boxY + 0.03, CZ + 0.17],
          [0.55, 0.78]
        );
        const POSE = {
          stow: [1.78, 0.22, 2, 0.82, 0, 0, 0],
          reach: [1.45, 0.66, 1.12, 0.58, 0.16, -0.1, 0.6],
          safe: [1.5, 0.55, 1.3, 0.64, 0.12, -0.08, 0.5],
        };
        const TRK = [
          [0.46, 0.66, "stow", "reach"],
          [0.7, 0.78, "reach", "safe"],
          [0.84, 0.97, "safe", "stow"],
        ];
        const Q = [0, 0, 0, 0, 0, 0, 0];
        const vT = new THREE.Vector3();
        const ftBase = new THREE.Color(ACC);
        let lastP = -99,
          lastG = -1;
        d.anim((p, time, dt, env) => {
          const P = env.fin > 0.5 || p < 0.46 || p >= 0.97 ? -1 : p;
          if (P !== lastP) {
            lastP = P;
            let ka = POSE.stow,
              kb = POSE.stow,
              u = 0;
            if (P >= 0) {
              for (let i = 0; i < TRK.length; i++) {
                const t = TRK[i];
                if (P < t[0]) break;
                ka = POSE[t[2]];
                kb = POSE[t[3]];
                u = P >= t[1] ? 1 : easeInOut((P - t[0]) / (t[1] - t[0]));
              }
            }
            for (let i = 0; i < 7; i++) Q[i] = ka[i] + (kb[i] - ka[i]) * u;
            K1.rotation.y = Q[0];
            K2.rotation.x = Q[1];
            K3.rotation.y = Q[4];
            K4.rotation.x = Q[2];
            K5.rotation.y = Q[5];
            K6.rotation.x = Q[3];
            K7.rotation.y = Q[6];
            ftTag.updateWorldMatrix(true, false);
            vT.setFromMatrixPosition(ftTag.matrixWorld);
            d.body.worldToLocal(vT);
            ftLabel.pos.copy(vT);
          }
          const glow =
            1.8 +
            2.6 * Math.exp(-Math.pow((p - 0.68) / 0.018, 2)) * (1 - env.fin) +
            0.5 * env.hero * (0.5 + 0.5 * Math.sin(time * 3));
          if (Math.abs(glow - lastG) > 1e-3) {
            lastG = glow;
            ftMat.color.copy(ftBase).multiplyScalar(glow);
          }
        });
        d.frame({
          dist: 4.8,
          height: 2.2,
          targetY: 0.86,
          fov: 32,
          yaw0: -0.45,
          yaw1: 0.4,
        });
        d.footprint(1.15);
        return d;
      };
      DEVICES.ehealth365 = () => {
        const d = device("ehealth365");
        const PI = Math.PI,
          TWO_PI = Math.PI * 2;
        const RED = 15680580;
        const PX = -0.4,
          PZ = 0.16;
        const PAD_R = 0.56,
          PAD_T = 0.014,
          PUCK_R = 0.33;
        const BS = 0.45,
          BY = 0.0765;
        d.slot({ pos: [PX, BY, PZ], rot: [0, 0, 0], scale: BS });
        const BOARD_BOTTOM = BY - 0.025 * BS;
        const padTex = canvasTex(TXS, TXS, (g, w, h) => {
          const R = mulberry32(370625);
          const c = w / 2;
          g.fillStyle = "#8a93a0";
          g.fillRect(0, 0, w, h);
          for (let i = 0; i < 6e3; i++) {
            const x = R() * w,
              y = R() * h,
              a = R() * PI,
              L = w * (4e-3 + R() * 0.014);
            const v = R() < 0.5 ? 210 : 52;
            g.strokeStyle = `rgba(${v},${v},${v + 12},${(0.05 + R() * 0.07).toFixed(3)})`;
            g.lineWidth = 0.6 + R() * 0.9;
            g.beginPath();
            g.moveTo(x, y);
            g.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L);
            g.stroke();
          }
          const px = r => (r / PAD_R) * c;
          g.strokeStyle = "rgba(72, 82, 98, 0.32)";
          g.lineWidth = w * 5e-3;
          g.beginPath();
          g.arc(c, c, px(PAD_R - 0.035), 0, TWO_PI);
          g.stroke();
          const r0 = px(PUCK_R + 0.03),
            r1 = px(PUCK_R + 0.15);
          g.strokeStyle = "rgba(84, 96, 116, 0.42)";
          g.lineWidth = w * 32e-4;
          g.beginPath();
          g.arc(c, c, r0, 0, TWO_PI);
          g.stroke();
          for (let k = 0; k < 40; k++) {
            const a = (k / 40) * TWO_PI;
            const bend = (k % 2 ? 1 : -1) * 0.025;
            g.beginPath();
            g.moveTo(c + Math.cos(a) * r0, c + Math.sin(a) * r0);
            g.quadraticCurveTo(
              c + Math.cos(a + bend) * (r0 + r1) * 0.5,
              c + Math.sin(a + bend) * (r0 + r1) * 0.5,
              c + Math.cos(a) * r1,
              c + Math.sin(a) * r1
            );
            g.stroke();
            g.fillStyle = "rgba(38, 44, 56, 0.75)";
            g.beginPath();
            g.arc(
              c + Math.cos(a) * r1,
              c + Math.sin(a) * r1,
              w * 45e-4,
              0,
              TWO_PI
            );
            g.fill();
            g.strokeStyle = "rgba(230, 236, 244, 0.35)";
            g.lineWidth = w * 16e-4;
            g.beginPath();
            g.arc(
              c + Math.cos(a) * r1,
              c + Math.sin(a) * r1,
              w * 68e-4,
              0,
              TWO_PI
            );
            g.stroke();
            g.strokeStyle = "rgba(84, 96, 116, 0.42)";
            g.lineWidth = w * 32e-4;
          }
        });
        const padMat = MAT.rubber(16777215);
        padMat.map = padTex;
        padMat.sheenColor.set(10135224);
        padMat.sheen = 0.25;
        const padTop = GEO.at(
          new THREE.CircleGeometry(PAD_R - 8e-3, 96).rotateX(-PI / 2),
          [0, PAD_T, 0]
        );
        const padRim = GEO.lathe(
          [
            [PAD_R - 1e-3, 0],
            [PAD_R, 5e-3],
            [PAD_R - 2e-3, 0.011],
            [PAD_R - 8e-3, PAD_T],
          ],
          96
        );
        const rimUv = padRim.attributes.uv;
        for (let i = 0; i < rimUv.count; i++) rimUv.setXY(i, 0.5, 0.012);
        d.part(GEO.merge([padTop, padRim]), padMat, {
          pos: [PX, 0, PZ],
          from: [-0.35, 0, -0.75],
          spin: [0, 1.1, 0],
          delay: 0,
          edge: true,
        });
        const baseMat = d.xray(MAT.plastic(2501428, 0.46));
        const baseProf = [
          [PUCK_R - 0.012, PAD_T],
          [PUCK_R - 4e-3, PAD_T + 4e-3],
          [PUCK_R, PAD_T + 0.014],
          [PUCK_R + 2e-3, 0.04],
          [PUCK_R, 0.057],
          [PUCK_R - 5e-3, 0.0615],
          [PUCK_R - 0.013, 0.06],
          [PUCK_R - 0.015, 0.036],
          [PUCK_R - 0.03, 0.031],
          [0, 0.031],
        ];
        const base = d.part(GEO.lathe(baseProf, 80), baseMat, {
          pos: [PX, 0, PZ],
          from: [-0.2, 0, -0.9],
          spin: [0, -0.9, 0],
          delay: 0.12,
          edge: true,
        });
        const stand = [];
        for (const sx of [-1, 1])
          for (const sz of [-1, 1])
            stand.push(
              GEO.at(GEO.cyl(0.011, 0.013, BOARD_BOTTOM - 0.031, 10), [
                sx * 0.17,
                (BOARD_BOTTOM + 0.031) / 2,
                sz * 0.105,
              ])
            );
        stand.push(GEO.at(GEO.cyl(0.115, 0.115, 0.022, 40), [0, 0.043, 0]));
        d.part(GEO.merge(stand), MAT.steel(0.34), {
          parent: base,
          static: true,
        });
        const arcL = 0.42;
        const pipe = new THREE.TorusGeometry(PUCK_R + 12e-4, 36e-4, 6, 20, arcL)
          .rotateZ(-PI / 2 - arcL / 2)
          .rotateX(-PI / 2);
        const pipeMat = MAT.led(RED, 2);
        d.part(pipe, pipeMat, {
          parent: base,
          static: true,
          pos: [0, 0.042, 0],
        });
        const domeMat = d.xray(MAT.gloss(1777705));
        domeMat.clearcoatRoughness = 0.22;
        const domeProf = [
          [PUCK_R - 4e-3, 0.0625],
          [PUCK_R + 1e-3, 0.069],
          [PUCK_R + 5e-4, 0.081],
          [PUCK_R - 0.011, 0.103],
          [PUCK_R - 0.04, 0.125],
          [PUCK_R - 0.09, 0.142],
          [0.17, 0.152],
          [0.09, 0.1585],
          [0, 0.1605],
        ];
        const dome = d.part(GEO.lathe(domeProf, 80), domeMat, {
          pos: [PX, 0, PZ],
          from: [0, 0.95, 0],
          spin: [0, 1.3, 0],
          delay: 0.88,
          edge: true,
        });
        const winMat = d.xray(MAT.gloss(461069));
        d.part(GEO.cyl(0.074, 0.074, 5e-3, 48), winMat, {
          parent: dome,
          static: true,
          pos: [0, 0.1585, 0],
        });
        d.part(
          GEO.torus(0.0755, 24e-4, 6, 64).rotateX(PI / 2),
          MAT.alu(9080985, 0.55),
          { parent: dome, static: true, pos: [0, 0.1612, 0] }
        );
        d.part(
          GEO.torus(PUCK_R - 35e-4, 36e-4, 6, 80).rotateX(PI / 2),
          MAT.rubber(724241),
          { parent: dome, static: true, pos: [0, 0.0622, 0] }
        );
        const RX = 0.6,
          RZ = -0.14,
          PSI2 = -0.72;
        const Ri = 0.322,
          Ro = 0.4,
          HW = 0.135,
          CROWN = 6e-3,
          CF = 6e-3;
        const RY = Ro - 2e-3 + CROWN;
        const ringG = d.part(new THREE.Group(), null, {
          static: true,
          pos: [RX, RY, RZ],
          rot: [0, PSI2, 0],
        });
        const ringL = d.part(new THREE.Group(), null, {
          static: true,
          parent: ringG,
          rot: [PI / 2, 0, 0],
        });
        const bandPts = [];
        const yb = HW - 0.014;
        for (let i = 0; i <= 12; i++) {
          const y = -yb + (2 * yb * i) / 12;
          bandPts.push([Ro - 2e-3 + CROWN * (1 - (y / yb) ** 2), y]);
        }
        const bandMat = MAT.anod(8225418, 0.74);
        const band = d.part(GEO.lathe(bandPts, 112), bandMat, {
          parent: ringL,
          from: [0, 0.75, -0.15],
          delay: 0.62,
          edge: true,
        });
        const sideMat = MAT.steel(0.3);
        const sides = GEO.merge([
          GEO.lathe(
            [
              [Ri + 0.012, -HW],
              [Ro - 0.02, -HW],
              [Ro - 8e-3, -HW + 4e-3],
              [Ro - 2e-3, -yb],
            ],
            112
          ),
          GEO.lathe(
            [
              [Ro - 2e-3, yb],
              [Ro - 8e-3, HW - 4e-3],
              [Ro - 0.02, HW],
              [Ri + 0.012, HW],
            ],
            112
          ),
        ]);
        d.part(sides, sideMat, { parent: band, static: true });
        const linerPts = [
          [Ri + 0.012, HW],
          [Ri + 4e-3, HW - 5e-3],
        ];
        const yl = HW - 0.012;
        for (let i = 0; i <= 10; i++) {
          const y = yl - (2 * yl * i) / 10;
          linerPts.push([Ri + 1e-3 - CF * (1 - (y / yl) ** 2), y]);
        }
        linerPts.push([Ri + 4e-3, -HW + 5e-3], [Ri + 0.012, -HW]);
        const linerMat = MAT.gloss(724499);
        const liner = d.part(GEO.lathe(linerPts, 112), linerMat, {
          parent: ringL,
          from: [0, -0.7, -0.15],
          delay: 0.44,
        });
        const rIn = Ri + 1e-3 - CF;
        const domeGeo = new THREE.SphereGeometry(
          0.024,
          16,
          8,
          0,
          TWO_PI,
          0,
          PI / 2
        )
          .rotateX(-PI / 2)
          .scale(1, 1, 0.6);
        const DY = [-0.058, 0, 0.058];
        d.part(
          GEO.merge(DY.map(y => GEO.at(domeGeo, [0, y, rIn + 2e-3]))),
          MAT.glass(1911590, 0.55),
          { parent: liner, static: true }
        );
        const ledGeo = GEO.sphere(85e-4, 10, 6);
        d.part(
          GEO.merge([
            GEO.at(ledGeo, [0, DY[0], rIn - 1e-3]),
            GEO.at(ledGeo, [0, DY[2], rIn - 1e-3]),
          ]),
          MAT.led(4906624, 3),
          { parent: liner, static: true }
        );
        d.part(GEO.at(ledGeo, [0, DY[1], rIn - 1e-3]), MAT.led(RED, 2.6), {
          parent: liner,
          static: true,
        });
        const tp = 0.36;
        d.part(GEO.rbox(0.026, 0.05, 4e-3, 18e-4, 1), MAT.gold(), {
          parent: liner,
          static: true,
          pos: [Math.sin(tp) * (rIn + 1e-3), 0, Math.cos(tp) * (rIn + 1e-3)],
          rot: [0, tp, 0],
        });
        const glowTex = canvasTex(128, 128, (g, w) => {
          const gr = g.createRadialGradient(
            w / 2,
            w / 2,
            0,
            w / 2,
            w / 2,
            w / 2
          );
          gr.addColorStop(0, "rgba(255,255,255,1)");
          gr.addColorStop(0.25, "rgba(255,255,255,0.45)");
          gr.addColorStop(1, "rgba(255,255,255,0)");
          g.fillStyle = gr;
          g.fillRect(0, 0, w, w);
        });
        const glowMat = new THREE.SpriteMaterial({
          map: glowTex,
          color: HDR(4906624, 1.4),
          transparent: true,
          opacity: 0.35,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const glow = new THREE.Sprite(glowMat);
        glow.scale.setScalar(0.13);
        d.part(glow, null, {
          parent: liner,
          static: true,
          pos: [0, 0, rIn - 0.02],
          cast: false,
        });
        const flex = d.part(
          new THREE.CylinderGeometry(
            Ri + 0.017,
            Ri + 0.017,
            0.17,
            96,
            1,
            true,
            PI + 0.3,
            TWO_PI - 0.6
          ),
          MAT.pcb("brown"),
          { parent: ringL, from: [0, 0, -0.9], delay: 0.2 }
        );
        flex.material.side = THREE.DoubleSide;
        const chips = [];
        for (const [a, w, hgt] of [
          [0.62, 0.05, 0.05],
          [-0.62, 0.05, 0.05],
          [1.45, 0.07, 0.06],
          [-1.45, 0.06, 0.07],
          [2.15, 0.045, 0.045],
          [-2.2, 0.04, 0.05],
        ]) {
          chips.push(
            GEO.at(
              GEO.rbox(w, hgt, 0.012, 3e-3, 1),
              [Math.sin(a) * (Ri + 0.024), 0, Math.cos(a) * (Ri + 0.024)],
              [0, a, 0]
            )
          );
        }
        d.part(GEO.merge(chips), MAT.plastic(921621, 0.5), {
          parent: flex,
          static: true,
        });
        const cellProf = [
          [Ri + 0.026, -0.058],
          [Ri + 0.05, -0.058],
          [Ri + 0.054, -0.054],
          [Ri + 0.054, 0.054],
          [Ri + 0.05, 0.058],
          [Ri + 0.026, 0.058],
          [Ri + 0.022, 0.054],
          [Ri + 0.022, -0.054],
          [Ri + 0.026, -0.058],
        ];
        d.part(
          new THREE.LatheGeometry(
            cellProf.map(([r, y]) => new THREE.Vector2(r, y)),
            36,
            PI - 0.9,
            1.8
          ),
          MAT.alu(11186877, 0.6),
          { parent: ringL, from: [0, 0, -1.15], delay: 0.3 }
        );
        const bleCurve = [
          [PX + 0.03, 0.2, PZ],
          [PX + 0.3, 0.72, PZ - 0.08],
          [RX - 0.35, 1, RZ + 0.05],
          [RX - 0.02, RY + Ro + 0.06, RZ],
        ];
        const bleMat = new THREE.ShaderMaterial({
          uniforms: {
            uT: { value: 0 },
            uO: { value: 0 },
            uC: { value: HDR(16557477, 1.3) },
          },
          vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
          fragmentShader: `uniform float uT; uniform float uO; uniform vec3 uC; varying vec2 vUv;
          void main(){ float x = vUv.x; float dash = smoothstep(0.35, 0.5, fract(x * 46.0)) * (1.0 - smoothstep(0.75, 0.9, fract(x * 46.0)));
            float p1 = fract(uT * 0.42), p2 = fract(uT * 0.42 + 0.5);
            float h = exp(-(((x - p1) * 14.0) * ((x - p1) * 14.0))) + exp(-(((1.0 - x - p2) * 14.0) * ((1.0 - x - p2) * 14.0)));
            float a = (0.4 * dash + 0.75 * h) * uO * smoothstep(0.0, 0.06, x) * (1.0 - smoothstep(0.94, 1.0, x));
            gl_FragColor = vec4(uC * a, a); }`,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const ble = d.part(GEO.tube(bleCurve, 3e-3, 80, 5), bleMat, {
          static: true,
          cast: false,
          receive: false,
        });
        ble.visible = false;
        d.label(
          "Smart Ring Pro · <em>finger, 24/7</em>",
          "#EF4444",
          [RX, RY + Ro + 0.05, RZ],
          [0.46, 0.8]
        );
        d.label(
          "Designed to measure · <em>heart rate + HRV, SpO₂</em>",
          "#FCA5A5",
          [RX, 0.08, RZ],
          [0.5, 0.8]
        );
        d.label(
          "Smart Patch Pro · <em>upper arm, one patch a week</em>",
          "#EF4444",
          [PX + 0.12, 0.17, PZ + 0.05],
          [0.48, 0.8]
        );
        d.label(
          "Bluetooth LE · <em>one mobile app</em>",
          "#FCA5A5",
          [(PX + RX) / 2 + 0.05, 0.86, (PZ + RZ) / 2],
          [0.54, 0.8]
        );
        const beat = t => {
          const u = t - Math.floor(t);
          return (
            Math.exp(-(((u - 0.08) / 0.035) ** 2)) +
            0.55 * Math.exp(-(((u - 0.24) / 0.04) ** 2))
          );
        };
        let lastHero = -1;
        d.anim((p, time, dt, env) => {
          const h = env.hero;
          if (h < 1e-3 && lastHero < 1e-3) return;
          lastHero = h;
          const b = beat(time * 1.15);
          glowMat.opacity = 0.35 + h * (0.25 + 0.6 * b);
          pipeMat.color
            .setHex(RED)
            .multiplyScalar(2 + 1.2 * h * (0.5 + 0.5 * Math.sin(time * 2.2)));
          ble.visible = h > 0.01;
          bleMat.uniforms.uO.value = h;
          bleMat.uniforms.uT.value = time;
        });
        d.frame({
          dist: 3.45,
          height: 1.9,
          targetY: 0.3,
          fov: 32,
          yaw0: -0.45,
          yaw1: 0.38,
        });
        d.footprint(1.05);
        return d;
      };
      DEVICES.eindustrial = () => {
        const d = device("eindustrial");
        const ACC = 3462041;
        const HALF = Math.PI / 2;
        const ZB = -0.3;
        const RAIL_Y = 0.86;
        const H = 1.05,
          D = 0.55;
        const CY = 0.855,
          CZ = ZB + 0.075 + D / 2;
        const FZ = D / 2;
        const GAP = 8e-3;
        let cur = -0.92;
        const slotX = w => {
          const c = cur + w / 2;
          cur += w + GAP;
          return c;
        };
        const PSW = 0.34,
          CPUW = 0.48,
          IOW = 0.28;
        const PS_X = slotX(PSW),
          CPU_X = slotX(CPUW),
          IO_X = [slotX(IOW), slotX(IOW), slotX(IOW)];
        const ROW_L = -0.92,
          ROW_R = cur - GAP;
        const SPLIT = 0.04;
        const BX = -0.03,
          BY = 0.22,
          BZ = 0.11;
        d.slot({
          pos: [CPU_X + BX, CY + BY, CZ + BZ],
          rot: [HALF, HALF, 0],
          scale: 0.4,
        });
        const R = mulberry32(152834048);
        const BOX = (w, h, dd) => new THREE.BoxGeometry(w, h, dd);
        const tint = (geo, hex) => {
          const g = geo.index ? geo.toNonIndexed() : geo;
          const c = new THREE.Color(hex),
            n = g.attributes.position.count,
            a = new Float32Array(n * 3);
          for (let i = 0; i < n; i++) {
            a[i * 3] = c.r;
            a[i * 3 + 1] = c.g;
            a[i * 3 + 2] = c.b;
          }
          g.setAttribute("color", new THREE.BufferAttribute(a, 3));
          return g;
        };
        const T = (geo, hex, pos, rot, scl) =>
          tint(GEO.at(geo, pos, rot, scl), hex);
        const v2 = pts => pts.map(([a, b]) => new THREE.Vector2(a, b));
        const rrect = (w, h, r, n = 4) => {
          const pts = [];
          const cs = [
            [w / 2 - r, h / 2 - r, 0],
            [-w / 2 + r, h / 2 - r, HALF],
            [-w / 2 + r, -h / 2 + r, Math.PI],
            [w / 2 - r, -h / 2 + r, Math.PI * 1.5],
          ];
          for (const [cx, cy, a0] of cs)
            for (let i = 0; i <= n; i++) {
              const a = a0 + (i / n) * HALF;
              pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
            }
          return pts;
        };
        const ringGeo = (w, h, r, t, depth, bevel = 3e-3) => {
          const s = new THREE.Shape(v2(rrect(w - 2 * bevel, h - 2 * bevel, r)));
          s.holes.push(
            new THREE.Path(
              v2(rrect(w - 2 * t, h - 2 * t, Math.max(4e-3, r - t)))
            )
          );
          return new THREE.ExtrudeGeometry(s, {
            depth,
            bevelEnabled: bevel > 0,
            bevelThickness: bevel,
            bevelSize: bevel,
            bevelSegments: 2,
            curveSegments: 4,
          });
        };
        const plateGeo = (w, h, r, depth, bevel = 4e-3) => {
          const s = new THREE.Shape(v2(rrect(w - 2 * bevel, h - 2 * bevel, r)));
          return new THREE.ExtrudeGeometry(s, {
            depth: Math.max(1e-3, depth - 2 * bevel),
            bevelEnabled: true,
            bevelThickness: bevel,
            bevelSize: bevel,
            bevelSegments: 2,
            curveSegments: 4,
          }).translate(0, 0, bevel);
        };
        const screwGeo = r =>
          GEO.lathe(
            [
              [r, 0],
              [r, 2e-3],
              [r * 0.95, 65e-4],
              [r * 0.62, 0.0105],
              [5e-4, 0.011],
            ],
            10
          ).rotateX(HALF);
        const SCREW = screwGeo(0.018),
          SCREW_L = screwGeo(0.024),
          SCREW_S = screwGeo(0.013);
        const plateMat = MAT.anod(1448481, 0.55);
        const steel = MAT.steel(0.38);
        steel.vertexColors = true;
        const housing = MAT.plastic(1909032, 0.52);
        const detail = MAT.plastic(16777215, 0.5);
        detail.vertexColors = true;
        const coverMat = d.xray(MAT.plastic(2106669, 0.46));
        const doorMat = d.xray(MAT.plastic(2830907, 0.42));
        const winMat = d.xray(
          new THREE.MeshPhysicalMaterial({
            color: 1844012,
            metalness: 0,
            roughness: 0.18,
            transparent: true,
            opacity: 0.5,
            clearcoat: 0.3,
            clearcoatRoughness: 0.2,
            envMapIntensity: 0.4,
          })
        );
        winMat.userData.noAO = true;
        const ledMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(1, 1, 1).multiplyScalar(2.2),
        });
        const UNIT = new THREE.BoxGeometry(1, 1, 1);
        const gusset = GEO.extrude(
          [
            [0, 0],
            [0.27, 0],
            [0, 0.5],
          ],
          0.03,
          6e-3
        ).rotateY(-HALF);
        d.part(
          GEO.merge([
            GEO.at(GEO.rbox(2.24, 0.05, 1.08, 0.018, 2), [0, 0.025, -0.08]),
            GEO.at(GEO.rbox(2.2, 1.62, 0.04, 0.016, 2), [
              0,
              0.05 + 0.81,
              ZB - 0.02,
            ]),
            GEO.at(gusset, [-0.78, 0.05, ZB - 0.04], [0, Math.PI, 0]),
            GEO.at(gusset, [0.78, 0.05, ZB - 0.04], [0, Math.PI, 0]),
          ]),
          plateMat,
          { from: [0, -0.04, -0.45], delay: 0, edge: true }
        );
        const plateScrews = [];
        for (const [sx, sy] of [
          [-1.03, 0.15],
          [1.03, 0.15],
          [-1.03, 1.57],
          [1.03, 1.57],
        ])
          plateScrews.push(T(SCREW_L, 16777215, [sx, sy, ZB]));
        d.part(GEO.merge(plateScrews), steel, {
          from: [0, -0.04, -0.45],
          delay: 0,
        });
        const prof = [
          [-0.175, 0.075],
          [-0.115, 0.075],
          [-0.115, 0.01],
          [0.115, 0.01],
          [0.115, 0.075],
          [0.175, 0.075],
          [0.175, 0.065],
          [0.125, 0.065],
          [0.125, 0],
          [-0.125, 0],
          [-0.125, 0.065],
          [-0.175, 0.065],
        ];
        const RL = 2.08;
        const railGeo = GEO.extrude(prof, RL, 2e-3)
          .applyMatrix4(
            new THREE.Matrix4().makeBasis(
              new THREE.Vector3(0, 1, 0),
              new THREE.Vector3(0, 0, 1),
              new THREE.Vector3(1, 0, 0)
            )
          )
          .translate(-RL / 2, RAIL_Y, ZB);
        const rail = [tint(railGeo, 10396843)];
        for (let k = 0; k < 9; k++) {
          const sx = -1 + k * 0.25;
          rail.push(
            T(GEO.rbox(0.15, 0.052, 4e-3, 0.02, 1), 789776, [
              sx,
              RAIL_Y,
              ZB + 0.0115,
            ])
          );
        }
        rail.push(
          T(SCREW_S, 16777215, [-1, RAIL_Y, ZB + 0.01]),
          T(SCREW_S, 16777215, [1, RAIL_Y, ZB + 0.01])
        );
        d.part(GEO.merge(rail), steel, { from: [-2.6, 0, 0], delay: 0.06 });
        const ledBank = (list, parent) => {
          const m = new THREE.InstancedMesh(UNIT, ledMat, list.length);
          list.forEach((L, i) => {
            dummy.position.set(L[0], L[1], L[2]);
            dummy.rotation.set(0, 0, 0);
            dummy.scale.set(L[3], L[4], L[5]);
            dummy.updateMatrix();
            m.setMatrixAt(i, dummy.matrix);
            m.setColorAt(i, L[6]);
          });
          m.instanceMatrix.needsUpdate = true;
          m.instanceColor.needsUpdate = true;
          m.castShadow = false;
          parent.add(m);
          return m;
        };
        const C_ON = new THREE.Color(ACC).multiplyScalar(0.95),
          C_OFF = new THREE.Color(1711908),
          C_AMB = new THREE.Color(16754234).multiplyScalar(0.85),
          C_RED = new THREE.Color(2754566),
          C_BAR = new THREE.Color(ACC).multiplyScalar(0.55);
        function terminalBlock(pl, st, x0, w, cols, rows, yTop, pitch, scr, r) {
          const top = yTop + 0.042,
            bot = yTop - (rows - 1) * pitch - 0.05;
          pl.push(
            T(GEO.rbox(w, top - bot, 0.06, 0.01, 1), 2830392, [
              x0,
              (top + bot) / 2,
              FZ + 0.03,
            ])
          );
          for (let k = 0; k < rows - 1; k++)
            pl.push(
              T(BOX(w * 0.94, 6e-3, 6e-3), 3817545, [
                x0,
                yTop - (k + 0.5) * pitch - 0.012,
                FZ + 0.062,
              ])
            );
          for (const cx of cols)
            for (let i = 0; i < rows; i++) {
              const y = yTop - i * pitch;
              pl.push(
                T(BOX(r * 2.7, r * 2.5, 4e-3), 658190, [
                  x0 + cx,
                  y + 8e-3,
                  FZ + 0.061,
                ])
              );
              pl.push(
                T(BOX(r * 1.7, r * 0.95, 4e-3), 263430, [
                  x0 + cx,
                  y - 0.026,
                  FZ + 0.061,
                ])
              );
              st.push(T(scr, 16777215, [x0 + cx, y + 8e-3, FZ + 0.062]));
              st.push(
                T(
                  BOX(r * 1.6, 45e-4, 4e-3),
                  1842464,
                  [x0 + cx, y + 8e-3, FZ + 0.0725],
                  [0, 0, (R() - 0.5) * 1.6]
                )
              );
            }
        }
        const topVents = (pl, w, z0 = -0.12, n = 5) => {
          for (let k = 0; k < n; k++)
            pl.push(
              T(BOX(w * 0.62, 4e-3, 0.014), 395016, [
                0,
                H / 2 + 1e-3,
                z0 + k * 0.06,
              ])
            );
        };
        const modGroup = (cx, housingGeo, pl, st) => {
          const g = new THREE.Group();
          g.position.set(cx, CY, CZ);
          if (housingGeo) g.add(new THREE.Mesh(housingGeo, housing));
          g.add(
            new THREE.Mesh(GEO.merge(pl), detail),
            new THREE.Mesh(GEO.merge(st), steel)
          );
          return g;
        };
        let psBank;
        {
          const pl = [],
            st = [];
          terminalBlock(
            pl,
            st,
            0,
            0.29,
            [-0.09, 0, 0.09],
            1,
            0.4,
            0.07,
            SCREW_L,
            0.024
          );
          terminalBlock(
            pl,
            st,
            0,
            0.29,
            [-0.09, 0, 0.09],
            1,
            -0.39,
            0.07,
            SCREW_L,
            0.024
          );
          for (let k = 0; k < 9; k++)
            pl.push(
              T(GEO.rbox(0.2, 0.014, 6e-3, 4e-3, 1), 460810, [
                -0.02,
                0.2 - k * 0.042,
                FZ + 2e-3,
              ])
            );
          pl.push(
            T(GEO.rbox(0.05, 0.12, 0.01, 5e-3, 1), 460810, [
              0.12,
              0.13,
              FZ + 4e-3,
            ])
          );
          pl.push(
            T(GEO.cyl(0.02, 0.02, 8e-3, 16).rotateX(HALF), 658190, [
              0.12,
              -0.05,
              FZ + 4e-3,
            ])
          );
          st.push(
            T(SCREW_S, 12106946, [0.12, -0.05, FZ + 6e-3]),
            T(BOX(0.02, 4e-3, 4e-3), 1842464, [0.12, -0.05, FZ + 0.0175])
          );
          topVents(pl, PSW);
          const g = modGroup(
            PS_X,
            GEO.rbox(PSW - 4e-3, H, D, 0.022, 2),
            pl,
            st
          );
          psBank = ledBank(
            [
              [0.12, 0.17, FZ + 0.011, 0.026, 0.016, 6e-3, C_OFF],
              [0.12, 0.1, FZ + 0.011, 0.026, 0.016, 6e-3, C_OFF],
              [0, 0.49, FZ + 1e-3, 0.24, 8e-3, 4e-3, C_BAR],
            ],
            g
          );
          d.part(g, null, { from: [-1.9, 0, 0], delay: 0.3 });
        }
        const ioBanks = [];
        IO_X.forEach((cx, m) => {
          const pl = [],
            st = [];
          terminalBlock(
            pl,
            st,
            0,
            0.23,
            [-0.055, 0.055],
            9,
            0.055,
            0.062,
            SCREW,
            0.018
          );
          pl.push(
            T(GEO.rbox(0.17, 0.33, 0.012, 6e-3, 1), 395018, [
              0,
              0.31,
              FZ + 6e-3,
            ])
          );
          pl.push(
            T(GEO.rbox(0.2, 0.034, 6e-3, 4e-3, 1), 6975609, [
              0,
              0.122,
              FZ + 3e-3,
            ])
          );
          topVents(pl, IOW);
          const g = modGroup(cx, GEO.rbox(IOW - 4e-3, H, D, 0.022, 2), pl, st);
          const list = [];
          const cols = m < 2 ? [-0.035, 0.035] : [0];
          for (const lx of cols)
            for (let i = 0; i < 8; i++)
              list.push([
                lx,
                0.45 - i * 0.04,
                FZ + 0.0135,
                0.026,
                0.014,
                6e-3,
                C_OFF,
              ]);
          list.push([0, 0.49, FZ + 1e-3, 0.2, 8e-3, 4e-3, C_BAR]);
          ioBanks.push(ledBank(list, g));
          d.part(g, null, { from: [2.05, 0, 0], delay: 0.38 + m * 0.08 });
        });
        {
          const tray = new THREE.Group();
          tray.position.set(CPU_X, CY, CZ);
          const trayDepth = FZ + SPLIT;
          tray.add(
            new THREE.Mesh(
              GEO.at(GEO.rbox(CPUW - 4e-3, H, trayDepth, 0.022, 2), [
                0,
                0,
                -FZ + trayDepth / 2,
              ]),
              housing
            )
          );
          const pl = [];
          topVents(pl, CPUW, -0.22, 4);
          for (const [sx, sy] of [
            [-0.12, 0.06],
            [0.06, 0.06],
            [-0.12, 0.38],
            [0.06, 0.38],
          ])
            pl.push(
              T(
                GEO.cyl(0.012, 0.012, BZ - SPLIT - 0.012, 8).rotateX(HALF),
                9271886,
                [sx, sy, SPLIT + (BZ - SPLIT) / 2 - 6e-3]
              )
            );
          tray.add(new THREE.Mesh(GEO.merge(pl), detail));
          d.part(tray, null, { from: [2.2, 0, 0], delay: 0.16 });
        }
        const DOOR_W = 0.36,
          DOOR_H = 0.46,
          DOOR_X0 = -0.215,
          DOOR_Y = 0.255;
        let pivot, screenMat, cpuBank;
        {
          const cover = new THREE.Group();
          cover.position.set(CPU_X, CY, CZ);
          const sleeveD = FZ - 0.02 - SPLIT - 4e-3;
          cover.add(
            new THREE.Mesh(
              GEO.merge([
                GEO.at(ringGeo(CPUW - 4e-3, H, 0.022, 0.016, sleeveD), [
                  0,
                  0,
                  SPLIT + 4e-3,
                ]),
                GEO.at(plateGeo(CPUW - 4e-3, H, 0.022, 0.02), [
                  0,
                  0,
                  FZ - 0.02,
                ]),
              ]),
              coverMat
            )
          );
          cover.children[0].renderOrder = 1;
          const pl = [],
            st = [];
          for (const jx of [-0.095, 0.095]) {
            const jy = -0.13;
            st.push(
              T(ringGeo(0.16, 0.135, 8e-3, 0.013, 0.024, 2e-3), 14080734, [
                jx,
                jy,
                FZ,
              ])
            );
            pl.push(
              T(BOX(0.134, 0.105, 6e-3), 197637, [jx, jy + 2e-3, FZ + 5e-3])
            );
            for (let k = 0; k < 8; k++)
              st.push(
                T(BOX(6e-3, 0.02, 4e-3), 16765562, [
                  jx - 0.042 + k * 0.012,
                  jy + 0.035,
                  FZ + 9e-3,
                ])
              );
          }
          const ds = [
            [-0.13, 0.055],
            [0.13, 0.055],
            [0.11, -0.055],
            [-0.11, -0.055],
          ];
          const dsIn = [
            [-0.11, 0.04],
            [0.11, 0.04],
            [0.094, -0.04],
            [-0.094, -0.04],
          ];
          const dShape = new THREE.Shape(v2(ds));
          dShape.holes.push(new THREE.Path(v2(dsIn.slice().reverse())));
          st.push(
            T(
              new THREE.ExtrudeGeometry(dShape, {
                depth: 0.022,
                bevelEnabled: true,
                bevelThickness: 2e-3,
                bevelSize: 2e-3,
                bevelSegments: 1,
              }),
              14080734,
              [0, -0.34, FZ]
            )
          );
          st.push(
            T(GEO.rbox(0.36, 0.15, 6e-3, 0.01, 1), 11054515, [
              0,
              -0.34,
              FZ + 2e-3,
            ])
          );
          pl.push(
            T(
              new THREE.ExtrudeGeometry(new THREE.Shape(v2(dsIn)), {
                depth: 0.012,
                bevelEnabled: false,
              }),
              1711394,
              [0, -0.34, FZ + 6e-3]
            )
          );
          for (let k = 0; k < 9; k++) {
            const row = k < 5 ? 0 : 1,
              i = row ? k - 5 : k;
            pl.push(
              T(GEO.cyl(6e-3, 6e-3, 4e-3, 6).rotateX(HALF), 131587, [
                -0.064 + i * 0.032 + row * 0.016,
                -0.34 + (row ? -0.016 : 0.016),
                FZ + 0.019,
              ])
            );
          }
          for (const hx of [-0.155, 0.155])
            st.push(
              T(GEO.cyl(0.013, 0.013, 0.026, 6).rotateX(HALF), 16777215, [
                hx,
                -0.34,
                FZ + 0.013,
              ])
            );
          pl.push(
            T(GEO.rbox(0.045, 0.2, 0.012, 6e-3, 1), 395018, [
              0.195,
              0.37,
              FZ + 6e-3,
            ])
          );
          pl.push(
            T(GEO.rbox(0.06, 0.1, 8e-3, 8e-3, 1), 658190, [
              0.1,
              0.4,
              FZ + 4e-3,
            ]),
            T(GEO.rbox(0.03, 0.035, 8e-3, 4e-3, 1), 7041145, [
              0.1,
              0.42,
              FZ + 6e-3,
            ])
          );
          pl.push(T(BOX(0.012, 0.1, 6e-3), 131587, [0.1, 0.12, FZ + 3e-3]));
          for (const ky of [0.08, 0.43])
            st.push(
              T(GEO.cyl(0.011, 0.011, 0.07, 10), 16777215, [
                DOOR_X0,
                ky,
                FZ + 0.024,
              ])
            );
          cover.add(
            new THREE.Mesh(GEO.merge(pl), detail),
            new THREE.Mesh(GEO.merge(st), steel)
          );
          screenMat = d.xray(
            MAT.screen(
              (g, w, h, t) => {
                g.fillStyle = "#04070b";
                g.fillRect(0, 0, w, h);
                g.fillStyle = "#0f2a22";
                g.fillRect(0, 0, w, h * 0.16);
                g.fillStyle = "#34d399";
                for (let i = 0; i < 4; i++)
                  g.fillRect(
                    w * (0.05 + i * 0.07),
                    h * 0.04,
                    w * 0.05,
                    h * 0.08
                  );
                g.strokeStyle = "#34d399";
                g.lineWidth = 3;
                g.beginPath();
                for (let i = 0; i <= 40; i++) {
                  const xx = w * (0.05 + i * 0.0225),
                    yy =
                      h *
                      (0.52 -
                        0.18 *
                          Math.sin(i * 0.45 + t * 2.2) *
                          Math.cos(i * 0.13 - t * 0.7));
                  if (i) g.lineTo(xx, yy);
                  else g.moveTo(xx, yy);
                }
                g.stroke();
                for (let i = 0; i < 16; i++) {
                  const on =
                    Math.sin(i * 12.9898 + Math.floor(t * 3) * 78.233) > 0.1;
                  g.fillStyle = on ? "#34d399" : "#123026";
                  g.fillRect(
                    w * (0.05 + i * 0.057),
                    h * 0.8,
                    w * 0.04,
                    h * 0.1
                  );
                }
              },
              256,
              154,
              1
            )
          );
          const disp = new THREE.Mesh(
            new THREE.PlaneGeometry(0.21, 0.126).translate(
              -0.06,
              0.37,
              FZ + 15e-4
            ),
            screenMat
          );
          disp.renderOrder = 2;
          cover.add(disp);
          pivot = new THREE.Group();
          pivot.position.set(DOOR_X0, DOOR_Y, FZ + 0.024);
          pivot.add(
            new THREE.Mesh(
              GEO.merge([
                GEO.at(ringGeo(DOOR_W, DOOR_H, 0.012, 0.034, 0.014, 3e-3), [
                  DOOR_W / 2,
                  0,
                  -7e-3,
                ]),
                GEO.at(GEO.rbox(0.018, 0.12, 0.016, 7e-3, 1), [
                  DOOR_W - 0.016,
                  0,
                  0.012,
                ]),
              ]),
              doorMat
            )
          );
          pivot.add(
            new THREE.Mesh(
              GEO.at(GEO.rbox(DOOR_W - 0.06, DOOR_H - 0.06, 6e-3, 3e-3, 1), [
                DOOR_W / 2,
                0,
                0,
              ]),
              winMat
            )
          );
          pivot.children[0].renderOrder = 3;
          pivot.children[1].renderOrder = 4;
          cover.add(pivot);
          const list = [];
          for (let i = 0; i < 4; i++)
            list.push([
              0.195,
              0.44 - i * 0.046,
              FZ + 0.0135,
              0.022,
              0.016,
              6e-3,
              C_OFF,
            ]);
          for (const jx of [-0.095, 0.095])
            list.push(
              [jx - 0.056, -0.072, FZ + 0.012, 0.018, 0.01, 6e-3, C_OFF],
              [jx + 0.056, -0.072, FZ + 0.012, 0.018, 0.01, 6e-3, C_OFF]
            );
          list.push([0.06, 0.49, FZ + 1e-3, 0.26, 8e-3, 4e-3, C_BAR]);
          cpuBank = ledBank(list, cover);
          d.part(cover, null, { from: [0, 0, 1.15], delay: 0.66 });
        }
        const clamp = (cx, side) => [
          T(GEO.rbox(0.04, 0.4, 0.12, 8e-3, 1), 3948872, [
            cx,
            RAIL_Y,
            ZB + 0.075 + 0.06,
          ]),
          T(GEO.rbox(0.04, 0.06, 0.03, 6e-3, 1), 3948872, [
            cx + side * 0.012,
            RAIL_Y - 0.17,
            ZB + 0.075 + 0.125,
          ]),
          T(SCREW_S, 16777215, [cx, RAIL_Y + 0.12, ZB + 0.075 + 0.12]),
        ];
        d.part(
          GEO.merge([...clamp(ROW_L - 0.024, -1), ...clamp(ROW_R + 0.024, 1)]),
          steel,
          { from: [0, 0.5, 0], delay: 0.84 }
        );
        d.label(
          "ePLC-1000 · <em>Modular PLC controller</em>",
          "#34D399",
          [CPU_X, CY + H / 2 + 0.1, CZ + 0.1],
          [0.46, 0.8]
        );
        d.label(
          "Fieldbus · <em>PROFINET, EtherCAT</em>",
          "#34D399",
          [CPU_X + 0.095, CY - 0.13, CZ + FZ + 0.03],
          [0.47, 0.8]
        );
        d.label(
          "I/O · <em>32 DI, 32 DO, 16 AI, 8 AO</em>",
          "#6EE7B7",
          [IO_X[1] + 0.055, CY - 0.43, CZ + FZ + 0.07],
          [0.48, 0.8]
        );
        d.label(
          "CPU · <em>NXP i.MX 8M Plus</em>",
          "#34D399",
          [CPU_X + BX, CY + BY, CZ + BZ + 0.02],
          [0.54, 0.78]
        );
        const hb = n => {
          let h = Math.imul(n ^ 2654435769, 2246822507);
          h ^= h >>> 13;
          h = Math.imul(h, 3266489909);
          h ^= h >>> 16;
          return (h >>> 0) / 4294967296;
        };
        let lastDoor = -1,
          lastStep = -99;
        d.anim((p, time, dt, env) => {
          const fin = env.fin > 0.5;
          const door = fin ? 0 : sr(p, 0.445, 0.505) * (1 - sr(p, 0.74, 0.79));
          if (Math.abs(door - lastDoor) > 1e-4) {
            lastDoor = door;
            pivot.rotation.y = -1.05 * door;
          }
          const pow = fin || p > 0.44;
          const live = pow && !fin && env.hero > 0.01;
          const step = !pow ? -3 : live ? Math.floor(time * 6) : -2;
          if (step === lastStep) return;
          lastStep = step;
          for (let m = 0; m < ioBanks.length; m++) {
            const bank = ioBanks[m],
              n = bank.count - 1;
            for (let i = 0; i < n; i++) {
              const on =
                pow &&
                hb(
                  i * 131 +
                    m * 977 +
                    Math.floor((Math.max(0, step) + i * 3) / (2 + (i % 5)))
                ) > 0.45;
              bank.setColorAt(i, on ? C_ON : C_OFF);
            }
            bank.setColorAt(n, pow ? C_BAR : C_OFF);
            bank.instanceColor.needsUpdate = true;
          }
          cpuBank.setColorAt(0, pow ? C_ON : C_OFF);
          cpuBank.setColorAt(1, C_RED);
          cpuBank.setColorAt(2, pow ? C_ON : C_OFF);
          cpuBank.setColorAt(3, C_OFF);
          for (let k = 0; k < 2; k++) {
            cpuBank.setColorAt(4 + k * 2, pow ? C_ON : C_OFF);
            cpuBank.setColorAt(
              5 + k * 2,
              pow && hb(step * 7 + k) > 0.35 ? C_AMB : C_OFF
            );
          }
          cpuBank.setColorAt(8, pow ? C_BAR : C_OFF);
          cpuBank.instanceColor.needsUpdate = true;
          psBank.setColorAt(0, pow ? C_ON : C_OFF);
          psBank.setColorAt(1, C_OFF);
          psBank.setColorAt(2, pow ? C_BAR : C_OFF);
          psBank.instanceColor.needsUpdate = true;
          if (live && lastDoor > 0.05) screenMat.userData.redraw(time);
        });
        d.frame({
          dist: 5,
          height: 1.7,
          targetY: 0.86,
          fov: 32,
          yaw0: -0.42,
          yaw1: 0.26,
        });
        d.footprint(1.2);
        return d;
      };
      DEVICES.emedical = () => {
        const d = device("emedical");
        const PI = Math.PI,
          TAU2 = PI * 2;
        const ACC = 16020150;
        const W = 1.5,
          H = 1.04,
          T = 0.24,
          TILT = 0.3;
        const ct = Math.cos(TILT),
          st = Math.sin(TILT);
        const SX = 0,
          SY = 0.541 * ct + 0.085 * st,
          SZ = -0.24;
        const toBody = (X, Y, Z) => [
          SX + X,
          SY + Y * ct + Z * st,
          SZ - Y * st + Z * ct,
        ];
        const slab = d.part(new THREE.Group(), null, {
          static: true,
          pos: [SX, SY, SZ],
          rot: [-TILT, 0, 0],
        });
        d.slot({
          pos: toBody(0, -0.03, -4e-3),
          rot: [PI / 2 - TILT, 0, 0],
          scale: 1.19,
        });
        d.part(GEO.rbox(1.02, 0.56, 0.05, 0.018, 2), MAT.alu(9147294, 0.55), {
          parent: slab,
          pos: [0, -0.03, -0.077],
          from: [0, 0, -0.9],
          delay: 0.04,
        });
        const afe = d.part(
          new THREE.BoxGeometry(0.13, 0.38, 0.012),
          MAT.plastic(1194536, 0.45),
          {
            parent: slab,
            pos: [0.645, -0.13, -0.03],
            from: [0, 0, -0.9],
            delay: 0.08,
          }
        );
        d.part(
          GEO.merge([
            GEO.at(new THREE.BoxGeometry(0.1, 0.2, 0.022), [0, 0.04, 0.017]),
            GEO.at(new THREE.BoxGeometry(0.05, 0.05, 0.016), [0, -0.13, 0.014]),
          ]),
          MAT.steel(0.36),
          { parent: afe, static: true }
        );
        const shellMat = d.xray(MAT.plastic(1842982, 0.5));
        const backT = 0.16;
        const back = d.part(
          GEO.merge([
            GEO.rbox(W - 0.014, H - 0.014, backT, 0.06, 3),
            GEO.at(GEO.rbox(0.92, 0.5, 0.02, 0.02, 2), [
              0,
              -0.04,
              -backT / 2 - 4e-3,
            ]),
          ]),
          shellMat,
          {
            parent: slab,
            pos: [0, 0, -T / 2 + backT / 2],
            from: [0, 0, -1.2],
            delay: 0.2,
            edge: true,
          }
        );
        const rubber = MAT.rubber(790033);
        const bz = T / 2 - backT / 2;
        d.part(
          GEO.merge([
            GEO.at(GEO.rbox(0.2, 0.05, 0.13, 0.016, 2), [
              -0.52,
              -H / 2 + 4e-3,
              -0.02 + bz,
            ]),
            GEO.at(GEO.rbox(0.2, 0.05, 0.13, 0.016, 2), [
              0.52,
              -H / 2 + 4e-3,
              -0.02 + bz,
            ]),
          ]),
          rubber,
          { parent: back, static: true }
        );
        const conY = -0.25,
          conZ = -0.03;
        const steelBits = [];
        for (const [x, y] of [
          [-0.62, 0.4],
          [0.62, 0.4],
          [-0.62, -0.4],
          [0.62, -0.4],
        ])
          steelBits.push(
            GEO.at(
              GEO.cyl(0.017, 0.017, 0.01, 10),
              [x, y, -backT / 2 - 2e-3],
              [PI / 2, 0, 0]
            )
          );
        steelBits.push(
          GEO.at(GEO.rbox(0.012, 0.042, 0.11, 6e-3, 2), [
            -W / 2 - 2e-3,
            -0.2,
            -0.02 + bz,
          ])
        );
        steelBits.push(
          GEO.at(
            GEO.torus(0.053, 7e-3, 8, 28),
            [W / 2 + 3e-3, conY, conZ + bz],
            [0, PI / 2, 0]
          )
        );
        d.part(GEO.merge(steelBits), MAT.steel(0.38), {
          parent: back,
          static: true,
        });
        d.part(
          GEO.merge([
            GEO.at(new THREE.BoxGeometry(6e-3, 0.022, 0.088), [
              -W / 2 - 6e-3,
              -0.2,
              -0.02 + bz,
            ]),
            GEO.at(
              GEO.cyl(0.046, 0.046, 6e-3, 24),
              [W / 2 + 1e-3, conY, conZ + bz],
              [0, 0, PI / 2]
            ),
          ]),
          MAT.blackMetal(0.6),
          { parent: back, static: true }
        );
        const hinge = toBody(0, 0.3, -T / 2 - 0.012);
        const KA = 1.08,
          foot = 0.028;
        const KL = (hinge[1] - foot) / Math.sin(KA);
        const kDir = [0, -Math.sin(KA), -Math.cos(KA)];
        const kick = d.part(
          GEO.merge([
            GEO.rbox(0.78, KL, 0.026, 0.012, 3),
            GEO.at(
              GEO.cyl(0.024, 0.024, 0.86, 18),
              [0, KL / 2, 0],
              [0, 0, PI / 2]
            ),
          ]),
          MAT.anod(2435635, 0.46),
          {
            pos: [
              0,
              hinge[1] + (kDir[1] * KL) / 2,
              hinge[2] + (kDir[2] * KL) / 2,
            ],
            rot: [PI / 2 - KA, 0, 0],
            from: [0, 0.2, -1],
            spin: [0.6, 0, 0],
            delay: 0.3,
            edge: true,
          }
        );
        d.part(
          GEO.at(GEO.rbox(0.8, 0.034, 0.05, 0.012, 2), [0, -KL / 2 + 6e-3, 0]),
          rubber,
          { parent: kick, static: true }
        );
        const frameMat = d.xray(MAT.anod(2961979, 0.44));
        const frontT = 0.092;
        d.part(GEO.rbox(W, H, frontT, 0.046, 3), frameMat, {
          parent: slab,
          pos: [0, 0, T / 2 - frontT / 2],
          from: [0, 0.55, 0.75],
          delay: 0.76,
          edge: true,
        });
        const glassMat = d.xray(
          new THREE.MeshPhysicalMaterial({
            color: 263431,
            roughness: 0.22,
            metalness: 0,
            clearcoat: 0.6,
            clearcoatRoughness: 0.14,
            envMapIntensity: 0.6,
          })
        );
        const glass = d.part(
          GEO.rbox(W - 0.09, H - 0.09, 0.014, 0.03, 2),
          glassMat,
          {
            parent: slab,
            pos: [0, 0, T / 2 + 2e-3],
            from: [0, 0.75, 0.9],
            delay: 0.9,
          }
        );
        const SW = TXS,
          SH = Math.round(TXS * 0.586),
          U = SW / 1024;
        const GX0 = 18 * U,
          GX1 = SW - 18 * U,
          GW = GX1 - GX0,
          COLW = GW / 4;
        const GY0 = 52 * U,
          GY1 = 548 * U;
        const ROW_Y = [134 * U, 258 * U, 382 * U, 506 * U],
          MV = 46 * U;
        const LEADS = [
          [0.1, -0.04, 0.62, -0.1, 0.22],
          [0.16, -0.06, 0.98, -0.16, 0.3],
          [0.06, -0.08, 0.4, -0.08, 0.1],
          [-0.13, 0.04, -0.78, 0.1, -0.26],
          [0.03, -0.03, 0.28, -0.06, 0.07],
          [0.11, -0.07, 0.68, -0.12, 0.2],
          [0.08, 0, 0.22, -0.92, -0.08],
          [0.08, 0, 0.38, -1.05, 0.34],
          [0.08, -0.02, 0.62, -0.62, 0.42],
          [0.1, -0.04, 1.08, -0.36, 0.44],
          [0.1, -0.06, 0.96, -0.16, 0.36],
          [0.1, -0.05, 0.78, -0.06, 0.3],
        ];
        const GRID = [
          [0, 3, 6, 9],
          [1, 4, 7, 10],
          [2, 5, 8, 11],
        ];
        const PER = 0.86,
          SWEEP = 10;
        const ekg = (t, L) => {
          const u = t / PER - Math.floor(t / PER);
          const a = (u - 0.12) / 0.04,
            b = (u - 0.215) / 0.011,
            c = (u - 0.245) / 0.013,
            e = (u - 0.276) / 0.013,
            f = (u - 0.48) / 0.066;
          return (
            L[0] * Math.exp(-a * a) +
            L[1] * Math.exp(-b * b) +
            L[2] * Math.exp(-c * c) +
            L[3] * Math.exp(-e * e) +
            L[4] * Math.exp(-f * f) +
            0.025 * Math.sin(t * 1.7 + L[2] * 9)
          );
        };
        const bg = document.createElement("canvas");
        bg.width = SW;
        bg.height = SH;
        {
          const g = bg.getContext("2d");
          g.fillStyle = "#040306";
          g.fillRect(0, 0, SW, SH);
          g.fillStyle = "#0b0609";
          g.fillRect(GX0, GY0, GW, GY1 - GY0);
          const grid2 = (step, style) => {
            g.strokeStyle = style;
            g.beginPath();
            for (let x = GX0; x <= GX1 + 0.5; x += step) {
              g.moveTo(Math.round(x) + 0.5, GY0);
              g.lineTo(Math.round(x) + 0.5, GY1);
            }
            for (let y = GY0; y <= GY1 + 0.5; y += step) {
              g.moveTo(GX0, Math.round(y) + 0.5);
              g.lineTo(GX1, Math.round(y) + 0.5);
            }
            g.stroke();
          };
          g.lineWidth = Math.max(1, U * 0.8);
          grid2(8 * U, "rgba(244, 114, 182, 0.07)");
          grid2(40 * U, "rgba(244, 114, 182, 0.17)");
          g.strokeStyle = "rgba(244, 114, 182, 0.38)";
          g.lineWidth = 2 * U;
          g.beginPath();
          for (let c = 1; c < 4; c++)
            for (let r = 0; r < 3; r++) {
              g.moveTo(GX0 + c * COLW, ROW_Y[r] - 14 * U);
              g.lineTo(GX0 + c * COLW, ROW_Y[r] + 14 * U);
            }
          g.stroke();
          g.strokeStyle = "rgba(249, 168, 212, 0.85)";
          g.lineWidth = 2.2 * U;
          for (const y of ROW_Y) {
            g.beginPath();
            g.moveTo(GX0 + 3 * U, y);
            g.lineTo(GX0 + 7 * U, y);
            g.lineTo(GX0 + 7 * U, y - MV);
            g.lineTo(GX0 + 15 * U, y - MV);
            g.lineTo(GX0 + 15 * U, y);
            g.lineTo(GX0 + 19 * U, y);
            g.stroke();
          }
          g.fillStyle = "#16101a";
          g.beginPath();
          g.roundRect(330 * U, 12 * U, 236 * U, 28 * U, 14 * U);
          g.fill();
          g.fillStyle = "#f472b6";
          for (let i = 0; i < 10; i++) {
            g.beginPath();
            g.arc((350 + i * 22) * U, 26 * U, 5.5 * U, 0, TAU2);
            g.fill();
          }
          g.strokeStyle = "#c9ccd6";
          g.lineWidth = 3 * U;
          g.lineCap = "round";
          for (let k = 0; k < 3; k++) {
            g.beginPath();
            g.arc(880 * U, 38 * U, (8 + k * 8) * U, -PI * 0.75, -PI * 0.25);
            g.stroke();
          }
          g.strokeRect(930 * U, 16 * U, 54 * U, 22 * U);
          g.fillStyle = "#c9ccd6";
          g.fillRect(984 * U, 22 * U, 5 * U, 10 * U);
          g.fillRect(934 * U, 20 * U, 38 * U, 14 * U);
          for (let k = 0; k < 4; k++) {
            const x = (150 + k * 200) * U;
            g.fillStyle = "#17131b";
            g.beginPath();
            g.roundRect(x, 556 * U, 124 * U, 38 * U, 19 * U);
            g.fill();
            g.fillStyle = k === 2 ? "#f472b6" : "#c9ccd6";
            g.beginPath();
            const cx = x + 62 * U,
              cy = 575 * U;
            if (k === 0) {
              g.moveTo(cx - 7 * U, cy - 9 * U);
              g.lineTo(cx + 9 * U, cy);
              g.lineTo(cx - 7 * U, cy + 9 * U);
            } else if (k === 1) g.rect(cx - 8 * U, cy - 8 * U, 16 * U, 16 * U);
            else if (k === 2) g.arc(cx, cy, 8 * U, 0, TAU2);
            else {
              g.rect(cx - 10 * U, cy - 8 * U, 20 * U, 3 * U);
              g.rect(cx - 10 * U, cy - 1.5 * U, 20 * U, 3 * U);
              g.rect(cx - 10 * U, cy + 5 * U, 20 * U, 3 * U);
            }
            g.fill();
          }
        }
        const drawECG = (g, w, h, time) => {
          g.drawImage(bg, 0, 0);
          const uc = (time % SWEEP) / SWEEP,
            gap = 0.014;
          g.lineWidth = 3.1 * U;
          g.lineJoin = "round";
          g.strokeStyle = "#f9a8d4";
          for (let r = 0; r < 4; r++) {
            const y0 = ROW_Y[r];
            let pen = false,
              lastCol = -1;
            g.beginPath();
            for (let x = GX0 + 22 * U; x <= GX1; x += 2.5 * U) {
              const u = (x - GX0) / GW;
              if (u > uc && u < uc + gap) {
                pen = false;
                continue;
              }
              const col = Math.min(3, ((x - GX0) / COLW) | 0);
              const L = LEADS[r < 3 ? GRID[r][col] : 1];
              const t =
                u <= uc
                  ? time - (uc - u) * SWEEP
                  : time - SWEEP + (u - uc) * SWEEP;
              const y = y0 - ekg(t, L) * MV;
              if (!pen || (r < 3 && col !== lastCol)) g.moveTo(x, y);
              else g.lineTo(x, y);
              pen = true;
              lastCol = col;
            }
            g.stroke();
          }
          const cx = GX0 + uc * GW;
          g.fillStyle = "#ffe4f1";
          for (let r = 0; r < 4; r++) {
            const col = Math.min(3, (uc * 4) | 0);
            const y =
              ROW_Y[r] - ekg(time, LEADS[r < 3 ? GRID[r][col] : 1]) * MV;
            g.beginPath();
            g.arc(cx, y, 3.4 * U, 0, TAU2);
            g.fill();
          }
          const ph = time / PER - Math.floor(time / PER);
          const beat = Math.exp(-(((ph - 0.25) / 0.08) ** 2));
          const s = (11 + 3 * beat) * U,
            hx = 48 * U,
            hy = 27 * U;
          g.fillStyle = beat > 0.4 ? "#ff8cc6" : "#f472b6";
          g.beginPath();
          g.moveTo(hx, hy + s * 0.9);
          g.bezierCurveTo(
            hx - s * 1.5,
            hy,
            hx - s * 0.9,
            hy - s * 1.1,
            hx,
            hy - s * 0.35
          );
          g.bezierCurveTo(
            hx + s * 0.9,
            hy - s * 1.1,
            hx + s * 1.5,
            hy,
            hx,
            hy + s * 0.9
          );
          g.fill();
          g.fillStyle = "#2a1a24";
          g.fillRect(78 * U, 20 * U, 200 * U, 12 * U);
          g.fillStyle = "#f472b6";
          g.fillRect(78 * U, 20 * U, (120 + 60 * beat) * U, 12 * U);
        };
        const scrMat = d.xray(MAT.screen(drawECG, SW, SH, 1.08));
        d.part(new THREE.PlaneGeometry(1.1, 0.645), scrMat, {
          parent: glass,
          static: true,
          pos: [0, 0.045, 78e-4],
          cast: false,
        });
        const barMat = MAT.led(ACC, 1.7);
        d.part(new THREE.BoxGeometry(0.36, 8e-3, 2e-3), barMat, {
          parent: glass,
          static: true,
          pos: [0, 0.426, 8e-3],
          cast: false,
        });
        d.part(
          GEO.merge([
            GEO.at(
              GEO.cyl(0.028, 0.03, 0.01, 20),
              [0.6, -0.375, 9e-3],
              [PI / 2, 0, 0]
            ),
          ]),
          MAT.plastic(1382172, 0.38),
          { parent: glass, static: true }
        );
        const ringMat = MAT.led(ACC, 2);
        d.part(
          GEO.at(GEO.torus(0.035, 35e-4, 6, 32), [0.6, -0.375, 75e-4]),
          ringMat,
          { parent: glass, static: true, cast: false }
        );
        const ledGeo = new THREE.BoxGeometry(0.022, 0.01, 3e-3);
        const sLeds = GEO.merge([
          GEO.at(ledGeo, [-0.62, -0.375, 85e-4]),
          GEO.at(ledGeo, [-0.57, -0.375, 85e-4]),
          GEO.at(ledGeo, [-0.52, -0.375, 85e-4]),
        ]);
        const lc = new Float32Array(sLeds.attributes.position.count * 3);
        const per = sLeds.attributes.position.count / 3;
        const LC = [
          [1.4, 1.42, 1.5],
          [2, 0.6, 1.25],
          [0.5, 0.52, 0.56],
        ];
        for (let i = 0; i < sLeds.attributes.position.count; i++)
          lc.set(LC[Math.min(2, (i / per) | 0)], i * 3);
        sLeds.setAttribute("color", new THREE.BufferAttribute(lc, 3));
        d.part(sLeds, new THREE.MeshBasicMaterial({ vertexColors: true }), {
          parent: glass,
          static: true,
          cast: false,
        });
        const relief = GEO.lathe(
          [
            [0.041, 0],
            [0.04, 0.03],
            [0.033, 0.08],
            [0.026, 0.13],
            [0.025, 0.14],
          ],
          20
        ).rotateZ(-PI / 2);
        const plug = GEO.merge([
          GEO.at(
            GEO.cyl(0.047, 0.047, 0.07, 28),
            [W / 2 + 0.035, conY, conZ],
            [0, 0, PI / 2]
          ),
          GEO.at(relief, [W / 2 + 0.088, conY, conZ]),
        ]);
        const cableMat = MAT.rubber(1908775);
        const plugBody = d.part(plug, MAT.plastic(1382429, 0.42), {
          parent: slab,
          from: [0.9, 0.1, 0],
          delay: 0.46,
        });
        d.part(
          GEO.at(
            GEO.cyl(0.05, 0.05, 0.016, 28),
            [W / 2 + 0.078, conY, conZ],
            [0, 0, PI / 2]
          ),
          MAT.plastic(14240664, 0.46),
          { parent: plugBody, static: true }
        );
        const YK = [0.1, 0.03, 0.35],
          yA = 1.89;
        const ax = [Math.cos(yA), Math.sin(yA)],
          lat = [-ax[1], ax[0]];
        const yBack = [YK[0] - ax[0] * 0.1, YK[2] - ax[1] * 0.1];
        const P0 = toBody(W / 2 + 0.22, conY, conZ);
        const trunk = GEO.tube(
          [
            P0,
            [P0[0] + 0.1, P0[1] - 0.05, P0[2] + 0.01],
            [1.07, 0.11, -0.1],
            [1, 0.024, 0.07],
            [0.72, 0.023, 0.14],
            [0.36, 0.023, 0.15],
            [yBack[0] - ax[0] * 0.12, 0.024, yBack[1] - ax[1] * 0.12],
            [yBack[0], 0.03, yBack[1]],
          ],
          0.022,
          72,
          10
        );
        d.part(trunk, cableMat, { from: [0.9, 0.1, 0], delay: 0.46 });
        d.part(
          GEO.rbox(0.22, 0.054, 0.11, 0.024, 2),
          MAT.plastic(1711395, 0.46),
          { pos: YK, rot: [0, -yA, 0], from: [0.7, 0.2, 0.3], delay: 0.5 }
        );
        const leads = [],
          pads = [],
          snaps = [],
          collars = [];
        const padGeo = GEO.lathe(
          [
            [0, 0],
            [0.1, 0],
            [0.102, 4e-3],
            [0.098, 95e-4],
            [0.09, 0.0115],
            [0, 0.0115],
          ],
          28
        );
        const snapGeo = GEO.cyl(0.03, 0.032, 0.024, 16),
          neckGeo = new THREE.BoxGeometry(0.05, 0.017, 0.022),
          colGeo = GEO.cyl(0.0125, 0.0125, 0.012, 10);
        const E = [];
        for (let i = 0; i < 10; i++) {
          const a = yA - 1.32 + (2.64 * i) / 9,
            r = i % 2 ? 0.76 : 0.52;
          const ex = YK[0] + Math.cos(a) * r,
            ez = YK[2] + Math.sin(a) * r;
          E.push([ex, ez]);
          const ox = YK[0] + ax[0] * 0.1 + lat[0] * (i - 4.5) * 55e-4,
            oz = YK[2] + ax[1] * 0.1 + lat[1] * (i - 4.5) * 55e-4;
          let dx = ox - ex,
            dz = oz - ez;
          const dl = Math.hypot(dx, dz);
          dx /= dl;
          dz /= dl;
          const phi = Math.atan2(dz, dx);
          const nx = ex + dx * 0.058,
            nz = ez + dz * 0.058;
          const bow = (i % 2 ? 1 : -1) * 0.025;
          const mx = (ox + ax[0] * 0.1 + nx) / 2 - dz * bow,
            mz = (oz + ax[1] * 0.1 + nz) / 2 + dx * bow;
          leads.push(
            GEO.tube(
              [
                [ox, 0.03, oz],
                [ox + ax[0] * 0.1, 0.012, oz + ax[1] * 0.1],
                [mx, 95e-4, mz],
                [nx + dx * 0.06, 0.016, nz + dz * 0.06],
                [nx, 0.023, nz],
              ],
              85e-4,
              40,
              6
            )
          );
          pads.push(GEO.at(padGeo, [ex, 0, ez]));
          snaps.push(
            GEO.at(snapGeo, [ex, 0.0235, ez]),
            GEO.at(
              neckGeo,
              [ex + dx * 0.035, 0.0235, ez + dz * 0.035],
              [0, -phi, 0]
            )
          );
          collars.push(
            GEO.at(
              colGeo,
              [nx - dx * 2e-3, 0.023, nz - dz * 2e-3],
              [0, -phi, PI / 2]
            )
          );
        }
        d.part(GEO.merge(leads), cableMat, {
          from: [0, 0.35, 0.5],
          delay: 0.56,
        });
        const foam = new THREE.MeshPhysicalMaterial({
          color: 11449533,
          roughness: 0.92,
          metalness: 0,
          sheen: 0.35,
          sheenRoughness: 0.8,
          sheenColor: new THREE.Color(14673650),
        });
        d.part(GEO.merge(pads), foam, { from: [0, 0.6, 0.6], delay: 0.36 });
        d.part(GEO.merge(snaps), MAT.plastic(1184793, 0.4), {
          from: [0, 0.35, 0.5],
          delay: 0.56,
        });
        d.part(GEO.merge(collars), MAT.plastic(14240664, 0.46), {
          from: [0, 0.35, 0.5],
          delay: 0.56,
        });
        d.label(
          "eECG-12 · <em>designed for 12-lead ECG</em>",
          "#F472B6",
          toBody(-0.62, 0.6, 0),
          [0.46, 0.8]
        );
        d.label(
          '7" TFT IPS · <em>1024×600, capacitive touch</em>',
          "#F9A8D4",
          toBody(-0.6, 0.12, 0.14),
          [0.5, 0.8]
        );
        d.label(
          "Designed to IEC 60601-1 · <em>Class II BF applied part</em>",
          "#F472B6",
          [E[9][0] + 0.02, 0.03, E[9][1]],
          [0.54, 0.8]
        );
        d.label(
          "MCU · <em>STM32H7B3ZIT6, Cortex-M7 @ 280MHz</em>",
          "#F9A8D4",
          toBody(-0.36, -0.2, 0.1),
          [0.56, 0.76]
        );
        let lastDraw = -1,
          lastH = -1;
        d.anim((p, time, dt, env) => {
          const live = env.hero * (1 - env.fin);
          if (live > 0.01 && Math.abs(time - lastDraw) > 0.033) {
            lastDraw = time;
            scrMat.userData.redraw(time);
          }
          if (live < 1e-3 && lastH < 1e-3) return;
          lastH = live;
          const pulse = 0.5 + 0.5 * Math.sin(time * 2.4);
          ringMat.color.setHex(ACC).multiplyScalar(1.6 + 0.8 * live * pulse);
          barMat.color.setHex(ACC).multiplyScalar(1.4 + 0.6 * live * pulse);
        });
        d.frame({
          dist: 4.2,
          height: 1.85,
          targetY: 0.4,
          fov: 32,
          yaw0: -0.45,
          yaw1: 0.36,
        });
        d.footprint(1.25);
        return d;
      };
      DEVICES.emining = () => {
        const d = device("emining");
        const HALF = Math.PI / 2;
        const YEL = 15250706,
          STONE = 11051678;
        const W = 0.74,
          H = 1.32,
          R = 0.12;
        const Y0 = 0.21,
          YC = Y0 + H / 2;
        const ZB = -0.2,
          SPLIT = -0.02,
          ZF = 0.19,
          ZP = 0.205;
        const BYC = 0.54;
        d.slot({ pos: [0, BYC, 5e-3], rot: [HALF, 0, 0], scale: 0.62 });
        const BOX = (w, h, dd) => new THREE.BoxGeometry(w, h, dd);
        const v2 = pts => pts.map(([a, b]) => new THREE.Vector2(a, b));
        const rrect = (w, h, r, n = 6) => {
          const pts = [];
          const cs = [
            [w / 2 - r, h / 2 - r, 0],
            [-w / 2 + r, h / 2 - r, HALF],
            [-w / 2 + r, -h / 2 + r, Math.PI],
            [w / 2 - r, -h / 2 + r, Math.PI * 1.5],
          ];
          for (const [cx, cy, a0] of cs)
            for (let i = 0; i <= n; i++) {
              const a = a0 + (i / n) * HALF;
              pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
            }
          return pts;
        };
        const ring = (w, h, r, t, z0, z1, bevel = 4e-3) => {
          const s = new THREE.Shape(v2(rrect(w - 2 * bevel, h - 2 * bevel, r)));
          s.holes.push(
            new THREE.Path(
              v2(rrect(w - 2 * t, h - 2 * t, Math.max(0.01, r - t)))
            )
          );
          return new THREE.ExtrudeGeometry(s, {
            depth: z1 - z0 - 2 * bevel,
            bevelEnabled: true,
            bevelThickness: bevel,
            bevelSize: bevel,
            bevelSegments: 2,
            curveSegments: 6,
          }).translate(0, YC, z0 + bevel);
        };
        const face = (w, h, r, b, zFace, dir = 1, y = YC, hole = null) => {
          const shape = new THREE.Shape(
            v2(rrect(w - 2 * b, h - 2 * b, Math.max(0.01, r - b)))
          );
          if (hole)
            shape.holes.push(
              new THREE.Path(
                v2(
                  rrect(hole[0], hole[1], hole[2]).map(([a, c]) => [
                    a,
                    c + hole[3],
                  ])
                )
              )
            );
          const g = new THREE.ExtrudeGeometry(shape, {
            depth: 2e-3,
            bevelEnabled: true,
            bevelThickness: b,
            bevelSize: b,
            bevelSegments: 4,
            curveSegments: 6,
          });
          if (dir < 0) g.rotateY(Math.PI);
          return g.translate(0, y, zFace - dir * (2e-3 + b));
        };
        const cradleMat = MAT.plastic(1777445, 0.55);
        const backMat = d.xray(MAT.plastic(1448222, 0.62));
        const yellow = d.xray(MAT.rubber(YEL));
        yellow.sheenColor.set(7033872);
        const panelMat = d.xray(MAT.plastic(921877, 0.5));
        panelMat.clearcoat = 0.1;
        panelMat.clearcoatRoughness = 0.5;
        const black = d.xray(MAT.plastic(2764598, 0.55));
        const grey = MAT.plastic(2567219, 0.5);
        const rubberBlack = MAT.rubber(1118999);
        const stone = MAT.rubber(STONE);
        const yelBtn = MAT.rubber(YEL);
        const steel = MAT.steel(0.4);
        const clipMat = d.xray(MAT.anod(9209471, 0.5));
        const meshTex = canvasTex(128, 128, (g, w, h) => {
          g.fillStyle = "#6b7078";
          g.fillRect(0, 0, w, h);
          g.fillStyle = "#07080a";
          for (let y = 0; y < 13; y++)
            for (let x = 0; x < 13; x++) {
              g.beginPath();
              g.arc(
                6 + x * 9.6 + (y % 2) * 4.8,
                6 + y * 9.6,
                3.2,
                0,
                Math.PI * 2
              );
              g.fill();
            }
        });
        const meshMat = new THREE.MeshStandardMaterial({
          map: meshTex,
          metalness: 0.7,
          roughness: 0.45,
        });
        const alarmMat = new THREE.MeshStandardMaterial({
          color: 1705478,
          emissive: 16722458,
          emissiveIntensity: 0.2,
          roughness: 0.3,
          metalness: 0,
        });
        {
          const g = new THREE.Group();
          const cr = [GEO.at(GEO.rbox(1, 0.2, 0.62, 0.05, 3), [0, 0.1, -0.02])];
          for (const sx of [-1, 1])
            cr.push(
              GEO.at(GEO.rbox(0.09, 0.24, 0.46, 0.035, 3), [sx * 0.43, 0.3, 0])
            );
          cr.push(GEO.at(GEO.rbox(0.58, 0.012, 0.3, 5e-3, 1), [0, 0.203, 0]));
          g.add(new THREE.Mesh(GEO.merge(cr), cradleMat));
          const lead = GEO.merge([
            GEO.tube(
              [
                [0.22, 0.09, -0.33],
                [0.24, 0.07, -0.44],
                [0.32, 0.025, -0.56],
                [0.52, 0.02, -0.7],
                [0.74, 0.02, -0.76],
              ],
              0.024,
              28,
              10
            ),
            GEO.at(
              GEO.cyl(0.035, 0.04, 0.06, 16),
              [0.22, 0.09, -0.35],
              [HALF, 0, 0]
            ),
          ]);
          d.part(lead, cradleMat, { from: [0, 0, 0.95], delay: 0 });
          const pins = [];
          for (const px of [-0.18, -0.06, 0.06, 0.18])
            pins.push(
              GEO.at(GEO.cyl(0.012, 0.014, 0.016, 10), [px, 0.212, 0.03])
            );
          g.add(new THREE.Mesh(GEO.merge(pins), MAT.gold()));
          g.add(
            new THREE.Mesh(
              GEO.at(GEO.rbox(0.08, 0.022, 0.012, 6e-3, 1), [0.3, 0.12, 0.293]),
              MAT.led(YEL, 1.8)
            )
          );
          d.part(g, null, { from: [0, 0, 0.95], delay: 0, edge: true });
        }
        {
          const g = new THREE.Group();
          const backRim = new THREE.Mesh(
            ring(W, H, R, 0.03, ZB + 0.03, SPLIT - 4e-3),
            yellow
          );
          const backFace = new THREE.Mesh(
            face(W - 0.02, H - 0.02, R - 0.01, 0.05, ZB, -1),
            backMat
          );
          backRim.renderOrder = backFace.renderOrder = 1;
          g.add(backRim, backFace);
          const scr = [];
          const head = GEO.lathe(
            [
              [0.022, 0],
              [0.022, 3e-3],
              [0.02, 8e-3],
              [0.012, 0.011],
              [5e-4, 0.012],
            ],
            12
          ).rotateX(-HALF);
          for (const [sx, sy] of [
            [-0.26, Y0 + 0.12],
            [0.26, Y0 + 0.12],
            [-0.26, Y0 + H - 0.12],
            [0.26, Y0 + H - 0.12],
          ])
            scr.push(GEO.at(head, [sx, sy, ZB + 2e-3]));
          g.add(new THREE.Mesh(GEO.merge(scr), steel));
          d.part(g, null, { from: [0, 0, -1], delay: 0.16, edge: true });
        }
        {
          const clip = GEO.merge([
            GEO.at(GEO.rbox(0.24, 0.15, 0.05, 0.02, 2), [
              0,
              Y0 + H - 0.2,
              ZB - 0.02,
            ]),
            GEO.at(
              GEO.rbox(0.19, 0.7, 0.022, 0.01, 2),
              [0, Y0 + H - 0.53, ZB - 0.056],
              [-0.04, 0, 0]
            ),
            GEO.at(
              GEO.rbox(0.19, 0.06, 0.03, 0.012, 2),
              [0, Y0 + H - 0.87, ZB - 0.078],
              [-0.5, 0, 0]
            ),
          ]);
          d.part(clip, clipMat, {
            from: [0, 0.25, -0.75],
            spin: [0.5, 0, 0],
            delay: 0.76,
          });
        }
        let screenMat;
        {
          const g = new THREE.Group();
          const cup = new THREE.Mesh(
            GEO.merge([
              ring(W, H, R, 0.03, SPLIT, ZF - 0.04),
              face(W, H, R, 0.03, ZF, 1, YC, [W - 0.2, H - 0.23, 0.06, -0.01]),
            ]),
            yellow
          );
          const panel = new THREE.Mesh(
            face(W - 0.1, H - 0.13, 0.085, 8e-3, ZP, 1, YC - 0.01),
            panelMat
          );
          cup.renderOrder = 2;
          panel.renderOrder = 3;
          g.add(cup, panel);
          const SY = Y0 + H - 0.2;
          const sh = [
            GEO.at(GEO.rbox(0.58, 0.14, 0.014, 0.03, 2), [0, SY, ZP + 3e-3]),
          ];
          const discs = [];
          for (let k = 0; k < 4; k++) {
            const sx = -0.21 + k * 0.14;
            sh.push(
              GEO.at(GEO.torus(0.043, 9e-3, 8, 28), [sx, SY, ZP + 0.011])
            );
            discs.push(
              GEO.at(new THREE.CircleGeometry(0.036, 24), [sx, SY, ZP + 0.012])
            );
          }
          g.add(new THREE.Mesh(GEO.merge(sh), grey));
          g.add(new THREE.Mesh(GEO.merge(discs), meshMat));
          const lv = [0.72, 0.16, 0.1, 0.07],
            cols = ["#38bdf8", "#22c55e", "#22c55e", "#22c55e"];
          screenMat = d.xray(
            MAT.screen(
              (c, w, h, t) => {
                const al = t < 0 ? 1 : 0,
                  tt = Math.abs(t);
                c.fillStyle = "#04060a";
                c.fillRect(0, 0, w, h);
                c.fillStyle = al ? "#3a0c0a" : "#101820";
                c.fillRect(0, 0, w, h * 0.14);
                c.fillStyle = "#9aa3ad";
                c.fillRect(w * 0.82, h * 0.035, w * 0.12, h * 0.07);
                c.fillRect(w * 0.94, h * 0.055, w * 0.012, h * 0.03);
                c.fillStyle = "#22c55e";
                c.fillRect(w * 0.83, h * 0.045, w * 0.075, h * 0.05);
                for (let i = 0; i < 3; i++) {
                  c.fillStyle =
                    i === 0 ? (al ? "#ef4444" : "#22c55e") : "#2a3440";
                  c.beginPath();
                  c.arc(
                    w * (0.06 + i * 0.05),
                    h * 0.07,
                    h * 0.022,
                    0,
                    Math.PI * 2
                  );
                  c.fill();
                }
                for (let k = 0; k < 4; k++) {
                  const x0 = w * (0.07 + k * 0.235),
                    bw = w * 0.15,
                    top = h * 0.22,
                    bot = h * 0.9;
                  c.fillStyle = "#121a22";
                  c.fillRect(x0, top, bw, bot - top);
                  let v =
                    lv[k] + 0.025 * Math.sin(tt * (1.1 + k * 0.4) + k * 1.7);
                  let col = cols[k];
                  if (k === 1 && al) {
                    v = 0.88;
                    col = "#ef4444";
                  }
                  c.fillStyle = col;
                  c.fillRect(x0, bot - (bot - top) * v, bw, (bot - top) * v);
                  c.fillStyle = "rgba(255,255,255,0.18)";
                  for (let q = 1; q < 5; q++)
                    c.fillRect(
                      x0 - w * 0.012,
                      top + ((bot - top) * q) / 5,
                      w * 0.01,
                      h * 6e-3
                    );
                  c.fillStyle = k === 0 ? "#f59e0b" : "#ef4444";
                  c.fillRect(
                    x0,
                    top + (bot - top) * (k === 0 ? 0.2 : 0.45),
                    bw,
                    h * 8e-3
                  );
                }
                if (al) {
                  c.strokeStyle = "#ef4444";
                  c.lineWidth = w * 0.02;
                  c.strokeRect(w * 0.01, h * 0.01, w * 0.98, h * 0.98);
                }
              },
              256,
              176,
              1.05
            )
          );
          const scr = new THREE.Mesh(
            new THREE.PlaneGeometry(0.44, 0.3).translate(
              0,
              Y0 + H - 0.47,
              ZP + 15e-4
            ),
            screenMat
          );
          scr.renderOrder = 4;
          g.add(scr);
          const BY = Y0 + H - 0.76;
          g.add(
            new THREE.Mesh(
              GEO.merge([
                GEO.at(GEO.rbox(0.15, 0.075, 0.03, 0.03, 2), [
                  -0.19,
                  BY,
                  ZP + 0.012,
                ]),
                GEO.at(GEO.rbox(0.15, 0.075, 0.03, 0.03, 2), [
                  0.19,
                  BY,
                  ZP + 0.012,
                ]),
              ]),
              stone
            )
          );
          g.add(
            new THREE.Mesh(
              GEO.at(
                GEO.cyl(0.045, 0.048, 0.03, 24),
                [0, BY, ZP + 0.012],
                [HALF, 0, 0]
              ),
              yelBtn
            )
          );
          const gr = [];
          for (let k = 0; k < 5; k++)
            gr.push(
              GEO.at(GEO.rbox(0.32, 0.013, 8e-3, 4e-3, 1), [
                0,
                Y0 + 0.21 - k * 0.03,
                ZP + 3e-3,
              ])
            );
          const grille = new THREE.Mesh(GEO.merge(gr), black);
          grille.renderOrder = 4;
          g.add(grille);
          const grips = [];
          for (const sx of [-1, 1])
            for (let k = 0; k < 7; k++)
              grips.push(
                GEO.at(GEO.rbox(0.016, 0.05, 0.15, 7e-3, 1), [
                  sx * (W / 2 + 2e-3),
                  Y0 + 0.38 + k * 0.085,
                  0.07,
                ])
              );
          g.add(new THREE.Mesh(GEO.merge(grips), rubberBlack));
          const fs = [];
          const pan = GEO.lathe(
            [
              [0.016, 0],
              [0.016, 2e-3],
              [0.014, 6e-3],
              [8e-3, 8e-3],
              [5e-4, 85e-4],
            ],
            12
          ).rotateX(HALF);
          for (const [sx, sy] of [
            [-0.27, Y0 + 0.11],
            [0.27, Y0 + 0.11],
            [-0.27, Y0 + H - 0.105],
            [0.27, Y0 + H - 0.105],
          ])
            fs.push(GEO.at(pan, [sx, sy, ZP - 1e-3]));
          g.add(new THREE.Mesh(GEO.merge(fs), steel));
          d.part(g, null, { from: [0, 0.05, 0.85], delay: 0.42 });
        }
        const alarm = d.part(
          GEO.merge([
            GEO.at(GEO.rbox(0.44, 0.05, 0.17, 0.022, 2), [
              0,
              Y0 + H + 0.02,
              0.03,
            ]),
            GEO.at(GEO.rbox(0.4, 0.028, 0.018, 9e-3, 1), [
              0,
              Y0 + H - 0.045,
              ZF + 4e-3,
            ]),
          ]),
          alarmMat,
          { from: [0, 0.55, 0], delay: 0.64 }
        );
        alarm.castShadow = false;
        d.label(
          "eGasDetect-4 · <em>4-gas detector (O2, CO, H2S, LEL)</em>",
          "#A8A29E",
          [-0.12, Y0 + H + 0.07, 0.04],
          [0.46, 0.8]
        );
        d.label(
          "Sensors · <em>Electrochemical + catalytic bead</em>",
          "#FACC15",
          [0.21, Y0 + H - 0.2, ZP + 0.02],
          [0.47, 0.8]
        );
        d.label(
          "Alarms · <em>Audible 95dB + vibration + visual</em>",
          "#A8A29E",
          [0.17, Y0 + 0.15, ZP + 0.01],
          [0.5, 0.8]
        );
        d.label(
          "MCU · <em>STM32L4R9 (ultra-low-power)</em>",
          "#FACC15",
          [-0.12, BYC - 0.02, 0.04],
          [0.55, 0.78]
        );
        const RED = new THREE.Color(16722458),
          GREEN = new THREE.Color(2278750);
        let lastStep = -1;
        d.anim((p, time, dt, env) => {
          const al =
            env.fin > 0.5
              ? 0
              : sr(p, 0.58, 0.61) * (1 - sr(p, 0.72, 0.75)) * env.hero;
          if (al > 0.02) {
            alarmMat.emissive.copy(RED);
            alarmMat.emissiveIntensity =
              al * (Math.sin(time * 22) > 0 ? 3.2 : 0.3);
            d.body.position.set(
              4e-3 * Math.sin(time * 91) * al,
              0,
              3e-3 * Math.sin(time * 77) * al
            );
          } else {
            alarmMat.emissive.copy(GREEN);
            alarmMat.emissiveIntensity =
              env.a > 0.99
                ? 0.12 + 0.9 * Math.pow(Math.max(0, Math.sin(time * 2.6)), 12)
                : 0.05;
            if (d.body.position.x !== 0 || d.body.position.z !== 0)
              d.body.position.set(0, 0, 0);
          }
          const live = env.hero > 0.01 && env.fin < 0.5;
          const step = live
            ? Math.floor(time * 8) * (al > 0.5 ? -1 : 1) - (al > 0.5 ? 1 : 0)
            : -999;
          if (step !== lastStep) {
            lastStep = step;
            screenMat.userData.redraw(
              al > 0.5 ? -(time + 1e-3) : live ? time : 0
            );
          }
        });
        d.frame({
          dist: 3.8,
          height: 1.35,
          targetY: 0.84,
          fov: 32,
          yaw0: -0.5,
          yaw1: 0.35,
        });
        d.footprint(0.95);
        return d;
      };
      DEVICES.eoshealth = () => {
        const d = device("eoshealth");
        const PI = Math.PI,
          TAU2 = PI * 2;
        const ACC = 16478597;
        const BETA = 0.2,
          WY = 1.024,
          WZ = 0.48;
        const cb = Math.cos(BETA),
          sb = Math.sin(BETA);
        const toBodyW = (X, Y, Z) => [
          X,
          WY + Y * cb + Z * sb,
          WZ - Y * sb + Z * cb,
        ];
        const turnAt = (P, a) => [
          P[0] * Math.cos(a) + P[2] * Math.sin(a),
          P[1],
          -P[0] * Math.sin(a) + P[2] * Math.cos(a),
        ];
        const turnG = d.part(new THREE.Group(), null, { static: true });
        const watch = d.part(new THREE.Group(), null, {
          static: true,
          parent: turnG,
          pos: [0, WY, WZ],
          rot: [-BETA, 0, 0],
        });
        const SLOT_Z = 0.035,
          SLOT_S = 0.75;
        d.slot({
          pos: toBodyW(0, 0, SLOT_Z),
          rot: [-PI / 2 - BETA, 0, 0],
          scale: SLOT_S,
        });
        const zUp = g => g.rotateX(PI / 2);
        const caseMat = d.xray(MAT.plastic(1382431, 0.44));
        const lug = GEO.rbox(0.075, 0.16, 0.13, 0.034, 3);
        d.part(
          GEO.merge([
            zUp(
              GEO.lathe(
                [
                  [0, -0.128],
                  [0.455, -0.128],
                  [0.485, -0.112],
                  [0.5, -0.082],
                  [0.503, -0.02],
                  [0.5, 0.04],
                  [0.49, 0.052],
                  [0, 0.052],
                ],
                72
              )
            ),
            GEO.at(lug, [0.325, 0.52, -0.045], [0.24, 0, 0]),
            GEO.at(lug, [-0.325, 0.52, -0.045], [0.24, 0, 0]),
            GEO.at(lug, [0.325, -0.52, -0.045], [-0.24, 0, 0]),
            GEO.at(lug, [-0.325, -0.52, -0.045], [-0.24, 0, 0]),
          ]),
          caseMat,
          { parent: watch, from: [0, 0, -0.9], delay: 0.18, edge: true }
        );
        d.part(
          new THREE.RingGeometry(0.436, 0.468, 72, 1),
          MAT.plastic(329224, 0.5),
          {
            parent: watch,
            pos: [0, 0, 0.119],
            from: [0, 0, 1.05],
            delay: 0.82,
            cast: false,
          }
        );
        const bezelMat = d.xray(
          new THREE.MeshPhysicalMaterial({
            color: 10791603,
            metalness: 1,
            roughness: 0.34,
            clearcoat: 0.1,
            clearcoatRoughness: 0.3,
          })
        );
        d.part(
          zUp(
            GEO.lathe(
              [
                [0.464, 0.05],
                [0.5, 0.05],
                [0.507, 0.075],
                [0.503, 0.108],
                [0.49, 0.127],
                [0.472, 0.132],
                [0.464, 0.129],
                [0.464, 0.05],
              ],
              96
            )
          ),
          bezelMat,
          {
            parent: watch,
            from: [0, 0, 0.9],
            spin: [0, 0, 0.8],
            delay: 0.7,
            edge: true,
          }
        );
        const UI = TXS / 2,
          k = UI / 512;
        const RING_C = ["#fb7185", "#fda4af", "#f9a8d4"],
          RING_T = ["#3a1820", "#3a2226", "#38202c"],
          RING_P = [0.78, 0.6, 0.88];
        const hr = x =>
          0.5 +
          0.22 * Math.sin(x * 2.1) +
          0.12 * Math.sin(x * 5.3 + 1.2) +
          0.06 * Math.sin(x * 11.7);
        let fill2 = 0.3;
        const drawUI = (g, w, h, t) => {
          g.fillStyle = "#000";
          g.fillRect(0, 0, w, h);
          const cx = w / 2,
            cy = 214 * k;
          g.lineCap = "round";
          for (let i = 0; i < 3; i++) {
            const r = (118 - i * 27) * k;
            g.lineWidth = 21 * k;
            g.strokeStyle = RING_T[i];
            g.beginPath();
            g.arc(cx, cy, r, 0, TAU2);
            g.stroke();
            g.strokeStyle = RING_C[i];
            g.beginPath();
            g.arc(cx, cy, r, -PI / 2, -PI / 2 + TAU2 * RING_P[i] * fill2);
            g.stroke();
          }
          const hx = 142 * k,
            hy = 366 * k,
            s = 13 * k;
          g.fillStyle = "#fb7185";
          g.beginPath();
          g.moveTo(hx, hy + s * 0.9);
          g.bezierCurveTo(
            hx - s * 1.5,
            hy,
            hx - s * 0.9,
            hy - s * 1.1,
            hx,
            hy - s * 0.35
          );
          g.bezierCurveTo(
            hx + s * 0.9,
            hy - s * 1.1,
            hx + s * 1.5,
            hy,
            hx,
            hy + s * 0.9
          );
          g.fill();
          const x0 = 178 * k,
            x1 = 392 * k,
            yb = 404 * k,
            yh = 66 * k;
          g.beginPath();
          g.moveTo(x0, yb);
          for (let x = x0; x <= x1; x += 4 * k)
            g.lineTo(x, yb - hr((x - x0) / (40 * k) + t * 0.9) * yh);
          g.lineTo(x1, yb);
          g.closePath();
          g.fillStyle = "rgba(251, 113, 133, 0.22)";
          g.fill();
          g.beginPath();
          for (let x = x0; x <= x1; x += 4 * k) {
            const y = yb - hr((x - x0) / (40 * k) + t * 0.9) * yh;
            if (x === x0) g.moveTo(x, y);
            else g.lineTo(x, y);
          }
          g.lineWidth = 4.5 * k;
          g.strokeStyle = "#fecdd3";
          g.stroke();
          g.fillStyle = "#ffffff";
          g.beginPath();
          g.arc(
            x1,
            yb - hr((x1 - x0) / (40 * k) + t * 0.9) * yh,
            7 * k,
            0,
            TAU2
          );
          g.fill();
          g.fillStyle = "#4b5563";
          for (let i = 0; i < 3; i++) {
            g.beginPath();
            g.arc((238 + i * 18) * k, 452 * k, 4.5 * k, 0, TAU2);
            g.fill();
          }
          g.fillStyle = "#e5e7eb";
          g.beginPath();
          g.arc(256 * k, 452 * k, 4.5 * k, 0, TAU2);
          g.fill();
        };
        const scrMat = MAT.screen(drawUI, UI, UI, 1.12);
        const glassMat = d.xray(
          new THREE.MeshPhysicalMaterial({
            color: 790293,
            metalness: 0,
            roughness: 0.12,
            transparent: true,
            opacity: 0.13,
            clearcoat: 0.3,
            clearcoatRoughness: 0.1,
            envMapIntensity: 0.22,
            depthWrite: false,
          })
        );
        glassMat.userData.noAO = true;
        const glass = d.part(
          zUp(
            GEO.lathe(
              [
                [0.466, 0.122],
                [0.462, 0.131],
                [0.448, 0.142],
                [0.42, 0.151],
                [0.36, 0.1565],
                [0, 0.158],
              ],
              72
            )
          ),
          glassMat,
          { parent: watch, from: [0, 0, 1.2], delay: 0.9, cast: false }
        );
        d.part(new THREE.CircleGeometry(0.438, 72), scrMat, {
          parent: watch,
          pos: [0, 0, 0.12],
          from: [0, 0, 1.05],
          delay: 0.82,
          cast: false,
        });
        const steel = MAT.steel(0.46);
        steel.color.setHex(9409950);
        steel.flatShading = true;
        d.part(
          GEO.merge([
            GEO.at(
              GEO.cyl(0.079, 0.079, 0.072, 26),
              [0.545, 0.1, -0.02],
              [0, 0, PI / 2]
            ),
            GEO.at(
              GEO.cyl(0.036, 0.036, 0.05, 12),
              [0.5, 0.1, -0.02],
              [0, 0, PI / 2]
            ),
            GEO.at(GEO.rbox(0.04, 0.12, 0.05, 0.016, 2), [0.497, -0.2, -0.02]),
            GEO.at(
              GEO.cyl(0.055, 0.055, 0.035, 18),
              [0.29, -0.24, -0.075],
              [PI / 2, 0, 0]
            ),
          ]),
          steel,
          { parent: watch, from: [0.7, 0, 0], delay: 0.6 }
        );
        d.part(
          GEO.at(
            GEO.torus(0.062, 7e-3, 6, 28),
            [0.582, 0.1, -0.02],
            [0, PI / 2, 0]
          ),
          MAT.led(ACC, 1.5),
          { parent: watch, from: [0.7, 0, 0], delay: 0.6, cast: false }
        );
        const backMat = d.xray(MAT.steel(0.34));
        const back = d.part(
          zUp(
            GEO.lathe(
              [
                [0.135, -0.146],
                [0.3, -0.143],
                [0.42, -0.138],
                [0.452, -0.133],
                [0.462, -0.127],
              ],
              72
            )
          ),
          backMat,
          { parent: watch, from: [0, 0, -1], delay: 0.08, edge: true }
        );
        const domeMat = d.xray(
          new THREE.MeshPhysicalMaterial({
            color: 857876,
            metalness: 0,
            roughness: 0.14,
            transparent: true,
            opacity: 0.42,
            clearcoat: 0.3,
            clearcoatRoughness: 0.1,
            envMapIntensity: 0.4,
            depthWrite: false,
          })
        );
        domeMat.userData.noAO = true;
        d.part(
          zUp(
            GEO.lathe(
              [
                [0, -0.163],
                [0.06, -0.161],
                [0.1, -0.155],
                [0.128, -0.148],
                [0.138, -0.144],
              ],
              48
            )
          ),
          domeMat,
          { parent: back, static: true, cast: false }
        );
        const ledG = GEO.cyl(0.017, 0.017, 6e-3, 14);
        const ppg = GEO.merge([
          GEO.at(ledG, [0.05, 0, -0.149], [PI / 2, 0, 0]),
          GEO.at(ledG, [-0.05, 0, -0.149], [PI / 2, 0, 0]),
          GEO.at(ledG, [0, 0.05, -0.149], [PI / 2, 0, 0]),
          GEO.at(ledG, [0, -0.05, -0.149], [PI / 2, 0, 0]),
        ]);
        const pc = new Float32Array(ppg.attributes.position.count * 3),
          pn = ppg.attributes.position.count / 4;
        const PPGC = [
          [0.45, 2.4, 0.8],
          [0.45, 2.4, 0.8],
          [2.4, 0.3, 0.32],
          [0.42, 0.06, 0.14],
        ];
        for (let i = 0; i < ppg.attributes.position.count; i++)
          pc.set(PPGC[Math.min(3, (i / pn) | 0)], i * 3);
        ppg.setAttribute("color", new THREE.BufferAttribute(pc, 3));
        d.part(ppg, new THREE.MeshBasicMaterial({ vertexColors: true }), {
          parent: back,
          static: true,
          cast: false,
        });
        d.part(
          GEO.merge([
            GEO.at(new THREE.BoxGeometry(0.03, 0.03, 4e-3), [0.095, 0, -0.147]),
            GEO.at(
              new THREE.BoxGeometry(0.03, 0.03, 4e-3),
              [-0.095, 0, -0.147]
            ),
          ]),
          MAT.plastic(1709104, 0.3),
          { parent: back, static: true, cast: false }
        );
        const padMat = MAT.gold();
        padMat.roughness = 0.7;
        padMat.color.setHex(11768143);
        const arc = GEO.torus(0.3, 0.013, 6, 28, 2.1);
        d.part(
          GEO.merge([
            GEO.at(arc, [0, 0, -0.1425], [0, 0, -1.05], [1, 1, 0.4]),
            GEO.at(arc, [0, 0, -0.1425], [0, 0, PI - 1.05], [1, 1, 0.4]),
            GEO.at(
              GEO.cyl(0.018, 0.018, 8e-3, 10),
              [0.06, -0.385, -0.139],
              [PI / 2, 0, 0]
            ),
            GEO.at(
              GEO.cyl(0.018, 0.018, 8e-3, 10),
              [-0.06, -0.385, -0.139],
              [PI / 2, 0, 0]
            ),
          ]),
          padMat,
          { parent: back, static: true }
        );
        const glowTex = canvasTex(128, 128, (g, w) => {
          const gr = g.createRadialGradient(
            w / 2,
            w / 2,
            0,
            w / 2,
            w / 2,
            w / 2
          );
          gr.addColorStop(0, "rgba(255,255,255,1)");
          gr.addColorStop(0.3, "rgba(255,255,255,0.4)");
          gr.addColorStop(1, "rgba(255,255,255,0)");
          g.fillStyle = gr;
          g.fillRect(0, 0, w, w);
        });
        const glowMat = new THREE.SpriteMaterial({
          map: glowTex,
          color: HDR(4906624, 1.3),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const glow = new THREE.Sprite(glowMat);
        glow.scale.setScalar(0.3);
        d.part(glow, null, {
          parent: back,
          static: true,
          pos: [0, 0, -0.17],
          cast: false,
        });
        d.part(
          GEO.rbox(0.5, 0.34, 0.048, 0.02, 2),
          d.xray(MAT.alu(10134189, 0.5)),
          {
            parent: watch,
            pos: [0, 0.02, -0.078],
            from: [0, 0, -0.7],
            delay: 0.04,
          }
        );
        const aY = 0.88,
          aZ = 0.62,
          BAR = [0.55, -0.068];
        const phiL = Math.asin(BAR[0] / aY),
          ZC = aZ * Math.cos(phiL) - BAR[1],
          GAPH = 0.66;
        const TH = 0.085,
          BW2 = 0.56,
          BEV = 0.013;
        const cen = f => [aY * Math.sin(f), -ZC + aZ * Math.cos(f)];
        const nrm = f => {
          const ny = Math.sin(f) / aY,
            nz = Math.cos(f) / aZ,
            l = Math.hypot(ny, nz);
          return [ny / l, nz / l];
        };
        const frameAt = (f, off) => {
          const [y, z] = cen(f),
            [ny, nz] = nrm(f);
          return { p: [y + ny * off, z + nz * off], n: [ny, nz], t: [nz, -ny] };
        };
        const boxN = n => Math.atan2(-n[0], n[1]),
          cylN = n => Math.atan2(n[1], n[0]);
        const strapGeo = samples => {
          const C2 = samples.map(([f, th]) => {
            const [y, z] = cen(f),
              [ny, nz] = nrm(f);
            return [z, y, nz, ny, th / 2 - BEV];
          });
          const sh = new THREE.Shape();
          const L = C2.length;
          C2.forEach(([z, y, nz, ny, h], i) =>
            i
              ? sh.lineTo(z + nz * h, y + ny * h)
              : sh.moveTo(z + nz * h, y + ny * h)
          );
          const cap = (i, j, start) => {
            const [z, y, nz, ny, h] = C2[i];
            let tz = C2[i][0] - C2[j][0],
              ty = C2[i][1] - C2[j][1];
            const tl = Math.hypot(tz, ty);
            tz /= tl;
            ty /= tl;
            for (let s = 1; s < 8; s++) {
              const a = start ? PI - (s / 8) * PI : (s / 8) * PI;
              sh.lineTo(
                z + nz * h * Math.cos(a) + tz * h * Math.sin(a),
                y + ny * h * Math.cos(a) + ty * h * Math.sin(a)
              );
            }
          };
          cap(L - 1, L - 2, false);
          for (let i = L - 1; i >= 0; i--) {
            const [z, y, nz, ny, h] = C2[i];
            sh.lineTo(z - nz * h, y - ny * h);
          }
          cap(0, 1, true);
          const g = new THREE.ExtrudeGeometry(sh, {
            depth: BW2 - 2 * BEV,
            bevelEnabled: true,
            bevelThickness: BEV,
            bevelSize: BEV,
            bevelSegments: 2,
            curveSegments: 4,
          });
          g.translate(0, 0, -(BW2 - 2 * BEV) / 2);
          g.rotateY(-PI / 2);
          return g;
        };
        const smooth01 = v => (v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v));
        const A1 = PI - GAPH,
          B1 = PI + GAPH;
        const sA = [],
          sB = [];
        for (let i = 0; i <= 56; i++) {
          const f = phiL + ((A1 - phiL) * i) / 56;
          sA.push([f, TH * (1 + 0.16 * Math.max(0, 1 - (f - phiL) / 0.09))]);
        }
        for (let i = 0; i <= 56; i++) {
          const f = TAU2 - phiL + ((B1 - (TAU2 - phiL)) * i) / 56;
          sB.push([
            f,
            TH *
              (1 + 0.16 * Math.max(0, 1 - (TAU2 - phiL - f) / 0.09)) *
              (1 - 0.3 * smooth01((B1 + 0.16 - f) / 0.16)),
          ]);
        }
        const silicone = new THREE.MeshPhysicalMaterial({
          color: 1842983,
          metalness: 0,
          roughness: 0.66,
          sheen: 0.45,
          sheenRoughness: 0.6,
          sheenColor: new THREE.Color(4871280),
          specularIntensity: 0.6,
        });
        const kf = frameAt(A1 - 0.26, 0);
        const kOut = new THREE.Shape(),
          kIn = new THREE.Path();
        const kw = BW2 / 2 + 0.022,
          kn = TH / 2 + 0.022;
        kOut.moveTo(-kw, -kn);
        kOut.lineTo(kw, -kn);
        kOut.lineTo(kw, kn);
        kOut.lineTo(-kw, kn);
        kIn.moveTo(-kw + 0.02, -kn + 0.02);
        kIn.lineTo(-kw + 0.02, kn - 0.02);
        kIn.lineTo(kw - 0.02, kn - 0.02);
        kIn.lineTo(kw - 0.02, -kn + 0.02);
        kOut.holes.push(kIn);
        const keeper = new THREE.ExtrudeGeometry(kOut, {
          depth: 0.06,
          bevelEnabled: true,
          bevelThickness: 8e-3,
          bevelSize: 8e-3,
          bevelSegments: 1,
          curveSegments: 2,
        });
        keeper.translate(0, 0, -0.03);
        keeper.applyMatrix4(
          new THREE.Matrix4()
            .makeBasis(
              new THREE.Vector3(1, 0, 0),
              new THREE.Vector3(0, kf.n[0], kf.n[1]),
              new THREE.Vector3(0, -kf.t[0], -kf.t[1])
            )
            .setPosition(0, kf.p[0], kf.p[1])
        );
        d.part(GEO.merge([strapGeo(sA), keeper]), silicone, {
          parent: watch,
          from: [0, 0.75, -0.3],
          spin: [0.5, 0, 0],
          delay: 0,
        });
        d.part(strapGeo(sB), silicone, {
          parent: watch,
          from: [0, -0.75, -0.3],
          spin: [-0.5, 0, 0],
          delay: 0,
        });
        const bf = frameAt(A1, 0);
        const bc = [bf.p[0] + bf.t[0] * 0.055, bf.p[1] + bf.t[1] * 0.055];
        const bOut = new THREE.Shape(),
          bIn = new THREE.Path();
        const bw = BW2 / 2 + 0.032,
          bl = 0.058;
        bOut.moveTo(-bw, -bl);
        bOut.lineTo(bw, -bl);
        bOut.lineTo(bw, bl);
        bOut.lineTo(-bw, bl);
        bIn.moveTo(-bw + 0.02, -bl + 0.02);
        bIn.lineTo(-bw + 0.02, bl - 0.02);
        bIn.lineTo(bw - 0.02, bl - 0.02);
        bIn.lineTo(bw - 0.02, -bl + 0.02);
        bOut.holes.push(bIn);
        const buckle = new THREE.ExtrudeGeometry(bOut, {
          depth: 0.01,
          bevelEnabled: true,
          bevelThickness: 6e-3,
          bevelSize: 5e-3,
          bevelSegments: 1,
          curveSegments: 2,
        });
        buckle.translate(0, 0, -5e-3);
        const bM = new THREE.Matrix4()
          .makeBasis(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, bf.t[0], bf.t[1]),
            new THREE.Vector3(0, bf.n[0], bf.n[1])
          )
          .setPosition(0, bc[0], bc[1]);
        buckle.applyMatrix4(bM);
        const tongue = new THREE.BoxGeometry(0.024, 0.1, 0.012)
          .translate(0, -4e-3, 3e-3)
          .applyMatrix4(bM);
        const bars = [
          buckle,
          tongue,
          GEO.at(
            GEO.cyl(0.013, 0.013, BW2 + 0.05, 12),
            [0, bf.p[0] + bf.t[0] * 4e-3, bf.p[1] + bf.t[1] * 4e-3],
            [0, 0, PI / 2]
          ),
        ];
        for (const s of [1, -1]) {
          const q = frameAt(
            s > 0 ? phiL + 0.08 : TAU2 - phiL - 0.08,
            -TH / 2 - 4e-3
          );
          bars.push(
            GEO.at(
              new THREE.BoxGeometry(0.035, 0.045, 0.01),
              [0.19, q.p[0], q.p[1]],
              [boxN(q.n), 0, 0]
            )
          );
        }
        d.part(GEO.merge(bars), MAT.steel(0.44), {
          parent: watch,
          from: [0, 0.6, -0.6],
          delay: 0.1,
        });
        const holes = [];
        for (let i = 0; i < 5; i++) {
          const hf = frameAt(B1 + 0.13 + i * 0.075, 0);
          holes.push(
            GEO.at(
              GEO.cyl(0.02, 0.02, TH + 4e-3, 12),
              [0, hf.p[0], hf.p[1]],
              [cylN(hf.n), 0, 0]
            )
          );
        }
        d.part(GEO.merge(holes), MAT.blackMetal(0.7), {
          parent: watch,
          from: [0, -0.75, -0.3],
          spin: [-0.5, 0, 0],
          delay: 0,
        });
        const arcLen = (f0, f1) => {
          let s = 0,
            [y0, z0] = cen(f0);
          for (let i = 1; i <= 80; i++) {
            const [y, z] = cen(f0 + ((f1 - f0) * i) / 80);
            s += Math.hypot(y - y0, z - z0);
            y0 = y;
            z0 = z;
          }
          return s;
        };
        const phiAt = (f0, dir, s) => {
          let lo = 0,
            hi = PI * 0.9;
          for (let it = 0; it < 30; it++) {
            const mid = (lo + hi) / 2;
            if (arcLen(f0, f0 + dir * mid) < s) lo = mid;
            else hi = mid;
          }
          return f0 + dir * lo;
        };
        const pads = [];
        for (const mm of [25, 40, 50])
          for (const [f0, dir] of [
            [phiL, 1],
            [TAU2 - phiL, -1],
          ]) {
            const pf = frameAt(phiAt(f0, dir, mm / 38), -TH / 2 - 3e-3);
            pads.push(
              GEO.at(
                new THREE.BoxGeometry(0.2, 0.06, 6e-3),
                [0, pf.p[0], pf.p[1]],
                [boxN(pf.n), 0, 0]
              )
            );
          }
        const bandPadMat = new THREE.MeshStandardMaterial({
          color: 9401400,
          metalness: 0.55,
          roughness: 0.78,
        });
        d.part(GEO.merge(pads), bandPadMat, {
          parent: watch,
          from: [0, 0.75, -0.3],
          delay: 0,
        });
        const TURN = PI - 0.55;
        d.label(
          "HEALTH-BAND Neuro · <em>wristband with 44mm case</em>",
          "#FB7185",
          [0, 1.98, 0],
          [0.46, 0.8]
        );
        d.label(
          '1.4" AMOLED · <em>454×454 px, 326 PPI</em>',
          "#FDA4AF",
          toBodyW(-0.47, -0.3, 0.12),
          [0.47, 0.585]
        );
        d.label(
          "Application MCU · <em>STM32H743, Cortex-M7 @ 480MHz</em>",
          "#FDA4AF",
          turnAt(toBodyW(0, 0.3, -0.05), TURN),
          [0.6, 0.74]
        );
        d.label(
          "PPG LEDs · <em>Green × 2, Red × 1, IR × 1</em>",
          "#FB7185",
          turnAt(toBodyW(0, -0.02, -0.17), TURN),
          [0.68, 0.8]
        );
        const mWatch = new THREE.Matrix4().compose(
          new THREE.Vector3(0, WY, WZ),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(-BETA, 0, 0)),
          new THREE.Vector3(1, 1, 1)
        );
        const mSlot = new THREE.Matrix4().compose(
          new THREE.Vector3(0, 0, SLOT_Z),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(-PI / 2, 0, 0)),
          new THREE.Vector3(SLOT_S, SLOT_S, SLOT_S)
        );
        const mTmp = new THREE.Matrix4();
        let lastTurn = -1,
          lastUI = -1,
          lastFill = -1,
          lastFin = -1;
        d.anim((p, time, dt, env) => {
          const on = 1 - env.fin;
          const ang =
            on *
            (TURN * easeInOut(clamp01((p - 0.56) / 0.1)) +
              (TAU2 - TURN) * easeInOut(clamp01((p - 0.8) / 0.1)));
          if (Math.abs(ang - lastTurn) > 1e-5) {
            lastTurn = ang;
            turnG.rotation.y = ang;
            turnG.updateMatrix();
            if (d.slotMatrix)
              d.slotMatrix.multiplyMatrices(
                mTmp.multiplyMatrices(turnG.matrix, mWatch),
                mSlot
              );
          }
          const h = env.hero * on;
          const f = 0.25 + 0.75 * sr(p, 0.44, 0.56);
          if (
            h > 0.01 &&
            (Math.abs(time - lastUI) > 0.033 || Math.abs(f - lastFill) > 1e-3)
          ) {
            lastUI = time;
            lastFill = f;
            fill2 = f;
            scrMat.userData.redraw(time);
          }
          if (env.fin !== lastFin) {
            lastFin = env.fin;
            bezelMat.envMapIntensity =
              bezelMat.userData.env * (1 - 0.75 * env.fin);
            bezelMat.roughness = lerp(bezelMat.userData.rough, 0.8, env.fin);
            glassMat.envMapIntensity =
              glassMat.userData.env * (1 - 0.75 * env.fin);
            steel.roughness = lerp(0.46, 0.85, env.fin);
          }
          glass.visible = env.x < 0.5;
          glowMat.opacity =
            on *
            sr(p, 0.6, 0.66) *
            (1 - sr(p, 0.8, 0.86)) *
            (0.3 + 0.25 * (0.5 + 0.5 * Math.sin(time * 6.5)));
        });
        d.frame({
          dist: 5.2,
          height: 1.45,
          targetY: 0.9,
          fov: 30,
          yaw0: -0.42,
          yaw1: 0.36,
        });
        d.footprint(0.95);
        return d;
      };
      DEVICES.epam = () => {
        const d = device("epam");
        const PI = Math.PI,
          TW = PI * 2;
        const ACC = 3003583;
        const HEAD = -0.5;
        const rig = new THREE.Group();
        rig.rotation.y = HEAD;
        d.body.add(rig);
        const cH = Math.cos(HEAD),
          sH = Math.sin(HEAD);
        const toBody = (x, y, z) => [x * cH + z * sH, y, -x * sH + z * cH];
        const FINISH = [
          ["rubber", 1382171, 0.86, 0, 0, 0],
          ["gun", 3817287, 0.42, 0.85, 0.2, 0],
          ["gunD", 2106153, 0.48, 0.7, 0.15, 0],
          ["alu", 11120825, 0.4, 1, 0.1, 0],
          ["lens", 329483, 0.12, 0, 1, 0],
          ["teal", 796194, 0.4, 0, 0, ACC],
          ["red", 2754566, 0.4, 0, 0, 16726832],
          ["green", 403984, 0.4, 0, 0, 3211114],
          ["seat", 2829877, 0.62, 0, 0.1, 0],
          ["floor", 1447965, 0.7, 0.1, 0, 0],
          ["pearl", 13225685, 0.36, 0.1, 0.8, 0],
          ["copper", 13208154, 0.38, 1, 0, 0],
          ["prop", 1777187, 0.4, 0.2, 0.5, 0],
        ];
        const NF = FINISH.length,
          U = {};
        const pcol = new Uint8Array(NF * 4),
          porm = new Uint8Array(NF * 4),
          pemi = new Uint8Array(NF * 4);
        FINISH.forEach(([n, c, r, m, cc, e], i) => {
          pcol.set([(c >> 16) & 255, (c >> 8) & 255, c & 255, 255], i * 4);
          porm.set(
            [
              Math.round(cc * 255),
              Math.round(r * 255),
              Math.round(m * 255),
              255,
            ],
            i * 4
          );
          pemi.set([(e >> 16) & 255, (e >> 8) & 255, e & 255, 255], i * 4);
          U[n] = (i + 0.5) / NF;
        });
        const dataTex = (data, cs) => {
          const t = new THREE.DataTexture(data, NF, 1);
          t.magFilter = t.minFilter = THREE.NearestFilter;
          t.generateMipmaps = false;
          t.colorSpace = cs;
          t.needsUpdate = true;
          return t;
        };
        const palMap = dataTex(pcol, THREE.SRGBColorSpace),
          palOrm = dataTex(porm, THREE.NoColorSpace),
          palEm = dataTex(pemi, THREE.SRGBColorSpace);
        const palette = k =>
          new THREE.MeshPhysicalMaterial({
            map: palMap,
            roughness: 1,
            roughnessMap: palOrm,
            metalness: 1,
            metalnessMap: palOrm,
            clearcoat: 1,
            clearcoatMap: palOrm,
            clearcoatRoughness: 0.2,
            emissive: 16777215,
            emissiveMap: palEm,
            emissiveIntensity: k,
          });
        const PAL = palette(1.8);
        const PALX = d.xray(palette(1.6));
        const paint = (geo, name) => {
          const u = U[name],
            a = geo.attributes.uv;
          for (let i = 0; i < a.count; i++) a.setXY(i, u, 0.5);
          return geo;
        };
        const F = (geo, name, pos, rot, scl) =>
          paint(GEO.at(geo, pos, rot, scl), name);
        const lat = (pts, n = 32) => GEO.lathe(pts, n);
        const Y = new THREE.Vector3(0, 1, 0);
        const strut = (a, b, r, n = 8) => {
          const A = new THREE.Vector3(...a),
            B = new THREE.Vector3(...b),
            dir = B.clone().sub(A);
          const g = GEO.cyl(r, r, dir.length(), n);
          g.applyMatrix4(
            new THREE.Matrix4().compose(
              A.clone().add(B).multiplyScalar(0.5),
              new THREE.Quaternion().setFromUnitVectors(Y, dir.normalize()),
              new THREE.Vector3(1, 1, 1)
            )
          );
          return g;
        };
        const gridGeo = (rows, out) => {
          const nr = rows.length,
            nc = rows[0].length,
            pos = [],
            uv = [],
            idx = [];
          rows.forEach((row, i) =>
            row.forEach((p2, j) => {
              pos.push(p2[0], p2[1], p2[2]);
              uv.push(j / (nc - 1), i / (nr - 1));
            })
          );
          for (let i = 0; i < nr - 1; i++)
            for (let j = 0; j < nc - 1; j++) {
              const A = i * nc + j,
                B = (i + 1) * nc + j,
                C2 = (i + 1) * nc + j + 1,
                D = i * nc + j + 1;
              idx.push(A, B, C2, A, C2, D);
            }
          const g = new THREE.BufferGeometry();
          g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
          g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
          g.setIndex(idx);
          g.computeVertexNormals();
          const mi = Math.floor(nr / 2) * nc + Math.floor(nc / 2),
            n = g.attributes.normal,
            p = g.attributes.position;
          const o = out(p.getX(mi), p.getY(mi), p.getZ(mi));
          if (n.getX(mi) * o[0] + n.getY(mi) * o[1] + n.getZ(mi) * o[2] < 0) {
            for (let k = 0; k < idx.length; k += 3) {
              const t = idx[k + 1];
              idx[k + 1] = idx[k + 2];
              idx[k + 2] = t;
            }
            g.setIndex(idx);
            g.computeVertexNormals();
          }
          return g;
        };
        const ST = [
          [0.75, 0, 0, 0, 0.266],
          [0.738, 0.028, 0.026, 0.022, 0.267],
          [0.712, 0.058, 0.052, 0.044, 0.269],
          [0.66, 0.097, 0.09, 0.072, 0.274],
          [0.585, 0.133, 0.128, 0.094, 0.281],
          [0.465, 0.157, 0.162, 0.113, 0.29],
          [0.3, 0.168, 0.181, 0.124, 0.296],
          [0.12, 0.168, 0.183, 0.126, 0.3],
          [-0.06, 0.158, 0.168, 0.12, 0.307],
          [-0.24, 0.13, 0.136, 0.104, 0.32],
          [-0.42, 0.092, 0.1, 0.08, 0.338],
          [-0.56, 0.06, 0.07, 0.056, 0.356],
          [-0.67, 0.036, 0.044, 0.035, 0.372],
          [-0.735, 0.017, 0.022, 0.017, 0.381],
          [-0.75, 0, 0, 0, 0.383],
        ];
        const crs = (p0, p1, p2, p3, t) =>
          0.5 *
          (2 * p1 +
            (-p0 + p2) * t +
            (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
            (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
        const SEC = [];
        for (let i = 0; i < ST.length - 1; i++)
          for (let k = 0; k < 3; k++) {
            const a = ST[Math.max(0, i - 1)],
              b = ST[i],
              c = ST[i + 1],
              e = ST[Math.min(ST.length - 1, i + 2)];
            SEC.push(
              b.map((_, j) =>
                Math.max(
                  j === 0 || j === 4 ? -9 : 0,
                  crs(a[j], b[j], c[j], e[j], k / 3)
                )
              )
            );
          }
        SEC.push(ST[ST.length - 1].slice());
        const NE = 2.6,
          pw = v => Math.sign(v) * Math.pow(Math.abs(v), 2 / NE);
        const secPt = (S2, th, k = 1) => [
          S2[1] * k * pw(Math.cos(th)),
          S2[4] + (Math.sin(th) >= 0 ? S2[2] : S2[3]) * k * pw(Math.sin(th)),
          S2[0],
        ];
        const CZc = 0.24,
          CZh = 0.37,
          TH_MIN = 0.4;
        const th0 = z => {
          const u = Math.abs((z - CZc) / CZh);
          return u >= 1
            ? PI / 2
            : PI / 2 - (PI / 2 - TH_MIN) * Math.cbrt(1 - u * u * u);
        };
        const NL = 44,
          NU = 20;
        const lowRows = [],
          canRows = [];
        SEC.forEach(S2 => {
          const t0 = th0(S2[0]);
          const low = [];
          for (let j = 0; j < NL; j++)
            low.push(secPt(S2, PI - t0 + ((PI + 2 * t0) * j) / (NL - 1)));
          lowRows.push(low);
        });
        for (let i = 0; i < SEC.length; i++) {
          const S2 = SEC[i],
            prevIn = i > 0 && th0(SEC[i - 1][0]) < PI / 2,
            nextIn = i < SEC.length - 1 && th0(SEC[i + 1][0]) < PI / 2;
          if (th0(S2[0]) >= PI / 2 && !prevIn && !nextIn) continue;
          const t0 = th0(S2[0]),
            row = [];
          for (let j = 0; j < NU; j++)
            row.push(secPt(S2, t0 + ((PI - 2 * t0) * j) / (NU - 1), 1.0015));
          canRows.push(row);
        }
        const fusOut = (x, y, z) => [x, y - 0.3, 0];
        const fusGeo = gridGeo(lowRows, fusOut);
        const canGeo = gridGeo(canRows, fusOut);
        const pearlX = d.xray(
          new THREE.MeshPhysicalMaterial({
            color: 13028306,
            metalness: 0.1,
            roughness: 0.36,
            clearcoat: 0.8,
            clearcoatRoughness: 0.14,
          })
        );
        const lining = d.xray(
          new THREE.MeshStandardMaterial({
            color: 1382429,
            roughness: 0.75,
            metalness: 0.1,
            side: THREE.BackSide,
          })
        );
        const fus = d.part(new THREE.Group(), null, {
          parent: rig,
          from: [0, 1.05, 0],
          spin: [0, 0.6, 0],
          delay: 0.2,
        });
        const fusMesh = new THREE.Mesh(fusGeo, pearlX);
        fus.add(fusMesh, new THREE.Mesh(fusGeo, lining));
        d.edgeMeshes.push(fusMesh);
        const canopyMat = d.xray(
          new THREE.MeshPhysicalMaterial({
            color: 660761,
            metalness: 0.15,
            roughness: 0.16,
            transparent: true,
            opacity: 0.8,
            clearcoat: 0.3,
            clearcoatRoughness: 0.12,
            envMapIntensity: 0.45,
          })
        );
        canopyMat.userData.noAO = true;
        d.part(new THREE.Mesh(canGeo, canopyMat), null, {
          parent: fus,
          static: true,
          cast: false,
        });
        const det = [];
        const line = [];
        for (let i = 0; i <= 26; i++) {
          const z = 0.62 - (1.24 * i) / 26;
          let k = 0;
          while (k < SEC.length - 1 && SEC[k + 1][0] > z) k++;
          const A = SEC[k],
            B = SEC[Math.min(SEC.length - 1, k + 1)],
            u = (A[0] - z) / Math.max(1e-6, A[0] - B[0]);
          const S2 = A.map((v, j) => v + (B[j] - v) * u);
          line.push(secPt(S2, -0.12, 1.004));
        }
        for (const sx of [1, -1])
          det.push(
            paint(
              GEO.tube(
                line.map(([x, y, z]) => [x * sx, y, z]),
                32e-4,
                60,
                4
              ),
              "teal"
            )
          );
        const rim2 = [];
        for (let i = 0; i < canRows.length; i++) rim2.push(canRows[i][0]);
        for (let i = canRows.length - 1; i >= 0; i--)
          rim2.push(canRows[i][NU - 1]);
        rim2.push(rim2[0]);
        det.push(
          paint(
            GEO.tube(
              rim2.map(([x, y, z]) => [x * 1.004, y + (y - 0.3) * 4e-3, z]),
              42e-4,
              160,
              5
            ),
            "gunD"
          )
        );
        const onSurf = (z, th, k = 1) => {
          let i = 0;
          while (i < SEC.length - 1 && SEC[i + 1][0] > z) i++;
          const A = SEC[i],
            B = SEC[Math.min(SEC.length - 1, i + 1)],
            u = (A[0] - z) / Math.max(1e-6, A[0] - B[0]);
          return secPt(
            A.map((v, j) => v + (B[j] - v) * u),
            th,
            k
          );
        };
        for (const [z, th, r] of [
          [0.69, -PI / 2 + 0.25, 0.012],
          [0.69, -PI / 2 - 0.25, 0.012],
          [-0.66, PI / 2, 0.011],
          [0.52, 0.02, 0.01],
          [0.52, PI - 0.02, 0.01],
          [-0.2, -0.3, 0.01],
          [-0.2, PI + 0.3, 0.01],
        ]) {
          const p = onSurf(z, th, 1);
          const nrm = new THREE.Vector3(
            p[0],
            p[1] - onSurf(z, th, 0)[1],
            0
          ).normalize();
          det.push(
            paint(
              GEO.cyl(r, r, 8e-3, 14).applyMatrix4(
                new THREE.Matrix4().compose(
                  new THREE.Vector3(...p),
                  new THREE.Quaternion().setFromUnitVectors(Y, nrm),
                  new THREE.Vector3(1, 1, 1)
                )
              ),
              "lens"
            )
          );
        }
        {
          const p = onSurf(-0.3, -0.05, 1);
          det.push(
            F(GEO.rbox(4e-3, 0.03, 0.05, 2e-3, 1), "gunD", [
              p[0] + 1e-3,
              p[1],
              p[2],
            ])
          );
          det.push(
            F(new THREE.BoxGeometry(3e-3, 4e-3, 0.016), "teal", [
              p[0] + 3e-3,
              p[1] + 9e-3,
              p[2],
            ])
          );
          const q = onSurf(-0.62, PI / 2, 1);
          det.push(
            F(
              GEO.rbox(6e-3, 0.05, 0.03, 2e-3, 1),
              "gunD",
              [0, q[1] + 0.022, -0.62],
              [0.35, 0, 0]
            )
          );
          det.push(
            F(GEO.rbox(0.07, 6e-3, 0.05, 3e-3, 1), "gunD", [
              0,
              onSurf(-0.2, PI / 2)[1] + 2e-3,
              -0.2,
            ])
          );
          const r = onSurf(0.6, 0.35, 1);
          det.push(
            paint(
              strut(
                [r[0], r[1], r[2]],
                [r[0] + 0.02, r[1] + 4e-3, r[2] + 0.07],
                25e-4,
                6
              ),
              "alu"
            )
          );
        }
        d.part(GEO.merge(det), PAL, { parent: fus, static: true });
        const SL = 0.26;
        d.slot({
          pos: toBody(0, 0.236, 0.5),
          rot: [0, HEAD + PI / 2, 0],
          scale: SL,
        });
        const intr = [
          F(GEO.rbox(0.25, 0.01, 0.52, 4e-3, 1), "floor", [0, 0.206, 0.12]),
        ];
        for (const z of [0.29, 0.04])
          for (const sx of [-1, 1]) {
            intr.push(
              F(GEO.rbox(0.105, 0.03, 0.105, 0.012, 1), "seat", [
                sx * 0.072,
                0.236,
                z,
              ])
            );
            intr.push(
              F(
                GEO.rbox(0.105, 0.14, 0.026, 0.012, 1),
                "seat",
                [sx * 0.072, 0.32, z - 0.06],
                [-0.18, 0, 0]
              )
            );
            intr.push(
              F(
                GEO.rbox(0.07, 0.04, 0.022, 0.01, 1),
                "seat",
                [sx * 0.072, 0.41, z - 0.078],
                [-0.18, 0, 0]
              )
            );
            intr.push(
              F(
                new THREE.BoxGeometry(5e-3, 0.12, 4e-3),
                "teal",
                [sx * 0.072 + sx * 0.053, 0.32, z - 0.047],
                [-0.18, 0, 0]
              )
            );
          }
        intr.push(
          F(
            GEO.rbox(0.25, 0.05, 0.07, 0.015, 2),
            "gunD",
            [0, 0.3, 0.45],
            [0.5, 0, 0]
          )
        );
        for (const sx of [-1, 1])
          intr.push(
            F(new THREE.BoxGeometry(4e-3, 4e-3, 0.44), "teal", [
              sx * 0.12,
              0.214,
              0.12,
            ])
          );
        intr.push(
          F(GEO.rbox(0.18, 0.012, 0.27, 4e-3, 1), "gunD", [0, 0.222, 0.5])
        );
        for (const sx of [-1, 1])
          intr.push(
            F(GEO.rbox(0.012, 0.03, 0.26, 4e-3, 1), "gun", [
              sx * 0.09,
              0.236,
              0.5,
            ])
          );
        intr.push(
          paint(
            GEO.tube(
              [
                [0.04, 0.24, 0.37],
                [0.05, 0.25, 0.33],
                [0.07, 0.215, 0.27],
              ],
              4e-3,
              12,
              5
            ),
            "copper"
          )
        );
        d.part(GEO.merge(intr), PALX, {
          parent: rig,
          from: [0, 0.7, 0],
          delay: 0.06,
        });
        const yt = t =>
          5 *
          0.14 *
          (0.2969 * Math.sqrt(t) -
            0.126 * t -
            0.3516 * t * t +
            0.2843 * t * t * t -
            0.1036 * t * t * t * t);
        const FOIL = [];
        for (let i = 0; i <= 10; i++) {
          const t = (1 + Math.cos((PI * i) / 10)) / 2;
          FOIL.push([t, yt(t) + 0.01 * Math.sin(PI * t)]);
        }
        for (let i = 9; i >= 1; i--) {
          const t = (1 + Math.cos((PI * i) / 10)) / 2;
          FOIL.push([t, -0.78 * yt(t) + 0.01 * Math.sin(PI * t)]);
        }
        FOIL.push(FOIL[0].slice());
        const wingRows = (sta, zLE, y0) =>
          sta.map(([x, c, k]) =>
            FOIL.map(([t, yy]) => [x, y0 + yy * c * k, zLE - t * c])
          );
        const tipped = (x0, x1, c0, c1, n) => {
          const out = [];
          for (let i = 0; i <= n; i++) {
            const x = x0 + ((x1 - x0) * i) / n;
            out.push([x, c0 + ((c1 - c0) * i) / n, 1]);
          }
          const s = Math.sign(x1 - x0) || 1;
          out.push(
            [x1 + s * 8e-3, c1 * 0.97, 0.75],
            [x1 + s * 0.014, c1 * 0.9, 0.4],
            [x1 + s * 0.017, c1 * 0.8, 0.05]
          );
          return out;
        };
        const solar = canvasTex(256, 256, (g, w, h) => {
          g.fillStyle = "#2b3038";
          g.fillRect(0, 0, w, h);
          const u0 = 0.07 * w,
            u1 = 0.43 * w,
            nc = 4,
            nv = 4,
            gap = 3;
          for (let i = 0; i < nc; i++)
            for (let k = 0; k < nv; k++) {
              const x = u0 + ((u1 - u0) * i) / nc + gap / 2,
                y = (h * k) / nv + gap / 2,
                cw = (u1 - u0) / nc - gap,
                ch = h / nv - gap;
              const gr = g.createLinearGradient(x, y, x + cw, y + ch);
              gr.addColorStop(0, "#101b33");
              gr.addColorStop(1, "#0b1326");
              g.fillStyle = gr;
              g.fillRect(x, y, cw, ch);
              g.strokeStyle = "rgba(120, 140, 175, 0.35)";
              g.lineWidth = 1;
              for (let b = 1; b < 3; b++) {
                g.beginPath();
                g.moveTo(x + (cw * b) / 3, y);
                g.lineTo(x + (cw * b) / 3, y + ch);
                g.stroke();
              }
            }
        });
        solar.wrapT = THREE.RepeatWrapping;
        const wingMat = new THREE.MeshPhysicalMaterial({
          map: solar,
          roughness: 0.4,
          metalness: 0.2,
          clearcoat: 0.45,
          clearcoatRoughness: 0.18,
          envMapIntensity: 0.55,
        });
        const wingGeo = (rows, y0, zMid) => {
          const g = gridGeo(rows, (x, y, z) => [0, y - y0, z - zMid]);
          const uv = g.attributes.uv,
            p = g.attributes.position;
          for (let i = 0; i < uv.count; i++) uv.setY(i, p.getX(i) * 2);
          return g;
        };
        const FZ = 0.46,
          FY = 0.215,
          FC = 0.16;
        d.part(
          wingGeo(
            wingRows(tipped(0.13, 0.84, FC, 0.12, 8), FZ, FY),
            FY,
            FZ - FC * 0.45
          ),
          wingMat,
          { parent: rig, from: [0.9, 0.05, 0], delay: 0.36, edge: true }
        );
        d.part(
          wingGeo(
            wingRows(tipped(-0.13, -0.84, FC, 0.12, 8), FZ, FY),
            FY,
            FZ - FC * 0.45
          ),
          wingMat,
          { parent: rig, from: [-0.9, 0.05, 0], delay: 0.38, edge: true }
        );
        const RZ = -0.3,
          RY = 0.468,
          RC = 0.24;
        const rs = [];
        for (let i = 0; i <= 14; i++) {
          const x = -1.12 + (2.24 * i) / 14;
          rs.push([x, RC - 0.09 * Math.abs(x / 1.12), 1]);
        }
        const rsT = [
          [-1.137, 0.142, 0.05],
          [-1.134, 0.146, 0.4],
          [-1.128, 0.148, 0.75],
          ...rs,
          [1.128, 0.148, 0.75],
          [1.134, 0.146, 0.4],
          [1.137, 0.142, 0.05],
        ];
        d.part(wingGeo(wingRows(rsT, RZ, RY), RY, RZ - RC * 0.45), wingMat, {
          parent: rig,
          from: [0, 0.95, 0],
          delay: 0.42,
          edge: true,
        });
        const NFX = [0.38, 0.74],
          NRX = [0.6, 1.05];
        const pods = [];
        const pod = (x, y, z, len) =>
          pods.push(
            F(
              lat(
                [
                  [1e-3, 0],
                  [0.026, 0],
                  [0.031, 0.03],
                  [0.03, len * 0.6],
                  [0.022, len * 0.92],
                  [1e-3, len],
                ],
                20
              ),
              "pearl",
              [x, y, z],
              [-PI / 2, 0, 0]
            )
          );
        for (const x of NFX)
          for (const s of [1, -1]) pod(s * x, FY, FZ - 8e-3, 0.17);
        for (const x of NRX)
          for (const s of [1, -1]) pod(s * x, RY, RZ - 8e-3, 0.24);
        for (const s of [1, -1]) {
          pods.push(
            paint(
              GEO.extrude(
                [
                  [RZ, 0],
                  [RZ - 0.15, 0],
                  [RZ - 0.2, 0.13],
                  [RZ - 0.12, 0.13],
                ],
                6e-3,
                3e-3
              )
                .rotateY(-PI / 2)
                .translate(s * 1.133 + 3e-3, RY - 4e-3, 0),
              "pearl"
            )
          );
          pods.push(
            F(GEO.sphere(9e-3, 10, 6), s > 0 ? "red" : "green", [
              s * 1.14,
              RY + 4e-3,
              RZ - 0.03,
            ])
          );
          pods.push(
            F(GEO.sphere(75e-4, 10, 6), s > 0 ? "red" : "green", [
              s * 0.856,
              FY + 2e-3,
              FZ - 0.03,
            ])
          );
        }
        d.part(GEO.merge(pods), PAL, {
          parent: rig,
          from: [0, 1.05, 0],
          delay: 0.5,
        });
        const strobeMat = MAT.led(15922943, 2.2);
        d.part(
          GEO.merge([
            GEO.at(GEO.sphere(75e-4, 10, 6), [1.141, RY + 0.012, RZ - 0.2]),
            GEO.at(GEO.sphere(75e-4, 10, 6), [-1.141, RY + 0.012, RZ - 0.2]),
            GEO.at(GEO.sphere(8e-3, 10, 6), [0, 0.398, -0.738]),
          ]),
          strobeMat,
          { parent: rig, from: [0, 1.05, 0], delay: 0.5, cast: false }
        );
        const pearl = new THREE.MeshPhysicalMaterial({
          color: 13028306,
          metalness: 0.1,
          roughness: 0.36,
          clearcoat: 0.8,
          clearcoatRoughness: 0.14,
        });
        const nacGeo = lat(
          [
            [1e-3, -0.014],
            [0.027, -0.014],
            [0.032, 0.012],
            [0.034, 0.07],
            [0.031, 0.12],
            [0.024, 0.15],
            [1e-3, 0.154],
          ],
          22
        );
        const bladeGeo = (() => {
          const pts = [
            [0.018, -0.012],
            [0.05, -0.014],
            [0.1, -0.012],
            [0.145, -7e-3],
            [0.15, 0],
            [0.145, 5e-3],
            [0.1, 9e-3],
            [0.05, 0.011],
            [0.018, 0.01],
          ];
          const g = new THREE.ExtrudeGeometry(
            new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y))),
            { depth: 3e-3, bevelEnabled: false }
          );
          g.translate(0, 0, -15e-4);
          g.rotateX(PI / 2);
          return g;
        })();
        const propList = [
          paint(
            lat(
              [
                [1e-3, -6e-3],
                [0.02, -6e-3],
                [0.019, 0.012],
                [0.012, 0.026],
                [1e-3, 0.032],
              ],
              18
            ),
            "gunD"
          ),
        ];
        for (let k = 0; k < 5; k++)
          propList.push(
            paint(
              bladeGeo
                .clone()
                .rotateX(0.32)
                .rotateY((k / 5) * TW),
              "prop"
            )
          );
        const propGeo = GEO.merge(propList);
        const blurTex = canvasTex(256, 256, (g, w) => {
          const r = w / 2,
            grd = g.createRadialGradient(r, r, 0, r, r, r);
          grd.addColorStop(0, "rgba(0,0,0,0)");
          grd.addColorStop(0.2, "rgba(150,190,200,0.04)");
          grd.addColorStop(0.8, "rgba(190,225,230,0.36)");
          grd.addColorStop(0.92, "rgba(210,240,240,0.5)");
          grd.addColorStop(1, "rgba(0,0,0,0)");
          g.fillStyle = "#000";
          g.fillRect(0, 0, w, w);
          g.fillStyle = grd;
          g.beginPath();
          g.arc(r, r, r, 0, TW);
          g.fill();
        });
        const blurMat = new THREE.MeshBasicMaterial({
          map: blurTex,
          color: 16777215,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        });
        const blurGeo = new THREE.RingGeometry(0.02, 0.152, 40).rotateX(
          -PI / 2
        );
        const PROP_Y = 0.162;
        const rotorBank = (xs, y, z, delay) => {
          const g = new THREE.Group();
          const all = [];
          for (const x of xs) for (const s of [1, -1]) all.push(s * x);
          g.add(
            new THREE.Mesh(
              GEO.merge(all.map(x => GEO.at(nacGeo, [x, 0, 0]))),
              pearl
            )
          );
          g.add(
            new THREE.Mesh(
              GEO.merge(
                all.map(x =>
                  paint(
                    GEO.torus(0.0342, 22e-4, 4, 24)
                      .rotateX(PI / 2)
                      .translate(x, 0.07, 0),
                    "teal"
                  )
                )
              ),
              PAL
            )
          );
          const props = new THREE.InstancedMesh(propGeo, PAL, all.length);
          props.frustumCulled = false;
          g.add(props);
          const blur = new THREE.Mesh(
            GEO.merge(all.map(x => GEO.at(blurGeo, [x, PROP_Y + 4e-3, 0]))),
            blurMat
          );
          blur.visible = false;
          g.add(blur);
          d.part(g, null, {
            parent: rig,
            pos: [0, y, z],
            from: [0, 1.15, 0],
            delay,
          });
          return { g, props, blur, xs: all, ang: all.map((x, i) => i * 0.7) };
        };
        const banks = [
          rotorBank(NFX, FY, FZ, 0.62),
          rotorBank(NRX, RY, RZ, 0.68),
        ];
        const setProps = b => {
          for (let i = 0; i < b.xs.length; i++) {
            dummy.position.set(b.xs[i], PROP_Y, 0);
            dummy.rotation.set(0, b.ang[i], 0);
            dummy.scale.setScalar(1);
            dummy.updateMatrix();
            b.props.setMatrixAt(i, dummy.matrix);
          }
          b.props.instanceMatrix.needsUpdate = true;
        };
        banks.forEach(setProps);
        const gear = [];
        const wheel = (x, y, z) => {
          gear.push(
            F(
              GEO.cyl(0.032, 0.032, 0.02, 20),
              "rubber",
              [x, y, z],
              [0, 0, PI / 2]
            )
          );
          gear.push(
            F(
              GEO.cyl(0.018, 0.018, 0.022, 14),
              "alu",
              [x, y, z],
              [0, 0, PI / 2]
            )
          );
        };
        gear.push(
          paint(strut([0, 0.2, 0.52], [0, 0.05, 0.535], 8e-3), "gun"),
          F(GEO.rbox(0.012, 0.03, 0.05, 4e-3, 1), "gun", [0, 0.045, 0.535])
        );
        wheel(0.016, 0.032, 0.535);
        wheel(-0.016, 0.032, 0.535);
        for (const s of [1, -1]) {
          gear.push(
            paint(
              strut([s * 0.1, 0.21, -0.1], [s * 0.2, 0.05, -0.12], 9e-3),
              "gun"
            )
          );
          gear.push(
            paint(
              strut([s * 0.1, 0.23, -0.2], [s * 0.2, 0.05, -0.125], 6e-3),
              "gun"
            )
          );
          gear.push(
            F(GEO.rbox(0.04, 0.02, 0.07, 8e-3, 1), "gun", [
              s * 0.2,
              0.05,
              -0.122,
            ])
          );
          wheel(s * 0.226, 0.032, -0.122);
        }
        d.part(GEO.merge(gear), PAL, {
          parent: rig,
          from: [0, 0.5, 0],
          delay: 0,
        });
        d.label(
          "Urban Drone · <em>4-seat eVTOL · scale model</em>",
          "#2DD4BF",
          toBody(0, 0.47, -0.15),
          [0.46, 0.8]
        );
        d.label(
          "8x tilt-rotors · <em>0-90 degree tilt</em>",
          "#5EEAD4",
          toBody(-NRX[0], RY + 0.03, RZ),
          [0.46, 0.8]
        );
        d.label(
          "Canopy · <em>electrochromic smart glass</em>",
          "#2DD4BF",
          toBody(0.14, 0.42, 0.36),
          [0.46, 0.8]
        );
        d.label(
          "Flight controller · <em>triple-redundant EoS RTOS</em>",
          "#2DD4BF",
          toBody(0.07, 0.24, 0.6),
          [0.55, 0.78]
        );
        let spin = 0,
          lastT = -1;
        const strobeBase = new THREE.Color(15922943);
        d.anim((p, time, dt, env) => {
          const on = env.hero * (1 - env.fin);
          spin = lerp(spin, on, 1 - Math.exp(-dt * 2.5));
          const tilt =
            env.fin > 0.5
              ? 0
              : (PI / 2) * sr(p, 0.5, 0.68) * (1 - sr(p, 0.84, 0.96));
          if (Math.abs(tilt - lastT) > 1e-5) {
            lastT = tilt;
            banks[0].g.rotation.x = tilt;
            banks[1].g.rotation.x = tilt;
          }
          if (spin > 2e-3) {
            const step = (spin * 34 + 0.1) * dt;
            for (let k = 0; k < 2; k++) {
              const b = banks[k];
              for (let i = 0; i < b.ang.length; i++)
                b.ang[i] += step * (i % 2 ? -1 : 1);
              setProps(b);
              b.blur.visible = spin > 0.05;
            }
            blurMat.opacity = spin * 0.55;
          } else if (banks[0].blur.visible) {
            banks[0].blur.visible = banks[1].blur.visible = false;
          }
          const blink = Math.pow(Math.max(0, Math.sin(time * 5.2)), 24);
          strobeMat.color.copy(strobeBase).multiplyScalar(1.2 + 3 * blink);
        });
        d.frame({
          dist: 4.6,
          height: 2.5,
          targetY: 0.32,
          fov: 32,
          yaw0: -0.72,
          yaw1: -0.16,
        });
        d.footprint(1.2);
        return d;
      };
      DEVICES.eradar360 = () => {
        const d = device("eradar360");
        const ACC = 16347926;
        const UY = 0.98;
        d.slot({ pos: [0, UY - 0.01, 0], rot: [0, 0, 0], scale: 0.7 });
        const steel = MAT.steel(0.35);
        d.part(
          GEO.merge([
            GEO.at(GEO.cyl(0.36, 0.4, 0.04, 48), [0, 0.02, 0]),
            GEO.at(GEO.cyl(0.035, 0.045, UY - 0.2, 24), [
              0,
              (UY - 0.2) / 2 + 0.04,
              0,
            ]),
          ]),
          MAT.anod(1712170, 0.42),
          { from: [0, -0.4, 0], delay: 0 }
        );
        const shell = d.xray(MAT.gloss(1185310));
        d.part(GEO.rbox(1.42, 0.36, 0.76, 0.16, 4), shell, {
          pos: [0, UY, 0],
          from: [0, 0.7, 0],
          spin: [0, 0.5, 0],
          delay: 0.42,
          edge: true,
        });
        const trim = d.xray(MAT.emissive(ACC, 1.5, 1707011));
        d.part(GEO.rbox(1.44, 0.022, 0.78, 0.011), trim, {
          pos: [0, UY - 0.07, 0],
          from: [0, 0.7, 0],
          delay: 0.44,
        });
        const glass = new THREE.MeshPhysicalMaterial({
          color: 8362168,
          metalness: 0,
          roughness: 0.14,
          transparent: true,
          opacity: 0.14,
          clearcoat: 0.3,
          clearcoatRoughness: 0.2,
          envMapIntensity: 0.45,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        const GT = Math.PI / 2 - 0.6;
        d.part(GEO.rbox(1.9, 0.014, 1, 6e-3), glass, {
          pos: [0, UY + 0.62, -0.72],
          rot: [GT, 0, 0],
          from: [0, 1, -0.6],
          delay: 0.06,
          cast: false,
        });
        d.part(
          GEO.merge([
            GEO.at(GEO.rbox(1.92, 0.03, 0.04, 0.012), [0, 0.5, 0]),
            GEO.at(GEO.rbox(1.92, 0.03, 0.04, 0.012), [0, -0.5, 0]),
          ]).rotateX(Math.PI / 2),
          MAT.rubber(855827),
          {
            pos: [0, UY + 0.62, -0.72],
            rot: [GT - Math.PI / 2, 0, 0],
            from: [0, 1, -0.6],
            delay: 0.06,
          }
        );
        const rig = MAT.anod(1712170, 0.45);
        d.part(
          GEO.merge([
            GEO.at(GEO.cyl(0.022, 0.026, 1.66, 16), [-0.98, 0.83, -0.74]),
            GEO.at(GEO.cyl(0.022, 0.026, 1.66, 16), [0.98, 0.83, -0.74]),
            GEO.at(GEO.cyl(0.12, 0.13, 0.03, 32), [-0.98, 0.015, -0.74]),
            GEO.at(GEO.cyl(0.12, 0.13, 0.03, 32), [0.98, 0.015, -0.74]),
            GEO.at(GEO.rbox(0.07, 0.12, 0.09, 0.02), [-0.97, UY + 0.62, -0.72]),
            GEO.at(GEO.rbox(0.07, 0.12, 0.09, 0.02), [0.97, UY + 0.62, -0.72]),
          ]),
          rig,
          { from: [0, -0.5, -0.4], delay: 0 }
        );
        d.part(GEO.rbox(0.4, 0.16, 0.18, 0.04), MAT.blackMetal(0.55), {
          pos: [0, UY + 0.25, -0.44],
          rot: [-0.6, 0, 0],
          from: [0, 0.8, -0.3],
          delay: 0.5,
        });
        const radomeTex = canvasTex(256, 128, (g, w, h) => {
          g.fillStyle = "#0b0d12";
          g.fillRect(0, 0, w, h);
          g.strokeStyle = "rgba(255,255,255,0.07)";
          for (let x = 0; x < w; x += 6) {
            g.beginPath();
            g.moveTo(x + 0.5, 0);
            g.lineTo(x + 0.5, h);
            g.stroke();
          }
        });
        const radome = new THREE.MeshPhysicalMaterial({
          map: radomeTex,
          roughness: 0.62,
          metalness: 0.1,
          clearcoat: 0.4,
        });
        d.part(GEO.rbox(0.92, 0.24, 0.05, 0.03), radome, {
          pos: [0, UY + 5e-3, 0.38],
          from: [0, 0, 1],
          delay: 0.6,
        });
        d.part(GEO.rbox(0.92, 0.24, 0.05, 0.03), radome, {
          pos: [0, UY + 5e-3, -0.38],
          from: [0, 0, -1],
          delay: 0.62,
        });
        const domes = [];
        const lensMat = MAT.glass(3807752, 0.75);
        const glow = MAT.led(ACC, 2.4);
        const glowG = [];
        for (let k = 0; k < 5; k++) {
          const a = (k / 5) * Math.PI * 2 + Math.PI / 2;
          const x = Math.cos(a) * 0.6,
            z = Math.sin(a) * 0.3;
          domes.push(
            GEO.at(
              new THREE.SphereGeometry(
                0.065,
                20,
                10,
                0,
                Math.PI * 2,
                0,
                Math.PI / 2
              ),
              [x, UY + 0.175, z]
            )
          );
          glowG.push(
            GEO.at(GEO.cyl(0.03, 0.03, 0.012, 16), [x, UY + 0.177, z])
          );
        }
        d.part(GEO.merge(domes), lensMat, {
          from: [0, 0.6, 0],
          delay: 0.74,
          cast: false,
        });
        d.part(GEO.merge(glowG), glow, {
          from: [0, 0.6, 0],
          delay: 0.74,
          cast: false,
        });
        const fin = GEO.extrude(
          [
            [-0.16, 0],
            [0.18, 0],
            [0.12, 0.06],
            [-0.02, 0.17],
            [-0.12, 0.12],
          ],
          0.05,
          0.012
        );
        fin.translate(0, 0, -0.025);
        d.part(fin, shell, {
          pos: [0.34, UY + 0.17, -0.18],
          rot: [0, Math.PI / 2, 0],
          scale: 1.2,
          from: [0, 0.7, 0],
          delay: 0.8,
        });
        const fanMat = new THREE.ShaderMaterial({
          uniforms: {
            uTime: { value: 0 },
            uOpacity: { value: 0 },
            uColor: { value: HDR(ACC, 1) },
          },
          vertexShader: `varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
          fragmentShader: `uniform float uTime; uniform float uOpacity; uniform vec3 uColor; varying vec2 vP;
          void main(){ float r = length(vP); float a = atan(vP.y, vP.x); float sweep = mod(a * 1.6 - uTime * 2.4, 6.2832); float s = exp(-sweep * 3.0);
            float rings = 0.35 + 0.65 * pow(0.5 + 0.5 * cos(r * 34.0 - uTime * 6.0), 6.0); float fade = (1.0 - smoothstep(0.2, 1.25, r)) * smoothstep(0.02, 0.12, r);
            float k = (0.14 * rings + 1.15 * s) * fade * uOpacity; gl_FragColor = vec4(uColor * k, k); }`,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        });
        const fanGeo = new THREE.CircleGeometry(
          1.5,
          48,
          -Math.PI / 3,
          (Math.PI * 2) / 3
        );
        const fanF = d.part(new THREE.Mesh(fanGeo, fanMat), null, {
          pos: [0, UY - 0.02, 0.4],
          rot: [-Math.PI / 2 + 0.12, 0, -Math.PI / 2],
          static: true,
          cast: false,
          receive: false,
        });
        const fanB = d.part(new THREE.Mesh(fanGeo, fanMat), null, {
          pos: [0, UY - 0.02, -0.4],
          rot: [-Math.PI / 2 - 0.12, 0, Math.PI / 2],
          static: true,
          cast: false,
          receive: false,
        });
        d.label(
          "Aegis One · <em>windshield unit</em>",
          "#F97316",
          [-0.55, UY + 1.05, -0.62],
          [0.46, 0.8]
        );
        d.label(
          "Front + rear radar · <em>77 GHz FMCW</em>",
          "#F97316",
          [0.38, UY - 0.06, 0.4],
          [0.5, 0.8]
        );
        d.label(
          "5 laser detectors · <em>72° apart</em>",
          "#FDBA74",
          [-0.6, UY + 0.2, 0],
          [0.54, 0.8]
        );
        d.label(
          "V2X · <em>vehicle-to-everything</em>",
          "#F97316",
          [0.34, UY + 0.36, -0.18],
          [0.58, 0.8]
        );
        d.anim((p, time, dt, env) => {
          const on = env.hero * (1 - env.fin);
          fanMat.uniforms.uTime.value = time;
          fanMat.uniforms.uOpacity.value = on;
          fanF.visible = fanB.visible = on > 0.01;
          glow.color
            .setRGB(1, 0.45, 0.07)
            .multiplyScalar(1.4 + 1.6 * on * (0.5 + 0.5 * Math.sin(time * 5)));
        });
        d.frame({
          dist: 4.5,
          height: 1.75,
          targetY: 1.12,
          fov: 32,
          yaw0: -0.55,
          yaw1: 0.35,
        });
        d.footprint(1.15);
        return d;
      };
      DEVICES.erobotics = () => {
        const d = device("erobotics");
        const PI = Math.PI,
          TW = PI * 2;
        const ACC = 10980346;
        const HEAD = -0.5,
          K = 1.1;
        const rig = new THREE.Group();
        rig.rotation.y = HEAD;
        rig.scale.setScalar(K);
        d.body.add(rig);
        const cH = Math.cos(HEAD),
          sH = Math.sin(HEAD);
        const toBody = (x, y, z) => [
          (x * cH + z * sH) * K,
          y * K,
          (-x * sH + z * cH) * K,
        ];
        const FINISH = [
          ["rubber", 1382171, 0.86, 0, 0, 0],
          ["white", 14080736, 0.4, 0, 0.45, 0],
          ["joint", 2501428, 0.42, 0.7, 0.25, 0],
          ["led", 1840432, 0.4, 0, 0, ACC],
          ["alu", 11121083, 0.42, 1, 0.1, 0],
          ["lens", 329483, 0.12, 0, 1, 0],
          ["red", 12654109, 0.34, 0, 0.7, 0],
          ["yellow", 14725156, 0.44, 0, 0.4, 0],
          ["plastic", 1777446, 0.55, 0, 0.1, 0],
          ["gun", 3817546, 0.42, 0.8, 0.25, 0],
          ["steel", 12896721, 0.34, 1, 0, 0],
          ["green", 862746, 0.4, 0, 0, 3462041],
          ["copper", 13208154, 0.38, 1, 0, 0],
          ["orange", 13132830, 0.5, 0, 0.2, 0],
        ];
        const NF = FINISH.length,
          U = {};
        const pcol = new Uint8Array(NF * 4),
          porm = new Uint8Array(NF * 4),
          pemi = new Uint8Array(NF * 4);
        FINISH.forEach(([n, c, r, m, cc, e], i) => {
          pcol.set([(c >> 16) & 255, (c >> 8) & 255, c & 255, 255], i * 4);
          porm.set(
            [
              Math.round(cc * 255),
              Math.round(r * 255),
              Math.round(m * 255),
              255,
            ],
            i * 4
          );
          pemi.set([(e >> 16) & 255, (e >> 8) & 255, e & 255, 255], i * 4);
          U[n] = (i + 0.5) / NF;
        });
        const dataTex = (data, cs) => {
          const t = new THREE.DataTexture(data, NF, 1);
          t.magFilter = t.minFilter = THREE.NearestFilter;
          t.generateMipmaps = false;
          t.colorSpace = cs;
          t.needsUpdate = true;
          return t;
        };
        const palMap = dataTex(pcol, THREE.SRGBColorSpace),
          palOrm = dataTex(porm, THREE.NoColorSpace),
          palEm = dataTex(pemi, THREE.SRGBColorSpace);
        const palette = k =>
          new THREE.MeshPhysicalMaterial({
            map: palMap,
            roughness: 1,
            roughnessMap: palOrm,
            metalness: 1,
            metalnessMap: palOrm,
            clearcoat: 1,
            clearcoatMap: palOrm,
            clearcoatRoughness: 0.3,
            emissive: 16777215,
            emissiveMap: palEm,
            emissiveIntensity: k,
          });
        const PAL = palette(2);
        const PALX = d.xray(palette(1.8));
        const paint = (geo, name) => {
          const u = U[name],
            a = geo.attributes.uv;
          for (let i = 0; i < a.count; i++) a.setXY(i, u, 0.5);
          return geo;
        };
        const F = (geo, name, pos, rot, scl) =>
          paint(GEO.at(geo, pos, rot, scl), name);
        const rr = (hx, hz, r, n = 6) => {
          const pts = [];
          const cs = [
            [hx - r, hz - r, 0],
            [-hx + r, hz - r, PI / 2],
            [-hx + r, -hz + r, PI],
            [hx - r, -hz + r, PI * 1.5],
          ];
          for (const [cx, cz, a02] of cs)
            for (let i = 0; i <= n; i++) {
              const a = a02 + (i / n) * (PI / 2);
              pts.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]);
            }
          return pts;
        };
        const rect2 = (o0, o1, y0, y1, r, n = 3) => {
          const pts = [];
          const cs = [
            [o1 - r, y0 + r, -PI / 2],
            [o1 - r, y1 - r, 0],
            [o0 + r, y1 - r, PI / 2],
            [o0 + r, y0 + r, PI],
          ];
          for (const [co, cy, a02] of cs)
            for (let i = 0; i <= n; i++) {
              const a = a02 + (i / n) * (PI / 2);
              pts.push([co + Math.cos(a) * r, cy + Math.sin(a) * r]);
            }
          return pts;
        };
        const sweep = (path, prof, closed, profClosed) => {
          const np = path.length,
            nq = prof.length,
            Nn = [];
          for (let i = 0; i < np; i++) {
            const a = path[closed ? (i - 1 + np) % np : Math.max(0, i - 1)],
              b = path[closed ? (i + 1) % np : Math.min(np - 1, i + 1)];
            const tx = b[0] - a[0],
              tz = b[1] - a[1],
              l = Math.hypot(tx, tz) || 1;
            Nn.push([tz / l, -tx / l]);
          }
          const pos = [],
            uv = [],
            idx = [];
          for (let i = 0; i < np; i++)
            for (let j = 0; j < nq; j++) {
              pos.push(
                path[i][0] + Nn[i][0] * prof[j][0],
                prof[j][1],
                path[i][1] + Nn[i][1] * prof[j][0]
              );
              uv.push(i / (np - 1), j / nq);
            }
          const segs = closed ? np : np - 1,
            qs = profClosed ? nq : nq - 1;
          for (let i = 0; i < segs; i++) {
            const i1 = (i + 1) % np;
            for (let j = 0; j < qs; j++) {
              const j1 = (j + 1) % nq,
                A = i * nq + j,
                B = i1 * nq + j,
                C2 = i1 * nq + j1,
                D = i * nq + j1;
              idx.push(A, C2, B, A, D, C2);
            }
          }
          if (!closed && profClosed) {
            for (const [i, end] of [
              [0, false],
              [np - 1, true],
            ]) {
              const base = pos.length / 3;
              for (let j = 0; j < nq; j++) {
                pos.push(
                  path[i][0] + Nn[i][0] * prof[j][0],
                  prof[j][1],
                  path[i][1] + Nn[i][1] * prof[j][0]
                );
                uv.push(0, 0);
              }
              for (let j = 1; j < nq - 1; j++)
                end
                  ? idx.push(base, base + j, base + j + 1)
                  : idx.push(base, base + j + 1, base + j);
            }
          }
          const g = new THREE.BufferGeometry();
          g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
          g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
          g.setIndex(idx);
          g.computeVertexNormals();
          return g;
        };
        const capGeo = (pts, y) => {
          const g = new THREE.ShapeGeometry(
            new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z)))
          );
          g.rotateX(-PI / 2);
          g.translate(0, y, 0);
          return g;
        };
        const plan = (pts, y0, h) => {
          const g = new THREE.ExtrudeGeometry(
            new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, -z))),
            { depth: h, bevelEnabled: false, curveSegments: 4 }
          );
          g.rotateX(-PI / 2);
          g.translate(0, y0, 0);
          return g;
        };
        const lat = (pts, n = 40) => GEO.lathe(pts, n);
        const toX = g => g.rotateZ(-PI / 2);
        const ringY = (r, t, y, n = 48) =>
          GEO.torus(r, t, 5, n)
            .rotateX(PI / 2)
            .translate(0, y, 0);
        const DY = 0.42,
          DP = 7e-3,
          TOP = DY + DP;
        const RW = 0.095,
          WX = 0.33,
          WZ = 0.39;
        const AX = 0,
          AZ = -0.3;
        const FXX = 0.2,
          FXZ = 0.32;
        const LX = -0.05,
          LZ = 0.45;
        const MX = 0.27,
          MZ = -0.44,
          MH = 0.96,
          HY = MH + 8e-3;
        const BOARD = [0, 0.27, 0.24],
          BS = 0.62;
        d.slot({
          pos: toBody(BOARD[0], BOARD[1], BOARD[2]),
          rot: [0, HEAD, 0],
          scale: BS * K,
        });
        const ch = [GEO.at(GEO.rbox(0.54, 0.16, 1, 0.03, 2), [0, 0.125, 0])];
        for (const sx of [-1, 1]) {
          ch.push(
            GEO.at(GEO.rbox(0.035, 0.15, 0.52, 0.012, 2), [
              sx * 0.375,
              0.125,
              0,
            ])
          );
          for (const sz of [-1, 1])
            ch.push(
              GEO.at(
                GEO.cyl(0.032, 0.032, 0.05, 16),
                [sx * 0.285, RW, sz * WZ],
                [0, 0, PI / 2]
              )
            );
        }
        d.part(GEO.merge(ch), MAT.anod(1448481, 0.5), {
          parent: rig,
          from: [0, 0.55, 0],
          delay: 0,
        });
        const inner = [];
        const bh = 0.025 * BS;
        for (const sx of [-1, 1])
          for (const sz of [-1, 1])
            inner.push(
              F(GEO.cyl(8e-3, 9e-3, BOARD[1] - bh - 0.205, 8), "alu", [
                BOARD[0] + sx * 0.25,
                (BOARD[1] - bh + 0.205) / 2,
                BOARD[2] + sz * 0.16,
              ])
            );
        inner.push(
          F(
            GEO.rbox(0.66, 0.15, 0.24, 0.014, 2),
            "plastic",
            [0.03, 0.285, -0.095]
          )
        );
        for (let k = 0; k < 5; k++)
          inner.push(
            F(GEO.rbox(0.6, 8e-3, 0.03, 3e-3, 1), "joint", [
              0.03,
              0.363,
              -0.19 + k * 0.047,
            ])
          );
        inner.push(
          F(GEO.rbox(0.012, 0.03, 0.12, 5e-3, 1), "alu", [0.366, 0.3, -0.095])
        );
        inner.push(
          F(GEO.cyl(0.06, 0.06, DY - 0.205, 24), "joint", [
            AX,
            (DY + 0.205) / 2,
            AZ,
          ])
        );
        inner.push(
          F(
            GEO.tube(
              [
                [0.2, 0.3, 0.027],
                [0.19, 0.335, 0.05],
                [0.17, 0.29, 0.09],
              ],
              7e-3,
              12,
              6
            ),
            "orange"
          )
        );
        inner.push(
          F(
            GEO.tube(
              [
                [0.26, 0.3, 0.027],
                [0.25, 0.335, 0.05],
                [0.23, 0.29, 0.09],
              ],
              7e-3,
              12,
              6
            ),
            "orange"
          )
        );
        d.part(GEO.merge(inner), PAL, {
          parent: rig,
          from: [0, 0.8, 0],
          delay: 0.06,
        });
        const tyreProf = [
          [0.064, -0.034],
          [0.071, -0.0375],
          [0.086, -0.0372],
          [0.092, -0.0335],
          [0.095, -0.024],
          [0.095, -6e-3],
          [0.0915, -35e-4],
          [0.0915, 35e-4],
          [0.095, 6e-3],
          [0.095, 0.024],
          [0.092, 0.0335],
          [0.086, 0.0372],
          [0.071, 0.0375],
          [0.064, 0.034],
        ];
        const wl = [paint(toX(lat(tyreProf, 44)), "rubber")];
        wl.push(
          paint(
            toX(
              lat(
                [
                  [0.064, 0.0345],
                  [0.06, 0.0362],
                  [0.05, 0.0362],
                  [0.046, 0.033],
                  [0.036, 0.033],
                  [0.033, 0.036],
                  [1e-3, 0.0365],
                ],
                40
              )
            ),
            "alu"
          )
        );
        wl.push(
          paint(
            toX(
              lat(
                [
                  [0.024, 0.0362],
                  [0.022, 0.041],
                  [0.012, 0.043],
                  [1e-3, 0.0432],
                ],
                24
              )
            ),
            "joint"
          )
        );
        wl.push(
          paint(
            toX(
              lat(
                [
                  [1e-3, -0.036],
                  [0.04, -0.036],
                  [0.064, -0.0345],
                ],
                32
              )
            ),
            "joint"
          )
        );
        for (let k = 0; k < 5; k++) {
          const a = (k / 5) * TW;
          wl.push(
            F(
              GEO.cyl(48e-4, 48e-4, 6e-3, 6),
              "steel",
              [0.037, Math.cos(a) * 0.028, Math.sin(a) * 0.028],
              [0, 0, PI / 2]
            )
          );
        }
        const wheelGeo = GEO.merge(wl);
        const wheels = [];
        [
          [1, 1],
          [-1, 1],
          [1, -1],
          [-1, -1],
        ].forEach(([sx, sz], k) => {
          const part2 = new THREE.Group(),
            roll = new THREE.Group();
          part2.add(roll);
          const m = new THREE.Mesh(wheelGeo, PAL);
          if (sx < 0) m.rotation.y = PI;
          roll.add(m);
          d.part(part2, null, {
            parent: rig,
            pos: [sx * WX, RW, sz * WZ],
            from: [sx * 0.75, 0.12, 0],
            spin: [0, 0, sx * 1.2],
            delay: 0.1 + k * 0.03,
          });
          wheels.push({ roll, x: sx * WX });
        });
        const bumpPath = [];
        const a0 = Math.asin(0.07 / 0.16);
        for (let i = 0; i <= 8; i++) {
          const a = a0 + (i / 8) * (PI / 2 - a0);
          bumpPath.push([0.24 + Math.cos(a) * 0.16, 0.42 + Math.sin(a) * 0.16]);
        }
        for (let i = 0; i <= 8; i++) {
          const a = PI / 2 + (i / 8) * (PI / 2 - a0);
          bumpPath.push([
            -0.24 + Math.cos(a) * 0.16,
            0.42 + Math.sin(a) * 0.16,
          ]);
        }
        const bProf = rect2(-0.045, 8e-3, 0.05, 0.172, 0.016, 3);
        const bumperMat = MAT.rubber(1184792);
        d.part(sweep(bumpPath, bProf, false, true), bumperMat, {
          parent: rig,
          from: [0, 0, 0.7],
          delay: 0.22,
        });
        d.part(
          sweep(
            bumpPath.map(([x, z]) => [-x, -z]),
            bProf,
            false,
            true
          ),
          bumperMat,
          { parent: rig, from: [0, 0, -0.7], delay: 0.24 }
        );
        const shellMat = d.xray(
          new THREE.MeshPhysicalMaterial({
            color: 2830393,
            metalness: 0.35,
            roughness: 0.42,
            clearcoat: 0.6,
            clearcoatRoughness: 0.25,
          })
        );
        const shellProf = [
          [-0.026, 0.2],
          [-0.012, 0.2025],
          [-4e-3, 0.208],
          [-5e-4, 0.218],
          [0, 0.232],
          [0, 0.26],
          [0, 0.31],
          [0, 0.36],
          [0, 0.37],
          [-8e-4, 0.386],
          [-5e-3, 0.4],
          [-0.013, 0.411],
          [-0.024, 0.4175],
          [-0.04, 0.42],
        ];
        const DZ = -0.095;
        const shellGeo = GEO.merge([
          sweep(rr(0.4, 0.58, 0.16, 10), shellProf, true, false),
          capGeo(rr(0.36, 0.54, 0.12, 10), DY),
          GEO.at(GEO.rbox(8e-3, 0.13, 0.26, 4e-3, 2), [0.4015, 0.31, DZ]),
        ]);
        const shell = d.part(shellGeo, shellMat, {
          parent: rig,
          from: [0, 1.05, 0],
          delay: 0.32,
          edge: true,
        });
        const det = [];
        const cam = (x, z, yaw) => {
          const sx = Math.sin(yaw),
            cz = Math.cos(yaw);
          det.push(
            F(
              GEO.rbox(0.054, 0.034, 0.01, 5e-3, 1),
              "lens",
              [x + sx * 1e-3, 0.31, z + cz * 1e-3],
              [0, yaw, 0]
            )
          );
          det.push(
            F(
              GEO.cyl(0.0105, 0.0105, 4e-3, 16).rotateX(PI / 2),
              "alu",
              [x + sx * 55e-4, 0.31, z + cz * 55e-4],
              [0, yaw, 0]
            )
          );
          det.push(
            F(
              GEO.cyl(78e-4, 78e-4, 4e-3, 16).rotateX(PI / 2),
              "lens",
              [x + sx * 75e-4, 0.31, z + cz * 75e-4],
              [0, yaw, 0]
            )
          );
          det.push(
            F(
              new THREE.BoxGeometry(4e-3, 4e-3, 3e-3),
              "led",
              [x + sx * 55e-4 + cz * 0.019, 0.322, z + cz * 55e-4 - sx * 0.019],
              [0, yaw, 0]
            )
          );
        };
        const cxr = 0.24 + 0.16 * Math.SQRT1_2,
          czr = 0.42 + 0.16 * Math.SQRT1_2;
        cam(cxr, czr, PI / 4);
        cam(-cxr, czr, -PI / 4);
        cam(cxr, -czr, (3 * PI) / 4);
        cam(-cxr, -czr, (-3 * PI) / 4);
        cam(0.4, -0.3, PI / 2);
        cam(-0.4, 0, -PI / 2);
        det.push(
          F(new THREE.BoxGeometry(4e-3, 4e-3, 0.272), "rubber", [
            0.4005,
            0.377,
            DZ,
          ]),
          F(new THREE.BoxGeometry(4e-3, 4e-3, 0.272), "rubber", [
            0.4005,
            0.243,
            DZ,
          ])
        );
        det.push(
          F(new THREE.BoxGeometry(4e-3, 0.138, 4e-3), "rubber", [
            0.4005,
            0.31,
            DZ + 0.134,
          ]),
          F(new THREE.BoxGeometry(4e-3, 0.138, 4e-3), "rubber", [
            0.4005,
            0.31,
            DZ - 0.134,
          ])
        );
        det.push(
          F(GEO.rbox(4e-3, 0.024, 0.09, 18e-4, 1), "rubber", [
            0.4062,
            0.338,
            DZ,
          ])
        );
        for (const dz of [-0.1, 0.1]) {
          det.push(
            F(
              GEO.cyl(85e-4, 85e-4, 3e-3, 14),
              "steel",
              [0.4068, 0.282, DZ + dz],
              [0, 0, PI / 2]
            )
          );
          det.push(
            F(
              new THREE.BoxGeometry(2e-3, 25e-4, 0.012),
              "rubber",
              [0.4084, 0.282, DZ + dz],
              [0.6, 0, 0]
            )
          );
        }
        for (let k = 0; k < 4; k++)
          det.push(
            F(new THREE.BoxGeometry(2e-3, 5e-3, 0.012), "green", [
              0.4068,
              0.282,
              DZ - 0.028 + k * 0.0165,
            ])
          );
        for (const x of [-0.09, 0.09])
          det.push(
            F(new THREE.BoxGeometry(0.05, 0.022, 4e-3), "copper", [
              x,
              0.112,
              -0.59,
            ])
          );
        det.push(
          paint(
            sweep(
              rr(0.336, 0.516, 0.106, 6),
              rect2(-6e-3, 0, DY - 2e-3, DY + DP + 3e-3, 2e-3, 1),
              true,
              true
            ),
            "alu"
          )
        );
        d.part(GEO.merge(det), PALX, { parent: shell, static: true });
        const stripMat = MAT.led(ACC, 1.6);
        d.part(
          sweep(
            rr(0.392, 0.572, 0.152, 10),
            rect2(-4e-3, 4e-3, 0.182, 0.191, 3e-3, 2),
            true,
            true
          ),
          stripMat,
          { parent: shell, static: true, cast: false }
        );
        const deckTex = canvasTex(256, 256, (g, w, h) => {
          const R = mulberry32(57028);
          g.fillStyle = "#1d2129";
          g.fillRect(0, 0, w, h);
          for (let i = 0; i < 2600; i++) {
            const v = 22 + R() * 18;
            g.fillStyle = `rgba(${v | 0},${(v + 3) | 0},${(v + 8) | 0},0.55)`;
            g.fillRect(R() * w, R() * h, 1.3, 1.3);
          }
          for (let i = 0; i < 8; i++)
            for (let k = 0; k < 8; k++) {
              const x = ((i + 0.5) * w) / 8,
                y = ((k + 0.5) * h) / 8;
              g.fillStyle = "#0a0c10";
              g.beginPath();
              g.arc(x, y, w * 0.011, 0, TW);
              g.fill();
              g.strokeStyle = "rgba(150, 160, 178, 0.28)";
              g.lineWidth = 1;
              g.beginPath();
              g.arc(x, y, w * 0.016, 0, TW);
              g.stroke();
            }
        });
        deckTex.wrapS = deckTex.wrapT = THREE.RepeatWrapping;
        deckTex.repeat.set(1 / 0.48, 1 / 0.48);
        const deckMat = d.xray(
          new THREE.MeshPhysicalMaterial({
            map: deckTex,
            roughness: 0.8,
            metalness: 0.1,
            sheen: 0.3,
            sheenRoughness: 0.8,
            sheenColor: new THREE.Color(3817552),
          })
        );
        d.part(plan(rr(0.33, 0.51, 0.1, 6), DY - 1e-3, DP + 1e-3), deckMat, {
          parent: rig,
          from: [0, 1.15, 0],
          delay: 0.4,
        });
        const es = [];
        for (const [x, z] of [
          [-0.28, 0.45],
          [-0.28, -0.45],
        ]) {
          es.push(
            F(GEO.rbox(0.072, 0.022, 0.072, 0.01, 1), "yellow", [
              x,
              TOP + 0.011,
              z,
            ])
          );
          es.push(
            F(GEO.cyl(0.013, 0.013, 0.012, 12), "joint", [x, TOP + 0.028, z])
          );
          es.push(
            F(
              lat(
                [
                  [1e-3, 0],
                  [0.026, 0],
                  [0.029, 6e-3],
                  [0.027, 0.014],
                  [0.016, 0.02],
                  [1e-3, 0.021],
                ],
                20
              ),
              "red",
              [x, TOP + 0.031, z]
            )
          );
        }
        d.part(GEO.merge(es), PAL, {
          parent: rig,
          from: [0, 1.3, 0],
          spin: [0, 1.5, 0],
          delay: 0.46,
        });
        const lidar = d.part(
          GEO.merge([
            F(GEO.rbox(0.1, 0.032, 0.1, 0.014, 2), "gun", [
              LX,
              TOP + 0.016,
              LZ,
            ]),
            F(
              lat(
                [
                  [1e-3, 0],
                  [0.045, 0],
                  [0.045, 6e-3],
                  [0.042, 8e-3],
                  [1e-3, 8e-3],
                ],
                36
              ),
              "alu",
              [LX, TOP + 0.032, LZ]
            ),
            F(GEO.cyl(0.0415, 0.0415, 0.046, 40, true), "lens", [
              LX,
              TOP + 0.063,
              LZ,
            ]),
            F(
              lat(
                [
                  [1e-3, 0],
                  [0.044, 0],
                  [0.046, 3e-3],
                  [0.046, 0.012],
                  [0.04, 0.02],
                  [0.024, 0.025],
                  [1e-3, 0.026],
                ],
                36
              ),
              "gun",
              [LX, TOP + 0.086, LZ]
            ),
            F(GEO.torus(0.0462, 16e-4, 4, 40).rotateX(PI / 2), "led", [
              LX,
              TOP + 0.0875,
              LZ,
            ]),
            F(new THREE.BoxGeometry(0.03, 0.012, 4e-3), "plastic", [
              LX,
              TOP + 0.016,
              LZ - 0.051,
            ]),
          ]),
          PAL,
          { parent: rig, from: [0, 1.25, 0.2], delay: 0.5 }
        );
        const glint = new THREE.Group();
        glint.add(
          new THREE.Mesh(
            GEO.torus(0.0423, 16e-4, 4, 14, 0.9).rotateX(PI / 2),
            MAT.led(14273791, 2)
          )
        );
        d.part(glint, null, {
          parent: lidar,
          static: true,
          pos: [LX, TOP + 0.063, LZ],
          cast: false,
        });
        const ped = [
          F(
            lat(
              [
                [1e-3, 0],
                [0.118, 0],
                [0.12, 4e-3],
                [0.12, 0.01],
                [0.116, 0.013],
                [1e-3, 0.013],
              ],
              48
            ),
            "joint",
            [AX, TOP, AZ]
          ),
          F(
            lat(
              [
                [1e-3, 0.013],
                [0.1, 0.013],
                [0.1, 0.052],
                [0.097, 0.056],
                [1e-3, 0.056],
              ],
              48
            ),
            "gun",
            [AX, TOP, AZ]
          ),
        ];
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * TW + 0.2;
          ped.push(
            F(GEO.cyl(75e-4, 75e-4, 6e-3, 6), "steel", [
              AX + Math.cos(a) * 0.109,
              TOP + 0.016,
              AZ + Math.sin(a) * 0.109,
            ])
          );
        }
        ped.push(
          F(GEO.rbox(0.17, 0.014, 0.17, 6e-3, 1), "plastic", [
            FXX,
            TOP + 7e-3,
            FXZ,
          ])
        );
        ped.push(
          F(GEO.torus(0.031, 4e-3, 6, 32).rotateX(PI / 2), "alu", [
            FXX,
            TOP + 0.016,
            FXZ,
          ])
        );
        for (const [sx, sz] of [
          [1, 1],
          [1, -1],
          [-1, 1],
          [-1, -1],
        ])
          ped.push(
            F(GEO.cyl(6e-3, 6e-3, 4e-3, 6), "steel", [
              FXX + sx * 0.07,
              TOP + 0.015,
              FXZ + sz * 0.07,
            ])
          );
        d.part(GEO.merge(ped), PAL, {
          parent: rig,
          from: [0, 1.3, 0],
          delay: 0.52,
        });
        const part = d.part(
          lat(
            [
              [1e-3, 0],
              [0.023, 0],
              [0.026, 3e-3],
              [0.026, 0.058],
              [0.0242, 0.061],
              [0.0242, 0.069],
              [0.026, 0.072],
              [0.026, 0.087],
              [0.023, 0.09],
              [0.012, 0.09],
              [0.011, 0.085],
              [1e-3, 0.085],
            ],
            32
          ),
          MAT.anod(9137392, 0.32),
          {
            parent: rig,
            pos: [FXX, TOP + 0.014, FXZ],
            from: [0, 1.45, 0],
            delay: 0.58,
          }
        );
        const partHome = part.position.clone();
        d.part(
          GEO.merge([
            F(
              lat(
                [
                  [1e-3, 0],
                  [0.042, 0],
                  [0.042, 9e-3],
                  [0.028, 0.016],
                  [1e-3, 0.016],
                ],
                32
              ),
              "joint",
              [MX, TOP, MZ]
            ),
            F(GEO.cyl(0.024, 0.026, MH - TOP - 0.016, 24), "gun", [
              MX,
              (MH + TOP + 0.016) / 2,
              MZ,
            ]),
            F(GEO.cyl(0.03, 0.03, 0.02, 24), "joint", [MX, MH - 0.01, MZ]),
          ]),
          PAL,
          { parent: rig, from: [0, 1.45, 0], delay: 0.54 }
        );
        const head = new THREE.Group(),
          pan = new THREE.Group(),
          tilt = new THREE.Group();
        head.add(pan);
        pan.add(
          new THREE.Mesh(
            GEO.merge([
              F(GEO.cyl(0.034, 0.034, 0.016, 24), "joint", [0, 8e-3, 0]),
              F(
                GEO.rbox(0.013, 0.08, 0.036, 5e-3, 1),
                "gun",
                [0.106, 0.052, 0]
              ),
              F(
                GEO.rbox(0.013, 0.08, 0.036, 5e-3, 1),
                "gun",
                [-0.106, 0.052, 0]
              ),
              F(GEO.rbox(0.225, 0.013, 0.036, 5e-3, 1), "gun", [0, 0.018, 0]),
            ]),
            PAL
          )
        );
        tilt.position.y = 0.07;
        pan.add(tilt);
        const bar = [
          F(GEO.rbox(0.196, 0.052, 0.058, 0.016, 2), "gun"),
          F(GEO.rbox(0.184, 0.038, 6e-3, 3e-3, 1), "lens", [0, 0, 0.028]),
          F(GEO.cyl(7e-3, 7e-3, 0.23, 8), "steel", [0, 0, 0], [0, 0, PI / 2]),
        ];
        for (const x of [-0.062, 0.062]) {
          bar.push(F(GEO.torus(0.0148, 25e-4, 5, 22), "alu", [x, 0, 0.0318]));
          bar.push(
            F(
              GEO.cyl(0.013, 0.013, 4e-3, 20),
              "lens",
              [x, 0, 0.031],
              [PI / 2, 0, 0]
            )
          );
        }
        bar.push(
          F(
            GEO.cyl(72e-4, 72e-4, 4e-3, 12),
            "lens",
            [-0.022, 0, 0.031],
            [PI / 2, 0, 0]
          )
        );
        bar.push(
          F(
            GEO.cyl(9e-3, 9e-3, 4e-3, 14),
            "joint",
            [0.014, 0, 0.031],
            [PI / 2, 0, 0]
          )
        );
        bar.push(
          F(
            new THREE.BoxGeometry(7e-3, 45e-4, 3e-3),
            "led",
            [0.036, 0.014, 0.0318]
          )
        );
        tilt.add(new THREE.Mesh(GEO.merge(bar), PAL));
        d.part(head, null, {
          parent: rig,
          pos: [MX, HY, MZ],
          from: [0, 1.45, 0],
          spin: [0, 1.4, 0],
          delay: 0.62,
        });
        const J1Y = TOP + 0.056;
        const A1 = 0.25,
          A2 = 0.4,
          A3 = 0.37,
          A67 = 0.089,
          AT = 0.158,
          A4 = A67 + AT;
        const tube = (r0, r1, y0, y1) =>
          paint(
            lat(
              [
                [1e-3, y0],
                [r0, y0],
                [r0, y0 + 0.01],
                [(r0 + r1) / 2, (y0 + y1) / 2],
                [r1, y1 - 0.014],
                [r1 - 3e-3, y1 - 4e-3],
                [r1 - 0.01, y1],
                [1e-3, y1],
              ],
              48
            ),
            "white"
          );
        const band = (r, y) => [
          paint(
            lat(
              [
                [1e-3, y],
                [r + 12e-4, y],
                [r + 25e-4, y + 25e-4],
                [r + 25e-4, y + 95e-4],
                [r + 12e-4, y + 0.012],
                [1e-3, y + 0.012],
              ],
              44
            ),
            "joint"
          ),
          paint(ringY(r + 25e-4, 17e-4, y + 6e-3, 44), "led"),
        ];
        const housing = (r, h, y, led) => {
          const rc2 = r * 0.5;
          const cap = lat(
            [
              [1e-3, h - 2e-3],
              [rc2, h - 2e-3],
              [rc2, h + 3e-3],
              [rc2 - 4e-3, h + 65e-4],
              [1e-3, h + 7e-3],
            ],
            32
          );
          const list = [
            paint(
              toX(
                lat(
                  [
                    [1e-3, -h],
                    [r - 0.016, -h],
                    [r - 5e-3, -h + 4e-3],
                    [r - 1e-3, -h + 0.012],
                    [r, -h + 0.02],
                    [r, h - 0.02],
                    [r - 1e-3, h - 0.012],
                    [r - 5e-3, h - 4e-3],
                    [r - 0.016, h],
                    [1e-3, h],
                  ],
                  44
                )
              ),
              "white"
            ),
            paint(toX(cap.clone()), "gun"),
            paint(toX(cap.clone()).rotateY(PI), "gun"),
          ];
          if (led)
            list.push(
              paint(
                GEO.torus(rc2 + 35e-4, 18e-4, 4, 36)
                  .rotateY(PI / 2)
                  .translate(h + 1e-3, 0, 0),
                "led"
              )
            );
          return list.map(g => g.translate(0, y, 0));
        };
        const joint = (parent, pos, list, from, delay, spin) => {
          const g = new THREE.Group(),
            r = new THREE.Group();
          g.add(r);
          r.add(new THREE.Mesh(GEO.merge(list), PAL));
          d.part(g, null, { parent, pos, from, delay, spin });
          return r;
        };
        const G1 = joint(
          rig,
          [AX, J1Y, AZ],
          [
            F(
              lat(
                [
                  [1e-3, 0],
                  [0.082, 0],
                  [0.084, 4e-3],
                  [0.084, 0.018],
                  [0.082, 0.022],
                  [1e-3, 0.022],
                ],
                48
              ),
              "joint"
            ),
            paint(ringY(0.084, 19e-4, 0.011), "led"),
            paint(
              lat(
                [
                  [1e-3, 0.022],
                  [0.075, 0.022],
                  [0.075, 0.15],
                  [0.072, 0.19],
                  [0.066, 0.23],
                  [0.05, 0.25],
                  [1e-3, A1],
                ],
                48
              ),
              "white"
            ),
            ...housing(0.074, 0.084, A1, true),
          ],
          [0, 1.4, 0],
          0.64,
          [0, 1.2, 0]
        );
        const G2 = joint(
          G1,
          [0, A1, 0],
          [tube(0.058, 0.055, 0, 0.192), ...band(0.055, 0.192)],
          [0, 0.45, 0],
          0.7
        );
        const G3 = joint(
          G2,
          [0, 0.204, 0],
          [tube(0.055, 0.051, 0, 0.196), ...housing(0.064, 0.07, 0.196, true)],
          [0, 0.4, 0],
          0.74
        );
        const G4 = joint(
          G3,
          [0, 0.196, 0],
          [tube(0.051, 0.048, 0, 0.182), ...band(0.048, 0.182)],
          [0, 0.35, 0],
          0.78
        );
        const G5 = joint(
          G4,
          [0, 0.194, 0],
          [
            tube(0.048, 0.045, 0, 0.176),
            ...housing(0.054, 0.058, 0.176, false),
          ],
          [0, 0.3, 0],
          0.82
        );
        const G6 = joint(
          G5,
          [0, 0.176, 0],
          [tube(0.045, 0.043, 0, 0.077), ...band(0.043, 0.077)],
          [0, 0.26, 0],
          0.86
        );
        const g7 = [
          F(
            lat(
              [
                [1e-3, 0],
                [0.04, 0],
                [0.042, 3e-3],
                [0.042, 9e-3],
                [0.04, 0.012],
                [1e-3, 0.012],
              ],
              36
            ),
            "steel"
          ),
          F(
            lat(
              [
                [1e-3, 0.012],
                [0.046, 0.012],
                [0.047, 0.014],
                [0.047, 0.02],
                [0.046, 0.022],
                [1e-3, 0.022],
              ],
              36
            ),
            "joint"
          ),
          F(
            lat(
              [
                [1e-3, 0.022],
                [0.051, 0.022],
                [0.054, 0.026],
                [0.055, 0.066],
                [0.053, 0.076],
                [0.047, 0.084],
                [1e-3, 0.086],
              ],
              40
            ),
            "gun"
          ),
          paint(ringY(0.0548, 18e-4, 0.045, 44), "led"),
        ];
        const FA = 0.4;
        for (let k = 0; k < 3; k++) {
          const al = (k / 3) * TW + FA;
          g7.push(
            F(
              new THREE.BoxGeometry(0.03, 0.012, 0.022),
              "joint",
              [Math.sin(al) * 0.04, 0.086, Math.cos(al) * 0.04],
              [0, al, 0]
            )
          );
        }
        g7.push(
          F(
            GEO.rbox(0.02, 0.028, 0.012, 4e-3, 1),
            "joint",
            [
              Math.sin(FA + PI / 3) * 0.058,
              0.05,
              Math.cos(FA + PI / 3) * 0.058,
            ],
            [0, FA + PI / 3, 0]
          )
        );
        const G7 = joint(G6, [0, A67, 0], g7, [0, 0.24, 0], 0.9);
        const proxGeo = GEO.merge([
          F(
            GEO.cyl(68e-4, 68e-4, 0.026, 10),
            "steel",
            [0, 0, 0],
            [0, 0, PI / 2]
          ),
          F(GEO.rbox(0.024, 0.066, 0.012, 4e-3, 1), "gun", [0, 0.03, 1e-3]),
          F(
            new THREE.BoxGeometry(0.02, 0.046, 4e-3),
            "rubber",
            [0, 0.034, -7e-3]
          ),
        ]);
        const distGeo = GEO.merge([
          F(GEO.cyl(6e-3, 6e-3, 0.024, 10), "steel", [0, 0, 0], [0, 0, PI / 2]),
          F(GEO.rbox(0.022, 0.052, 0.011, 45e-4, 1), "gun", [0, 0.022, 1e-3]),
          F(
            new THREE.BoxGeometry(0.018, 0.034, 4e-3),
            "rubber",
            [0, 0.024, -68e-4]
          ),
        ]);
        const fingers = [];
        for (let k = 0; k < 3; k++) {
          const al = (k / 3) * TW + FA;
          const mount = new THREE.Group(),
            prox = new THREE.Group(),
            dist = new THREE.Group();
          mount.add(prox);
          prox.add(new THREE.Mesh(proxGeo, PAL));
          dist.position.y = 0.06;
          prox.add(dist);
          dist.add(new THREE.Mesh(distGeo, PAL));
          d.part(mount, null, {
            parent: G7,
            pos: [Math.sin(al) * 0.038, 0.088, Math.cos(al) * 0.038],
            rot: [0, al, 0],
            from: [Math.sin(al) * 0.12, -0.12, Math.cos(al) * 0.12],
            delay: 0.95,
          });
          fingers.push({ prox, dist });
        }
        const partAnchor = new THREE.Object3D(),
          tcpAnchor = new THREE.Object3D(),
          gripTag = new THREE.Object3D();
        partAnchor.position.y = AT + 0.055;
        partAnchor.rotation.x = PI;
        tcpAnchor.position.y = AT;
        gripTag.position.y = 0;
        G7.add(partAnchor, tcpAnchor, gripTag);
        if (!PORTRAIT)
          d.label(
            "<em>Built from five eRobotics designs</em>",
            "#A78BFA",
            toBody(MX, HY + 0.2, MZ),
            [0.46, 0.8]
          );
        d.label(
          "eAMR-500 · <em>autonomous mobile robot</em>",
          "#A78BFA",
          toBody(0.36, 0.12, 0.47),
          [0.46, 0.8]
        );
        d.label(
          "eArm-7 · <em>7-DOF collaborative robot</em>",
          "#C4B5FD",
          toBody(AX - 0.04, J1Y + 0.13, AZ + 0.06),
          [0.46, 0.8]
        );
        d.label(
          "eGripper-3F · <em>3-finger adaptive gripper</em>",
          "#A78BFA",
          [0, 1, 0],
          [0.47, 0.8]
        );
        const gripLabel = d.labels[d.labels.length - 1];
        d.label(
          "eVision-4K · <em>4K stereo + depth</em>",
          "#C4B5FD",
          toBody(MX, HY + 0.07, MZ),
          [0.46, 0.8]
        );
        d.label(
          "eLiDAR-360 · <em>360° solid-state LiDAR</em>",
          "#A78BFA",
          toBody(LX, TOP + 0.06, LZ + 0.04),
          [0.47, 0.8]
        );
        d.label(
          "Core board · <em>EoS runs here</em>",
          "#A78BFA",
          toBody(0.1, 0.29, 0.36),
          [0.55, 0.78]
        );
        const ik = (rho, h, th6, out) => {
          const u6 = rho - A4 * Math.sin(th6),
            v6 = h - A4 * Math.cos(th6) - A1;
          const L = Math.min(Math.hypot(u6, v6), A2 + A3 - 1e-4);
          const q4 = Math.acos(
            Math.max(
              -1,
              Math.min(1, (L * L - A2 * A2 - A3 * A3) / (2 * A2 * A3))
            )
          );
          const q2 =
            Math.atan2(u6, v6) -
            Math.atan2(A3 * Math.sin(q4), A2 + A3 * Math.cos(q4));
          out[0] = q2;
          out[1] = q4;
          out[2] = th6 - q2 - q4;
          return out;
        };
        const hG = TOP + 0.014 + 0.055 - J1Y;
        const psi0 = Math.atan2(FXX - AX, FXZ - AZ),
          rho0 = Math.hypot(FXX - AX, FXZ - AZ),
          q7g = 0.3;
        const KEYS = {
          stow: [psi0, rho0 - 0.05, hG + 0.16, PI, q7g],
          grasp: [psi0, rho0, hG, PI, q7g],
          lift: [psi0, rho0 - 0.03, hG + 0.3, PI - 0.1, q7g],
          pres: [psi0 - 0.42, 0.56, hG + 0.44, PI - 0.5, q7g + 0.6],
          hold: [psi0 - 0.36, 0.56, hG + 0.43, PI - 0.56, q7g + 1.5],
        };
        const TRACK = [
          [0.44, 0.5, "stow", "grasp"],
          [0.54, 0.62, "grasp", "lift"],
          [0.62, 0.7, "lift", "pres"],
          [0.7, 0.82, "pres", "hold"],
          [0.82, 0.88, "hold", "lift"],
          [0.88, 0.93, "lift", "grasp"],
          [0.96, 1, "grasp", "stow"],
        ];
        const QA = [0, 0, 0, 0, 0],
          QJ = [0, 0, 0];
        const poseAt = p => {
          let ka = KEYS.stow,
            kb = KEYS.stow,
            u = 0;
          if (p >= 0.44 && p < 1) {
            for (let i = 0; i < TRACK.length; i++) {
              const t = TRACK[i];
              if (p < t[0]) break;
              ka = KEYS[t[2]];
              kb = KEYS[t[3]];
              u = p >= t[1] ? 1 : easeInOut((p - t[0]) / (t[1] - t[0]));
            }
          }
          for (let i = 0; i < 5; i++) QA[i] = ka[i] + (kb[i] - ka[i]) * u;
        };
        const closeAt = p =>
          p < 0.5
            ? 0
            : p < 0.54
              ? sr(p, 0.5, 0.54)
              : p < 0.93
                ? 1
                : p < 0.96
                  ? 1 - sr(p, 0.93, 0.96)
                  : 0;
        const vT = new THREE.Vector3(),
          mInv = new THREE.Matrix4(),
          mRel = new THREE.Matrix4(),
          sTmp = new THREE.Vector3();
        const stripBase = new THREE.Color(ACC);
        let lastP = -99,
          lastS = -99,
          lastH = -1,
          held = false,
          scan = 0;
        d.anim((p, time, dt, env) => {
          const P = env.fin > 0.5 || p < 0.44 || p >= 1 ? -1 : p;
          if (P !== lastP) {
            lastP = P;
            poseAt(P);
            ik(QA[1], QA[2], QA[3], QJ);
            G1.rotation.y = QA[0];
            G2.rotation.x = QJ[0];
            G4.rotation.x = QJ[1];
            G6.rotation.x = QJ[2];
            G7.rotation.y = QA[4];
            const c = P < 0 ? 0 : closeAt(P);
            for (let k = 0; k < 3; k++) {
              fingers[k].prox.rotation.x = lerp(0.42, 0.015, c);
              fingers[k].dist.rotation.x = lerp(-0.22, 0, c);
            }
            partAnchor.updateWorldMatrix(true, false);
            tcpAnchor.updateWorldMatrix(false, false);
            gripTag.updateWorldMatrix(false, false);
            mInv.copy(rig.matrixWorld).invert();
            if (P > 0.5 && P < 0.96 && c > 0.5) {
              mRel.multiplyMatrices(mInv, partAnchor.matrixWorld);
              mRel.decompose(part.position, part.quaternion, sTmp);
              held = true;
            } else if (held) {
              part.position.copy(partHome);
              part.quaternion.identity();
              held = false;
            }
            vT.setFromMatrixPosition(tcpAnchor.matrixWorld).applyMatrix4(mInv);
            const dx = vT.x - MX,
              dy = vT.y - (HY + 0.07),
              dz = vT.z - MZ;
            pan.rotation.y = Math.atan2(dx, dz);
            tilt.rotation.x = Math.atan2(-dy, Math.hypot(dx, dz));
            vT.setFromMatrixPosition(gripTag.matrixWorld).applyMatrix4(mInv);
            gripLabel.pos.set(
              (vT.x * cH + vT.z * sH) * K,
              vT.y * K,
              (-vT.x * sH + vT.z * cH) * K
            );
          }
          const s = d.spin.rotation.y;
          if (s !== lastS) {
            lastS = s;
            for (let k = 0; k < 4; k++)
              wheels[k].roll.rotation.x = (-wheels[k].x * s) / RW;
          }
          const h = env.hero * (1 - env.fin);
          if (h > 1e-3 || lastH > 1e-3) {
            lastH = h;
            PAL.emissiveIntensity =
              2 + 0.8 * h * (0.5 + 0.5 * Math.sin(time * 2.4));
            stripMat.color
              .copy(stripBase)
              .multiplyScalar(
                1.6 + 0.7 * h * (0.5 + 0.5 * Math.sin(time * 2.4 + 1.2))
              );
          }
          scan += dt * (2.2 + 3.5 * h);
          glint.rotation.y = scan;
        });
        d.frame({
          dist: 3.55,
          height: 2.1,
          targetY: 0.58,
          fov: 32,
          yaw0: -0.72,
          yaw1: -0.16,
        });
        d.footprint(0.85);
        return d;
      };
      DEVICES.esmartcity = () => {
        const d = device("esmartcity");
        const ACC = 6333946;
        const HALF = Math.PI / 2,
          TAU2 = Math.PI * 2;
        const POLE_X = 0.74,
          POLE_Z = -0.06,
          POLE_H = 1.68,
          ARM_Y = 1.53;
        const XR = 0.15,
          XF = -1.02,
          YC = 1.53;
        const hx = u => XR + (XF - XR) * u;
        const sstep = (a, b, v) => {
          const t = clamp01((v - a) / (b - a));
          return t * t * (3 - 2 * t);
        };
        const nose = u =>
          u <= 0.7
            ? 1
            : Math.sqrt(Math.max(0, 1 - Math.pow((u - 0.7) / 0.3, 2)));
        const Wf = u => (0.075 + 0.145 * sstep(0, 0.45, u)) * nose(u);
        const Htf = u => (0.065 + 0.075 * sstep(0, 0.5, u)) * nose(u);
        const Hbf = u => (0.065 + 0.02 * sstep(0, 0.4, u)) * nose(u);
        const UR = 0.6,
          PX = hx(UR);
        const REC_TOP = YC + Htf(UR) + 0.018,
          BASE_H = 0.06,
          BASE_TOP = REC_TOP + BASE_H;
        const B_Y = BASE_TOP + 0.07 + 0.081;
        d.slot({ pos: [PX, B_Y, 0], rot: [HALF, 0, 0], scale: 0.27 });
        const LENS_U0 = 0.3,
          LENS_U1 = 0.78,
          LENS_X = (hx(LENS_U0) + hx(LENS_U1)) / 2,
          LENS_L = hx(LENS_U0) - hx(LENS_U1);
        const LENS_Y = YC - 0.085;
        const BOX = (w, h, dd) => new THREE.BoxGeometry(w, h, dd);
        const v2 = pts => pts.map(([a, b]) => new THREE.Vector2(a, b));
        const rrect = (w, h, r, n = 5) => {
          const pts = [];
          const cs = [
            [w / 2 - r, h / 2 - r, 0],
            [-w / 2 + r, h / 2 - r, HALF],
            [-w / 2 + r, -h / 2 + r, Math.PI],
            [w / 2 - r, -h / 2 + r, Math.PI * 1.5],
          ];
          for (const [cx, cy, a0] of cs)
            for (let i = 0; i <= n; i++) {
              const a = a0 + (i / n) * HALF;
              pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
            }
          return pts;
        };
        const flat = (w, dd, r, h, bevel = 4e-3) =>
          new THREE.ExtrudeGeometry(
            new THREE.Shape(v2(rrect(w - 2 * bevel, dd - 2 * bevel, r))),
            {
              depth: Math.max(1e-3, h - 2 * bevel),
              bevelEnabled: true,
              bevelThickness: bevel,
              bevelSize: bevel,
              bevelSegments: 2,
              curveSegments: 4,
            }
          )
            .rotateX(-HALF)
            .translate(0, bevel, 0);
        const sect = (u, th, grow = 0) => {
          const c = Math.cos(th),
            s = Math.sin(th);
          const z =
            (Wf(u) + grow) * Math.sign(c) * Math.pow(Math.abs(c), 2 / 2.6);
          const y =
            s >= 0
              ? (Htf(u) + grow) * Math.pow(s, 2 / 2.3)
              : -(Hbf(u) + grow) * Math.pow(-s, 2 / 5);
          return [z, YC + y];
        };
        const poleMat = MAT.anod(1712169, 0.5);
        const headMat = new THREE.MeshPhysicalMaterial({
          color: 2830908,
          metalness: 0.35,
          roughness: 0.54,
          clearcoat: 0.12,
          clearcoatRoughness: 0.5,
        });
        const black = MAT.plastic(790291, 0.5);
        const steel = MAT.steel(0.42);
        const puckMat = MAT.plastic(1909547, 0.42);
        const domeMat = d.xray(
          new THREE.MeshPhysicalMaterial({
            color: 2765632,
            metalness: 0,
            roughness: 0.42,
            clearcoat: 0.25,
            clearcoatRoughness: 0.4,
            side: THREE.DoubleSide,
          })
        );
        const brass = MAT.gold();
        brass.color.set(13215068);
        const accent = MAT.led(ACC, 1.8);
        const ledMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(14412287).multiplyScalar(2.2),
        });
        const lensMat = new THREE.MeshPhysicalMaterial({
          color: 13162732,
          metalness: 0,
          roughness: 0.16,
          transparent: true,
          opacity: 0.22,
          clearcoat: 0.3,
          clearcoatRoughness: 0.2,
          envMapIntensity: 0.4,
          depthWrite: false,
        });
        lensMat.userData.noAO = true;
        {
          const g = new THREE.Group();
          const pole = [
            GEO.at(GEO.rbox(0.38, 0.035, 0.38, 0.012, 2), [
              POLE_X,
              0.0175,
              POLE_Z,
            ]),
            GEO.at(
              GEO.lathe(
                [
                  [0.105, 0],
                  [0.105, 0.05],
                  [0.085, 0.09],
                  [0.074, 0.12],
                  [0.072, 0.13],
                ],
                32
              ),
              [POLE_X, 0.03, POLE_Z]
            ),
            GEO.at(GEO.cyl(0.058, 0.07, POLE_H - 0.14, 32), [
              POLE_X,
              0.14 + (POLE_H - 0.14) / 2,
              POLE_Z,
            ]),
            GEO.at(
              GEO.lathe(
                [
                  [0.064, 0],
                  [0.066, 0.02],
                  [0.05, 0.045],
                  [5e-4, 0.055],
                ],
                24
              ),
              [POLE_X, POLE_H, POLE_Z]
            ),
            GEO.at(GEO.rbox(0.07, 0.17, 0.02, 0.01, 2), [
              POLE_X,
              0.5,
              POLE_Z + 0.064,
            ]),
            GEO.at(
              GEO.cyl(0.07, 0.07, 0.12, 24),
              [POLE_X, ARM_Y, POLE_Z],
              [0, 0, 0]
            ),
          ];
          const armPts = [
            [POLE_X - 0.05, ARM_Y, POLE_Z],
            [POLE_X - 0.3, ARM_Y + 4e-3, POLE_Z * 0.6],
            [POLE_X - 0.5, ARM_Y + 2e-3, POLE_Z * 0.15],
            [XR + 0.04, ARM_Y, 0],
          ];
          pole.push(GEO.tube(armPts, 0.034, 24, 14));
          const brace = [
            [POLE_X - 0.05, ARM_Y - 0.24, POLE_Z],
            [POLE_X - 0.16, ARM_Y - 0.2, POLE_Z * 0.9],
            [POLE_X - 0.28, ARM_Y - 0.1, POLE_Z * 0.7],
            [POLE_X - 0.38, ARM_Y - 0.02, POLE_Z * 0.5],
          ];
          pole.push(GEO.tube(brace, 0.016, 20, 8));
          pole.push(
            GEO.at(
              GEO.cyl(0.05, 0.05, 0.05, 20),
              [POLE_X - 0.04, ARM_Y - 0.24, POLE_Z],
              [0, 0, HALF]
            )
          );
          g.add(new THREE.Mesh(GEO.merge(pole), poleMat));
          const bolts = [];
          for (const [bx, bz] of [
            [-0.14, -0.14],
            [0.14, -0.14],
            [-0.14, 0.14],
            [0.14, 0.14],
          ]) {
            bolts.push(
              GEO.at(GEO.cyl(0.012, 0.012, 0.07, 8), [
                POLE_X + bx,
                0.07,
                POLE_Z + bz,
              ]),
              GEO.at(GEO.cyl(0.022, 0.022, 0.022, 6), [
                POLE_X + bx,
                0.046,
                POLE_Z + bz,
              ])
            );
          }
          for (const by of [0.44, 0.56])
            bolts.push(
              GEO.at(GEO.cyl(8e-3, 8e-3, 8e-3, 8).rotateX(HALF), [
                POLE_X,
                by,
                POLE_Z + 0.075,
              ])
            );
          for (const by of [ARM_Y + 0.045, ARM_Y - 0.045])
            bolts.push(
              GEO.at(GEO.cyl(0.012, 0.012, 0.03, 6).rotateX(HALF), [
                POLE_X,
                by,
                POLE_Z + 0.075,
              ])
            );
          g.add(new THREE.Mesh(GEO.merge(bolts), steel));
          d.part(g, null, { from: [0, 0, -0.9], delay: 0, edge: true });
        }
        {
          const NU = 30,
            NT = 36;
          const pos = [];
          for (let j = 0; j <= NU; j++) {
            const u = j / NU;
            for (let i = 0; i < NT; i++) {
              const [z, y] = sect(u, (i / NT) * TAU2);
              pos.push(hx(u), y, z);
            }
          }
          const idx = [];
          for (let j = 0; j < NU; j++)
            for (let i = 0; i < NT; i++) {
              const a = j * NT + i,
                b = (j + 1) * NT + i,
                c = j * NT + ((i + 1) % NT),
                e = (j + 1) * NT + ((i + 1) % NT);
              idx.push(a, c, b, c, e, b);
            }
          const shell = new THREE.BufferGeometry();
          shell.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(pos, 3)
          );
          shell.setIndex(idx);
          shell.computeVertexNormals();
          const parts = [shell];
          parts.push(
            GEO.at(
              GEO.cyl(0.082, 0.082, 0.12, 28),
              [XR + 0.05, YC, 0],
              [0, 0, HALF]
            )
          );
          parts.push(
            GEO.at(
              GEO.cyl(0.09, 0.09, 0.02, 28),
              [XR + 0.11, YC, 0],
              [0, 0, HALF]
            )
          );
          for (let f = 0; f < 6; f++) {
            const u = 0.12 + f * 0.055;
            const outer = [],
              inner = [];
            for (let k = 0; k <= 12; k++) {
              const th = 0.28 + (k / 12) * (Math.PI - 0.56);
              outer.push(sect(u, th, 0.03));
              inner.push(sect(u, th, -0.012));
            }
            const pts = outer.concat(inner.reverse()).map(([z, y]) => [z, y]);
            const rib = GEO.extrude(pts, 0.012, 0).rotateY(HALF);
            parts.push(GEO.at(rib, [hx(u) - 6e-3, 0, 0]));
          }
          parts.push(
            GEO.at(GEO.cyl(0.158, 0.168, 0.1, 40), [PX, REC_TOP - 0.05, 0])
          );
          const head = new THREE.Group();
          head.add(
            new THREE.Mesh(
              GEO.merge(
                parts
                  .map(g => (g.index ? g.toNonIndexed() : g))
                  .map(g => {
                    g.deleteAttribute("uv");
                    return g;
                  })
              ),
              headMat
            )
          );
          const rec = [
            GEO.at(GEO.cyl(0.142, 0.142, 6e-3, 40), [PX, REC_TOP + 1e-3, 0]),
          ];
          const seam = [];
          for (let k = 0; k <= 24; k++) {
            const u = 0.1 + (k / 24) * 0.89;
            const [z, y] = sect(u, -0.16, 2e-3);
            seam.push([hx(u), y, z]);
          }
          for (let k = 24; k >= 0; k--) {
            const u = 0.1 + (k / 24) * 0.89;
            const [z, y] = sect(u, Math.PI + 0.16, 2e-3);
            seam.push([hx(u), y, z]);
          }
          rec.push(GEO.tube(seam, 5e-3, 120, 5));
          head.add(new THREE.Mesh(GEO.merge(rec), black));
          const slots = [];
          for (let k = 0; k < 3; k++) {
            const a = HALF + (k * TAU2) / 3;
            slots.push(
              GEO.at(
                BOX(0.046, 4e-3, 0.011),
                [PX + Math.cos(a) * 0.07, REC_TOP + 4e-3, Math.sin(a) * 0.07],
                [0, -a + HALF, 0]
              )
            );
          }
          for (const bz of [-0.05, 0.05])
            slots.push(
              GEO.at(GEO.cyl(0.012, 0.012, 0.03, 6), [
                XR + 0.05,
                YC + 0.085,
                bz,
              ])
            );
          head.add(new THREE.Mesh(GEO.merge(slots), steel));
          d.part(head, null, { from: [-0.62, 0, 0], delay: 0.15, edge: false });
        }
        let leds;
        {
          const g = new THREE.Group();
          g.add(
            new THREE.Mesh(
              GEO.merge([
                GEO.at(flat(LENS_L + 0.05, 0.31, 0.06, 0.03), [
                  LENS_X,
                  LENS_Y - 0.012,
                  0,
                ]),
              ]),
              black
            )
          );
          const lens = new THREE.Mesh(
            GEO.at(flat(LENS_L, 0.26, 0.05, 8e-3, 3e-3), [
              LENS_X,
              LENS_Y - 0.027,
              0,
            ]),
            lensMat
          );
          lens.renderOrder = 2;
          g.add(lens);
          const n = 3 * 9;
          leds = new THREE.InstancedMesh(
            GEO.cyl(0.013, 0.015, 6e-3, 10),
            ledMat,
            n
          );
          let q = 0;
          for (let r = 0; r < 3; r++)
            for (let c = 0; c < 9; c++) {
              dummy.position.set(
                LENS_X - LENS_L / 2 + 0.05 + c * ((LENS_L - 0.1) / 8),
                LENS_Y - 0.0155,
                (r - 1) * 0.07
              );
              dummy.rotation.set(0, 0, 0);
              dummy.scale.setScalar(1);
              dummy.updateMatrix();
              leds.setMatrixAt(q++, dummy.matrix);
            }
          leds.instanceMatrix.needsUpdate = true;
          leds.castShadow = false;
          g.add(leds);
          d.part(g, null, { from: [0, -0.5, 0], delay: 0.55, cast: false });
        }
        const base = new THREE.Group();
        {
          base.add(
            new THREE.Mesh(
              GEO.merge([
                GEO.lathe(
                  [
                    [5e-4, 0],
                    [0.155, 0],
                    [0.155, 0.014],
                    [0.149, 0.02],
                    [0.149, BASE_H - 8e-3],
                    [0.145, BASE_H],
                    [5e-4, BASE_H],
                  ],
                  40
                ),
              ]),
              puckMat
            )
          );
          const grip = [];
          for (let k = 0; k < 16; k++) {
            const a = (k / 16) * TAU2;
            grip.push(
              GEO.at(
                BOX(0.012, 0.03, 0.01),
                [Math.cos(a) * 0.151, 0.032, Math.sin(a) * 0.151],
                [0, -a, 0]
              )
            );
          }
          base.add(new THREE.Mesh(GEO.merge(grip), puckMat));
          const pins = [];
          for (let k = 0; k < 3; k++) {
            const a = HALF + (k * TAU2) / 3;
            pins.push(
              GEO.at(
                GEO.rbox(0.042, 0.05, 9e-3, 3e-3, 1),
                [Math.cos(a) * 0.07, -0.022, Math.sin(a) * 0.07],
                [0, -a + HALF, 0]
              )
            );
          }
          for (let k = 0; k < 4; k++) {
            const a = Math.PI / 4 + (k * TAU2) / 4;
            pins.push(
              GEO.at(GEO.cyl(6e-3, 6e-3, 0.04, 8), [
                Math.cos(a) * 0.032,
                -0.02,
                Math.sin(a) * 0.032,
              ])
            );
          }
          base.add(new THREE.Mesh(GEO.merge(pins), brass));
          base.add(
            new THREE.Mesh(
              GEO.torus(0.15, 42e-4, 6, 64)
                .rotateX(HALF)
                .translate(0, BASE_H - 4e-3, 0),
              accent
            )
          );
          base.position.set(PX, REC_TOP, 0);
          d.part(base, null, { static: true });
        }
        {
          const g = new THREE.Group();
          const outer = [
            [0.145, 0],
            [0.142, 0.22],
            [0.135, 0.255],
            [0.121, 0.283],
            [0.096, 0.305],
            [0.062, 0.318],
            [5e-4, 0.322],
          ];
          const prof = outer.concat(
            outer
              .slice()
              .reverse()
              .map(([r, y]) => [
                Math.max(5e-4, r - 0.011),
                Math.max(0, y - 0.011),
              ])
          );
          g.add(new THREE.Mesh(GEO.lathe(prof, 48), domeMat));
          g.add(
            new THREE.Mesh(
              GEO.lathe(
                [
                  [0.038, 0],
                  [0.036, 0.011],
                  [0.024, 0.018],
                  [5e-4, 0.021],
                ],
                24
              ).translate(0, 0.312, 0),
              new THREE.MeshPhysicalMaterial({
                color: 724758,
                roughness: 0.28,
                clearcoat: 0.3,
                envMapIntensity: 0.5,
              })
            )
          );
          g.position.set(PX, BASE_TOP, 0);
          d.part(g, null, {
            from: [0, 0.85, 0],
            spin: [0, 1.3, 0],
            delay: 0.86,
            edge: true,
          });
        }
        const coneMat = new THREE.ShaderMaterial({
          uniforms: {
            uColor: { value: new THREE.Color(13623551) },
            uOpacity: { value: 0 },
          },
          vertexShader: `varying float vY; varying vec3 vN; varying vec3 vV; void main(){ vY = uv.y; vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
          fragmentShader: `uniform vec3 uColor; uniform float uOpacity; varying float vY; varying vec3 vN; varying vec3 vV;
          void main(){ float edge = pow(abs(dot(normalize(vN), normalize(vV))), 1.6); float fall = pow(vY, 1.7) * smoothstep(0.0, 0.3, vY); gl_FragColor = vec4(uColor, edge * fall * uOpacity); }`,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        });
        const CONE_H = LENS_Y - 0.04;
        const cone = d.part(
          new THREE.Mesh(GEO.cyl(0.13, 0.78, CONE_H, 48, true), coneMat),
          null,
          {
            pos: [LENS_X, CONE_H / 2 + 0.01, 0],
            static: true,
            cast: false,
            receive: false,
          }
        );
        const poolMat2 = new THREE.ShaderMaterial({
          uniforms: {
            uColor: { value: new THREE.Color(13623551) },
            uOpacity: { value: 0 },
          },
          vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
          fragmentShader: `uniform vec3 uColor; uniform float uOpacity; varying vec2 vUv; void main(){ float r = length(vUv - 0.5) * 2.0; float k = pow(1.0 - smoothstep(0.0, 1.0, r), 1.6); gl_FragColor = vec4(uColor, k * uOpacity); }`,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const pool = d.part(
          new THREE.Mesh(
            new THREE.CircleGeometry(0.85, 48).rotateX(-HALF),
            poolMat2
          ),
          null,
          { pos: [LENS_X, 6e-3, 0], static: true, cast: false, receive: false }
        );
        cone.renderOrder = pool.renderOrder = 3;
        d.label(
          "eSL-400 · <em>NEMA socket luminaire controller</em>",
          "#60A5FA",
          [PX, BASE_TOP + 0.36, 0],
          [0.46, 0.8]
        );
        d.label(
          "Socket · <em>7-pin NEMA twist-lock</em>",
          "#93C5FD",
          [PX + 0.15, REC_TOP + 0.02, 0.06],
          [0.47, 0.8]
        );
        d.label(
          "Dimming · <em>1% to 100%</em>",
          "#60A5FA",
          [LENS_X - 0.12, LENS_Y - 0.03, 0.1],
          [0.48, 0.8]
        );
        d.label(
          "Controller · <em>STM32G474 Cortex-M4 at 170MHz</em>",
          "#60A5FA",
          [PX, B_Y, 0.03],
          [0.55, 0.78]
        );
        const LED_C = new THREE.Color(14412287);
        let lastA = -1,
          lastL = -1;
        d.anim((p, time, dt, env) => {
          const a = env.fin > 0.5 ? 1 : env.a;
          if (Math.abs(a - lastA) > 1e-4) {
            lastA = a;
            const slide = easeInOut(clamp01((a - 0.56) / 0.14)),
              drop = easeInOut(clamp01((a - 0.7) / 0.08));
            base.position.set(
              PX,
              REC_TOP + 0.06 * (1 - drop),
              0.95 * (1 - slide)
            );
            base.rotation.y = 0.5 * (1 - drop);
          }
          const lit = env.fin > 0.5 ? 0.55 : sr(p, 0.44, 0.5);
          const dim =
            1 -
            0.62 * Math.pow(Math.sin(Math.PI * clamp01((p - 0.52) / 0.24)), 2);
          const L =
            lit *
            (env.fin > 0.5 ? 1 : dim * (0.94 + 0.06 * Math.sin(time * 1.3)));
          if (Math.abs(L - lastL) > 1e-3) {
            lastL = L;
            ledMat.color.copy(LED_C).multiplyScalar(0.25 + 2.2 * L);
            coneMat.uniforms.uOpacity.value = 0.16 * L;
            poolMat2.uniforms.uOpacity.value = 0.28 * L;
            cone.visible = pool.visible = L > 0.01;
          }
        });
        d.frame({
          dist: 5.35,
          height: 1.5,
          targetY: 1.08,
          fov: 32,
          yaw0: -0.45,
          yaw1: 0.3,
        });
        d.footprint(1.1);
        return d;
      };
      DEVICES.etransport = () => {
        const d = device("etransport");
        const PI = Math.PI,
          TW = Math.PI * 2;
        const ACC = 3718648;
        const CW = 1.28,
          CT = 0.045,
          IW = CW - 2 * CT;
        const PROF = [
          [-0.42, 0],
          [0.44, 0],
          [0.44, 0.98],
          [0.52, 1.04],
          [0.09, 1.15],
          [-0.05, 1.95],
          [-0.42, 1.95],
        ];
        const RADS = [6e-3, 6e-3, 0.035, 0.03, 0.05, 0.03, 0.04];
        const ALPHA = Math.atan2(0.11, 0.43),
          BETA = Math.atan2(0.14, 0.8);
        const DESK = [
          0,
          1.095 - 0.04 * Math.cos(ALPHA),
          0.305 - 0.04 * Math.sin(ALPHA),
        ];
        const DISP = [
          0,
          1.55 - 0.058 * Math.sin(BETA),
          0.02 - 0.058 * Math.cos(BETA),
        ];
        const DH = 0.81;
        const SLOT = [0, 0.55, 0.27];
        d.slot({ pos: SLOT, rot: [PI / 2, 0, 0], scale: 1 });
        const roundPoly = (pts, rads, seg) => {
          const out = [],
            n = pts.length;
          for (let i = 0; i < n; i++) {
            const p = pts[i],
              a = pts[(i + n - 1) % n],
              b = pts[(i + 1) % n];
            const ax = a[0] - p[0],
              ay = a[1] - p[1],
              la = Math.hypot(ax, ay),
              bx = b[0] - p[0],
              by = b[1] - p[1],
              lb = Math.hypot(bx, by);
            const ang = Math.acos(
              Math.max(-1, Math.min(1, (ax * bx + ay * by) / (la * lb)))
            );
            const t = Math.min(
              rads[i] / Math.tan(ang / 2),
              la * 0.45,
              lb * 0.45
            );
            const p1 = [p[0] + (ax / la) * t, p[1] + (ay / la) * t],
              p2 = [p[0] + (bx / lb) * t, p[1] + (by / lb) * t];
            for (let k = 0; k <= seg; k++) {
              const s = k / seg,
                u = 1 - s;
              out.push(
                new THREE.Vector2(
                  u * u * p1[0] + 2 * u * s * p[0] + s * s * p2[0],
                  u * u * p1[1] + 2 * u * s * p[1] + s * s * p2[1]
                )
              );
            }
          }
          return out;
        };
        const knurl = (r, len, ridges, depth = 0.08) => {
          const n = ridges * 2,
            step = TW / n;
          const g = new THREE.CylinderGeometry(
            r,
            r,
            len,
            n,
            1,
            false
          ).toNonIndexed();
          const P = g.attributes.position;
          for (let i = 0; i < P.count; i++) {
            const x = P.getX(i),
              z = P.getZ(i);
            if (x * x + z * z < r * r * 0.25) continue;
            const k = Math.round(Math.atan2(x, z) / step);
            const s = k & 1 ? 1 - depth : 1;
            P.setX(i, x * s);
            P.setZ(i, z * s);
          }
          g.computeVertexNormals();
          return g;
        };
        const shellM = d.xray(MAT.anod(3488581, 0.5));
        shellM.metalness = 0.4;
        const cheekM = d.xray(MAT.anod(1975082, 0.46));
        cheekM.metalness = 0.5;
        const doorDetM = d.xray(MAT.blackMetal(0.5));
        const bezelM = d.xray(MAT.gloss(395275));
        bezelM.clearcoat = 0.45;
        bezelM.roughness = 0.32;
        bezelM.clearcoatRoughness = 0.25;
        const plinthM = MAT.blackMetal(0.62);
        const inlayM = MAT.plastic(790292, 0.4);
        const ctrlM = MAT.plastic(1514016, 0.48);
        const knobM = new THREE.MeshStandardMaterial({
          color: 4870233,
          metalness: 0.9,
          roughness: 0.36,
        });
        const ballM = new THREE.MeshPhysicalMaterial({
          color: 793132,
          metalness: 0,
          roughness: 0.2,
          clearcoat: 1,
          clearcoatRoughness: 0.08,
        });
        const accM = MAT.led(ACC, 1.6);
        const rubber = MAT.rubber(1118999);
        const frameM = MAT.anod(3883596, 0.5);
        const psuM = MAT.anod(2830651, 0.5);
        const SW = TXS,
          SH = Math.round(TXS * 0.625),
          K = SW / 1024;
        const CHW = Math.round(SW * 0.77),
          TOP = Math.round(SH * 0.05);
        const base = document.createElement("canvas");
        base.width = SW;
        base.height = SH;
        const R = mulberry32(386241);
        const frac = (pts, depth, amp) => {
          let P = pts;
          for (let k = 0; k < depth; k++) {
            const Q = [];
            for (let i = 0; i < P.length - 1; i++) {
              const [x0, y0] = P[i],
                [x1, y1] = P[i + 1],
                o = (R() - 0.5) * amp;
              Q.push(P[i], [
                (x0 + x1) / 2 - (y1 - y0) * o,
                (y0 + y1) / 2 + (x1 - x0) * o,
              ]);
            }
            Q.push(P[P.length - 1]);
            P = Q;
            amp *= 0.6;
          }
          return P;
        };
        const path = pts => {
          const p = new Path2D();
          pts.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y)));
          p.closePath();
          return p;
        };
        const isle = (cx, cy, rx, ry, depth = 4) => {
          const ring = [];
          for (let i = 0; i <= 9; i++) {
            const a = (i / 9) * TW,
              w = 0.82 + 0.3 * R();
            ring.push([
              cx * CHW + Math.cos(a) * rx * CHW * w,
              cy * SH + Math.sin(a) * ry * SH * w,
            ]);
          }
          ring[9] = ring[0];
          return path(frac(ring, depth, 0.42));
        };
        const coast = frac(
          [
            [-30, 0.66 * SH],
            [0.06 * CHW, 0.62 * SH],
            [0.12 * CHW, 0.5 * SH],
            [0.1 * CHW, 0.4 * SH],
            [0.2 * CHW, 0.33 * SH],
            [0.3 * CHW, 0.24 * SH],
            [0.4 * CHW, 0.25 * SH],
            [0.47 * CHW, 0.14 * SH],
            [0.58 * CHW, 0.1 * SH],
            [0.66 * CHW, -30],
          ],
          5,
          0.5
        );
        const LAND = [
          path([...coast, [-30, -30]]),
          isle(0.69, 0.49, 0.1, 0.11),
          isle(0.46, 0.77, 0.055, 0.06, 3),
          isle(0.91, 0.87, 0.06, 0.075, 3),
          isle(0.82, 0.31, 0.018, 0.028, 2),
          isle(0.28, 0.58, 0.016, 0.024, 2),
        ];
        const WP = [
          [0.03, 0.9],
          [0.24, 0.84],
          [0.37, 0.66],
          [0.5, 0.5],
          [0.56, 0.3],
          [0.74, 0.2],
          [0.98, 0.16],
        ].map(([x, y]) => [x * CHW, y * SH]);
        {
          const g = base.getContext("2d");
          g.fillStyle = "#071c33";
          g.fillRect(0, 0, SW, SH);
          g.lineJoin = "round";
          const bands = [
            [52, "#0a2744"],
            [34, "#0e3254"],
            [19, "#134068"],
            [9, "#1a5281"],
          ];
          for (let b = 0; b < bands.length; b++) {
            const [w, col] = bands[b];
            for (const L of LAND) {
              g.strokeStyle =
                b === 2
                  ? "rgba(178, 216, 246, 0.72)"
                  : "rgba(122, 172, 216, 0.55)";
              g.lineWidth = (2 * w + (b === 2 ? 3.2 : 2)) * K;
              g.stroke(L);
            }
            for (const L of LAND) {
              g.strokeStyle = col;
              g.lineWidth = 2 * w * K;
              g.stroke(L);
            }
          }
          g.strokeStyle = "rgba(120, 165, 210, 0.13)";
          g.lineWidth = K;
          for (let x = 64 * K; x < CHW; x += 128 * K) {
            g.beginPath();
            g.moveTo(x, TOP);
            g.lineTo(x, SH);
            g.stroke();
          }
          for (let y = TOP + 80 * K; y < SH; y += 128 * K) {
            g.beginPath();
            g.moveTo(0, y);
            g.lineTo(CHW, y);
            g.stroke();
          }
          for (const L of LAND) {
            g.fillStyle = "#3a3a29";
            g.fill(L);
            g.save();
            g.clip(L);
            g.strokeStyle = "#454532";
            g.lineWidth = 54 * K;
            g.stroke(L);
            g.strokeStyle = "#3a3a29";
            g.lineWidth = 50 * K;
            g.stroke(L);
            g.restore();
            g.strokeStyle = "#c4ad6c";
            g.lineWidth = 1.8 * K;
            g.stroke(L);
          }
          g.fillStyle = "rgba(170, 196, 224, 0.4)";
          for (let i = 0; i < 170; i++) {
            const x = R() * CHW,
              y = TOP + R() * (SH - TOP);
            if (LAND.some(L => g.isPointInPath(L, x, y))) continue;
            g.beginPath();
            g.arc(x, y, 1.1 * K, 0, TW);
            g.fill();
          }
          for (const [x, y, a] of [
            [0.12 * CHW, 0.5 * SH, -0.6],
            [0.6 * CHW, 0.42 * SH, 2.3],
          ]) {
            g.save();
            g.translate(x, y);
            g.rotate(a);
            g.fillStyle = "rgba(232, 121, 249, 0.85)";
            g.beginPath();
            g.ellipse(13 * K, 0, 11 * K, 3.2 * K, 0, 0, TW);
            g.fill();
            g.fillStyle = "#f5d0fe";
            g.beginPath();
            g.arc(0, 0, 2.2 * K, 0, TW);
            g.fill();
            g.restore();
          }
          for (let i = 0; i < WP.length - 1; i++) {
            const [x0, y0] = WP[i],
              [x1, y1] = WP[i + 1],
              L = Math.hypot(x1 - x0, y1 - y0),
              nx = -(y1 - y0) / L,
              ny = (x1 - x0) / L;
            g.strokeStyle = "rgba(251, 146, 60, 0.3)";
            g.lineWidth = K;
            g.setLineDash([6 * K, 6 * K]);
            for (const s of [-15, 15]) {
              g.beginPath();
              g.moveTo(x0 + nx * s * K, y0 + ny * s * K);
              g.lineTo(x1 + nx * s * K, y1 + ny * s * K);
              g.stroke();
            }
            g.setLineDash([]);
            if (i === 2 || i === 4)
              for (const [s, col] of [
                [-26, "#ef4444"],
                [26, "#22c55e"],
              ]) {
                g.fillStyle = col;
                g.beginPath();
                g.arc(
                  (x0 + x1) / 2 + nx * s * K,
                  (y0 + y1) / 2 + ny * s * K,
                  3.4 * K,
                  0,
                  TW
                );
                g.fill();
              }
          }
          g.strokeStyle = "#fb923c";
          g.lineWidth = 3 * K;
          g.beginPath();
          WP.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
          g.stroke();
          for (const [x, y] of WP) {
            g.fillStyle = "#061a2e";
            g.beginPath();
            g.arc(x, y, 8 * K, 0, TW);
            g.fill();
            g.stroke();
          }
          g.strokeStyle = "#1f3b5c";
          g.lineWidth = 2 * K;
          g.strokeRect(K, TOP, CHW - 2 * K, SH - TOP - K);
          for (let x = 0, k = 0; x < CHW; x += 16 * K, k++) {
            g.fillStyle = k % 2 ? "#0b1626" : "#5c7593";
            g.fillRect(x, SH - 5 * K, 16 * K, 5 * K);
          }
          for (let y = TOP, k = 0; y < SH; y += 16 * K, k++) {
            g.fillStyle = k % 2 ? "#0b1626" : "#5c7593";
            g.fillRect(0, y, 5 * K, 16 * K);
          }
          g.fillStyle = "#0a1424";
          g.fillRect(0, 0, SW, TOP);
          g.fillStyle = "#1d3554";
          g.fillRect(0, TOP - K, SW, K);
          for (let i = 0; i < 5; i++) {
            g.fillStyle = i === 1 ? "#24507a" : "#16304d";
            g.fillRect((10 + i * 30) * K, TOP * 0.22, 22 * K, TOP * 0.56);
          }
          for (const [i, col] of [
            [0, "#22c55e"],
            [1, "#22c55e"],
            [2, "#f59e0b"],
          ]) {
            g.fillStyle = col;
            g.beginPath();
            g.arc(SW - (18 + i * 18) * K, TOP / 2, 4.2 * K, 0, TW);
            g.fill();
          }
          const SX = CHW,
            SWD = SW - CHW,
            cx = SX + SWD / 2,
            cy = TOP + 96 * K;
          g.fillStyle = "#081221";
          g.fillRect(SX, TOP, SWD, SH - TOP);
          g.fillStyle = "#1f3b5c";
          g.fillRect(SX, TOP, 2 * K, SH - TOP);
          g.strokeStyle = "#2d4f75";
          g.lineWidth = 2 * K;
          g.beginPath();
          g.arc(cx, cy, 72 * K, 0, TW);
          g.stroke();
          g.strokeStyle = "#16304d";
          g.beginPath();
          g.arc(cx, cy, 50 * K, 0, TW);
          g.stroke();
          for (let i = 0; i < 72; i++) {
            const a = (i / 72) * TW,
              L = i % 6 === 0 ? 11 : 5;
            g.strokeStyle = i % 6 === 0 ? "#6b8db3" : "#33557c";
            g.lineWidth = (i % 6 === 0 ? 1.6 : 1) * K;
            g.beginPath();
            g.moveTo(
              cx + Math.cos(a) * (72 - L) * K,
              cy + Math.sin(a) * (72 - L) * K
            );
            g.lineTo(cx + Math.cos(a) * 72 * K, cy + Math.sin(a) * 72 * K);
            g.stroke();
          }
          g.fillStyle = "#e2e8f0";
          g.beginPath();
          g.moveTo(cx, cy - 84 * K);
          g.lineTo(cx - 6 * K, cy - 74 * K);
          g.lineTo(cx + 6 * K, cy - 74 * K);
          g.fill();
          const fills = [0.72, 0.46, 0.83, 0.3, 0.58];
          for (let i = 0; i < 5; i++) {
            const y = TOP + (190 + i * 54) * K,
              x0 = SX + 14 * K,
              w = SWD - 28 * K;
            g.fillStyle = "#0c1a2d";
            g.fillRect(x0, y, w, 44 * K);
            g.fillStyle = i === 3 ? "#f59e0b" : "#22c55e";
            g.fillRect(x0 + 8 * K, y + 8 * K, 8 * K, 8 * K);
            g.fillStyle = "#14263d";
            g.fillRect(x0 + 28 * K, y + 26 * K, w - 40 * K, 7 * K);
            g.fillStyle = "rgba(56, 189, 248, 0.8)";
            g.fillRect(x0 + 28 * K, y + 26 * K, (w - 40 * K) * fills[i], 7 * K);
            if (i % 2 === 0) {
              g.strokeStyle = "rgba(125, 211, 252, 0.7)";
              g.lineWidth = 1.4 * K;
              g.beginPath();
              for (let k = 0; k <= 20; k++) {
                const px = x0 + 28 * K + (k / 20) * (w - 40 * K),
                  py = y + 15 * K - Math.sin(k * 0.7 + i) * 4 * K - R() * 3 * K;
                if (k) g.lineTo(px, py);
                else g.moveTo(px, py);
              }
              g.stroke();
            }
          }
          g.fillStyle = "#14263d";
          g.fillRect(SX + 20 * K, SH - 34 * K, SWD - 40 * K, 6 * K);
          g.fillStyle = "#6b8db3";
          g.fillRect(cx - K, SH - 40 * K, 2 * K, 18 * K);
        }
        const segs = [];
        let tot = 0;
        for (let i = 0; i < WP.length - 1; i++) {
          const dx = WP[i + 1][0] - WP[i][0],
            dy = WP[i + 1][1] - WP[i][1],
            L = Math.hypot(dx, dy);
          segs.push({
            x: WP[i][0],
            y: WP[i][1],
            dx,
            dy,
            L,
            c: tot,
            h: Math.atan2(dy, dx),
          });
          tot += L;
        }
        const sp = { x: 0, y: 0, h: 0 };
        const sample = s => {
          const dist = (s - Math.floor(s)) * tot;
          let i = 0;
          while (i < segs.length - 1 && dist > segs[i].c + segs[i].L) i++;
          const q = segs[i],
            u = (dist - q.c) / q.L;
          sp.x = q.x + q.dx * u;
          sp.y = q.y + q.dy * u;
          sp.h = q.h;
          return sp;
        };
        const AIS = [
          [0.98, 0.56, 0.76, 0.96, 0.15],
          [0.08, 0.985, 0.34, 0.9, 0.55],
          [0.99, 0.43, 0.84, 0.36, 0.8],
        ];
        const CX = CHW + (SW - CHW) / 2,
          CY = TOP + 96 * K;
        const drawScreen = (g, w, h, t) => {
          g.drawImage(base, 0, 0);
          const s0 = 0.2 + t * 0.011;
          g.fillStyle = "rgba(226, 232, 240, 0.65)";
          for (let k = 1; k <= 14; k++) {
            const q2 = sample(s0 - k * 7e-3);
            g.fillRect(q2.x - K, q2.y - K, 2 * K, 2 * K);
          }
          for (let i = 0; i < AIS.length; i++) {
            const a = AIS[i],
              u = (t * 5e-3 + a[4]) % 1;
            const x = (a[0] + (a[2] - a[0]) * u) * CHW,
              y = (a[1] + (a[3] - a[1]) * u) * SH;
            g.save();
            g.translate(x, y);
            g.rotate(Math.atan2((a[3] - a[1]) * SH, (a[2] - a[0]) * CHW));
            g.strokeStyle = "#86efac";
            g.lineWidth = 1.5 * K;
            g.beginPath();
            g.moveTo(9 * K, 0);
            g.lineTo(-6 * K, -5.5 * K);
            g.lineTo(-6 * K, 5.5 * K);
            g.closePath();
            g.moveTo(9 * K, 0);
            g.lineTo(30 * K, 0);
            g.stroke();
            g.restore();
          }
          const q = sample(s0);
          g.save();
          g.translate(q.x, q.y);
          g.scale(1.6, 1.6);
          g.strokeStyle = "rgba(241, 245, 249, 0.35)";
          g.lineWidth = K;
          g.beginPath();
          g.arc(0, 0, 19 * K, 0, TW);
          g.stroke();
          g.rotate(q.h);
          g.strokeStyle = "rgba(226, 232, 240, 0.75)";
          g.beginPath();
          g.moveTo(14 * K, 0);
          g.lineTo(118 * K, 0);
          g.stroke();
          g.strokeStyle = "#7dd3fc";
          g.lineWidth = 2.2 * K;
          g.beginPath();
          g.moveTo(14 * K, 0);
          g.lineTo(64 * K, 0);
          g.moveTo(64 * K, 0);
          g.lineTo(56 * K, -4.5 * K);
          g.moveTo(64 * K, 0);
          g.lineTo(56 * K, 4.5 * K);
          g.stroke();
          g.fillStyle = "#0b1a2b";
          g.strokeStyle = "#f8fafc";
          g.lineWidth = 1.7 * K;
          g.beginPath();
          g.moveTo(15 * K, 0);
          g.lineTo(5 * K, -5.5 * K);
          g.lineTo(-11 * K, -5.5 * K);
          g.lineTo(-12 * K, 0);
          g.lineTo(-11 * K, 5.5 * K);
          g.lineTo(5 * K, 5.5 * K);
          g.closePath();
          g.fill();
          g.stroke();
          g.restore();
          g.save();
          g.translate(CX, CY);
          g.rotate(q.h);
          g.strokeStyle = "#7dd3fc";
          g.lineWidth = 2.4 * K;
          g.beginPath();
          g.moveTo(-40 * K, 0);
          g.lineTo(62 * K, 0);
          g.stroke();
          g.fillStyle = "#f8fafc";
          g.beginPath();
          g.moveTo(16 * K, 0);
          g.lineTo(-10 * K, -7 * K);
          g.lineTo(-10 * K, 7 * K);
          g.closePath();
          g.fill();
          g.restore();
          g.fillStyle = "#7dd3fc";
          g.fillRect(
            CX + Math.sin(t * 0.6) * 34 * K - 3 * K,
            SH - 38 * K,
            6 * K,
            14 * K
          );
        };
        const screenM = MAT.screen(drawScreen, SW, SH, 1.22);
        screenM.roughness = 0.34;
        screenM.envMapIntensity = 0.35;
        d.part(GEO.rbox(IW, 0.1, 0.72, 0.012, 2), plinthM, {
          pos: [0, 0.05, -0.02],
          from: [0, 0, 0.8],
          delay: 0,
        });
        const fr = [
          GEO.at(GEO.rbox(IW - 0.01, 0.02, 0.76, 6e-3, 1), [0, 0.11, 0]),
          GEO.at(GEO.rbox(1, 0.66, 0.014, 8e-3, 1), [0, 0.57, 0.17]),
        ];
        for (const [x, y] of [
          [-0.4, 0.3],
          [0.4, 0.3],
          [-0.4, 0.8],
          [0.4, 0.8],
        ])
          fr.push(
            GEO.at(
              GEO.cyl(0.011, 0.011, 0.068, 10),
              [x, y, 0.211],
              [PI / 2, 0, 0]
            )
          );
        d.part(GEO.merge(fr), frameM, { from: [0, 0, -0.9], delay: 0.05 });
        d.part(
          GEO.merge([
            GEO.rbox(0.34, 0.1, 0.2, 0.012, 2),
            ...[-0.1, -0.06, -0.02, 0.02, 0.06, 0.1].map(x =>
              GEO.at(new THREE.BoxGeometry(0.012, 0.06, 4e-3), [x, 0, 0.1])
            ),
          ]),
          psuM,
          { pos: [0.28, 0.17, 0.23], from: [0, 0, 0.9], delay: 0.1 }
        );
        d.part(
          GEO.merge(
            [-0.26, -0.2].map(x =>
              GEO.tube(
                [
                  [x, 0.84, 0.3],
                  [x, 0.92, 0.28],
                  [x, 0.98, 0.1],
                  [x, 1.05, -0.08],
                  [x, 1.3, -0.2],
                ],
                0.012,
                40,
                6
              )
            )
          ),
          rubber,
          { from: [0, 0.6, 0], delay: 0.14 }
        );
        d.part(
          GEO.merge([
            GEO.at(GEO.rbox(IW, 1.93, 0.03, 0.01, 2), [0, 0.965, -0.405]),
            GEO.at(GEO.rbox(IW, 0.03, 0.25, 0.01, 2), [0, 1.935, -0.295]),
          ]),
          shellM,
          { from: [0, 0, -0.8], delay: 0.22, edge: true }
        );
        const cheekGeo = new THREE.ExtrudeGeometry(
          new THREE.Shape(roundPoly(PROF, RADS, 4)),
          {
            depth: CT - 0.02,
            bevelEnabled: true,
            bevelThickness: 0.01,
            bevelSize: 8e-3,
            bevelSegments: 2,
            curveSegments: 4,
          }
        ).rotateY(-PI / 2);
        const lineGeo = GEO.tube(
          [
            [0.462, 1.016, 0],
            [0.298, 1.058, 0],
            [0.133, 1.1, 0],
          ],
          45e-4,
          12,
          6
        );
        for (const sx of [-1, 1]) {
          const ck = d.part(
            cheekGeo
              .clone()
              .translate(sx > 0 ? CW / 2 - 0.01 : -CW / 2 + CT - 0.01, 0, 0),
            cheekM,
            { from: [sx * 0.72, 0, 0], delay: sx < 0 ? 0.32 : 0.36, edge: true }
          );
          d.part(
            lineGeo
              .clone()
              .rotateY(-PI / 2)
              .translate(sx * (CW / 2 + 15e-4), 0, 0),
            accM,
            { parent: ck, static: true, cast: false }
          );
        }
        const desk = d.part(GEO.rbox(IW, 0.05, 0.44, 0.012, 2), shellM, {
          pos: DESK,
          rot: [ALPHA, 0, 0],
          from: [0, 0.42, 0.4],
          delay: 0.5,
          edge: true,
        });
        const DT = 0.025;
        d.part(GEO.rbox(IW - 0.05, 6e-3, 0.34, 3e-3, 1), inlayM, {
          parent: desk,
          static: true,
          pos: [0, DT + 2e-3, -0.015],
        });
        d.part(GEO.rbox(IW - 0.02, 0.03, 0.05, 0.014, 2), rubber, {
          parent: desk,
          static: true,
          pos: [0, DT + 0.012, 0.19],
        });
        const ctl = new THREE.Group();
        const cP = [],
          cK = [],
          cA = [];
        cP.push(
          GEO.at(
            GEO.lathe(
              [
                [0.052, 0],
                [0.08, 0],
                [0.082, 6e-3],
                [0.074, 0.016],
                [0.056, 0.016],
                [0.052, 0.01],
              ],
              48
            ),
            [0, DT + 5e-3, 0.03]
          )
        );
        for (const sx of [-1, 1])
          cP.push(
            GEO.at(GEO.rbox(0.085, 0.014, 0.055, 6e-3, 1), [
              sx * 0.145,
              DT + 0.012,
              0.05,
            ])
          );
        for (let r = 0; r < 2; r++)
          for (let i = 0; i < 4; i++) {
            const x = -0.5 + i * 0.075,
              z = -0.085 + r * 0.085;
            cP.push(
              GEO.at(new THREE.BoxGeometry(0.058, 0.014, 0.044), [
                x,
                DT + 0.012,
                z,
              ])
            );
            if ((i + r) % 2 === 0 || i === 3)
              cA.push(
                GEO.at(new THREE.BoxGeometry(0.03, 2e-3, 5e-3), [
                  x,
                  DT + 0.0195,
                  z - 0.012,
                ])
              );
          }
        for (const [x, z] of [
          [0.32, -0.06],
          [0.45, -0.06],
          [0.385, 0.075],
        ]) {
          cP.push(
            GEO.at(
              GEO.lathe(
                [
                  [1e-3, 0],
                  [0.036, 0],
                  [0.036, 6e-3],
                  [0.031, 0.01],
                  [1e-3, 0.01],
                ],
                32
              ),
              [x, DT + 5e-3, z]
            )
          );
          cK.push(GEO.at(knurl(0.026, 0.028, 18), [x, DT + 0.029, z]));
          cP.push(
            GEO.at(
              GEO.lathe(
                [
                  [1e-3, 0],
                  [0.026, 0],
                  [0.024, 4e-3],
                  [1e-3, 6e-3],
                ],
                24
              ),
              [x, DT + 0.043, z]
            )
          );
          cA.push(
            GEO.at(new THREE.BoxGeometry(4e-3, 2e-3, 0.014), [
              x,
              DT + 0.05,
              z - 0.012,
            ])
          );
        }
        cA.push(
          GEO.at(GEO.cyl(6e-3, 6e-3, 4e-3, 12), [0.53, DT + 7e-3, 0.07]),
          GEO.at(GEO.cyl(6e-3, 6e-3, 4e-3, 12), [0.53, DT + 7e-3, 0.03])
        );
        ctl.add(
          new THREE.Mesh(GEO.merge(cP), ctrlM),
          new THREE.Mesh(GEO.merge(cK), knobM),
          new THREE.Mesh(GEO.merge(cA), accM)
        );
        ctl.add(
          new THREE.Mesh(
            GEO.sphere(0.048, 28, 18).translate(0, DT + 0.022, 0.03),
            ballM
          )
        );
        d.part(ctl, null, { parent: desk, from: [0, 0.2, 0.04], delay: 0.7 });
        const disp = d.part(GEO.rbox(IW, DH, 0.1, 0.012, 2), cheekM, {
          pos: DISP,
          rot: [-BETA, 0, 0],
          from: [0, 0.3, -0.5],
          delay: 0.58,
          edge: true,
        });
        d.part(GEO.rbox(IW - 0.02, DH - 0.02, 6e-3, 0.01, 1), bezelM, {
          parent: disp,
          static: true,
          pos: [0, 0, 0.05],
        });
        d.part(new THREE.PlaneGeometry(1.04, 0.65), screenM, {
          parent: disp,
          static: true,
          pos: [0, 0.045, 0.0545],
          cast: false,
        });
        const bk = [];
        for (let i = 0; i < 6; i++)
          bk.push(
            GEO.at(
              GEO.cyl(0.011, 0.011, 6e-3, 16),
              [-0.2 + i * 0.08, -0.34, 0.055],
              [PI / 2, 0, 0]
            )
          );
        d.part(GEO.merge(bk), ctrlM, { parent: disp, static: true });
        d.part(new THREE.BoxGeometry(0.03, 4e-3, 3e-3), accM, {
          parent: disp,
          static: true,
          pos: [0.48, -0.34, 0.055],
          cast: false,
        });
        const door = d.part(GEO.rbox(1.16, 0.86, 0.03, 0.012, 2), shellM, {
          pos: [0, 0.53, 0.425],
          from: [0, 0, 0.7],
          delay: 0.9,
          edge: true,
        });
        const dd = [];
        for (let i = 0; i < 7; i++)
          dd.push(
            GEO.at(new THREE.BoxGeometry(0.72, 0.012, 6e-3), [
              -0.06,
              -0.35 + i * 0.03,
              0.016,
            ])
          );
        for (const y of [-0.395, 0.395])
          dd.push(
            GEO.at(new THREE.BoxGeometry(1.08, 6e-3, 4e-3), [0, y, 0.0155])
          );
        for (const x of [-0.54, 0.54])
          dd.push(
            GEO.at(new THREE.BoxGeometry(6e-3, 0.796, 4e-3), [x, 0, 0.0155])
          );
        dd.push(
          GEO.at(GEO.rbox(0.026, 0.22, 0.02, 8e-3, 1), [0.47, 0.08, 0.022]),
          GEO.at(
            GEO.cyl(0.014, 0.014, 0.01, 16),
            [0.47, -0.1, 0.018],
            [PI / 2, 0, 0]
          )
        );
        d.part(GEO.merge(dd), doorDetM, { parent: door, static: true });
        d.label(
          "eNav-ECDIS · <em>Electronic chart display</em>",
          "#38BDF8",
          [-0.16, 2.07, -0.12],
          [0.46, 0.8]
        );
        d.label(
          '27" IPS 1920×1200 · <em>sunlight readable</em>',
          "#7DD3FC",
          [0.22, 1.97, -0.07],
          [0.48, 0.8]
        );
        d.label(
          "S-57/S-63 · <em>encrypted ENC charts</em>",
          "#38BDF8",
          [-0.3, 1.46, 0.05],
          [0.5, 0.8]
        );
        d.label(
          "NXP i.MX 8M Plus · <em>quad Cortex-A53</em>",
          "#BAE6FD",
          [0.2, 0.66, 0.34],
          [0.55, 0.78]
        );
        const shell = [];
        for (const m of d.parts)
          m.m.traverse(
            c =>
              c.isMesh &&
              (c.material === shellM ||
                c.material === cheekM ||
                c.material === doorDetM ||
                c.material === bezelM) &&
              shell.push(c)
          );
        const accC = new THREE.Color(ACC);
        let lastDraw = -1,
          lastCast = true;
        d.anim((p, time, dt, env) => {
          if (Math.abs(time - lastDraw) > 0.08) {
            lastDraw = time;
            screenM.userData.redraw(time);
          }
          const cast = env.x < 0.25;
          if (cast !== lastCast) {
            lastCast = cast;
            for (const m of shell) m.castShadow = cast;
          }
          accM.color
            .copy(accC)
            .multiplyScalar(1.45 + 0.35 * Math.sin(time * 1.4));
        });
        d.frame({
          dist: 4.9,
          height: 1.72,
          targetY: 1,
          fov: 32,
          yaw0: -0.5,
          yaw1: 0.42,
        });
        d.footprint(0.95);
        return d;
      };
      function buildRobot(o) {
        const RS = 1.22,
          PI = Math.PI,
          TW = Math.PI * 2;
        const fx = ctx.fx;
        const PSI2 = o.psi,
          HUB_TOP = o.hubTop;
        const Z_BACK = -1,
          Z_FRONT = 0.8;
        const root2 = new THREE.Group(),
          rig = new THREE.Group();
        rig.scale.setScalar(RS);
        root2.add(rig);
        root2.rotation.y = PSI2;
        const stage2 = new THREE.Group();
        stage2.position.set(0, HUB_TOP, 0);
        stage2.rotation.y = PSI2;
        const J = {},
          A = {};
        const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
        const SHELL = new THREE.MeshPhysicalMaterial({
          color: 15001579,
          roughness: 0.44,
          metalness: 0,
          clearcoat: 0.12,
          clearcoatRoughness: 0.45,
          transparent: true,
        });
        const SHELL2 = new THREE.MeshPhysicalMaterial({
          color: 9015965,
          roughness: 0.4,
          metalness: 0.45,
          clearcoat: 0.2,
          clearcoatRoughness: 0.4,
          transparent: true,
        });
        const SHELLS = [SHELL, SHELL2];
        const JOINT = MAT.anod(2303790, 0.38);
        const DARK = MAT.plastic(1185049, 0.48);
        const RUB = MAT.rubber(921619);
        const STEEL = MAT.steel(0.48);
        const RING2 = MAT.alu(8752535, 0.55);
        const VISOR = new THREE.MeshPhysicalMaterial({
          color: 131846,
          roughness: 0.1,
          metalness: 0.45,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          envMapIntensity: 0.42,
        });
        const GAP = MAT.plastic(526604, 0.7);
        const EYE = new THREE.MeshBasicMaterial({ color: 0 });
        const BROW = new THREE.MeshBasicMaterial({ color: 0 });
        const CHEST_RIM = new THREE.MeshBasicMaterial({ color: 0 });
        const PACK_BAR = new THREE.MeshBasicMaterial({ color: 0 });
        const SCAN = new THREE.MeshBasicMaterial({ color: 0 });
        const cylX = (r, len, n = 48) =>
          GEO.at(GEO.cyl(r, r, len, n), [0, 0, 0], [0, 0, PI / 2]);
        const cylZ = (r, len, n = 48) =>
          GEO.at(GEO.cyl(r, r, len, n), [0, 0, 0], [PI / 2, 0, 0]);
        const ringX = (r, t, x) =>
          GEO.at(GEO.torus(r, t, 8, 56), [x, 0, 0], [0, PI / 2, 0]);
        function loft(levels, opt = {}) {
          const seg2 = opt.seg || 64,
            t0 = opt.t0 ?? 0,
            t1 = opt.t1 ?? TW;
          const closed = Math.abs(t1 - t0 - TW) < 1e-6,
            cols = closed ? seg2 : seg2 + 1,
            K = levels.length;
          const pos = [],
            uv = [],
            idx = [];
          levels.forEach(([y, w, d, n = 2, dz = 0], k) => {
            const e = 2 / n;
            for (let i = 0; i < cols; i++) {
              const t = t0 + ((t1 - t0) * i) / seg2,
                c = Math.cos(t),
                s = Math.sin(t);
              pos.push(
                w * Math.sign(c) * Math.pow(Math.abs(c), e),
                y,
                d * Math.sign(s) * Math.pow(Math.abs(s), e) + dz
              );
              uv.push(i / seg2, k / (K - 1));
            }
          });
          for (let k = 0; k < K - 1; k++)
            for (let i = 0; i < seg2; i++) {
              const a = k * cols + i,
                b = k * cols + ((i + 1) % cols),
                c = (k + 1) * cols + i,
                d = (k + 1) * cols + ((i + 1) % cols);
              idx.push(a, c, b, b, c, d);
            }
          if (closed && opt.caps !== false) {
            const L0 = levels[0],
              L12 = levels[K - 1];
            const cb = pos.length / 3;
            pos.push(0, L0[0], L0[4] || 0);
            uv.push(0.5, 0);
            for (let i = 0; i < seg2; i++) idx.push(cb, i, (i + 1) % cols);
            const ct = pos.length / 3;
            pos.push(0, L12[0], L12[4] || 0);
            uv.push(0.5, 1);
            for (let i = 0; i < seg2; i++)
              idx.push(
                ct,
                (K - 1) * cols + ((i + 1) % cols),
                (K - 1) * cols + i
              );
          }
          const g = new THREE.BufferGeometry();
          g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
          g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
          g.setIndex(idx);
          g.computeVertexNormals();
          return g;
        }
        const seam = (y, w, d, n = 2.4, dz = 0, t = 22e-4) => {
          const g = loft(
            [
              [y - t, w + 12e-4, d + 12e-4, n, dz],
              [y + t, w + 12e-4, d + 12e-4, n, dz],
            ],
            { caps: false, seg: 64 }
          );
          return g;
        };
        const grp = (parent, name, pos = [0, 0, 0]) => {
          const g = new THREE.Group();
          g.position.set(pos[0], pos[1], pos[2]);
          parent.add(g);
          if (name) J[name] = g;
          return g;
        };
        const anchor = (parent, name, pos = [0, 0, 0]) => {
          const g = new THREE.Object3D();
          g.position.set(pos[0], pos[1], pos[2]);
          parent.add(g);
          A[name] = g;
          return g;
        };
        function seg(parent, list) {
          const byMat = new Map();
          for (const [geo, mat] of list) {
            if (!byMat.has(mat)) byMat.set(mat, []);
            byMat.get(mat).push(geo);
          }
          for (const [mat, geos] of byMat) {
            const m = new THREE.Mesh(
              geos.length > 1 ? GEO.merge(geos) : geos[0],
              mat
            );
            m.castShadow = true;
            m.receiveShadow = true;
            parent.add(m);
          }
        }
        const LEDS = [];
        function drive(parent, r, len, side, depth, pos = [0, 0, 0], name) {
          const g = grp(parent, null, pos);
          seg(g, [
            [cylX(r, len), JOINT],
            [cylX(r * 0.84, len + 0.012), DARK],
            [cylX(r * 0.52, len + 0.02), STEEL],
            [ringX(r * 0.985, 28e-4, len / 2 - 4e-3), RING2],
            [ringX(r * 0.985, 28e-4, -len / 2 + 4e-3), RING2],
          ]);
          const mat = new THREE.MeshBasicMaterial({ color: 0 });
          const ring = new THREE.Mesh(
            GEO.torus(r * 0.68, Math.max(19e-4, r * 0.045), 6, 48),
            mat
          );
          ring.rotation.y = PI / 2;
          ring.position.x = side * (len / 2 + 0.0105);
          g.add(ring);
          LEDS.push({ mat, depth, name });
          return g;
        }
        const pelvis = grp(rig, "pelvis", [0, 0.96, 0]);
        seg(pelvis, [
          [
            loft([
              [-0.058, 0.112, 0.074, 3.2],
              [-0.035, 0.126, 0.082, 3.4],
              [0.02, 0.13, 0.085, 3.4],
              [0.05, 0.118, 0.078, 3.2],
              [0.064, 0.09, 0.06, 2.8],
            ]),
            JOINT,
          ],
          [
            loft(
              [
                [-0.03, 0.136, 0.09, 3.4, 4e-3],
                [0.036, 0.139, 0.092, 3.4, 4e-3],
                [0.06, 0.122, 0.082, 3.2, 3e-3],
              ],
              { t0: 0.18, t1: PI - 0.18, seg: 48 }
            ),
            SHELL,
          ],
          [GEO.at(GEO.rbox(0.1, 0.034, 0.012, 6e-3), [0, 6e-3, 0.096]), SHELL2],
          [seam(0, 0.137, 0.091, 3.4, 4e-3), GAP],
        ]);
        anchor(pelvis, "pelvisA", [0, 0, 0.1]);
        anchor(pelvis, "imu", [0, 0.02, 0]);
        seg(pelvis, [
          [GEO.at(GEO.rbox(0.05, 0.02, 0.04, 5e-3), [0, 0.03, 0.03]), RING2],
        ]);
        const thighG = loft([
          [-0.4, 0.028, 0.032, 2.4],
          [-0.372, 0.05, 0.056, 2.4],
          [-0.3, 0.06, 0.068, 2.5, 2e-3],
          [-0.2, 0.07, 0.08, 2.6, 4e-3],
          [-0.1, 0.076, 0.086, 2.6, 5e-3],
          [-0.045, 0.072, 0.079, 2.5, 3e-3],
          [-0.014, 0.05, 0.054, 2.4],
          [0, 0.016, 0.018, 2.4],
        ]);
        const shinG = loft([
          [-0.392, 0.028, 0.03, 2.4],
          [-0.362, 0.036, 0.04, 2.4],
          [-0.3, 0.043, 0.049, 2.5, -2e-3],
          [-0.2, 0.054, 0.063, 2.6, -7e-3],
          [-0.12, 0.06, 0.07, 2.6, -0.01],
          [-0.06, 0.057, 0.064, 2.5, -6e-3],
          [-0.016, 0.044, 0.05, 2.4, -2e-3],
          [0, 0.016, 0.018, 2.4],
        ]);
        const shinPlateG = loft(
          [
            [-0.33, 0.046, 0.054, 2.6, 2e-3],
            [-0.22, 0.057, 0.068, 2.7, -4e-3],
            [-0.12, 0.063, 0.074, 2.7, -7e-3],
            [-0.07, 0.06, 0.068, 2.6, -4e-3],
          ],
          { t0: PI / 2 - 0.62, t1: PI / 2 + 0.62, seg: 24 }
        );
        const footG = loft([
          [-0.081, 0.05, 0.124, 4.2, 0.052],
          [-0.068, 0.054, 0.13, 4.4, 0.052],
          [-0.042, 0.052, 0.124, 4.2, 0.048],
          [-0.026, 0.044, 0.1, 3.6, 0.036],
          [-0.016, 0.03, 0.06, 3, 0.02],
        ]);
        const soleG = loft([
          [-0.0835, 0.054, 0.131, 4.6, 0.052],
          [-0.068, 0.0555, 0.133, 4.6, 0.052],
        ]);
        function leg(side) {
          const s = side === "L" ? 1 : -1;
          const hipYaw = grp(pelvis, "hipYaw" + side, [s * 0.095, -0.065, 0]);
          seg(hipYaw, [
            [GEO.at(GEO.cyl(0.046, 0.046, 0.04, 40), [0, 0.03, 0]), JOINT],
            [
              GEO.at(
                GEO.torus(0.046, 26e-4, 6, 48).rotateX(PI / 2),
                [0, 0.012, 0]
              ),
              RING2,
            ],
          ]);
          const hipRoll = grp(hipYaw, "hipRoll" + side);
          seg(hipRoll, [
            [cylZ(0.05, 0.094), JOINT],
            [cylZ(0.04, 0.102), DARK],
          ]);
          const hipPitch = grp(hipRoll, "hipPitch" + side);
          drive(hipPitch, 0.07, 0.094, s, 2, [s * 0.014, 0, 0], "hip" + side);
          anchor(hipPitch, "hip" + side, [s * 0.066, 0, 0.02]);
          seg(hipPitch, [
            [thighG, SHELL],
            [seam(-0.085, 0.0755, 0.085, 2.6, 5e-3), GAP],
            [seam(-0.33, 0.058, 0.064, 2.5, 2e-3), GAP],
            [GEO.at(GEO.cyl(0.018, 0.018, 0.36, 16), [0, -0.2, 0]), RING2],
          ]);
          const knee = grp(hipPitch, "knee" + side, [0, -0.42, 0]);
          drive(knee, 0.06, 0.11, s, 3, [0, 0, 0], "knee" + side);
          anchor(knee, "knee" + side, [s * 0.062, 0, 0.03]);
          seg(knee, [
            [
              GEO.at(
                loft([
                  [-0.05, 0.03, 0.02, 2.6],
                  [-0.02, 0.046, 0.03, 2.8],
                  [0.02, 0.044, 0.028, 2.8],
                  [0.05, 0.026, 0.016, 2.6],
                ]),
                [0, 6e-3, 0.05]
              ),
              SHELL2,
            ],
            [shinG, SHELL],
            [shinPlateG, SHELL2],
            [GEO.at(GEO.cyl(0.018, 0.018, 0.36, 16), [0, -0.2, 0]), RING2],
          ]);
          for (const dx of [-0.025, 0.025]) {
            seg(knee, [
              [
                GEO.at(GEO.cyl(0.015, 0.015, 0.2, 20), [dx, -0.17, -0.074]),
                JOINT,
              ],
              [
                GEO.at(GEO.cyl(0.017, 0.017, 0.03, 20), [dx, -0.075, -0.074]),
                DARK,
              ],
              [
                GEO.at(GEO.torus(0.0152, 18e-4, 6, 24).rotateX(PI / 2), [
                  dx,
                  -0.26,
                  -0.074,
                ]),
                RING2,
              ],
              [
                GEO.at(GEO.cyl(7e-3, 7e-3, 0.1, 12), [dx, -0.315, -0.07]),
                STEEL,
              ],
            ]);
          }
          anchor(knee, "act" + side, [0, -0.2, -0.09]);
          const ankP = grp(knee, "ankP" + side, [0, -0.4, 0]);
          drive(ankP, 0.032, 0.076, s, 4, [0, 0, 0], "ankle" + side);
          const ankR = grp(ankP, "ankR" + side);
          seg(ankR, [
            [footG, SHELL],
            [soleG, RUB],
            [GEO.at(GEO.rbox(0.104, 4e-3, 5e-3, 2e-3), [0, -0.03, 0.128]), GAP],
            [
              GEO.at(GEO.rbox(0.066, 0.028, 0.05, 0.012), [0, -0.011, -4e-3]),
              JOINT,
            ],
            [
              GEO.at(GEO.rbox(0.032, 0.022, 0.03, 6e-3), [0, -0.028, -0.064]),
              STEEL,
            ],
          ]);
          anchor(ankR, "foot" + side, [0, -0.04, 0.06]);
        }
        leg("L");
        leg("R");
        const waist = grp(pelvis, "waist", [0, 0.07, 0]);
        const plate = y =>
          loft(
            [
              [y, 0.114, 0.083, 2.8, 4e-3],
              [y + 4e-3, 0.119, 0.088, 2.8, 4e-3],
              [y + 0.02, 0.119, 0.088, 2.8, 4e-3],
              [y + 0.024, 0.114, 0.083, 2.8, 4e-3],
            ],
            { t0: 0.35, t1: PI - 0.35, seg: 40 }
          );
        seg(waist, [
          [
            loft([
              [0, 0.104, 0.078, 2.8],
              [0.05, 0.11, 0.082, 2.8],
              [0.104, 0.104, 0.078, 2.8],
            ]),
            DARK,
          ],
          [plate(0.012), SHELL2],
          [plate(0.04), SHELL2],
          [plate(0.068), SHELL2],
        ]);
        const LW = {
          mat: new THREE.MeshBasicMaterial({ color: 0 }),
          depth: 1,
          name: "waist",
        };
        waist.add(
          new THREE.Mesh(seam(0.098, 0.104, 0.078, 2.8, 0, 28e-4), LW.mat)
        );
        LEDS.push(LW);
        anchor(waist, "waistA", [0, 0.05, 0.1]);
        seg(waist, [
          [GEO.at(GEO.cyl(0.02, 0.02, 0.2, 12), [0, 0.06, -0.03]), RING2],
        ]);
        const torso = grp(waist, "torso", [0, 0.1, 0]);
        const CHEST = [
          [0.112, 0.138, 0.104, 3],
          [0.15, 0.162, 0.115, 3.2],
          [0.22, 0.19, 0.125, 3.4, 4e-3],
          [0.3, 0.205, 0.13, 3.6, 6e-3],
          [0.36, 0.21, 0.126, 3.6, 4e-3],
          [0.4, 0.196, 0.112, 3.3],
          [0.42, 0.168, 0.094, 2.9],
          [0.434, 0.11, 0.064, 2.5],
          [0.44, 0.04, 0.03, 2.3],
        ];
        seg(torso, [
          [loft(CHEST, { seg: 72 }), SHELL],
          [
            GEO.at(
              loft([
                [0, 0.12, 0.088, 2.8],
                [0.06, 0.128, 0.092, 2.9],
                [0.13, 0.13, 0.094, 2.9],
              ]),
              [0, 0, -4e-3]
            ),
            JOINT,
          ],
          [seam(0.19, 0.1785, 0.1215, 3.3, 2e-3), GAP],
          [GEO.at(GEO.rbox(4e-3, 0.09, 6e-3, 2e-3), [0, 0.392, 0.124]), GAP],
          [GEO.at(GEO.cyl(0.05, 0.056, 0.03, 40), [0, 0.43, 0]), JOINT],
          [
            GEO.at(
              GEO.torus(0.053, 24e-4, 6, 48).rotateX(PI / 2),
              [0, 0.418, 0]
            ),
            RING2,
          ],
        ]);
        {
          const bolts = [];
          for (const [bx, by] of [
            [-0.15, 0.36],
            [0.15, 0.36],
            [-0.13, 0.17],
            [0.13, 0.17],
          ])
            bolts.push(
              GEO.at(
                GEO.cyl(55e-4, 55e-4, 4e-3, 12),
                [bx, by, 0.128 - Math.abs(bx) * 0.12],
                [PI / 2, 0, 0]
              )
            );
          seg(torso, [[GEO.merge(bolts), STEEL]]);
        }
        const chest = grp(torso, "chest", [0, 0.28, 0]);
        seg(chest, [
          [GEO.at(GEO.rbox(0.2, 0.138, 0.03, 0.016), [0, 0, 0.116]), JOINT],
          [GEO.at(GEO.rbox(0.172, 0.11, 0.02, 0.01), [0, 0, 0.126]), DARK],
        ]);
        const rim2 = new THREE.Mesh(
          GEO.at(GEO.rbox(0.186, 0.124, 0.02, 0.013), [0, 0, 0.122]),
          CHEST_RIM
        );
        chest.add(rim2);
        const glassMat = MAT.glass(6982832, 0.14);
        glassMat.userData.noAO = true;
        const chestGlass = new THREE.Mesh(
          GEO.at(GEO.rbox(0.176, 0.114, 6e-3, 28e-4), [0, 0, 0.151]),
          glassMat
        );
        chest.add(chestGlass);
        const slot = anchor(chest, "slot", [0, 0, 0.141]);
        slot.rotation.x = PI / 2;
        slot.scale.setScalar(0.164);
        anchor(chest, "chestA", [0, 0, 0.155]);
        const pack = grp(torso, "pack", [0, 0.27, -0.142]);
        seg(pack, [
          [GEO.rbox(0.3, 0.25, 0.07, 0.03, 4), JOINT],
          [GEO.at(GEO.rbox(0.25, 0.19, 0.01, 0.01), [0, 0, -0.037]), DARK],
          [
            GEO.at(GEO.rbox(0.07, 0.03, 4e-3, 3e-3), [0.08, -0.08, -0.043]),
            RING2,
          ],
        ]);
        const bar = new THREE.Mesh(
          GEO.at(GEO.rbox(0.12, 0.012, 4e-3, 4e-3), [0, 0.07, -0.043]),
          PACK_BAR
        );
        pack.add(bar);
        anchor(pack, "pack", [0, 0, -0.05]);
        const upperG = loft([
          [-0.27, 0.034, 0.036, 2.3],
          [-0.24, 0.043, 0.045, 2.4],
          [-0.17, 0.05, 0.052, 2.4],
          [-0.09, 0.055, 0.057, 2.4, 2e-3],
          [-0.045, 0.051, 0.053, 2.4],
          [-0.02, 0.028, 0.03, 2.3],
        ]);
        const foreG = loft([
          [-0.25, 0.029, 0.031, 2.3],
          [-0.22, 0.034, 0.036, 2.4],
          [-0.15, 0.042, 0.044, 2.4],
          [-0.075, 0.048, 0.05, 2.5, 2e-3],
          [-0.025, 0.046, 0.048, 2.4],
          [0, 0.028, 0.03, 2.3],
        ]);
        const palmG = loft([
          [-0.102, 0.033, 0.04, 4.2],
          [-0.03, 0.036, 0.043, 4.4],
          [-0.012, 0.031, 0.034, 3.8],
        ]);
        const FING = [];
        function arm(side) {
          const s = side === "L" ? 1 : -1;
          const shP = grp(torso, "shP" + side, [s * 0.248, 0.37, 0]);
          drive(shP, 0.058, 0.08, s, 1, [s * 4e-3, 0, 0], "shoulder" + side);
          anchor(shP, "sh" + side, [s * 0.066, 0.01, 0.02]);
          const shR = grp(shP, "shR" + side);
          seg(shR, [
            [
              GEO.at(
                loft([
                  [-0.055, 0.05, 0.062, 2.8],
                  [-0.01, 0.058, 0.066, 3],
                  [0.03, 0.05, 0.058, 2.8],
                  [0.055, 0.028, 0.032, 2.5],
                  [0.064, 6e-3, 8e-3, 2.3],
                ]),
                [s * 0.036, 8e-3, 0],
                [0, 0, (-s * PI) / 2]
              ),
              SHELL,
            ],
          ]);
          const shY = grp(shR, "shY" + side);
          seg(shY, [
            [upperG, SHELL],
            [seam(-0.12, 0.0525, 0.0545, 2.4), GAP],
            [GEO.at(GEO.cyl(0.013, 0.013, 0.22, 12), [0, -0.13, 0]), RING2],
            [GEO.at(GEO.cyl(0.04, 0.04, 0.04, 32), [0, -0.035, 0]), JOINT],
          ]);
          const el = grp(shY, "el" + side, [0, -0.28, 0]);
          drive(el, 0.045, 0.086, s, 2, [0, 0, 0], "elbow" + side);
          anchor(el, "el" + side, [s * 0.05, 0, 0.02]);
          seg(el, [
            [foreG, SHELL],
            [seam(-0.19, 0.04, 0.042, 2.4), GAP],
            [GEO.at(GEO.cyl(0.013, 0.013, 0.22, 12), [0, -0.13, 0]), RING2],
          ]);
          const wrR = grp(el, "wrR" + side, [0, -0.255, 0]);
          seg(wrR, [
            [GEO.at(GEO.cyl(0.03, 0.03, 0.018, 32), [0, 4e-3, 0]), JOINT],
            [
              GEO.at(
                GEO.torus(0.03, 2e-3, 6, 40).rotateX(PI / 2),
                [0, -4e-3, 0]
              ),
              RING2,
            ],
          ]);
          const wrP = grp(wrR, "wrP" + side);
          drive(wrP, 0.029, 0.064, s, 3, [0, 0, 0], "wrist" + side);
          anchor(wrP, "wr" + side, [0, -0.02, 0.03]);
          const wrH = grp(wrP, "wrH" + side, [0, -0.012, 0]);
          seg(wrH, [
            [palmG, JOINT],
            [
              GEO.at(GEO.rbox(0.062, 0.05, 0.01, 5e-3), [0, -0.06, 0.042]),
              SHELL2,
            ],
            [
              GEO.at(GEO.rbox(0.062, 0.05, 0.01, 5e-3), [0, -0.06, -0.042]),
              SHELL2,
            ],
            [
              GEO.at(
                GEO.torus(0.034, 2e-3, 6, 40).rotateX(PI / 2),
                [0, -0.014, 0],
                [0, 0, 0],
                [1, 1, 1.15]
              ),
              RING2,
            ],
          ]);
          anchor(wrH, "hand" + side, [0, -0.12, 0]);
          anchor(wrH, "grip" + side, [0, -0.128, 0]);
          const fingers = [];
          for (const [fx2, fz, dir] of [
            [0.021, 0.042, 1],
            [-0.021, 0.042, 1],
            [0, -0.042, -1],
          ]) {
            const base = grp(wrH, null, [fx2, -0.1, fz]);
            seg(base, [
              [
                GEO.at(GEO.rbox(0.019, 0.046, 0.019, 7e-3), [0, -0.023, 0]),
                SHELL,
              ],
              [cylX(92e-4, 0.022, 20), DARK],
            ]);
            const tip = grp(base, null, [0, -0.047, 0]);
            seg(tip, [
              [
                GEO.at(GEO.rbox(0.017, 0.04, 0.017, 7e-3), [0, -0.02, 0]),
                SHELL,
              ],
              [
                GEO.at(GEO.rbox(0.0172, 0.024, 6e-3, 3e-3), [
                  0,
                  -0.025,
                  -dir * 92e-4,
                ]),
                RUB,
              ],
              [cylX(82e-4, 0.02, 20), DARK],
            ]);
            fingers.push({ base, tip, dir });
          }
          FING.push(fingers);
        }
        arm("L");
        arm("R");
        const neckY = grp(torso, "neckY", [0, 0.44, 0]);
        seg(neckY, [
          [GEO.at(GEO.cyl(0.036, 0.04, 0.06, 36), [0, 0.022, 0]), DARK],
        ]);
        const neckP = grp(neckY, "neckP", [0, 0.045, 0]);
        drive(neckP, 0.03, 0.07, 1, 1, [0, 0.012, 0], "neck");
        const head = grp(neckP, "head", [0, 0.014, 4e-3]);
        const HEAD = [
          [0, 0.032, 0.036, 2.3],
          [0.012, 0.06, 0.07, 2.4],
          [0.04, 0.079, 0.09, 2.5],
          [0.09, 0.086, 0.099, 2.6],
          [0.14, 0.087, 0.1, 2.6],
          [0.18, 0.08, 0.093, 2.5],
          [0.208, 0.064, 0.074, 2.4],
          [0.226, 0.038, 0.044, 2.3],
          [0.234, 8e-3, 0.01, 2.2],
        ];
        seg(head, [
          [loft(HEAD, { seg: 72 }), SHELL],
          [seam(0.2085, 0.0634, 0.0734, 2.4, 0, 18e-4), GAP],
          [
            GEO.at(
              GEO.cyl(0.026, 0.026, 0.018, 32),
              [0.081, 0.115, -0.012],
              [0, 0, PI / 2]
            ),
            JOINT,
          ],
          [
            GEO.at(
              GEO.cyl(0.026, 0.026, 0.018, 32),
              [-0.081, 0.115, -0.012],
              [0, 0, PI / 2]
            ),
            JOINT,
          ],
          [
            GEO.at(
              GEO.torus(0.022, 18e-4, 6, 32),
              [0.0905, 0.115, -0.012],
              [0, PI / 2, 0]
            ),
            RING2,
          ],
          [
            GEO.at(
              GEO.torus(0.022, 18e-4, 6, 32),
              [-0.0905, 0.115, -0.012],
              [0, PI / 2, 0]
            ),
            RING2,
          ],
        ]);
        const VISOR_L = HEAD.slice(1, 7).map(([y, w, d, n]) => [
          y + 4e-3,
          w * 1.035,
          d * 1.035,
          n,
          0,
        ]);
        seg(head, [
          [
            loft(VISOR_L, { t0: PI / 2 - 1.08, t1: PI / 2 + 1.08, seg: 48 }),
            VISOR,
          ],
        ]);
        const eyeGeos = [],
          lensGeos = [];
        const zAt = (x, y) => {
          let k = 0;
          while (k < VISOR_L.length - 2 && VISOR_L[k + 1][0] < y) k++;
          const a = VISOR_L[k],
            b = VISOR_L[k + 1],
            u = clamp((y - a[0]) / (b[0] - a[0]), 0, 1);
          const w = lerp(a[1], b[1], u),
            d = lerp(a[2], b[2], u),
            n = lerp(a[3], b[3], u);
          const c = clamp(Math.abs(x) / w, 0, 0.999);
          return d * Math.pow(1 - Math.pow(c, n), 1 / n);
        };
        for (const ex of [-0.028, 0.028]) {
          const z = zAt(ex, 0.128) + 8e-4;
          const ang = Math.atan2(ex, z) * 0.9;
          lensGeos.push(
            GEO.cyl(85e-4, 85e-4, 3e-3, 28)
              .rotateX(PI / 2)
              .rotateY(ang)
              .translate(ex, 0.128, z)
          );
          eyeGeos.push(
            GEO.cyl(34e-4, 34e-4, 35e-4, 20)
              .rotateX(PI / 2)
              .rotateY(ang)
              .translate(ex, 0.128, z + 6e-4)
          );
        }
        lensGeos.push(
          GEO.cyl(48e-4, 48e-4, 3e-3, 16)
            .rotateX(PI / 2)
            .translate(0, 0.146, zAt(0, 0.146) + 8e-4)
        );
        seg(head, [[GEO.merge(lensGeos), MAT.gloss(329483)]]);
        head.add(new THREE.Mesh(GEO.merge(eyeGeos), EYE));
        head.add(
          new THREE.Mesh(
            loft(
              [
                [0.1745, 0.0811 * 1.04, 0.0941 * 1.04, 2.5],
                [0.1765, 0.0811 * 1.04, 0.0941 * 1.04, 2.5],
              ],
              { t0: PI / 2 - 0.55, t1: PI / 2 + 0.55, seg: 32 }
            ),
            BROW
          )
        );
        anchor(head, "headA", [0, 0.13, 0.11]);
        anchor(head, "eyes", [0, 0.128, 0.1]);
        const crown = grp(head, "crown", [0, 0.2, -4e-3]);
        seg(crown, [
          [GEO.at(GEO.cyl(0.054, 0.058, 0.018, 56), [0, 9e-3, 0]), JOINT],
          [GEO.at(GEO.cyl(0.0555, 0.0555, 0.011, 56), [0, 0.0235, 0]), VISOR],
          [GEO.at(GEO.cyl(0.046, 0.054, 0.012, 56), [0, 0.035, 0]), JOINT],
          [
            GEO.at(
              GEO.torus(0.054, 16e-4, 6, 56).rotateX(PI / 2),
              [0, 0.0175, 0]
            ),
            RING2,
          ],
        ]);
        const scanArc = new THREE.Mesh(
          GEO.at(
            new THREE.CylinderGeometry(
              0.0562,
              0.0562,
              4e-3,
              16,
              1,
              true,
              0,
              0.5
            ),
            [0, 0.0235, 0]
          ),
          SCAN
        );
        crown.add(scanArc);
        anchor(crown, "lidar", [0, 0.024, 0]);
        const FLY = [
          ["hipYawL", [0.4, -0.06, 0.14], 0],
          ["hipYawR", [-0.4, -0.06, 0.14], 0.05],
          ["waist", [0, 0.32, 0], 0.18],
          ["shPL", [0.46, 0.16, 0.06], 0.32],
          ["shPR", [-0.46, 0.16, 0.06], 0.38],
          ["neckY", [0, 0.42, 0.08], 0.5],
          ["pack", [0, 0.05, -0.5], 0.6],
          ["chest", [0, 0.06, 0.45], 0.66],
        ].map(([n, off, delay]) => ({
          g: J[n],
          home: J[n].position.clone(),
          off: new THREE.Vector3(...off),
          delay,
          spin: (delay * 7.3) % 1 > 0.5 ? 1 : -1,
        }));
        function assemble(a) {
          for (const f of FLY) {
            const e = easeInOut(clamp01((a - f.delay * 0.55) / 0.45));
            f.g.position.copy(f.home).addScaledVector(f.off, 1 - e);
            f.g.userData.flyTwist = (1 - e) * 0.9 * f.spin;
          }
        }
        const L1 = 0.42,
          L2 = 0.4,
          ANK_H = 0.075,
          HIP_DX = 0.095,
          HIP_DY = -0.065;
        const AL1 = 0.28,
          AL2 = 0.255,
          GRIP = 0.14;
        const pose = {
          px: 0,
          py: 0.96,
          pz: 0,
          pyaw: 0,
          ppitch: 0,
          proll: 0,
          waist: 0,
          torsoP: 0,
          hipY: [0, 0],
          hipR: [0, 0],
          hipP: [0, 0],
          knee: [0, 0],
          ankP: [0, 0],
          ankR: [0, 0],
          shP: [0, 0],
          shR: [0, 0],
          shY: [0, 0],
          el: [0, 0],
          wrR: [0, 0],
          wrP: [0, 0],
          wrH: [0, 0],
          curl: [0.2, 0.2],
          neckY: 0,
          neckP: 0,
        };
        const KEYS = Object.keys(pose);
        const copyPose = (src, dst) => {
          for (const k of KEYS) {
            if (Array.isArray(src[k])) {
              dst[k][0] = src[k][0];
              dst[k][1] = src[k][1];
            } else dst[k] = src[k];
          }
          return dst;
        };
        const mkPose = () => copyPose(pose, JSON.parse(JSON.stringify(pose)));
        const mixPose = (a, b, u, out) => {
          for (const k of KEYS) {
            if (Array.isArray(a[k])) {
              out[k][0] = lerp(a[k][0], b[k][0], u);
              out[k][1] = lerp(a[k][1], b[k][1], u);
            } else out[k] = lerp(a[k], b[k], u);
          }
          return out;
        };
        const ARM = ["shP", "shR", "shY", "el", "wrR", "wrP", "wrH", "curl"];
        const mixArm = (i, a, b, u, out) => {
          for (const k of ARM) out[k][i] = lerp(a[k][i], b[k][i], u);
        };
        function legIK(i, dx, dy, dz, P2) {
          const roll = Math.atan2(dx, -dy);
          const Yp = Math.hypot(dy, dx);
          const D = Math.min(Math.hypot(Yp, dz), L1 + L2 - 1e-4);
          const g = Math.atan2(-dz, Yp);
          const al = Math.acos(
            clamp((L1 * L1 + D * D - L2 * L2) / (2 * L1 * D), -1, 1)
          );
          const a1 = g - al;
          const kz = -L1 * Math.sin(a1),
            ky = L1 * Math.cos(a1);
          const a2 = Math.atan2(kz - dz, Yp - ky);
          P2.hipR[i] = roll;
          P2.hipP[i] = a1;
          P2.knee[i] = a2 - a1;
          P2.ankP[i] = -a2;
          P2.ankR[i] = -roll;
        }
        const _pm = new THREE.Matrix4(),
          _pmi = new THREE.Matrix4(),
          _pe = new THREE.Euler(),
          _hip = new THREE.Vector3(),
          _dl = new THREE.Vector3(),
          _tv = new THREE.Vector3();
        function plantFeet(P2, fL, fR) {
          _pm.makeRotationFromEuler(_pe.set(P2.ppitch, P2.pyaw, P2.proll));
          _pmi.copy(_pm).transpose();
          for (let i = 0; i < 2; i++) {
            const s = i === 0 ? 1 : -1;
            _hip
              .set(s * HIP_DX, HIP_DY, 0)
              .applyMatrix4(_pm)
              .add(_tv.set(P2.px, P2.py, P2.pz));
            _dl
              .copy(i === 0 ? fL : fR)
              .sub(_hip)
              .applyMatrix4(_pmi);
            P2.hipY[i] = -P2.pyaw;
            const c = Math.cos(P2.pyaw),
              sn = Math.sin(P2.pyaw),
              x = _dl.x,
              z = _dl.z;
            _dl.x = x * c + z * sn;
            _dl.z = -x * sn + z * c;
            legIK(i, _dl.x, _dl.y, _dl.z, P2);
            P2.ankP[i] -= P2.ppitch;
            P2.ankR[i] -= P2.proll;
          }
        }
        const FOOT_L = new THREE.Vector3(HIP_DX + 8e-3, ANK_H, 0),
          FOOT_R = new THREE.Vector3(-HIP_DX - 8e-3, ANK_H, 0);
        const SHP = [
          new THREE.Vector3(0.248, 0.37, 0),
          new THREE.Vector3(-0.248, 0.37, 0),
        ];
        const _n = new THREE.Vector3(),
          _u = new THREE.Vector3(),
          _e = new THREE.Vector3(),
          _ud = new THREE.Vector3(),
          _fd = new THREE.Vector3(),
          _w = new THREE.Vector3();
        function armIK(i, W, pole, P2) {
          const S2 = SHP[i];
          _n.subVectors(W, S2);
          const d = clamp(_n.length(), 0.08, AL1 + AL2 - 1e-4);
          _n.normalize();
          const x = (AL1 * AL1 - AL2 * AL2 + d * d) / (2 * d),
            r = Math.sqrt(Math.max(0, AL1 * AL1 - x * x));
          _u.copy(pole).addScaledVector(_n, -pole.dot(_n));
          if (_u.lengthSq() < 1e-8) _u.set(0, -1, 0).addScaledVector(_n, _n.y);
          _u.normalize();
          _e.copy(S2).addScaledVector(_n, x).addScaledVector(_u, r);
          _w.copy(S2).addScaledVector(_n, d);
          _ud.subVectors(_e, S2).normalize();
          _fd.subVectors(_w, _e).normalize();
          const rr = Math.asin(clamp(_ud.x, -1, 1));
          const pp = Math.atan2(-_ud.z, -_ud.y);
          const cp = Math.cos(pp),
            sp = Math.sin(pp),
            cr = Math.cos(rr),
            sr2 = Math.sin(rr);
          const ax = _fd.x,
            ay = _fd.y * cp + _fd.z * sp,
            az = -_fd.y * sp + _fd.z * cp;
          const th = Math.acos(clamp(_ud.dot(_fd), -1, 1));
          P2.shP[i] = pp;
          P2.shR[i] = rr;
          P2.shY[i] = th > 1e-3 ? Math.atan2(ax * cr + ay * sr2, az) : 0;
          P2.el[i] = -th;
        }
        const _m = new THREE.Matrix4(),
          _mi = new THREE.Matrix4(),
          _mx = new THREE.Matrix4(),
          _hv = new THREE.Vector3(),
          _kv = new THREE.Vector3();
        function wristAim(i, h, k, P2) {
          _m.makeRotationX(P2.shP[i])
            .multiply(_mx.makeRotationZ(P2.shR[i]))
            .multiply(_mx.makeRotationY(P2.shY[i]))
            .multiply(_mx.makeRotationX(P2.el[i]));
          _hv.copy(h).applyMatrix4(_mi.copy(_m).transpose());
          let wp2 = Math.acos(clamp(-_hv.y, -1, 1)),
            wr = 0;
          if (Math.sin(wp2) > 1e-3) wr = Math.atan2(-_hv.x, -_hv.z);
          if (wr > PI / 2) {
            wr -= PI;
            wp2 = -wp2;
          } else if (wr < -PI / 2) {
            wr += PI;
            wp2 = -wp2;
          }
          wp2 = clamp(wp2, -1.5, 1.5);
          P2.wrR[i] = wr;
          P2.wrP[i] = wp2;
          _m.multiply(_mx.makeRotationY(wr)).multiply(_mx.makeRotationX(wp2));
          _kv.copy(k).applyMatrix4(_mi.copy(_m).transpose());
          let wh = Math.atan2(_kv.x, _kv.z);
          if (wh > PI / 2) wh -= PI;
          else if (wh < -PI / 2) wh += PI;
          P2.wrH[i] = wh;
        }
        const IDLE = mkPose();
        IDLE.py = 0.952;
        IDLE.shR = [0.12, -0.12];
        IDLE.shP = [0.05, 0.05];
        IDLE.shY = [0.12, -0.12];
        IDLE.el = [-0.32, -0.32];
        IDLE.wrP = [0.08, 0.08];
        IDLE.wrH = [0.5, -0.5];
        IDLE.curl = [0.32, 0.32];
        plantFeet(IDLE, FOOT_L, FOOT_R);
        const DORMANT = mkPose();
        DORMANT.py = 0.86;
        DORMANT.torsoP = 0.3;
        DORMANT.shR = [0.05, -0.05];
        DORMANT.shP = [-0.26, -0.26];
        DORMANT.el = [-0.16, -0.16];
        DORMANT.wrH = [0.5, -0.5];
        DORMANT.curl = [0.55, 0.55];
        DORMANT.neckP = 0.62;
        plantFeet(DORMANT, FOOT_L, FOOT_R);
        const P = mkPose(),
          Q = mkPose();
        function applyPose(P2) {
          pelvis.position.set(P2.px, P2.py, P2.pz);
          pelvis.rotation.set(P2.ppitch, P2.pyaw, P2.proll);
          J.waist.rotation.set(0, P2.waist, 0);
          J.torso.rotation.set(P2.torsoP, 0, 0);
          for (let i = 0; i < 2; i++) {
            const s = i === 0 ? "L" : "R";
            J["hipYaw" + s].rotation.y = P2.hipY[i];
            J["hipRoll" + s].rotation.z = P2.hipR[i];
            J["hipPitch" + s].rotation.x = P2.hipP[i];
            J["knee" + s].rotation.x = P2.knee[i];
            J["ankP" + s].rotation.x = P2.ankP[i];
            J["ankR" + s].rotation.z = P2.ankR[i];
            J["shP" + s].rotation.x = P2.shP[i];
            J["shR" + s].rotation.z = P2.shR[i];
            J["shY" + s].rotation.y = P2.shY[i];
            J["el" + s].rotation.x = P2.el[i];
            J["wrR" + s].rotation.y = P2.wrR[i];
            J["wrP" + s].rotation.x = P2.wrP[i];
            J["wrH" + s].rotation.y = P2.wrH[i];
            for (const f of FING[i]) {
              f.base.rotation.x = f.dir * P2.curl[i] * 0.85;
              f.tip.rotation.x = f.dir * P2.curl[i] * 1.05;
            }
          }
          J.neckY.rotation.y = P2.neckY;
          J.neckP.rotation.x = P2.neckP;
          for (const f of FLY)
            if (f.g.userData.flyTwist) f.g.rotation.z = f.g.userData.flyTwist;
            else if (f.g.rotation.z) f.g.rotation.z = 0;
        }
        function idleLife(P2, time, k) {
          const w = Math.sin(time * 0.55);
          P2.px += 7e-3 * w;
          P2.proll += -0.012 * w;
          P2.torsoP += 6e-3 * Math.sin(time * 1.3);
          P2.shP[0] += 0.02 * Math.sin(time * 1.3 + 0.4);
          P2.shP[1] += 0.02 * Math.sin(time * 1.3 + 0.9);
          P2.neckY += 0.05 * Math.sin(time * 0.31) * (k >= 5 ? 1.6 : 1);
        }
        const W0 = Z_BACK / RS,
          W1 = Z_FRONT / RS,
          NSTEP = 5,
          SL = (W1 - W0) / (NSTEP - 1);
        const steps = [];
        {
          let zL = W0,
            zR = W0;
          for (let i = 0; i < NSTEP; i++) {
            const R = i % 2 === 0;
            const from = R ? zR : zL,
              other = R ? zL : zR;
            const to = i === NSTEP - 1 ? other : W0 + SL * (i + 1);
            steps.push({ R, from, to, zL0: zL, zR0: zR });
            if (R) zR = to;
            else zL = to;
          }
        }
        const WALK_H = 0.922;
        const smoother = t => t * t * t * (t * (t * 6 - 15) + 10);
        const lift = [0, 0];
        function walkZ(u) {
          const x = clamp(u, 0, 1) * NSTEP,
            i = Math.min(NSTEP - 1, Math.floor(x)),
            f = x - i;
          const st = steps[i];
          const midA = (st.zL0 + st.zR0) / 2,
            midB = st.R ? (st.zL0 + st.to) / 2 : (st.to + st.zR0) / 2;
          return lerp(midA, midB, smooth(f));
        }
        const _fL = new THREE.Vector3(),
          _fR = new THREE.Vector3();
        function walkPose(u, P2) {
          copyPose(IDLE, P2);
          const x = clamp(u, 0, 1) * NSTEP,
            i = Math.min(NSTEP - 1, Math.floor(x)),
            f = x - i;
          const st = steps[i];
          let zL = st.zL0,
            zR = st.zR0;
          const fs = clamp((f - 0.1) / 0.8, 0, 1),
            e = smoother(fs);
          const edge = i === 0 || i === NSTEP - 1 ? 0.8 : 1;
          const zSw = lerp(st.from, st.to, e),
            up2 = 0.07 * Math.sin(PI * fs) * edge;
          if (st.R) zR = zSw;
          else zL = zSw;
          lift[0] = st.R ? 0 : up2;
          lift[1] = st.R ? up2 : 0;
          const ramp = Math.min(1, x * 1.6, (NSTEP - x) * 1.6);
          const side = st.R ? 1 : -1;
          const pz = walkZ(u);
          P2.pz = 0;
          P2.px = side * 0.034 * Math.sin(PI * f) * ramp;
          P2.py = lerp(IDLE.py, WALK_H, ramp) - 9e-3 * Math.sin(PI * fs) * ramp;
          P2.pyaw = -side * 0.055 * Math.sin(PI * f) * ramp;
          P2.proll = -side * 0.022 * Math.sin(PI * fs) * ramp;
          P2.ppitch = 0.035 * ramp;
          P2.waist = -P2.pyaw * 1.5;
          P2.torsoP = 0.035 * ramp;
          _fL.set(HIP_DX + 6e-3, ANK_H + lift[0], zL - pz);
          _fR.set(-HIP_DX - 6e-3, ANK_H + lift[1], zR - pz);
          plantFeet(P2, _fL, _fR);
          const roll =
            (0.32 * (1 - smooth(clamp(fs / 0.3, 0, 1))) -
              0.24 * smooth(clamp((fs - 0.62) / 0.34, 0, 1))) *
            (fs > 0 && fs < 1 ? 1 : 0) *
            edge;
          P2.ankP[st.R ? 1 : 0] += roll * ramp;
          const swL = clamp((zR - pz) / (SL * 0.5), -1.2, 1.2),
            swR = clamp((zL - pz) / (SL * 0.5), -1.2, 1.2);
          P2.shP[0] = IDLE.shP[0] - 0.34 * swL * ramp;
          P2.shP[1] = IDLE.shP[1] - 0.34 * swR * ramp;
          P2.el[0] = IDLE.el[0] - (0.14 + 0.16 * Math.max(0, swL)) * ramp;
          P2.el[1] = IDLE.el[1] - (0.14 + 0.16 * Math.max(0, swR)) * ramp;
          P2.neckP = 0.06 * ramp - P2.torsoP * 0.8;
          P2.neckY = -P2.waist * 0.6;
          return pz;
        }
        const props = new THREE.Group();
        stage2.add(props);
        const STAND_H = 1.27;
        const standGeo = GEO.merge([
          GEO.at(GEO.cyl(0.16, 0.2, 0.03, 48), [0, 0.015, 0]),
          GEO.at(GEO.cyl(0.022, 0.022, STAND_H - 0.03, 24), [
            0,
            STAND_H / 2,
            0,
          ]),
          GEO.at(GEO.cyl(0.11, 0.11, 0.022, 48), [0, STAND_H - 0.011, 0]),
        ]);
        const pickPos = new THREE.Vector3(-0.42, 0, Z_FRONT + 0.52),
          trayPos = new THREE.Vector3(-0.04, 0, Z_FRONT + 0.56);
        for (const p of [pickPos, trayPos]) {
          const m = new THREE.Mesh(standGeo, MAT.plastic(1711911, 0.6));
          m.position.copy(p);
          m.castShadow = m.receiveShadow = true;
          props.add(m);
        }
        const tray = new THREE.Mesh(
          GEO.at(
            GEO.lathe(
              [
                [0, 0],
                [0.09, 0],
                [0.1, 8e-3],
                [0.1, 0.035],
                [0.092, 0.035],
                [0.088, 0.01],
                [0, 0.01],
              ],
              48
            ),
            [trayPos.x, STAND_H, trayPos.z]
          ),
          MAT.plastic(1185308, 0.4)
        );
        tray.castShadow = tray.receiveShadow = true;
        props.add(tray);
        const part = new THREE.Group();
        seg(part, [
          [
            GEO.at(GEO.cyl(0.042, 0.046, 0.07, 40), [0, 0.035, 0]),
            MAT.anod(2765376, 0.35),
          ],
          [GEO.at(GEO.cyl(0.036, 0.036, 0.012, 40), [0, 0.076, 0]), VISOR],
        ]);
        const partRing = new THREE.Mesh(
          GEO.at(GEO.torus(0.043, 3e-3, 6, 48).rotateX(PI / 2), [0, 0.05, 0]),
          MAT.led(2282478, 2.2)
        );
        part.add(partRing);
        stage2.add(part);
        const PART_HOME = new THREE.Vector3(pickPos.x, STAND_H, pickPos.z),
          PART_TRAY = new THREE.Vector3(trayPos.x, STAND_H + 0.011, trayPos.z);
        const WEB = [
          ["chestA", "headA", "lidar"],
          ["chestA", "shL", "elL", "wrL", "handL"],
          ["chestA", "shR", "elR", "wrR", "handR"],
          ["chestA", "waistA", "pelvisA", "hipL", "kneeL", "actL", "footL"],
          ["chestA", "waistA", "pelvisA", "hipR", "kneeR", "actR", "footR"],
          ["chestA", "pack"],
        ];
        const nSegs = WEB.reduce((n, p) => n + p.length - 1, 0);
        const webPos = new Float32Array(nSegs * 6),
          webCol = new Float32Array(nSegs * 6);
        const webGeo = new THREE.BufferGeometry();
        webGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(webPos, 3).setUsage(THREE.DynamicDrawUsage)
        );
        webGeo.setAttribute(
          "color",
          new THREE.BufferAttribute(webCol, 3).setUsage(THREE.DynamicDrawUsage)
        );
        const webMat = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: 1,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          depthWrite: false,
          toneMapped: false,
        });
        const web = new THREE.LineSegments(webGeo, webMat);
        web.frustumCulled = false;
        web.renderOrder = 6;
        const PK = 5,
          nPk = WEB.length * PK;
        const pkPos = new Float32Array(nPk * 3),
          pkCol = new Float32Array(nPk * 3);
        const pkGeo = new THREE.BufferGeometry();
        pkGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(pkPos, 3).setUsage(THREE.DynamicDrawUsage)
        );
        pkGeo.setAttribute(
          "color",
          new THREE.BufferAttribute(pkCol, 3).setUsage(THREE.DynamicDrawUsage)
        );
        const dotTex = canvasTex(64, 64, (g, w, h) => {
          const gr = g.createRadialGradient(
            w / 2,
            h / 2,
            0,
            w / 2,
            h / 2,
            w / 2
          );
          gr.addColorStop(0, "rgba(255,255,255,1)");
          gr.addColorStop(0.35, "rgba(255,255,255,0.6)");
          gr.addColorStop(1, "rgba(255,255,255,0)");
          g.fillStyle = gr;
          g.fillRect(0, 0, w, h);
        });
        const pkMat = new THREE.PointsMaterial({
          size: 0.075,
          map: dotTex,
          vertexColors: true,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          depthWrite: false,
          sizeAttenuation: true,
          toneMapped: false,
        });
        const packets = new THREE.Points(pkGeo, pkMat);
        packets.frustumCulled = false;
        packets.renderOrder = 7;
        const fxRoot = new THREE.Group();
        fxRoot.add(web, packets);
        fx(fxRoot);
        const wp = {};
        const tmp = new THREE.Vector3(),
          tmp2 = new THREE.Vector3();
        function updateWeb(time, inten2, col, flowOn) {
          for (const n in A)
            A[n].getWorldPosition(wp[n] || (wp[n] = new THREE.Vector3()));
          let o2 = 0;
          WEB.forEach((path, pi) => {
            const k = inten2[pi];
            for (let s = 0; s < path.length - 1; s++) {
              const a = wp[path[s]],
                b = wp[path[s + 1]];
              webPos.set([a.x, a.y, a.z, b.x, b.y, b.z], o2);
              for (let v = 0; v < 2; v++)
                webCol.set(
                  [col.r * k * 0.55, col.g * k * 0.55, col.b * k * 0.55],
                  o2 + v * 3
                );
              o2 += 6;
            }
            let len = 0;
            const segL = [];
            for (let s = 0; s < path.length - 1; s++) {
              const l = wp[path[s]].distanceTo(wp[path[s + 1]]);
              segL.push(l);
              len += l;
            }
            for (let q = 0; q < PK; q++) {
              const u =
                ((time * 0.55 * (flowOn ? 1 : 0) + q / PK + pi * 0.13) % 1) *
                len;
              let acc = 0,
                s = 0;
              while (s < segL.length - 1 && acc + segL[s] < u) acc += segL[s++];
              const f = segL[s] > 0 ? (u - acc) / segL[s] : 0;
              tmp.lerpVectors(wp[path[s]], wp[path[s + 1]], clamp(f, 0, 1));
              const idx = (pi * PK + q) * 3;
              pkPos[idx] = tmp.x;
              pkPos[idx + 1] = tmp.y;
              pkPos[idx + 2] = tmp.z;
              const kk = k * (flowOn ? 1.4 : 0);
              pkCol[idx] = col.r * kk;
              pkCol[idx + 1] = col.g * kk;
              pkCol[idx + 2] = col.b * kk;
            }
          });
          webGeo.attributes.position.needsUpdate = true;
          webGeo.attributes.color.needsUpdate = true;
          pkGeo.attributes.position.needsUpdate = true;
          pkGeo.attributes.color.needsUpdate = true;
        }
        const frGeo = new THREE.BufferGeometry();
        const FR = { n: 0.03, f: 1.55, w: 0.62, h: 0.42 };
        {
          const c = [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
          ].map(([x, y]) => [x * FR.w, y * FR.h, FR.f]);
          const pts = [];
          for (const q of c) pts.push(0, 0, 0, q[0], q[1], q[2]);
          for (let i = 0; i < 4; i++) {
            const a = c[i],
              b = c[(i + 1) % 4];
            pts.push(a[0], a[1], a[2], b[0], b[1], b[2]);
          }
          frGeo.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(pts, 3)
          );
        }
        const frMat = new THREE.LineBasicMaterial({
          color: HDR(2282478, 1.2),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
        });
        const frustum = new THREE.LineSegments(frGeo, frMat);
        const depthMat = new THREE.ShaderMaterial({
          uniforms: { uO: { value: 0 }, uT: { value: 0 } },
          vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
          fragmentShader: `uniform float uO; uniform float uT; varying vec2 vUv;
          void main(){ vec2 g = abs(fract(vUv * vec2(16.0, 11.0)) - 0.5); float line = smoothstep(0.46, 0.5, max(g.x, g.y));
            float edge = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x) * smoothstep(0.0, 0.06, vUv.y) * smoothstep(1.0, 0.94, vUv.y);
            vec3 c = mix(vec3(0.13, 0.83, 0.93), vec3(0.65, 0.55, 0.98), vUv.y); float a = (0.12 + 0.7 * line) * edge * uO; gl_FragColor = vec4(c * a * 1.6, a); }`,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        });
        const depthPlane = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 2),
          depthMat
        );
        const vision = new THREE.Group(),
          _vis = new THREE.Vector3();
        vision.add(frustum, depthPlane);
        vision.position.set(0, 0.128, 0.1);
        vision.rotation.x = 0.36;
        head.add(vision);
        vision.visible = false;
        fx(vision);
        const ELEV = [-3, -5.5, -8, -10.5, -13, -16, -20, -25, -31].map(
          d => (d * PI) / 180
        );
        const NAZ = 900;
        let cloud = null,
          beams = null;
        function buildCloud(origin, solids) {
          const pos = [],
            az = [],
            dist = [];
          const dir = new THREE.Vector3(),
            ray = new THREE.Ray(),
            hit = new THREE.Vector3();
          for (let ia = 0; ia < NAZ; ia++) {
            const a = (ia / NAZ) * PI * 2 + 7e-4 * ia;
            for (const el of ELEV) {
              dir.set(
                Math.cos(a) * Math.cos(el),
                Math.sin(el),
                Math.sin(a) * Math.cos(el)
              );
              ray.set(origin, dir);
              let best = 40;
              if (dir.y < 0) {
                const tF = origin.y / -dir.y;
                if (tF < best) best = tF;
                const tH = (origin.y - HUB_TOP) / -dir.y;
                const hx = origin.x + dir.x * tH,
                  hz = origin.z + dir.z * tH;
                if (
                  Math.hypot(hx, hz) < 1.9 &&
                  Math.hypot(hx - o.robotXZ.x, hz - o.robotXZ.z) > 0.45 &&
                  tH < best
                )
                  best = tH;
              }
              for (const s of solids) {
                if (s.box) {
                  if (ray.intersectBox(s.box, hit)) {
                    const t = hit.distanceTo(origin);
                    if (t < best) best = t;
                  }
                } else {
                  const ox = origin.x - s.cx,
                    oz = origin.z - s.cz;
                  const A2 = dir.x * dir.x + dir.z * dir.z,
                    B2 = 2 * (ox * dir.x + oz * dir.z),
                    C2 = ox * ox + oz * oz - s.r * s.r;
                  const disc = B2 * B2 - 4 * A2 * C2;
                  if (disc > 0) {
                    const t = (-B2 - Math.sqrt(disc)) / (2 * A2);
                    const y = origin.y + dir.y * t;
                    if (t > 0 && y >= 0 && y <= s.h && t < best) best = t;
                  }
                  if (dir.y < 0) {
                    const t = (origin.y - s.h) / -dir.y,
                      x = origin.x + dir.x * t - s.cx,
                      z = origin.z + dir.z * t - s.cz;
                    if (x * x + z * z < s.r * s.r * 0.96 && t < best) best = t;
                  }
                }
              }
              if (best >= 40) continue;
              pos.push(
                origin.x + dir.x * best,
                origin.y + dir.y * best + 4e-3,
                origin.z + dir.z * best
              );
              az.push(a);
              dist.push(best);
            }
          }
          const g = new THREE.BufferGeometry();
          g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
          g.setAttribute("aAz", new THREE.Float32BufferAttribute(az, 1));
          g.setAttribute("aD", new THREE.Float32BufferAttribute(dist, 1));
          const m = new THREE.ShaderMaterial({
            uniforms: {
              uScan: { value: 0 },
              uO: { value: 0 },
              uPx: { value: renderer.getPixelRatio() },
            },
            vertexShader: `attribute float aAz; attribute float aD; uniform float uScan; uniform float uPx; varying float vA; varying float vD;
            void main(){ float age = uScan - aAz; vA = age < 0.0 ? -1.0 : mod(age, 6.2831853); vD = aD; vec4 mv = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = clamp(uPx * 26.0 / max(0.8, -mv.z), 1.0, 5.0); gl_Position = projectionMatrix * mv; }`,
            fragmentShader: `uniform float uO; varying float vA; varying float vD;
            void main(){ if (vA < 0.0) discard; vec2 c = gl_PointCoord - 0.5; if (dot(c, c) > 0.25) discard; float fresh = exp(-vA * 2.2);
              vec3 col = mix(vec3(0.2, 0.83, 0.6), vec3(0.65, 0.55, 0.98), smoothstep(3.0, 16.0, vD)); col = mix(col, vec3(0.85, 1.0, 0.95), fresh * 0.6);
              gl_FragColor = vec4(col * (0.75 + 2.2 * fresh), uO); }`,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          });
          cloud = new THREE.Points(g, m);
          cloud.frustumCulled = false;
          cloud.visible = false;
          fx(cloud);
          const bg = new THREE.BufferGeometry();
          bg.setAttribute(
            "position",
            new THREE.BufferAttribute(
              new Float32Array(ELEV.length * 6),
              3
            ).setUsage(THREE.DynamicDrawUsage)
          );
          beams = new THREE.LineSegments(
            bg,
            new THREE.LineBasicMaterial({
              color: HDR(6220500, 1.6),
              transparent: true,
              opacity: 0,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
              toneMapped: false,
            })
          );
          beams.frustumCulled = false;
          beams.visible = false;
          fx(beams);
          return [cloud, beams];
        }
        function aimBeams(origin, a) {
          const arr = beams.geometry.attributes.position.array;
          ELEV.forEach((el, i) => {
            const L = el < -0.01 ? Math.min(30, origin.y / Math.tan(-el)) : 30;
            arr.set(
              [
                origin.x,
                origin.y,
                origin.z,
                origin.x + Math.cos(a) * L,
                origin.y - Math.tan(-el) * L,
                origin.z + Math.sin(a) * L,
              ],
              i * 6
            );
          });
          beams.geometry.attributes.position.needsUpdate = true;
        }
        const supMat = new THREE.LineBasicMaterial({
          color: HDR(3462041, 1.4),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
        });
        const supGeo = new THREE.BufferGeometry();
        supGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(9 * 3), 3).setUsage(
            THREE.DynamicDrawUsage
          )
        );
        const support = new THREE.LineLoop(supGeo, supMat);
        support.frustumCulled = false;
        const comMat = new THREE.MeshBasicMaterial({
          color: HDR(16498468, 2.2),
          transparent: true,
          opacity: 0,
          depthWrite: false,
          toneMapped: false,
        });
        const com = new THREE.Mesh(
          GEO.torus(0.05, 6e-3, 6, 40).rotateX(PI / 2),
          comMat
        );
        const comLineGeo = new THREE.BufferGeometry();
        comLineGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(6), 3).setUsage(
            THREE.DynamicDrawUsage
          )
        );
        const comLine = new THREE.LineSegments(
          comLineGeo,
          new THREE.LineDashedMaterial({
            color: HDR(16498468, 1.4),
            dashSize: 0.05,
            gapSize: 0.035,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            toneMapped: false,
          })
        );
        comLine.frustumCulled = false;
        const walkFx = new THREE.Group();
        walkFx.add(support, com, comLine);
        fx(walkFx);
        const cornerW = 0.052,
          cornerB = -0.075,
          cornerF = 0.178;
        const hullPts = [];
        for (let i = 0; i < 8; i++) hullPts.push(new THREE.Vector3());
        function hull2D(pts, n) {
          let l = 0;
          for (let i = 1; i < n; i++) if (pts[i].x < pts[l].x) l = i;
          const out = [];
          let p = l;
          do {
            out.push(p);
            let q = (p + 1) % n;
            for (let i = 0; i < n; i++) {
              const cr =
                (pts[q].x - pts[p].x) * (pts[i].z - pts[p].z) -
                (pts[q].z - pts[p].z) * (pts[i].x - pts[p].x);
              if (cr < 0) q = i;
            }
            p = q;
          } while (p !== l && out.length < n);
          return out;
        }
        const pulseMat = new THREE.MeshBasicMaterial({
          color: HDR(15680580, 2.4),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
          side: THREE.DoubleSide,
        });
        const pulse = new THREE.Mesh(
          new THREE.RingGeometry(0.96, 1, 96).rotateX(-PI / 2),
          pulseMat
        );
        const otaMat = new THREE.MeshBasicMaterial({
          color: HDR(3462041, 3),
          transparent: true,
          opacity: 0,
          depthWrite: false,
          toneMapped: false,
        });
        const ota = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.06, 0),
          otaMat
        );
        const otaTrailGeo = new THREE.BufferGeometry();
        otaTrailGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(new Float32Array(6), 3).setUsage(
            THREE.DynamicDrawUsage
          )
        );
        const otaTrail = new THREE.LineSegments(
          otaTrailGeo,
          new THREE.LineBasicMaterial({
            color: HDR(3462041, 1.6),
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            toneMapped: false,
          })
        );
        otaTrail.frustumCulled = false;
        const safeFx = new THREE.Group();
        safeFx.add(pulse, ota, otaTrail);
        fx(safeFx);
        const footShadowMat = new THREE.MeshBasicMaterial({
          map: o.contactTex,
          transparent: true,
          depthWrite: false,
          toneMapped: false,
          opacity: 0.85,
        });
        const footShadows = [0, 1].map(() => {
          const m = new THREE.Mesh(
            new THREE.PlaneGeometry(0.34, 0.5).rotateX(-PI / 2),
            footShadowMat
          );
          stage2.add(m);
          return m;
        });
        root2.traverse(c => {
          if (
            c.isMesh &&
            c.material !== EYE &&
            c.material !== BROW &&
            !LEDS.some(l => l.mat === c.material) &&
            c.material !== CHEST_RIM &&
            c.material !== PACK_BAR &&
            c.material !== SCAN
          ) {
            c.castShadow = true;
            c.receiveShadow = true;
          }
        });
        const hd = (x, y, z) => new THREE.Vector3(x, y, z).normalize();
        const up = y => new THREE.Vector3(0, y, 0);
        const GRIP_AT = new THREE.Vector3(
          PART_HOME.x,
          PART_HOME.y + 0.035,
          PART_HOME.z
        );
        const TRAY_AT = new THREE.Vector3(
          PART_TRAY.x,
          PART_TRAY.y + 0.035,
          PART_TRAY.z
        );
        const H_PICK = hd(-0.22, 0, 0.975),
          H_INSP = hd(0.42, 0.26, 0.87),
          H_TRAY = hd(0.18, 0, 0.98);
        const GI = new THREE.Vector3(-0.1, 1.86, Z_FRONT + 0.53);
        const POLE_PICK = hd(-0.55, -0.75, -0.35),
          POLE_INSP = hd(-0.38, -0.9, -0.12),
          POLE_TRAY = hd(-0.45, -0.8, -0.3);
        const OPEN = -0.15,
          SHUT = 0.22,
          REST = IDLE.curl[1];
        const at = (v, ...adds) =>
          adds.reduce((acc, a) => acc.add(a), v.clone());
        const HK = [
          [
            0.02,
            at(GRIP_AT, H_PICK.clone().multiplyScalar(-0.14), up(0.07)),
            H_PICK,
            POLE_PICK,
            REST,
            0,
            0,
            0,
            0,
            1,
          ],
          [
            0.2,
            at(GRIP_AT, H_PICK.clone().multiplyScalar(-0.12), up(0.03)),
            H_PICK,
            POLE_PICK,
            OPEN,
            0.2,
            -0.22,
            0.03,
            1,
            0,
          ],
          [
            0.29,
            at(GRIP_AT, H_PICK.clone().multiplyScalar(-0.05), up(5e-3)),
            H_PICK,
            POLE_PICK,
            OPEN,
            0.3,
            -0.27,
            0.045,
            1,
            0,
          ],
          [
            0.34,
            GRIP_AT.clone(),
            H_PICK,
            POLE_PICK,
            OPEN,
            0.32,
            -0.28,
            0.045,
            1,
            1,
          ],
          [
            0.39,
            GRIP_AT.clone(),
            H_PICK,
            POLE_PICK,
            SHUT,
            0.32,
            -0.28,
            0.045,
            1,
            1,
          ],
          [
            0.46,
            at(GRIP_AT, up(0.16), H_PICK.clone().multiplyScalar(-0.04)),
            H_PICK,
            POLE_PICK,
            SHUT,
            0.18,
            -0.22,
            0.02,
            1,
            0,
          ],
          [
            0.54,
            new THREE.Vector3(-0.23, 1.72, Z_FRONT + 0.5),
            hd(0.2, 0.16, 0.97),
            POLE_INSP,
            SHUT,
            0.05,
            -0.13,
            0,
            1,
            0,
          ],
          [0.6, GI.clone(), H_INSP, POLE_INSP, SHUT, 0, -0.08, 0, 1, 1],
          [
            0.67,
            at(GI, new THREE.Vector3(0.012, 0.01, 0)),
            H_INSP,
            POLE_INSP,
            SHUT,
            0,
            -0.06,
            0,
            1,
            1,
          ],
          [
            0.73,
            at(TRAY_AT, up(0.14), H_TRAY.clone().multiplyScalar(-0.03)),
            H_TRAY,
            POLE_TRAY,
            SHUT,
            0.16,
            -0.06,
            0.025,
            1,
            0,
          ],
          [
            0.78,
            TRAY_AT.clone(),
            H_TRAY,
            POLE_TRAY,
            SHUT,
            0.22,
            -0.04,
            0.035,
            1,
            1,
          ],
          [
            0.81,
            TRAY_AT.clone(),
            H_TRAY,
            POLE_TRAY,
            OPEN,
            0.22,
            -0.04,
            0.035,
            1,
            1,
          ],
          [
            0.86,
            at(TRAY_AT, H_TRAY.clone().multiplyScalar(-0.12), up(0.06)),
            H_TRAY,
            POLE_TRAY,
            OPEN,
            0.1,
            0,
            0.015,
            1,
            0,
          ],
          [
            0.95,
            at(TRAY_AT, H_TRAY.clone().multiplyScalar(-0.14), up(0.08)),
            H_TRAY,
            POLE_TRAY,
            REST,
            0,
            0,
            0,
            0,
            1,
          ],
        ];
        const HELD = [0.39, 0.81];
        const hseg = p => {
          let i = 0;
          while (i < HK.length - 2 && p > HK[i + 1][0]) i++;
          return i;
        };
        const herm = (i, u, get) => {
          const a = HK[i],
            b = HK[i + 1],
            dp = b[0] - a[0];
          const tan = k => {
            const K = HK[k];
            if (K[9] || k === 0 || k === HK.length - 1) return 0;
            return (
              (get(HK[k + 1]) - get(HK[k - 1])) / (HK[k + 1][0] - HK[k - 1][0])
            );
          };
          const u2 = u * u,
            u3 = u2 * u;
          return (
            (2 * u3 - 3 * u2 + 1) * get(a) +
            (u3 - 2 * u2 + u) * dp * tan(i) +
            (-2 * u3 + 3 * u2) * get(b) +
            (u3 - u2) * dp * tan(i + 1)
          );
        };
        const GX = K => K[1].x,
          GY = K => K[1].y,
          GZ = K => K[1].z,
          GL = K => K[5],
          GT = K => K[6],
          GD = K => K[7];
        const keyAt = (p, out) => {
          const q = clamp(p, HK[0][0], HK[HK.length - 1][0]);
          const i = hseg(q),
            a = HK[i],
            b = HK[i + 1];
          const u = clamp((q - a[0]) / (b[0] - a[0]), 0, 1),
            us = smooth(u);
          out.G.set(herm(i, u, GX), herm(i, u, GY), herm(i, u, GZ));
          out.H.lerpVectors(a[2], b[2], us).normalize();
          out.Pl.lerpVectors(a[3], b[3], us).normalize();
          out.curl = lerp(a[4], b[4], us);
          out.lean = herm(i, u, GL);
          out.turn = herm(i, u, GT);
          out.drop = herm(i, u, GD);
          out.w = lerp(a[8], b[8], us);
          return out;
        };
        const KA = {
            G: new THREE.Vector3(),
            H: new THREE.Vector3(),
            Pl: new THREE.Vector3(),
          },
          KB = {
            G: new THREE.Vector3(),
            H: new THREE.Vector3(),
            Pl: new THREE.Vector3(),
          };
        const _K = new THREE.Vector3(),
          _Gt = new THREE.Vector3(),
          _Ht = new THREE.Vector3(),
          _Kt = new THREE.Vector3(),
          _Wt = new THREE.Vector3(),
          _hp = new THREE.Vector3(),
          _Lk = new THREE.Vector3();
        const _sq = new THREE.Quaternion(),
          _tq = new THREE.Quaternion(),
          _Y = new THREE.Vector3(0, 1, 0);
        function handsPose(p, P2, time) {
          keyAt(p, KA);
          keyAt(p + 0.02, KB);
          const turnW =
            smooth(clamp((p - 0.6) / 0.015, 0, 1)) *
            (1 - smooth(clamp((p - 0.655) / 0.015, 0, 1)));
          if (turnW > 0)
            KA.H.applyAxisAngle(
              _Y,
              0.42 * Math.sin(clamp((p - 0.6) / 0.07, 0, 1) * PI * 2) * turnW
            );
          _K.set(KA.H.z, 0, -KA.H.x).normalize();
          P2.torsoP += KB.lean;
          P2.waist += KB.turn;
          P2.py -= KB.drop;
          P2.shP[0] += 0.2 * KB.lean;
          P2.shR[0] += 0.07 * KB.lean;
          plantFeet(P2, FOOT_L, FOOT_R);
          applyPose(P2);
          root2.position.set(
            Math.sin(PSI2) * Z_FRONT,
            HUB_TOP,
            Math.cos(PSI2) * Z_FRONT
          );
          root2.updateMatrixWorld(true);
          _Gt.copy(KA.G);
          stage2.localToWorld(_Gt);
          J.torso.worldToLocal(_Gt);
          stage2.getWorldQuaternion(_sq);
          J.torso.getWorldQuaternion(_tq).invert();
          _Ht.copy(KA.H).applyQuaternion(_sq).applyQuaternion(_tq).normalize();
          _Kt.copy(_K).applyQuaternion(_sq).applyQuaternion(_tq).normalize();
          _Wt.copy(_Gt).addScaledVector(_Ht, -GRIP);
          armIK(1, _Wt, KA.Pl, Q);
          wristAim(1, _Ht, _Kt, Q);
          Q.curl[1] = KA.curl;
          mixArm(1, P2, Q, KA.w, P2);
          P2.curl[1] = KA.w > 0.02 ? KA.curl : lerp(REST, KA.curl, KA.w);
          keyAt(p + 0.05, KB);
          _Lk.copy(KB.G);
          stage2.localToWorld(_Lk);
          J.torso.worldToLocal(_Lk);
          _hp.set(0, 0.627, 0.1);
          const dx = _Lk.x - _hp.x,
            dy = _Lk.y - _hp.y,
            dz = _Lk.z - _hp.z;
          const look = clamp(Math.max(KA.w, KB.w) * 1.3, 0, 1);
          P2.neckY = lerp(P2.neckY, clamp(Math.atan2(dx, dz), -0.9, 0.9), look);
          P2.neckP = lerp(
            P2.neckP,
            clamp(Math.atan2(-dy, Math.hypot(dx, dz)), -0.35, 0.75),
            look
          );
          api.dbgHand.G.copy(KA.G);
          api.dbgHand.w = KA.w;
        }
        const _gq = new THREE.Quaternion(),
          _rzp = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 0, 1),
            PI / 2
          ),
          _rzn = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 0, 1),
            -PI / 2
          );
        const _gp = new THREE.Vector3(),
          _ay = new THREE.Vector3(),
          _sqi = new THREE.Quaternion();
        function placePart(k, p) {
          part.visible = props.visible;
          const held = k === 3 && p >= HELD[0] && p < HELD[1];
          if (held) {
            A.gripR.getWorldPosition(_gp);
            J.wrHR.getWorldQuaternion(_gq);
            const q = _gq.clone().multiply(_rzp);
            _ay.set(0, 1, 0).applyQuaternion(q);
            if (_ay.y < 0) {
              q.copy(_gq).multiply(_rzn);
              _ay.set(0, 1, 0).applyQuaternion(q);
            }
            _gp.addScaledVector(_ay, -0.035);
            stage2.worldToLocal(_gp);
            stage2.getWorldQuaternion(_sqi).invert();
            part.position.copy(_gp);
            part.quaternion.copy(_sqi.multiply(q));
          } else {
            part.position.copy(
              (k === 3 && p >= HELD[1]) || k >= 4 ? PART_TRAY : PART_HOME
            );
            part.quaternion.identity();
          }
          partRing.material.color
            .setRGB(0.13, 0.83, 0.93)
            .multiplyScalar(
              2.2 * (1 + (k === 3 && p > 0.54 && p < 0.68 ? 0.6 : 0))
            );
        }
        const GREEN = new THREE.Color(3462041),
          RED = new THREE.Color(15680580),
          AMBER = new THREE.Color(16498468),
          CYANC = new THREE.Color(2282478);
        const ledC = new THREE.Color(),
          webC = new THREE.Color();
        const inten = new Array(WEB.length).fill(0);
        let xrayLast = -1,
          cloudOrigin = null;
        const api = {
          root: root2,
          stage: stage2,
          fxRoots: [fxRoot, walkFx, safeFx],
          J,
          A,
          slot,
          RS,
          Z_BACK,
          Z_FRONT,
          scan: { on: 0, az: 0 },
          dbgHand: { G: new THREE.Vector3(), w: 0 },
          xrayOverride: null,
          shells: SHELLS,
          hide() {
            fxRoot.visible = walkFx.visible = safeFx.visible = false;
            if (cloud) cloud.visible = beams.visible = false;
            api.scan.on = 0;
          },
          anchorWorld(name, out) {
            const a = A[name];
            if (!a) return null;
            return a.getWorldPosition(out);
          },
          rootZ(k, p) {
            if (k < 2) return Z_BACK;
            if (k > 2) return Z_FRONT;
            return walkZ(range(p, 0.04, 0.8)) * RS;
          },
          prepareCloud(solids) {
            root2.position.set(
              Math.sin(PSI2) * Z_BACK,
              HUB_TOP,
              Math.cos(PSI2) * Z_BACK
            );
            copyPose(IDLE, P);
            applyPose(P);
            root2.updateMatrixWorld(true);
            const origin = A.lidar.getWorldPosition(new THREE.Vector3());
            o.robotXZ = { x: root2.position.x, z: root2.position.z };
            cloudOrigin = origin;
            return buildCloud(origin, solids);
          },
          update(k, p, time, dt) {
            if (k !== 2) lift[0] = lift[1] = 0;
            let zr = Z_BACK;
            let x = 0,
              boot = 1,
              eyes = 1,
              frOn = 0,
              depthOn = 0,
              lidar = 0,
              scan = 0,
              walkOn = 0,
              stop = 0,
              otaU = -1,
              reset = 0,
              assembleA = 1,
              glassOpen = 0;
            inten.fill(0.16);
            let flow = true;
            if (k < 0) {
              assembleA = 0;
              boot = 0;
              eyes = 0;
              copyPose(DORMANT, P);
              inten.fill(0);
            } else if (k === 0) {
              assembleA = range(p, 0, 0.3);
              glassOpen = sr(p, 0.26, 0.32) * (1 - sr(p, 0.46, 0.52));
              x = sr(p, 0.47, 0.53) * (1 - sr(p, 0.76, 0.82));
              boot = range(p, 0.5, 0.74);
              eyes = sr(p, 0.62, 0.68);
              mixPose(DORMANT, IDLE, easeInOut(range(p, 0.6, 0.8)), P);
              P.neckP = lerp(DORMANT.neckP, 0, easeInOut(range(p, 0.64, 0.8)));
              if (p > 0.8) idleLife(P, time, k);
              plantFeet(P, FOOT_L, FOOT_R);
              inten.fill(boot > 0 ? 1 : 0);
              flow = boot > 0;
            } else if (k === 1) {
              copyPose(IDLE, P);
              idleLife(P, time, k);
              const look = range(p, 0.02, 0.28);
              P.neckY = 0.55 * Math.sin(look * PI * 2) * (1 - look * 0.3);
              P.neckP =
                0.05 + 0.22 * sr(p, 0.28, 0.36) * (1 - sr(p, 0.52, 0.58));
              plantFeet(P, FOOT_L, FOOT_R);
              frOn = sr(p, 0.04, 0.1) * (1 - sr(p, 0.54, 0.6));
              depthOn = sr(p, 0.3, 0.36) * (1 - sr(p, 0.52, 0.56));
              lidar = sr(p, 0.54, 0.6) * (1 - sr(p, 0.84, 0.94));
              scan = PI * 4 * range(p, 0.56, 0.8);
              inten[0] = 1;
            } else if (k === 2) {
              zr = walkPose(range(p, 0.04, 0.8), P) * RS;
              walkOn = sr(p, 0.5, 0.56) * (1 - sr(p, 0.8, 0.86));
              inten[3] = inten[4] = 1;
            } else if (k === 3) {
              zr = Z_FRONT;
              copyPose(IDLE, P);
              idleLife(P, time, k);
              handsPose(p, P, time);
              plantFeet(P, FOOT_L, FOOT_R);
              frOn = sr(p, 0.56, 0.6) * (1 - sr(p, 0.67, 0.71));
              depthOn = frOn;
              inten[2] = 1;
              inten[0] = 0.6;
            } else if (k === 4) {
              zr = Z_FRONT;
              copyPose(IDLE, P);
              stop = sr(p, 0.28, 0.31) * (1 - sr(p, 0.52, 0.56));
              reset = sr(p, 0.5, 0.53) * (1 - sr(p, 0.56, 0.6));
              otaU = range(p, 0.56, 0.68);
              if (stop < 0.02) idleLife(P, time, k);
              const wv = range(p, 0.03, 0.28);
              const up2 =
                easeInOut(range(p, 0.02, 0.1)) *
                (1 - easeInOut(range(p, 0.7, 0.8)));
              P.shP[1] = lerp(P.shP[1], -0.12, up2);
              P.shR[1] = lerp(P.shR[1], -1.32, up2);
              P.shY[1] = lerp(P.shY[1], -PI / 2, up2);
              P.el[1] = lerp(
                P.el[1],
                -1.12 + 0.36 * Math.sin(wv * PI * 8),
                up2
              );
              P.wrR[1] = lerp(P.wrR[1], 0, up2);
              P.wrP[1] = lerp(P.wrP[1], 0, up2);
              P.wrH[1] = lerp(P.wrH[1], PI / 2, up2);
              P.curl[1] = lerp(P.curl[1], -0.1, up2);
              P.neckP = 0.04;
              P.neckY = -0.08 * up2;
              plantFeet(P, FOOT_L, FOOT_R);
              inten.fill(0.5);
              if (stop > 0.02) flow = false;
              if (otaU > 0 && otaU < 1) inten.fill(1);
            } else {
              zr = Z_FRONT;
              copyPose(IDLE, P);
              idleLife(P, time, k);
              plantFeet(P, FOOT_L, FOOT_R);
              inten.fill(0.3);
            }
            assemble(easeInOut(assembleA));
            applyPose(P);
            root2.position.set(
              Math.sin(PSI2) * zr,
              HUB_TOP,
              Math.cos(PSI2) * zr
            );
            chestGlass.position.y = glassOpen * 0.12;
            chestGlass.position.z = glassOpen * 0.01;
            root2.updateMatrixWorld(true);
            if (api.xrayOverride != null) x = api.xrayOverride;
            if (Math.abs(x - xrayLast) > 1e-4) {
              xrayLast = x;
              for (const m of SHELLS) {
                m.opacity = 1 - 0.86 * x;
                m.depthWrite = x < 0.05;
              }
            }
            for (const l of LEDS) {
              const on =
                k < 0
                  ? 0
                  : k === 0
                    ? sr(boot, l.depth / 5, l.depth / 5 + 0.12)
                    : 1;
              ledC.copy(GREEN).lerp(RED, stop).lerp(AMBER, reset);
              const blink =
                stop > 0.5 ? 0.65 + 0.35 * (Math.sin(time * 9) > 0 ? 1 : 0) : 1;
              l.mat.color.copy(ledC).multiplyScalar(2.4 * on * blink + 1e-4);
            }
            EYE.color
              .copy(CYANC)
              .multiplyScalar(1e-4 + 2.4 * eyes * (1 + 0.5 * frOn));
            BROW.color
              .copy(GREEN)
              .lerp(RED, stop)
              .multiplyScalar(1e-4 + 1.6 * eyes);
            CHEST_RIM.color
              .copy(GREEN)
              .lerp(RED, stop)
              .multiplyScalar(
                1e-4 +
                  (k < 0 ? 0 : k === 0 ? 2.2 * sr(boot, 0, 0.08) : 2.2) *
                    (1 + (otaU > 0.85 && otaU < 1 ? 1.4 : 0))
              );
            PACK_BAR.color
              .copy(GREEN)
              .multiplyScalar(k < 0 ? 1e-4 : 1.8 * Math.max(0.15, boot));
            const spin = k < 0 || (k === 0 && boot < 0.2) ? 0 : 1;
            scanArc.rotation.y = lidar > 0.01 ? -scan : time * 2.6;
            SCAN.color
              .setRGB(0.37, 0.92, 0.83)
              .multiplyScalar(1e-4 + spin * (0.9 + 2.2 * lidar));
            vision.visible = frOn > 0.01;
            if (vision.visible && k === 3) {
              part.getWorldPosition(_vis);
              vision.scale.setScalar(1);
              vision.lookAt(_vis);
              head.worldToLocal(_vis);
              vision.scale.setScalar(
                clamp(_vis.sub(vision.position).length() / FR.f, 0.12, 1) * 1.08
              );
            } else if (vision.visible) {
              vision.rotation.set(0.36, 0, 0);
              vision.scale.setScalar(1);
            }
            if (vision.visible) {
              frMat.opacity = frOn * 0.9;
              const sweep = 0.5 + 0.5 * Math.sin(time * 2.4);
              const dz = lerp(0.35, FR.f, sweep);
              depthPlane.position.set(0, 0, dz);
              depthPlane.scale.set((FR.w * dz) / FR.f, (FR.h * dz) / FR.f, 1);
              depthMat.uniforms.uO.value = Math.max(depthOn, frOn * 0.25);
            }
            api.scan.on = lidar;
            api.scan.az = scan % (PI * 2);
            if (cloud) {
              cloud.visible = beams.visible = lidar > 0.01;
              if (cloud.visible) {
                cloud.material.uniforms.uScan.value = scan;
                cloud.material.uniforms.uO.value = lidar;
                beams.material.opacity =
                  lidar * 0.75 * (scan < PI * 4 - 0.01 ? 1 : 0.3);
                aimBeams(cloudOrigin, scan);
              }
            }
            walkFx.visible = walkOn > 0.01;
            if (walkFx.visible) {
              let n = 0;
              for (let i = 0; i < 2; i++) {
                if (lift[i] > 8e-3) continue;
                const f = A[i === 0 ? "footL" : "footR"];
                for (const [cx, cz] of [
                  [-cornerW, cornerB],
                  [cornerW, cornerB],
                  [cornerW, cornerF],
                  [-cornerW, cornerF],
                ]) {
                  tmp.set(cx, -0.03, cz - 0.06);
                  f.localToWorld(tmp);
                  hullPts[n++].set(tmp.x, HUB_TOP + 6e-3, tmp.z);
                }
              }
              const arr = supGeo.attributes.position.array;
              if (n >= 3) {
                const h = hull2D(hullPts, n);
                for (let i = 0; i < 9; i++) {
                  const q = hullPts[h[Math.min(i, h.length - 1)]];
                  arr[i * 3] = q.x;
                  arr[i * 3 + 1] = q.y;
                  arr[i * 3 + 2] = q.z;
                }
              }
              supGeo.attributes.position.needsUpdate = true;
              supMat.opacity = walkOn;
              A.imu.getWorldPosition(tmp);
              com.position.set(tmp.x, HUB_TOP + 8e-3, tmp.z);
              comMat.opacity = walkOn;
              const ca = comLineGeo.attributes.position.array;
              ca[0] = tmp.x;
              ca[1] = tmp.y;
              ca[2] = tmp.z;
              ca[3] = tmp.x;
              ca[4] = HUB_TOP + 0.01;
              ca[5] = tmp.z;
              comLineGeo.attributes.position.needsUpdate = true;
              comLine.computeLineDistances();
              comLine.material.opacity = walkOn * 0.9;
            }
            safeFx.visible = stop > 0.01 || (otaU > 0 && otaU < 1);
            if (safeFx.visible) {
              const pu = range(p, 0.28, 0.42);
              pulse.position.set(
                root2.position.x,
                HUB_TOP + 0.01,
                root2.position.z
              );
              pulse.scale.setScalar(0.3 + pu * 1.9);
              pulseMat.opacity = stop * (1 - pu) * 0.9;
              A.chestA.getWorldPosition(tmp);
              const oy = lerp(
                tmp.y + 3.2,
                tmp.y,
                easeInOut(clamp01(otaU / 0.85))
              );
              ota.position.set(tmp.x, oy, tmp.z + 0.02);
              ota.rotation.y = time * 3;
              ota.scale.setScalar(otaU > 0.85 ? 1 - (otaU - 0.85) / 0.15 : 1);
              otaMat.opacity = otaU > 0 && otaU < 1 ? 1 : 0;
              const oa = otaTrailGeo.attributes.position.array;
              oa[0] = tmp.x;
              oa[1] = oy;
              oa[2] = tmp.z + 0.02;
              oa[3] = tmp.x;
              oa[4] = Math.min(tmp.y + 3.4, oy + 0.9);
              oa[5] = tmp.z + 0.02;
              otaTrailGeo.attributes.position.needsUpdate = true;
              otaTrail.material.opacity = otaU > 0 && otaU < 0.86 ? 0.7 : 0;
            }
            const propsOn =
              k === 3
                ? 1
                : k === 2
                  ? sr(p, 0.82, 0.98)
                  : k === 4
                    ? 1 - sr(p, 0.8, 0.95)
                    : 0;
            props.visible = propsOn > 0.01;
            props.position.y = -1.1 * (1 - easeInOut(propsOn));
            props.scale.y = Math.max(1e-3, easeInOut(propsOn));
            placePart(k, p);
            if (part.visible && !(k === 3 && p >= HELD[0] && p < HELD[1]))
              part.position.y +=
                props.position.y + (PART_HOME.y + 0) * (props.scale.y - 1);
            for (let i = 0; i < 2; i++) {
              A[i === 0 ? "footL" : "footR"].getWorldPosition(tmp);
              stage2.worldToLocal(tmp);
              footShadows[i].position.set(tmp.x, 4e-3, tmp.z);
              footShadows[i].visible = k >= 0 && lift[i] < 0.03;
              footShadows[i].scale.setScalar(1 - lift[i] * 6);
            }
            const webOn = k < 0 ? 0 : k === 0 ? x : 1;
            fxRoot.visible = webOn > 0.01;
            if (fxRoot.visible) {
              webC.copy(GREEN).lerp(RED, stop);
              for (let i = 0; i < inten.length; i++)
                inten[i] *= k === 0 ? webOn * sr(boot, 0, 0.25) : 1;
              updateWeb(time, inten, webC, flow);
            }
          },
        };
        applyPose(copyPose(DORMANT, P));
        return api;
      }
      const HOVER = {
        ehealth365: {
          _: [
            "A wearable profile build of EoS would run the sensor loop and the BLE link.",
            "code",
          ],
          "Smart Ring Pro": [
            "Heart rate, HRV and SpO₂ samples would go through the EoS sensor service.",
            "code",
          ],
          "Designed to measure": [
            "The sensor service filters and calibrates each reading (average, median or low-pass).",
            "code",
          ],
          "Smart Patch Pro": [
            "A week on one patch is a battery target; the EoS power service is bookkeeping only today.",
            "part",
          ],
          "Bluetooth LE": [
            "The link to the phone app would use the BLE HAL class, a stub today.",
            "docs",
          ],
        },
        eoshealth: {
          _: [
            "A watch profile build would run the PPG sensors, the display and BLE.",
            "code",
          ],
          "HEALTH-BAND Neuro": [
            "Sensors through the sensor service; the 1.4-inch display needs the ui service, off by default.",
            "part",
          ],
          "Application MCU": [
            "stm32h743 is one of the 13 named EoS board descriptors.",
            "docs",
          ],
          "PPG LEDs": [
            "PPG readings are sensor-service channels; LED timing uses the timer HAL (STM32F4 register code only).",
            "part",
          ],
        },
        emedical: {
          _: [
            "A medical profile build would keep an audit log and integrity checks.",
            "code",
          ],
          "eECG-12": [
            "Each of the 12 leads would be a sensor-service channel with filtering.",
            "code",
          ],
          "Designed to IEC 60601-1": [
            "A hardware safety target. No EoS build is certified for medical use.",
            "none",
          ],
          MCU: [
            "Nearest board descriptor: stm32h743, also a Cortex-M7. The SPI driver is STM32F4 register code only.",
            "part",
          ],
        },
        eradar360: {
          _: [
            "A high-priority kernel task would fuse radar, laser and V2X events.",
            "code",
          ],
          "Aegis One": [
            "The priority scheduler and message queues it would use are working code.",
            "code",
          ],
          "Front + rear radar": [
            "Radar would plug into the radar/LiDAR HAL class, a stub today.",
            "docs",
          ],
          "5 laser detectors": [
            "Each detector is an analog input; the ADC HAL class is a stub today.",
            "docs",
          ],
          V2X: [
            "There is no V2X stack in EoS yet; sockets work on host builds only.",
            "none",
          ],
        },
        etransport: {
          _: [
            "A cockpit profile build would drive the chart display and the bridge network.",
            "part",
          ],
          "eNav-ECDIS": [
            "The chart display needs the display HAL and the ui service, neither built by default.",
            "docs",
          ],
          "S-57/S-63": [
            "S-63 protects charts with Blowfish and DSA; EoS has neither yet.",
            "none",
          ],
          "NXP i.MX 8M Plus": [
            "Nearest EoS board descriptor: imx8m, the i.MX 8M Mini.",
            "docs",
          ],
        },
        epam: {
          _: [
            "An aerospace profile build: GNSS, IMU, CAN, watchdog and redundancy.",
            "part",
          ],
          "Urban Drone": [
            "Position would come through the gps service's NMEA parser (working code).",
            "code",
          ],
          "8x tilt-rotors": [
            "Eight rotors fit the motor service's limit of eight; the motor HAL itself is a stub.",
            "part",
          ],
          Canopy: [
            "Tint control is a PWM or DAC output; both HAL classes are stubs today.",
            "docs",
          ],
          "Flight controller": [
            "EoS multicore (spinlocks, inter-core interrupts, shared memory, AMP) is working code.",
            "code",
          ],
        },
        eaerospace: {
          _: [
            "A drone profile build: motor control, GNSS, IMU and OTA.",
            "part",
          ],
          "eMR-400": [
            "Four motors would run on the motor service's PID speed loops (working code).",
            "code",
          ],
          "Core board": [
            "eBoot checks the signed image here, then EoS boots on this board.",
            "part",
          ],
          Payload: [
            "Payload sensors would register with the sensor service, which holds 16.",
            "code",
          ],
          "Design targets": [
            "Endurance is a battery target; the EoS power service is bookkeeping only today.",
            "part",
          ],
        },
        erobotics: {
          _: [
            "A robot profile build: motor control, sensors, camera, IMU, Wi-Fi and BLE.",
            "part",
          ],
          "eAMR-500": [
            "Its four hub motors would run on motor-service PID speed loops (working code).",
            "code",
          ],
          "eArm-7": [
            "Seven joints plus four hub motors make 11, over the motor service's 8 per image.",
            "part",
          ],
          "eGripper-3F": [
            "RS-485 would go through the UART driver, register code for STM32F4 only.",
            "part",
          ],
          "eVision-4K": [
            "The cameras would use the camera HAL class, a stub today.",
            "docs",
          ],
          "eLiDAR-360": [
            "The LiDAR would use the radar/LiDAR HAL class, a stub today.",
            "docs",
          ],
          "Core board": [
            "eBoot verifies the image, then the robot profile build of EoS boots here.",
            "part",
          ],
        },
        eagritech: {
          _: [
            "An autonomous profile build: GNSS, LiDAR, CAN and multicore.",
            "part",
          ],
          "eAgri-Tractor": [
            "Perception and control could run on separate cores with the kernel's AMP support.",
            "code",
          ],
          "RTK GPS": [
            "RTK fixes arrive as NMEA sentences, parsed by the gps service (working code).",
            "code",
          ],
          LiDAR: [
            "The LiDAR would use the radar/LiDAR HAL class, a stub today.",
            "docs",
          ],
          "Design speed": [
            "Drive and steering could use motor-service PID loops and trajectories (working code).",
            "code",
          ],
        },
        efrontier: {
          _: [
            "A satellite profile build: watchdog, multicore and integrity checks.",
            "code",
          ],
          "eSRB-900": [
            "The os service's watchdog and the RTOS fault log would support autonomous safing.",
            "code",
          ],
          "7 axes": [
            "Seven joint loops fit inside the motor service's limit of eight (working code).",
            "code",
          ],
          "6-axis force/torque": [
            "Six force and torque channels would fit the sensor service's 16 slots.",
            "code",
          ],
          GR712RC: [
            "LEON3 exists as a board descriptor (generic-sparc); there is no SPARC port yet.",
            "docs",
          ],
        },
        eindustrial: {
          _: [
            "A PLC profile build: GPIO, ADC/DAC, CAN, Ethernet, watchdog and motor control.",
            "part",
          ],
          "ePLC-1000": [
            "IEC 61131-3 programs need a PLC runtime on top of EoS; none is in the repos yet.",
            "none",
          ],
          Fieldbus: [
            "There is no PROFINET or EtherCAT stack in EoS yet.",
            "none",
          ],
          "I/O": [
            "Digital I/O via GPIO (STM32F4 register code); analog via ADC/DAC HAL classes, stubs today.",
            "part",
          ],
          CPU: [
            "Nearest EoS board descriptor: imx8m, the i.MX 8M Mini.",
            "docs",
          ],
        },
        eenergy: {
          _: [
            "An EV profile build: sensors, CAN, motor control and OTA.",
            "part",
          ],
          "eBMS-100A": [
            "Protection would run as the highest-priority kernel task (scheduler: working code).",
            "code",
          ],
          "Active balancing": [
            "Balancing decisions would run on a software timer in the kernel (working code).",
            "code",
          ],
          "Cell monitoring": [
            "The LTC6813 talks SPI; its 18 cells exceed the sensor service's 16 slots today.",
            "part",
          ],
          MCU: [
            "There is no STM32G4 board descriptor; the nearest is stm32f4.",
            "docs",
          ],
        },
        esmartcity: {
          _: ["An IoT profile build: sensors, OTA, Wi-Fi and BLE.", "part"],
          "eSL-400": ["LoRaWAN appears only in the EoS docs so far.", "docs"],
          Socket: [
            "Metered voltage and current fit the sensor service's voltage and current types.",
            "code",
          ],
          Dimming: [
            "Dimming would use the PWM HAL class, and 0–10 V the DAC class; both are stubs today.",
            "docs",
          ],
          Controller: [
            "There is no STM32G4 board descriptor; the nearest is stm32f4.",
            "docs",
          ],
        },
        emining: {
          _: [
            "An industrial profile build: sensors, watchdog and safety.",
            "code",
          ],
          "eGasDetect-4": [
            "Each gas would be a sensor-service channel of the gas type.",
            "code",
          ],
          Sensors: [
            "Readings get the sensor service's filtering and calibration (working code).",
            "code",
          ],
          Alarms: [
            "A high-priority alarm task, restarted by the watchdog if it stalls (working code).",
            "code",
          ],
          MCU: [
            "There is no STM32L4 board descriptor; the nearest is stm32f4, also a Cortex-M4.",
            "docs",
          ],
        },
        eedgeai: {
          _: [
            "An AI-edge profile build: camera, GPU/NPU, DMA, multicore and OTA.",
            "part",
          ],
          "eVIS-600": [
            "Detection on the NPU would go through eAI, which returns stub inference by default.",
            "part",
          ],
          "2.3MP global shutter": [
            "The four cameras would use the camera HAL class, a stub today.",
            "docs",
          ],
          "850nm IR strobe": [
            "Strobe timing would use the timer HAL, register code for STM32F4 only.",
            "part",
          ],
          "NXP i.MX 8M Plus": [
            "Nearest EoS board descriptor: imx8m, the i.MX 8M Mini.",
            "docs",
          ],
        },
        eelectronics: {
          _: [
            "EoS would run on the host processor that drives this chip.",
            "part",
          ],
          "eASIC-Vision": [
            "A vision ASIC would plug into eAI's accelerator layer; non-CPU back ends are stubs.",
            "part",
          ],
          "BGA-576": [
            "The package is hardware; EoS sees it as a PCIe device on the host.",
            "docs",
          ],
          Die: [
            "On-chip SRAM is managed by the chip itself, not by EoS.",
            "docs",
          ],
          "PCIe 4.0 ×4": ["PCIe and DMA HAL classes are stubs today.", "docs"],
        },
        econsumer: {
          _: [
            "A smart-home profile build: Wi-Fi, BLE, display, crypto and OTA.",
            "part",
          ],
          "eHub-Pro": [
            "Device credentials would sit in the security service's keystore (working code).",
            "code",
          ],
          "Matter 1.3": [
            "There is no Matter, Zigbee or Z-Wave stack in EoS yet.",
            "none",
          ],
          CPU: [
            "Matches the imx8m board descriptor, the i.MX 8M Mini.",
            "docs",
          ],
          GbE: [
            "On Linux builds, EoS sockets are real; MQTT and mDNS are stubs.",
            "part",
          ],
        },
        ecybersec: {
          _: [
            "A crypto-hardware profile build: crypto, security, audit and watchdog.",
            "code",
          ],
          "eHSM-9000": [
            "SHA-256, SHA-512, AES and Ed25519 verification are working code; RSA and ECC fail closed.",
            "code",
          ],
          "M-of-N quorum": [
            "Access lists and a keystore come from the security service (working code).",
            "code",
          ],
          "Active tamper mesh": [
            "Zeroisation would be a GPIO interrupt into the top-priority task; GPIO is STM32F4 register code.",
            "part",
          ],
          "Core board": [
            "eBoot verifies the image before EoS runs inside the tamper boundary.",
            "part",
          ],
        },
        edefense: {
          _: [
            "A server profile build: multicore, watchdog, filesystem and security.",
            "code",
          ],
          "eRGD-2000": [
            "Mission tasks would be isolated by the multicore layer and restarted by the watchdog.",
            "code",
          ],
          "Conduction cooling": [
            "Board temperatures would go through the sensor service (working code).",
            "code",
          ],
          "IP67 sealed": [
            "A hardware rating; on Linux, EoS adds SELinux, IMA/EVM and dm-verity helpers.",
            "code",
          ],
          "NXP i.MX 8M Plus": [
            "The NPU sits behind eAI, which returns stub inference by default.",
            "part",
          ],
        },
      };
      const HOVER_WHAT = {
        ehealth365: [
          "Smart Ring Pro + Smart Patch Pro",
          "Two wearables, one ring and one patch, each with its own sensors and a shared phone app.",
          "wearable",
        ],
        eoshealth: [
          "HEALTH-BAND Neuro",
          "A 44 × 38 × 12 mm case with a 454 × 454 AMOLED display, an LRA haptic motor and a medical-grade silicone band.",
          "watch",
        ],
        emedical: [
          "eECG-12",
          "A 12-lead ECG design with a 7-inch 1024 × 600 touch display and a 7.4 V 5000 mAh battery.",
          "medical",
        ],
        eradar360: [
          "Aegis One",
          "A windshield unit that combines radar, laser detection and vehicle-to-everything radio.",
          "automotive",
        ],
        etransport: [
          "eNav-ECDIS",
          "A bridge console design built around a 27-inch 1920 × 1200 IPS display on 24 VDC power.",
          "cockpit",
        ],
        epam: [
          "Urban Drone",
          "A tilt-rotor eVTOL design for one pilot (or autonomous flight) and three passengers.",
          "aerospace",
        ],
        eaerospace: [
          "eMR-400",
          "A multirotor inspection drone design; the line also includes fixed-wing, VTOL cargo and swarm designs.",
          "drone",
        ],
        erobotics: [
          "A full robot from five designs",
          "An autonomous mobile manipulator: base, arm, gripper, vision and LiDAR are each an eRobotics design.",
          "robot",
        ],
        eagritech: [
          "eAgri-Tractor",
          "An autonomous tractor design in the eRobotics autonomous-systems family.",
          "autonomous",
        ],
        efrontier: [
          "eSRB-900",
          "A controller design for a 7-axis space manipulator with harmonic drives and a 6-axis force/torque sensor.",
          "satellite",
        ],
        eindustrial: [
          "ePLC-1000",
          "A modular PLC design that mounts on a DIN rail, with fieldbus, analog and digital I/O.",
          "plc",
        ],
        eenergy: [
          "eBMS-100A",
          "A battery-management design with per-cell monitoring and active balancing.",
          "ev",
        ],
        esmartcity: [
          "eSL-400",
          "A NEMA twist-lock lighting controller design with dimming, metering and LoRaWAN.",
          "iot",
        ],
        emining: [
          "eGasDetect-4",
          "A four-gas detector design with electrochemical and catalytic-bead sensors.",
          "industrial",
        ],
        eedgeai: [
          "eVIS-600",
          "A four-camera embedded vision design with a hardware ISP, IR strobe and GigE Vision output.",
          "ai_edge",
        ],
        eelectronics: [
          "eASIC-Vision",
          "A vision ASIC design with PCIe 4.0 ×4, four MIPI CSI-2 inputs and LPDDR5.",
          "computer",
        ],
        econsumer: [
          "eHub-Pro",
          "A multi-protocol smart-home hub design.",
          "smart_home",
        ],
        ecybersec: [
          "eHSM-9000",
          "A hardware security module design with an active tamper mesh and a smartcard quorum.",
          "crypto_hw",
        ],
        edefense: [
          "eRGD-2000",
          "A sealed, fanless rugged computer design.",
          "server",
        ],
      };
      const HOVER_ROBOT = [
        [
          "eyes",
          "eVision-4K",
          "4K stereo + depth over GbE",
          "The camera HAL class is a stub today.",
          "docs",
          "#22D3EE",
        ],
        [
          "lidar",
          "eLiDAR-360",
          "360°, 100 m range, 0.1° resolution",
          "The radar/LiDAR HAL class is a stub today.",
          "docs",
          "#5EEAD4",
        ],
        [
          "handR",
          "eGripper-3F",
          "3 fingers, 80 mm span, 50 N",
          "RS-485 through the UART driver (STM32F4 register code only).",
          "part",
          "#A78BFA",
        ],
        [
          "handL",
          "eGripper-3F",
          "3 fingers, 80 mm span, 50 N",
          "Grasps are motor-service trajectories (working code).",
          "code",
          "#A78BFA",
        ],
        [
          "elR",
          "eServo-200 · elbow",
          "200 W at 48 V, 23-bit encoder",
          "The motor service runs PID position loops (working code); 8 motors per image today.",
          "code",
          "#A78BFA",
        ],
        [
          "kneeL",
          "eServo-200 · knee",
          "EtherCAT CoE, 20 kHz current loop",
          "EtherCAT itself is not in EoS yet.",
          "none",
          "#A78BFA",
        ],
        [
          "actR",
          "eActuator-50 · ankle",
          "50 mm stroke, 500 N, CAN FD",
          "CAN is a HAL stub class today.",
          "docs",
          "#A78BFA",
        ],
        [
          "chestA",
          "Core board",
          "EoS, robot product profile",
          "eBoot verifies the image; the kernel and services are working code.",
          "code",
          "#34D399",
        ],
        [
          "pack",
          "Battery pack",
          "Concept · 48 V class",
          "The EoS power service is bookkeeping only today.",
          "part",
          "#34D399",
        ],
        [
          "imu",
          "IMU",
          "Balance at the centre of mass",
          "The IMU HAL class is a stub; the sensor service is working code.",
          "docs",
          "#FBBF24",
        ],
      ];
      const ORDER = [
        "ehealth365",
        "eoshealth",
        "emedical",
        "eradar360",
        "etransport",
        "epam",
        "eaerospace",
        "erobotics",
        "eagritech",
        "efrontier",
        "eindustrial",
        "eenergy",
        "esmartcity",
        "emining",
        "eedgeai",
        "eelectronics",
        "econsumer",
        "ecybersec",
        "edefense",
      ];
      const NAMES = [
        "eHealth365",
        "eosHealth",
        "eMedical",
        "eRadar360",
        "eTransport",
        "ePAM",
        "eAerospace",
        "eRobotics",
        "eAgriTech",
        "eFrontier",
        "eIndustrial",
        "eEnergy",
        "eSmartCity",
        "eMining",
        "eEdgeAI",
        "eElectronics",
        "eConsumer",
        "eCybersecurity",
        "eDefense",
      ];
      const HUES = [
        "#EF4444",
        "#FB7185",
        "#F472B6",
        "#F97316",
        "#38BDF8",
        "#2DD4BF",
        "#22D3EE",
        "#A78BFA",
        "#10B981",
        "#C084FC",
        "#34D399",
        "#F59E0B",
        "#60A5FA",
        "#A8A29E",
        "#818CF8",
        "#FBBF24",
        "#8B5CF6",
        "#06B6D4",
        "#9CA3AF",
      ];
      const N = ORDER.length;
      const RB0 = N + 1,
        RBN = 5;
      const FIN = RB0 + RBN;
      const RING = 11.6;
      const angleOf = j => Math.PI / 2 - (j * TAU) / N;
      const ringPos = (j, out = new THREE.Vector3()) =>
        out.set(Math.cos(angleOf(j)) * RING, 0, Math.sin(angleOf(j)) * RING);
      const floorTex = canvasTex(1024, 1024, (g, w, h) => {
        g.clearRect(0, 0, w, h);
        g.strokeStyle = "rgba(125, 211, 252, 0.5)";
        g.lineWidth = 1.2;
        for (let i = 0; i <= 8; i++) {
          const p = Math.round((i * w) / 8) + 0.5;
          g.beginPath();
          g.moveTo(p, 0);
          g.lineTo(p, h);
          g.moveTo(0, p);
          g.lineTo(w, p);
          g.stroke();
        }
      });
      floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
      floorTex.repeat.set(22, 22);
      const floor = new THREE.Mesh(
        new THREE.CircleGeometry(44, 120).rotateX(-Math.PI / 2),
        new THREE.MeshStandardMaterial({
          color: 263949,
          roughness: 0.94,
          metalness: 0.05,
          envMapIntensity: 0.15,
        })
      );
      floor.receiveShadow = true;
      world.add(floor);
      const gridMat = new THREE.MeshBasicMaterial({
        map: floorTex,
        color: HDR(3718648, 0.22),
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const grid = new THREE.Mesh(
        new THREE.CircleGeometry(44, 120).rotateX(-Math.PI / 2),
        gridMat
      );
      grid.position.y = 2e-3;
      world.add(grid);
      const skyMat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: C(132106) },
          uMid: { value: C(528415) },
          uGlow: { value: C(1718886) },
        },
        vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uGlow; varying vec3 vP; void main(){ float h = vP.y; vec3 c = mix(uMid, uTop, smoothstep(0.0, 0.55, h)); c += uGlow * exp(-((h * 3.5) * (h * 3.5))) * 0.14; gl_FragColor = vec4(c, 1.0); }`,
      });
      const sky = new THREE.Mesh(new THREE.SphereGeometry(90, 32, 16), skyMat);
      sky.renderOrder = -1;
      scene.add(sky);
      const pedGeo = GEO.lathe(
        [
          [0, 0],
          [1.5, 0],
          [1.56, 0.02],
          [1.58, 0.2],
          [1.52, PED_TOP],
          [0, PED_TOP],
        ],
        72
      );
      const pedBodies = [],
        pedRings = [],
        shadowGeos = [];
      const ringColor = [];
      for (let j = 0; j < N; j++) {
        const P = ringPos(j);
        pedBodies.push(GEO.at(pedGeo, [P.x, 0, P.z]));
        const rg = GEO.at(
          GEO.torus(1.535, 0.012, 8, 120).rotateX(Math.PI / 2),
          [P.x, PED_TOP - 0.03, P.z]
        );
        const col = new THREE.Color(HUES[j]);
        const cnt = rg.getAttribute("position").count;
        const cols = new Float32Array(cnt * 3),
          ids = new Float32Array(cnt);
        for (let k = 0; k < cnt; k++) {
          cols.set([col.r, col.g, col.b], k * 3);
          ids[k] = j;
        }
        rg.setAttribute("color", new THREE.BufferAttribute(cols, 3));
        rg.setAttribute("aJ", new THREE.BufferAttribute(ids, 1));
        pedRings.push(rg);
      }
      const pedMat = new THREE.MeshPhysicalMaterial({
        color: 658708,
        metalness: 0.55,
        roughness: 0.5,
        clearcoat: 0.35,
        clearcoatRoughness: 0.35,
        envMapIntensity: 0.35,
      });
      const pedMesh = new THREE.Mesh(GEO.merge(pedBodies), pedMat);
      pedMesh.receiveShadow = true;
      pedMesh.castShadow = true;
      world.add(pedMesh);
      const pedRingMat = new THREE.ShaderMaterial({
        uniforms: {
          uCur: { value: -5 },
          uWave: { value: -5 },
          uFin: { value: 0 },
        },
        vertexShader: `attribute float aJ; varying vec3 vC; varying float vJ; void main(){ vC = color; vJ = aJ; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform float uCur; uniform float uWave; uniform float uFin; varying vec3 vC; varying float vJ;
        void main(){ float here = exp(-(((vJ - uCur) * 1.4) * ((vJ - uCur) * 1.4))); float d = abs(vJ - uWave); d = min(d, float(${N}) - d); float wave = exp(-((d * 0.9) * (d * 0.9))) * uFin;
          float k = 0.9 + 2.2 * here + 2.4 * wave + 0.6 * uFin; gl_FragColor = vec4(vC * k, 1.0); }`,
        vertexColors: true,
      });
      world.add(new THREE.Mesh(mergeGeometries(pedRings), pedRingMat));
      const poolTex = canvasTex(256, 256, (g, w, h) => {
        const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
        gr.addColorStop(0, "rgba(255,255,255,1)");
        gr.addColorStop(0.45, "rgba(255,255,255,0.55)");
        gr.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gr;
        g.fillRect(0, 0, w, h);
      });
      const poolGeos = [];
      for (let j = 0; j < N; j++) {
        const P = ringPos(j);
        poolGeos.push(
          GEO.at(new THREE.CircleGeometry(1.5, 48).rotateX(-Math.PI / 2), [
            P.x,
            PED_TOP + 4e-3,
            P.z,
          ])
        );
      }
      poolGeos.push(
        GEO.at(
          new THREE.CircleGeometry(1.85, 48).rotateX(-Math.PI / 2),
          [0, 0.424, 0]
        )
      );
      const poolMat = new THREE.MeshBasicMaterial({
        map: poolTex,
        color: HDR(16772303, window.IO_LITE ? 1.6 : 0.7),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const pools = new THREE.Mesh(GEO.merge(poolGeos), poolMat);
      pools.renderOrder = 1;
      pools.visible = false;
      world.add(pools);
      const spotBeamGeos = [];
      for (let j = 0; j < N; j++) {
        const P = ringPos(j);
        spotBeamGeos.push(
          GEO.at(new THREE.CylinderGeometry(0.2, 1.5, 7.4, 40, 1, true), [
            P.x,
            PED_TOP + 3.7,
            P.z,
          ])
        );
      }
      const spotBeamMat = new THREE.ShaderMaterial({
        uniforms: {
          uO: { value: 0 },
          uC: { value: new THREE.Color(16773336) },
        },
        vertexShader: `varying float vY; varying float vF; void main(){ vY = uv.y; vec4 mv = modelViewMatrix * vec4(position, 1.0); vec3 n = normalize(normalMatrix * normal); vF = abs(dot(n, normalize(-mv.xyz))); gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `uniform float uO; uniform vec3 uC; varying float vY; varying float vF; void main(){ float a = uO * pow(vF, 1.6) * mix(0.3, 1.0, vY) * smoothstep(1.0, 0.86, vY); gl_FragColor = vec4(uC * a, a); }`,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const spotBeams = new THREE.Mesh(GEO.merge(spotBeamGeos), spotBeamMat);
      spotBeams.renderOrder = 2;
      spotBeams.visible = false;
      world.add(spotBeams);
      const contactTex = canvasTex(256, 256, (g, w, h) => {
        const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
        gr.addColorStop(0, "rgba(0,0,0,0.62)");
        gr.addColorStop(0.55, "rgba(0,0,0,0.3)");
        gr.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = gr;
        g.fillRect(0, 0, w, h);
      });
      const contactMat = new THREE.MeshBasicMaterial({
        map: contactTex,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      });
      const hub = new THREE.Group();
      world.add(hub);
      const hubMesh = new THREE.Mesh(
        GEO.lathe(
          [
            [0, 0],
            [1.9, 0],
            [1.96, 0.03],
            [1.98, 0.36],
            [1.88, 0.42],
            [0, 0.42],
          ],
          96
        ),
        pedMat
      );
      hubMesh.receiveShadow = true;
      hubMesh.castShadow = true;
      hub.add(hubMesh);
      const hubRing = new THREE.Mesh(
        GEO.torus(1.93, 0.016, 8, 160).rotateX(Math.PI / 2),
        MAT.led(3718648, 2.2)
      );
      hubRing.position.y = 0.39;
      hub.add(hubRing);
      const beamMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uOpacity: { value: 0.6 },
          uColor: { value: HDR(8246268, 1) },
        },
        vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform float uTime; uniform float uOpacity; uniform vec3 uColor; varying vec2 vUv; void main(){ float f = ((1.0 - vUv.y) * (1.0 - vUv.y)) * (0.55 + 0.45 * sin(vUv.y * 18.0 - uTime * 2.0)); float a = f * uOpacity * 0.45; gl_FragColor = vec4(uColor * a, a); }`,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const beam = new THREE.Mesh(GEO.cyl(0.62, 0.9, 1.4, 48, true), beamMat);
      beam.position.y = 0.42 + 0.7;
      hub.add(beam);
      const hubShadow = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4, 2.4).rotateX(-Math.PI / 2),
        contactMat
      );
      hubShadow.position.y = 0.425;
      hub.add(hubShadow);
      const devs = ORDER.map((id, j) => {
        let d;
        if (DEVICES[id]) d = DEVICES[id]();
        else {
          d = device(id);
          const ph = d.part(GEO.rbox(1.2, 0.9, 0.8, 0.08), MAT.anod(1713203), {
            pos: [0, 0.45, 0],
            edge: true,
            from: [0, 1.2, 0],
          });
          d.xray(ph.material);
          d.label(NAMES[j] + " · <em>in progress</em>", HUES[j], [0, 1.1, 0]);
        }
        finalizeDevice(d);
        const P = ringPos(j);
        d.root.position.set(P.x, PED_TOP, P.z);
        d.root.rotation.y = -angleOf(j) + Math.PI / 2;
        d.root.visible = false;
        world.add(d.root);
        const cs = new THREE.Mesh(
          new THREE.PlaneGeometry(d.footR * 2.4, d.footR * 2.4).rotateX(
            -Math.PI / 2
          ),
          contactMat
        );
        cs.position.set(P.x, PED_TOP + 3e-3, P.z);
        world.add(cs);
        d.contact = cs;
        d.index = j;
        d.slotMatrix = new THREE.Matrix4().compose(
          new THREE.Vector3(...d.slotSpec.pos),
          new THREE.Quaternion().setFromEuler(
            new THREE.Euler(...d.slotSpec.rot)
          ),
          new THREE.Vector3(
            d.slotSpec.scale,
            d.slotSpec.scale,
            d.slotSpec.scale
          )
        );
        d.tags = d.labels.map(L => {
          const w = new THREE.Vector3();
          return label(
            L.html,
            L.color,
            () => d.body.localToWorld(w.copy(L.pos)),
            T => {
              const p = T - (j + 1);
              return (
                sr(p, L.when[0], L.when[0] + 0.05) *
                (1 - sr(p, L.when[1] - 0.05, L.when[1]))
              );
            }
          );
        });
        return d;
      });
      const webDot = canvasTex(64, 64, (g, w, h) => {
        const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
        gr.addColorStop(0, "rgba(255,255,255,1)");
        gr.addColorStop(0.3, "rgba(255,255,255,0.65)");
        gr.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gr;
        g.fillRect(0, 0, w, h);
      });
      const WEB_VS = `attribute float aU; varying float vU; void main(){ vU = aU; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
      const WEB_FS = `uniform float uT; uniform float uO; uniform vec3 uC; varying float vU;
      void main(){ float pulse = smoothstep(0.78, 1.0, fract(vU * 2.4 - uT * 0.75)); float a = uO * (0.32 + 1.7 * pulse) * smoothstep(0.0, 0.05, vU); gl_FragColor = vec4(uC * a, a); }`;
      devs.forEach(d => {
        const s = new THREE.Vector3(...d.slotSpec.pos);
        const pos = [],
          us = [],
          ends = [],
          paths = [];
        d.labels.forEach((L, i) => {
          if (i === 0 || /EoS runs here|Built from/.test(L.html)) return;
          const e = L.pos.clone();
          const mid = s.clone().lerp(e, 0.5);
          mid.y += 0.1 + s.distanceTo(e) * 0.2;
          const pts = new THREE.QuadraticBezierCurve3(s, mid, e).getPoints(28);
          paths.push(pts);
          for (let k = 0; k < pts.length - 1; k++) {
            pos.push(
              pts[k].x,
              pts[k].y,
              pts[k].z,
              pts[k + 1].x,
              pts[k + 1].y,
              pts[k + 1].z
            );
            us.push(k / 28, (k + 1) / 28);
          }
          ends.push(e);
        });
        if (!pos.length) return;
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        g.setAttribute("aU", new THREE.Float32BufferAttribute(us, 1));
        const mat = new THREE.ShaderMaterial({
          vertexShader: WEB_VS,
          fragmentShader: WEB_FS,
          uniforms: {
            uT: { value: 0 },
            uO: { value: 0 },
            uC: { value: HDR(3462041, 2.3) },
          },
          transparent: true,
          depthTest: false,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const lines = new THREE.LineSegments(g, mat);
        lines.renderOrder = 6;
        lines.frustumCulled = false;
        ends.push(s.clone());
        const nm = new THREE.PointsMaterial({
          map: webDot,
          size: 0.12,
          color: HDR(3462041, 2.4),
          transparent: true,
          opacity: 0,
          depthTest: false,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        });
        const nodes = new THREE.Points(
          new THREE.BufferGeometry().setFromPoints(ends),
          nm
        );
        nodes.renderOrder = 7;
        nodes.frustumCulled = false;
        const PKN = 3,
          pkArr = new Float32Array(paths.length * PKN * 3);
        const pkGeo = new THREE.BufferGeometry();
        pkGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(pkArr, 3).setUsage(THREE.DynamicDrawUsage)
        );
        const pm = new THREE.PointsMaterial({
          map: webDot,
          size: 0.075,
          color: HDR(11006928, 3.2),
          transparent: true,
          opacity: 0,
          depthTest: false,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        });
        const packets = new THREE.Points(pkGeo, pm);
        packets.renderOrder = 8;
        packets.frustumCulled = false;
        const web = new THREE.Group();
        web.add(lines, nodes, packets);
        web.visible = false;
        ctx.fx(web);
        d.body.add(web);
        d.web = { web, mat, nm, pm, paths, pkArr, pkGeo, PKN };
      });
      const LITE = !!window.IO_LITE;
      const FIN_LIFT = new THREE.Color(0.095, 0.105, 0.13),
        _lift = new THREE.Color();
      let liftMats = null,
        liftAt = -1;
      function liftDesigns(fin) {
        if (Math.abs(fin - liftAt) < 4e-3) return;
        liftAt = fin;
        if (!liftMats) {
          const seen = new Set();
          liftMats = [];
          devs.forEach(d =>
            d.root.traverse(m => {
              if (!m.isMesh) return;
              for (const mt of Array.isArray(m.material)
                ? m.material
                : [m.material]) {
                if (!mt || !mt.emissive || seen.has(mt)) continue;
                seen.add(mt);
                liftMats.push({ m: mt, e: mt.emissive.clone() });
              }
            })
          );
        }
        _lift.copy(FIN_LIFT).multiplyScalar(fin);
        for (const L of liftMats) L.m.emissive.copy(L.e).add(_lift);
        renderer.toneMappingExposure = LITE
          ? 1.42 + 0.13 * Math.min(1, fin)
          : 1 + 0.45 * fin;
      }
      const _inv = new THREE.Matrix4(),
        _rel = new THREE.Matrix4();
      function bakeLod(d) {
        poseDevice(d, 1);
        d.spin.rotation.y = 0.4;
        d.root.updateMatrixWorld(true);
        _inv.copy(d.body.matrixWorld).invert();
        const shown = o => {
          for (let q = o; q && q !== d.body; q = q.parent)
            if (!q.visible) return false;
          return true;
        };
        const groups = new Map(),
          keep = [];
        d.body.traverse(m => {
          if (!m.isMesh || !shown(m) || (d.web && m.parent === d.web.web))
            return;
          if (
            m.isInstancedMesh ||
            Array.isArray(m.material) ||
            m.geometry.morphAttributes.position
          ) {
            keep.push(m);
            return;
          }
          const g = m.geometry,
            sig = Object.keys(g.attributes).sort().join(",");
          const key2 = m.material.uuid + "|" + sig;
          if (!groups.has(key2))
            groups.set(key2, { mat: m.material, geos: [], cast: m.castShadow });
          _rel.multiplyMatrices(_inv, m.matrixWorld);
          const cg = (g.index ? g.toNonIndexed() : g.clone()).applyMatrix4(
            _rel
          );
          for (const k of Object.keys(cg.attributes))
            if (
              !["position", "normal", "uv", "color", "uv1", "tangent"].includes(
                k
              ) &&
              !sig.includes(k)
            )
              cg.deleteAttribute(k);
          groups.get(key2).geos.push(cg);
        });
        const lod = new THREE.Group();
        for (const { mat, geos, cast } of groups.values()) {
          const merged =
            geos.length > 1 ? mergeGeometries(geos, false) : geos[0];
          if (!merged) continue;
          const mm = new THREE.Mesh(merged, mat);
          mm.castShadow = cast;
          mm.receiveShadow = true;
          lod.add(mm);
        }
        for (const m of keep) {
          const c = m.clone();
          c.matrixAutoUpdate = false;
          c.matrix.multiplyMatrices(_inv, m.matrixWorld);
          lod.add(c);
        }
        lod.matrixAutoUpdate = false;
        lod.matrix.copy(d.body.matrix);
        lod.visible = false;
        d.spin.add(lod);
        d.lod = lod;
        d.lodN = lod.children.length;
      }
      devs.forEach(bakeLod);
      const ST_LABEL = {
        code: "Working code",
        part: "In code, partial",
        docs: "Docs, descriptor or stub",
        none: "Not in the repos yet",
      };
      const esc = t =>
        String(t)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
      const card = (kicker, title, detail, eos, st) =>
        `<span class="hk">${esc(kicker)}</span><b>${esc(title)}</b>${detail ? `<p>${esc(detail)}</p>` : ""}<div class="he"><i>EoS</i>${esc(eos)}</div><span class="hs s-${st}">${ST_LABEL[st] || ""}</span>`;
      devs.forEach((d, j) => {
        const H = HOVER[ORDER[j]] || {},
          W = HOVER_WHAT[ORDER[j]] || ["", "", ""];
        const inCh = T => {
          const p = T - (j + 1);
          return p > 0.3 && p < 0.97 ? 1 : 0;
        };
        const hero = new THREE.Vector3();
        if (H._)
          ctx.hoverable({
            pos: v => d.root.localToWorld(v.set(0, d.frameSpec.targetY, 0)),
            r: 170,
            pen: 55,
            color: HUES[j],
            when: T => (inCh(T) || T > FIN + 0.15 ? 1 : 0),
            html: card(
              NAMES[j] + " · EoS profile: " + W[2],
              W[0],
              W[1],
              H._[0],
              H._[1]
            ),
          });
        d.labels.forEach(L => {
          const plain = L.html.replace(/<[^>]+>/g, "");
          const parts = plain.split(" · ");
          const key2 = parts[0].trim();
          const note = H[key2];
          if (!note) return;
          const w = new THREE.Vector3();
          ctx.hoverable({
            pos: v => d.body.localToWorld(v.copy(L.pos)),
            r: 90,
            color: L.color || HUES[j],
            when: inCh,
            html: card(
              NAMES[j],
              key2,
              parts.slice(1).join(" · "),
              note[0],
              note[1]
            ),
          });
        });
      });
      HOVER_ROBOT.forEach(([a, title, spec, eos, st, col]) => {
        ctx.hoverable({
          pos: v => robot.anchorWorld(a, v),
          r: 46,
          color: col,
          when: T => (T > RB0 + 0.55 && T < FIN + 2 ? 1 : 0),
          html: card("Full-body robot · concept", title, spec, eos, st),
        });
      });
      const finaleTags = devs.map((d, j) => {
        const w = new THREE.Vector3();
        return label(
          NAMES[j],
          HUES[j],
          () => {
            ringPos(j, w);
            w.y = PED_TOP + 2 + (j % 2) * 0.75;
            return w;
          },
          PORTRAIT ? () => 0 : win(FIN + 0.12, FIN + 2, 0.08)
        );
      });
      const board = buildBoard();
      world.add(board.g);
      label(
        "Core board",
        "#38BDF8",
        () => board.g.localToWorld(tmpV.set(0.2, 0.12, 0.25)),
        T => sr(T, 0.1, 0.16) * (1 - sr(T, 0.7, 0.76))
      );
      const PSI = Math.PI / 2 - (angleOf(N - 1) - 0.45);
      const robot = buildRobot({ psi: PSI, hubTop: 0.42, contactTex });
      robot.root.visible = robot.stage.visible = false;
      world.add(robot.root, robot.stage);
      robot.fxRoots.forEach(r => scene.add(r));
      {
        const solids = [];
        devs.forEach((d, j) => {
          d.spin.rotation.y = 0.4;
          d.root.updateMatrixWorld(true);
          solids.push({ box: new THREE.Box3().setFromObject(d.root) });
          const P = ringPos(j);
          solids.push({ cx: P.x, cz: P.z, r: 1.58, h: PED_TOP });
        });
        robot.prepareCloud(solids).forEach(o => scene.add(o));
      }
      const RB_TAGS = [
        [
          "eVision-4K · <em>stereo eyes + depth</em>",
          "#22D3EE",
          "eyes",
          0,
          0.6,
          0.8,
        ],
        ["eLiDAR-360 · <em>the crown</em>", "#5EEAD4", "lidar", 0, 0.62, 0.8],
        ["eGripper-3F · <em>each hand</em>", "#A78BFA", "handL", 0, 0.64, 0.8],
        [
          "eServo-200 ×26 · <em>every rotary joint</em>",
          "#A78BFA",
          "elL",
          0,
          0.66,
          0.8,
        ],
        [
          "eActuator-50 ×4 · <em>ankle push rods</em>",
          "#A78BFA",
          "actL",
          0,
          0.68,
          0.8,
        ],
        [
          "eActuator-50 · <em>pushes the ankle</em>",
          "#A78BFA",
          "actL",
          2,
          0.3,
          0.54,
        ],
      ];
      RB_TAGS.forEach(([html, col, a, k, t0, t1]) => {
        const w = new THREE.Vector3();
        label(
          html,
          col,
          () => robot.anchorWorld(a, w),
          PORTRAIT ? () => 0 : win(RB0 + k + t0, RB0 + k + t1, 0.04)
        );
      });
      {
        const w = new THREE.Vector3();
        label(
          "Full-body robot · <em>EoS in every joint</em>",
          "#34D399",
          () => robot.anchorWorld("headA", w).add(tmpV.set(0, 0.35, 0)),
          win(FIN + 0.12, FIN + 2, 0.08)
        );
      }
      const rootWorld = (z, out) =>
        out.set(Math.sin(PSI) * z, 0, Math.cos(PSI) * z);
      S.dbgRobot = robot;
      function robotSlot(out) {
        robot.slot.matrixWorld.decompose(out.p, out.q, tmpS);
        out.s = tmpS.x;
        return out;
      }
      const HUB_Y = 1.3;
      const tmpM = new THREE.Matrix4(),
        tmpQ = new THREE.Quaternion(),
        tmpS = new THREE.Vector3();
      const bpA = { p: new THREE.Vector3(), q: new THREE.Quaternion(), s: 1 },
        bpB = { p: new THREE.Vector3(), q: new THREE.Quaternion(), s: 1 };
      function hubPose(out, time) {
        out.p.set(0, HUB_Y + 0.05 * Math.sin(time * 0.9), 0);
        out.q.setFromEuler(new THREE.Euler(0.35, time * 0.25, -0.12));
        out.s = 1.55;
        return out;
      }
      function slotPose(j, out) {
        const d = devs[j];
        d.body.updateMatrixWorld(true);
        tmpM.multiplyMatrices(d.body.matrixWorld, d.slotMatrix);
        tmpM.decompose(out.p, out.q, tmpS);
        out.s = tmpS.x;
        return out;
      }
      function placeBoard(T, time) {
        let A,
          B,
          u = 0,
          arc = 1.6;
        if (T < 0.8) A = hubPose(bpA, time);
        else if (T < 1) {
          A = hubPose(bpA, time);
          B = slotPose(0, bpB);
          u = easeInOut(range(T, 0.8, 1));
        } else if (T >= RB0) {
          const p = T - RB0;
          if (p < 0.3) A = hubPose(bpA, time);
          else if (p < 0.46) {
            A = hubPose(bpA, time);
            B = robotSlot(bpB);
            u = easeInOut(range(p, 0.3, 0.46));
            arc = 0.3;
          } else A = robotSlot(bpA);
        } else {
          const c = Math.floor(T),
            p = T - c,
            j = c - 1;
          A = slotPose(j, bpA);
          if (p > 0.8) {
            B = j + 1 < N ? slotPose(j + 1, bpB) : hubPose(bpB, time);
            u = easeInOut(range(p, 0.8, 1));
          }
        }
        if (B && u > 0) {
          board.g.position.lerpVectors(A.p, B.p, u);
          board.g.position.y += Math.sin(u * Math.PI) * arc;
          board.g.quaternion.slerpQuaternions(A.q, B.q, u);
          board.g.scale.setScalar(lerp(A.s, B.s, u));
        } else {
          board.g.position.copy(A.p);
          board.g.quaternion.copy(A.q);
          board.g.scale.setScalar(A.s);
        }
      }
      const camPos = new THREE.Vector3(),
        camTgt = new THREE.Vector3();
      const pa = { c: new THREE.Vector3(), t: new THREE.Vector3(), fov: 32 },
        pb = { c: new THREE.Vector3(), t: new THREE.Vector3(), fov: 32 };
      function devicePose(j, yaw, out) {
        const d = devs[j],
          f = d.frameSpec,
          th = angleOf(j),
          P = ringPos(j, tmpV);
        const dist = f.dist * (PORTRAIT ? 1.45 : 1.16);
        out.c.set(
          P.x + Math.cos(th + yaw) * dist,
          PED_TOP + f.height * (PORTRAIT ? 1.2 : 1),
          P.z + Math.sin(th + yaw) * dist
        );
        out.t.set(P.x, PED_TOP + f.targetY, P.z);
        out.fov = f.fov;
        return out;
      }
      function introPose(u, out) {
        const th = angleOf(0) + Math.PI / N;
        const yaw = lerp(-0.3, 0.2, u);
        const r = PORTRAIT ? 4.9 : 3.9;
        out.c.set(Math.cos(th + yaw) * r, HUB_Y + 0.55, Math.sin(th + yaw) * r);
        out.t.set(0, HUB_Y - 0.05, 0);
        out.fov = 30;
        return out;
      }
      function finalePose(time, u, out) {
        const th = angleOf(N - 1) - 0.6 - u * 0.5 - time * 0.02;
        const r = lerp(38, 37, u) * (PORTRAIT ? (LITE ? 1.12 : 1.35) : 1);
        out.c.set(
          Math.cos(th) * r,
          lerp(21, 27, u) * (PORTRAIT ? (LITE ? 1.05 : 1.25) : 1),
          Math.sin(th) * r
        );
        const k = PORTRAIT ? 0 : 1.5;
        out.t.set(
          -Math.sin(th) * k,
          PORTRAIT ? (LITE ? -1.2 : -7.5) : -0.6,
          Math.cos(th) * k
        );
        out.fov = 37;
        return out;
      }
      const RCAM = [
        [
          [0, [2.9, 2.5, 6.6], [0, 1.25, 0], 34],
          [0.28, [1.5, 2.15, 3.6], [0, 1.55, 0.1], 32],
          [0.46, [0.75, 2, 2.15], [0, 1.62, 0.12], 30],
          [0.8, [-1.9, 2, 4.6], [0, 1.25, 0], 33],
        ],
        [
          [0, [-1.9, 2, 4.6], [0, 1.25, 0], 33],
          [0.28, [-1.1, 2.45, 2.6], [0, 2, 0.2], 30],
          [0.5, [0.85, 2.35, 1.75], [0, 2.05, 0.45], 30, 1],
          [0.62, [5.5, 6.5, 8.5], [0, 1.2, 1.5], 40],
          [0.8, [7.5, 9.5, 10.5], [0, 0.6, 2], 42],
        ],
        [
          [0, [3.6, 2, 2.4], [0, 1.2, 0.3], 34],
          [0.3, [2.3, 0.95, 0.9], [0, 0.62, 0.15], 32],
          [0.55, [2.9, 1.7, 2.9], [0, 0.95, 0.3], 34],
          [0.8, [3.2, 2.3, 3.6], [0, 1.05, 0.2], 34],
        ],
        [
          [0, [-2.6, 2.2, 3.2], [-0.2, 1.42, 0.4], 34],
          [0.3, [-2.35, 2.05, 2.6], [-0.36, 1.52, 0.5], 32],
          [0.44, [-2.05, 2.1, 2.6], [-0.28, 1.6, 0.5], 32],
          [0.53, [-0.95, 2.2, 2.8], [-0.12, 1.8, 0.45], 31],
          [0.62, [0.45, 2.3, 1.9], [-0.06, 1.96, 0.44], 30],
          [0.8, [1.7, 2.1, 2.7], [0, 1.45, 0.5], 32],
        ],
        [
          [0, [0.2, 2, 4.3], [0, 1.45, 0], 34],
          [0.3, [1.4, 1.9, 3.1], [0, 1.5, 0], 33],
          [0.56, [-0.8, 2.6, 2.7], [0, 1.75, 0.1], 34],
          [0.8, [0.3, 2.2, 4.4], [0, 1.4, 0], 34],
        ],
      ];
      const rc = new THREE.Vector3(),
        rt = new THREE.Vector3();
      const toWorldR = (v, zr, out) => {
        const c = Math.cos(PSI),
          s = Math.sin(PSI);
        return out.set(
          v.x * c + v.z * s + s * zr,
          v.y + 0.42,
          -v.x * s + v.z * c + c * zr
        );
      };
      const camTan = (keys, k, get) =>
        k === 0 || k === keys.length - 1 || keys[k][4]
          ? 0
          : (get(keys[k + 1]) - get(keys[k - 1])) /
            (keys[k + 1][0] - keys[k - 1][0]);
      const camHerm = (keys, i, u, get) => {
        const a = keys[i],
          b = keys[i + 1],
          dp = b[0] - a[0],
          u2 = u * u,
          u3 = u2 * u;
        return (
          (2 * u3 - 3 * u2 + 1) * get(a) +
          (u3 - 2 * u2 + u) * dp * camTan(keys, i, get) +
          (-2 * u3 + 3 * u2) * get(b) +
          (u3 - u2) * dp * camTan(keys, i + 1, get)
        );
      };
      const G_C = [0, 1, 2].map(n => K => K[1][n]),
        G_T = [0, 1, 2].map(n => K => K[2][n]),
        G_F = K => K[3];
      function robotPose(k, p, out) {
        const keys = RCAM[k];
        const q = Math.min(Math.max(p, keys[0][0]), keys[keys.length - 1][0]);
        let i = 0;
        while (i < keys.length - 2 && q > keys[i + 1][0]) i++;
        const u = range(q, keys[i][0], keys[i + 1][0]);
        const zr = robot.rootZ(k, p);
        const pm = PORTRAIT ? 1.35 : 1;
        rc.set(
          camHerm(keys, i, u, G_C[0]) * pm,
          camHerm(keys, i, u, G_C[1]) * (PORTRAIT ? 1.1 : 1),
          camHerm(keys, i, u, G_C[2]) * pm
        );
        rt.set(
          camHerm(keys, i, u, G_T[0]),
          camHerm(keys, i, u, G_T[1]),
          camHerm(keys, i, u, G_T[2])
        );
        toWorldR(rc, zr, out.c);
        toWorldR(rt, zr, out.t);
        out.fov = camHerm(keys, i, u, G_F);
        return out;
      }
      const toPolar = v => ({
        a: Math.atan2(v.z, v.x),
        r: Math.hypot(v.x, v.z),
        y: v.y,
      });
      function blend(A, B, u, lift, out, back = 0) {
        const a = toPolar(A.c),
          b = toPolar(B.c),
          at = toPolar(A.t),
          bt = toPolar(B.t);
        let da = b.a - a.a;
        while (da > Math.PI) da -= TAU;
        while (da < -Math.PI) da += TAU;
        let dt2 = bt.a - at.a;
        while (dt2 > Math.PI) dt2 -= TAU;
        while (dt2 < -Math.PI) dt2 += TAU;
        const arc = Math.sin(u * Math.PI);
        const ang = a.a + da * u,
          r = lerp(a.r, b.r, u) + arc * back,
          y = lerp(a.y, b.y, u) + arc * lift;
        out.c.set(Math.cos(ang) * r, y, Math.sin(ang) * r);
        const tang = at.a + dt2 * u,
          tr = lerp(at.r, bt.r, u);
        out.t.set(
          Math.cos(tang) * tr,
          lerp(at.y, bt.y, u) + arc * lift * 0.25,
          Math.sin(tang) * tr
        );
        out.fov = lerp(A.fov, B.fov, u) + arc * 4;
        return out;
      }
      const res = { c: new THREE.Vector3(), t: new THREE.Vector3(), fov: 32 };
      function cameraPose(T, time) {
        if (S.reduce) {
          const c2 = Math.min(FIN, Math.floor(T + 0.02));
          if (c2 === 0) return introPose(0.5, res);
          if (c2 >= FIN) return finalePose(0, 1, res);
          if (c2 >= RB0) return robotPose(c2 - RB0, 0.5, res);
          return devicePose(
            c2 - 1,
            (devs[c2 - 1].frameSpec.yaw0 + devs[c2 - 1].frameSpec.yaw1) / 2,
            res
          );
        }
        if (T < 0.8) return introPose(easeInOutSine(range(T, 0, 0.8)), res);
        if (T < 1)
          return blend(
            introPose(1, pa),
            devicePose(0, devs[0].frameSpec.yaw0, pb),
            easeInOut(range(T, 0.8, 1)),
            2.6,
            res
          );
        if (T >= FIN)
          return finalePose(time, easeInOutSine(range(T, FIN, FIN + 0.8)), res);
        if (T >= RB0) {
          const k = Math.min(RBN - 1, Math.floor(T - RB0)),
            p2 = T - RB0 - k;
          if (p2 <= 0.8) return robotPose(k, p2, res);
          const A2 = robotPose(k, 0.8, pa);
          const B2 =
            k + 1 < RBN ? robotPose(k + 1, 0, pb) : finalePose(time, 0, pb);
          return blend(
            A2,
            B2,
            easeInOut(range(p2, 0.8, 1)),
            k + 1 < RBN ? 0.5 : 0,
            res,
            0
          );
        }
        const c = Math.floor(T),
          p = T - c,
          j = c - 1,
          f = devs[j].frameSpec;
        if (p <= 0.8)
          return devicePose(
            j,
            lerp(f.yaw0, f.yaw1, easeInOutSine(range(p, 0, 0.8))),
            res
          );
        const A = devicePose(j, f.yaw1, pa);
        const B =
          j + 1 < N
            ? devicePose(j + 1, devs[j + 1].frameSpec.yaw0, pb)
            : robotPose(0, 0, pb);
        return blend(
          A,
          B,
          easeInOut(range(p, 0.8, 1)),
          j + 1 < N ? 2.4 : 1.2,
          res,
          j + 1 < N ? 3.2 : 0
        );
      }
      const ORB = {
        yaw: 0,
        pitch: 0,
        yawT: 0,
        pitchT: 0,
        vy: 0,
        vp: 0,
        sy: 0,
        sp: 0,
        drag: null,
        hist: [],
        lastT: null,
      };
      S.dbgOrbit = ORB;
      S.dbgCam = camera;
      const HTML = HS;
      const canvasEl = renderer.domElement;
      const orbitOK = () =>
        !S.capture &&
        !HTML.classList.contains("clean") &&
        !HTML.classList.contains("no-gl");
      const orbRate = () => (2 * Math.PI) / Math.max(620, innerWidth * 0.62);
      canvasEl.style.touchAction = "pan-y pinch-zoom";
      if (orbitOK()) HTML.classList.add("can-orbit");
      const endDrag = inertia => {
        const g = ORB.drag;
        if (!g) return;
        ORB.drag = null;
        S.orbitDrag = false;
        HTML.classList.remove("orbiting");
        if (g.locked && inertia && !S.reduce) {
          const now = performance.now(),
            h = ORB.hist.filter(s => now - s[0] < 90);
          if (h.length > 1 && now - h[h.length - 1][0] < 60) {
            const a = h[0],
              z = h[h.length - 1],
              span = Math.max(16, z[0] - a[0]) / 1e3;
            ORB.vy = THREE.MathUtils.clamp((z[1] - a[1]) / span, -9, 9);
            ORB.vp = THREE.MathUtils.clamp((z[2] - a[2]) / span, -4, 4);
          }
        }
        ORB.hist.length = 0;
      };
      __on(window, "pointerdown", e => {
        if (
          !orbitOK() ||
          e.target !== canvasEl ||
          (e.pointerType === "mouse" && e.button !== 0)
        )
          return;
        endDrag(false);
        ORB.vy = ORB.vp = 0;
        ORB.drag = {
          id: e.pointerId,
          x: e.clientX,
          y: e.clientY,
          ax: 0,
          ay: 0,
          touch: e.pointerType !== "mouse",
          locked: e.pointerType === "mouse",
        };
        if (e.pointerType === "mouse") {
          e.preventDefault();
          HTML.classList.add("orbiting");
          S.orbitDrag = true;
          try {
            canvasEl.setPointerCapture(e.pointerId);
          } catch (_) {}
        }
      });
      __on(
        window,
        "pointermove",
        e => {
          const g = ORB.drag;
          if (!g || e.pointerId !== g.id) return;
          const dx = e.clientX - g.x,
            dy = e.clientY - g.y;
          g.x = e.clientX;
          g.y = e.clientY;
          if (!g.locked) {
            g.ax += dx;
            g.ay += dy;
            if (Math.abs(g.ay) > 9 && Math.abs(g.ay) > Math.abs(g.ax))
              return endDrag(false);
            if (Math.abs(g.ax) < 9 || Math.abs(g.ax) < Math.abs(g.ay) * 1.2)
              return;
            g.locked = true;
            S.orbitDrag = true;
            HTML.classList.add("orbiting");
          }
          if (S.hoverReset) S.hoverReset();
          const k = orbRate();
          ORB.yawT -= dx * k;
          if (!g.touch)
            ORB.pitchT = THREE.MathUtils.clamp(
              ORB.pitchT + dy * k * 0.7,
              -0.95,
              0.95
            );
          ORB.hist.push([performance.now(), ORB.yawT, ORB.pitchT]);
          if (ORB.hist.length > 12) ORB.hist.shift();
        },
        { passive: true }
      );
      __on(
        window,
        "pointerup",
        e => ORB.drag && e.pointerId === ORB.drag.id && endDrag(true)
      );
      __on(
        window,
        "pointercancel",
        e => ORB.drag && e.pointerId === ORB.drag.id && endDrag(false)
      );
      __on(window, "blur", () => endDrag(false));
      __on(window, "keydown", e => {
        if (
          !orbitOK() ||
          e.altKey ||
          e.ctrlKey ||
          e.metaKey ||
          (e.key !== "ArrowLeft" && e.key !== "ArrowRight")
        )
          return;
        const t = e.target;
        if (
          t &&
          t.closest &&
          t.closest("input, textarea, select, [contenteditable]")
        )
          return;
        ORB.yawT += (e.key === "ArrowLeft" ? 1 : -1) * 0.42;
      });
      const springTo = (o, x, v, target, w, dt) => {
        const d = o[x] - target,
          e = Math.exp(-w * dt),
          t = (o[v] + w * d) * dt;
        o[x] = target + (d + t) * e;
        o[v] = (o[v] - w * t) * e;
      };
      function orbitStep(T, dt) {
        if (ORB.lastT !== null && !ORB.drag) {
          const dT = Math.abs(T - ORB.lastT);
          if (dT > 1e-6) {
            const n = Math.round(ORB.yawT / TAU) * TAU;
            ORB.yawT -= n;
            ORB.yaw -= n;
            const f = Math.exp(-dT * 9);
            ORB.yawT *= f;
            ORB.pitchT *= f;
            ORB.vy *= f;
            ORB.vp *= f;
          }
        }
        ORB.lastT = T;
        if (!ORB.drag && (ORB.vy || ORB.vp)) {
          ORB.yawT += ORB.vy * dt;
          ORB.pitchT = THREE.MathUtils.clamp(
            ORB.pitchT + ORB.vp * dt,
            -0.95,
            0.95
          );
          const f = Math.exp(-dt * 2.4);
          ORB.vy *= f;
          ORB.vp *= f;
          if (Math.abs(ORB.vy) < 4e-3) ORB.vy = 0;
          if (Math.abs(ORB.vp) < 4e-3) ORB.vp = 0;
        }
        const w = S.reduce ? 30 : 15;
        springTo(ORB, "yaw", "sy", ORB.yawT, w, dt);
        springTo(ORB, "pitch", "sp", ORB.pitchT, w, dt);
        const settled =
          Math.abs(ORB.yaw - ORB.yawT) < 1e-4 &&
          Math.abs(ORB.pitch - ORB.pitchT) < 1e-4 &&
          Math.abs(ORB.sy) < 1e-4 &&
          Math.abs(ORB.sp) < 1e-4;
        if (settled) {
          ORB.yaw = ORB.yawT;
          ORB.pitch = ORB.pitchT;
          ORB.sy = ORB.sp = 0;
          if (Math.abs(ORB.yawT) < 1e-4 && Math.abs(ORB.pitchT) < 1e-4)
            ORB.yaw = ORB.yawT = ORB.pitch = ORB.pitchT = 0;
        }
        S.orbitBusy = !!ORB.drag || !settled || !!ORB.vy || !!ORB.vp;
      }
      const _off = new THREE.Vector3();
      function orbitApply(r) {
        if (Math.abs(ORB.yaw) < 1e-5 && Math.abs(ORB.pitch) < 1e-5) return;
        _off.subVectors(r.c, r.t);
        const rad = _off.length();
        if (rad < 1e-4) return;
        const th = Math.atan2(_off.x, _off.z) + ORB.yaw;
        const el0 = Math.asin(THREE.MathUtils.clamp(_off.y / rad, -1, 1));
        let el = el0 + ORB.pitch;
        el =
          ORB.pitch > 0
            ? Math.min(el, Math.max(el0, 1.3))
            : Math.max(el, Math.min(el0, -0.05));
        const h = Math.cos(el) * rad;
        r.c.set(
          r.t.x + Math.sin(th) * h,
          Math.max(0.62, r.t.y + Math.sin(el) * rad),
          r.t.z + Math.cos(th) * h
        );
      }
      const orbitWeight = () =>
        smooth(
          Math.min(1, (Math.abs(ORB.yaw) + Math.abs(ORB.pitch) * 0.6) / 0.32)
        );
      function cameraFn(T, time, dt = 0.016) {
        const r = cameraPose(T, time);
        if (S.camOverride) {
          r.c.set(...S.camOverride.c);
          r.t.set(...S.camOverride.t);
          r.fov = S.camOverride.fov || 32;
        } else {
          orbitStep(T, Math.min(dt, 0.05));
          orbitApply(r);
        }
        let fov = r.fov;
        if (camera.aspect < 0.95)
          fov = THREE.MathUtils.radToDeg(
            2 *
              Math.atan(
                (Math.tan(THREE.MathUtils.degToRad(fov) / 2) * 0.95) /
                  camera.aspect
              )
          );
        camPos.copy(r.c);
        camTgt.copy(r.t);
        camera.position.copy(camPos);
        camera.lookAt(camTgt);
        if (Math.abs(camera.fov - fov) > 1e-3) {
          camera.fov = fov;
          camera.updateProjectionMatrix();
        }
        sky.position.copy(camera.position);
      }
      const spotReach = j => Math.max(1.9, devs[j].footR * 1.25);
      key.intensity = 0;
      key.castShadow = false;
      const keySpot = new THREE.SpotLight(16773342, 0, 0, 0.34, 0.45, 0);
      keySpot.castShadow = !window.IO_LITE;
      keySpot.shadow.mapSize.set(1024, 1024);
      keySpot.shadow.camera.near = 2;
      keySpot.shadow.camera.far = 70;
      keySpot.shadow.bias = -2e-4;
      keySpot.shadow.normalBias = 0.02;
      keySpot.shadow.radius = 4;
      const rimSpot = new THREE.SpotLight(10275583, 0, 0, 0.4, 0.5, 0);
      const fillSpot = new THREE.SpotLight(12900607, 0, 0, 0.4, 0.6, 0);
      scene.add(keySpot, keySpot.target);
      if (!LOW) scene.add(rimSpot, rimSpot.target, fillSpot, fillSpot.target);
      bloom.threshold = 1.32;
      const focusB = new THREE.Vector3(),
        rigD = new THREE.Vector3(),
        rigR = new THREE.Vector3(),
        rigP = new THREE.Vector3();
      const FIN_KEY = new THREE.Vector3(5, 34, 7),
        ORIGIN = new THREE.Vector3();
      const KEY_D = Math.hypot(4.6, 3.6, 9.6),
        RIM_D = Math.hypot(7.5, 3.2, 5.2),
        FILL_D = Math.hypot(5.5, 5, 4.2);
      function aimRig(f, reach, fin) {
        rigD.set(camera.position.x - f.x, 0, camera.position.z - f.z);
        if (rigD.lengthSq() < 1e-6) rigD.set(0, 0, 1);
        rigD.normalize();
        rigR.set(rigD.z, 0, -rigD.x);
        rigP
          .copy(f)
          .addScaledVector(rigD, 4.6)
          .addScaledVector(rigR, 3.6)
          .setY(f.y + 9.6);
        keySpot.position.lerpVectors(rigP, FIN_KEY, fin);
        keySpot.target.position.lerpVectors(f, ORIGIN, fin);
        const outer = reach + 1.2;
        keySpot.angle = lerp(
          Math.atan(outer / KEY_D),
          Math.atan(15.5 / 34.7),
          fin
        );
        keySpot.penumbra = lerp(
          1 - Math.atan(reach / KEY_D) / Math.atan(outer / KEY_D),
          0.28,
          fin
        );
        keySpot.intensity = lerp(2.35, 3.1, fin);
        rimSpot.position
          .copy(f)
          .addScaledVector(rigD, -7.5)
          .addScaledVector(rigR, -3.2)
          .setY(f.y + 5.2);
        rimSpot.target.position.copy(f);
        rimSpot.angle = Math.atan((reach + 1) / RIM_D);
        rimSpot.intensity = 2.2 * (1 - fin);
        fillSpot.position
          .copy(f)
          .addScaledVector(rigD, 5.5)
          .addScaledVector(rigR, -5)
          .setY(f.y + 4.2);
        fillSpot.target.position.copy(f);
        fillSpot.angle = Math.atan((reach + 1) / FILL_D);
        fillSpot.intensity = 0.5 * (1 - fin);
        rim.intensity = lerp(LOW ? 1.1 : 0.3, 1.6, fin);
        fill.intensity = lerp(
          LOW ? 0.3 : LITE ? 2 : 0.04,
          LITE ? 2.6 : 2.1,
          fin
        );
        scene.environmentIntensity = LITE
          ? lerp(1.9, 3.2, fin)
          : lerp(0.95, 2.6, fin);
      }
      const _sa = new THREE.Vector3();
      function stepAside(d, j) {
        const P = ringPos(j, _sa),
          ax = camPos.x,
          az = camPos.z,
          vx = camTgt.x - ax,
          vz = camTgt.z - az,
          L2 = vx * vx + vz * vz;
        let u = L2 > 1e-6 ? ((P.x - ax) * vx + (P.z - az) * vz) / L2 : 0;
        if (u > 1) return 1;
        u = Math.max(0, u);
        const dist = Math.hypot(P.x - (ax + vx * u), P.z - (az + vz * u)),
          r = d.footR;
        return smooth(
          THREE.MathUtils.clamp((dist - r * 0.8) / (r * 0.75 + 0.9), 0, 1)
        );
      }
      const focus = new THREE.Vector3();
      const XRAY_COL = new THREE.Color(66e4),
        XRAY_EM = HDR(3718648, 0.12);
      let lastFinaleShadow = -1,
        shadowTick = 0,
        lastShadowT = -1;
      function update(T, time, dt) {
        grain.uniforms.uTime.value = time;
        beamMat.uniforms.uTime.value = time;
        const fin = sr(T, FIN - 0.2, FIN + 0.3);
        const cur = T - 1;
        const ow = orbitWeight();
        const focusJ =
          T >= 1 && T < RB0 ? Math.min(N - 1, Math.floor(cur)) : -1;
        devs.forEach((d, j) => {
          const p = T - (j + 1);
          const near = j >= Math.floor(cur) - 2 && j <= Math.ceil(cur) + 1;
          d.root.visible =
            near ||
            fin > 1e-3 ||
            (T < 1.2 && j <= 1) ||
            T > RB0 - 0.3 ||
            (ow > 0.01 && p > 1.02 && !!d.lod);
          let s = 1;
          if (ow > 1e-3 && j !== focusJ && d.root.visible)
            s = 1 - ow * (1 - stepAside(d, j));
          if (s !== d._sa) {
            d._sa = s;
            d.root.scale.setScalar(Math.max(s, 1e-3));
            d.contact.scale.setScalar(Math.max(s, 1e-3));
          }
          if (s < 0.01) d.root.visible = false;
          if (!d.root.visible) return;
          const far = !!d.lod && (T > RB0 - 0.25 || fin > 1e-3 || p > 1.02);
          if (d.lod) {
            d.lod.visible = far;
            d.body.visible = !far;
          }
          if (far) {
            d.contact.visible = true;
            d.spin.rotation.y = 0.4;
            if (d.edgeMat) d.edgeMat.opacity = 0;
            return;
          }
          const a = p <= 0 ? 0 : easeInOut(range(p, 0.02, LITE ? 0.2 : 0.46));
          poseDevice(d, fin > 0.5 ? 1 : a);
          d.spin.rotation.y = -0.4 + 0.8 * easeInOutSine(range(p, 0.02, 0.95));
          const x =
            sr(p, 0.5, 0.56) *
            (1 - sr(p, 0.72, 0.78)) *
            (1 - fin) *
            (LITE ? 0 : 1);
          if (x > 1e-3 || d.xrayOn) {
            d.xrayOn = x > 1e-3;
            d.xrayMats.forEach(m => {
              const u = m.userData;
              m.opacity = u.base * (1 - 0.86 * x);
              m.envMapIntensity = u.env * (1 - 0.92 * x);
              if (u.color) m.color.copy(u.color).lerp(XRAY_COL, x);
              if ("metalness" in m) m.metalness = lerp(u.metal, 0.05, x);
              if ("roughness" in m) m.roughness = lerp(u.rough, 0.75, x);
              if (u.em) m.emissive.copy(u.em).lerp(XRAY_EM, x);
              m.depthWrite = x < 0.02;
            });
          }
          d.edgeMat.opacity = (1 - a) * 0.55 * (1 - fin) + 0.16 * x;
          d.contact.visible = d.root.visible;
          if (d.web) {
            const o = sr(p, 0.5, 0.56) * (1 - sr(p, 0.76, 0.8)) * (1 - fin);
            d.web.web.visible = o > 0.01;
            if (d.web.web.visible) {
              const W = d.web;
              W.mat.uniforms.uO.value = o;
              W.mat.uniforms.uT.value = time;
              W.nm.opacity = o;
              W.pm.opacity = o;
              W.paths.forEach((pts, pi) => {
                for (let q = 0; q < W.PKN; q++) {
                  const u = (time * 0.42 + q / W.PKN + pi * 0.17) % 1,
                    x2 = u * (pts.length - 1),
                    i0 = Math.floor(x2),
                    f = x2 - i0;
                  const a2 = pts[i0],
                    c = pts[Math.min(pts.length - 1, i0 + 1)],
                    o3 = (pi * W.PKN + q) * 3;
                  W.pkArr[o3] = a2.x + (c.x - a2.x) * f;
                  W.pkArr[o3 + 1] = a2.y + (c.y - a2.y) * f;
                  W.pkArr[o3 + 2] = a2.z + (c.z - a2.z) * f;
                }
              });
              W.pkGeo.attributes.position.needsUpdate = true;
            }
          }
          const hero = sr(p, 0.4, 0.5) * (1 - sr(p, 0.82, 0.92));
          for (const fn of d.anims) fn(p, time, dt, { a, x, hero, fin });
        });
        const rk = T < RB0 ? -1 : T >= FIN ? RBN : Math.floor(T - RB0),
          rp = T < RB0 ? 0 : T >= FIN ? T - FIN : T - RB0 - rk;
        const robotOn = T > RB0 - 0.3;
        robot.root.visible = robot.stage.visible = robotOn;
        hubShadow.visible = !robotOn;
        if (robotOn) robot.update(rk, rp, time, dt);
        else robot.hide();
        placeBoard(T, time);
        board.led.material.color
          .setScalar(0)
          .add(HDR(16486972, 2.5 + 1.5 * Math.sin(time * 3)));
        let reachR = null;
        if (T < 0.8 || T >= FIN) focus.set(0, 0.6, 0);
        else if (T < 1)
          focus
            .set(0, 0.6, 0)
            .lerp(ringPos(0, focusB), easeInOut(range(T, 0.8, 1)));
        else if (T >= RB0) {
          rootWorld(
            robot.rootZ(Math.min(rk, RBN - 1), rk >= RBN ? 1 : rp),
            focus
          );
          if (rk === RBN - 1 && rp > 0.8)
            focus.lerp(focusB.set(0, 0.6, 0), easeInOut(range(rp, 0.8, 1)));
          reachR = 2.5;
        } else {
          const c0 = Math.min(N - 1, Math.floor(cur)),
            pp = cur - c0;
          ringPos(c0, focus);
          if (pp > 0.8)
            focus.lerp(
              c0 + 1 < N
                ? ringPos(c0 + 1, focusB)
                : rootWorld(robot.Z_BACK, focusB),
              easeInOut(range(pp, 0.8, 1))
            );
          if (c0 === N - 1 && pp > 0.8)
            reachR = lerp(spotReach(N - 1), 2.5, easeInOut(range(pp, 0.8, 1)));
        }
        const j0 = Math.min(N - 1, Math.max(0, Math.floor(cur))),
          pj = cur - Math.floor(cur);
        const reach =
          reachR !== null
            ? reachR
            : T < 1
              ? 2.2
              : lerp(
                  spotReach(j0),
                  spotReach(Math.min(N - 1, j0 + 1)),
                  pj > 0.8 ? easeInOut(range(pj, 0.8, 1)) : 0
                );
        const wide =
          rk === 1 ? 0.55 * sr(rp, 0.56, 0.64) * (1 - sr(rp, 0.84, 1)) : 0;
        aimRig(focus, reach, Math.max(fin, wide));
        if (fin > 0.5) {
          aimLights(focus.set(0, 0, 0), 13);
          renderer.shadowMap.autoUpdate = false;
          const bucket = Math.round(T * 40);
          if (bucket !== lastFinaleShadow) {
            lastFinaleShadow = bucket;
            renderer.shadowMap.needsUpdate = true;
          }
        } else {
          aimLights(focus, 3.4);
          renderer.shadowMap.autoUpdate = false;
          shadowTick++;
          const moving = Math.abs(T - lastShadowT) > 1e-4 || S.orbitBusy;
          lastShadowT = T;
          let every = moving ? 3 : 6;
          if (wide > 0.1) every = Math.max(every, 4);
          if (shadowTick % every === 0) renderer.shadowMap.needsUpdate = true;
        }
        if (fin > 1e-3 || LITE) {
          fill.position.lerp(camera.position, LITE ? Math.max(0.7, fin) : fin);
          fill.target.position.lerp(ORIGIN, fin);
        }
        beamMat.uniforms.uOpacity.value = 0.6 * (1 - sr(T, 0.7, 0.95));
        poolMat.opacity = fin;
        pools.visible = fin > 0.01;
        spotBeamMat.uniforms.uO.value = (LITE ? 0.55 : 0.42) * fin;
        spotBeams.visible = fin > 0.01;
        liftDesigns(LITE ? Math.max(1.15, 1.7 * fin) : fin);
        pedRingMat.uniforms.uCur.value =
          T < 0.9 || T >= RB0 || fin > 0.5 ? -5 : cur;
        const sc = robot.scan;
        pedRingMat.uniforms.uFin.value = Math.max(fin, sc.on);
        pedRingMat.uniforms.uWave.value =
          sc.on > 0.01 && fin < 0.5
            ? ((((Math.PI / 2 - sc.az) / (TAU / N)) % N) + N) % N
            : (time * 2.2) % N;
        bloom.strength = 0.46;
        bloom.radius = 0.32;
      }
      const anchorFn = (id, out) => {
        const [dev, kind] = id.split(":");
        const j = ORDER.indexOf(dev);
        if (j < 0 && dev !== "robot") return null;
        const d = devs[j];
        if (dev === "robot") return robot.anchorWorld(kind, out);
        if (kind === "board") return out.copy(board.g.position);
        return d.root.localToWorld(out.set(0, d.frameSpec.targetY * 0.9, 0));
      };
      const aoWanted = T => T < RB0 - 0.25;
      grain.uniforms.uSharp.value = LOW ? 0.18 : 0.32;
      S.sideShift = 0.17;
      const onResize = (w, h) =>
        grain.uniforms.uTexel.value.set(
          1 / (w * renderer.getPixelRatio()),
          1 / (h * renderer.getPixelRatio())
        );
      return {
        rm: [],
        camera: cameraFn,
        update,
        anchor: anchorFn,
        aoWanted,
        onResize,
        ao: { radius: 0.32, intensity: 1, thickness: 1 },
      };
    });
  }
  runEngine().catch(err => {
    HS.classList.add("no-gl");
    console.warn(
      "3D model unavailable:",
      err && err.message ? err.message : err
    );
  });
  return () => {
    disposed = true;
    ac.abort();
    timers.forEach(clearInterval);
    OBS.forEach(o => o.disconnect());
    anime.running.slice().forEach(a => a.pause());
    const S = window.IO;
    if (S && S.disposeHall) S.disposeHall();
    if (S && S.disposeGL) S.disposeGL();
    delete window.IO;
    delete window.IO_SPOTS;
    delete window.IO_DEBUG;
    delete window.IO_LITE;
  };
}
export { mountStory };
