import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart, Shield, Globe, Cpu, Zap, Users, CheckCircle,
  BookOpen, Award, Star, RefreshCw,
} from "lucide-react";
const STATS = [
  { icon: Cpu,      value: "22+",  label: "Open-Source Repos",   color: "#F97316" },
  { icon: BookOpen, value: "14",   label: "Free Technical Books", color: "#22D3EE" },
  { icon: Globe,    value: "40+",  label: "Countries Using EoS",  color: "#34D399" },
  { icon: Users,    value: "100%", label: "To the Foundation",    color: "#A78BFA" },
];

const IMPACT_ITEMS = [
  { icon: Cpu,      color: "#F97316", title: "Hardware Research",   detail: "Every $100 funds one new board bring-up" },
  { icon: BookOpen, color: "#22D3EE", title: "Technical Books",     detail: "14 books, 100% free forever" },
  { icon: Shield,   color: "#34D399", title: "Security Audits",     detail: "CVE-0 track record since 2023" },
  { icon: Users,    color: "#A78BFA", title: "Community Events",    detail: "3 conferences planned for 2025" },
  { icon: Zap,      color: "#F59E0B", title: "Student Internships", detail: "Paid internships for embedded devs" },
  { icon: Star,     color: "#60A5FA", title: "Contributor Grants",  detail: "Grants for open-source contributors" },
];

const ZEFFY_URL = "https://www.zeffy.com/en-US/embed/donation-form/donate-to-change-lives-17596";

