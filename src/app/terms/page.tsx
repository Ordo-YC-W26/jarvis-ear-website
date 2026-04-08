import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Ordo",
  description: "Ordo terms of service for the website and pre-orders.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-[720px] px-6 pt-36 pb-24 lg:px-10">
      <p className="section-eyebrow mb-5 flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[3px] text-text-3">
        Legal
      </p>
      <h1 className="mb-4 font-serif text-4xl font-normal tracking-[-1px] text-text lg:text-5xl">
        Terms of Service
      </h1>
      <p className="mb-16 font-mono text-xs text-text-3">Last updated: April 8, 2026</p>

      <div className="space-y-12 text-[15px] leading-[1.8] text-text-2">
        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using the Ordo website at ai.ordospaces.com, you agree to be bound by these Terms of Service.
            If you do not agree, please do not use our services.
          </p>
        </Section>

        <Section title="2. Pre-Orders">
          <p>
            Ordo is currently in development. When you place a pre-order, you are reserving a unit at the stated price.
          </p>
          <ul className="ml-6 mt-3 list-disc space-y-2">
            <li>Pre-orders are charged at the time of purchase.</li>
            <li>Pre-order pricing is locked in at the time of payment and will not increase.</li>
            <li>We do not guarantee a specific delivery date. Estimated timelines are non-binding.</li>
            <li>You will receive email updates on development milestones and shipping timelines.</li>
          </ul>
        </Section>

        <Section title="3. Product Description">
          <p>
            Specifications, features, and design details shown on the website represent our current development targets.
            The final product may differ in minor ways from what is described. We will notify pre-order customers of any
            material changes.
          </p>
        </Section>

        <Section title="4. Waitlist">
          <p>
            Joining the waitlist is free and does not obligate you to purchase. Waitlist position does not guarantee
            availability or specific pricing. We may contact you via the email address you provide with product updates.
          </p>
        </Section>

        <Section title="5. Payment">
          <p>
            All payments are processed securely through Stripe. Prices are listed in US Dollars (USD).
            You are responsible for any applicable taxes in your jurisdiction.
          </p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            All content on this website — including text, graphics, logos, images, and software — is the property of Ordo
            and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create
            derivative works without our written consent.
          </p>
        </Section>

        <Section title="7. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, Ordo shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of our website or services. Our total liability
            shall not exceed the amount you paid for your pre-order.
          </p>
        </Section>

        <Section title="8. Modifications">
          <p>
            We reserve the right to modify these terms at any time. Changes will be posted on this page.
            Continued use of the site after changes constitutes acceptance of the new terms.
          </p>
        </Section>

        <Section title="9. Governing Law">
          <p>
            These terms shall be governed by and construed in accordance with applicable law, without regard to
            conflict of law principles.
          </p>
        </Section>

        <Section title="10. Contact">
          <p>
            Questions about these terms? Contact us at{" "}
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
