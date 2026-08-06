import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import { Link } from "wouter";

export default function Article_article_eosim_hil_bridge() {
  return (
    <div className="min-h-screen bg-[#0A0E1A] text-white">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-transparent" />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> December 2024
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> 6 min read
              </span>
              <span
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
                style={{
                  background: "rgba(249,115,22,0.15)",
                  color: "#F97316",
                }}
              >
                <Tag className="w-3 h-3" /> Engineering
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              EoSim 2.4 HIL Bridge: Virtual Peripherals Talking to Real Silicon
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              EoSim 2.4 introduces a bidirectional hardware-in-the-loop bridge:
              drive simulated EoS images from a real PHY, or drive real boards
              from a simulated MMIO bus.
            </p>
          </motion.div>
        </div>
      </section>

      <article className="py-8 px-4">
        <div className="max-w-3xl mx-auto prose prose-invert prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              What is HIL good for, anyway?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Hardware-in-the-loop testing connects a simulated firmware image
              to real physical hardware. The canonical use case: test a motor
              controller firmware image against a real motor driver IC, without
              flashing the firmware to a real MCU. This catches
              hardware-software interface bugs (wrong SPI clock polarity,
              missing pull-up) that pure simulation misses.
            </p>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              The ezbus protocol
            </h2>
            <p className="text-gray-300 leading-relaxed">
              EoSim 2.4 introduces ezbus, a lightweight USB protocol that
              bridges simulated MMIO registers to real hardware. A USB-connected
              ezbus adapter (based on the RP2040) exposes up to 16 virtual
              peripherals. The EoSim image writes to a simulated SPI register;
              ezbus translates the write to a real SPI transaction on the
              adapter's hardware SPI port.
            </p>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              Two directions
            </h2>
            <p className="text-gray-300 leading-relaxed">
              The bridge works in both directions. Direction 1 (sim → real): the
              EoSim image drives real hardware via ezbus. Direction 2 (real →
              sim): a real EoS board drives a simulated peripheral model in
              EoSim. Direction 2 is useful for testing sensor fusion algorithms:
              inject synthetic sensor data from EoSim into a real board running
              production firmware.
            </p>
          </section>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-white mb-4">Performance</h2>
            <p className="text-gray-300 leading-relaxed">
              The ezbus adapter adds 180 µs of round-trip latency for a single
              SPI transaction. For most HIL use cases (motor control at 10 kHz,
              sensor reads at 1 kHz), this latency is acceptable. For sub-100 µs
              use cases (high-speed ADC, PWM generation), direct hardware
              testing is still required.
            </p>
          </section>
        </div>
      </article>

      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Read next</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/demo"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"
            >
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              Try EoSim
            </Link>
            <Link
              href="/eosim"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"
            >
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              EoSim Product Page
            </Link>
            <Link
              href="/ebuild"
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors text-sm text-gray-300 hover:text-white"
            >
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              eBuild Reference
            </Link>
            <Link
              href="/news"
              className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg hover:bg-orange-500/20 transition-colors text-sm text-orange-400"
            >
              <ArrowRight className="w-4 h-4" />
              All Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