export default function Donate() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setIframeLoaded(true), 3000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 bg-gradient-to-br from-[#0a0520] via-[#050510] to-[#020818]">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(249,115,22,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(99,102,241,0.3) 0%, transparent 50%)" }} />
        <div className="relative container mx-auto px-4 text-center max-w-3xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 px-3 py-1">
              <Heart className="w-3.5 h-3.5 mr-1.5 fill-current" />501(c)(3) · 509(a)(2) Nonprofit
            </Badge>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1">
              <Shield className="w-3.5 h-3.5 mr-1.5" />Tax-Deductible
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-5 leading-tight">
            Support the{" "}
            <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">EmbeddedOS Foundation</span>
          </h1>
          <p className="text-xl text-white/70 mb-4 leading-relaxed">
            Your donation funds open-source embedded OS research, developer tooling, and the next generation of real-time operating systems — freely available to everyone.
          </p>
          <p className="text-sm text-white/40">Embedded Operating Systems Research Foundation · EIN: 41-4821627 · 501(c)(3) · 509(a)(2) Public Charity</p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-10 bg-[#080820] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s) => { const Icon = s.icon; return (
            <div key={s.label} className="text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: s.color + "20", border: `1px solid ${s.color}40` }}>
                <Icon size={18} style={{ color: s.color }} />
              </div>
              <div className="font-bold text-2xl text-white">{s.value}</div>
              <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
            </div>
          ); })}
        </div>
      </section>

      {/* Main donation section */}
      <section className="py-16" id="donate-now">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* Left: Zeffy iframe */}
            <div className="lg:col-span-3">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-1">Make a Donation</h2>
                <p className="text-white/50 text-sm">
                  Powered by{" "}
                  <a href="https://www.zeffy.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">Zeffy</a>
                  {" "}— 0% platform fees, all funds go directly to the Foundation.
                </p>
              </div>
              <div className="mb-4 p-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-xs text-yellow-300/80 flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">ℹ</span>
                <span>
                  Zeffy may show an optional tip on the payment page (default 17%). You can set it to 0% using the dropdown — it is completely optional and does not affect your donation amount.
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5" style={{ minHeight: 820 }}>
                {!iframeLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
                    <RefreshCw className="w-8 h-8 text-orange-400 animate-spin" />
                    <p className="text-white/40 text-sm">Loading donation form…</p>
                  </div>
                )}
                <iframe
                  title="Donation form powered by Zeffy"
                  src={ZEFFY_URL}
                  allow="payment"
                  onLoad={() => { setIframeLoaded(true); if (timerRef.current) clearTimeout(timerRef.current); }}
                  style={{
                    overflow: "hidden",
                    width: "100%",
                    border: "none",
                    display: "block",
                    opacity: iframeLoaded ? 1 : 0,
                    transition: "opacity 0.4s ease",
                  }}
                  height={820}
                />
              </div>
              <div className="mt-5 text-xs text-white/30 space-y-1">
                <div className="font-medium text-white/50 mb-2">Other ways to give</div>
                <div>Wire / check: <a href="mailto:foundation@embeddedos.org" className="text-orange-400 hover:underline">foundation@embeddedos.org</a></div>
                <div>GitHub Sponsors: <a href="https://github.com/sponsors/embeddedos-org" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline">github.com/sponsors/embeddedos-org</a></div>
              </div>
            </div>

            {/* Right: trust + impact */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="rounded-2xl border border-white/10 bg-white/5">
                <CardContent className="p-5">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-400" />Donation Assurance
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Award,       label: "501(c)(3) · 509(a)(2)",       sub: "Tax-exempt nonprofit" },
                      { icon: CheckCircle, label: "0% Platform Fee", sub: "100% goes to Foundation" },
                      { icon: Globe,       label: "MIT License",     sub: "100% open source" },
                      { icon: Shield,      label: "Zeffy Secure",    sub: "PCI-DSS compliant" },
                    ].map((b) => { const Icon = b.icon; return (
                      <div key={b.label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                        <Icon className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                        <div className="text-xs font-semibold text-white">{b.label}</div>
                        <div className="text-xs text-white/40">{b.sub}</div>
                      </div>
                    ); })}
                  </div>
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-green-300">
                    <Shield className="w-3.5 h-3.5 inline mr-1.5" />Tax-deductible donation · EIN 41-4821627
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border border-white/10 bg-white/5">
                <CardContent className="p-5">
                  <h3 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-4">Your Impact</h3>
                  <div className="space-y-3">
                    {IMPACT_ITEMS.map((item) => { const Icon = item.icon; return (
                      <div key={item.title} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: item.color + "20", border: `1px solid ${item.color}40` }}>
                          <Icon className="w-4 h-4" style={{ color: item.color }} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{item.title}</div>
                          <div className="text-xs text-white/50">{item.detail}</div>
                        </div>
                      </div>
                    ); })}
                  </div>
                </CardContent>
              </Card>
              <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5">
                <h3 className="text-white font-semibold mb-2 text-sm">Want recurring impact?</h3>
                <p className="text-white/50 text-xs mb-3 leading-relaxed">
                  Become a Foundation Member for sustained support — with recognition, early access, and voting rights.
                </p>
                <Button asChild size="sm" className="w-full bg-orange-500 hover:bg-orange-400 text-white font-semibold">
                  <Link href="/membership">View Membership Tiers →</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why donate */}
      <section className="py-20 bg-gradient-to-b from-[#050510] to-[#080820]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Why Support EmbeddedOS?</h2>
          <p className="text-white/60 mb-12 max-w-2xl mx-auto">The Embedded Operating Systems Research Foundation is a 501(c)(3) · 509(a)(2) nonprofit that develops and maintains free, open-source software for embedded systems, IoT, AI edge computing, aerospace, and healthcare devices.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Cpu,   title: "Open-Source First", desc: "Every line of code is MIT-licensed and freely available. Your donation keeps it that way." },
              { icon: Globe, title: "Global Impact",      desc: "EoS powers devices in 40+ countries — from hospital monitors to satellite edge nodes." },
              { icon: Users, title: "Community Driven",  desc: "Donations fund student internships, contributor grants, and open research programs." },
            ].map((c) => { const Icon = c.icon; return (
              <div key={c.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
                <Icon className="w-6 h-6 text-orange-400 mb-3" />
                <h3 className="text-white font-semibold mb-2">{c.title}</h3>
                <p className="text-white/60 text-sm">{c.desc}</p>
              </div>
            ); })}
          </div>
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10"><Link href="/membership">Become a Member</Link></Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10"><Link href="/get-involved">Volunteer / Contribute</Link></Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10"><Link href="/sponsors">Corporate Sponsorship</Link></Button>
          </div>
        </div>
      </section>

    </div>
  );
}
