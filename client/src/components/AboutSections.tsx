/**
 * Long-form "about" sections for category and programme pages.
 *
 * The fourteen empty content categories (F-01) and the nine planned
 * programmes (F-11) each carry six sections of substantial, truthful
 * content so the page is worth a reader's time before the first item
 * exists or the programme starts. This component renders those sections;
 * the data lives in `@/data/category-about` and `@/data/programme-details`.
 */

import type { AboutSection } from "@/data/about-section";

export interface AboutSectionsProps {
  /** The page-level heading, e.g. "About Press Releases". */
  title: string;
  sections: ReadonlyArray<AboutSection>;
}

export default function AboutSections({ title, sections }: AboutSectionsProps) {
  return (
    <section aria-label={title} className="section-padding">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="font-heading font-bold text-white text-2xl mb-8">
          {title}
        </h2>
        <div className="space-y-8">
          {sections.map(section => (
            <div key={section.heading}>
              <h3 className="font-heading font-bold text-white text-lg mb-3">
                {section.heading}
              </h3>
              <div className="space-y-3">
                {section.body.map((paragraph, i) => (
                  <p key={i} className="text-white/60 text-sm leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
