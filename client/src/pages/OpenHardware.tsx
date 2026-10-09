import { Link } from "wouter";
import {
  ArrowRight,
  Building2,
  ExternalLink,
  FileCheck2,
  GraduationCap,
} from "lucide-react";

const REPO = "https://github.com/embeddedos-org/eCAD-Hardware-Products";

export const STATS = [
  { value: "332", label: "board records", color: "#F97316" },
  { value: "29 of 31", label: "ecosystems from issue #28", color: "#22D3EE" },
  {
    value: "4,015",
    label: "openly licensed CAD files mirrored",
    color: "#5EE08E",
  },
  {
    value: "253",
    label: "boards with their CAD files mirrored",
    color: "#A78BFA",
  },
] as const;

export const RULES = [
  {
    title: "The licence allows it",
    body: "Only boards whose record sets redistribution_allowed to true are copied. Unknown is not permission: the other 77 boards keep their official link and digest, and nothing else.",
  },
  {
    title: "The bytes are the manufacturer's bytes",
    body: "Each board's whole design is copied: every CAD file at the commit of the manufacturer's repository its record pins. Each file must match the git blob ID at that commit, or the SHA-256 the database recorded, so the mirror holds the manufacturer's file exactly.",
  },
  {
    title: "The bytes are CAD",
    body: "Each file is identified from its content: Eagle, KiCad, Altium, OrCAD, Allegro and PADS sources, Gerber and drill files, STEP, STL and other 3D models. Archives are unpacked to their CAD files. PDFs, BOMs, readmes and anything else are left out.",
  },
] as const;

type Shot = {
  file: string;
  width: number;
  height: number;
  alt: string;
  board: string;
  source: string;
  licence: string;
};

