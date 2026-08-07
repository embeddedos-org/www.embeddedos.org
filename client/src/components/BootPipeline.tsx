import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Cpu, Shield, Layers, Zap, Package, Wifi } from "lucide-react";
import { BOARD_COUNT } from "../data/stack";

const LAYERS = [
  {
    id: "hw",
    label: "Hardware",
    sublabel: `${BOARD_COUNT} Boards`,
    icon: Cpu,
    color: "#22D3EE",
    delay: 0,
  },
  {
    id: "boot",
    label: "eBoot",
    sublabel: "Secure Bootloader",
    icon: Shield,
    color: "#F97316",
    delay: 0.12,
  },
  {
    id: "kern",
    label: "EoS Kernel",
    sublabel: "RTOS Core",
    icon: Layers,
    color: "#A78BFA",
    delay: 0.24,
  },
  {
    id: "plat",
    label: "Platform",
    sublabel: "EIPC · eSec · eNet",
    icon: Zap,
    color: "#34D399",
    delay: 0.36,
  },
  {
    id: "apps",
    label: "Applications",
    sublabel: "60+ eApps",
    icon: Package,
    color: "#F59E0B",
    delay: 0.48,
  },
  {
    id: "conn",
    label: "Connectivity",
    sublabel: "WiFi · BLE · CAN",
    icon: Wifi,
    color: "#60A5FA",
    delay: 0.6,
  },
];

function SignalLine({ color, delay }: { color: string; delay: number }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: delay + 0.3,
        ease: [0.23, 1, 0.32, 1],
      }}
      className="h-0.5 flex-1 origin-left"
      style={{ background: `linear-gradient(90deg, ${color}80, ${color}20)` }}
    />
  );
}

export default function BootPipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  // Auto-cycle through layers when in view
  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const cycle = () => {
      setActiveLayer(LAYERS[i % LAYERS.length].id);
      i++;
    };
    cycle();
    const id = setInterval(cycle, 800);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} className="w-full">
      {/* Desktop: horizontal pipeline */}
      <div className="hidden md:flex items-center gap-0">
        {LAYERS.map((layer, i) => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;
          return (
            <div key={layer.id} className="flex items-center flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: layer.delay,
                  ease: [0.23, 1, 0.32, 1],
                }}
                onMouseEnter={() => setActiveLayer(layer.id)}
                className="flex flex-col items-center gap-2 cursor-default flex-shrink-0 w-24"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: isActive
                      ? `${layer.color}25`
                      : `${layer.color}10`,
                    border: `1.5px solid ${isActive ? layer.color : layer.color + "40"}`,
                    boxShadow: isActive ? `0 0 20px ${layer.color}50` : "none",
                    transform: isActive ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <Icon size={22} style={{ color: layer.color }} />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-white leading-tight">
                    {layer.label}
                  </div>
                  <div className="text-[9px] text-white/40 leading-tight mt-0.5">
                    {layer.sublabel}
                  </div>
                </div>
                {/* Active indicator dot */}
                <div
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{ background: isActive ? layer.color : "transparent" }}
                />
              </motion.div>
              {/* Connector arrow */}
              {i < LAYERS.length - 1 && (
                <div className="flex items-center flex-1 px-1">
                  <SignalLine color={LAYERS[i + 1].color} delay={layer.delay} />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: layer.delay + 0.5 }}
                    style={{ color: LAYERS[i + 1].color + "80" }}
                    className="text-xs shrink-0"
                  >
                    ▶
                  </motion.div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical stack */}
      <div className="flex md:hidden flex-col gap-2">
        {LAYERS.map((layer, i) => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;
          return (
            <div key={layer.id}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: layer.delay,
                  ease: [0.23, 1, 0.32, 1],
                }}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300"
                style={{
                  background: isActive
                    ? `${layer.color}12`
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? layer.color + "50" : "rgba(255,255,255,0.06)"}`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${layer.color}20` }}
                >
                  <Icon size={18} style={{ color: layer.color }} />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {layer.label}
                  </div>
                  <div className="text-xs text-white/40">{layer.sublabel}</div>
                </div>
                {isActive && (
                  <div
                    className="ml-auto w-2 h-2 rounded-full animate-pulse"
                    style={{ background: layer.color }}
                  />
                )}
              </motion.div>
              {i < LAYERS.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <div
                    className="w-0.5 h-4"
                    style={{ background: `${LAYERS[i + 1].color}30` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
