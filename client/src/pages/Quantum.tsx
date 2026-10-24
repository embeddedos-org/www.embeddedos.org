import { useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { BpPage, LocalNav, PageHero, Section, Stats } from "@/components/bp";
import "./Quantum.css";

// ── Vendor data ──────────────────────────────────────────────────────────────
const vendors = [
  {
    id: "ibm",
    name: "IBM Quantum",
    logo: "IBM",
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
    title: "QPU HAL",
    subtitle: "Hardware Abstraction Layer",
    description:
      "A unified driver interface that abstracts IBM, Google, IonQ, Rigetti, Microsoft, and Quantinuum quantum processors behind a single eQC API. Write once, run on any QPU.",
  },
  {
    title: "Real-Time Pulse Engine",
    subtitle: "Sub-100 ns gate control",
    description:
      "Deterministic pulse generation for superconducting and trapped-ion gate operations. Integrates with FPGA-based arbitrary waveform generators (AWGs) for nanosecond-precision control.",
  },
  {
    title: "QEC Runtime",
    subtitle: "Quantum Error Correction",
    description:
      "Real-time surface code syndrome measurement and decoding. Supports Google's below-threshold error correction model and IBM's heavy-hex lattice code.",
  },
  {
    title: "Quantum Scheduler",
    subtitle: "Deterministic circuit queue",
    description:
      "Priority-based quantum job scheduling with circuit dependency resolution, qubit allocation, and deallocation. Prevents qubit state collisions across concurrent jobs.",
  },
  {
    title: "Hybrid Bridge",
    subtitle: "Classical ↔ Quantum handoff",
    description:
      "Seamless data transfer between classical CPU memory and quantum registers. Supports mid-circuit measurement and real-time classical feedback for variational algorithms.",
  },
  {
    title: "Cryogenic I/O Drivers",
    subtitle: "Dilution refrigerator control",
    description:
      "Low-level drivers for cryogenic control electronics, including dilution refrigerator temperature management, FPGA AWG interfaces, and microwave signal routing.",
  },
  {
    title: "Circuit Compiler",
    subtitle: "OpenQASM 3.0 + native gates",
    description:
      "Multi-backend circuit compiler supporting OpenQASM 3.0, Qiskit IR, Cirq, Quil, and Q#. Transpiles to vendor-native gate sets with depth and error optimization.",
  },
  {
    title: "Telemetry & Calibration",
    subtitle: "Automated qubit characterization",
    description:
      "Continuous qubit drift monitoring, T1/T2 coherence measurement, gate fidelity benchmarking, and automated recalibration scheduling to maintain peak performance.",
  },
  {
    title: "Quantum-Safe Security",
    subtitle: "Post-quantum cryptography",
    description:
      "Integrated NIST post-quantum cryptographic algorithms (CRYSTALS-Kyber, CRYSTALS-Dilithium) for secure qubit state isolation and quantum-safe key exchange.",
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

const paradigms = [
  {
    name: "Gate-Based",
    desc: "Universal quantum circuits using single and two-qubit gates. Supported by IBM, Google, IonQ, Rigetti, and Quantinuum.",
    vendors: ["IBM", "Google", "IonQ", "Rigetti", "Quantinuum"],
  },
  {
    name: "Topological",
    desc: "Inherently fault-tolerant qubits using Majorana fermions. Microsoft's long-term quantum roadmap.",
    vendors: ["Microsoft"],
  },
  {
    name: "Hybrid Classical-Quantum",
    desc: "Variational algorithms combining classical optimization with quantum circuit evaluation (VQE, QAOA).",
    vendors: ["All vendors"],
  },
  {
    name: "Quantum Annealing",
    desc: "Optimization-focused quantum computing for combinatorial problems. D-Wave integration planned.",
    vendors: ["D-Wave (planned)"],
  },
];

const simulators = [
  {
    name: "Qiskit Aer",
    vendor: "IBM",
    type: "State-vector / Noise Simulator",
    desc: "High-performance quantum circuit simulator supporting state-vector, density matrix, and stabilizer simulation. Includes realistic noise models from IBM hardware calibration data.",
    eosUse:
      "eQC development mode — run circuits locally before submitting to real IBM QPU",
    url: "https://qiskit.github.io/qiskit-aer/",
  },
  {
    name: "Cirq Simulator",
    vendor: "Google",
    type: "State-vector / Clifford Simulator",
    desc: "Google's circuit simulation engine with support for state-vector, density matrix, Clifford, and MPS (matrix product state) simulators. Optimized for Willow-style circuits.",
    eosUse:
      "eQC surface code QEC testing and Willow circuit validation before cloud submission",
    url: "https://quantumai.google/cirq/simulate",
  },
  {
    name: "PennyLane",
    vendor: "Xanadu",
    type: "Hybrid Quantum-Classical ML",
    desc: "The leading framework for quantum machine learning and variational quantum algorithms. Supports automatic differentiation of quantum circuits and integrates with PyTorch, TensorFlow, and JAX.",
    eosUse:
      "eQC Hybrid Bridge — VQE, QAOA, and QML workloads with classical optimizer feedback loops",
    url: "https://pennylane.ai",
  },
  {
    name: "QuTiP",
    vendor: "Open-Source",
    type: "Open Quantum Systems Simulator",
    desc: "Quantum Toolbox in Python — the standard tool for simulating open quantum systems, Lindblad master equations, and quantum optics. Used for qubit decoherence modeling and pulse-level simulation.",
    eosUse:
      "eQC pulse engine calibration — T1/T2 decoherence modeling for cryogenic qubit drivers",
    url: "https://qutip.org",
  },
  {
    name: "Qulacs",
    vendor: "QunaSys",
    type: "High-Performance State-Vector",
    desc: "The fastest open-source quantum circuit simulator, optimized for multi-core CPU and GPU execution. Supports up to 30+ qubits in state-vector mode with SIMD and CUDA acceleration.",
    eosUse:
      "eQC CI/CD pipeline — fast circuit regression testing without QPU queue wait times",
    url: "https://github.com/qulacs/qulacs",
  },
  {
    name: "Amazon Braket Local",
    vendor: "Amazon Web Services",
    type: "Multi-backend Cloud + Local",
    desc: "Amazon Braket provides unified access to IonQ, Rigetti, OQC, and QuEra hardware alongside local state-vector and density matrix simulators. The Braket SDK enables multi-provider circuit submission from a single API.",
    eosUse:
      "eQC multi-cloud routing — submit to IonQ or Rigetti via Braket as an alternative to direct APIs",
    url: "https://aws.amazon.com/braket/",
  },
];

const hybridSteps = [
  {
    step: "01",
    title: "Classical Optimizer",
    desc: "A classical optimizer (L-BFGS, COBYLA, ADAM) runs on the EoS CPU and proposes circuit parameters for the next quantum evaluation.",
    code: "optimizer = COBYLA()\nparams = optimizer.step(cost_fn)",
  },
  {
    step: "02",
    title: "Quantum Evaluation",
    desc: "The parameterized quantum circuit is compiled and submitted to the QPU via eQC HAL. Mid-circuit measurements feed back to the classical layer in real-time.",
    code: "circuit = ansatz(params)\nresult = eqc.run(circuit, shots=1024)",
  },
  {
    step: "03",
    title: "Convergence",
    desc: "The expectation value is returned to the classical optimizer. The loop repeats until the energy/cost converges to the ground state or optimal solution.",
    code: "energy = result.expectation_value(H)\nif abs(energy - prev) < 1e-6: break",
  },
];

const roadmap = [
  {
    phase: "Phase 1",
    title: "QPU HAL & Circuit Compiler",
    status: "In Progress",
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
    status: "Planned",
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
    items: [
      "Microsoft Majorana topological qubit driver",
      "Fault-tolerant logical qubit abstraction",
      "Post-quantum cryptographic key management",
      "D-Wave annealing integration",
    ],
  },
];

// ── Page component ───────────────────────────────────────────────────────────
export default function Quantum() {
  const [activeVendor, setActiveVendor] = useState("ibm");
  const vendor = vendors.find(v => v.id === activeVendor) ?? vendors[0];

  return (
    <BpPage className="qc">
      <PageHero
        sig
        label="EmbeddedOS Quantum"
        title={
          <>
            EoS for
            <br />
            Quantum Computing
          </>
        }
        lead="The EmbeddedOS Quantum Computing module (eQC) extends the EoS kernel with real-time QPU scheduling, hardware abstraction for all major quantum processors, and a unified SDK interface for IBM, Google, Microsoft, IonQ, and Rigetti hardware."
      >
        <ul className="badges">
          <li>eQC Kernel Module</li>
        </ul>
        <div className="ctas">
          <Link href="/architecture" className="btn pri">
            View Architecture{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/api-docs" className="btn gh">
            eQC API Reference <span className="ar">›</span>
          </Link>
        </div>
      </PageHero>

      <div className="wrap qc-stats">
        <Stats
          items={[
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
          ].map(s => ({
            value: s.value,
            label: (
              <>
                {s.label}
                <small>{s.sub}</small>
              </>
            ),
          }))}
        />
      </div>

      <LocalNav
        name="eQC"
        items={[
          { id: "processors", label: "Processors" },
          { id: "kernel", label: "Kernel" },
          { id: "compare", label: "Comparison" },
          { id: "paradigms", label: "Paradigms" },
          { id: "simulation", label: "Simulation" },
          { id: "roadmap", label: "Roadmap" },
        ]}
      />

      {/* ── Vendor Ecosystem ── */}
      <Section
        id="processors"
        label="Hardware Ecosystem"
        title="Supported Quantum Processors"
        lead="EoS provides native kernel-level support for every major quantum computing platform through the eQC Hardware Abstraction Layer (HAL)."
        split
      >
        <div className="ctas qc-tabs" role="group" aria-label="Quantum vendors">
          {vendors.map(v => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActiveVendor(v.id)}
              aria-pressed={activeVendor === v.id}
              className="btn gh sm"
            >
              {v.name}
            </button>
          ))}
        </div>

        <article className="qc-vendor">
          <header className="qc-vh">
            <div className="qc-vid">
              <span className="qc-logo">{vendor.logo}</span>
              <div>
                <h3>{vendor.name}</h3>
                <p>{vendor.chip}</p>
              </div>
            </div>
            <span
              className={vendor.status === "Supported" ? "st ok" : "st"}
              style={
                vendor.status === "Supported"
                  ? undefined
                  : ({ "--c": "#60A5FA" } as CSSProperties)
              }
            >
              {vendor.status}
            </span>
          </header>

          <div className="qc-vb">
            <div>
              <p className="qc-desc">{vendor.description}</p>
              <dl className="qc-specs">
                {[
                  { label: "Qubits", value: String(vendor.qubits) },
                  { label: "Technology", value: vendor.technology },
                  { label: "Gate Time", value: vendor.gateTime },
                  { label: "Coherence", value: vendor.coherence },
                  { label: "2Q Fidelity", value: vendor.fidelity },
                  { label: "SDK", value: vendor.sdk },
                ].map(spec => (
                  <div key={spec.label}>
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h4 className="qc-h4">EoS eQC Integration Features</h4>
              <ul className="qc-feat">
                {vendor.eosFeatures.map(f => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <div className="ctas qc-vlinks">
                <a
                  href={vendor.sdkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn gh sm"
                >
                  {vendor.sdk} Docs <span aria-hidden="true">↗</span>
                </a>
                <Link href="/api-docs" className="btn pri sm">
                  eQC API
                </Link>
              </div>
            </div>
          </div>
        </article>
      </Section>

      {/* ── Kernel Features ── */}
      <Section
        id="kernel"
        alt
        label="Kernel Architecture"
        title="eQC Kernel Module Features"
        lead="Nine specialized subsystems extending the EoS microkernel with full quantum computing support — from nanosecond pulse control to post-quantum cryptographic isolation."
        split
      >
        <ul className="cards">
          {kernelFeatures.map(f => (
            <li key={f.title}>
              <div className="card">
                <h3>{f.title}</h3>
                <span className="k">{f.subtitle}</span>
                <p>{f.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Hardware Comparison Table ── */}
      <Section
        id="compare"
        label="Side-by-Side Comparison"
        title="Quantum Hardware Comparison"
        lead="All six supported quantum computing platforms compared across key technical specifications and EoS integration status."
        split
      >
        <div
          className="tbl qc-tbl"
          tabIndex={0}
          role="region"
          aria-label="Quantum hardware comparison table"
        >
          <table>
            <thead>
              <tr>
                <th scope="col">Spec</th>
                {vendors.map(v => (
                  <th key={v.id} scope="col">
                    <span className="qc-pill">{v.logo}</span>
                    <span className="qc-th">{v.name.split(" ")[0]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map(row => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  <td>{row.ibm}</td>
                  <td>{row.google}</td>
                  <td>{row.microsoft}</td>
                  <td>{row.ionq}</td>
                  <td>{row.rigetti}</td>
                  <td>{row.quantinuum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="fine qc-after">
          † Microsoft topological qubits are in research phase. Coherence and
          fidelity figures are theoretical targets.
        </p>
      </Section>

      {/* ── Quantum Paradigms ── */}
      <Section
        id="paradigms"
        alt
        label="Computing Paradigms"
        title="All Quantum Paradigms Supported"
      >
        <ul className="cards four">
          {paradigms.map(p => (
            <li key={p.name}>
              <div className="card">
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <ul className="qc-chips">
                  {p.vendors.map(v => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── Simulation Software ── */}
      <Section
        id="simulation"
        label="Simulation Software"
        title="Quantum Simulation & Hybrid Frameworks"
        lead="EoS eQC integrates with all major quantum simulation frameworks — enabling development and testing without physical QPU access, and powering hybrid classical-quantum algorithms."
        split
      >
        <ul className="cards">
          {simulators.map(sim => (
            <li key={sim.name}>
              <div className="card">
                <div className="top">
                  <span className="qc-chip">{sim.vendor}</span>
                  <span className="k qc-type">{sim.type}</span>
                </div>
                <h3>{sim.name}</h3>
                <p>{sim.desc}</p>
                <div className="qc-use">
                  <p className="k">EoS Integration</p>
                  <p>{sim.eosUse}</p>
                </div>
                <a
                  href={sim.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="more"
                >
                  Documentation <span aria-hidden="true">↗</span>
                </a>
              </div>
            </li>
          ))}
        </ul>

        {/* Hybrid quantum-classical deep-dive */}
        <div className="qc-hybrid">
          <h3 className="h3">Hybrid Classical-Quantum Computing</h3>
          <p className="qc-hl">
            The NISQ era demands tight integration between classical CPUs and
            quantum processors. EoS eQC's Hybrid Bridge enables real-time
            feedback loops for variational algorithms.
          </p>
          <ol className="cards">
            {hybridSteps.map(step => (
              <li key={step.step}>
                <div className="card">
                  <div className="top">
                    <span className="k">Step {step.step}</span>
                    <span className="qc-chip">{step.title}</span>
                  </div>
                  <p>{step.desc}</p>
                  <div className="code">
                    <pre>{step.code}</pre>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* ── Roadmap ── */}
      <Section id="roadmap" alt label="Development Roadmap" title="eQC Roadmap">
        <ol className="qc-road">
          {roadmap.map(r => (
            <li key={r.phase}>
              <div className="qc-rh">
                <p>
                  <span className="k">{r.phase}</span>
                  <b>{r.title}</b>
                </p>
                <span className="st">{r.status}</span>
              </div>
              <ul>
                {r.items.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── CTA ── */}
      <Section
        id="join"
        title="Build the Quantum Future with EmbeddedOS"
        lead="The eQC module brings real-time quantum hardware control to the EoS kernel. Join the Foundation to help shape the operating system for the quantum era."
      >
        <div className="ctas">
          <Link href="/get-involved" className="btn pri">
            Get Involved{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/roadmap" className="btn gh">
            View Full Roadmap
          </Link>
          <Link href="/donate" className="btn gh">
            Support the Foundation
          </Link>
        </div>
      </Section>
    </BpPage>
  );
}
