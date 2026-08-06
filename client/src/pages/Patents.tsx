import { motion } from "framer-motion";
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    color: "from-cyan-500/20 to-blue-600/20",
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
    color: "from-purple-500/20 to-pink-600/20",
    accent: "#A855F7",
  },
];

export default function Patents() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1E] via-[#0D1B2A] to-[#0A0F1E]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 40%, #22D3EE22 0%, transparent 50%), radial-gradient(circle at 70% 60%, #A855F722 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-xs font-mono font-bold tracking-widest text-[#F97316] uppercase mb-4 px-3 py-1 rounded-full border border-[#F97316]/30 bg-[#F97316]/10">
              Intellectual Property
            </span>
            <h1 className="text-5xl md:text-6xl font-heading font-black mb-6">
              EmbeddedOS{" "}
              <span className="bg-gradient-to-r from-[#22D3EE] to-[#A855F7] bg-clip-text text-transparent">
                Patents
              </span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Two U.S. provisional patent applications protecting the world's
              most advanced wearable health intelligence devices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Patent Cards */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          {patents.map((patent, i) => (
            <motion.div
              key={patent.appNumber}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative rounded-2xl border border-white/10 bg-gradient-to-br ${patent.color} backdrop-blur-sm p-8 flex flex-col gap-4`}
            >
              {/* App Number */}
              <div
                className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border self-start"
                style={{
                  color: patent.accent,
                  borderColor: `${patent.accent}40`,
                  background: `${patent.accent}15`,
                }}
              >
                {patent.appNumber}
              </div>

              <h2 className="text-2xl font-heading font-black">
                {patent.title}
              </h2>

              <div className="flex items-center gap-2 text-sm text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {patent.filed}
              </div>

              <p className="text-white/70 leading-relaxed text-sm">
                {patent.description}
              </p>

              {/* Claims */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
                  Key Claims
                </h3>
                <ul className="space-y-2">
                  {patent.claims.map(claim => (
                    <li
                      key={claim}
                      className="flex items-start gap-2 text-sm text-white/80"
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: patent.accent }}
                      />
                      {claim}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-wrap mt-2">
                <a
                  href={patent.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{ background: patent.accent }}
                >
                  Patent Docs on GitHub
                </a>
                <Link
                  href="/health"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-white/20 text-white/80 hover:bg-white/10 transition-all"
                >
                  Device Page
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Licensing Section */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-10"
        >
          <h2 className="text-2xl font-heading font-black mb-3">
            Licensing &amp; Inquiries
          </h2>
          <p className="text-white/60 leading-relaxed mb-6 max-w-2xl">
            For patent licensing inquiries, research collaborations, or
            commercial partnerships, please contact the Embedded Operating
            Systems Research Foundation.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#F97316] text-white hover:bg-[#F97316]/90 transition-all hover:scale-105"
            >
              Contact Foundation
            </Link>
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-white/20 text-white/80 hover:bg-white/10 transition-all"
            >
              Become a Member
            </Link>
            <Link
              href="/research"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border border-white/20 text-white/80 hover:bg-white/10 transition-all"
            >
              Research Publications
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