export const GALLERY: ReadonlyArray<{
  heading: string;
  intro: string;
  shots: ReadonlyArray<Shot>;
}> = [
  {
    heading: "KiCad boards and schematics",
    intro:
      "Rendered with KiCanvas straight from the manufacturers' .kicad_pcb and .kicad_sch files: copper on four layers, pads, vias, silkscreen and the full schematic sheet.",
    shots: [
      {
        file: "open-hardware-kicad-redboard-rp2350",
        width: 1596,
        height: 1400,
        alt: "KiCad PCB of the SparkFun IoT RedBoard RP2350 showing routed copper, pads and header pins",
        board: "SparkFun IoT RedBoard RP2350",
        source: "SparkFun_IoT_RedBoard-RP2350.kicad_pcb",
        licence: "CC BY-SA 4.0",
      },
      {
        file: "open-hardware-schematic-thingplus",
        width: 1600,
        height: 1000,
        alt: "KiCad schematic of the SparkFun Thing Plus ESP32-S3 with USB, voltage regulation and the ESP32-S3 module",
        board: "SparkFun Thing Plus ESP32-S3",
        source: "SparkFun_Thing_Plus_ESP32-S3.kicad_sch",
        licence: "CC BY-SA 4.0",
      },
      {
        file: "open-hardware-kicad-thingplus",
        width: 613,
        height: 1400,
        alt: "KiCad PCB of the SparkFun Thing Plus ESP32-S3 in the Feather form factor",
        board: "SparkFun Thing Plus ESP32-S3",
        source: "SparkFun_Thing_Plus_ESP32-S3.kicad_pcb",
        licence: "CC BY-SA 4.0",
      },
    ],
  },
  {
    heading: "Eagle boards",
    intro:
      "748 of the mirrored files are Eagle sources. These were drawn from the board XML itself: top copper in red, bottom copper in blue, pads, vias, silkscreen and the board outline.",
    shots: [
      {
        file: "open-hardware-eagle-feather-rp2040",
        width: 1400,
        height: 686,
        alt: "Eagle board of the Adafruit Feather RP2040 with the RP2040 chip and its fan-out routing",
        board: "Adafruit Feather RP2040",
        source: "Adafruit-Feather-RP2040.brd",
        licence: "CC BY-SA (version not stated by Adafruit)",
      },
      {
        file: "open-hardware-eagle-redboard-turbo",
        width: 1400,
        height: 1286,
        alt: "Eagle board of the SparkFun RedBoard Turbo in the Arduino Uno outline",
        board: "SparkFun RedBoard Turbo",
        source: "RedBoard_Turbo.brd",
        licence: "CC BY-SA 4.0",
      },
    ],
  },
  {
    heading: "Gerber fabrication files",
    intro:
      "What a board house receives: ten Gerber and drill layers from the SparkFun Edge archive, stacked into the top and bottom of the finished board.",
    shots: [
      {
        file: "open-hardware-gerber-edge-top",
        width: 1400,
        height: 1400,
        alt: "Top side of the SparkFun Edge 2 rendered from its Gerber files, with the camera connector and TensorFlow silkscreen",
        board: "SparkFun Edge, top",
        source: "SparkFun_TensorFlow_Ambiq_Apollo3-Gerbers.zip",
        licence: "CC BY-SA 4.0",
      },
      {
        file: "open-hardware-gerber-edge-bottom",
        width: 1400,
        height: 1400,
        alt: "Bottom side of the SparkFun Edge 2 rendered from its Gerber files",
        board: "SparkFun Edge, bottom",
        source: "SparkFun_TensorFlow_Ambiq_Apollo3-Gerbers.zip",
        licence: "CC BY-SA 4.0",
      },
    ],
  },
  {
    heading: "3D models",
    intro:
      "25 boards have a verified STEP model. Each of these was tessellated with OpenCASCADE and lit in three.js, in the colours its manufacturer gave it.",
    shots: [
      {
        file: "open-hardware-3d-beaglebone-ai-64",
        width: 1600,
        height: 1000,
        alt: "3D STEP model of the BeagleBone AI-64 with its heatsink and connectors",
        board: "BeagleBone AI-64",
        source: "BeagleBone_AI-64_Rev_B1_3D_220826.stp",
        licence: "CC BY 4.0",
      },
      {
        file: "open-hardware-3d-beaglebone-ai",
        width: 1600,
        height: 1000,
        alt: "3D STEP model of the BeagleBone AI with its headers and Ethernet jack",
        board: "BeagleBone AI",
        source: "PCBA_BeagleBone_AI_Rev_A1.stp",
        licence: "CC BY 4.0",
      },
      {
        file: "open-hardware-3d-pocketbeagle",
        width: 1600,
        height: 1000,
        alt: "3D STEP model of the PocketBeagle",
        board: "PocketBeagle",
        source: "PocketBeagle.step",
        licence: "CC BY 4.0",
      },
      {
        file: "open-hardware-3d-stamp-s3",
        width: 1600,
        height: 1000,
        alt: "3D STEP model of the M5Stack Stamp-S3 module with its USB-C connector",
        board: "M5Stack Stamp-S3",
        source: "Stamp-S3.step",
        licence: "MIT",
      },
      {
        file: "open-hardware-3d-pico-vision",
        width: 1600,
        height: 1000,
        alt: "3D STEP model of the SparkFun Pico Vision camera board with its header pins",
        board: "SparkFun Pico Vision camera board",
        source: "SparkFun_Pico_Vision_Board_Camera.step",
        licence: "CC BY-SA 4.0",
      },
      {
        file: "open-hardware-3d-artemis",
        width: 1600,
        height: 1000,
        alt: "3D STEP model of the SparkFun Artemis module",
        board: "SparkFun Artemis",
        source: "Artemis-Production-Model-V1.step",
        licence: "CC BY-SA 4.0",
      },
    ],
  },
];

