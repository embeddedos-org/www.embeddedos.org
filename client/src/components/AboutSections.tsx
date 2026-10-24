/**
 * Long-form "about" sections for category and programme pages.
 *
 * The fourteen empty content categories (F-01) and the nine planned
 * programmes (F-11) each carry six sections of substantial, truthful
 * content so the page is worth a reader's time before the first item
 * exists or the programme starts. This component renders those sections;
 * the data lives in `@/data/category-about` and `@/data/programme-details`.
 *
 * It renders inside a Black Edition page (`BpPage`): one section, the title
 * as its h2, then each part as a row with its h3 beside the reading column.
 */

import type { AboutSection } from "@/data/about-section";
import { Section } from "@/components/bp";
import "./AboutSections.css";

export interface AboutSectionsProps {
  /** The page-level heading, e.g. "About Press Releases". */
  title: string;
  sections: ReadonlyArray<AboutSection>;
  /** The section's anchor, for a page's local navigation. */
  id?: string;
}

export default function AboutSections({
  title,
  sections,
  id,
}: AboutSectionsProps) {
  return (
    <Section id={id} ariaLabel={title} title={title} className="abs">
      <div className="abs-rows">
        {sections.map(section => (
          <div key={section.heading} className="abs-row">
            <h3 className="h3">{section.heading}</h3>
            <div className="prose">
              {section.body.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
