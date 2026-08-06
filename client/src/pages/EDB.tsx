import { useState } from "react";
import { motion } from "framer-motion";
import {
  Database,
  Zap,
  Shield,
  Search,
  Code,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "wouter";

const queryTypes = [
  {
    id: "sql",
    label: "SQL",
    color: "#F97316",
    example: `-- Query sensor readings
SELECT device_id, AVG(value) as avg_temp
FROM sensor_readings
WHERE sensor_type = 'temperature'
  AND timestamp > NOW() - INTERVAL '1 hour'
GROUP BY device_id
ORDER BY avg_temp DESC;`,
  },
  {
    id: "doc",
    label: "Document",
    color: "#22D3EE",
    example: `// Insert device config
db.collection("devices").insertOne({
  id: "sensor_001",
  type: "temperature",
  calibration: { offset: 0.5, scale: 1.02 },
  firmware: "v0.1.9",
  location: { lat: 37.7749, lon: -122.4194 }
});`,
  },
  {
    id: "kv",
    label: "Key-Value",
    color: "#A855F7",
    example: `// Fast KV store for runtime state
db.kv.set("device:001:state", "active");
db.kv.set("device:001:last_seen", Date.now());
db.kv.expire("device:001:state", 3600);

const state = db.kv.get("device:001:state");
// Returns: "active"`,
  },
  {
    id: "ai",
    label: "AI Query",
    color: "#34D399",
    example: `// Natural language query via eAI
const results = await db.ai.query(
  "Find all devices with temperature above 80°C in the last 24 hours",
  { context: "sensor_readings", limit: 50 }
);
// Returns structured results + SQL explanation`,
  },
];

const features = [
  {
    icon: Database,
    color: "#F97316",
    title: "Multi-Model",
    desc: "SQL, Document, Key-Value, and REST APIs in a single embedded database. No need to run multiple database engines.",
  },
  {
    icon: Zap,
    color: "#FBBF24",
    title: "Sub-millisecond Latency",
    desc: "Optimized for embedded storage: B-tree indexes, write-ahead logging, and memory-mapped I/O for <1ms query latency.",
  },
  {
    icon: Shield,
    color: "#22D3EE",
    title: "Encryption at Rest",
    desc: "AES-256-GCM encryption for all stored data. Per-table encryption keys managed by the EoS crypto module.",
  },
  {
    icon: Search,
    color: "#A855F7",
    title: "AI-Powered Queries",
    desc: "Natural language queries via the EAI integration. Ask questions in plain English and get structured SQL results.",
  },
  {
    icon: Code,
    color: "#34D399",
    title: "REST API",
    desc: "Built-in HTTP REST API for remote access. Supports JSON, MessagePack, and CBOR serialization formats.",
  },
  {
    icon: CheckCircle2,
    color: "#F472B6",
    title: "ACID Compliant",
    desc: "Full ACID transactions with serializable isolation. Safe for concurrent access from multiple EoS tasks.",
  },
];

export default function EDB() {
  const [activeQuery, setActiveQuery] = useState("sql");
  const active = queryTypes.find(q => q.id === activeQuery)!;

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-cyan-500/5" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6">
              <Database className="w-4 h-4" /> EDB
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
              eDB
            </h1>
            <p className="text-2xl text-gray-300 mb-2">
              The Embedded Multi-Model Database
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              SQL + Document + Key-Value + REST + AI queries — all in a single
              embedded database engine designed for EoS applications.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Four Query Models, One Database
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Choose the right query model for each use case — no need to run
            multiple database engines.
          </p>
          <div className="flex gap-2 mb-6 justify-center flex-wrap">
            {queryTypes.map(q => (
              <button
                key={q.id}
                onClick={() => setActiveQuery(q.id)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={
                  activeQuery === q.id
                    ? {
                        background: q.color + "20",
                        color: q.color,
                        border: "1px solid " + q.color + "40",
                      }
                    : {
                        background: "rgba(255,255,255,0.05)",
                        color: "#9CA3AF",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }
                }
              >
                {q.label}
              </button>
            ))}
          </div>
          <motion.div
            key={activeQuery}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0D1117] border border-white/10 rounded-xl p-6"
          >
            <pre className="text-sm font-mono text-gray-300 overflow-x-auto whitespace-pre-wrap">
              {active.example}
            </pre>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: f.color + "20" }}
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-white mb-4">
            Get Started with eDB
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/api-docs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
            >
              API Reference <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/getting-started"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold border border-white/20 transition-colors"
            >
              Getting Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
