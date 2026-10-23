import anime from "animejs";

/*
 * The homepage sections' behaviour (#home-sections): the word-by-word heading
 * reveals, the counters, the stack layers, the board map and its part details.
 * Moved unchanged from client/src/home3d/story.js (its lifecycle helpers and
 * the sections block) when the 3D story above these sections was replaced by
 * the ray-traced one; the 3D engine and its chapter state went with that file.
 * The Black Edition sections then dropped the card tilt, the magnetic buttons
 * and the call to action's drifting orbs. mountSections(HS) runs on the .hs
 * wrapper and returns a function that undoes it.
 */
function mountSections(HS) {
  const ac = new AbortController();
  const signal = ac.signal;
  let disposed = false;
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
  return () => {
    disposed = true;
    ac.abort();
    timers.forEach(clearInterval);
    OBS.forEach(o => o.disconnect());
    anime.running.slice().forEach(a => a.pause());
  };
}
export { mountSections };
