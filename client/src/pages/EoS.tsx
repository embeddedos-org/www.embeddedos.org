import ProductRepositoryPanel from "@/components/ProductRepositoryPanel";
import { type CSSProperties } from "react";
import { Link } from "wouter";
import { Band, BpPage, PageHero, Section } from "@/components/bp";
import "./EoS.css";

const LAYERS = [
  {
    name: "Kernel",
    color: "#a1a1aa",
    items: ["Tasks", "Synchronization", "IPC"],
  },
  {
    name: "HAL",
    color: "#a1a1aa",
    items: ["Host backend", "Bare-metal backend"],
  },
  {
    name: "Drivers",
    color: "#a1a1aa",
    items: ["Driver framework", "Devicetree parser"],
  },
  {
    name: "Services",
    color: "#a1a1aa",
    items: ["Security", "OTA", "Filesystem", "Sensors"],
  },
  {
    name: "Build targets",
    color: "#a1a1aa",
    items: ["Host libraries", "Cross-compile toolchains"],
  },
];

const FEATURES = [
  {
    color: "#a1a1aa",
    title: "C11 kernel",
    desc: "Tasks, synchronization primitives, and IPC are organized under kernel/.",
  },
  {
    color: "#a1a1aa",
    title: "Hardware abstraction",
    desc: "The HAL has host and bare-metal backend code. Peripheral implementation and board validation remain incomplete.",
  },
  {
    color: "#a1a1aa",
    title: "Driver framework",
    desc: "The repository includes a driver framework and a devicetree parser. Review per-driver coverage before selecting hardware.",
  },
  {
    color: "#a1a1aa",
    title: "Runtime services",
    desc: "Explore the security, filesystem, sensor, power, and OTA modules. Maturity varies by subsystem.",
  },
  {
    color: "#a1a1aa",
    title: "Host-side development",
    desc: "CMake supports host builds and tests. Start with the repository\u2019s build and test instructions.",
  },
  {
    color: "#a1a1aa",
    title: "Experimental status",
    desc: "STATUS.md records the evidence and limitations. No observed hardware boot or reproducible latency benchmark is reported.",
  },
];

const BOARDS = [
  "STM32F4",
  "STM32H743",
  "nRF52840",
  "ESP32",
  "RP2350",
  "AM64x",
  "i.MX8M",
  "SAMD51",
];

export default function EoS() {
  return (
    <BpPage className="eospage">
      <PageHero
        label="EoS Kernel"
        title={
          <>
            EmbeddedOS
            <br />
            <span>Kernel</span>
          </>
        }
        lead={
          <>
            An experimental C11 embedded OS framework with a kernel, hardware
            abstraction, driver framework, and runtime services. Start with a
            host build and review target-specific status before using hardware.
          </>
        }
        visual={
          <div className="eos-vis">
            <ProductRepositoryPanel product="eos" />
            <div className="code eos-arch">
              <div className="cbar">
                <b>EoS · repository modules</b>
              </div>
              <ol className="eos-layers">
                {LAYERS.map(layer => (
                  <li
                    key={layer.name}
                    style={{ "--c": layer.color } as CSSProperties}
                  >
                    <span className="eos-layer">{layer.name}</span>
                    <ul>
                      {layer.items.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        }
      >
        <div className="ctas">
          <Link href="/getting-started" className="btn pri">
            Get Started{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <Link href="/docs" className="btn gh">
            API Reference
          </Link>
        </div>
      </PageHero>

      <Section
        title="Kernel Features"
        lead="Explore the modules in the public repository"
      >
        <ul className="cards">
          {FEATURES.map(f => (
            <li key={f.title}>
              <div className="card">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Board descriptors"
        lead="Examples of configuration descriptors in the repository; these are not validated hardware ports"
      >
        <ul className="eos-boards">
          {BOARDS.map(b => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p className="eos-all">
          <Link href="/hardware-lab" className="btn ln">
            View all boards{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
        </p>
      </Section>

      <Band
        title="Start with the source"
        lead="Follow the host-build guide and inspect STATUS.md before selecting a target board."
      >
        <Link href="/getting-started" className="btn pri">
          Get Started{" "}
          <span className="ar" aria-hidden="true">
            →
          </span>
        </Link>
        <Link href="/demo" className="btn gh">
          Try EoSim
        </Link>
        <Link href="/product-eos" className="btn gh">
          EoS engineering detail
        </Link>
      </Band>
    </BpPage>
  );
}
