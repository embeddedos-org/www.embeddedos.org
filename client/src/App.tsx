import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EBot from "./components/EBot";
import SearchModal from "./components/SearchModal";
import DonateModal from "./components/DonateModal";
import Home from "./pages/Home";
import { lazy, Suspense } from "react";

// Lazy-load all pages for code splitting
const GettingStarted = lazy(() => import("./pages/GettingStarted"));
const Docs = lazy(() => import("./pages/Docs"));
const Books = lazy(() => import("./pages/Books"));
const Flow = lazy(() => import("./pages/Flow"));
const HardwareLab = lazy(() => import("./pages/HardwareLab"));
const Stacks = lazy(() => import("./pages/Stacks"));
const EApps = lazy(() => import("./pages/EApps"));
const Kids = lazy(() => import("./pages/Kids"));
const GetInvolved = lazy(() => import("./pages/GetInvolved"));
const Health = lazy(() => import("./pages/Health"));
const Aerospace = lazy(() => import("./pages/Aerospace"));
const Projects = lazy(() => import("./pages/Projects"));
const About = lazy(() => import("./pages/About"));
const Donate = lazy(() => import("./pages/Donate"));
const News = lazy(() => import("./pages/News"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Membership = lazy(() => import("./pages/Membership"));
const Demo = lazy(() => import("./pages/Demo"));
const HealthCompare = lazy(() => import("./pages/HealthCompare"));
const Products = lazy(() => import("./pages/Products"));
const EoS = lazy(() => import("./pages/EoS"));
const EBoot = lazy(() => import("./pages/EBoot"));
const EAI = lazy(() => import("./pages/EAI"));
const EOffice = lazy(() => import("./pages/EOffice"));
const EFlow = lazy(() => import("./pages/EFlow"));
const EBuildPage = lazy(() => import("./pages/EBuildPage"));
const ApiDocs = lazy(() => import("./pages/ApiDocs"));
const ERadar360 = lazy(() => import("./pages/ERadar360"));
const EHealth365 = lazy(() => import("./pages/EHealth365"));
const Careers = lazy(() => import("./pages/Careers"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const Security = lazy(() => import("./pages/Security"));
const Internship = lazy(() => import("./pages/Internship"));
const EcosystemPage = lazy(() => import("./pages/Ecosystem"));
const Research = lazy(() => import("./pages/Research"));
const Changelog = lazy(() => import("./pages/Changelog"));
const Partners = lazy(() => import("./pages/Partners"));
const Vision = lazy(() => import("./pages/Vision"));
const ContactPage = lazy(() => import("./pages/Contact"));
const Events = lazy(() => import("./pages/Events"));
const LicensesPage = lazy(() => import("./pages/Licenses"));
const CodeOfConduct = lazy(() => import("./pages/CodeOfConduct"));
const EDB = lazy(() => import("./pages/EDB"));
const ENIPage = lazy(() => import("./pages/ENI"));
const EoStudioPage = lazy(() => import("./pages/EoStudio"));
const Organization = lazy(() => import("./pages/Organization"));
const CommunityPage = lazy(() => import("./pages/Community"));
const EIPCPage = lazy(() => import("./pages/EIPC"));
const EoSimProductPage = lazy(() => import("./pages/EoSimProduct"));
const BuildingOSPage = lazy(() => import("./pages/BuildingOS"));
const AIOSPage = lazy(() => import("./pages/AIOS"));
const SponsorsPage = lazy(() => import("./pages/Sponsors"));
const CertificationPage = lazy(() => import("./pages/Certification"));
const FutureResearchPage = lazy(() => import("./pages/FutureResearch"));
const NeuralLinkAIPage = lazy(() => import("./pages/NeuralLinkAI"));
const FundraisingPage = lazy(() => import("./pages/Fundraising"));
const EBrowserPage = lazy(() => import("./pages/EBrowser"));
const EServiceAppsPage = lazy(() => import("./pages/EServiceApps"));
const EAIEdgePage = lazy(() => import("./pages/EAIEdge"));
const EOSuitePage = lazy(() => import("./pages/EOSuite"));
const EcosystemMapPage = lazy(() => import("./pages/EcosystemMap"));
const ResourcesPage = lazy(() => import("./pages/Resources"));
const ArticleEosPlatformLaunch = lazy(() => import("./pages/ArticleEosPlatformLaunch"));
const ArticleEaiLlmBench = lazy(() => import("./pages/ArticleEaiLlmBench"));
const ArticleEbootSecureBoot = lazy(() => import("./pages/ArticleEbootSecureBoot"));
const ArticleEdbEncryption = lazy(() => import("./pages/ArticleEdbEncryption"));
const ArticleEni1024Channel = lazy(() => import("./pages/ArticleEni1024Channel"));
const ArticleEosRoadmap2026 = lazy(() => import("./pages/ArticleEosRoadmap2026"));
const ArticleEosimHilBridge = lazy(() => import("./pages/ArticleEosimHilBridge"));
const ArticleFoundationMembership2026 = lazy(() => import("./pages/ArticleFoundationMembership2026"));
const Downloads = lazy(() => import("./pages/Downloads"));
const Patents = lazy(() => import("./pages/Patents"));
const ProductEoS = lazy(() => import("./pages/ProductEoS"));
const ProductEoSPlatform = lazy(() => import("./pages/ProductEoSPlatform"));
const ProductEBoot = lazy(() => import("./pages/ProductEBoot"));
const ProductEAI = lazy(() => import("./pages/ProductEAI"));
const ProductENI = lazy(() => import("./pages/ProductENI"));
const ProductEIPC = lazy(() => import("./pages/ProductEIPC"));
const ProductEDB = lazy(() => import("./pages/ProductEDB"));
const ProductEBuild = lazy(() => import("./pages/ProductEBuild"));
const ProductEoSim = lazy(() => import("./pages/ProductEoSim"));
const ProductEoStudio = lazy(() => import("./pages/ProductEoStudio"));
const ProductEOffice = lazy(() => import("./pages/ProductEOffice"));
const ProductEApps = lazy(() => import("./pages/ProductEApps"));
const ProductEServiceApps = lazy(() => import("./pages/ProductEServiceApps"));
const WhatWeDo = lazy(() => import("./pages/WhatWeDo"));
const EcadHardware = lazy(() => import("./pages/EcadHardware"));
const Architecture = lazy(() => import("./pages/Architecture"));
const Quantum = lazy(() => import("./pages/Quantum"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/getting-started">
        <Suspense fallback={<PageLoader />}><GettingStarted /></Suspense>
      </Route>
      <Route path="/docs">
        <Suspense fallback={<PageLoader />}><Docs /></Suspense>
      </Route>
      <Route path="/books">
        <Suspense fallback={<PageLoader />}><Books /></Suspense>
      </Route>
      <Route path="/flow">
        <Suspense fallback={<PageLoader />}><Flow /></Suspense>
      </Route>
      <Route path="/hardware-lab">
        <Suspense fallback={<PageLoader />}><HardwareLab /></Suspense>
      </Route>
      <Route path="/stacks">
        <Suspense fallback={<PageLoader />}><Stacks /></Suspense>
      </Route>
      <Route path="/eapps">
        <Suspense fallback={<PageLoader />}><EApps /></Suspense>
      </Route>
      <Route path="/kids">
        <Suspense fallback={<PageLoader />}><Kids /></Suspense>
      </Route>
      <Route path="/get-involved">
        <Suspense fallback={<PageLoader />}><GetInvolved /></Suspense>
      </Route>
      <Route path="/health">
        <Suspense fallback={<PageLoader />}><Health /></Suspense>
      </Route>
      <Route path="/aerospace">
        <Suspense fallback={<PageLoader />}><Aerospace /></Suspense>
      </Route>
      <Route path="/projects">
        <Suspense fallback={<PageLoader />}><Projects /></Suspense>
      </Route>
      <Route path="/about">
        <Suspense fallback={<PageLoader />}><About /></Suspense>
      </Route>
      <Route path="/donate">
        <Suspense fallback={<PageLoader />}><Donate /></Suspense>
      </Route>
      <Route path="/news">
        <Suspense fallback={<PageLoader />}><News /></Suspense>
      </Route>
      <Route path="/privacy">
        <Suspense fallback={<PageLoader />}><Privacy /></Suspense>
      </Route>
      <Route path="/terms">
        <Suspense fallback={<PageLoader />}><Terms /></Suspense>
      </Route>
      <Route path="/membership">
        <Suspense fallback={<PageLoader />}><Membership /></Suspense>
      </Route>
      <Route path="/demo">
        <Suspense fallback={<PageLoader />}><Demo /></Suspense>
      </Route>
      <Route path="/health-compare">
        <Suspense fallback={<PageLoader />}><HealthCompare /></Suspense>
      </Route>
      <Route path="/products">
        <Suspense fallback={<PageLoader />}><Products /></Suspense>
      </Route>
      <Route path="/eos">
        <Suspense fallback={<PageLoader />}><EoS /></Suspense>
      </Route>
      <Route path="/eboot">
        <Suspense fallback={<PageLoader />}><EBoot /></Suspense>
      </Route>
      <Route path="/eai">
        <Suspense fallback={<PageLoader />}><EAI /></Suspense>
      </Route>
      <Route path="/eoffice">
        <Suspense fallback={<PageLoader />}><EOffice /></Suspense>
      </Route>
      <Route path="/eflow">
        <Suspense fallback={<PageLoader />}><EFlow /></Suspense>
      </Route>
      <Route path="/ebuild">
        <Suspense fallback={<PageLoader />}><EBuildPage /></Suspense>
      </Route>
      <Route path="/api-docs">
        <Suspense fallback={<PageLoader />}><ApiDocs /></Suspense>
      </Route>
      <Route path="/eradar360">
        <Suspense fallback={<PageLoader />}><ERadar360 /></Suspense>
      </Route>
      <Route path="/ehealth365">
        <Suspense fallback={<PageLoader />}><EHealth365 /></Suspense>
      </Route>
      <Route path="/careers">
        <Suspense fallback={<PageLoader />}><Careers /></Suspense>
      </Route>
      <Route path="/faq">
        <Suspense fallback={<PageLoader />}><FAQ /></Suspense>
      </Route>
      <Route path="/roadmap">
        <Suspense fallback={<PageLoader />}><Roadmap /></Suspense>
      </Route>
      <Route path="/security">
        <Suspense fallback={<PageLoader />}><Security /></Suspense>
      </Route>
      <Route path="/internship">
        <Suspense fallback={<PageLoader />}><Internship /></Suspense>
      </Route>
      <Route path="/ecosystem">
        <Suspense fallback={<PageLoader />}><EcosystemPage /></Suspense>
      </Route>
      <Route path="/research">
        <Suspense fallback={<PageLoader />}><Research /></Suspense>
      </Route>
      <Route path="/changelog">
        <Suspense fallback={<PageLoader />}><Changelog /></Suspense>
      </Route>
      <Route path="/partners">
        <Suspense fallback={<PageLoader />}><Partners /></Suspense>
      </Route>
      <Route path="/vision">
        <Suspense fallback={<PageLoader />}><Vision /></Suspense>
      </Route>
      <Route path="/contact">
        <Suspense fallback={<PageLoader />}><ContactPage /></Suspense>
      </Route>
      <Route path="/events">
        <Suspense fallback={<PageLoader />}><Events /></Suspense>
      </Route>
      <Route path="/licenses">
        <Suspense fallback={<PageLoader />}><LicensesPage /></Suspense>
      </Route>
      <Route path="/code-of-conduct">
        <Suspense fallback={<PageLoader />}><CodeOfConduct /></Suspense>
      </Route>
      <Route path="/edb">
        <Suspense fallback={<PageLoader />}><EDB /></Suspense>
      </Route>
      <Route path="/eni">
        <Suspense fallback={<PageLoader />}><ENIPage /></Suspense>
      </Route>
      <Route path="/eostudio">
        <Suspense fallback={<PageLoader />}><EoStudioPage /></Suspense>
      </Route>
      <Route path="/organization">
        <Suspense fallback={<PageLoader />}><Organization /></Suspense>
      </Route>
      <Route path="/community">
        <Suspense fallback={<PageLoader />}><CommunityPage /></Suspense>
      </Route>
      <Route path="/eipc">
        <Suspense fallback={<PageLoader />}><EIPCPage /></Suspense>
      </Route>
      <Route path="/eosim">
        <Suspense fallback={<PageLoader />}><EoSimProductPage /></Suspense>
      </Route>
      <Route path="/building-os">
        <Suspense fallback={<PageLoader />}><BuildingOSPage /></Suspense>
      </Route>
      <Route path="/ai-os">
        <Suspense fallback={<PageLoader />}><AIOSPage /></Suspense>
      </Route>
      <Route path="/sponsors">
        <Suspense fallback={<PageLoader />}><SponsorsPage /></Suspense>
      </Route>
      <Route path="/certification">
        <Suspense fallback={<PageLoader />}><CertificationPage /></Suspense>
      </Route>
      <Route path="/future-research">
        <Suspense fallback={<PageLoader />}><FutureResearchPage /></Suspense>
      </Route>
      <Route path="/neural-link-ai">
        <Suspense fallback={<PageLoader />}><NeuralLinkAIPage /></Suspense>
      </Route>
      <Route path="/fundraising">
        <Suspense fallback={<PageLoader />}><FundraisingPage /></Suspense>
      </Route>
      <Route path="/ebrowser">
        <Suspense fallback={<PageLoader />}><EBrowserPage /></Suspense>
      </Route>
      <Route path="/eserviceapps">
        <Suspense fallback={<PageLoader />}><EServiceAppsPage /></Suspense>
      </Route>
      <Route path="/eai-edge">
        <Suspense fallback={<PageLoader />}><EAIEdgePage /></Suspense>
      </Route>
      <Route path="/eosuite">
        <Suspense fallback={<PageLoader />}><EOSuitePage /></Suspense>
      </Route>
      <Route path="/ecosystem-map">
        <Suspense fallback={<PageLoader />}><EcosystemMapPage /></Suspense>
      </Route>
      <Route path="/resources">
        <Suspense fallback={<PageLoader />}><ResourcesPage /></Suspense>
      </Route>
      <Route path="/article-eos-platform-launch">
        <Suspense fallback={<PageLoader />}><ArticleEosPlatformLaunch /></Suspense>
      </Route>
      <Route path="/article-eai-llm-bench">
        <Suspense fallback={<PageLoader />}><ArticleEaiLlmBench /></Suspense>
      </Route>
      <Route path="/article-eboot-secure-boot-deepdive">
        <Suspense fallback={<PageLoader />}><ArticleEbootSecureBoot /></Suspense>
      </Route>
      <Route path="/article-edb-encryption-at-rest">
        <Suspense fallback={<PageLoader />}><ArticleEdbEncryption /></Suspense>
      </Route>
      <Route path="/article-eni-1024-channel-pipeline">
        <Suspense fallback={<PageLoader />}><ArticleEni1024Channel /></Suspense>
      </Route>
      <Route path="/article-eos-roadmap-2026">
        <Suspense fallback={<PageLoader />}><ArticleEosRoadmap2026 /></Suspense>
      </Route>
      <Route path="/article-eosim-hil-bridge">
        <Suspense fallback={<PageLoader />}><ArticleEosimHilBridge /></Suspense>
      </Route>
      <Route path="/article-foundation-membership-2026">
        <Suspense fallback={<PageLoader />}><ArticleFoundationMembership2026 /></Suspense>
      </Route>
      <Route path="/downloads">
        <Suspense fallback={<PageLoader />}><Downloads /></Suspense>
      </Route>
      <Route path="/patents">
        <Suspense fallback={<PageLoader />}><Patents /></Suspense>
      </Route>
      <Route path="/product-eos">
        <Suspense fallback={<PageLoader />}><ProductEoS /></Suspense>
      </Route>
      <Route path="/product-eos-platform">
        <Suspense fallback={<PageLoader />}><ProductEoSPlatform /></Suspense>
      </Route>
      <Route path="/product-eboot">
        <Suspense fallback={<PageLoader />}><ProductEBoot /></Suspense>
      </Route>
      <Route path="/product-eai">
        <Suspense fallback={<PageLoader />}><ProductEAI /></Suspense>
      </Route>
      <Route path="/product-eni">
        <Suspense fallback={<PageLoader />}><ProductENI /></Suspense>
      </Route>
      <Route path="/product-eipc">
        <Suspense fallback={<PageLoader />}><ProductEIPC /></Suspense>
      </Route>
      <Route path="/product-edb">
        <Suspense fallback={<PageLoader />}><ProductEDB /></Suspense>
      </Route>
      <Route path="/product-ebuild">
        <Suspense fallback={<PageLoader />}><ProductEBuild /></Suspense>
      </Route>
      <Route path="/product-eosim">
        <Suspense fallback={<PageLoader />}><ProductEoSim /></Suspense>
      </Route>
      <Route path="/product-eostudio">
        <Suspense fallback={<PageLoader />}><ProductEoStudio /></Suspense>
      </Route>
      <Route path="/product-eoffice">
        <Suspense fallback={<PageLoader />}><ProductEOffice /></Suspense>
      </Route>
      <Route path="/product-eapps">
        <Suspense fallback={<PageLoader />}><ProductEApps /></Suspense>
      </Route>
      <Route path="/product-eserviceapps">
        <Suspense fallback={<PageLoader />}><ProductEServiceApps /></Suspense>
      </Route>
      <Route path="/what-we-do">
        <Suspense fallback={<PageLoader />}><WhatWeDo /></Suspense>
      </Route>
      <Route path="/ecad-hardware">
        <Suspense fallback={<PageLoader />}><EcadHardware /></Suspense>
      </Route>
      <Route path="/architecture">
        <Suspense fallback={<PageLoader />}><Architecture /></Suspense>
      </Route>
      <Route path="/quantum">
        <Suspense fallback={<PageLoader />}><Quantum /></Suspense>
      </Route>
      <Route path="/404" component={NotFound} />
      {/* Final fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <SearchModal />
          <DonateModal />
          <Navbar />
          <main id="main-content">
            <Router />
          </main>
          <Footer />
          <EBot />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
