# KB ingest evaluation: gitbook-downloader v11.1.0

**Date:** 2026-10-05 · **Verdict: adopt with changes** — use its
chunking/JSONL/llms.txt pipeline as the ingest library for the org KB;
do **not** deploy its MCP server as the org's docs server. Evaluation
only — no generated KB output or running server is committed here.

## What was tested (local eval, 2026-10-05)

- Installed `gitbook-downloader==11.1.0` (`docharvest` CLI): 9 site
  providers (GitBook, Docusaurus, ReadTheDocs, Mintlify, Nextra,
  VitePress, MkDocs, ReadMe, Generic), chunker, search index, versioned
  library, and a FastMCP server.
- **Split fidelity:** ran `docharvest split` on a real org doc (the eSec
  CRA runbook, 4.9 KB) — headings, tables, and blockquotes survived
  intact; output is clean per-chunk Markdown.
- **RAG JSONL shape:** `export_to_jsonl` emits one record per page:
  `{id, title, text, metadata: {domain, source}}` — a standard RAG
  record, frontmatter stripped, source URLs preserved.
- **MCP server boot:** the 12-tool server (`download_docs`,
  `search_docs`, `list_domains`, `find_docs`, `read_doc`, `get_doc`,
  `diff_versions`, `list_versions`, `export_docs`, `get_changelog`,
  `query_doc_graph`, `get_related_concepts`) answered stdio
  `initialize` + `tools/list` cleanly. Note: it targets the FastMCP 1.x
  API; it ran under the installed `mcp` 2.x only via its
  `MCPServer`-fallback import — incidental, not guaranteed.
- **llms.txt:** generated as part of the capture output contract
  (page tree + book + llms.txt manifest); the engine also *discovers*
  from llms.txt/sitemap.
- **Skills:** ships a bundled `docharvest` SKILL.md — the Ross
  Markdown-skill pattern the org's skills catalog is standardizing on.

## Why not adopt as-is

1. **Wrong ingest direction.** The tool captures *hosted docs sites*
   via URL. The org's KB source of truth is 26 git repos of Markdown —
   no capture needed, and capture has no story for the private repos
   (eVera, embeddedos-stack). We need a *local-markdown* ingest, not a
   crawler.
2. **Wrong server shape.** The org's KB design (agent-fabric plan) is
   the Espressif two-server pattern — a docs-MCP plus a tools-MCP with
   in-repo `server.py`/`ingest.py`/BM25 and `mcp.json` auto-registration
   (esp-bist pattern). docharvest's server is a generic
   doc-*harvesting* server (download/search/diff), not an org-scoped
   knowledge server.

## Integration design (adopted parts)

```
26 repos' docs/ (git, incl. private) ──▶ local-markdown adapter
        (thin wrapper: read tree → split → wrap_with_rag_metadata)
    ├─▶ Markdown chunks (per-repo)
    ├─▶ RAG JSONL (id/title/text/metadata{domain,source})
    └─▶ per-repo llms.txt            ← light KB layer (Track: agent fabric)
            │
            ▼
embeddedos-docs MCP server  ← org-owned server.py/ingest.py/BM25
   (Espressif two-server pattern; mcp.json auto-registration)
```

- Keep docharvest's **capture half for third-party docs only**
  (Zephyr, Espressif, Nordic doc sites agents need) — that's what it's
  built for.
- Use its **split / JSONL / llms.txt / versioned-library** pieces as
  the ingest library behind the org's own server.
- **WeKnora** remains the hosted alternative if the self-hosted KB
  ever needs managed search/RAG without operating it.

## Open questions

- Local-markdown adapter: thin wrapper vs. GenericProvider with
  `file://` URLs (untested).
- Pin `mcp<2` for any docharvest server use, or accept the 2.x fallback.
- Private-repo ingest auth: git path sidesteps this, but the adapter
  must run with repo read access (CI token, not a PAT in config).
