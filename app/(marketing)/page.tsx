import { LandingNavbar } from "@/components/landing/landing-navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { TrustSection } from "@/components/landing/trust-section"
import { ForProvidersSection } from "@/components/landing/for-providers-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { LandingFooter } from "@/components/landing/landing-footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <TrustSection />
        <ForProvidersSection />
        <TestimonialsSection />
      </main>
      <LandingFooter />
    </div>
  )
}
