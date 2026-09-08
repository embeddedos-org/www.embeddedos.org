/**
 * eBot answers from a fixed knowledge base rather than an LLM, so its behaviour
 * is testable in a way the old `/api/trpc/ebot.chat` call never was.
 *
 * Two properties matter more than any individual answer, and both are asserted
 * here: eBot must answer the questions its own UI offers as suggestions, and it
 * must never invent a figure the rest of the site contradicts.
 */
import { describe, expect, it } from "vitest";
import {
  answerQuestion,
  TOPICS,
  type Topic,
} from "../../shared/ebot-knowledge";
import { PAGES } from "../../shared/site-index";
import { STACK } from "../../shared/stack-data";

/** The chips EBot.tsx renders under an empty conversation. */
const SUGGESTIONS = [
  "What boards does EmbeddedOS support?",
  "Tell me about the health devices",
  "How do I get started?",
  "What is AeroSwift?",
];

describe("answerQuestion", () => {
  it("answers every suggestion the chat window offers", () => {
    for (const question of SUGGESTIONS) {
      const answer = answerQuestion(question);
      expect(answer.kind, `"${question}" fell through to a fallback`).toBe(
        "topic"
      );
      expect(answer.reply.length).toBeGreaterThan(40);
    }
  });

  it("routes each suggestion to the topic a reader would expect", () => {
    expect(answerQuestion(SUGGESTIONS[0]).reply).toContain(
      String(STACK.totals.boards)
    );
    expect(answerQuestion(SUGGESTIONS[1]).reply).toContain("HEALTH-RING");
    expect(answerQuestion(SUGGESTIONS[2]).reply).toContain("ebuild");
    expect(answerQuestion(SUGGESTIONS[3]).reply).toContain("AeroSwift");
  });

  it("quotes the counted board figure, never the retired '52+' one", () => {
    const reply = answerQuestion("what hardware does it support?").reply;
    expect(reply).toContain(`${STACK.totals.boards} board definitions`);
    expect(reply).not.toContain("52+");
  });

  it("greets rather than searching for the word hello", () => {
    for (const greeting of ["hi", "hello", "hey there", "thanks"]) {
      expect(answerQuestion(greeting).kind).toBe("topic");
    }
  });

  it("falls back to matching pages when no topic fits", () => {
    const answer = answerQuestion("tell me about quantum computing");
    expect(answer.kind).toBe("search");
    expect(answer.links.map(l => l.href)).toContain("/quantum");
  });

  it("admits it does not know instead of inventing an answer", () => {
    const answer = answerQuestion("what is the airspeed velocity of a swallow");
    expect(answer.kind).toBe("unknown");
    expect(answer.reply.toLowerCase()).toContain("don't know");
    // No email address is ever offered — the fallback points at the contact
    // form instead (see shared/ebot-knowledge.ts's KnowledgeLink doc comment).
    expect(answer.links.some(l => l.href === "contact:contact")).toBe(true);
    expect(answer.links.some(l => l.href.startsWith("mailto:"))).toBe(false);
  });

  it("handles empty and punctuation-only input without throwing", () => {
    for (const input of ["", "   ", "???", "!!!"]) {
      expect(() => answerQuestion(input)).not.toThrow();
      expect(answerQuestion(input).reply.length).toBeGreaterThan(0);
    }
  });

  it("is not derailed by punctuation or casing", () => {
    const plain = answerQuestion("what boards does embeddedos support");
    const noisy = answerQuestion("WHAT BOARDS does EmbeddedOS support?!?");
    expect(noisy.reply).toBe(plain.reply);
  });

  it("does not match a single word inside a longer word", () => {
    // "ai" must not fire on "chair", "opt" must not fire on "option".
    const answer = answerQuestion("is there a chair in the option menu");
    expect(answer.kind).not.toBe("topic");
  });
});

describe("TOPICS", () => {
  it("gives every topic a unique id", () => {
    const ids = TOPICS.map((t: Topic) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("points every internal link at a page the site actually has", () => {
    // A link to a route that does not exist sends the visitor to the 404 page,
    // which is worse than offering no link at all.
    const known = new Set(PAGES.map(p => p.path));
    const broken: string[] = [];
    for (const topic of TOPICS) {
      for (const link of topic.links ?? []) {
        if (/^[a-z]+:/i.test(link.href)) continue; // mailto:, https:
        if (!known.has(link.href)) broken.push(`${topic.id} -> ${link.href}`);
      }
    }
    expect(broken).toEqual([]);
  });

  it("keeps answers short enough for the chat panel", () => {
    for (const topic of TOPICS) {
      expect(topic.answer.length, `${topic.id} is too long`).toBeLessThan(700);
    }
  });

  it("uses only the markdown the chat window can render", () => {
    // MarkdownText handles **bold**, `code` and newlines. A markdown link or a
    // heading would render as literal punctuation in the bubble.
    for (const topic of TOPICS) {
      expect(topic.answer, `${topic.id} contains a markdown link`).not.toMatch(
        /\[.+\]\(.+\)/
      );
      expect(topic.answer, `${topic.id} contains a heading`).not.toMatch(
        /^#{1,6}\s/m
      );
    }
  });
});
