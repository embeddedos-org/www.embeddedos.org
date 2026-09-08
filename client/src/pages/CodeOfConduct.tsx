import { motion } from "framer-motion";
import { Heart, CheckCircle2, XCircle } from "lucide-react";
import { openContactForm } from "@/lib/contact-form";

const expected = [
  "Use welcoming and inclusive language in all community spaces.",
  "Be respectful of differing viewpoints, experience levels, and backgrounds.",
  "Gracefully accept constructive criticism and provide it in kind.",
  "Focus on what is best for the community and the project.",
  "Show empathy towards other community members.",
  "Credit the work of others appropriately.",
  "Help newcomers and answer questions with patience.",
];

const unacceptable = [
  "Harassment, intimidation, or discrimination of any kind.",
  "Sexualized language or imagery, or unwelcome sexual attention.",
  "Trolling, insulting or derogatory comments, and personal or political attacks.",
  "Publishing others' private information without explicit permission.",
  "Sustained disruption of community discussions or events.",
  "Advocating for or encouraging any of the above behaviors.",
];

const spaces = [
  "GitHub repositories (issues, pull requests, discussions, code reviews)",
  "Discord server and all channels",
  "Mailing lists and email communications",
  "EmbeddedOS Summit and all Foundation events",
  "Social media when representing EmbeddedOS",
  "Any other community space designated by the Foundation",
];

export default function CodeOfConduct() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-orange-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-sm font-medium mb-6">
              <Heart className="w-4 h-4" /> CODE OF CONDUCT
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-pink-300 bg-clip-text text-transparent">
              Code of Conduct
            </h1>
            <p className="text-xl text-gray-300">
              The EmbeddedOS community is committed to providing a welcoming and
              inclusive environment for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <p className="text-gray-300 leading-relaxed">
              The EmbeddedOS community is made up of contributors and users from
              around the world. We are committed to providing a friendly, safe,
              and welcoming environment for all, regardless of level of
              experience, gender identity and expression, sexual orientation,
              disability, personal appearance, body size, race, ethnicity, age,
              religion, nationality, or other similar characteristic.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              Expected Behavior
            </h2>
            <div className="space-y-2">
              {expected.map((e, i) => (
                <motion.div
                  key={e}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{e}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              Unacceptable Behavior
            </h2>
            <div className="space-y-2">
              {unacceptable.map((u, i) => (
                <motion.div
                  key={u}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-3"
                >
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 text-sm">{u}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Scope</h2>
            <p className="text-gray-400 text-sm mb-3">
              This Code of Conduct applies in all community spaces, including:
            </p>
            <div className="space-y-2">
              {spaces.map(s => (
                <div key={s} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0 mt-1.5" />
                  <span className="text-gray-400 text-sm">{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-4">Enforcement</h2>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              Instances of abusive, harassing, or otherwise unacceptable
              behavior may be reported by{" "}
              <button
                type="button"
                onClick={() => openContactForm({ topic: "conduct" })}
                className="text-orange-400 underline underline-offset-2"
              >
                contacting the Foundation
              </button>
              . All complaints will be reviewed and investigated promptly and
              fairly.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Community leaders are responsible for clarifying and enforcing our
              standards of acceptable behavior and will take appropriate and
              fair corrective action in response to any behavior that they deem
              inappropriate, threatening, offensive, or harmful.
            </p>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5">
            <p className="text-gray-300 text-sm">
              This Code of Conduct is adapted from the{" "}
              <a
                href="https://www.contributor-covenant.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 underline underline-offset-2"
              >
                Contributor Covenant
              </a>
              , version 2.1.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
