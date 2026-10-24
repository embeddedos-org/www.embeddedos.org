import type { CSSProperties } from "react";
import { openContactForm } from "@/lib/contact-form";
import { Band, BpPage, PageHero, Section } from "@/components/bp";
import "./Events.css";

const upcoming = [
  {
    type: "Conference",
    title: "EmbeddedOS Summit 2026",
    date: "October 14–16, 2026",
    location: "San Jose, CA (+ Virtual)",
    desc: "The annual EmbeddedOS community conference. Talks on EoS internals, EAI benchmarks, ENI BCI research, eHealth365 hardware, and the v0.2 roadmap.",
    tags: ["Annual", "Hybrid", "Free Virtual"],
    href: "https://github.com/orgs/embeddedos-org/discussions",
  },
  {
    type: "Workshop",
    title: "Getting Started with EoS — Live Workshop",
    date: "August 5, 2026",
    location: "Virtual (Zoom)",
    desc: "A 3-hour hands-on workshop for new EmbeddedOS developers. Build and flash your first EoS application using EoSim — no hardware required.",
    tags: ["Beginner", "Free", "Virtual"],
    href: "https://github.com/orgs/embeddedos-org/discussions",
  },
  {
    type: "Hackathon",
    title: "EmbeddedAI Hackathon 2026",
    date: "September 20–22, 2026",
    location: "Virtual",
    desc: "48-hour hackathon focused on building AI-powered embedded applications using EAI and ENI. $10,000 in prizes. Open to all skill levels.",
    tags: ["Hackathon", "AI", "Prizes"],
    href: "https://github.com/orgs/embeddedos-org/discussions",
  },
  {
    type: "Meetup",
    title: "EmbeddedOS Community Meetup — Europe",
    date: "July 28, 2026",
    location: "Berlin, Germany",
    desc: "Informal meetup for European EmbeddedOS contributors and users. Lightning talks, demos, and networking.",
    tags: ["Meetup", "In-Person", "Free"],
    href: "https://github.com/orgs/embeddedos-org/discussions",
  },
];

const past = [
  {
    title: "EmbeddedOS Summit 2025",
    date: "October 2025",
    location: "Virtual",
    attendees: "1,200+",
  },
  {
    title: "EAI Benchmark Workshop",
    date: "June 2025",
    location: "Virtual",
    attendees: "340",
  },
  {
    title: "EoS Kernel Deep Dive",
    date: "March 2025",
    location: "Virtual",
    attendees: "520",
  },
];

const typeColors: Record<string, string> = {
  Conference: "#F97316",
  Workshop: "#22D3EE",
  Hackathon: "#A855F7",
  Meetup: "#34D399",
};

export default function Events() {
  return (
    <BpPage className="events">
      <PageHero
        sig
        label="EVENTS"
        title="Events & Conferences"
        lead="Conferences, workshops, hackathons, and community meetups."
      />

      <Section title="Upcoming Events" className="ev-up">
        <ul className="cards two">
          {upcoming.map(e => (
            <li key={e.title}>
              <div className="card ev-card">
                <span
                  className="st"
                  style={
                    {
                      "--c": typeColors[e.type] || "#F97316",
                    } as CSSProperties
                  }
                >
                  {e.type}
                </span>
                <h3>{e.title}</h3>
                <dl className="ev-when">
                  <dt>Date</dt>
                  <dd>{e.date}</dd>
                  <dt>Location</dt>
                  <dd>{e.location}</dd>
                </dl>
                <p>{e.desc}</p>
                <ul className="ev-tags" aria-label="Tags">
                  {e.tags.map(t => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <a href={e.href} className="more ev-go">
                  Register / Learn More <span aria-hidden="true">→</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Past Events" className="ev-past">
        <ul className="ev-rows">
          {past.map(e => (
            <li key={e.title}>
              <div>
                <div className="ev-name">{e.title}</div>
                <div className="ev-at">
                  {e.date} · {e.location}
                </div>
              </div>
              <div className="ev-n">{e.attendees} attendees</div>
            </li>
          ))}
        </ul>
      </Section>

      <Band
        title="Host a Community Event"
        lead="Want to organize an EmbeddedOS meetup or workshop in your city? We provide speaker support, promotional materials, and community promotion."
      >
        <button
          type="button"
          onClick={() =>
            openContactForm({ topic: "contact", subject: "Host an Event" })
          }
          className="btn pri"
        >
          Contact Us{" "}
          <span className="ar" aria-hidden="true">
            →
          </span>
        </button>
      </Band>
    </BpPage>
  );
}
