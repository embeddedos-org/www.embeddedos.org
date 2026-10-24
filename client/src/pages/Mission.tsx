import { Link } from "wouter";
import {
  FOUNDATION,
  MISSION_STATEMENT,
  CHARITABLE_PURPOSES,
  PROGRAMS,
  OUT_OF_SCOPE,
} from "@/data/foundation";
import { BpPage, LocalNav, PageHero, Section } from "@/components/bp";
import "./Mission.css";

/**
 * How the Foundation judges whether a programme is working. Deliberately not a
 * table of results: these are the measures, and each one names a public artefact
 * a reader can go and check for themselves rather than a number they must take
 * on trust.
 */
const HOW_WE_MEASURE = [
  {
    measure: "Is the work actually public?",
    evidence:
      "Every repository, issue, design discussion and release is readable " +
      "without an account. If a decision cannot be found in public, it has not " +
      "been made properly.",
  },
  {
    measure: "Can someone learn from it without paying?",
    evidence:
      "Books, documentation, tutorials and the Kids Edition stay free and " +
      "unpaywalled. A cost that appears between a learner and the material is a " +
      "programme failure.",
  },
  {
    measure: "Can the results be reproduced?",
    evidence:
      "Research is published with the designs and sources needed to repeat it. " +
      "A claim we cannot show the working for is retired rather than restated.",
  },
  {
    measure: "Does anyone outside the Foundation hold the direction?",
    evidence:
      "Contributions, review and maintainership come from outside the " +
      "Foundation. A project only one organisation can steer is not yet a " +
      "public asset.",
  },
];

export default function Mission() {
  return (
    <BpPage className="mission">
      {/* Hero — the mission statement itself, first thing on the page */}
      <PageHero sig label="Mission & Scope" title="Our Mission and Scope">
        {/* The statement is wrapped in a <p> inside the <blockquote> so that
            scripts/prerender.mjs, which derives each page's meta description
            from the first substantial `main p`, uses the mission itself
            rather than a paragraph further down the page. */}
        <blockquote className="ms-quote">
          <p>{MISSION_STATEMENT}</p>
        </blockquote>
        <p className="ms-meta">
          {FOUNDATION.legalName} · {FOUNDATION.taxStatus} · EIN {FOUNDATION.ein}
        </p>
      </PageHero>
      <LocalNav
        name="Mission & Scope"
        items={[
          { id: "purpose", label: "Charitable Purpose" },
          { id: "programmes", label: "In Scope" },
          { id: "out-of-scope", label: "Out of Scope" },
          { id: "accountability", label: "Accountability" },
        ]}
      />

      {/* Charitable purpose */}
      <Section
        id="purpose"
        label="Charitable Purpose"
        title="What we are exempt to do"
        lead={
          <p>
            The Foundation is a {FOUNDATION.taxStatus} recognised by the
            Internal Revenue Service, exempt since{" "}
            {FOUNDATION.exemptionEffective}. Exemption is not a general licence
            to operate — it is granted for specific purposes, and the
            Foundation's programmes are built to serve them. These are the three
            we work under.
          </p>
        }
      >
        <ul className="cards">
          {CHARITABLE_PURPOSES.map(p => (
            <li key={p.purpose}>
              <div className="card">
                <h3>{p.purpose}</h3>
                <p>{p.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Programmes — the scope of the work */}
      <Section
        id="programmes"
        label="In Scope"
        title="The five programmes we run"
        lead="Everything the Foundation spends time or money on belongs to one of these five programmes. Each names what it does, who it is for, and where the work itself can be inspected."
        alt
      >
        <ol className="ms-prog">
          {PROGRAMS.map((program, i) => (
            <li key={program.id}>
              <article className="card ms-p">
                <div className="ms-ph">
                  <span className="ms-n">{i + 1}</span>
                  <h3>{program.name}</h3>
                </div>
                <p className="ms-sum">{program.summary}</p>
                <div className="ms-cols">
                  <div>
                    <h4>What this involves</h4>
                    <ul>
                      {program.activities.map(activity => (
                        <li key={activity}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Who it serves</h4>
                    <p>{program.serves}</p>
                    <Link href={program.href} className="more ms-more">
                      See this programme's work{" "}
                      <span className="ar" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </Section>

      {/* Out of scope */}
      <Section
        id="out-of-scope"
        label="Out of Scope"
        title="What the Foundation does not do"
        lead="A scope is only meaningful if it has an edge. These are the things the Foundation deliberately stays out of — stated here so that no one has to infer them from an absence."
      >
        <ul className="cards two">
          {OUT_OF_SCOPE.map(item => (
            <li key={item.claim}>
              <div className="card ms-out">
                <h3>{item.claim}</h3>
                <p>{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* How we measure */}
      <Section
        id="accountability"
        label="Accountability"
        title="How we judge whether it is working"
        lead="These are questions rather than metrics, and each one is answerable by a reader without asking us. That is the point: a measure only we can check is not accountability."
        alt
      >
        <ul className="cards two">
          {HOW_WE_MEASURE.map(m => (
            <li key={m.measure}>
              <div className="card">
                <h3>{m.measure}</h3>
                <p>{m.evidence}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Close */}
      <section className="band ms-band">
        <div className="wrap">
          <div>
            <h2>Support the mission, or come and work on it</h2>
            <p className="lead">
              The Foundation is funded by donations, membership and sponsorship
              — not by selling what it builds. Contributions are tax-deductible
              under {FOUNDATION.deductibility.toLowerCase()}.
            </p>
          </div>
          <div className="ctas">
            <Link href="/donate" className="btn or">
              Make a Tax-Deductible Donation
            </Link>
            <Link href="/get-involved" className="btn gh">
              Volunteer or Contribute{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="/industries" className="btn gh">
              Industries We Serve{" "}
              <span className="ar" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="/transparency" className="btn gh">
              Accountability &amp; Finances
            </Link>
          </div>
        </div>
      </section>
    </BpPage>
  );
}
