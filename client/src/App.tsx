import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import EBot from "./components/EBot";
import SearchModal from "./components/SearchModal";
import DonateModal from "./components/DonateModal";
import Home from "./pages/Home";
import { lazy, Suspense, useEffect, useRef, type ComponentType } from "react";
import { applyRouteMeta, readHeading } from "./lib/page-meta";

// Lazy-load all pages for code splitting
// --- Route preloading -------------------------------------------------------
// Every route below "/" is code-split. `pnpm prerender` writes real HTML for all
// 92 routes, but React cannot keep that markup across a suspend: the prerenderer
// snapshots a live browser, so the HTML carries none of the Suspense boundary
// markers that hydration needs to recognise a server-rendered boundary. React
// therefore swaps in <PageLoader /> until the chunk arrives — ~300ms of blank
// <main> on every lazy route.
//
// Registering each loader against its route path lets the entry point await the
// matching chunk *before* handing the DOM to React, so the prerendered markup
// stays on screen until the real page is ready to replace it in one step.
//
// The path passed here must match the Route path literal below; the
// route-preload sync test in tests/unit asserts that for every route.
// (Do not write an angle-bracket Route path literal in this comment —
//  scripts/prerender.mjs discovers routes by regex and would scrape it.)
const pageLoaders: Record<string, () => Promise<unknown>> = {};
const preloaded = new Map<string, ComponentType>();

// Route components are rendered without props, so the wrapper forwards none.
function lazyPage(
  path: string,
  loader: () => Promise<{ default: ComponentType }>
) {
  pageLoaders[path] = loader;
  const Lazy = lazy(loader);

  // Awaiting the chunk is not enough on its own: React.lazy resolves through a
  // promise, so it suspends for at least one tick even when the module is
  // already in the registry — long enough for Suspense to swap the prerendered
  // markup for <PageLoader />. When the entry point has already resolved this
  // route, render the real component synchronously and skip Suspense entirely.
  return function PreloadedPage() {
    const Ready = preloaded.get(path);
    return Ready ? <Ready /> : <Lazy />;
  };
}

/**
 * Load the chunk backing `pathname` and record its component so the first
 * render can mount it synchronously.
 */
export async function preloadRoute(pathname: string): Promise<void> {
  const key = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const loader = pageLoaders[key];
  if (!loader) return;
  try {
    const mod = (await loader()) as { default: ComponentType };
    preloaded.set(key, mod.default);
  } catch {
    // A failed chunk must not block startup. Falling through leaves the route
    // on its lazy path, where the error boundary reports it normally.
  }
}

/** Every code-split route path. Exported for the sync test. */
export const codeSplitRoutes = (): string[] => Object.keys(pageLoaders);

