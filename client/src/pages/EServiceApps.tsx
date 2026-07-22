import { motion } from "framer-motion";
import { Smartphone, Code, Layers, ArrowRight, CheckCircle2, Globe } from "lucide-react";
import { Link } from "wouter";

const apps = [
  { name: "eHealth365 Mobile", platform: "iOS + Android", desc: "Companion app for all eHealth365 devices. Real-time biometric dashboard, historical trends, AI health insights, and device configuration.", color: "#34D399", features: ["Live biometric streaming via BLE", "30-day trend analysis with AI insights", "Medication reminders and health goals", "HIPAA-compliant data export"] },
  { name: "EoSim Mobile", platform: "iOS + Android", desc: "Run EoSim simulations from your phone. Monitor GPIO state, UART output, and simulation statistics in real time.", color: "#22D3EE", features: ["Connect to EoSim over LAN or USB", "Real-time GPIO pin state visualization", "UART terminal with syntax highlighting", "Push notifications for simulation events"] },
  { name: "eRadar360 Monitor", platform: "iOS + Android", desc: "Real-time radar data visualization for eRadar360 / Aegis One. Object tracking, threat classification, and alert management.", color: "#F97316", features: ["Live radar sweep visualization", "Object tracking with classification labels", "Configurable alert zones and thresholds", "Historical track replay"] },
  { name: "eOffice Mobile", platform: "iOS + Android", desc: "Full eOffice Suite on mobile. Edit eWriter documents, view eSheet spreadsheets, and present ePresent slideshows from your phone.", color: "#A855F7", features: ["Full document editing (eWriter, eSheet)", "Offline mode with sync on reconnect", "Collaborative editing with real-time cursors", "File sharing via eFiles integration"] },
  { name: "EoS Device Manager", platform: "iOS + Android", desc: "Manage all your EoS devices from one app. Monitor device health, trigger OTA updates, view logs, and configure network settings.", color: "#FBBF24", features: ["Device discovery via mDNS/BLE", "OTA update management with rollback", "Real-time device logs and metrics", "Remote shell via EIPC tunnel"] },
  { name: "eBot Agent", platform: "iOS + Android", desc: "Chat with your embedded devices using natural language. eBot translates natural language commands into EIPC service calls.", color: "#F472B6", features: ["Natural language device control", "Multi-device conversation context", "Tool calling for sensor reads and actuator control", "Voice input via eNI microphone"] },
];

export default function EServiceAppsPage() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/5" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-6">
              <Smartphone className="w-4 h-4" /> ESERVICEAPPS
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">eServiceApps</h1>
            <p className="text-2xl text-gray-300 mb-2">Flutter Mobile Companion Apps</p>
            <p className="text-gray-400 max-w-2xl mx-auto">Native iOS and Android companion apps for every EmbeddedOS product. Built with Flutter for pixel-perfect cross-platform UI. Connect to your EoS devices over BLE, Wi-Fi, or USB.</p>
            <div className="flex flex-wrap gap-6 justify-center mt-8">
              <div className="text-center"><div className="text-3xl font-bold text-cyan-400">6</div><div className="text-gray-500 text-sm">Apps</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-orange-400">Flutter</div><div className="text-gray-500 text-sm">Framework</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-purple-400">iOS + Android</div><div className="text-gray-500 text-sm">Platforms</div></div>
              <div className="text-center"><div className="text-3xl font-bold text-green-400">Free</div><div className="text-gray-500 text-sm">Open Source</div></div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {apps.map((app, i) => (
              <motion.div key={app.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-bold text-lg">{app.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: app.color + "20", color: app.color }}>{app.platform}</span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{app.desc}</p>
                <div className="space-y-1.5">
                  {app.features.map(f => (
                    <div key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: app.color }} />
                      <span className="text-gray-300 text-xs">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/eapps" className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors">All eApps <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/eoffice" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors">eOffice Suite</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
