import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex-1 flex items-center justify-center min-h-[60vh]">
      <SignIn />
    </main>
  );
}
