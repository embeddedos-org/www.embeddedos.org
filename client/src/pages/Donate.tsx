import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart, Shield, Globe, Cpu, Zap, Users, CheckCircle,
  BookOpen, Award, Star, Building2, Copy, Download,
  ArrowRight, Banknote, Search, FileText, Mail, RefreshCw,
} from "lucide-react";

const EIN = "41-4821627";
const BANK_NAME = "US Bank";
const ACCOUNT_NAME = "Embedded Operating Systems Research Foundation";
const ACCOUNT_NUMBER = "157545903658";
const ROUTING_NUMBER = "122235821";
const ACCOUNT_TYPE = "Non-Profit Checking";
const VERIFICATION_EMAIL = "donations@embeddedos.org";
const LEGAL_NAME = "Embedded Operating Systems Research Foundation";
const EXEMPTION_DATE = "March 11, 2026";
const LETTER_URL = "/manus-storage/eos-501c3-determination-letter_688574de.pdf";

const STATS = [
  { icon: Cpu,      value: "22",   label: "Open-Source Repos",   color: "#F97316" },
  { icon: BookOpen, value: "14",   label: "Free Technical Books", color: "#22D3EE" },
  { icon: Award,    value: "501(c)(3)", label: "Tax-Exempt Status", color: "#34D399" },
  { icon: Users,    value: "100%", label: "To the Foundation",    color: "#A78BFA" },
];

const IMPACT_ITEMS = [
  { icon: Cpu,      color: "#F97316", title: "Hardware Research",       detail: "Board bring-up, driver development, and silicon validation" },
  { icon: BookOpen, color: "#22D3EE", title: "Technical Books",         detail: "14 books, 100% free forever" },
  { icon: Shield,   color: "#34D399", title: "Security Research",       detail: "Secure boot, attestation, and cryptographic research" },
  { icon: Users,    color: "#A78BFA", title: "Open-Source Development", detail: "22 public repositories, MIT-licensed" },
  { icon: Zap,      color: "#F59E0B", title: "Developer Tools",         detail: "EoStudio IDE, EoSim simulator, eBuild toolchain" },
  { icon: Star,     color: "#60A5FA", title: "Foundation Operations",   detail: "501(c)(3) public charity, EIN 41-4821627" },
];

const MATCHING_STEPS = [
  { step: "1", title: "Make your donation", desc: "Donate via Zeffy below or by wire/check." },
  { step: "2", title: "Check employer eligibility", desc: "Log into your employer\u2019s CSR / HR portal and search for our EIN: 41-4821627." },
  { step: "3", title: "Submit match request", desc: "Complete your employer\u2019s matching gift form. Use our EIN and legal name." },
  { step: "4", title: "Employer verifies with us", desc: "Your employer may contact us at donations@embeddedos.org to confirm your gift." },
  { step: "5", title: "Foundation receives match", desc: "Your employer sends a matching check or wire directly to the Foundation \u2014 doubling your impact." },
];

const TOP_MATCHERS = [
  { company: "Microsoft", ratio: "1:1", max: "$15,000" },
  { company: "Google",    ratio: "1:1", max: "$10,000" },
  { company: "Apple",     ratio: "1:1", max: "$10,000" },
  { company: "Amazon",    ratio: "1:1", max: "$10,000" },
  { company: "Chevron",   ratio: "1:1", max: "$10,000" },
  { company: "American Express", ratio: "1:1", max: "$8,000" },
  { company: "Johnson & Johnson", ratio: "1:1", max: "$10,000" },
  { company: "Disney",    ratio: "1:1", max: "$25,000" },
];

const ZEFFY_URL = "https://www.zeffy.com/en-US/embed/donation-form/donate-to-change-lives-17596";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
    >
      <Copy className="w-3 h-3" />
      {copied ? "Copied!" : label}
    </button>
  );
}

