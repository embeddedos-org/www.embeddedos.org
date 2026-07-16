import { motion } from "framer-motion";
import { ArrowRight, Gamepad2, BookOpen, Code, Zap, Star, Heart } from "lucide-react";
import { Link } from "wouter";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

const FEATURES = [
  { icon: Gamepad2, title: "Interactive Games", desc: "Learn programming through fun, engaging games designed for ages 6–16.", color: "#F97316" },
  { icon: Code, title: "Block Coding", desc: "Scratch-like visual programming that compiles to real EmbeddedOS code.", color: "#22D3EE" },
  { icon: BookOpen, title: "Guided Curriculum", desc: "Structured learning paths from beginner to advanced embedded programming.", color: "#A78BFA" },
  { icon: Zap, title: "Real Hardware", desc: "Connect to real microcontrollers and see your code run on physical devices.", color: "#34D399" },
  { icon: Star, title: "Achievements", desc: "Earn badges and certificates as you progress through challenges.", color: "#F59E0B" },
  { icon: Heart, title: "Parental Controls", desc: "Safe, monitored environment with progress tracking for parents.", color: "#60A5FA" },
];

const LEVELS = [
  { level: "Beginner", age: "Ages 6–9", desc: "Block-based visual programming with drag-and-drop logic. Light up LEDs, make sounds, and control robots.", color: "#34D399" },
  { level: "Intermediate", age: "Ages 10–13", desc: "Introduction to C programming with guided projects. Build sensors, displays, and simple IoT devices.", color: "#F59E0B" },
  { level: "Advanced", age: "Ages 14–18", desc: "Full EmbeddedOS development. Build real applications, contribute to open source, and earn certifications.", color: "#F97316" },
];

export default function Kids() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="section-padding bg-grid">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="visible">
            <div className="badge-amber mb-4 inline-flex">
              <Gamepad2 size={12} />
              EmbeddedOS Kids Edition
            </div>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white mb-4">
              Learn to Build{" "}
              <span className="text-gradient">Real Devices</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              The educational platform that teaches kids embedded programming through games,
              interactive projects, and real hardware — from ages 6 to 18.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/getting-started"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl transition-all active:scale-95"
              >
                Start Learning
                <ArrowRight size={16} />
              </Link>
              <a
                href="https://github.com/embeddedos-org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 glass hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10"
              >
                View on GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-[#080F1E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 text-center">
            <h2 className="font-heading font-bold text-white text-3xl mb-2">Built for Young Builders</h2>
            <p className="text-white/50">Everything a kid needs to go from zero to embedded engineer.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="glass rounded-xl p-5 border border-white/5 flex items-start gap-3"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: f.color + "20", border: `1px solid ${f.color}40` }}
                  >
                    <Icon size={20} style={{ color: f.color }} />
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm mb-1">{f.title}</div>
                    <div className="text-xs text-white/50 leading-relaxed">{f.desc}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning Levels */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 text-center">
            <h2 className="font-heading font-bold text-white text-3xl mb-2">Three Learning Levels</h2>
            <p className="text-white/50">Structured progression from visual blocks to real embedded C.</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {LEVELS.map((level, i) => (
              <motion.div
                key={level.level}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass rounded-2xl p-6 border border-white/5 text-center card-hover"
                style={{ borderTopColor: level.color, borderTopWidth: 2 }}
              >
                <div
                  className="text-xs font-bold px-3 py-1 rounded-full inline-flex mb-3"
                  style={{ background: level.color + "20", color: level.color }}
                >
                  {level.age}
                </div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">{level.level}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{level.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#080F1E] text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-heading font-bold text-white text-2xl mb-4">Free for Everyone</h2>
          <p className="text-white/50 mb-6">EmbeddedOS Kids Edition is completely free and open source. No subscriptions, no ads.</p>
          <Link
            href="/getting-started"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl transition-all active:scale-95"
          >
            Get Started Free
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
