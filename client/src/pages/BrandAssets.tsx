/**
 * Brand Assets — the marks, the palette, the type, and the rules.
 *
 * Written for someone who needs to put the logo in a slide deck in the next
 * five minutes, so the permissions come before the prohibitions and the hex
 * values are selectable text rather than an image of a swatch.
 */

import { Check, Download, X } from "lucide-react";

import {
  BRAND_ASSETS,
  BRAND_COLORS,
  BRAND_NOT_PERMITTED,
  BRAND_PERMITTED,
  BRAND_TYPE,
} from "@/data/brand";
import { CONTACT_EMAILS, FOUNDATION } from "@/data/foundation";
import { categoryByPath } from "@/data/categories";

export default function BrandAssets() {
  const category = categoryByPath("/brand")!;

  return (
    <div className="min-h-screen pt-16">
      <section className="section-padding bg-grid relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1D3A]/80 to-[#080F1E]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="badge-teal mb-4 inline-flex">Marketing</div>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
            {category.name}
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            {category.summary}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-14">
          <div>
            <h2 className="font-heading font-bold text-white text-2xl mb-2">
              Using the marks
            </h2>
            <p className="text-white/50 text-sm mb-6">
              You do not need to ask permission for anything in the first list.
              The software is MIT-licensed; the trademarks are not the same
              thing, which is why the second list exists.
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="glass rounded-2xl border border-emerald-400/20 p-6">
                <h3 className="font-heading font-bold text-emerald-400 text-sm uppercase tracking-wider mb-4">
                  Go ahead
                </h3>
                <ul className="space-y-3">
                  {BRAND_PERMITTED.map(rule => (
                    <li key={rule} className="flex gap-3 text-sm text-white/70">
                      <Check
                        size={16}
                        className="text-emerald-400 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="glass rounded-2xl border border-[#f85149]/20 p-6">
                <h3 className="font-heading font-bold text-[#f85149] text-sm uppercase tracking-wider mb-4">
                  Please do not
                </h3>
                <ul className="space-y-3">
                  {BRAND_NOT_PERMITTED.map(rule => (
                    <li key={rule} className="flex gap-3 text-sm text-white/70">
                      <X
                        size={16}
                        className="text-[#f85149] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span className="leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-white/55 text-sm mt-5 leading-relaxed">
              Anything not covered above, or a use you are unsure about, goes to{" "}
              <a
                href={`mailto:${CONTACT_EMAILS.contact}`}
                className="text-[#F97316] underline hover:no-underline"
              >
                {CONTACT_EMAILS.contact}
              </a>
              . A short description and a mock-up is usually enough.
            </p>
          </div>

          <div>
            <h2 className="font-heading font-bold text-white text-2xl mb-6">
              Downloads
            </h2>
            <ul className="space-y-3">
              {BRAND_ASSETS.map(asset => (
                <li
                  key={asset.href}
                  className="glass rounded-xl border border-white/5 p-4 flex flex-wrap items-center gap-4"
                >
                  <div className="flex-1 min-w-[14rem]">
                    <div className="flex items-center gap-3">
                      <span className="text-white font-medium text-sm">
                        {asset.name}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/55 border border-white/15 rounded px-1.5 py-0.5">
                        {asset.format}
                      </span>
                    </div>
                    <p className="text-white/50 text-xs mt-1.5 leading-relaxed">
                      {asset.note}
                    </p>
                  </div>
                  {/*
                    A plain link, not a download attribute. The site is served
                    from a static host and the file opens or saves according to
                    the reader's own browser settings, which is the behaviour
                    they expect from a URL that ends in .png.
                  */}
                  <a
                    href={asset.href}
                    className="inline-flex items-center gap-2 text-xs text-[#F97316] underline hover:no-underline font-semibold"
                  >
                    <Download size={13} aria-hidden="true" /> Open
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-heading font-bold text-white text-2xl mb-6">
              Colour
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {BRAND_COLORS.map(color => (
                <div
                  key={color.hex}
                  className="glass rounded-xl border border-white/5 overflow-hidden"
                >
                  <div
                    className="h-16 w-full"
                    style={{ backgroundColor: color.hex }}
                    /*
                      Decorative: the name and hex sit in text directly below,
                      so a screen reader that announced this block would only
                      repeat them.
                    */
                    aria-hidden="true"
                  />
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-white text-sm font-medium">
                        {color.name}
                      </span>
                      <code className="text-xs font-mono text-white/60 tabular-nums">
                        {color.hex}
                      </code>
                    </div>
                    <p className="text-white/50 text-xs mt-2 leading-relaxed">
                      {color.use}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-heading font-bold text-white text-2xl mb-6">
              Typography
            </h2>
            <ul className="space-y-4">
              {BRAND_TYPE.map(t => (
                <li
                  key={t.role}
                  className="glass rounded-xl border border-white/5 p-5"
                >
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-white/55 text-xs uppercase tracking-wider">
                      {t.role}
                    </span>
                    <span className="text-white text-lg font-medium">
                      {t.family}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs mt-2">{t.note}</p>
                </li>
              ))}
            </ul>
            <p className="text-white/55 text-sm mt-5">
              All three are open-licensed and available from Google Fonts, so
              material about {FOUNDATION.shortName} can be set in them without a
              licence purchase.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
