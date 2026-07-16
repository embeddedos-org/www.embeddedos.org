import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Shield, Users, Cpu, Plane, CreditCard, ArrowRight } from "lucide-react";

const IMPACT_ITEMS = [
  { icon: Cpu, label: "Fund hardware research", color: "#F97316" },
  { icon: Shield, label: "Keep the OS open source", color: "#34D399" },
  { icon: Users, label: "Support contributors", color: "#A78BFA" },
  { icon: Plane, label: "Advance aerospace R&D", color: "#60A5FA" },
];

const STORAGE_KEY = "eos-donate-dismissed";
const DISMISS_HOURS = 168; // 7 days
const AUTO_SHOW_DELAY_MS = 20000; // 20 seconds — give visitors time to explore the page first

export default function DonateModal() {
  const [open, setOpen] = useState(false);

  const dismiss = useCallback(() => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  }, []);

  // Auto-open on first visit (or after dismiss period)
  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setOpen(true), AUTO_SHOW_DELAY_MS);
      return () => clearTimeout(timer);
    }
    const dismissedAt = parseInt(dismissed, 10);
    const hoursSince = (Date.now() - dismissedAt) / (1000 * 60 * 60);
    if (hoursSince > DISMISS_HOURS) {
      const timer = setTimeout(() => setOpen(true), AUTO_SHOW_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, []);

  // Listen for manual trigger from Donate button
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-donate", handler);
    return () => window.removeEventListener("open-donate", handler);
  }, []);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [dismiss]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="donate-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            onClick={dismiss}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="donate-modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md pointer-events-auto rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "linear-gradient(145deg, #0d1526 0%, #0a0f1e 100%)", border: "1px solid rgba(255,255,255,0.08)" }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="donate-title"
            >
              {/* Header gradient bar */}
              <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #F97316, #F59E0B, #34D399, #60A5FA)" }} />

              {/* Close button */}
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close donate dialog"
              >
                <X size={16} />
              </button>

              <div className="p-6">
                {/* Icon + Title */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center">
                    <Heart size={24} className="text-[#34D399]" />
                  </div>
                  <div>
                    <h2 id="donate-title" className="font-heading font-extrabold text-white text-xl">Support EmbeddedOS</h2>
                    <p className="text-xs text-white/40">501(c)(3) · Tax-deductible</p>
                  </div>
                </div>

                <p className="text-sm text-white/60 leading-relaxed mb-5">
                  EmbeddedOS is a free, open-source project maintained by volunteers and funded entirely by donations.
                  Your support keeps the OS free for everyone — from students to aerospace engineers.
                </p>

                {/* Impact grid */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {IMPACT_ITEMS.map(({ icon: Icon, label, color }) => (
                    <div key={label} className="flex items-center gap-2 glass rounded-lg p-2.5 border border-white/5">
                      <Icon size={14} style={{ color }} className="flex-shrink-0" />
                      <span className="text-xs text-white/60">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Donate button */}
                <a
                  href="/donate#donate-now"
                  onClick={dismiss}
                  className="flex items-center justify-between w-full px-4 py-4 rounded-xl border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 hover:border-orange-500/50 transition-all duration-150 group mb-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                      <CreditCard size={16} className="text-orange-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Donate Now</div>
                      <div className="text-xs text-white/50">Secure · 0% platform fees · Tax-deductible</div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-orange-400/60 group-hover:text-orange-400 transition-colors" />
                </a>

                {/* Trust signals */}
                <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-white/30">
                    <Shield size={11} className="text-[#34D399]" />
                    Secure payment
                  </span>
                  <span className="flex items-center gap-1 text-xs text-white/30">
                    <span className="text-[#34D399] text-xs">✓</span>
                    0% fees
                  </span>
                  <span className="flex items-center gap-1 text-xs text-white/30">
                    <span className="text-[#34D399] text-xs">✓</span>
                    Tax receipt by email
                  </span>
                </div>

                {/* Dismiss */}
                <button
                  onClick={dismiss}
                  className="w-full text-xs text-white/30 hover:text-white/50 transition-colors py-1"
                >
                  Maybe later — remind me in 3 days
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