const GettingStarted = lazyPage(
  "/getting-started",
  () => import("./pages/GettingStarted")
);
const Docs = lazyPage("/docs", () => import("./pages/Docs"));
const Books = lazyPage("/books", () => import("./pages/Books"));
const Flow = lazyPage("/flow", () => import("./pages/Flow"));
const HardwareLab = lazyPage(
  "/hardware-lab",
  () => import("./pages/HardwareLab")
);
const Stacks = lazyPage("/stacks", () => import("./pages/Stacks"));
const EApps = lazyPage("/eapps", () => import("./pages/EApps"));
const Kids = lazyPage("/kids", () => import("./pages/Kids"));
const GetInvolved = lazyPage(
  "/get-involved",
  () => import("./pages/GetInvolved")
);
const Health = lazyPage("/health", () => import("./pages/Health"));
const Aerospace = lazyPage("/aerospace", () => import("./pages/Aerospace"));
const Projects = lazyPage("/projects", () => import("./pages/Projects"));
const About = lazyPage("/about", () => import("./pages/About"));
const Mission = lazyPage("/mission", () => import("./pages/Mission"));
const Transparency = lazyPage(
  "/transparency",
  () => import("./pages/Transparency")
);
const Industries = lazyPage("/industries", () => import("./pages/Industries"));
const Donate = lazyPage("/donate", () => import("./pages/Donate"));
const News = lazyPage("/news", () => import("./pages/News"));
const Privacy = lazyPage("/privacy", () => import("./pages/Privacy"));
const Terms = lazyPage("/terms", () => import("./pages/Terms"));
const Membership = lazyPage("/membership", () => import("./pages/Membership"));
const Demo = lazyPage("/demo", () => import("./pages/Demo"));
const HealthCompare = lazyPage(
  "/health-compare",
  () => import("./pages/HealthCompare")
);
const Products = lazyPage("/products", () => import("./pages/Products"));
const EoS = lazyPage("/eos", () => import("./pages/EoS"));
const EBoot = lazyPage("/eboot", () => import("./pages/EBoot"));
const EAI = lazyPage("/eai", () => import("./pages/EAI"));
const EOffice = lazyPage("/eoffice", () => import("./pages/EOffice"));
const EFlow = lazyPage("/eflow", () => import("./pages/EFlow"));
const EBuildPage = lazyPage("/ebuild", () => import("./pages/EBuildPage"));
const ApiDocs = lazyPage("/api-docs", () => import("./pages/ApiDocs"));
const ERadar360 = lazyPage("/eradar360", () => import("./pages/ERadar360"));
const EHealth365 = lazyPage("/ehealth365", () => import("./pages/EHealth365"));
const Careers = lazyPage("/careers", () => import("./pages/Careers"));
const FAQ = lazyPage("/faq", () => import("./pages/FAQ"));
const Roadmap = lazyPage("/roadmap", () => import("./pages/Roadmap"));
const Security = lazyPage("/security", () => import("./pages/Security"));
const Internship = lazyPage("/internship", () => import("./pages/Internship"));
const EcosystemPage = lazyPage("/ecosystem", () => import("./pages/Ecosystem"));
const Research = lazyPage("/research", () => import("./pages/Research"));
const Changelog = lazyPage("/changelog", () => import("./pages/Changelog"));
const Partners = lazyPage("/partners", () => import("./pages/Partners"));
const Vision = lazyPage("/vision", () => import("./pages/Vision"));
const ContactPage = lazyPage("/contact", () => import("./pages/Contact"));
const Events = lazyPage("/events", () => import("./pages/Events"));
const LicensesPage = lazyPage("/licenses", () => import("./pages/Licenses"));
const CodeOfConduct = lazyPage(
  "/code-of-conduct",
  () => import("./pages/CodeOfConduct")
);
const EDB = lazyPage("/edb", () => import("./pages/EDB"));
const ENIPage = lazyPage("/eni", () => import("./pages/ENI"));
const EoStudioPage = lazyPage("/eostudio", () => import("./pages/EoStudio"));
const Organization = lazyPage(
  "/organization",
  () => import("./pages/Organization")
);
const CommunityPage = lazyPage("/community", () => import("./pages/Community"));
const EIPCPage = lazyPage("/eipc", () => import("./pages/EIPC"));
const EoSimProductPage = lazyPage(
  "/eosim",
  () => import("./pages/EoSimProduct")
);
const BuildingOSPage = lazyPage(
  "/building-os",
  () => import("./pages/BuildingOS")
);
const AIOSPage = lazyPage("/ai-os", () => import("./pages/AIOS"));
const SponsorsPage = lazyPage("/sponsors", () => import("./pages/Sponsors"));
const CertificationPage = lazyPage(
  "/certification",
  () => import("./pages/Certification")
);
const FutureResearchPage = lazyPage(
  "/future-research",
  () => import("./pages/FutureResearch")
);
const NeuralLinkAIPage = lazyPage(
  "/neural-link-ai",
  () => import("./pages/NeuralLinkAI")
);
const FundraisingPage = lazyPage(
  "/fundraising",
  () => import("./pages/Fundraising")
);
const EBrowserPage = lazyPage("/ebrowser", () => import("./pages/EBrowser"));
const EServiceAppsPage = lazyPage(
  "/eserviceapps",
  () => import("./pages/EServiceApps")
);
const EAIEdgePage = lazyPage("/eai-edge", () => import("./pages/EAIEdge"));
const EOSuitePage = lazyPage("/eosuite", () => import("./pages/EOSuite"));
const ResourcesPage = lazyPage("/resources", () => import("./pages/Resources"));
const ArticleEosPlatformLaunch = lazyPage(
  "/article-eos-platform-launch",
  () => import("./pages/ArticleEosPlatformLaunch")
);
const ArticleEaiLlmBench = lazyPage(
  "/article-eai-llm-bench",
  () => import("./pages/ArticleEaiLlmBench")
);
const ArticleEbootSecureBoot = lazyPage(
  "/article-eboot-secure-boot-deepdive",
  () => import("./pages/ArticleEbootSecureBoot")
);
const ArticleEdbEncryption = lazyPage(
  "/article-edb-encryption-at-rest",
  () => import("./pages/ArticleEdbEncryption")
);
const ArticleEni1024Channel = lazyPage(
  "/article-eni-1024-channel-pipeline",
  () => import("./pages/ArticleEni1024Channel")
);
const ArticleEosRoadmap2026 = lazyPage(
  "/article-eos-roadmap-2026",
  () => import("./pages/ArticleEosRoadmap2026")
);
const ArticleEosimHilBridge = lazyPage(
  "/article-eosim-hil-bridge",
  () => import("./pages/ArticleEosimHilBridge")
);
const ArticleFoundationMembership2026 = lazyPage(
  "/article-foundation-membership-2026",
  () => import("./pages/ArticleFoundationMembership2026")
);
const Downloads = lazyPage("/downloads", () => import("./pages/Downloads"));
const Patents = lazyPage("/patents", () => import("./pages/Patents"));
const ProductEoS = lazyPage("/product-eos", () => import("./pages/ProductEoS"));
const ProductEoSPlatform = lazyPage(
  "/product-eos-platform",
  () => import("./pages/ProductEoSPlatform")
);
const ProductEBoot = lazyPage(
  "/product-eboot",
  () => import("./pages/ProductEBoot")
);
const ProductEAI = lazyPage("/product-eai", () => import("./pages/ProductEAI"));
const ProductENI = lazyPage("/product-eni", () => import("./pages/ProductENI"));
const ProductEIPC = lazyPage(
  "/product-eipc",
  () => import("./pages/ProductEIPC")
);
const ProductEDB = lazyPage("/product-edb", () => import("./pages/ProductEDB"));
const ProductEBuild = lazyPage(
  "/product-ebuild",
  () => import("./pages/ProductEBuild")
);
const ProductEoSim = lazyPage(
  "/product-eosim",
  () => import("./pages/ProductEoSim")
);
const ProductEoStudio = lazyPage(
  "/product-eostudio",
  () => import("./pages/ProductEoStudio")
);
const ProductEOffice = lazyPage(
  "/product-eoffice",
  () => import("./pages/ProductEOffice")
);
const ProductEApps = lazyPage(
  "/product-eapps",
  () => import("./pages/ProductEApps")
);
const ProductEServiceApps = lazyPage(
  "/product-eserviceapps",
  () => import("./pages/ProductEServiceApps")
);
const WhatWeDo = lazyPage("/what-we-do", () => import("./pages/WhatWeDo"));
const EcadHardware = lazyPage(
  "/ecad-hardware",
  () => import("./pages/EcadHardware")
);
const Architecture = lazyPage(
  "/architecture",
  () => import("./pages/Architecture")
);
const Quantum = lazyPage("/quantum", () => import("./pages/Quantum"));

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
        <Suspense fallback={<PageLoader />}>
          <GettingStarted />
        </Suspense>
      </Route>
      <Route path="/docs">
        <Suspense fallback={<PageLoader />}>
          <Docs />
        </Suspense>
      </Route>
      <Route path="/books">
        <Suspense fallback={<PageLoader />}>
          <Books />
        </Suspense>
      </Route>
      <Route path="/flow">
        <Suspense fallback={<PageLoader />}>
          <Flow />
        </Suspense>
      </Route>
      <Route path="/hardware-lab">
        <Suspense fallback={<PageLoader />}>
          <HardwareLab />
        </Suspense>
      </Route>
      <Route path="/stacks">
        <Suspense fallback={<PageLoader />}>
          <Stacks />
        </Suspense>
      </Route>
      <Route path="/eapps">
        <Suspense fallback={<PageLoader />}>
          <EApps />
        </Suspense>
      </Route>
      <Route path="/kids">
        <Suspense fallback={<PageLoader />}>
          <Kids />
        </Suspense>
      </Route>
      <Route path="/get-involved">
        <Suspense fallback={<PageLoader />}>
          <GetInvolved />
        </Suspense>
      </Route>
      <Route path="/health">
        <Suspense fallback={<PageLoader />}>
          <Health />
        </Suspense>
      </Route>
      <Route path="/aerospace">
        <Suspense fallback={<PageLoader />}>
          <Aerospace />
        </Suspense>
      </Route>
      <Route path="/projects">
        <Suspense fallback={<PageLoader />}>
          <Projects />
        </Suspense>
      </Route>
      <Route path="/about">
        <Suspense fallback={<PageLoader />}>
          <About />
        </Suspense>
      </Route>
      <Route path="/mission">
        <Suspense fallback={<PageLoader />}>
          <Mission />
        </Suspense>
      </Route>
      <Route path="/transparency">
        <Suspense fallback={<PageLoader />}>
          <Transparency />
        </Suspense>
      </Route>
      <Route path="/industries">
        <Suspense fallback={<PageLoader />}>
          <Industries />
        </Suspense>
      </Route>
      <Route path="/donate">
        <Suspense fallback={<PageLoader />}>
          <Donate />
        </Suspense>
      </Route>
      <Route path="/news">
        <Suspense fallback={<PageLoader />}>
          <News />
        </Suspense>
      </Route>
      <Route path="/privacy">
        <Suspense fallback={<PageLoader />}>
          <Privacy />
        </Suspense>
      </Route>
      <Route path="/terms">
        <Suspense fallback={<PageLoader />}>
          <Terms />
        </Suspense>
      </Route>
      <Route path="/membership">
        <Suspense fallback={<PageLoader />}>
          <Membership />
        </Suspense>
      </Route>
      <Route path="/demo">
        <Suspense fallback={<PageLoader />}>
          <Demo />
        </Suspense>
      </Route>
      <Route path="/health-compare">
        <Suspense fallback={<PageLoader />}>
          <HealthCompare />
        </Suspense>
      </Route>
      <Route path="/products">
        <Suspense fallback={<PageLoader />}>
          <Products />
        </Suspense>
      </Route>
      <Route path="/eos">
        <Suspense fallback={<PageLoader />}>
          <EoS />
        </Suspense>
      </Route>
      <Route path="/eboot">
        <Suspense fallback={<PageLoader />}>
          <EBoot />
        </Suspense>
      </Route>
      <Route path="/eai">
        <Suspense fallback={<PageLoader />}>
          <EAI />
        </Suspense>
      </Route>
      <Route path="/eoffice">
        <Suspense fallback={<PageLoader />}>
          <EOffice />
        </Suspense>
      </Route>
      <Route path="/eflow">
        <Suspense fallback={<PageLoader />}>
          <EFlow />
        </Suspense>
      </Route>
      <Route path="/ebuild">
        <Suspense fallback={<PageLoader />}>
          <EBuildPage />
        </Suspense>
      </Route>
      <Route path="/api-docs">
        <Suspense fallback={<PageLoader />}>
          <ApiDocs />
        </Suspense>
      </Route>
      <Route path="/eradar360">
        <Suspense fallback={<PageLoader />}>
          <ERadar360 />
        </Suspense>
      </Route>
      <Route path="/ehealth365">
        <Suspense fallback={<PageLoader />}>
          <EHealth365 />
        </Suspense>
      </Route>
      <Route path="/careers">
        <Suspense fallback={<PageLoader />}>
          <Careers />
        </Suspense>
      </Route>
      <Route path="/faq">
        <Suspense fallback={<PageLoader />}>
          <FAQ />
        </Suspense>
      </Route>
      <Route path="/roadmap">
        <Suspense fallback={<PageLoader />}>
          <Roadmap />
        </Suspense>
      </Route>
      <Route path="/security">
        <Suspense fallback={<PageLoader />}>
          <Security />
        </Suspense>
      </Route>
      <Route path="/internship">
        <Suspense fallback={<PageLoader />}>
          <Internship />
        </Suspense>
      </Route>
      <Route path="/ecosystem">
        <Suspense fallback={<PageLoader />}>
          <EcosystemPage />
        </Suspense>
      </Route>
      <Route path="/research">
        <Suspense fallback={<PageLoader />}>
          <Research />
        </Suspense>
      </Route>
      <Route path="/changelog">
        <Suspense fallback={<PageLoader />}>
          <Changelog />
        </Suspense>
      </Route>
      <Route path="/partners">
        <Suspense fallback={<PageLoader />}>
          <Partners />
        </Suspense>
      </Route>
      <Route path="/vision">
        <Suspense fallback={<PageLoader />}>
          <Vision />
        </Suspense>
      </Route>
      <Route path="/contact">
        <Suspense fallback={<PageLoader />}>
          <ContactPage />
        </Suspense>
      </Route>
      <Route path="/events">
        <Suspense fallback={<PageLoader />}>
          <Events />
        </Suspense>
      </Route>
      <Route path="/licenses">
        <Suspense fallback={<PageLoader />}>
          <LicensesPage />
        </Suspense>
      </Route>
      <Route path="/code-of-conduct">
        <Suspense fallback={<PageLoader />}>
          <CodeOfConduct />
        </Suspense>
      </Route>
      <Route path="/edb">
        <Suspense fallback={<PageLoader />}>
          <EDB />
        </Suspense>
      </Route>
      <Route path="/eni">
        <Suspense fallback={<PageLoader />}>
          <ENIPage />
        </Suspense>
      </Route>
      <Route path="/eostudio">
        <Suspense fallback={<PageLoader />}>
          <EoStudioPage />
        </Suspense>
      </Route>
      <Route path="/organization">
        <Suspense fallback={<PageLoader />}>
          <Organization />
        </Suspense>
      </Route>
      <Route path="/community">
        <Suspense fallback={<PageLoader />}>
          <CommunityPage />
        </Suspense>
      </Route>
      <Route path="/eipc">
        <Suspense fallback={<PageLoader />}>
          <EIPCPage />
        </Suspense>
      </Route>
      <Route path="/eosim">
        <Suspense fallback={<PageLoader />}>
          <EoSimProductPage />
        </Suspense>
      </Route>
      <Route path="/building-os">
        <Suspense fallback={<PageLoader />}>
          <BuildingOSPage />
        </Suspense>
      </Route>
      <Route path="/ai-os">
        <Suspense fallback={<PageLoader />}>
          <AIOSPage />
        </Suspense>
      </Route>
      <Route path="/sponsors">
        <Suspense fallback={<PageLoader />}>
          <SponsorsPage />
        </Suspense>
      </Route>
      <Route path="/certification">
        <Suspense fallback={<PageLoader />}>
          <CertificationPage />
        </Suspense>
      </Route>
      <Route path="/future-research">
        <Suspense fallback={<PageLoader />}>
          <FutureResearchPage />
        </Suspense>
      </Route>
      <Route path="/neural-link-ai">
        <Suspense fallback={<PageLoader />}>
          <NeuralLinkAIPage />
        </Suspense>
      </Route>
      <Route path="/fundraising">
        <Suspense fallback={<PageLoader />}>
          <FundraisingPage />
        </Suspense>
      </Route>
      <Route path="/ebrowser">
        <Suspense fallback={<PageLoader />}>
          <EBrowserPage />
        </Suspense>
      </Route>
      <Route path="/eserviceapps">
        <Suspense fallback={<PageLoader />}>
          <EServiceAppsPage />
        </Suspense>
      </Route>
      <Route path="/eai-edge">
        <Suspense fallback={<PageLoader />}>
          <EAIEdgePage />
        </Suspense>
      </Route>
      <Route path="/eosuite">
        <Suspense fallback={<PageLoader />}>
          <EOSuitePage />
        </Suspense>
      </Route>
      <Route path="/resources">
        <Suspense fallback={<PageLoader />}>
          <ResourcesPage />
        </Suspense>
      </Route>
      <Route path="/article-eos-platform-launch">
        <Suspense fallback={<PageLoader />}>
          <ArticleEosPlatformLaunch />
        </Suspense>
      </Route>
      <Route path="/article-eai-llm-bench">
        <Suspense fallback={<PageLoader />}>
          <ArticleEaiLlmBench />
        </Suspense>
      </Route>
      <Route path="/article-eboot-secure-boot-deepdive">
        <Suspense fallback={<PageLoader />}>
          <ArticleEbootSecureBoot />
        </Suspense>
      </Route>
      <Route path="/article-edb-encryption-at-rest">
        <Suspense fallback={<PageLoader />}>
          <ArticleEdbEncryption />
        </Suspense>
      </Route>
      <Route path="/article-eni-1024-channel-pipeline">
        <Suspense fallback={<PageLoader />}>
          <ArticleEni1024Channel />
        </Suspense>
      </Route>
      <Route path="/article-eos-roadmap-2026">
        <Suspense fallback={<PageLoader />}>
          <ArticleEosRoadmap2026 />
        </Suspense>
      </Route>
      <Route path="/article-eosim-hil-bridge">
        <Suspense fallback={<PageLoader />}>
          <ArticleEosimHilBridge />
        </Suspense>
      </Route>
      <Route path="/article-foundation-membership-2026">
        <Suspense fallback={<PageLoader />}>
          <ArticleFoundationMembership2026 />
        </Suspense>
      </Route>
      <Route path="/downloads">
        <Suspense fallback={<PageLoader />}>
          <Downloads />
        </Suspense>
      </Route>
      <Route path="/patents">
        <Suspense fallback={<PageLoader />}>
          <Patents />
        </Suspense>
      </Route>
      <Route path="/product-eos">
        <Suspense fallback={<PageLoader />}>
          <ProductEoS />
        </Suspense>
      </Route>
      <Route path="/product-eos-platform">
        <Suspense fallback={<PageLoader />}>
          <ProductEoSPlatform />
        </Suspense>
      </Route>
      <Route path="/product-eboot">
        <Suspense fallback={<PageLoader />}>
          <ProductEBoot />
        </Suspense>
      </Route>
      <Route path="/product-eai">
        <Suspense fallback={<PageLoader />}>
          <ProductEAI />
        </Suspense>
      </Route>
      <Route path="/product-eni">
        <Suspense fallback={<PageLoader />}>
          <ProductENI />
        </Suspense>
      </Route>
      <Route path="/product-eipc">
        <Suspense fallback={<PageLoader />}>
          <ProductEIPC />
        </Suspense>
      </Route>
      <Route path="/product-edb">
        <Suspense fallback={<PageLoader />}>
          <ProductEDB />
        </Suspense>
      </Route>
      <Route path="/product-ebuild">
        <Suspense fallback={<PageLoader />}>
          <ProductEBuild />
        </Suspense>
      </Route>
      <Route path="/product-eosim">
        <Suspense fallback={<PageLoader />}>
          <ProductEoSim />
        </Suspense>
      </Route>
      <Route path="/product-eostudio">
        <Suspense fallback={<PageLoader />}>
          <ProductEoStudio />
        </Suspense>
      </Route>
      <Route path="/product-eoffice">
        <Suspense fallback={<PageLoader />}>
          <ProductEOffice />
        </Suspense>
      </Route>
      <Route path="/product-eapps">
        <Suspense fallback={<PageLoader />}>
          <ProductEApps />
        </Suspense>
      </Route>
      <Route path="/product-eserviceapps">
        <Suspense fallback={<PageLoader />}>
          <ProductEServiceApps />
        </Suspense>
      </Route>
      <Route path="/what-we-do">
        <Suspense fallback={<PageLoader />}>
          <WhatWeDo />
        </Suspense>
      </Route>
      <Route path="/ecad-hardware">
        <Suspense fallback={<PageLoader />}>
          <EcadHardware />
        </Suspense>
      </Route>
      <Route path="/architecture">
        <Suspense fallback={<PageLoader />}>
          <Architecture />
        </Suspense>
      </Route>
      <Route path="/quantum">
        <Suspense fallback={<PageLoader />}>
          <Quantum />
        </Suspense>
      </Route>
      <Route path="/404" component={NotFound} />
      {/* Final fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Keeps <head> describing the page actually on screen.
 *
 * The landing route is skipped: its prerendered snapshot is already correct,
 * and rewriting it from the hydrated DOM would only risk disagreeing with what
 * the crawler was served.
 */
function RouteMeta() {
  const [location] = useLocation();
  const isLanding = useRef(true);
  const stampedHeading = useRef<string | null>(null);

  useEffect(() => {
    if (isLanding.current) {
      isLanding.current = false;
      stampedHeading.current = readHeading();
      return;
    }

    // React still has the outgoing page on screen when this effect runs, and a
    // lazy route renders a Suspense fallback before its own <h1> exists.
    // Waiting for the heading to *change* is what distinguishes "the new page
    // is up" from "the old page has not gone yet" — testing only that some
    // heading exists stamps the route we just left.
    //
    // Two routes may legitimately share a heading. Those fall through to the
    // frame cap and stamp the identical title a beat later, which is correct,
    // just not immediate.
    let cancelled = false;
    let frames = 0;
    const stamp = () => {
      if (cancelled) return;
      const heading = readHeading();
      if ((heading && heading !== stampedHeading.current) || frames++ > 90) {
        applyRouteMeta(location);
        stampedHeading.current = heading;
        return;
      }
      requestAnimationFrame(stamp);
    };
    stamp();

    return () => {
      cancelled = true;
    };
  }, [location]);

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <RouteMeta />
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
