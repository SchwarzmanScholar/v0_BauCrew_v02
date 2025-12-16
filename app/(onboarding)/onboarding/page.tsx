import { OnboardingForm } from "@/components/onboarding/onboarding-form"

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-muted/30 flex flex-col">
      <header className="border-b bg-card py-4 px-6">
        <div className="mx-auto max-w-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">BC</span>
            </div>
            <span className="font-semibold text-lg text-foreground">BauCrew</span>
          </div>
          <span className="text-sm text-muted-foreground">Schritt 1 von 2</span>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2 text-balance">Willkommen bei BauCrew</h1>
            <p className="text-muted-foreground">Wie möchtest du die Plattform nutzen?</p>
          </div>

          <OnboardingForm />
        </div>
      </div>

      <footer className="border-t bg-card py-4 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-center gap-1">
            <div className="h-2 w-8 rounded-full bg-primary" />
            <div className="h-2 w-8 rounded-full bg-muted" />
          </div>
        </div>
      </footer>
    </main>
  )
}
