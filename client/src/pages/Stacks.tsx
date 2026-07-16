import { motion } from "framer-motion";
import { ArrowRight, Layers, Cpu, Zap, Bot, Globe, Activity } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

const STACKS = [
  {
    name: "Bare Metal Stack",
    desc: "Minimal footprint for ultra-constrained devices. Just the EoS kernel, eBoot, and your application.",
    color: "#F97316",
    icon: Cpu,
    layers: ["EoS Kernel", "eBoot", "Hardware Drivers", "Your App"],
    useCase: "IoT sensors, wearables, microcontrollers",
    ram: "< 4 KB",
    flash: "< 32 KB",
  },
  {
    name: "IoT Edge Stack",
    desc: "Full connectivity with MQTT, CoAP, TLS, and OTA. Ideal for connected IoT devices.",
    color: "#22D3EE",
    icon: Globe,
    layers: ["EoS Kernel", "eNet (TCP/IP, MQTT, CoAP)", "eBoot + OTA", "eIPC", "Your App"],
    useCase: "Smart home, industrial IoT, asset tracking",
    ram: "< 64 KB",
    flash: "< 256 KB",
  },
  {
    name: "eAI Edge Stack",
    desc: "On-device AI inference with TFLite, ONNX, and eosllm. Run neural networks on embedded hardware.",
    color: "#34D399",
    icon: Bot,
    layers: ["EoS Kernel", "eAI (TFLite / ONNX)", "eosllm", "eNet", "Your App"],
    useCase: "Computer vision, voice, predictive maintenance",
    ram: "< 512 KB",
    flash: "< 2 MB",
  },
  {
    name: "Full Application Stack",
    desc: "Complete application platform with UI, database, browser, and office suite.",
    color: "#A78BFA",
    icon: Layers,
    layers: ["EoS Kernel", "eIPC", "eDB", "eBrowser", "eOffice", "eApps", "Your App"],
    useCase: "HMI panels, kiosks, embedded workstations",
    ram: "< 4 MB",
    flash: "< 16 MB",
  },
  {
    name: "Health Stack",
    desc: "Medical-grade biosensor stack for health monitoring devices with BLE and secure data.",
    color: "#F85149",
    icon: Activity,
    layers: ["EoS Kernel", "eBoot", "BLE 5.3 Stack", "Health Sensor Drivers", "Health Hub SDK", "Your App"],
    useCase: "Wearables, medical devices, biosensors",
    ram: "< 256 KB",
    flash: "< 1 MB",
  },
  {
    name: "AeroOS Stack",
    desc: "Aerospace-grade RTOS stack with triple-redundant safety systems for flight-critical applications.",
    color: "#60A5FA",
    icon: Zap,
    layers: ["AeroOS (EoS Kernel + DO-178C)", "Triple-Redundant Voting", "Flight Control Drivers", "Telemetry (BLE + 5G)", "Your Flight App"],
    useCase: "VTOL aircraft, drones, aerospace systems",
    ram: "< 2 MB",
    flash: "< 8 MB",
  },
];

export default function Stacks() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="section-padding bg-grid">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-teal mb-4 inline-flex">
              <Layers size={12} />
              Technology Stacks
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
              Choose Your{" "}
              <span className="text-gradient">Stack</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              EmbeddedOS is modular. Use only what you need — from a 4 KB bare-metal kernel
              to a full application platform with AI, database, and browser.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stacks Grid */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STACKS.map((stack, i) => {
              const Icon = stack.icon;
              return (
                <motion.div
                  key={stack.name}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="glass rounded-2xl p-6 border border-white/5 card-hover"
                  style={{ borderTopColor: stack.color, borderTopWidth: 2 }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: stack.color + "20", border: `1px solid ${stack.color}40` }}
                  >
                    <Icon size={24} style={{ color: stack.color }} />
                  </div>
                  <h3 className="font-heading font-bold text-white text-base mb-1">{stack.name}</h3>
                  <p className="text-xs text-white/50 leading-relaxed mb-4">{stack.desc}</p>

                  {/* Layer diagram */}
                  <div className="space-y-1 mb-4">
                    {[...stack.layers].reverse().map((layer, li) => (
                      <div
                        key={layer}
                        className="text-[11px] px-3 py-1.5 rounded-lg text-white/70 border border-white/5"
                        style={{
                          background: `oklch(22% 0.05 248 / ${0.3 + li * 0.1})`,
                          borderLeftColor: stack.color,
                          borderLeftWidth: 2,
                        }}
                      >
                        {layer}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="glass rounded-lg p-2 border border-white/5">
                      <div className="text-[10px] text-white/30 uppercase tracking-widest">RAM</div>
                      <div className="text-xs text-white font-semibold mt-0.5">{stack.ram}</div>
                    </div>
                    <div className="glass rounded-lg p-2 border border-white/5">
                      <div className="text-[10px] text-white/30 uppercase tracking-widest">Flash</div>
                      <div className="text-xs text-white font-semibold mt-0.5">{stack.flash}</div>
                    </div>
                  </div>

                  <div className="text-[10px] text-white/30 italic">{stack.useCase}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-heading font-bold text-white text-2xl mb-4">Start with Any Stack</h2>
          <p className="text-white/50 mb-6">All stacks are open source. Pick one, customize it, and ship.</p>
          <a
            href="https://github.com/embeddedos-org/eos-stack-manifest"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl transition-all active:scale-95"
          >
            View Stack Manifest
            <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}
