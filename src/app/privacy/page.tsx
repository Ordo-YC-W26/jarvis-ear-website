import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Ordo",
  description: "Ordo privacy policy. How we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[720px] px-6 pt-36 pb-24 lg:px-10">
      <p className="section-eyebrow mb-5 flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[3px] text-text-3">
        Legal
      </p>
      <h1 className="mb-4 font-serif text-4xl font-normal tracking-[-1px] text-text lg:text-5xl">
        Privacy Policy
      </h1>
      <p className="mb-16 font-mono text-xs text-text-3">Last updated: April 8, 2026</p>

      <div className="space-y-12 text-[15px] leading-[1.8] text-text-2">
        <Section title="1. Information We Collect">
          <p>When you use the Ordo website or place a pre-order, we collect:</p>
          <ul className="ml-6 mt-3 list-disc space-y-2">
            <li><strong className="text-text">Name and email address</strong> — when you join the waitlist.</li>
            <li><strong className="text-text">Payment information</strong> — processed by Stripe. We never store your card details directly.</li>
            <li><strong className="text-text">Usage data</strong> — anonymous page views and performance metrics via Vercel Analytics.</li>
          </ul>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul className="ml-6 list-disc space-y-2">
            <li>To manage your waitlist position and communicate about product availability.</li>
            <li>To process and fulfill your pre-order.</li>
            <li>To send transactional emails (waitlist confirmation, order confirmation).</li>
            <li>To improve our website and services.</li>
          </ul>
          <p className="mt-3">We do not sell, rent, or share your personal information with third parties for marketing purposes.</p>
        </Section>

        <Section title="3. Third-Party Services">
          <p>We use the following services to operate:</p>
          <ul className="ml-6 mt-3 list-disc space-y-2">
            <li><strong className="text-text">Stripe</strong> — payment processing. Subject to <a href="https://stripe.com/privacy" className="text-accent underline" target="_blank" rel="noopener noreferrer">Stripe&apos;s Privacy Policy</a>.</li>
            <li><strong className="text-text">Supabase</strong> — database hosting. Data stored in their managed PostgreSQL infrastructure.</li>
            <li><strong className="text-text">Resend</strong> — transactional email delivery.</li>
            <li><strong className="text-text">Vercel</strong> — website hosting and anonymous analytics.</li>
          </ul>
        </Section>

        <Section title="4. Data Security">
          <p>
            We implement appropriate technical measures to protect your information. All data is transmitted over HTTPS.
            Payment data is handled entirely by Stripe and never touches our servers. Database access is restricted via
            row-level security policies.
          </p>
        </Section>

        <Section title="5. Data Retention">
          <p>
            We retain your waitlist and order information for as long as necessary to fulfill our obligations.
            You may request deletion of your data at any time by contacting us.
          </p>
        </Section>

        <Section title="6. Your Rights">
          <p>You have the right to:</p>
          <ul className="ml-6 mt-3 list-disc space-y-2">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your data.</li>
            <li>Withdraw consent for communications at any time.</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, email us at <a href="mailto:hello@ordospaces.com" className="text-accent underline">hello@ordospaces.com</a>.</p>
        </Section>

        <Section title="7. Cookies">
          <p>
            We use essential cookies required for the website to function. Vercel Analytics collects anonymous,
            aggregated data without using cookies or tracking individual users.
          </p>
        </Section>

        <Section title="8. Changes to This Policy">
          <p>
            We may update this policy from time to time. Changes will be posted on this page with an updated date.
            Continued use of the site constitutes acceptance of the revised policy.
          </p>
        </Section>

        <Section title="9. Contact">
          <p>
            Questions about this policy? Contact us at{" "}
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
