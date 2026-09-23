import { ECOSYSTEM } from "@/data/ecosystem";

const SEPARATOR = " — ";

const ALIAS: Record<string, string> = {
  EIPC: "eIPC",
  "EoS Kernel": "EoS",
  eBoot: "eBoot",
  "eBoot (eBootloader)": "eBoot",
  eBuild: "ebuild",
  eDB: "eDB",
  eAI: "eAI",
  eNI: "eNI",
  EoSim: "EoSim",
  EoStudio: "EoStudio",
  eOffice: "eOffice",
  eFlow: "eFlow",
};

export function splitRelationship(text: string): {
  head: string;
  rest: string;
} {
  const at = text.indexOf(SEPARATOR);
  return at === -1
    ? { head: text, rest: "" }
    : { head: text.slice(0, at), rest: text.slice(at) };
}

export function componentRouteFor(head: string): string | null {
  const name = ALIAS[head];
  if (!name) return null;
  return ECOSYSTEM.find(c => c.name === name)?.sitePage ?? null;
}