export const LICENCE_TERMS = [
  {
    licence: "CC BY-SA",
    boards: 224,
    asks: "Credit the maker, and share your changed design under the same licence.",
  },
  {
    licence: "CC BY 4.0",
    boards: 21,
    asks: "Credit the maker.",
  },
  {
    licence: "MIT, BSD or Apache-2.0",
    boards: 7,
    asks: "Keep the licence text with every copy. Each of these boards' ATTRIBUTION.md carries it, verbatim.",
  },
  {
    licence: "Raspberry Pi's grant in 0BSD wording",
    boards: 1,
    asks: "Nothing: use, copy, modify and distribute the Pico designs for any purpose.",
  },
] as const;

export const USAGE = [
  {
    title: "Find a board",
    body: "Every board has one record: the exact board, revision and MCU, each format marked true, false or unknown, and the licence. Ask the database by format, licence or vendor.",
    code: [
      "python3 tools/devboard_cad/query.py with-formats step",
      "python3 tools/devboard_cad/query.py commercial-reuse",
    ],
    file: "open-hardware-terminal-query",
    width: 1500,
    height: 673,
    alt: "Terminal output of the database query for boards with a verified STEP model, 25 matched, and 255 records that allow commercial reuse",
    caption:
      "25 boards have a verified STEP model, and 255 records allow commercial reuse.",
  },
  {
    title: "Fetch one board, not the whole mirror",
    body: "A partial clone downloads only the folder you name. The SparkFun IoT RedBoard RP2350, its whole KiCad project and Gerbers in 33 files, took 9 seconds and 101 MB, against 4.35 GB for every board, and shasum gives the same SHA-256 as its ATTRIBUTION.md.",
    code: [
      "git clone --filter=blob:none --sparse --depth 1 https://github.com/embeddedos-org/eCAD-Hardware-Products.git",
      "cd eCAD-Hardware-Products",
      "git sparse-checkout set --no-cone /boards/cad/sparkfun/iot-redboard-rp2350/",
      "shasum -a 256 boards/cad/sparkfun/iot-redboard-rp2350/cad/Hardware/*.kicad_sch",
    ],
    file: "open-hardware-terminal-fetch",
    width: 1600,
    height: 950,
    alt: "Terminal output of a sparse clone that fetches only the SparkFun IoT RedBoard RP2350 folder, 84 MB of files, listing its KiCad project and four schematic sheets with SHA-256 digests and its CC BY-SA 4.0 licence",
    caption:
      "Recorded on the pull request branch before the mirror reached master, which is why it names a branch and a fork.",
  },
  {
    title: "Open the design in KiCad",
    body: "The RedBoard's .kicad_pcb and .kicad_sch were saved by KiCad 8, so KiCad 8 or later opens them as they are. Its folder holds the whole project: the project file, the PCB, the root sheet and its three sub-sheets. The Eagle .brd and .sch files, 748 of the 4,015, go through KiCad's EAGLE importer.",
    code: [],
    file: "open-hardware-kicad-redboard-rp2350",
    width: 1596,
    height: 1400,
    alt: "KiCad PCB of the SparkFun IoT RedBoard RP2350 rendered from the mirrored file, with routed copper, pads and header pins",
    caption:
      "SparkFun_IoT_RedBoard-RP2350.kicad_pcb, rendered from the mirrored file.",
  },
  {
    title: "Send the Gerbers to a board house",
    body: "A Gerber set is what a fab asks for: copper, solder mask, silkscreen and paste for each side, the board outline and the Excellon drill file. Zip the folder and upload it. Here the open-source whats-that-gerber library names each layer of the SparkFun Edge set.",
    code: [
      "cd boards/cad/sparkfun/edge/cad/Hardware/SparkFun_TensorFlow_Ambiq_Apollo3-Gerbers",
      "ls | xargs node gerber-layers.mjs",
    ],
    file: "open-hardware-terminal-gerber",
    width: 1500,
    height: 805,
    alt: "Terminal output listing the SparkFun Edge design folder and naming the ten layers of its Gerber set: copper, silkscreen, solder paste and solder mask for each side, the outline and the drill file",
    caption:
      "Ten files, ten layers. The rendered board is in the Gerber section below.",
  },
  {
    title: "Design the enclosure around the STEP model",
    body: "Import the STEP into FreeCAD, Fusion or SolidWorks and model the case around it. Measured from the geometry with OpenCASCADE, the BeagleBone AI-64 is 102.5 × 82.6 × 36.6 mm with its heatsink and connectors, and the PocketBeagle is 56.4 × 35.0 mm.",
    code: [
      "cd boards/cad",
      'for f in beagleboard/beaglebone-ai-64/cad/hw/*.stp beagleboard/pocketbeagle/cad/models/*.step; do node measure-step.mjs "$f"; done',
    ],
    file: "open-hardware-terminal-step",
    width: 1600,
    height: 350,
    alt: "Terminal output of three STEP models measured with OpenCASCADE: BeagleBone AI-64 102.5 by 82.6 by 36.6 mm, PocketBeagle 56.4 by 35.0 mm and the SparkFun Artemis module",
    caption:
      "Overall size in millimetres, from each manufacturer's own STEP file.",
  },
  {
    title: "Keep the credit and the licence",
    body: "These are the manufacturers' designs, copied unmodified so they can be checked against the originals. Each board folder carries an ATTRIBUTION.md naming the maker, the licence, every file's official source and SHA-256, and what was left out. The 77 boards without a confirmed redistribution licence are linked, never copied.",
    code: [],
    file: "open-hardware-attribution",
    width: 1440,
    height: 1000,
    alt: "GitHub view of the Feather RP2040 ATTRIBUTION.md listing licence, sources and SHA-256 digests",
    caption: "boards/cad/adafruit/feather-rp2040/ATTRIBUTION.md",
  },
] as const;

