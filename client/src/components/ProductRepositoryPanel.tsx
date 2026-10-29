import { useState } from "react";
import {
  ArrowUpRight,
  Github,
  FolderCode,
  GitBranch,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";
import { copyText } from "@/lib/clipboard";
import {
  PRODUCT_REPOSITORIES,
  githubRepositoryUrl,
  type ProductRepositoryId,
} from "@/data/product-repositories";
import "./ProductRepositoryPanel.css";

const MARKS: Record<ProductRepositoryId, string> = {
  eos: "EoS",
  eboot: "eB",
  eai: "eAI",
  eoffice: "eO",
  eapps: "eA",
};

export default function ProductRepositoryPanel({
  product,
}: {
  product: ProductRepositoryId;
}) {
  const source = PRODUCT_REPOSITORIES[product];
  const url = githubRepositoryUrl(source.repo);
  const [copied, setCopied] = useState(false);
  const copyCommands = async () => {
    if (await copyText(source.commands)) setCopied(true);
  };
  return (
    <section className="repo-panel" aria-labelledby={`repo-${product}-title`}>
      <div className="repo-panel-grid">
        <div className="repo-panel-about">
          <p className="repo-eyebrow">
            <span className="repo-availability" aria-hidden="true" /> OPEN
            SOURCE <span>/</span> {source.kind}
          </p>
          <h2 id={`repo-${product}-title`}>{source.title}</h2>
          <p className="repo-summary">{source.summary}</p>
          <div className="ctas">
            <a
              href={url}
              className="btn pri"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={17} aria-hidden="true" /> View repository{" "}
              <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only"> on GitHub (opens in a new tab)</span>
            </a>
            <a
              href={`${url}/blob/master/README.md`}
              className="btn gh"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read build guide <ArrowUpRight size={16} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
          <a
            className="repo-url"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/embeddedos-org <span aria-hidden="true">/</span>{" "}
            <strong>{source.repo}</strong>
            <span className="sr-only"> on GitHub (opens in a new tab)</span>
          </a>
          <div className="repo-status">
            <GitBranch size={14} aria-hidden="true" /> {source.status}
            <span className="repo-status-rule" aria-hidden="true" />
            Public source code
          </div>
        </div>
        <div className="repo-map" aria-label={`${source.repo} repository map`}>
          <div className="repo-map-bar">
            <span>
              <FolderCode size={14} aria-hidden="true" /> REPOSITORY MAP
            </span>
            <span>
              <GitBranch size={13} aria-hidden="true" /> master
            </span>
          </div>
          <div className="repo-map-stage">
            <svg
              className="repo-map-lines"
              viewBox="0 0 600 440"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={`trace-${product}`}>
                  <stop stopColor="#74747c" />
                  <stop offset="1" stopColor="#35353c" />
                </linearGradient>
              </defs>
              <path
                d="M180 220 H260 V80 H320 M260 220 H320 M260 220 V360 H320"
                fill="none"
                stroke={`url(#trace-${product})`}
                strokeWidth="1.25"
              />
              <circle cx="260" cy="220" r="4" fill="#d1d1d6" />
            </svg>
            <a
              className="repo-map-root"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${source.repo} repository on GitHub (opens in a new tab)`}
            >
              <span className="repo-monogram">{MARKS[product]}</span>
              <span className="repo-root-name">{source.repo}</span>
              <span className="repo-root-label">ROOT</span>
            </a>
            <ul className="repo-map-nodes">
              {source.paths.map((item, index) => (
                <li key={item.path}>
                  <a
                    href={`${url}/${item.path.includes(".") ? "blob" : "tree"}/master/${item.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="repo-node-number" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <span className="repo-node-copy">
                      <strong>{item.label}</strong>
                      <code>
                        {item.path}
                        {!item.path.includes(".") && "/"}
                      </code>
                    </span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                    <span className="sr-only">
                      : {item.description} (opens in a new tab)
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="repo-map-caption">
            A closer look starts with the source.
          </p>
        </div>
      </div>
      <details className="repo-build">
        <summary>
          <span>
            <span className="repo-build-symbol" aria-hidden="true">
              &gt;_
            </span>{" "}
            Build from source
          </span>
          <ChevronDown size={16} aria-hidden="true" />
        </summary>
        <div className="repo-build-body">
          <p>
            Follow the repository README for prerequisites and target-specific
            setup.
          </p>
          <div className="repo-command">
            <pre>
              <code>{source.commands}</code>
            </pre>
            <button
              type="button"
              onClick={copyCommands}
              aria-label="Copy build commands"
            >
              {copied ? (
                <Check size={16} aria-hidden="true" />
              ) : (
                <Copy size={16} aria-hidden="true" />
              )}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <span className="sr-only" role="status">
            {copied ? "Build commands copied to clipboard" : ""}
          </span>
        </div>
      </details>
      <p className="repo-note">
        <span>PROJECT NOTE</span>
        {source.note}
      </p>
    </section>
  );
}
