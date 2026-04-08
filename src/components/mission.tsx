import { ScrollReveal } from "./scroll-reveal";

export function Mission() {
  return (
    <section className="relative overflow-hidden py-32 text-center lg:py-44" aria-labelledby="mission-heading">
      <div className="mission-glow" aria-hidden="true" />
      <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
        <ScrollReveal className="relative z-[1] mx-auto max-w-[720px]">
          <p className="section-eyebrow mb-5 flex items-center justify-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[3px] text-text-3">Why Ordo</p>
          <h2 id="mission-heading" className="mb-8 font-serif text-[clamp(32px,4.5vw,52px)] font-normal leading-[1.15] tracking-[-1px] text-text">
            AI should work <em className="italic text-accent">with</em> you —<br />not through a screen.
          </h2>
          <p className="mx-auto max-w-[560px] text-lg leading-[1.8] text-text-2">
            Walking, commuting, cooking, building — the moments that matter most happen away from a keyboard.
            We&apos;re creating an AI that lives in those moments. Always listening, always ready, never in the way.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