export const HELPER_SCRIPTS = [
  {
    name: "gerber-layers.mjs",
    code: [
      'import { createRequire } from "node:module";',
      "const require = createRequire(import.meta.url);",
      'const whatsThatGerber = require("whats-that-gerber");',
      "const names = process.argv.slice(2);",
      "const types = whatsThatGerber(names);",
      "for (const n of names) {",
      "  const t = types[n];",
      '  console.log(`${n.padEnd(42)} ${t.side ?? "-"} ${t.type ?? "unknown"}`);',
      "}",
    ],
  },
  {
    name: "measure-step.mjs",
    code: [
      'import { createRequire } from "node:module";',
      'import { readFileSync } from "node:fs";',
      "const require = createRequire(import.meta.url);",
      'const occt = await require("occt-import-js")();',
      "for (const path of process.argv.slice(2)) {",
      "  const r = occt.ReadStepFile(new Uint8Array(readFileSync(path)), null);",
      "  const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];",
      "  let tris = 0;",
      "  for (const m of r.meshes) {",
      "    const p = m.attributes.position.array;",
      "    for (let i = 0; i < p.length; i += 3) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], p[i + k]); hi[k] = Math.max(hi[k], p[i + k]); }",
      "    tris += m.index.array.length / 3;",
      "  }",
      "  const d = hi.map((h, k) => (h - lo[k]).toFixed(1));",
      '  console.log(`${path.split("/").pop()}: ${r.success ? "ok" : "failed"}, ${r.meshes.length} parts, ${tris} triangles, ${d.join(" x ")} mm`);',
      "}",
    ],
  },
] as const;

