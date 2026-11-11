import { Link } from "wouter";
import { BpPage, LocalNav, PageHero, Section } from "@/components/bp";
import {
  ARCHITECTURE_REVIEW_TRIGGERS,
  ARCHITECTURE_STEPS,
  CONTRIBUTE_PACKAGES,
  DISCUSSIONS_URL,
  PR_STEPS,
  PR_TEMPLATE,
  REVIEW_TARGETS,
} from "@/data/contribute";
import "./Contribute.css";

/**
 * /contribute: how technical decisions are made, how to submit a pull request,
 * the template to fill in, how long review should take, and an anchored entry
 * per package. The content lives in `@/data/contribute`, so this file is only
 * layout.
 */
export default function Contribute() {
  return (
    <BpPage className="contribute">
      <PageHero
        sig
        label="CONTRIBUTE"
        title="Contribute"
        lead="How changes reach EmbeddedOS: where architecture is decided, how to submit a pull request, and how long review should take."
      />
      <LocalNav
        name="Contribute"
        items={[
          { id: "architecture-review", label: "Architecture review" },
          { id: "submit-pr", label: "Submitting a PR" },
          { id: "pr-template", label: "PR template" },
          { id: "review-timelines", label: "Review timelines" },
          { id: "packages", label: "Packages" },
        ]}
      />

      <Section
        id="architecture-review"
        title="Architecture meetings and review"
        lead="Technical decisions that affect more than one component are made by the Technical Steering Committee (TSC), in public."
        split
      >
        <p className="ct-sub">A change needs a TSC decision before merge if:</p>
        <ul className="ct-list">
          {ARCHITECTURE_REVIEW_TRIGGERS.map(t => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <ol className="steps">
          {ARCHITECTURE_STEPS.map(s => (
            <li key={s.title}>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="gnote">
          Meeting times and agendas are posted in{" "}
          <a
            href={DISCUSSIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="tl"
          >
            GitHub Discussions
          </a>
          . Who sits on the TSC and what else it decides is on the{" "}
          <Link href="/organization" className="tl">
            Organization
          </Link>{" "}
          page.
        </p>
      </Section>

      <Section id="submit-pr" title="Submitting a pull request" split alt>
        <ol className="steps">
          {PR_STEPS.map(s => (
            <li key={s.title}>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="gnote">
          Everyone taking part follows the{" "}
          <Link href="/code-of-conduct" className="tl">
            Code of Conduct
          </Link>
          .
        </p>
      </Section>

      <Section
        id="pr-template"
        title="Pull request template"
        lead="The template this website's repository uses. A repository that ships its own template uses that one instead, and GitHub fills it in when you open the pull request."
        split
      >
        <div className="code">
          <div className="cbar">
            <b>PULL_REQUEST_TEMPLATE.md</b>
          </div>
          <pre tabIndex={0} aria-label="Pull request template">
            {PR_TEMPLATE}
          </pre>
        </div>
      </Section>

      <Section
        id="review-timelines"
        title="Review timelines"
        lead="These are targets, not guarantees. If one passes without a reply, comment on the pull request or the RFC to ask for an update."
        split
        alt
      >
        <div
          className="tbl"
          tabIndex={0}
          role="region"
          aria-label="Review timelines table"
        >
          <table>
            <thead>
              <tr>
                <th scope="col">Stage</th>
                <th scope="col">Target</th>
              </tr>
            </thead>
            <tbody>
              {REVIEW_TARGETS.map(r => (
                <tr key={r.stage}>
                  <td>{r.stage}</td>
                  <td>{r.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section
        id="packages"
        title="Contributing to a package"
        lead="Each package is developed in its own repository. Its issues, README and checks there are the starting point."
        split
      >
        <ul className="glinks cols">
          {CONTRIBUTE_PACKAGES.map(p => (
            <li key={p.anchor} id={p.anchor}>
              <a href={p.repoUrl} target="_blank" rel="noopener noreferrer">
                <span>embeddedos-org / {p.name}</span>
                <small>{p.area}</small>
                <i aria-hidden="true">↗</i>
              </a>
            </li>
          ))}
        </ul>
      </Section>
    </BpPage>
  );
}
