import { ScrollReveal } from "./scroll-reveal";
import { TerminalDemo } from "./terminal-demo";

const STEPS = [
  {
    num: "01",
    title: "Speak",
    desc: "Tap the button or use always-on detection. Say your command naturally.",
    icon: "mic",
  },
  {
    num: "02",
    title: "AI Processes",
    desc: "Whisper transcribes. LLM parses intent. MCP server routes to the right tool.",
    icon: "monitor",
  },
  {
    num: "03",
    title: "Action Taken",
    desc: "Message sent. Issue created. Note saved. Confirmation in your ear.",
    icon: "check",
  },
] as const;

function StepIcon({ icon }: { icon: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="h-7 w-7">
      {icon === "mic" && <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /></>}
      {icon === "monitor" && <><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></>}
      {icon === "check" && <polyline points="20 6 9 17 4 12" />}
    </svg>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-divider relative py-24 lg:py-36" aria-labelledby="how-heading">
      <div className="mx-auto max-w-[1200px] px-7 lg:px-10">
        <ScrollReveal className="mb-18">
          <p className="section-eyebrow mb-5 flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[3px] text-text-3">Pipeline</p>
          <h2 id="how-heading" className="section-title mb-5 font-serif font-normal leading-[1.1] tracking-[-1.5px] text-text">
            Speak it. <em className="italic text-accent">Done.</em>
          </h2>
          <p className="max-w-[500px] text-[17px] leading-[1.7] text-text-2">
            From voice to action in under 2 seconds. No app to open, no screen to unlock.
          </p>
        </ScrollReveal>

        {/* Pipeline steps */}
        <ScrollReveal className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
          {STEPS.map((step) => (
            <div key={step.num} className="pipeline-step px-4 text-center">
              <div className="pipeline-num mb-7 font-serif text-5xl font-normal leading-none tracking-[-3px] text-border-light lg:text-[64px]">
                {step.num}
              </div>
              <div className="pipeline-icon mx-auto mb-6 flex h-16 w-16 items-center justify-center text-accent">
                <StepIcon icon={step.icon} />
              </div>
              <h3 className="mb-3 font-serif text-xl font-normal text-text">{step.title}</h3>
              <p className="mx-auto max-w-[240px] text-sm leading-[1.65] text-text-2">{step.desc}</p>
            </div>
          ))}
        </ScrollReveal>

        {/* Terminal */}
        <ScrollReveal>
          <TerminalDemo />
        </ScrollReveal>
      </div>
    </section>
  );
}
