/**
 * One programme, at its own URL.
 *
 * A programme is not a publication: it has a status and a way in, not a date
 * and a body. Nine of them appear in the design's Marketing and Research
 * structure — Ambassador Program, Grants, University Collaborations and the
 * rest — and each needs an address a reader can be sent to.
 *
 * Every programme is currently `planned`, and the page says so in the largest
 * type on it. That is deliberate. A foundation page titled "Ambassador Program"
 * that does not immediately say the programme has not started is a page that
 * lets a reader spend ten minutes working out there is nothing to apply for.
 */

import { Link } from "wouter";

import { type Category, categoryByPath } from "@/data/categories";
import {
  PROGRAMMES,
  STATUS_LABEL,
  TRACK_LABEL,
  isActive,
} from "@/data/programmes";
import { PROGRAMME_DETAILS } from "@/data/programme-details";
import { openContactForm } from "@/lib/contact-form";
import AboutSections from "@/components/AboutSections";
import { BpPage, Crumbs, PageHero, Section } from "@/components/bp";
import "./ProgrammePage.css";

export interface ProgrammePageProps {
  /** The category path, e.g. "/programmes/ambassador". */
  path: string;
}

export default function ProgrammePage({ path }: ProgrammePageProps) {
  const category: Category | undefined = categoryByPath(path);
  const slug =
    category && category.binding.type === "programme"
      ? category.binding.slug
      : undefined;
  const programme = PROGRAMMES.find(p => p.slug === slug);

  if (!category || !programme) {
    return (
      <BpPage className="prog">
        <PageHero sig title="Programme not found">
          <div className="ctas">
            <Link href="/get-involved" className="btn gh">
              Ways to get involved
            </Link>
          </div>
        </PageHero>
      </BpPage>
    );
  }

  const active = isActive(programme);
  const others = PROGRAMMES.filter(
    p => p.track === programme.track && p.slug !== programme.slug
  );

  return (
    <BpPage className="prog">
      <PageHero
        sig
        crumbs={
          <Crumbs
            items={[
              { label: "Home", href: "/" },
              programme.track === "research"
                ? { label: "Research", href: "/research" }
                : { label: "Get involved", href: "/get-involved" },
              { label: programme.name },
            ]}
          />
        }
        label={TRACK_LABEL[programme.track]}
        title={programme.name}
        lead={programme.summary}
      >
        <ul className="badges" aria-label="Status">
          <li className={active ? "dot ok" : "dot"}>
            {STATUS_LABEL[programme.status]}
          </li>
        </ul>
      </PageHero>

      <Section className="prog-now">
        <div className="prog-grid">
          {!active && (
            /*
              The most important sentence on the page, so it is not buried
              below the description. A reader who stops here has still been
              told the one thing that changes what they do next.
            */
            <div className="card hl prog-state">
              <h2>This programme has not started</h2>
              <p>
                It is proposed and not yet running, so there is nothing to apply
                for today and no members to contact. It is published here
                because the Foundation would rather show the shape of what it
                intends to build than announce it as though it already exists.
              </p>
              <p>
                If you would like to help start it — or you have run something
                similar and can say what went wrong — that is genuinely useful
                now, and more useful than it will be later.
              </p>
              <div className="ctas">
                <button
                  type="button"
                  onClick={() =>
                    openContactForm({
                      topic: "contact",
                      subject: programme.name,
                    })
                  }
                  className="btn pri"
                >
                  Contact us about this
                </button>
              </div>
            </div>
          )}

          <div className="prog-side">
            {programme.href && (
              <Link href={programme.href} className="btn pri">
                Take part
              </Link>
            )}
            <h2 className="prog-h">
              Other {TRACK_LABEL[programme.track].toLowerCase()} programmes
            </h2>
            <ul className="prog-others">
              {others.map(p => (
                <li key={p.slug}>
                  <Link href={`/programmes/${p.slug}`} className="tl">
                    {p.name}
                  </Link>
                  <span className="st">{STATUS_LABEL[p.status]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/*
        Long-form detail content (F-11): six substantial sections per
        programme — why it exists, what it will involve, who it is for,
        how to get involved — so a planned programme's page is worth a
        reader's time before there is anything to apply for.
      */}
      {PROGRAMME_DETAILS[programme.slug] && (
        <AboutSections
          title="About this programme"
          sections={PROGRAMME_DETAILS[programme.slug]}
        />
      )}
    </BpPage>
  );
}