export const VALIDATION = [
  {
    domain: "Mechanical",
    tool: "STEP geometry into MuJoCo rigid-body dynamics",
    item: "robotic_joint_001",
    result:
      "Volumes and inertia extracted from the STEP model, then statics, rated moves, free swing and clearance simulated against the joint's requirements.",
    file: "open-hardware-3d-robotic-joint",
    width: 1600,
    height: 1000,
    alt: "3D model of the robotic joint dataset item: base, motor block, arm, pin and payload",
  },
  {
    domain: "Electrical",
    tool: "ngspice transient analysis",
    item: "servo_supply_001",
    result:
      "48 V servo-drive input: 4.72 A inrush peak, bus at 90% in 10.9 ms, 47.9 V steady, then a 4.17 A drive load and an injected short-circuit fault.",
    file: "open-hardware-sim-servo-supply",
    width: 1600,
    height: 900,
    alt: "ngspice plot of bus voltage and input current for the servo supply: precharge, bypass, load step and fault",
  },
  {
    domain: "Digital",
    tool: "Icarus Verilog simulation",
    item: "uart_loopback_001",
    result:
      "UART 8N1 loopback at 115,207 baud measured: 434 clock cycles per bit, both bytes received, 0 bit errors and 0 framing errors.",
    file: "open-hardware-sim-uart-loopback",
    width: 1600,
    height: 640,
    alt: "Icarus Verilog waveform of the UART loopback sending 0x35 bit by bit and receiving it",
  },
] as const;

export const AUDIENCES = [
  {
    icon: GraduationCap,
    title: "Universities",
    color: "#22D3EE",
    points: [
      "Course labs on real board files: open a KiCad or Eagle design, read its Gerbers, measure its STEP model.",
      "Research and student projects on the validation pipeline, with mechanical, electrical and digital domains to extend.",
      "Validating our board ports on real hardware: most boards are described today, not yet tested on silicon.",
    ],
  },
  {
    icon: Building2,
    title: "Companies",
    color: "#F97316",
    points: [
      "Reference designs your engineers can open in their own tools, with the licence attached to every file.",
      "Board bring-up and dev-kit validation for EmbeddedOS on your silicon.",
      "Joint grant proposals and letters of collaboration for open-source hardware work.",
    ],
  },
] as const;

function Picture({
  file,
  width,
  height,
  alt,
  framed = false,
}: {
  file: string;
  width: number;
  height: number;
  alt: string;
  framed?: boolean;
}) {
  const picture = (
    <picture>
      <source srcSet={`/media/${file}.webp`} type="image/webp" />
      <img
        src={`/media/${file}.jpg`}
        width={width}
        height={height}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={framed ? { height: "100%" } : undefined}
        className={
          framed
            ? "absolute inset-0 w-full h-full object-contain"
            : "w-full h-auto block bg-[#0b1220]"
        }
      />
    </picture>
  );
  return framed ? (
    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0b1220]">
      {picture}
    </div>
  ) : (
    picture
  );
}

