import { useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { Github } from "lucide-react";
import { Band, BpPage, PageHero, Section, Stats } from "@/components/bp";
import { BOOKS } from "@/data/books";
import "./Books.css";

const CATEGORIES = [
  { id: "all", label: "All Books" },
  { id: "core", label: "Core Platform" },
  { id: "ai", label: "AI & Neural" },
  { id: "tools", label: "Dev Tools" },
  { id: "apps", label: "Apps & Services" },
  { id: "hardware", label: "Hardware" },
];

const LEVEL_COLORS: Record<string, string> = {
  Beginner: "#34D399",
  Intermediate: "#F59E0B",
  Advanced: "#F85149",
  "All Levels": "#A78BFA",
};

function BookCover({
  repo,
  title,
  color,
  eager = false,
}: {
  repo: string;
  title: string;
  color: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="bk-nocover"
        style={{ "--c": color } as CSSProperties}
        aria-hidden="true"
      />
    );
  }
  const cover = `/media/book-cover-${repo.toLowerCase()}`;
  return (
    <picture>
      <source srcSet={`${cover}.webp`} type="image/webp" />
      <img
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        src={`${cover}.jpg`}
        width={240}
        height={360}
        alt={title}
        onError={() => setFailed(true)}
      />
    </picture>
  );
}

export default function Books() {
  const [activeCategory, setActiveCategory] = useState("all");

  const featured = BOOKS.find(b => b.featured)!;
  const filtered = BOOKS.filter(
    b =>
      !b.featured && (activeCategory === "all" || b.category === activeCategory)
  );
  const counts: Record<string, number> = {
    all: BOOKS.filter(b => !b.featured).length,
  };
  for (const cat of ["core", "ai", "tools", "apps", "hardware"]) {
    counts[cat] = BOOKS.filter(b => !b.featured && b.category === cat).length;
  }

  return (
    <BpPage className="books">
      <PageHero
        sig
        label="14 Technical Books"
        title={
          <>
            EmbeddedOS <span>Library</span>
          </>
        }
        lead="14 comprehensive technical books covering every aspect of EmbeddedOS — free PDF downloads, open-source, community-driven."
      >
        <div className="bk-stats">
          <Stats
            items={[
              { value: "14", label: "Books" },
              { value: "4,950+", label: "Total Pages" },
              { value: "Free", label: "Open Access" },
              { value: "MIT", label: "License" },
            ]}
          />
        </div>
      </PageHero>

      {/* Featured book: the cover shown large beside its details */}
      <Section className="bk-feat-sec" title="Featured Book">
        <article className="bk-feat">
          <div className="bk-shelf bk-shelf-l">
            <BookCover
              repo={featured.repo}
              title={featured.title}
              color={featured.color}
              eager
            />
          </div>
          <div className="bk-fbody">
            <span
              className="st"
              style={{ "--c": LEVEL_COLORS[featured.level] } as CSSProperties}
            >
              {featured.level}
            </span>
            <h3>{featured.title}</h3>
            <p className="bk-sub">{featured.subtitle}</p>
            <p className="bk-desc">{featured.desc}</p>
            <ul className="badges">
              {featured.topics.map(t => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <div className="ctas">
              <a
                href={`https://github.com/embeddedos-org/${featured.repo}/releases/latest`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn pri"
              >
                Download PDF
              </a>
              <a
                href={`https://github.com/embeddedos-org/${featured.repo}/tree/master/docs/book`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn gh"
              >
                View Source
              </a>
              <span className="bk-meta">
                {featured.chapters} chapters · {featured.pages} pages
              </span>
            </div>
          </div>
        </article>
      </Section>

      {/* Filter: sticky under the site header */}
      <div className="bk-filter">
        <div className="wrap">
          <span className="label" aria-hidden="true">
            Filter
          </span>
          <div className="bk-cats" role="group" aria-label="Filter by category">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                aria-pressed={activeCategory === cat.id}
                className="bk-cat"
              >
                {cat.label}
                <span className="bk-n">({counts[cat.id]})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Books grid */}
      <section className="sec bk-list" aria-label="Books">
        <div className="wrap">
          <ul className="bk-grid">
            {filtered.map(book => (
              <li key={book.id}>
                <article className="bk-card">
                  <div className="bk-shelf">
                    <BookCover
                      repo={book.repo}
                      title={book.title}
                      color={book.color}
                    />
                  </div>
                  <div className="bk-body">
                    <span
                      className="st"
                      style={
                        { "--c": LEVEL_COLORS[book.level] } as CSSProperties
                      }
                    >
                      {book.level}
                    </span>
                    <h3>{book.title}</h3>
                    <p className="bk-sub">{book.subtitle}</p>
                    <p className="bk-desc">{book.desc}</p>
                    <ul className="bk-topics">
                      {book.topics.slice(0, 3).map(t => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                    <div className="bk-foot">
                      <span className="bk-meta">
                        {book.chapters}ch · {book.pages}pp
                      </span>
                      <span className="bk-acts">
                        <a
                          href={`https://github.com/embeddedos-org/${book.repo}/tree/master/docs/book`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bk-src"
                          title="View Source"
                          aria-label={`View the source of ${book.title} on GitHub`}
                        >
                          <Github size={16} aria-hidden="true" />
                        </a>
                        <a
                          href={`https://github.com/embeddedos-org/${book.repo}/releases/latest`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn gh sm bk-pdf"
                        >
                          PDF
                        </a>
                      </span>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="bk-none">No books in this category yet.</p>
          )}
        </div>
      </section>

      {/* Contribute */}
      <Band
        title="Want to Contribute a Book?"
        lead="All books are open source and community-driven. Submit a chapter, fix a typo, or propose a new title on GitHub."
      >
        <a
          href="https://github.com/embeddedos-org"
          target="_blank"
          rel="noopener noreferrer"
          className="btn pri"
        >
          Contribute on GitHub{" "}
          <span className="ar" aria-hidden="true">
            ↗
          </span>
        </a>
        <Link href="/docs" className="btn gh">
          Browse Documentation
        </Link>
      </Band>
    </BpPage>
  );
}
