import type { CSSProperties } from "react";
import { BpPage, PageHero, Section } from "@/components/bp";
import "./Stacks.css";

const STACKS = [
  {
    name: "Bare Metal Stack",
    desc: "Minimal footprint for ultra-constrained devices. Just the EoS kernel, eBoot, and your application.",
    color: "#F97316",
    layers: ["EoS Kernel", "eBoot", "Hardware Drivers", "Your App"],
    useCase: "IoT sensors, wearables, microcontrollers",
    ram: "< 4 KB",
    flash: "< 32 KB",
  },
  {
    name: "IoT Edge Stack",
    desc: "Full connectivity with MQTT, CoAP, TLS, and OTA. Ideal for connected IoT devices.",
    color: "#22D3EE",
    layers: [
      "EoS Kernel",
      "eNet (TCP/IP, MQTT, CoAP)",
      "eBoot + OTA",
      "eIPC",
      "Your App",
    ],
    useCase: "Smart home, industrial IoT, asset tracking",
    ram: "< 64 KB",
    flash: "< 256 KB",
  },
  {
    name: "eAI Edge Stack",
    desc: "On-device AI inference with TFLite, ONNX, and eosllm. Run neural networks on embedded hardware.",
    color: "#34D399",
    layers: ["EoS Kernel", "eAI (TFLite / ONNX)", "eosllm", "eNet", "Your App"],
    useCase: "Computer vision, voice, predictive maintenance",
    ram: "< 512 KB",
    flash: "< 2 MB",
  },
  {
    name: "Full Application Stack",
    desc: "Complete application platform with UI, database, browser, and office suite.",
    color: "#A78BFA",
    layers: [
      "EoS Kernel",
      "eIPC",
      "eDB",
      "eBrowser",
      "eOffice",
      "eApps",
      "Your App",
    ],
    useCase: "HMI panels, kiosks, embedded workstations",
    ram: "< 4 MB",
    flash: "< 16 MB",
  },
  {
    name: "Health Stack",
    desc: "Research biosensor stack targeting health-monitoring designs with BLE and secure data.",
    color: "#F85149",
    layers: [
      "EoS Kernel",
      "eBoot",
      "BLE 5.3 Stack",
      "Health Sensor Drivers",
      "Health Hub SDK",
      "Your App",
    ],
    useCase: "Wearables, medical devices, biosensors",
    ram: "< 256 KB",
    flash: "< 1 MB",
  },
  {
    name: "AeroOS Stack",
    desc: "Aerospace research stack exploring redundant safety architectures; it is not certified for flight.",
    color: "#60A5FA",
    layers: [
      "AeroOS (EoS Kernel + DO-178C targets)",
      "Triple-Redundant Voting",
      "Flight Control Drivers",
      "Telemetry (BLE + 5G)",
      "Your Flight App",
    ],
    useCase: "VTOL aircraft, drones, aerospace systems",
    ram: "< 2 MB",
    flash: "< 8 MB",
  },
];

export default function Stacks() {
  return (
    <BpPage className="stackspage">
      <PageHero
        sig
        label="Technology Stacks"
        title={
          <>
            Choose Your <span>Stack</span>
          </>
        }
        lead="EmbeddedOS is modular. Use only what you need — from a 4 KB bare-metal kernel to a full application platform with AI, database, and browser."
      />

      <Section className="st-grid">
        <ul className="cards two">
          {STACKS.map(stack => (
            <li key={stack.name}>
              <div
                className="card"
                style={{ "--c": stack.color } as CSSProperties}
              >
                <h2>{stack.name}</h2>
                <p>{stack.desc}</p>

                {/* Layer diagram: the app on top, the kernel at the base */}
                <ol className="st-layers">
                  {[...stack.layers].reverse().map(layer => (
                    <li key={layer}>{layer}</li>
                  ))}
                </ol>

                <dl className="st-size">
                  <div>
                    <dt>RAM</dt>
                    <dd>{stack.ram}</dd>
                  </div>
                  <div>
                    <dt>Flash</dt>
                    <dd>{stack.flash}</dd>
                  </div>
                </dl>

                <p className="st-use">{stack.useCase}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        tight
        title="Start with Any Stack"
        lead="All stacks are open source. Pick one, customize it, and ship."
      />
    </BpPage>
  );
}
