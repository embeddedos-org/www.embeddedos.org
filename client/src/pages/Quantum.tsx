import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cpu,
  Zap,
  Shield,
  GitBranch,
  Layers,
  Activity,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Atom,
  Binary,
  Network,
  Clock,
  Lock,
  BarChart3,
  Code2,
  Server,
} from "lucide-react";

// ── Animated qubit particle canvas ──────────────────────────────────────────
function QuantumCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Qubit = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      phase: number;
      speed: number;
      color: string;
    };

    const colors = ["#a855f7", "#6366f1", "#22d3ee", "#f59e0b", "#10b981"];
    const qubits: Qubit[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: 2 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
      speed: 0.02 + Math.random() * 0.03,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw entanglement lines between nearby qubits
      for (let i = 0; i < qubits.length; i++) {
        for (let j = i + 1; j < qubits.length; j++) {
          const dx = qubits[i].x - qubits[j].x;
          const dy = qubits[i].y - qubits[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(qubits[i].x, qubits[i].y);
            ctx.lineTo(qubits[j].x, qubits[j].y);
            ctx.strokeStyle = `rgba(168,85,247,${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw qubits
      qubits.forEach(q => {
        q.phase += q.speed;
        const pulse = 0.7 + 0.3 * Math.sin(q.phase);

        // Glow
        const grad = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.r * 4);
        grad.addColorStop(0, q.color + "88");
        grad.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(q.x, q.y, q.r * 4 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(q.x, q.y, q.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = q.color;
        ctx.fill();

        // Move
        q.x += q.vx;
        q.y += q.vy;
        if (q.x < 0 || q.x > canvas.width) q.vx *= -1;
        if (q.y < 0 || q.y > canvas.height) q.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60"
    />
  );
}

// ── Vendor data ──────────────────────────────────────────────────────────────
const vendors = [
  {
    id: "ibm",
    name: "IBM Quantum",
    logo: "IBM",
    color: "from-blue-600 to-blue-800",
    accent: "blue",
    chip: "IBM Heron r2",
    qubits: 156,
    technology: "Superconducting transmon",
    gateTime: "~50 ns",
    coherence: "~300 µs",
    fidelity: "99.9%",
    sdk: "Qiskit",
    sdkUrl: "https://qiskit.org",
    access: "IBM Quantum Network",
    description:
      "IBM's Heron r2 processor delivers 156 tunable-coupler qubits with a 3–5× performance improvement over the previous Eagle generation. EoS provides native Qiskit circuit compilation and direct QPU scheduling through the IBM Quantum Runtime API.",
    eosFeatures: [
      "Qiskit Runtime integration via eQC HAL driver",
      "OpenQASM 3.0 circuit transpilation to Heron native gates",
      "Real-time pulse calibration through IBM Pulse API",
      "Quantum Volume benchmarking daemon",
    ],
    status: "Supported",
  },
  {
    id: "google",
    name: "Google Quantum AI",
    logo: "GQA",
    color: "from-green-600 to-teal-700",
    accent: "green",
    chip: "Willow",
    qubits: 105,
    technology: "Superconducting transmon",
    gateTime: "~25 ns",
    coherence: "~100 µs",
    fidelity: "99.7%",
    sdk: "Cirq",
    sdkUrl: "https://quantumai.google/cirq",
    access: "Google Cloud Quantum AI",
    description:
      "Google's Willow chip is the first processor to demonstrate below-threshold quantum error correction, achieving exponential error reduction as qubit count scales. EoS integrates Cirq's circuit model and Google's QEC surface code runtime.",
    eosFeatures: [
      "Cirq circuit model integration in eQC compiler",
      "Surface code QEC runtime with real-time syndrome decoding",
      "Willow native gate set (SYC, √X, PhasedXZ) transpilation",
      "Google Cloud Quantum AI job submission API",
    ],
    status: "Supported",
  },
  {
    id: "microsoft",
    name: "Microsoft Azure Quantum",
    logo: "AQ",
    color: "from-indigo-600 to-violet-700",
    accent: "indigo",
    chip: "Topological (Majorana)",
    qubits: "Future",
    technology: "Topological qubits (Majorana fermions)",
    gateTime: "TBD",
    coherence: "Theoretically unlimited",
    fidelity: "Target: 99.99%",
    sdk: "Q# / Azure QDK",
    sdkUrl: "https://azure.microsoft.com/en-us/products/quantum",
    access: "Azure Quantum (IonQ, Rigetti, Quantinuum, Pasqal)",
    description:
      "Microsoft's Azure Quantum platform provides unified access to multiple quantum hardware providers and is pioneering topological qubits using Majorana fermions, which promise inherently fault-tolerant operation. EoS supports Q# programs and the full Azure Quantum provider ecosystem.",
    eosFeatures: [
      "Q# language runtime integration in eQC kernel module",
      "Azure Quantum Resource Estimator API binding",
      "Multi-provider job routing (IonQ, Rigetti, Quantinuum via Azure)",
      "Topological qubit driver stub (ready for Majorana hardware)",
    ],
    status: "Beta",
  },
  {
    id: "ionq",
    name: "IonQ",
    logo: "IQ",
    color: "from-cyan-600 to-sky-700",
    accent: "cyan",
    chip: "IonQ Forte",
    qubits: 35,
    technology: "Trapped-ion (Ytterbium)",
    gateTime: "~200 µs",
    coherence: "~10 s",
    fidelity: "99.9%+",
    sdk: "Cirq / Qiskit / Q#",
    sdkUrl: "https://ionq.com/docs",
    access: "AWS Braket, Azure Quantum, Google Cloud, Direct API",
    description:
      "IonQ's trapped-ion architecture provides all-to-all qubit connectivity and the longest coherence times of any commercial system — up to 10 seconds. The Forte system's 35 algorithmic qubits (AQ) represent the highest-quality gate operations available. EoS provides a native IonQ HAL driver with direct REST API integration.",
    eosFeatures: [
      "IonQ REST API driver in eQC HAL (direct + cloud)",
      "All-to-all connectivity optimizer in eQC circuit scheduler",
      "Trapped-ion native gate set (XX, Ry, Rz) transpilation",
      "IonQ Forte AQ benchmarking and calibration daemon",
    ],
    status: "Supported",
  },
  {
    id: "rigetti",
    name: "Rigetti Computing",
    logo: "RC",
    color: "from-orange-600 to-red-700",
    accent: "orange",
    chip: "Ankaa-3",
    qubits: 84,
    technology: "Superconducting (tunable transmon)",
    gateTime: "~40 ns",
    coherence: "~50 µs",
    fidelity: "99.5%",
    sdk: "Pyquil / Quilc",
    sdkUrl: "https://docs.rigetti.com",
    access: "AWS Braket, Azure Quantum, Quantum Cloud Services (QCS)",
    description:
      "Rigetti's Ankaa-3 processor delivers 84 superconducting qubits with the fastest 2-qubit gate speeds in the industry (~40 ns). The cloud-native QCS platform enables hybrid quantum-classical workflows. EoS integrates Pyquil's Quil instruction set and Quilc compiler for optimized circuit execution.",
    eosFeatures: [
      "Pyquil / Quil-T instruction set driver in eQC HAL",
      "Quilc compiler integration for gate optimization",
      "Rigetti QCS real-time hybrid execution bridge",
      "Ankaa-3 native gate set (CZ, RZ, RX) transpilation",
    ],
    status: "Supported",
  },
  {
    id: "quantinuum",
    name: "Quantinuum",
    logo: "QN",
    color: "from-emerald-600 to-teal-700",
    accent: "emerald",
    chip: "H2-1",
    qubits: 56,
    technology: "Trapped-ion QCCD (Ytterbium)",
    gateTime: "~1 ms",
    coherence: "~1 s",
    fidelity: "99.9%+",
    sdk: "TKET / InQuanto",
    sdkUrl: "https://docs.quantinuum.com",
    access: "Quantinuum Nexus, Azure Quantum, Amazon Braket",
    description:
      "Quantinuum's H2-1 processor (formerly Honeywell Quantum Solutions) uses a Quantum Charge-Coupled Device (QCCD) trapped-ion architecture, delivering 56 qubits with the highest two-qubit gate fidelity of any commercial system. The TKET compiler and InQuanto chemistry framework make it the leading platform for quantum chemistry and materials science. EoS provides a native TKET-based HAL driver with full Quantinuum Nexus API integration.",
    eosFeatures: [
      "TKET compiler integration in eQC circuit optimizer",
      "Quantinuum Nexus REST API HAL driver",
      "InQuanto quantum chemistry runtime bridge",
      "H-Series native gate set (ZZ, Rz, PhasedX) transpilation",
    ],
    status: "Supported",
  },
];

// ── Kernel features ──────────────────────────────────────────────────────────
const kernelFeatures = [
  {
    icon: Cpu,
    title: "QPU HAL",
    subtitle: "Hardware Abstraction Layer",
    description:
      "A unified driver interface that abstracts IBM, Google, IonQ, Rigetti, Microsoft, and Quantinuum quantum processors behind a single eQC API. Write once, run on any QPU.",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Clock,
    title: "Real-Time Pulse Engine",
    subtitle: "Sub-100 ns gate control",
    description:
      "Deterministic pulse generation for superconducting and trapped-ion gate operations. Integrates with FPGA-based arbitrary waveform generators (AWGs) for nanosecond-precision control.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Shield,
    title: "QEC Runtime",
    subtitle: "Quantum Error Correction",
    description:
      "Real-time surface code syndrome measurement and decoding. Supports Google's below-threshold error correction model and IBM's heavy-hex lattice code.",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
  },
  {
    icon: GitBranch,
    title: "Quantum Scheduler",
    subtitle: "Deterministic circuit queue",
    description:
      "Priority-based quantum job scheduling with circuit dependency resolution, qubit allocation, and deallocation. Prevents qubit state collisions across concurrent jobs.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    icon: Network,
    title: "Hybrid Bridge",
    subtitle: "Classical ↔ Quantum handoff",
    description:
      "Seamless data transfer between classical CPU memory and quantum registers. Supports mid-circuit measurement and real-time classical feedback for variational algorithms.",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Layers,
    title: "Cryogenic I/O Drivers",
    subtitle: "Dilution refrigerator control",
    description:
      "Low-level drivers for cryogenic control electronics, including dilution refrigerator temperature management, FPGA AWG interfaces, and microwave signal routing.",
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20",
  },
  {
    icon: Code2,
    title: "Circuit Compiler",
    subtitle: "OpenQASM 3.0 + native gates",
    description:
      "Multi-backend circuit compiler supporting OpenQASM 3.0, Qiskit IR, Cirq, Quil, and Q#. Transpiles to vendor-native gate sets with depth and error optimization.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: Activity,
    title: "Telemetry & Calibration",
    subtitle: "Automated qubit characterization",
    description:
      "Continuous qubit drift monitoring, T1/T2 coherence measurement, gate fidelity benchmarking, and automated recalibration scheduling to maintain peak performance.",
    color: "text-teal-400",
    bg: "bg-teal-500/10 border-teal-500/20",
  },
  {
    icon: Lock,
    title: "Quantum-Safe Security",
    subtitle: "Post-quantum cryptography",
    description:
      "Integrated NIST post-quantum cryptographic algorithms (CRYSTALS-Kyber, CRYSTALS-Dilithium) for secure qubit state isolation and quantum-safe key exchange.",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  },
];

// ── Hardware comparison table ────────────────────────────────────────────────
const comparisonRows = [
  {
    label: "Chip",
    ibm: "Heron r2",
    google: "Willow",
    microsoft: "Majorana†",
    ionq: "Forte",
    rigetti: "Ankaa-3",
    quantinuum: "H2-1",
  },
  {
    label: "Qubits",
    ibm: "156",
    google: "105",
    microsoft: "Future",
    ionq: "35 AQ",
    rigetti: "84",
    quantinuum: "56",
  },
  {
    label: "Technology",
    ibm: "Superconducting",
    google: "Superconducting",
    microsoft: "Topological",
    ionq: "Trapped-ion",
    rigetti: "Superconducting",
    quantinuum: "Trapped-ion QCCD",
  },
  {
    label: "Gate Time",
    ibm: "~50 ns",
    google: "~25 ns",
    microsoft: "TBD",
    ionq: "~200 µs",
    rigetti: "~40 ns",
    quantinuum: "~1 ms",
  },
  {
    label: "Coherence",
    ibm: "~300 µs",
    google: "~100 µs",
    microsoft: "Unlimited†",
    ionq: "~10 s",
    rigetti: "~50 µs",
    quantinuum: "~1 s",
  },
  {
    label: "2Q Fidelity",
    ibm: "99.9%",
    google: "99.7%",
    microsoft: "99.99%†",
    ionq: "99.9%+",
    rigetti: "99.5%",
    quantinuum: "99.9%+",
  },
  {
    label: "SDK",
    ibm: "Qiskit",
    google: "Cirq",
    microsoft: "Q#",
    ionq: "Multi",
    rigetti: "Pyquil",
    quantinuum: "TKET",
  },
  {
    label: "EoS Status",
    ibm: "✅ Supported",
    google: "✅ Supported",
    microsoft: "🔵 Beta",
    ionq: "✅ Supported",
    rigetti: "✅ Supported",
    quantinuum: "✅ Supported",
  },
];

// ── Page component ───────────────────────────────────────────────────────────
export default function Quantum() {
  const [activeVendor, setActiveVendor] = useState("ibm");
  const vendor = vendors.find(v => v.id === activeVendor) ?? vendors[0];

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/40 via-[#050510] to-indigo-950/30" />
        <QuantumCanvas />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative container mx-auto px-4 py-24">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-3 py-1">
                <Atom className="w-3.5 h-3.5 mr-1.5" />
                EmbeddedOS Quantum
              </Badge>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 px-3 py-1">
                eQC Kernel Module
              </Badge>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">EoS for</span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Quantum Computing
              </span>
            </h1>

            <p className="text-xl text-white/70 mb-8 max-w-2xl leading-relaxed">
              The EmbeddedOS Quantum Computing module (eQC) extends the EoS
              kernel with real-time QPU scheduling, hardware abstraction for all
              major quantum processors, and a unified SDK interface for IBM,
              Google, Microsoft, IonQ, and Rigetti hardware.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button
                asChild
                size="lg"
                className="bg-purple-600 hover:bg-purple-500 text-white"
              >
                <Link href="/architecture">
                  View Architecture <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Link href="/api-docs">
                  eQC API Reference <ChevronRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Supported QPUs", value: "5", sub: "Vendors" },
                {
                  label: "Min Gate Latency",
                  value: "<25ns",
                  sub: "Google Willow",
                },
                { label: "Max Coherence", value: "10s", sub: "IonQ Forte" },
                {
                  label: "Gate Fidelity",
                  value: "99.9%+",
                  sub: "Best-in-class",
                },
              ].map(s => (
                <div
                  key={s.label}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
                >
                  <div className="text-2xl font-bold text-purple-300">
                    {s.value}
                  </div>
                  <div className="text-xs text-white/50 mt-1">{s.label}</div>
                  <div className="text-xs text-white/30">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Vendor Ecosystem ── */}
      <section className="py-24 bg-gradient-to-b from-[#050510] to-[#080820]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 mb-4">
              Hardware Ecosystem
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Supported Quantum Processors
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              EoS provides native kernel-level support for every major quantum
              computing platform through the eQC Hardware Abstraction Layer
              (HAL).
            </p>
          </div>

          {/* Vendor tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {vendors.map(v => (
              <button
                key={v.id}
                onClick={() => setActiveVendor(v.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  activeVendor === v.id
                    ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>

          {/* Vendor detail card */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className={`bg-gradient-to-r ${vendor.color} p-8`}>
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white text-lg">
                        {vendor.logo}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {vendor.name}
                        </h3>
                        <p className="text-white/70">{vendor.chip}</p>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={`${
                      vendor.status === "Supported"
                        ? "bg-green-500/20 text-green-200 border-green-400/30"
                        : "bg-blue-500/20 text-blue-200 border-blue-400/30"
                    } text-sm`}
                  >
                    {vendor.status}
                  </Badge>
                </div>
              </div>

              <div className="p-8 grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-white/70 leading-relaxed mb-6">
                    {vendor.description}
                  </p>

                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Qubits", value: String(vendor.qubits) },
                      { label: "Technology", value: vendor.technology },
                      { label: "Gate Time", value: vendor.gateTime },
                      { label: "Coherence", value: vendor.coherence },
                      { label: "2Q Fidelity", value: vendor.fidelity },
                      { label: "SDK", value: vendor.sdk },
                    ].map(spec => (
                      <div
                        key={spec.label}
                        className="bg-white/5 rounded-lg p-3 border border-white/10"
                      >
                        <div className="text-xs text-white/40 mb-1">
                          {spec.label}
                        </div>
                        <div className="text-sm font-semibold text-white">
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    EoS eQC Integration Features
                  </h4>
                  <ul className="space-y-3">
                    {vendor.eosFeatures.map(f => (
                      <li
                        key={f}
                        className="flex items-start gap-3 text-sm text-white/70"
                      >
                        <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex gap-3">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <a
                        href={vendor.sdkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {vendor.sdk} Docs{" "}
                        <ExternalLink className="ml-1.5 w-3.5 h-3.5" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-500 text-white"
                    >
                      <Link href="/api-docs">eQC API</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Kernel Features ── */}
      <section className="py-24 bg-[#080820]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 mb-4">
              Kernel Architecture
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              eQC Kernel Module Features
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Nine specialized subsystems extending the EoS microkernel with
              full quantum computing support — from nanosecond pulse control to
              post-quantum cryptographic isolation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {kernelFeatures.map(f => {
              const Icon = f.icon;
              return (
                <Card
                  key={f.title}
                  className={`${f.bg} border rounded-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-lg`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3 mb-1">
                      <Icon className={`w-5 h-5 ${f.color}`} />
                      <CardTitle className="text-white text-base">
                        {f.title}
                      </CardTitle>
                    </div>
                    <p className={`text-xs font-medium ${f.color}`}>
                      {f.subtitle}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Hardware Comparison Table ── */}
      <section className="py-24 bg-gradient-to-b from-[#080820] to-[#050510]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-4">
              Side-by-Side Comparison
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Quantum Hardware Comparison
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              All six supported quantum computing platforms compared across key
              technical specifications and EoS integration status.
            </p>
          </div>

          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white/40 font-medium w-32">
                    Spec
                  </th>
                  {vendors.map(v => (
                    <th
                      key={v.id}
                      className="text-center py-4 px-4 text-white font-semibold"
                    >
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs bg-gradient-to-r ${v.color} text-white mb-1`}
                      >
                        {v.logo}
                      </div>
                      <div>{v.name.split(" ")[0]}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.label}
                    className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/2" : ""}`}
                  >
                    <td className="py-3.5 px-4 text-white/50 font-medium">
                      {row.label}
                    </td>
                    <td className="py-3.5 px-4 text-center text-white/80">
                      {row.ibm}
                    </td>
                    <td className="py-3.5 px-4 text-center text-white/80">
                      {row.google}
                    </td>
                    <td className="py-3.5 px-4 text-center text-white/80">
                      {row.microsoft}
                    </td>
                    <td className="py-3.5 px-4 text-center text-white/80">
                      {row.ionq}
                    </td>
                    <td className="py-3.5 px-4 text-center text-white/80">
                      {row.rigetti}
                    </td>
                    <td className="py-3.5 px-4 text-center text-white/80">
                      {row.quantinuum}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-white/30 text-xs mt-3 text-center">
              † Microsoft topological qubits are in research phase. Coherence
              and fidelity figures are theoretical targets.
            </p>
          </div>
        </div>
      </section>

      {/* ── Quantum Paradigms ── */}
      <section className="py-24 bg-[#050510]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mb-4">
              Computing Paradigms
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              All Quantum Paradigms Supported
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Gate-Based",
                icon: Binary,
                color: "text-purple-400",
                bg: "bg-purple-500/10 border-purple-500/20",
                desc: "Universal quantum circuits using single and two-qubit gates. Supported by IBM, Google, IonQ, Rigetti, and Quantinuum.",
                vendors: ["IBM", "Google", "IonQ", "Rigetti", "Quantinuum"],
              },
              {
                name: "Topological",
                icon: Atom,
                color: "text-indigo-400",
                bg: "bg-indigo-500/10 border-indigo-500/20",
                desc: "Inherently fault-tolerant qubits using Majorana fermions. Microsoft's long-term quantum roadmap.",
                vendors: ["Microsoft"],
              },
              {
                name: "Hybrid Classical-Quantum",
                icon: Server,
                color: "text-cyan-400",
                bg: "bg-cyan-500/10 border-cyan-500/20",
                desc: "Variational algorithms combining classical optimization with quantum circuit evaluation (VQE, QAOA).",
                vendors: ["All vendors"],
              },
              {
                name: "Quantum Annealing",
                icon: BarChart3,
                color: "text-yellow-400",
                bg: "bg-yellow-500/10 border-yellow-500/20",
                desc: "Optimization-focused quantum computing for combinatorial problems. D-Wave integration planned.",
                vendors: ["D-Wave (planned)"],
              },
            ].map(p => {
              const Icon = p.icon;
              return (
                <Card key={p.name} className={`${p.bg} border rounded-xl`}>
                  <CardHeader className="pb-2">
                    <Icon className={`w-6 h-6 ${p.color} mb-2`} />
                    <CardTitle className="text-white text-base">
                      {p.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/60 text-sm mb-4">{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {p.vendors.map(v => (
                        <span
                          key={v}
                          className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60"
                        >
                          {v}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Simulation Software ── */}
      <section className="py-24 bg-[#080820]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 mb-4">
              Simulation Software
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">
              Quantum Simulation &amp; Hybrid Frameworks
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              EoS eQC integrates with all major quantum simulation frameworks —
              enabling development and testing without physical QPU access, and
              powering hybrid classical-quantum algorithms.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Qiskit Aer",
                vendor: "IBM",
                color: "text-blue-400",
                bg: "bg-blue-500/10 border-blue-500/20",
                badge: "bg-blue-500/20 text-blue-300",
                type: "State-vector / Noise Simulator",
                desc: "High-performance quantum circuit simulator supporting state-vector, density matrix, and stabilizer simulation. Includes realistic noise models from IBM hardware calibration data.",
                eosUse:
                  "eQC development mode — run circuits locally before submitting to real IBM QPU",
                url: "https://qiskit.github.io/qiskit-aer/",
              },
              {
                name: "Cirq Simulator",
                vendor: "Google",
                color: "text-green-400",
                bg: "bg-green-500/10 border-green-500/20",
                badge: "bg-green-500/20 text-green-300",
                type: "State-vector / Clifford Simulator",
                desc: "Google's circuit simulation engine with support for state-vector, density matrix, Clifford, and MPS (matrix product state) simulators. Optimized for Willow-style circuits.",
                eosUse:
                  "eQC surface code QEC testing and Willow circuit validation before cloud submission",
                url: "https://quantumai.google/cirq/simulate",
              },
              {
                name: "PennyLane",
                vendor: "Xanadu",
                color: "text-yellow-400",
                bg: "bg-yellow-500/10 border-yellow-500/20",
                badge: "bg-yellow-500/20 text-yellow-300",
                type: "Hybrid Quantum-Classical ML",
                desc: "The leading framework for quantum machine learning and variational quantum algorithms. Supports automatic differentiation of quantum circuits and integrates with PyTorch, TensorFlow, and JAX.",
                eosUse:
                  "eQC Hybrid Bridge — VQE, QAOA, and QML workloads with classical optimizer feedback loops",
                url: "https://pennylane.ai",
              },
              {
                name: "QuTiP",
                vendor: "Open-Source",
                color: "text-purple-400",
                bg: "bg-purple-500/10 border-purple-500/20",
                badge: "bg-purple-500/20 text-purple-300",
                type: "Open Quantum Systems Simulator",
                desc: "Quantum Toolbox in Python — the standard tool for simulating open quantum systems, Lindblad master equations, and quantum optics. Used for qubit decoherence modeling and pulse-level simulation.",
                eosUse:
                  "eQC pulse engine calibration — T1/T2 decoherence modeling for cryogenic qubit drivers",
                url: "https://qutip.org",
              },
              {
                name: "Qulacs",
                vendor: "QunaSys",
                color: "text-pink-400",
                bg: "bg-pink-500/10 border-pink-500/20",
                badge: "bg-pink-500/20 text-pink-300",
                type: "High-Performance State-Vector",
                desc: "The fastest open-source quantum circuit simulator, optimized for multi-core CPU and GPU execution. Supports up to 30+ qubits in state-vector mode with SIMD and CUDA acceleration.",
                eosUse:
                  "eQC CI/CD pipeline — fast circuit regression testing without QPU queue wait times",
                url: "https://github.com/qulacs/qulacs",
              },
              {
                name: "Amazon Braket Local",
                vendor: "Amazon Web Services",
                color: "text-orange-400",
                bg: "bg-orange-500/10 border-orange-500/20",
                badge: "bg-orange-500/20 text-orange-300",
                type: "Multi-backend Cloud + Local",
                desc: "Amazon Braket provides unified access to IonQ, Rigetti, OQC, and QuEra hardware alongside local state-vector and density matrix simulators. The Braket SDK enables multi-provider circuit submission from a single API.",
                eosUse:
                  "eQC multi-cloud routing — submit to IonQ or Rigetti via Braket as an alternative to direct APIs",
                url: "https://aws.amazon.com/braket/",
              },
            ].map(sim => (
              <Card key={sim.name} className={`${sim.bg} border rounded-xl`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge className={`${sim.badge} border-0 text-xs`}>
                      {sim.vendor}
                    </Badge>
                    <span className="text-xs text-white/30">{sim.type}</span>
                  </div>
                  <CardTitle className={`text-lg ${sim.color}`}>
                    {sim.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-white/60 text-sm leading-relaxed">
                    {sim.desc}
                  </p>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-white/40 font-medium mb-1">
                      EoS Integration
                    </p>
                    <p className="text-xs text-white/70">{sim.eosUse}</p>
                  </div>
                  <a
                    href={sim.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1 text-xs ${sim.color} hover:opacity-80 transition-opacity`}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Documentation
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Hybrid quantum-classical deep-dive */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-white mb-3">
                Hybrid Classical-Quantum Computing
              </h3>
              <p className="text-white/60 text-sm max-w-2xl mx-auto">
                The NISQ era demands tight integration between classical CPUs
                and quantum processors. EoS eQC's Hybrid Bridge enables
                real-time feedback loops for variational algorithms.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Classical Optimizer",
                  color: "border-blue-500",
                  badge: "bg-blue-500/20 text-blue-300",
                  desc: "A classical optimizer (L-BFGS, COBYLA, ADAM) runs on the EoS CPU and proposes circuit parameters for the next quantum evaluation.",
                  code: "optimizer = COBYLA()\nparams = optimizer.step(cost_fn)",
                },
                {
                  step: "02",
                  title: "Quantum Evaluation",
                  color: "border-purple-500",
                  badge: "bg-purple-500/20 text-purple-300",
                  desc: "The parameterized quantum circuit is compiled and submitted to the QPU via eQC HAL. Mid-circuit measurements feed back to the classical layer in real-time.",
                  code: "circuit = ansatz(params)\nresult = eqc.run(circuit, shots=1024)",
                },
                {
                  step: "03",
                  title: "Convergence",
                  color: "border-green-500",
                  badge: "bg-green-500/20 text-green-300",
                  desc: "The expectation value is returned to the classical optimizer. The loop repeats until the energy/cost converges to the ground state or optimal solution.",
                  code: "energy = result.expectation_value(H)\nif abs(energy - prev) < 1e-6: break",
                },
              ].map(step => (
                <div
                  key={step.step}
                  className={`bg-white/5 border-l-4 ${step.color} border border-white/10 rounded-xl p-5`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-white/30 text-xs font-mono">
                      Step {step.step}
                    </span>
                    <Badge className={`${step.badge} border-0 text-xs`}>
                      {step.title}
                    </Badge>
                  </div>
                  <p className="text-white/60 text-sm mb-3">{step.desc}</p>
                  <pre className="text-xs text-cyan-300 bg-black/30 rounded-lg p-3 font-mono overflow-x-auto">
                    {step.code}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section className="py-24 bg-gradient-to-b from-[#050510] to-[#080820]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 mb-4">
              Development Roadmap
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-4">eQC Roadmap</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                phase: "Phase 1",
                title: "QPU HAL & Circuit Compiler",
                status: "In Progress",
                color: "border-purple-500",
                badge: "bg-purple-500/20 text-purple-300",
                items: [
                  "IBM Qiskit Runtime HAL driver",
                  "IonQ REST API HAL driver",
                  "Rigetti Pyquil HAL driver",
                  "OpenQASM 3.0 parser and transpiler",
                ],
              },
              {
                phase: "Phase 2",
                title: "Real-Time Control & QEC",
                status: "Planned Q4 2025",
                color: "border-cyan-500",
                badge: "bg-cyan-500/20 text-cyan-300",
                items: [
                  "Sub-100ns pulse engine for superconducting qubits",
                  "Surface code QEC runtime",
                  "Google Willow HAL driver",
                  "Real-time syndrome decoder",
                ],
              },
              {
                phase: "Phase 3",
                title: "Hybrid & Cloud Integration",
                status: "Planned 2026",
                color: "border-green-500",
                badge: "bg-green-500/20 text-green-300",
                items: [
                  "Azure Quantum multi-provider routing",
                  "Hybrid classical-quantum bridge",
                  "Variational algorithm runtime (VQE, QAOA)",
                  "Microsoft Q# language runtime",
                ],
              },
              {
                phase: "Phase 4",
                title: "Fault-Tolerant & Topological",
                status: "Research 2027+",
                color: "border-indigo-500",
                badge: "bg-indigo-500/20 text-indigo-300",
                items: [
                  "Microsoft Majorana topological qubit driver",
                  "Fault-tolerant logical qubit abstraction",
                  "Post-quantum cryptographic key management",
                  "D-Wave annealing integration",
                ],
              },
            ].map(r => (
              <div
                key={r.phase}
                className={`bg-white/5 border-l-4 ${r.color} border border-white/10 rounded-xl p-6`}
              >
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <span className="text-white/40 text-xs font-mono mr-2">
                      {r.phase}
                    </span>
                    <span className="text-white font-semibold">{r.title}</span>
                  </div>
                  <Badge className={`${r.badge} border-0 text-xs`}>
                    {r.status}
                  </Badge>
                </div>
                <ul className="grid sm:grid-cols-2 gap-1.5">
                  {r.items.map(item => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-white/60"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-[#080820]">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Atom className="w-12 h-12 text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Build the Quantum Future with EmbeddedOS
            </h2>
            <p className="text-white/60 text-lg mb-8">
              The eQC module brings real-time quantum hardware control to the
              EoS kernel. Join the Foundation to help shape the operating system
              for the quantum era.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-purple-600 hover:bg-purple-500 text-white"
              >
                <Link href="/get-involved">
                  Get Involved <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Link href="/roadmap">View Full Roadmap</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Link href="/donate">Support the Foundation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
