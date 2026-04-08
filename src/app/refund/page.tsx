import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — Ordo",
  description: "Ordo refund policy for pre-orders and purchases.",
};

export default function RefundPage() {
  return (
    <main className="mx-auto max-w-[720px] px-6 pt-36 pb-24 lg:px-10">
      <p className="section-eyebrow mb-5 flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[3px] text-text-3">
        Legal
      </p>
      <h1 className="mb-4 font-serif text-4xl font-normal tracking-[-1px] text-text lg:text-5xl">
        Refund Policy
      </h1>
      <p className="mb-16 font-mono text-xs text-text-3">Last updated: April 8, 2026</p>

      <div className="space-y-12 text-[15px] leading-[1.8] text-text-2">
        <Section title="Pre-Order Refunds">
          <p>
            We understand that pre-ordering a product in development requires trust. We want to make the process as
            risk-free as possible.
          </p>

          <div className="mt-6 rounded-none border border-border bg-bg-card p-6">
            <h3 className="mb-3 font-serif text-lg text-text">Before Shipping</h3>
            <p>
              You may request a <strong className="text-text">full refund</strong> at any time before your unit ships.
              No questions asked. Email us and we will process the refund within 5-10 business days.
            </p>
          </div>

          <div className="mt-4 rounded-none border border-border bg-bg-card p-6">
            <h3 className="mb-3 font-serif text-lg text-text">After Delivery</h3>
            <p>
              If you receive your Ordo device and are not satisfied, you may return it within{" "}
              <strong className="text-text">30 days of delivery</strong> for a full refund. The device must be in its
              original condition. You are responsible for return shipping costs.
            </p>
          </div>

          <div className="mt-4 rounded-none border border-border bg-bg-card p-6">
            <h3 className="mb-3 font-serif text-lg text-text">Defective Units</h3>
            <p>
              If your device arrives defective or develops a fault within <strong className="text-text">90 days</strong>,
              we will replace it at no cost or issue a full refund, including return shipping.
            </p>
          </div>
        </Section>

        <Section title="How to Request a Refund">
          <ol className="ml-6 list-decimal space-y-3">
            <li>
              Email <a href="mailto:hello@ordospaces.com" className="text-accent underline">hello@ordospaces.com</a> with
              your name and the email you used for the pre-order.
            </li>
            <li>We will confirm your request within 2 business days.</li>
            <li>Refunds are processed back to your original payment method via Stripe.</li>
            <li>Please allow 5-10 business days for the refund to appear on your statement.</li>
          </ol>
        </Section>

        <Section title="Cancellations">
          <p>
            If we are unable to fulfill your pre-order for any reason (e.g., the product does not reach production),
            we will issue a full, automatic refund to all pre-order customers.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about refunds? Contact us at{" "}
            <a href="mailto:hello@ordospaces.com" className="text-accent underline">hello@ordospaces.com</a>.
          </p>
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 font-serif text-xl font-normal text-text">{title}</h2>
      {children}
    </section>
  );
}
