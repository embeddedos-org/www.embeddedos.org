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

import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "wouter";

import { type Category, categoryByPath } from "@/data/categories";
import {
  PROGRAMMES,
  STATUS_LABEL,
  TRACK_LABEL,
  isActive,
} from "@/data/programmes";
import { CONTACT_EMAILS } from "@/data/foundation";

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
      <div className="min-h-screen pt-16">
        <section className="section-padding">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="font-heading font-extrabold text-3xl text-white mb-4">
              Programme not found
            </h1>
            <Link href="/get-involved" className="text-[#F97316] underline">
              Ways to get involved
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const active = isActive(programme);

  return (
    <div className="min-h-screen pt-16">
      <section className="section-padding bg-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D3A]/80 to-[#080F1E]" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
          <Link
            href={
              programme.track === "research" ? "/research" : "/get-involved"
            }
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            {programme.track === "research" ? "Research" : "Get involved"}
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="badge-teal">{TRACK_LABEL[programme.track]}</span>
            <span
              className={`text-xs px-2.5 py-1 rounded-full border ${
                active
                  ? "text-emerald-400 border-emerald-400/40 bg-emerald-400/10"
                  : "text-white/60 border-white/20 bg-white/5"
              }`}
            >
              {STATUS_LABEL[programme.status]}
            </span>
          </div>

          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-5">
            {programme.name}
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            {programme.summary}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          {!active && (
            /*
              The most important sentence on the page, so it is not buried
              below the description. A reader who stops here has still been
              told the one thing that changes what they do next.
            */
            <div className="glass rounded-2xl border border-white/5 p-6">
              <h2 className="font-heading font-bold text-white text-lg mb-3">
                This programme has not started
              </h2>
              <p className="text-white/60 text-sm leading-relaxed">
                It is proposed and not yet running, so there is nothing to apply
                for today and no members to contact. It is published here
                because the Foundation would rather show the shape of what it
                intends to build than announce it as though it already exists.
              </p>
              <p className="text-white/60 text-sm leading-relaxed mt-3">
                If you would like to help start it — or you have run something
                similar and can say what went wrong — that is genuinely useful
                now, and more useful than it will be later.
              </p>
              <a
                href={`mailto:${CONTACT_EMAILS.contact}?subject=${encodeURIComponent(programme.name)}`}
                className="inline-flex items-center gap-2 mt-5 text-sm text-[#F97316] underline hover:no-underline"
              >
                <Mail size={14} /> {CONTACT_EMAILS.contact}
              </a>
            </div>
          )}

          {programme.href && (
            <Link
              href={programme.href}
              className="inline-flex items-center gap-2 text-sm text-[#F97316] underline hover:no-underline"
            >
              Take part
            </Link>
          )}

          <div className="pt-2">
            <h2 className="font-heading font-bold text-white text-lg mb-4">
              Other {TRACK_LABEL[programme.track].toLowerCase()} programmes
            </h2>
            <ul className="space-y-2">
              {PROGRAMMES.filter(
                p => p.track === programme.track && p.slug !== programme.slug
              ).map(p => (
                <li key={p.slug}>
                  <Link
                    href={`/programmes/${p.slug}`}
                    className="text-white/70 underline decoration-white/20 underline-offset-4 hover:text-white text-sm"
                  >
                    {p.name}
                  </Link>
                  <span className="text-white/55 text-xs ml-2">
                    {STATUS_LABEL[p.status]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
