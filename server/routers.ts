import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { donationRouter } from "./donationRouter";
import { sendApplicationEmails } from "./email.js";
import { searchSite } from "@shared/site-index";
// ── Careers / Job Applications ────────────────────────────────────────────────
export const careersRouter = router({
  submitApplication: publicProcedure
    .input(
      z.object({
        fullName: z.string().min(2).max(120),
        email: z.string().email(),
        phone: z.string().max(30).optional(),
        linkedin: z.string().max(300).optional().or(z.literal("")),
        github: z.string().max(300).optional().or(z.literal("")),
        portfolio: z.string().max(300).optional().or(z.literal("")),
        roleCategory: z.enum([
          "Software Engineer",
          "AI/ML Engineer",
          "Embedded Systems Engineer",
          "Full-Stack Developer",
          "DevOps & Cloud Engineer",
          "Research Engineer",
          "Technical Writer",
          "Open Source Contributor",
          "Student Intern",
          "Volunteer",
          "Research Fellow",
        ]),
        employmentType: z.enum([
          "Full-Time",
          "Part-Time",
          "Contractor",
          "Internship — Paid",
          "Internship — Unpaid",
          "Research Internship",
          "Open Source Internship",
          "Capstone / Academic Project",
          "F-1 CPT",
          "F-1 OPT",
          "F-1 STEM OPT",
          "J-1 Intern / Trainee",
          "Volunteer",
          "Research Fellow",
        ]),
        workAuthorization: z.enum([
          "US Citizen",
          "Permanent Resident (Green Card)",
          "EAD Holder",
          "F-1 CPT Authorized",
          "F-1 OPT Authorized",
          "F-1 STEM OPT Authorized",
          "J-1 Intern / Trainee",
          "Other (please specify in statement)",
        ]),
        statement: z.string().min(50).max(3000),
        availability: z.string().max(200).optional(),
        heardFrom: z.string().max(200).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { notifyOwner } = await import("./_core/notification.js");
      const lines = [
        `**New Job Application — EmbeddedOS Research Foundation**`,
        ``,
        `**Applicant:** ${input.fullName}`,
        `**Email:** ${input.email}`,
        input.phone ? `**Phone:** ${input.phone}` : null,
        `**Role Category:** ${input.roleCategory}`,
        `**Employment Type:** ${input.employmentType}`,
        `**Work Authorization:** ${input.workAuthorization}`,
        input.availability ? `**Availability:** ${input.availability}` : null,
        ``,
        `**Links:**`,
        input.linkedin
          ? `- LinkedIn: ${input.linkedin}`
          : `- LinkedIn: not provided`,
        input.github ? `- GitHub: ${input.github}` : `- GitHub: not provided`,
        input.portfolio ? `- Portfolio: ${input.portfolio}` : null,
        ``,
        `**Statement of Interest:**`,
        input.statement,
        input.heardFrom
          ? `\n**How they heard about us:** ${input.heardFrom}`
          : null,
        ``,
        `---`,
        `Submitted: ${new Date().toISOString()}`,
      ].filter((l): l is string => l !== null);
      await notifyOwner({
        title: `Job Application: ${input.fullName} — ${input.roleCategory}`,
        content: lines.join("\n"),
      });
      // Send SMTP emails: notification to careers@embeddedos.org + confirmation to applicant
      await sendApplicationEmails(input).catch(err => {
        console.error("[Careers] Email send failed (non-fatal):", err);
      });
      return { success: true };
    }),
});

export const appRouter = router({
  system: systemRouter,
  donation: donationRouter,
  careers: careersRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // eBot has no procedure here on purpose. It used to POST every message to
  // `ebot.chat`, which called an LLM through forge.manus.im — a sandbox proxy
  // this account cannot authenticate against — and in production the request
  // never reached any handler at all, because the site deploys as static files
  // with no server process. eBot now answers in the browser from
  // shared/ebot-knowledge.ts. server/comprehensive.test.ts asserts this router
  // stays absent so the dependency cannot be reintroduced by accident.

  // ── Global search ─────────────────────────────────────────────────────────
  // The index and its ranking live in shared/site-index.ts so the browser can
  // run the same search without a network call — which it must, because the
  // production deployment is static and has no /api/trpc at all. This procedure
  // is kept for the dev server and for server/ebot.search.test.ts.
  search: router({
    query: publicProcedure
      .input(z.object({ q: z.string().min(1).max(200) }))
      .query(({ input }) => searchSite(input.q)),
  }),
});

export type AppRouter = typeof appRouter;
