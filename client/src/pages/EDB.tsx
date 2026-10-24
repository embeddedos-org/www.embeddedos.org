import { useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { Band, BpPage, PageHero, Section } from "@/components/bp";
import "./EDB.css";

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
    color: "#F97316",
    title: "Multi-Model",
    desc: "SQL, Document, Key-Value, and REST APIs in a single embedded database. No need to run multiple database engines.",
  },
  {
    color: "#FBBF24",
    title: "Sub-millisecond Latency",
    desc: "Optimized for embedded storage: B-tree indexes, write-ahead logging, and memory-mapped I/O.",
  },
  {
    color: "#22D3EE",
    title: "Encryption at Rest",
    desc: "AES-256-GCM encryption for all stored data. Per-table encryption keys managed by the EoS crypto module.",
  },
  {
    color: "#A855F7",
    title: "AI-Powered Queries",
    desc: "Natural language queries via the EAI integration. Ask questions in plain English and get structured SQL results.",
  },
  {
    color: "#34D399",
    title: "REST API",
    desc: "Built-in HTTP REST API for remote access. Supports JSON, MessagePack, and CBOR serialization formats.",
  },
  {
    color: "#F472B6",
    title: "ACID Compliant",
    desc: "Full ACID transactions with serializable isolation. Safe for concurrent access from multiple EoS tasks.",
  },
];

export default function EDB() {
  const [activeQuery, setActiveQuery] = useState("sql");
  const active = queryTypes.find(q => q.id === activeQuery)!;

  return (
    <BpPage className="edb">
      <PageHero
        sig
        label="EDB"
        title="eDB"
        sub="The Embedded Multi-Model Database"
        lead="SQL + Document + Key-Value + REST + AI queries — all in a single embedded database engine designed for EoS applications."
      />

      <Section
        title="Four Query Models, One Database"
        lead="Choose the right query model for each use case — no need to run multiple database engines."
      >
        <div className="ctas edb-tabs">
          {queryTypes.map(q => (
            <button
              key={q.id}
              type="button"
              onClick={() => setActiveQuery(q.id)}
              aria-pressed={activeQuery === q.id}
              className="btn gh"
            >
              {q.label}
            </button>
          ))}
        </div>
        <div
          className="code edb-code"
          style={{ "--c": active.color } as CSSProperties}
        >
          <pre className="wrapm">{active.example}</pre>
        </div>
      </Section>

      <Section title="Features">
        <ul className="cards">
          {features.map(f => (
            <li key={f.title}>
              <div className="card">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Band title="Get Started with eDB">
        <Link href="/api-docs" className="btn pri">
          API Reference{" "}
          <span className="ar" aria-hidden="true">
            →
          </span>
        </Link>
        <Link href="/getting-started" className="btn gh">
          Getting Started
        </Link>
        <Link href="/product-edb" className="btn gh">
          eDB engineering detail
        </Link>
      </Band>
    </BpPage>
  );
}
