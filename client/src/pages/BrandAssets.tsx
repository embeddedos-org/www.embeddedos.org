/**
 * Brand Assets — the marks, the palette, the type, and the rules.
 *
 * Written for someone who needs to put the logo in a slide deck in the next
 * five minutes, so the permissions come before the prohibitions and the hex
 * values are selectable text rather than an image of a swatch.
 */

import {
  BRAND_ASSETS,
  BRAND_COLORS,
  BRAND_NOT_PERMITTED,
  BRAND_PERMITTED,
  BRAND_TYPE,
} from "@/data/brand";
import { FOUNDATION } from "@/data/foundation";
import { openContactForm } from "@/lib/contact-form";
import { categoryByPath } from "@/data/categories";
import { BpPage, LocalNav, PageHero, Section } from "@/components/bp";
import "./BrandAssets.css";

export default function BrandAssets() {
  const category = categoryByPath("/brand")!;

  return (
    <BpPage className="brand">
      <PageHero
        sig
        label="Marketing"
        title={category.name}
        lead={category.summary}
      />
      <LocalNav
        name={category.name}
        items={[
          { id: "marks", label: "Using the marks" },
          { id: "downloads", label: "Downloads" },
          { id: "colour", label: "Colour" },
          { id: "typography", label: "Typography" },
        ]}
      />

      <Section
        id="marks"
        title="Using the marks"
        lead="You do not need to ask permission for anything in the first list. The software is MIT-licensed; the trademarks are not the same thing, which is why the second list exists."
      >
        <div className="cards two">
          <div className="card br-rules br-yes">
            <h3>Go ahead</h3>
            <ul>
              {BRAND_PERMITTED.map(rule => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
          <div className="card br-rules br-no">
            <h3>Please do not</h3>
            <ul>
              {BRAND_NOT_PERMITTED.map(rule => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="br-after">
          Anything not covered above, or a use you are unsure about, goes to{" "}
          <button
            type="button"
            onClick={() => openContactForm({ topic: "contact" })}
            className="tl"
          >
            us
          </button>
          . A short description and a mock-up is usually enough.
        </p>
      </Section>

      <Section id="downloads" title="Downloads" alt>
        <ul className="br-dl">
          {BRAND_ASSETS.map(asset => (
            <li key={asset.href}>
              <div className="br-dl-t">
                <p>
                  <b>{asset.name}</b>
                  <span className="br-fmt">{asset.format}</span>
                </p>
                <p className="br-note">{asset.note}</p>
              </div>
              {/*
                A plain link, not a download attribute. The site is served
                from a static host and the file opens or saves according to
                the reader's own browser settings, which is the behaviour
                they expect from a URL that ends in .png.
              */}
              <a href={asset.href} className="btn gh">
                Open
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="colour" title="Colour">
        <ul className="cards br-sw">
          {BRAND_COLORS.map(color => (
            <li key={color.hex}>
              <div className="card br-swatch">
                <div
                  className="br-chip"
                  style={{ backgroundColor: color.hex }}
                  /*
                    Decorative: the name and hex sit in text directly below,
                    so a screen reader that announced this block would only
                    repeat them.
                  */
                  aria-hidden="true"
                />
                <div className="br-sw-t">
                  <div className="top">
                    <h3>{color.name}</h3>
                    <code>{color.hex}</code>
                  </div>
                  <p>{color.use}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="typography" title="Typography" alt>
        <ul className="br-type">
          {BRAND_TYPE.map(t => (
            <li key={t.role}>
              <span className="br-role">{t.role}</span>
              <span className="br-fam">{t.family}</span>
              <p>{t.note}</p>
            </li>
          ))}
        </ul>
        <p className="br-after">
          All three are open-licensed and available from Google Fonts, so
          material about {FOUNDATION.shortName} can be set in them without a
          licence purchase.
        </p>
      </Section>
    </BpPage>
  );
}
