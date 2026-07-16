import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, FileText, Github, ArrowRight, Cpu, Heart, Plane, Code, Package, BookOpen, Layers, Users, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const PAGE_ICONS: Record<string, React.ReactNode> = {
  "/": <Cpu className="w-4 h-4" />,
  "/getting-started": <Zap className="w-4 h-4" />,
  "/docs": <FileText className="w-4 h-4" />,
  "/books": <BookOpen className="w-4 h-4" />,
  "/flow": <Code className="w-4 h-4" />,
  "/hardware-lab": <Cpu className="w-4 h-4" />,
  "/stacks": <Layers className="w-4 h-4" />,
  "/eapps": <Package className="w-4 h-4" />,
  "/kids": <BookOpen className="w-4 h-4" />,
  "/get-involved": <Users className="w-4 h-4" />,
  "/projects": <Github className="w-4 h-4" />,
  "/health": <Heart className="w-4 h-4" />,
  "/aerospace": <Plane className="w-4 h-4" />,
};

interface SearchResult {
  title: string;
  path: string;
  type: "page" | "repo";
  score: number;
  tags: string[];
}

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, navigate] = useLocation();

  // Keyboard shortcut
  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const customHandler = () => setOpen(o => !o);
    window.addEventListener("keydown", keyHandler);
    window.addEventListener("open-search", customHandler);
    return () => {
      window.removeEventListener("keydown", keyHandler);
      window.removeEventListener("open-search", customHandler);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const searchQuery = trpc.search.query.useQuery(
    { q: query },
    { enabled: query.length >= 2 }
  );

  const allResults: SearchResult[] = query.length >= 2
    ? [
        ...(searchQuery.data?.pages ?? []),
        ...(searchQuery.data?.repos ?? []),
      ]
    : [];

  // Default items when no query
  const DEFAULT_ITEMS = [
    { title: "Getting Started", path: "/getting-started", type: "page" as const, score: 1, tags: [] },
    { title: "Hardware Lab", path: "/hardware-lab", type: "page" as const, score: 1, tags: [] },
    { title: "Health Devices", path: "/health", type: "page" as const, score: 1, tags: [] },
    { title: "Aerospace", path: "/aerospace", type: "page" as const, score: 1, tags: [] },
    { title: "All Projects", path: "/projects", type: "page" as const, score: 1, tags: [] },
    { title: "eApps Store", path: "/eapps", type: "page" as const, score: 1, tags: [] },
  ];

  const items = query.length >= 2 ? allResults : DEFAULT_ITEMS;

  const handleSelect = useCallback((item: SearchResult) => {
    setOpen(false);
    if (item.type === "repo") {
      window.open(item.path, "_blank");
    } else {
      navigate(item.path);
    }
  }, [navigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, items.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && items[selected]) { handleSelect(items[selected]); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, items, selected, handleSelect]);

  useEffect(() => { setSelected(0); }, [query]);

  return (
    <>
      {/* Trigger button in navbar (exposed via event) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="w-full max-w-xl bg-[#0d1424] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
                <Search className="w-5 h-5 text-white/40 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search pages, projects, hardware…"
                  className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-sm"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="text-white/40 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-white/10 text-white/30 text-xs font-mono">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="py-2 max-h-80 overflow-y-auto">
                {query.length > 0 && query.length < 2 && (
                  <p className="px-4 py-3 text-sm text-white/40">Keep typing to search…</p>
                )}

                {query.length >= 2 && searchQuery.isLoading && (
                  <div className="px-4 py-6 text-center text-white/40 text-sm">Searching…</div>
                )}

                {query.length >= 2 && !searchQuery.isLoading && items.length === 0 && (
                  <div className="px-4 py-6 text-center">
                    <p className="text-white/40 text-sm">No results for "{query}"</p>
                    <p className="text-white/20 text-xs mt-1">Try "health", "boards", "aerospace", or "ai"</p>
                  </div>
                )}

                {items.length > 0 && (
                  <>
                    {query.length < 2 && (
                      <p className="px-4 py-1.5 text-xs text-white/30 uppercase tracking-wider font-medium">Quick Navigation</p>
                    )}
                    {query.length >= 2 && searchQuery.data?.pages && searchQuery.data.pages.length > 0 && (
                      <p className="px-4 py-1.5 text-xs text-white/30 uppercase tracking-wider font-medium">Pages</p>
                    )}
                    {items.filter(i => i.type === "page").map((item, idx) => (
                      <button
                        key={item.path}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelected(idx)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          selected === idx ? "bg-[#F97316]/10 text-white" : "text-white/70 hover:bg-white/5"
                        }`}
                      >
                        <span className={`flex-shrink-0 ${selected === idx ? "text-[#F97316]" : "text-white/30"}`}>
                          {PAGE_ICONS[item.path] ?? <FileText className="w-4 h-4" />}
                        </span>
                        <span className="flex-1 text-sm font-medium">{item.title}</span>
                        <ArrowRight className={`w-3.5 h-3.5 flex-shrink-0 transition-opacity ${selected === idx ? "opacity-100 text-[#F97316]" : "opacity-0"}`} />
                      </button>
                    ))}

                    {query.length >= 2 && searchQuery.data?.repos && searchQuery.data.repos.length > 0 && (
                      <>
                        <p className="px-4 pt-3 pb-1.5 text-xs text-white/30 uppercase tracking-wider font-medium border-t border-white/5 mt-1">GitHub Repos</p>
                        {items.filter(i => i.type === "repo").map((item, idx) => {
                          const absIdx = items.filter(i => i.type === "page").length + idx;
                          return (
                            <button
                              key={item.path}
                              onClick={() => handleSelect(item)}
                              onMouseEnter={() => setSelected(absIdx)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                selected === absIdx ? "bg-[#22D3EE]/10 text-white" : "text-white/70 hover:bg-white/5"
                              }`}
                            >
                              <span className={`flex-shrink-0 ${selected === absIdx ? "text-[#22D3EE]" : "text-white/30"}`}>
                                <Github className="w-4 h-4" />
                              </span>
                              <span className="flex-1 text-sm font-medium">{item.title}</span>
                              <span className="text-xs text-white/20">GitHub ↗</span>
                            </button>
                          );
                        })}
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-white/5 flex items-center gap-4 text-xs text-white/20">
                <span className="flex items-center gap-1"><kbd className="font-mono">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="font-mono">↵</kbd> select</span>
                <span className="flex items-center gap-1"><kbd className="font-mono">ESC</kbd> close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


