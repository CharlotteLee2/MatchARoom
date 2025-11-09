import { getCurrentUser } from "@/lib/auth";
import SignInPage from "@/app/auth/signin/signIn";

export default async function Home() {
  const user = await getCurrentUser();

  // If user is not authenticated, show sign-in screen (this is what users see first)
  if (!user) {
    return <SignInPage/>;
  }

  // If user is authenticated, show homepage
  return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto w-full max-w-6xl px-6 py-8">
          <section className="w-full">
            {/* Homepage should only show recent forum posts; none exist, so this is intentionally left empty. */}
          </section>
        </main>
      </div>
  );
}
