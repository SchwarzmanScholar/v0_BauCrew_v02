import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-muted/30 p-6">
      <SignIn />
    </main>
  );
}
