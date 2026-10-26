import { ArrowUpRight, Github, FolderCode } from "lucide-react";
import {
  PRODUCT_REPOSITORIES,
  githubRepositoryUrl,
  type ProductRepositoryId,
} from "@/data/product-repositories";
import "./ProductRepositoryPanel.css";

export default function ProductRepositoryPanel({
  product,
}: {
  product: ProductRepositoryId;
}) {
  const source = PRODUCT_REPOSITORIES[product];
  const url = githubRepositoryUrl(source.repo);
  return (
    <section className="repo-panel" aria-labelledby={`repo-${product}-title`}>
      <div className="repo-panel-top">
        <span className="repo-eyebrow">
          <Github size={17} aria-hidden="true" /> Explore the source
        </span>
        <span className="repo-status">{source.status}</span>
      </div>
      <div className="repo-panel-grid">
        <div className="repo-panel-about">
          <p className="repo-kind">{source.kind}</p>
          <h2 id={`repo-${product}-title`}>{source.title}</h2>
          <p className="repo-summary">{source.summary}</p>
          <div className="ctas">
            <a
              href={url}
              className="btn pri"
              target="_blank"
              rel="noopener noreferrer"
            >
              View repository <ArrowUpRight size={16} aria-hidden="true" />
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
            github.com/embeddedos-org/{source.repo}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <div className="repo-panel-code">
          <div className="repo-code-bar">
            <FolderCode size={16} aria-hidden="true" />
            <span>{source.repo} / source</span>
          </div>
          <ul className="repo-paths">
            {source.paths.map(item => (
              <li key={item.path}>
                <a
                  href={`${url}/${item.path.includes(".") ? "blob" : "tree"}/master/${item.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          <details className="repo-build">
            <summary>Build from source</summary>
            <p>
              After cloning the repository, run the commands below. See the
              build guide for prerequisites.
            </p>
            <pre>
              <code>{source.commands}</code>
            </pre>
          </details>
        </div>
      </div>
      <p className="repo-note">{source.note}</p>
    </section>
  );
}
