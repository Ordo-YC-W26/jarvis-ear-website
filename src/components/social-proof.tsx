export function SocialProof() {
  return (
    <section className="relative z-[1] border-b border-border bg-bg py-5" aria-label="Social proof">
      <div className="flex flex-wrap items-center justify-center gap-2 px-4">
        <ProofItem icon="eye" label="Camera Vision AI" />
        <ProofSep />
        <ProofItem icon="shield" label="Privacy-First" />
      </div>
    </section>
  );
}

function ProofItem({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5 whitespace-nowrap px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[1px] text-text-3 sm:px-7 sm:text-[11px]">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="opacity-40">
        {icon === "eye" && <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
        {icon === "shield" && <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />}
      </svg>
      {label}
    </div>
  );
}

function ProofSep() {
  return <div className="hidden h-[3px] w-[3px] rounded-full bg-border-light sm:block" />;
}
