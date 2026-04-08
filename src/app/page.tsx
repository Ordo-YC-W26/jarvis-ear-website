import { Hero } from "@/components/hero";
import { SocialProof } from "@/components/social-proof";
import { Features } from "@/components/features";
import { LifestyleBreak } from "@/components/lifestyle-break";
import { HowItWorks } from "@/components/how-it-works";
import { UseCases } from "@/components/use-cases";
import { Mission } from "@/components/mission";
import { Waitlist } from "@/components/waitlist";

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Features />
      <LifestyleBreak />
      <HowItWorks />
      <UseCases />
      <Mission />
      <Waitlist />
    </>
  );
}