export default function Donate() {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"online" | "wire" | "check" | "matching">("online");
  const [employerSearch, setEmployerSearch] = useState("");
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
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 px-3 py-1">
              <Heart className="w-3 h-3 mr-1" /> 501(c)(3) Nonprofit
            </Badge>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1">
              <CheckCircle className="w-3 h-3 mr-1" /> Tax-Deductible
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1">
              <Award className="w-3 h-3 mr-1" /> EIN: {EIN}
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Support <span className="text-orange-400">Open Embedded</span> Software
          </h1>
          <p className="text-lg text-white/70 mb-8">
            Every dollar funds free, open-source embedded operating systems used by engineers, students, and researchers in 40+ countries. Your donation is fully tax-deductible.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button onClick={() => setActiveTab("online")} className="bg-orange-500 hover:bg-orange-600 text-white px-6">
              Donate Online
            </Button>
            <Button onClick={() => setActiveTab("matching")} variant="outline" className="border-orange-500/40 text-orange-300 hover:bg-orange-500/10 px-6">
              <Building2 className="w-4 h-4 mr-2" /> Employer Matching
            </Button>
            <Button onClick={() => setActiveTab("wire")} variant="outline" className="border-white/20 text-white/70 hover:bg-white/10 px-6">
              <Banknote className="w-4 h-4 mr-2" /> Wire / Check
            </Button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-10 bg-[#080820] border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: s.color + "20", border: `1px solid ${s.color}40` }}>
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-white/50">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main donation section */}
      <section id="donate-now" className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Tab navigation */}
          <div className="flex gap-2 mb-8 flex-wrap justify-center">
            {([
              { id: "online",   label: "Online (Zeffy)",    icon: Heart },
              { id: "matching", label: "Employer Matching", icon: Building2 },
              { id: "wire",     label: "Wire Transfer",     icon: Banknote },
              { id: "check",    label: "Check / Mail",      icon: FileText },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-orange-500 text-white"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Online donation tab */}
          {activeTab === "online" && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3">
                <div className="mb-4 p-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-xs text-yellow-300/80 flex items-start gap-2">
                  <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Zeffy may show an optional tip on the payment page (default 17%). You can set it to 0% \u2014 it is completely optional and does not affect your donation amount.</span>
                </div>
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5" style={{ minHeight: 820 }}>
                  {!iframeLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <RefreshCw className="w-8 h-8 text-orange-400 animate-spin" />
                      <p className="text-white/50 text-sm">Loading secure donation form\u2026</p>
                    </div>
                  )}
                  <iframe
                    src={ZEFFY_URL}
                    title="Donate to Embedded Operating Systems Research Foundation"
                    width="100%"
                    height={820}
                    frameBorder="0"
                    allowFullScreen
                    onLoad={() => setIframeLoaded(true)}
                    style={{ display: "block", transition: "opacity 0.4s", opacity: iframeLoaded ? 1 : 0 }}
                  />
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="p-4 rounded-2xl border border-green-500/20 bg-green-500/5">
                  <p className="text-xs text-green-300 font-semibold mb-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Tax Receipt</p>
                  <p className="text-xs text-white/60">You will receive an automatic tax receipt via email. Contributions are deductible under IRC Section 170.</p>
                </div>
                <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5">
                  <p className="text-xs text-blue-300 font-semibold mb-2 flex items-center gap-1"><Award className="w-3 h-3" /> 501(c)(3) Status</p>
                  <div className="space-y-1 text-xs text-white/60">
                    <p><span className="text-white/40">Legal name:</span> {LEGAL_NAME}</p>
                    <p><span className="text-white/40">EIN:</span> <span className="text-white font-mono">{EIN}</span></p>
                    <p><span className="text-white/40">Effective:</span> {EXEMPTION_DATE}</p>
                    <p><span className="text-white/40">Status:</span> Public Charity 509(a)(2)</p>
                  </div>
                  <a href={LETTER_URL} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300">
                    <Download className="w-3 h-3" /> Download IRS Determination Letter
                  </a>
                </div>
                <div className="p-4 rounded-2xl border border-orange-500/20 bg-orange-500/5">
                  <p className="text-xs text-orange-300 font-semibold mb-2 flex items-center gap-1"><Building2 className="w-3 h-3" /> Double Your Impact</p>
                  <p className="text-xs text-white/60 mb-2">Many employers match employee donations. After donating, check if your company matches \u2014 it could double or triple your gift at no extra cost to you.</p>
                  <button onClick={() => setActiveTab("matching")} className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1">
                    Check employer matching <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-2">
                  {IMPACT_ITEMS.map((item) => (
                    <div key={item.title} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: item.color + "20", border: `1px solid ${item.color}40` }}>
                        <item.icon className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{item.title}</p>
                        <p className="text-xs text-white/50">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Employer matching tab */}
          {activeTab === "matching" && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Double Your Donation \u2014 Employer Matching</h2>
                <p className="text-white/60">Many companies match employee donations to 501(c)(3) nonprofits. Use our EIN <span className="text-orange-400 font-mono font-bold">{EIN}</span> when submitting your match request.</p>
              </div>
              <div className="p-6 rounded-2xl border border-white/10 bg-white/3">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Search className="w-4 h-4 text-orange-400" /> Check if Your Employer Matches</h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={employerSearch}
                    onChange={(e) => setEmployerSearch(e.target.value)}
                    placeholder="Type your employer name (e.g. Google, Microsoft, Apple\u2026)"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50"
                  />
                  <a
                    href={`https://doublethedonation.com/search/?company=${encodeURIComponent(employerSearch)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
                  >
                    Search
                  </a>
                </div>
                <p className="text-xs text-white/40 mt-2">Powered by Double the Donation \u2014 the industry-standard matching gift database.</p>
              </div>
              <div className="p-6 rounded-2xl border border-white/10 bg-white/3">
                <h3 className="text-sm font-semibold text-white mb-4">How Employer Matching Works</h3>
                <div className="space-y-4">
                  {MATCHING_STEPS.map((s) => (
                    <div key={s.step} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-bold text-sm shrink-0">{s.step}</div>
                      <div>
                        <p className="text-sm font-semibold text-white">{s.title}</p>
                        <p className="text-xs text-white/50">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5">
                <h3 className="text-sm font-semibold text-blue-300 mb-4 flex items-center gap-2"><FileText className="w-4 h-4" /> Information for Employers / HR Departments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">Legal Organization Name</p>
                      <p className="text-white font-medium">{LEGAL_NAME}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">Employer Identification Number (EIN)</p>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-mono font-bold text-lg">{EIN}</p>
                        <CopyButton text={EIN} label="Copy EIN" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">IRS Tax Status</p>
                      <p className="text-white">501(c)(3) Public Charity \u2014 IRC Section 509(a)(2)</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">Effective Date of Exemption</p>
                      <p className="text-white">{EXEMPTION_DATE}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">Contribution Deductibility</p>
                      <p className="text-green-400 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Yes \u2014 IRC Section 170</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">Verification Contact</p>
                      <div className="flex items-center gap-2">
                        <p className="text-white">{VERIFICATION_EMAIL}</p>
                        <CopyButton text={VERIFICATION_EMAIL} label="Copy" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">Mailing Address</p>
                      <p className="text-white text-xs leading-relaxed">Embedded Operating Systems Research Foundation<br />C/O Srikanth Patchava<br />2601 Cortez Dr Unit 1104<br />Santa Clara, CA 95051</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-3">
                  <a href={LETTER_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs hover:bg-blue-500/30 transition-colors">
                    <Download className="w-3.5 h-3.5" /> Download IRS 501(c)(3) Determination Letter
                  </a>
                  <a href="mailto:donations@embeddedos.org" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs hover:bg-white/10 transition-colors">
                    <Mail className="w-3.5 h-3.5" /> Contact for Verification
                  </a>
                </div>
              </div>
              <div className="p-6 rounded-2xl border border-white/10 bg-white/3">
                <h3 className="text-sm font-semibold text-white mb-4">Top Companies with Matching Gift Programs</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TOP_MATCHERS.map((c) => (
                    <div key={c.company} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                      <p className="text-xs font-semibold text-white">{c.company}</p>
                      <p className="text-xs text-orange-400 mt-0.5">{c.ratio} match</p>
                      <p className="text-xs text-white/40">up to {c.max}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-white/40 mt-3">Hundreds more companies offer matching. Check your HR portal or benefits platform to confirm eligibility.</p>
              </div>
            </div>
          )}

          {/* Wire transfer tab */}
          {activeTab === "wire" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Wire Transfer / ACH</h2>
                <p className="text-white/60">For donations of any size \u2014 including major gifts above $20,000. Wire transfers have no platform fee and no transaction limit.</p>
              </div>
              <div className="p-6 rounded-2xl border border-orange-500/20 bg-orange-500/5">
                <div className="flex items-center gap-2 mb-4">
                  <Banknote className="w-5 h-5 text-orange-400" />
                  <h3 className="text-sm font-semibold text-white">US Bank \u2014 Wire / ACH Instructions</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    { label: "Beneficiary Name", value: ACCOUNT_NAME, copy: false },
                    { label: "Bank Name", value: BANK_NAME, copy: false },
                    { label: "Account Type", value: ACCOUNT_TYPE, copy: false },
                    { label: "Account Number", value: ACCOUNT_NUMBER, copy: true },
                    { label: "Routing Number (ACH & Wire)", value: ROUTING_NUMBER, copy: true },
                    { label: "Bank Address", value: "US Bank, 800 Nicollet Mall, Minneapolis, MN 55402", copy: false },
                  ].map((row) => (
                    <div key={row.label}>
                      <p className="text-xs text-white/40 mb-0.5">{row.label}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium font-mono text-sm">{row.value}</p>
                        {row.copy && <CopyButton text={row.value} label="Copy" />}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-300">
                  <strong>Important:</strong> Please include your name and "EmbeddedOS Donation" in the wire memo/reference field, then email <a href="mailto:donations@embeddedos.org" className="underline">donations@embeddedos.org</a> to confirm your transfer so we can issue your tax receipt promptly.
                </div>
              </div>
              <div className="p-6 rounded-2xl border border-white/10 bg-white/3">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-blue-400" /> Tax Documentation</h3>
                <div className="space-y-2 text-sm text-white/60">
                  <p>EIN: <span className="text-white font-mono font-bold">{EIN}</span></p>
                  <p>All wire donations are fully tax-deductible under IRC Section 170. A written acknowledgment letter will be emailed within 3 business days of receipt.</p>
                  <p>For donations over $250, retain this acknowledgment for your tax records. For donations over $5,000, consult your tax advisor regarding qualified appraisal requirements.</p>
                </div>
                <a href={LETTER_URL} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300">
                  <Download className="w-3 h-3" /> Download IRS 501(c)(3) Determination Letter
                </a>
              </div>
              <div className="p-4 rounded-2xl border border-white/10 bg-white/3 text-center">
                <p className="text-xs text-white/50">For major gifts, planned giving, or corporate sponsorships, please contact us directly:</p>
                <a href="mailto:donations@embeddedos.org" className="text-orange-400 hover:text-orange-300 text-sm font-medium mt-1 flex items-center gap-1.5 justify-center">
                  <Mail className="w-4 h-4" /> donations@embeddedos.org
                </a>
              </div>
            </div>
          )}

          {/* Check / mail tab */}
          {activeTab === "check" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Donate by Check or Mail</h2>
                <p className="text-white/60">Make checks payable to the Foundation\u2019s legal name and mail to our address below. No transaction limit.</p>
              </div>
              <div className="p-6 rounded-2xl border border-white/10 bg-white/3">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-orange-400" /> Mailing Instructions</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-xs text-white/40 mb-1">Make check payable to:</p>
                    <p className="text-white font-semibold">{LEGAL_NAME}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">Mail to:</p>
                    <p className="text-white leading-relaxed">
                      Embedded Operating Systems Research Foundation<br />
                      C/O Srikanth Patchava<br />
                      2601 Cortez Dr Unit 1104<br />
                      Santa Clara, CA 95051
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">EIN (for your records):</p>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-mono font-bold">{EIN}</p>
                      <CopyButton text={EIN} label="Copy" />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
                    After mailing your check, please email <a href="mailto:donations@embeddedos.org" className="underline">donations@embeddedos.org</a> with your name and approximate amount so we can watch for it and issue your tax receipt promptly.
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-2xl border border-white/10 bg-white/3">
                <h3 className="text-sm font-semibold text-white mb-3">Corporate / Organization Checks</h3>
                <p className="text-sm text-white/60 mb-3">Organizations donating directly (not through employee matching) may make checks payable to the Foundation. For gifts above $20,000, wire transfer is recommended for faster processing and immediate tax acknowledgment.</p>
                <button onClick={() => setActiveTab("wire")} className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1">
                  View wire transfer instructions <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <a href={LETTER_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-orange-500/20 bg-orange-500/5 text-orange-300 hover:bg-orange-500/10 transition-colors text-sm">
                <Download className="w-4 h-4" /> Download IRS 501(c)(3) Determination Letter (PDF)
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Other ways to give */}
      <section className="py-20 bg-gradient-to-b from-[#050510] to-[#080820]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Other Ways to Support</h2>
          <p className="text-white/60 mb-12 max-w-2xl mx-auto">The Embedded Operating Systems Research Foundation is a 501(c)(3) nonprofit that develops and maintains free, open-source software for embedded systems, IoT, AI edge computing, aerospace, and healthcare devices.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Globe,     color: "#F97316", title: "Spread the Word",   desc: "Share our mission with engineers, students, and organizations in your network." },
              { icon: Cpu,       color: "#22D3EE", title: "Contribute Code",   desc: "Submit PRs, report issues, write docs, or mentor new contributors." },
              { icon: Building2, color: "#A78BFA", title: "Corporate Sponsor", desc: "Become a named sponsor with logo placement and recognition at events." },
            ].map((item) => (
              <Card key={item.title} className="bg-white/3 border-white/10">
                <CardContent className="p-5 text-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: item.color + "20", border: `1px solid ${item.color}40` }}>
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-xs text-white/50">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10"><Link href="/membership">Become a Member</Link></Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10"><Link href="/get-involved">Volunteer / Contribute</Link></Button>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10"><Link href="/sponsors">Corporate Sponsorship</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
