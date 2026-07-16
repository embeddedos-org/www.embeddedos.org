import { Cpu, Zap, MessageSquare, Shield, Network, Package, Database, Globe, FileText, Gamepad2, FlaskConical, Code } from "lucide-react";

const ITEMS = [
  { name: "EoS Kernel", tag: "Core", color: "#F97316", icon: Cpu },
  { name: "eBoot", tag: "Security", color: "#22D3EE", icon: Zap },
  { name: "EIPC", tag: "Platform", color: "#A78BFA", icon: MessageSquare },
  { name: "eAI Edge", tag: "AI", color: "#34D399", icon: FlaskConical },
  { name: "eSec", tag: "Security", color: "#F59E0B", icon: Shield },
  { name: "eNet", tag: "Network", color: "#60A5FA", icon: Network },
  { name: "eApps", tag: "Apps", color: "#F97316", icon: Package },
  { name: "eDB", tag: "Data", color: "#22D3EE", icon: Database },
  { name: "eBrowser", tag: "UI", color: "#A78BFA", icon: Globe },
  { name: "eOffice", tag: "Apps", color: "#34D399", icon: FileText },
  { name: "Kids Edition", tag: "Education", color: "#F59E0B", icon: Gamepad2 },
  { name: "eFlow", tag: "Dev Tools", color: "#60A5FA", icon: Code },
];

// Duplicate for seamless loop
const ALL = [...ITEMS, ...ITEMS];

export default function ProductMarquee() {
  return (
    <div className="relative overflow-hidden py-4" aria-hidden="true">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, #080F1E 0%, transparent 100%)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(270deg, #080F1E 0%, transparent 100%)" }} />

      <div className="flex gap-3 animate-marquee w-max">
        {ALL.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border shrink-0 transition-all hover:scale-105"
              style={{
                background: `${item.color}10`,
                borderColor: `${item.color}30`,
              }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `${item.color}20` }}>
                <Icon size={14} style={{ color: item.color }} />
              </div>
              <div>
                <div className="text-xs font-bold text-white leading-none">{item.name}</div>
                <div className="text-[9px] font-semibold mt-0.5" style={{ color: item.color }}>{item.tag}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
