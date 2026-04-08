import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { getResend } from "@/lib/resend";
import { preorderConfirmEmailHtml } from "@/lib/emails/preorder-confirm";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true });
    }

    const session = event.data.object;
    const waitlistId = session.metadata?.waitlist_id;
    const customerEmail = session.customer_email;

    const supabase = createServerClient();

    // Try updating by waitlist_id first, fall back to email lookup
    let entry: { name: string; email: string } | null = null;

    if (waitlistId) {
      const { data, error } = await supabase
        .from("waitlist")
        .update({
          paid: true,
          stripe_session_id: session.id,
          amount_paid: session.amount_total ?? 5000,
        })
        .eq("id", waitlistId)
        .select("name, email")
        .single();

      if (!error && data) entry = data;
    }

    // Fallback: match by email if waitlist_id was empty (race condition)
    if (!entry && customerEmail) {
      const { data, error } = await supabase
        .from("waitlist")
        .update({
          paid: true,
          stripe_session_id: session.id,
          amount_paid: session.amount_total ?? 5000,
        })
        .eq("email", customerEmail)
        .eq("paid", false)
        .select("name, email")
        .single();

      if (!error && data) entry = data;
    }

    if (entry) {
      // Get receipt URL from the payment intent
      let receiptUrl: string | undefined;
      if (session.payment_intent) {
        const pi = await stripe.paymentIntents.retrieve(
          session.payment_intent as string,
          { expand: ["latest_charge"] },
        );
        const charge = pi.latest_charge;
        if (charge && typeof charge !== "string") {
          receiptUrl = charge.receipt_url ?? undefined;
        }
      }

      const amountTotal = session.amount_total ?? 5000;
      const currency = (session.currency ?? "usd").toUpperCase();
      const amountFormatted = `$${(amountTotal / 100).toFixed(2)}`;
      const date = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const firstName = entry.name.split(" ")[0];
      await getResend().emails.send({
        from: "Ordo <hello@ordospaces.com>",
        to: entry.email,
        subject: `Pre-order confirmed — Ordo #${session.id.slice(-8).toUpperCase()}`,
        html: preorderConfirmEmailHtml({
          firstName,
          email: entry.email,
          amount: amountFormatted,
          currency,
          paymentId: session.id.slice(-8).toUpperCase(),
          date,
          receiptUrl,
        }),
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 },
    );
  }
}
