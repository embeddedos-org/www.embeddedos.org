import type { CSSProperties } from "react";
import { Link } from "wouter";
import { Band, BpPage, PageHero, Section } from "@/components/bp";
import "./Kids.css";

const FEATURES = [
  {
    title: "Interactive Games",
    desc: "Learn programming through fun, engaging games designed for ages 6–16.",
    color: "#F97316",
  },
  {
    title: "Block Coding",
    desc: "Scratch-like visual programming that compiles to real EmbeddedOS code.",
    color: "#22D3EE",
  },
  {
    title: "Guided Curriculum",
    desc: "Structured learning paths from beginner to advanced embedded programming.",
    color: "#A78BFA",
  },
  {
    title: "Real Hardware",
    desc: "Connect to real microcontrollers and see your code run on physical devices.",
    color: "#34D399",
  },
  {
    title: "Achievements",
    desc: "Earn badges and certificates as you progress through challenges.",
    color: "#F59E0B",
  },
  {
    title: "Parental Controls",
    desc: "Safe, monitored environment with progress tracking for parents.",
    color: "#60A5FA",
  },
];

const LEVELS = [
  {
    level: "Beginner",
    age: "Ages 6–9",
    desc: "Block-based visual programming with drag-and-drop logic. Light up LEDs, make sounds, and control robots.",
    color: "#34D399",
  },
  {
    level: "Intermediate",
    age: "Ages 10–13",
    desc: "Introduction to C programming with guided projects. Build sensors, displays, and simple IoT devices.",
    color: "#F59E0B",
  },
  {
    level: "Advanced",
    age: "Ages 14–18",
    desc: "Full EmbeddedOS development. Build real applications, contribute to open source, and earn certifications.",
    color: "#F97316",
  },
];

export default function Kids() {
  return (
    <BpPage className="kids">
      <PageHero
        sig
        label="EmbeddedOS Kids Edition"
        title={
          <>
            Learn to Build <span>Real Devices</span>
          </>
        }
        lead="The educational platform that teaches kids embedded programming through games, interactive projects, and real hardware — from ages 6 to 18."
      >
        <div className="ctas">
          <Link href="/getting-started" className="btn or">
            Start Learning{" "}
            <span className="ar" aria-hidden="true">
              →
            </span>
          </Link>
          <a
            href="https://github.com/embeddedos-org"
            target="_blank"
            rel="noopener noreferrer"
            className="btn gh"
          >
            View on GitHub
          </a>
        </div>
      </PageHero>

      {/* Features */}
      <Section
        id="features"
        title="Built for Young Builders"
        lead="Everything a kid needs to go from zero to embedded engineer."
        split
      >
        <ul className="cards">
          {FEATURES.map(f => (
            <li key={f.title}>
              <div
                className="card kd-f"
                style={{ "--c": f.color } as CSSProperties}
              >
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Learning Levels */}
      <Section
        id="levels"
        title="Three Learning Levels"
        lead="Structured progression from visual blocks to real embedded C."
        split
      >
        <ol className="kd-levels">
          {LEVELS.map((level, i) => (
            <li
              key={level.level}
              className="kd-level"
              style={{ "--c": level.color } as CSSProperties}
            >
              <span className="kd-step" aria-hidden="true">
                {i + 1}
              </span>
              <span className="kd-age">{level.age}</span>
              <h3>{level.level}</h3>
              <p>{level.desc}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* CTA */}
      <Band
        title="Free for Everyone"
        lead="EmbeddedOS Kids Edition is completely free and open source. No subscriptions, no ads."
      >
        <Link href="/getting-started" className="btn pri">
          Get Started{" "}
          <span className="ar" aria-hidden="true">
            →
          </span>
        </Link>
      </Band>
    </BpPage>
  );
}
