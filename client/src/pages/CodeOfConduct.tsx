import { openContactForm } from "@/lib/contact-form";
import { BpPage, LocalNav, PageHero, Section } from "@/components/bp";
import "./CodeOfConduct.css";

const expected = [
  "Use welcoming and inclusive language in all community spaces.",
  "Be respectful of differing viewpoints, experience levels, and backgrounds.",
  "Gracefully accept constructive criticism and provide it in kind.",
  "Focus on what is best for the community and the project.",
  "Show empathy towards other community members.",
  "Credit the work of others appropriately.",
  "Help newcomers and answer questions with patience.",
];

const unacceptable = [
  "Harassment, intimidation, or discrimination of any kind.",
  "Sexualized language or imagery, or unwelcome sexual attention.",
  "Trolling, insulting or derogatory comments, and personal or political attacks.",
  "Publishing others' private information without explicit permission.",
  "Sustained disruption of community discussions or events.",
  "Advocating for or encouraging any of the above behaviors.",
];

const spaces = [
  "GitHub repositories (issues, pull requests, discussions, code reviews)",
  "Discord server and all channels",
  "Mailing lists and email communications",
  "EmbeddedOS Summit and all Foundation events",
  "Social media when representing EmbeddedOS",
  "Any other community space designated by the Foundation",
];

export default function CodeOfConduct() {
  return (
    <BpPage className="coc">
      <PageHero
        sig
        label="CODE OF CONDUCT"
        title="Code of Conduct"
        lead="The EmbeddedOS community is committed to providing a welcoming and inclusive environment for everyone."
      />
      <LocalNav
        name="Code of Conduct"
        items={[
          { id: "expected", label: "Expected Behavior" },
          { id: "unacceptable", label: "Unacceptable Behavior" },
          { id: "scope", label: "Scope" },
          { id: "enforcement", label: "Enforcement" },
        ]}
      />

      <Section className="coc-intro" tight>
        <p className="coc-pledge">
          The EmbeddedOS community is made up of contributors and users from
          around the world. We are committed to providing a friendly, safe, and
          welcoming environment for all, regardless of level of experience,
          gender identity and expression, sexual orientation, disability,
          personal appearance, body size, race, ethnicity, age, religion,
          nationality, or other similar characteristic.
        </p>
      </Section>

      <Section className="coc-rules">
        <div className="cards two">
          <div className="card" id="expected">
            <h2 className="coc-h">Expected Behavior</h2>
            <ul className="coc-list ok">
              {expected.map(e => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
          <div className="card" id="unacceptable">
            <h2 className="coc-h">Unacceptable Behavior</h2>
            <ul className="coc-list no">
              {unacceptable.map(u => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="scope" title="Scope" split className="coc-scope">
        <p className="coc-sub">
          This Code of Conduct applies in all community spaces, including:
        </p>
        <ul className="coc-spaces">
          {spaces.map(s => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Section>

      <Section id="enforcement" title="Enforcement" split>
        <div className="prose">
          <p>
            Instances of abusive, harassing, or otherwise unacceptable behavior
            may be reported by{" "}
            <button
              type="button"
              onClick={() => openContactForm({ topic: "conduct" })}
              className="tl coc-btn"
            >
              contacting the Foundation
            </button>
            . All complaints will be reviewed and investigated promptly and
            fairly.
          </p>
          <p>
            Community leaders are responsible for clarifying and enforcing our
            standards of acceptable behavior and will take appropriate and fair
            corrective action in response to any behavior that they deem
            inappropriate, threatening, offensive, or harmful.
          </p>
        </div>
        <p className="gnote coc-cov">
          This Code of Conduct is adapted from the{" "}
          <a
            href="https://www.contributor-covenant.org"
            target="_blank"
            rel="noopener noreferrer"
            className="tl"
          >
            Contributor Covenant
          </a>
          , version 2.1.
        </p>
      </Section>
    </BpPage>
  );
}
