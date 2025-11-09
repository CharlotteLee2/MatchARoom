import { getCurrentUser } from "@/lib/auth";
import SignInPage from "@/app/auth/signin/signIn";
import HomeFeed from "@/components/HomeFeed";
import PageTransition from "@/components/PageTransition";

export default async function Home() {
  // TEMPORARY: Bypass auth for testing while database is down
  // TODO: Re-enable when database is back up
  // const user = await getCurrentUser();
  const user = { id: 1, email: "test@example.com" }; // Mock user for testing

  // If user is not authenticated, show sign-in screen (this is what users see first)
  if (!user) {
    return <SignInPage/>;
  }

  // If user is authenticated, show homepage
  return (
      <div className="min-h-screen bg-white">
        <PageTransition>
          <main className="mx-auto w-full max-w-6xl px-6 pt-8 pb-20">
            {/* Page Title */}
            <h1 className="text-4xl font-bold text-center mb-8" style={{ color: '#356859' }}>Home</h1>
            <HomeFeed />
          </main>
        </PageTransition>
      </div>
  );
}
