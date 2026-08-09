import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Users } from "lucide-react";

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
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium mb-6">
              <Calendar className="w-4 h-4" /> EVENTS
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
              Events & Conferences
            </h1>
            <p className="text-xl text-gray-300">
              Conferences, workshops, hackathons, and community meetups.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">Upcoming Events</h2>
          <div className="space-y-4">
            {upcoming.map((e, i) => (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full mr-2"
                      style={{
                        background: (typeColors[e.type] || "#F97316") + "20",
                        color: typeColors[e.type] || "#F97316",
                      }}
                    >
                      {e.type}
                    </span>
                    <h3 className="text-white font-semibold text-lg mt-2">
                      {e.title}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {e.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {e.location}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{e.desc}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {e.tags.map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-full bg-white/5 text-gray-500 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={e.href}
                  className="inline-flex items-center gap-2 text-orange-400 text-sm font-medium hover:underline"
                >
                  Register / Learn More <ArrowRight className="w-3 h-3" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-white mb-6">Past Events</h2>
          <div className="space-y-3">
            {past.map((e, i) => (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between"
              >
                <div>
                  <div className="text-white font-medium">{e.title}</div>
                  <div className="text-gray-500 text-sm">
                    {e.date} · {e.location}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-gray-400 text-sm">
                  <Users className="w-3 h-3" />
                  {e.attendees} attendees
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-white mb-4">
            Host a Community Event
          </h2>
          <p className="text-gray-400 mb-6">
            Want to organize an EmbeddedOS meetup or workshop in your city? We
            provide speaker support, promotional materials, and community
            promotion.
          </p>
          <a
            href="mailto:hello@embeddedos.org?subject=Host an Event"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors"
          >
            Contact Us <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
