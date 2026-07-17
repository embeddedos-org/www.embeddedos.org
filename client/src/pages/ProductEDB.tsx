import ProductDetailPage from "@/components/ProductDetailPage";

export default function ProductEDB() {
  return (
    <ProductDetailPage
      badge="Database"
      title="eDB — Embedded Multi-Model Database"
      subtitle="SQL · Document · Key-Value · AES-256 · < 1 ms Query"
      description="A multi-model embedded database for EoS devices. Supports SQL, document (JSON), and key-value stores in a single engine — with AES-256 at-rest encryption rooted in the eBoot chain of trust, < 1 ms query latency, and a < 64 KB footprint."
      accent="#3B82F6"
      gradient="from-blue-500/20 to-indigo-600/20"
      lang="C"
      github="embeddedos-org/edb"
      heroImage="/images/product-edb_9cd0fe0e.png"
      stackHighlight="data layer"
      stats={[
        { value: "3", label: "Query Models (SQL, Doc, KV)" },
        { value: "< 1 ms", label: "Query Latency" },
        { value: "AES-256", label: "At-Rest Encryption" },
        { value: "< 64 KB", label: "Engine Footprint" },
      ]}
      workflow={[
        {
          step: 1,
          title: "Open a Database",
          desc: "eDB databases are single-file stores on flash or SD card. Open with edb_open(), passing the encryption key derived from the eBoot chain of trust. eDB automatically creates the file if it doesn't exist.",
          code: "// Open encrypted eDB database\n#include <edb/edb.h>\n\n// Key derived from eBoot TPM measurement\nuint8_t key[32];\neboot_derive_key(key, \"edb_sensor_log\");\n\nedb_t db = edb_open(\"/flash/sensor.edb\", key);",
        },
        {
          step: 2,
          title: "Create Tables (SQL Model)",
          desc: "Use the SQL interface for structured, relational data. eDB supports a subset of SQLite-compatible SQL: CREATE TABLE, INSERT, SELECT, UPDATE, DELETE, and JOIN.",
          code: "edb_exec(db,\n    \"CREATE TABLE IF NOT EXISTS readings (\"\n    \"  id       INTEGER PRIMARY KEY AUTOINCREMENT,\"\n    \"  ts       INTEGER NOT NULL,\"\n    \"  device   TEXT    NOT NULL,\"\n    \"  temp_c   REAL,\"\n    \"  hum_pct  REAL\"\n    \");\");",
        },
        {
          step: 3,
          title: "Insert and Query Data",
          desc: "Insert sensor readings and query them with SQL. eDB uses a B-tree index for O(log n) lookups and supports prepared statements to avoid SQL injection.",
          code: "// Insert a reading\nedb_stmt_t ins = edb_prepare(db,\n    \"INSERT INTO readings (ts, device, temp_c, hum_pct) \"\n    \"VALUES (?, ?, ?, ?)\");\nedb_bind_int(ins, 1, eos_time_ms());\nedb_bind_text(ins, 2, \"node-42\");\nedb_bind_real(ins, 3, 23.5f);\nedb_bind_real(ins, 4, 60.2f);\nedb_step(ins);\n\n// Query last 100 readings\nedb_stmt_t q = edb_prepare(db,\n    \"SELECT ts, temp_c FROM readings ORDER BY ts DESC LIMIT 100\");\nwhile (edb_step(q) == EDB_ROW) {\n    printf(\"ts=%lld temp=%.1f\\n\",\n           edb_column_int64(q, 0),\n           edb_column_real(q, 1));\n}",
        },
        {
          step: 4,
          title: "Use Document Store for Flexible Data",
          desc: "For schema-less data (device configs, AI model metadata, user preferences), use the document store. Documents are JSON objects stored in named collections.",
          code: "// Store device config as JSON document\nedb_doc_t cfg = edb_doc_new();\nedb_doc_set_str(cfg, \"firmware_version\", \"1.2.0\");\nedb_doc_set_int(cfg, \"sample_rate_hz\", 1000);\nedb_doc_set_bool(cfg, \"encryption_enabled\", true);\nedb_collection_insert(db, \"device_config\", cfg);\n\n// Retrieve it\nedb_doc_t loaded = edb_collection_find_one(db, \"device_config\",\n                                             \"firmware_version\", \"1.2.0\");",
        },
      ]}
      usageExamples={[
        {
          title: "Sensor Data Logger",
          scenario: "An industrial sensor node logging 1,000 readings/second to eDB on internal flash with AES-256 encryption.",
          code: '// High-throughput sensor logger\n#include <edb/edb.h>\n\nvoid logger_task(void *arg) {\n    uint8_t key[32];\n    eboot_derive_key(key, "sensor_log");\n    edb_t db = edb_open("/flash/log.edb", key);\n\n    edb_exec(db, "CREATE TABLE IF NOT EXISTS log "\n                 "(ts INTEGER, ch INTEGER, val REAL)");\n\n    edb_stmt_t ins = edb_prepare(db,\n        "INSERT INTO log VALUES (?, ?, ?)");\n\n    for (;;) {\n        // Batch insert 100 readings per transaction\n        edb_begin(db);\n        for (int i = 0; i < 100; i++) {\n            sensor_reading_t r = sensor_read_next();\n            edb_bind_int(ins, 1, r.timestamp);\n            edb_bind_int(ins, 2, r.channel);\n            edb_bind_real(ins, 3, r.value);\n            edb_step(ins);\n            edb_reset(ins);\n        }\n        edb_commit(db);\n        eos_task_delay_ms(100);\n    }\n}',
        },
        {
          title: "AI Model Registry",
          scenario: "eDB stores metadata for all deployed eAI models, including version, quantization, and performance benchmarks.",
          code: '// eAI model registry in eDB\n#include <edb/edb.h>\n\nvoid register_model(edb_t db, const char *name,\n                    const char *path, const char *quant,\n                    float accuracy, int latency_ms) {\n    edb_doc_t doc = edb_doc_new();\n    edb_doc_set_str(doc, "name",     name);\n    edb_doc_set_str(doc, "path",     path);\n    edb_doc_set_str(doc, "quant",    quant);\n    edb_doc_set_real(doc, "accuracy", accuracy);\n    edb_doc_set_int(doc, "latency_ms", latency_ms);\n    edb_collection_insert(db, "models", doc);\n}\n\n// Register the keyword spotter\nregister_model(db, "kws_hey_eos", "/flash/kws.eai",\n               "int8", 0.97f, 12);',
        },
      ]}
      ecosystemRole={{
        importance: "high",
        role: "Persistent Storage Layer",
        summary: "eDB is the persistent storage layer of the EoS ecosystem. Every component that needs to store data beyond a reboot — sensor logs, AI model metadata, user configurations, device state, health records — uses eDB. Its AES-256 encryption rooted in the eBoot chain of trust means that data is only readable on the device that created it, making eDB the right choice for medical, financial, and defense applications. The multi-model interface (SQL + document + KV) means developers don't need to choose between structured and flexible storage — eDB handles both.",
        dependsOn: [
          "EoS Kernel — eDB runs as an EoS service task with flash HAL access",
          "eBoot — derives the AES-256 encryption key from the eBoot TPM measurement",
          "EIPC — inter-process database access uses EIPC for capability-secured queries",
        ],
        enabledBy: [
          "eAI — stores model bundles, training data, and inference logs",
          "eOffice — documents, spreadsheets, and presentations are stored in eDB",
          "eHealth365 — health records, biometric history, and device configs",
          "eFlow — workflow state and execution history",
          "All EoS applications — any app that needs persistent storage uses eDB",
        ],
      }}
      features={[
        { name: "SQL Interface", desc: "SQLite-compatible SQL: CREATE, INSERT, SELECT, UPDATE, DELETE, JOIN. Prepared statements prevent injection." },
        { name: "Document Store", desc: "Schema-less JSON document collections for flexible, evolving data structures." },
        { name: "Key-Value Store", desc: "O(1) KV store for configuration, counters, and flags. Atomic compare-and-swap." },
        { name: "AES-256 Encryption", desc: "At-rest encryption with keys derived from the eBoot chain of trust. Data is device-bound." },
        { name: "< 1 ms Query Latency", desc: "B-tree index on flash delivers sub-millisecond queries for typical embedded workloads." },
        { name: "ACID Transactions", desc: "Full ACID guarantees with write-ahead logging. Safe across power failures." },
        { name: "< 64 KB Footprint", desc: "The full SQL + document + KV engine fits in 64 KB of flash." },
        { name: "Wear Leveling", desc: "Built-in flash wear leveling extends storage lifetime on NOR and NAND flash." },
      ]}
      specs={[
        { key: "Query Models", value: "SQL (SQLite-compatible), Document (JSON), Key-Value" },
        { key: "Encryption", value: "AES-256-GCM at rest; key derived from eBoot TPM measurement" },
        { key: "Index Structure", value: "B-tree for SQL; hash index for KV; inverted index for document full-text search" },
        { key: "Transaction Model", value: "ACID with write-ahead logging (WAL)" },
        { key: "Query Latency", value: "< 1 ms for indexed queries on NOR flash" },
        { key: "Engine Footprint", value: "< 64 KB flash (SQL + document + KV)" },
        { key: "Max Database Size", value: "Limited by storage medium; tested to 32 GB" },
        { key: "Supported Storage", value: "NOR flash, NAND flash, eMMC, SD card, RAM (volatile)" },
        { key: "License", value: "MIT" },
      ]}
      pairs={[
        { name: "EoS Kernel", route: "/product-eos", desc: "eDB runs as an EoS service task with direct flash HAL access." },
        { name: "eBootloader", route: "/product-eboot", desc: "Derives AES-256 encryption keys from the eBoot TPM measurement chain." },
        { name: "eAI", route: "/product-eai", desc: "Stores AI model bundles, training datasets, and inference logs." },
      ]}
    />
  );
}
