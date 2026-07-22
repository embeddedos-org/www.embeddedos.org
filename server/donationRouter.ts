import Stripe from "stripe";
import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-06-24.dahlia",
});

// Preset donation amounts in cents
export const DONATION_PRESETS = [
  { label: "$10", amount: 1000 },
  { label: "$25", amount: 2500 },
  { label: "$50", amount: 5000 },
  { label: "$100", amount: 10000 },
  { label: "$250", amount: 25000 },
  { label: "$500", amount: 50000 },
];

export const donationRouter = router({
  // Create a Stripe Checkout session for a one-time or recurring donation
  createCheckoutSession: publicProcedure
    .input(
      z.object({
        amountCents: z.number().int().min(100).max(1000000), // $1 – $10,000
        frequency: z.enum(["one_time", "monthly", "quarterly", "annual"]),
        donorName: z.string().optional(),
        donorEmail: z.string().email().optional(),
        message: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { amountCents, frequency, donorName, donorEmail, message } = input;

      const origin = ctx.req.headers.origin || "https://www.embeddedos.org";

      // Build line item description
      const freqLabel =
        frequency === "monthly"
          ? "Monthly Donation"
          : frequency === "quarterly"
          ? "Quarterly Donation"
          : frequency === "annual"
          ? "Annual Donation"
          : "One-Time Donation";

      const description = `${freqLabel} — Embedded Operating Systems Research Foundation`;

      // For recurring donations, create a price on the fly
      let lineItem: Stripe.Checkout.SessionCreateParams.LineItem;

      if (frequency === "one_time") {
        lineItem = {
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            product_data: {
              name: "Donation — EmbeddedOS Foundation",
              description,
              images: [],
            },
          },
          quantity: 1,
        };
      } else {
        const interval = frequency === "monthly" || frequency === "quarterly" ? "month" : "year";
        const intervalCount = frequency === "quarterly" ? 3 : 1;
        lineItem = {
          price_data: {
            currency: "usd",
            unit_amount: amountCents,
            recurring: { interval, interval_count: intervalCount },
            product_data: {
              name: `${freqLabel} — EmbeddedOS Foundation`,
              description,
            },
          },
          quantity: 1,
        };
      }

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: frequency === "one_time" ? "payment" : "subscription",
        line_items: [lineItem],
        success_url: `${origin}/donate?success=1&amount=${amountCents}&freq=${frequency}`,
        cancel_url: `${origin}/donate?cancelled=1`,
        allow_promotion_codes: true,
        metadata: {
          donor_name: donorName || "",
          donor_email: donorEmail || "",
          message: message || "",
          frequency,
          source: "website",
        },
        ...(donorEmail ? { customer_email: donorEmail } : {}),
        payment_intent_data:
          frequency === "one_time"
            ? {
                metadata: {
                  donor_name: donorName || "",
                  frequency,
                  message: message || "",
                },
              }
            : undefined,
        subscription_data:
          frequency !== "one_time"
            ? {
                metadata: {
                  donor_name: donorName || "",
                  frequency,
                  message: message || "",
                },
              }
            : undefined,
      };

      try {
        const session = await stripe.checkout.sessions.create(sessionParams);
        return { url: session.url! };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Stripe error";
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message });
      }
    }),
});