export default function OpenHardware() {
  return (
    <div className="min-h-screen bg-[#050A14] text-white">
      <section className="relative pt-28 pb-14 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-6xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border border-orange-500/30 bg-orange-500/10 text-orange-400">
            <FileCheck2 size={12} /> eCAD HARDWARE · OPEN DESIGN FILES
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            Open hardware{" "}
            <span className="bg-gradient-to-br from-orange-500 to-amber-400 bg-clip-text text-transparent">
              you can verify
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed mb-8">
            We catalogue development-board design files board by board, decide
            every claim from the bytes we retrieved, keep a credited copy of
            every file whose licence allows it, and validate our own designs by
            simulation. Everything on this page is rendered from those files.
          </p>
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0b1220]">
            <video
              controls
              playsInline
              preload="none"
              poster="/media/open-hardware-tour-poster.jpg"
              width={1600}
              height={900}
              className="w-full h-auto block"
            >
              <source src="/media/open-hardware-tour.mp4" type="video/mp4" />
              <track
                kind="captions"
                src="/media/open-hardware-tour.vtt"
                srcLang="en"
                label="English"
                default
              />
            </video>
          </div>
          <p className="text-sm text-gray-400 mt-3">
            A 69-second walkthrough, without sound, captioned. Every picture in
            it is a real file, tool output or simulation result.
          </p>
        </div>
      </section>

      <section className="border-y border-white/[0.07] bg-white/[0.02] py-8 px-6">
        <dl className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <dt className="sr-only">{s.label}</dt>
              <dd
                className="text-3xl md:text-4xl font-black"
                style={{ color: s.color }}
              >
                {s.value}
              </dd>
              <dd className="text-xs text-gray-400 mt-1">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black mb-4">
            How a file gets into the mirror
          </h2>
          <p className="text-gray-300 max-w-3xl mb-10 leading-relaxed">
            The database records where each board's files live and the commit of
            the manufacturer's repository they come from. The mirror keeps each
            board's whole design, 4,015 CAD files and 4.35 GB from 253 boards,
            and copies a file only when all three of these hold.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {RULES.map((r, i) => (
              <div
                key={r.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="text-sm font-bold text-orange-400 mb-2">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold mb-2">{r.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {r.body}
                </p>
              </div>
            ))}
          </div>
          <figure className="rounded-2xl overflow-hidden border border-white/10 max-w-4xl">
            <Picture
              file="open-hardware-terminal-mirror"
              width={1400}
              height={640}
              alt="Terminal output of mirror.py check reporting 4015 CAD files for 253 boards and 0 problems, 54 passing tests, and a board folder holding only CAD files and its ATTRIBUTION.md"
            />
            <figcaption className="text-sm text-gray-400 px-4 py-3">
              The check CI runs: every redistributable CAD file present, every
              digest matching, nothing else in the folder.
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        id="how-to-use"
        className="py-16 px-6 border-t border-white/[0.06]"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black mb-4">How to use the files</h2>
          <p className="text-gray-300 max-w-3xl mb-8 leading-relaxed">
            Six steps from a board record to a board you can build, each shown
            with a real file and its real output. The commands need Git, Python
            3 and, for the last two, Node.js.
          </p>
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0b1220]">
            <video
              controls
              playsInline
              preload="none"
              poster="/media/open-hardware-howto-poster.jpg"
              width={1600}
              height={900}
              className="w-full h-auto block"
            >
              <source src="/media/open-hardware-howto.mp4" type="video/mp4" />
              <track
                kind="captions"
                src="/media/open-hardware-howto.vtt"
                srcLang="en"
                label="English"
                default
              />
            </video>
          </div>
          <p className="text-sm text-gray-400 mt-3 mb-12">
            A 45-second how-to, without sound, captioned.
          </p>
          <ol className="grid gap-12">
            {USAGE.map((u, i) => (
              <li
                key={u.title}
                className="grid lg:grid-cols-2 gap-6 items-start"
              >
                <div className="min-w-0">
                  <div className="text-sm font-bold text-orange-400 mb-1">
                    Step {i + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{u.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">
                    {u.body}
                  </p>
                  {u.code.length > 0 && (
                    <pre
                      tabIndex={0}
                      className="text-xs leading-relaxed text-sky-200 bg-[#0b1220] border border-white/10 rounded-xl p-4 overflow-x-auto"
                    >
                      <code>{u.code.join("\n")}</code>
                    </pre>
                  )}
                  {i === USAGE.length - 1 && (
                    <dl className="grid gap-3 text-sm">
                      {LICENCE_TERMS.map(l => (
                        <div
                          key={l.licence}
                          className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3"
                        >
                          <dt className="font-semibold text-emerald-300">
                            {l.licence} · {l.boards}{" "}
                            {l.boards === 1 ? "board" : "boards"}
                          </dt>
                          <dd className="text-gray-300 mt-1">{l.asks}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
                <figure className="rounded-2xl overflow-hidden border border-white/10 min-w-0">
                  <Picture
                    file={u.file}
                    width={u.width}
                    height={u.height}
                    alt={u.alt}
                  />
                  <figcaption className="text-sm text-gray-400 px-4 py-3 break-words">
                    {u.caption}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ol>
          <details className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <summary className="cursor-pointer font-semibold">
              The two helper scripts used in steps 4 and 5
            </summary>
            <p className="text-sm text-gray-300 mt-3 mb-4 leading-relaxed">
              Both run on Node.js after{" "}
              <code className="text-sky-200">
                npm install whats-that-gerber occt-import-js
              </code>
              . Neither changes a file.
            </p>
            {HELPER_SCRIPTS.map(s => (
              <div key={s.name} className="mb-4">
                <div className="text-sm font-semibold mb-2">{s.name}</div>
                <pre
                  tabIndex={0}
                  className="text-xs leading-relaxed text-sky-200 bg-[#0b1220] border border-white/10 rounded-xl p-4 overflow-x-auto"
                >
                  <code>{s.code.join("\n")}</code>
                </pre>
              </div>
            ))}
          </details>
        </div>
      </section>

      {GALLERY.map(group => (
        <section
          key={group.heading}
          className="py-14 px-6 border-t border-white/[0.06]"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-black mb-3">{group.heading}</h2>
            <p className="text-gray-300 max-w-3xl mb-8 leading-relaxed">
              {group.intro}
            </p>
            <div
              className={`grid gap-6 ${group.shots.length > 3 ? "sm:grid-cols-2 lg:grid-cols-3" : group.shots.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}
            >
              {group.shots.map(s => (
                <figure
                  key={s.file}
                  className="rounded-2xl overflow-hidden border border-white/10 bg-[#0b1220] flex flex-col"
                >
                  <Picture
                    file={s.file}
                    width={s.width}
                    height={s.height}
                    alt={s.alt}
                    framed
                  />
                  <figcaption className="px-4 py-3 text-sm mt-auto">
                    <span className="block font-semibold text-white">
                      {s.board}
                    </span>
                    <span className="block text-gray-400 break-all">
                      {s.source}
                    </span>
                    <span className="inline-block mt-1 text-xs text-emerald-300">
                      {s.licence}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-16 px-6 border-t border-white/[0.06] bg-violet-500/[0.03]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black mb-3">
            Our own designs, checked by simulation
          </h2>
          <p className="text-gray-300 max-w-3xl mb-10 leading-relaxed">
            Three dataset items in the eCAD repository run end to end through
            the V0 to V4 validation pipeline, one per engineering domain, with
            the industry tools named below. The plots are from those runs.
          </p>
          <div className="grid gap-8">
            {VALIDATION.map(v => (
              <figure
                key={v.item}
                className="grid lg:grid-cols-5 gap-6 items-center rounded-2xl border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="lg:col-span-3 rounded-xl overflow-hidden border border-white/10">
                  <Picture
                    file={v.file}
                    width={v.width}
                    height={v.height}
                    alt={v.alt}
                  />
                </div>
                <figcaption className="lg:col-span-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-violet-300">
                    {v.domain} · {v.item}
                  </div>
                  <div className="text-lg font-bold mt-1 mb-2">{v.tool}</div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {v.result}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black mb-8">
            Work with us on open hardware
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {AUDIENCES.map(a => (
              <div
                key={a.title}
                className="rounded-2xl border p-6"
                style={{
                  borderColor: `${a.color}55`,
                  background: `${a.color}0f`,
                }}
              >
                <h3
                  className="text-xl font-bold mb-4 flex items-center gap-2"
                  style={{ color: a.color }}
                >
                  <a.icon size={20} /> {a.title}
                </h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  {a.points.map(p => (
                    <li key={p} className="flex gap-2">
                      <ArrowRight
                        size={14}
                        className="shrink-0 mt-1"
                        style={{ color: a.color }}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold bg-orange-500 hover:bg-orange-600 text-white"
            >
              Talk to us <ArrowRight size={16} />
            </Link>
            <a
              href={`${REPO}/tree/master/boards`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border border-white/15 text-white hover:border-white/30"
            >
              Browse the files <ExternalLink size={16} />
            </a>
            <a
              href={`${REPO}/blob/master/docs/devboard-cad-database.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border border-white/15 text-white hover:border-white/30"
            >
              How the database works <ExternalLink size={16} />
            </a>
            <Link
              href="/ecad-hardware"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold border border-white/15 text-white hover:border-white/30"
            >
              Our design portfolio <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
