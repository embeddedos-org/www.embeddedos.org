import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ExternalLink, MessageCircle, MessageSquare, CheckCircle, AlertCircle, Send } from "lucide-react";

const WEB3FORMS_KEY = "97f985ce-75d3-47e8-b941-3e85db2e7395";

const channels = [
  { icon: Mail, label: "Email", value: "contact@embeddedos.org", href: "mailto:contact@embeddedos.org" },
  { icon: ExternalLink, label: "GitHub", value: "github.com/embeddedos-org", href: "https://github.com/embeddedos-org" },
  { icon: MessageCircle, label: "Twitter / X", value: "@embeddedos", href: "https://twitter.com/embeddedos" },
  { icon: MessageSquare, label: "Discord", value: "Join our community", href: "https://discord.gg/embeddedos" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `EmbeddedOS Contact: ${form.subject}`,
          from_name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) setSubmitted(true);
      else setError("Submission failed. Please email us directly at contact@embeddedos.org");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-[#C9A84C] text-sm font-semibold uppercase tracking-widest mb-3">Get in Touch</p>
          <h1 className="font-['Playfair_Display'] font-black text-5xl sm:text-6xl text-white mb-6">
            Contact <span className="text-gold-gradient">EmbeddedOS</span>
          </h1>
          <p className="text-[#666] text-xl max-w-2xl mx-auto">
            Questions about the project, partnership inquiries, or just want to say hello — we'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Channels */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-semibold text-white mb-6">Other Ways to Reach Us</h2>
            {channels.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="glass-card rounded-2xl p-4 flex items-center gap-4 group hover:-translate-y-0.5 transition-all duration-200 block"
              >
                <div className="w-10 h-10 rounded-xl bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(201,168,76,0.15)] transition-colors">
                  <Icon size={18} className="text-[#C9A84C]" />
                </div>
                <div>
                  <div className="text-xs text-[#555] uppercase tracking-wider mb-0.5">{label}</div>
                  <div className="text-white text-sm font-medium group-hover:text-[#E8C97A] transition-colors">{value}</div>
                </div>
              </a>
            ))}

            <div className="glass-card rounded-2xl p-5 mt-6">
              <h3 className="font-semibold text-white mb-2 text-sm">Response Times</h3>
              <div className="space-y-2 text-xs text-[#555]">
                <div className="flex justify-between"><span>General inquiries</span><span className="text-[#C9A84C]">1–2 business days</span></div>
                <div className="flex justify-between"><span>Partnership / sponsorship</span><span className="text-[#C9A84C]">2–3 business days</span></div>
                <div className="flex justify-between"><span>Security reports</span><span className="text-[#C9A84C]">24 hours</span></div>
                <div className="flex justify-between"><span>Press / media</span><span className="text-[#C9A84C]">Same day</span></div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-3xl p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle size={52} className="text-[#C9A84C] mx-auto mb-4" />
                  <h3 className="font-['Playfair_Display'] font-bold text-2xl text-white mb-3">Message Sent!</h3>
                  <p className="text-[#666]">We'll get back to you within 1–2 business days.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#666] uppercase tracking-wider mb-1.5">Name *</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#666] uppercase tracking-wider mb-1.5">Email *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#666] uppercase tracking-wider mb-1.5">Subject *</label>
                    <input
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                      placeholder="What's this about?"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#666] uppercase tracking-wider mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="input-dark w-full px-4 py-3 rounded-xl text-sm resize-none"
                      placeholder="Tell us more..."
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-xl px-4 py-3">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-gold w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <Send size={18} />
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
