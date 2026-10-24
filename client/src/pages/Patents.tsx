import type { CSSProperties } from "react";
import { Link } from "wouter";
import { BpPage, PageHero, Section } from "@/components/bp";
import "./Patents.css";

const patents = [
  {
    appNumber: "U.S. App. No. 64/073,334",
    title: "HEALTH-KEY ULTRA",
    filed: "Filed May 23, 2026 · Patent Pending",
    description:
      "A keychain-form-factor health monitoring device with a USB-C Male plug that connects directly to host devices. Covers the novel use of the USB-C shield conductor for ECG acquisition, integrated BAC breath analysis, sEMG, TENS neuromodulation, and 64GB onboard flash storage — all in a form factor smaller than a house key.",
    claims: [
      "USB-C shield conductor ECG acquisition method",
      "Keychain form factor with integrated health sensors",
      "BAC breath analysis via integrated sensor array",
      "Combined sEMG + TENS neuromodulation in keychain",
      "64GB flash data vault with BLE 5.0 sync",
    ],
    githubUrl:
      "https://github.com/embeddedos-org/eos-health/tree/main/patent/health-key-ultra",
    accent: "#22D3EE",
  },
  {
    appNumber: "U.S. App. No. 64/076,078",
    title: "HEALTH-BAND Neuro",
    filed: "Filed May 27, 2026 · Patent Pending",
    description:
      "A wristband neural interface device with a 1,024-channel sEMG array, full-band EEG acquisition, and integrated TENS neuromodulation. Covers the novel electrode array geometry, signal processing pipeline for simultaneous EEG/sEMG acquisition, and the combined BCI + wellness monitoring use case.",
    claims: [
      "1,024-channel sEMG array wristband geometry",
      "Simultaneous full-band EEG + sEMG acquisition",
      "Real-time neural gesture classification pipeline",
      "Combined BCI + clinical wellness monitoring",
      "TENS neuromodulation in wristband form factor",
    ],
    githubUrl:
      "https://github.com/embeddedos-org/eos-health/tree/main/patent/health-band-neuro",
    accent: "#A855F7",
  },
];

export default function Patents() {
  return (
    <BpPage className="patents">
      <PageHero
        sig
        label="Intellectual Property"
        title="EmbeddedOS Patents"
        lead="Two U.S. provisional patent applications protecting the world's most advanced wearable health intelligence devices."
      />

      <section className="sec pt-list">
        <div className="wrap">
          <ul className="pt-grid">
            {patents.map(patent => (
              <li key={patent.appNumber}>
                <article
                  className="card pt-card"
                  style={{ "--c": patent.accent } as CSSProperties}
                >
                  <p className="k pt-app">{patent.appNumber}</p>
                  <h2>{patent.title}</h2>
                  <p className="st ok">{patent.filed}</p>
                  <p className="pt-desc">{patent.description}</p>
                  <h3>Key Claims</h3>
                  <ul className="pt-claims">
                    {patent.claims.map(claim => (
                      <li key={claim}>{claim}</li>
                    ))}
                  </ul>
                  <div className="ctas">
                    <a
                      href={patent.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn pri"
                    >
                      Patent Docs on GitHub
                    </a>
                    <Link href="/health" className="btn gh">
                      Device Page
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Section
        title="Licensing & Inquiries"
        lead="For patent licensing inquiries, research collaborations, or commercial partnerships, please contact the Embedded Operating Systems Research Foundation."
        alt
      >
        <div className="ctas">
          <Link href="/contact" className="btn pri">
            Contact Foundation
          </Link>
          <Link href="/membership" className="btn gh">
            Become a Member
          </Link>
          <Link href="/research" className="btn gh">
            Research Publications
          </Link>
        </div>
      </Section>
    </BpPage>
  );
}
