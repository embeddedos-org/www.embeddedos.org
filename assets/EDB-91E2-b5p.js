import{r as d,j as e,L as a}from"./vendor-react-aOLDZyDv.js";import{i as o,j as c,l as r,n as u}from"./index-b9RpI-8S.js";import"./vendor-motion-D0ROkIIu.js";const l=[{id:"sql",label:"SQL",color:"#F97316",example:`-- Query sensor readings
SELECT device_id, AVG(value) as avg_temp
FROM sensor_readings
WHERE sensor_type = 'temperature'
  AND timestamp > NOW() - INTERVAL '1 hour'
GROUP BY device_id
ORDER BY avg_temp DESC;`},{id:"doc",label:"Document",color:"#22D3EE",example:`// Insert device config
db.collection("devices").insertOne({
  id: "sensor_001",
  type: "temperature",
  calibration: { offset: 0.5, scale: 1.02 },
  firmware: "v0.1.9",
  location: { lat: 37.7749, lon: -122.4194 }
});`},{id:"kv",label:"Key-Value",color:"#A855F7",example:`// Fast KV store for runtime state
db.kv.set("device:001:state", "active");
db.kv.set("device:001:last_seen", Date.now());
db.kv.expire("device:001:state", 3600);

const state = db.kv.get("device:001:state");
// Returns: "active"`},{id:"ai",label:"AI Query",color:"#34D399",example:`// Natural language query via eAI
const results = await db.ai.query(
  "Find all devices with temperature above 80°C in the last 24 hours",
  { context: "sensor_readings", limit: 50 }
);
// Returns structured results + SQL explanation`}],m=[{color:"#F97316",title:"Multi-Model",desc:"SQL, Document, Key-Value, and REST APIs in a single embedded database. No need to run multiple database engines."},{color:"#FBBF24",title:"Sub-millisecond Latency",desc:"Optimized for embedded storage: B-tree indexes, write-ahead logging, and memory-mapped I/O."},{color:"#22D3EE",title:"Encryption at Rest",desc:"AES-256-GCM encryption for all stored data. Per-table encryption keys managed by the EoS crypto module."},{color:"#A855F7",title:"AI-Powered Queries",desc:"Natural language queries via the EAI integration. Ask questions in plain English and get structured SQL results."},{color:"#34D399",title:"REST API",desc:"Built-in HTTP REST API for remote access. Supports JSON, MessagePack, and CBOR serialization formats."},{color:"#F472B6",title:"ACID Compliant",desc:"Full ACID transactions with serializable isolation. Safe for concurrent access from multiple EoS tasks."}];function g(){const[s,n]=d.useState("sql"),i=l.find(t=>t.id===s);return e.jsxs(o,{className:"edb",children:[e.jsx(c,{sig:!0,label:"EDB",title:"eDB",sub:"The Embedded Multi-Model Database",lead:"SQL + Document + Key-Value + REST + AI queries — all in a single embedded database engine designed for EoS applications."}),e.jsxs(r,{title:"Four Query Models, One Database",lead:"Choose the right query model for each use case — no need to run multiple database engines.",children:[e.jsx("div",{className:"ctas edb-tabs",children:l.map(t=>e.jsx("button",{type:"button",onClick:()=>n(t.id),"aria-pressed":s===t.id,className:"btn gh",children:t.label},t.id))}),e.jsx("div",{className:"code edb-code",style:{"--c":i.color},children:e.jsx("pre",{className:"wrapm",children:i.example})})]}),e.jsx(r,{title:"Features",children:e.jsx("ul",{className:"cards",children:m.map(t=>e.jsx("li",{children:e.jsxs("div",{className:"card",children:[e.jsx("h3",{children:t.title}),e.jsx("p",{children:t.desc})]})},t.title))})}),e.jsxs(u,{title:"Get Started with eDB",children:[e.jsxs(a,{href:"/api-docs",className:"btn pri",children:["API Reference"," ",e.jsx("span",{className:"ar","aria-hidden":"true",children:"→"})]}),e.jsx(a,{href:"/getting-started",className:"btn gh",children:"Getting Started"}),e.jsx(a,{href:"/product-edb",className:"btn gh",children:"eDB engineering detail"})]})]})}export{g as default};
