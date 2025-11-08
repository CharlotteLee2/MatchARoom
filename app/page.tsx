import AuthGate from "../components/AuthGate";

export default function Home() {
  return (
    <AuthGate>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <h1 className="text-4xl font-bold">Welcome back — explore rooms and roommates</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-md text-center sm:text-left">
            Use the forum to post rooms or the swipe functionality to find compatible roommates.
          </p>

          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
            <a
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-5 text-white transition-colors md:w-[158px]"
              href="/forum"
            >
              Go to Forum
            </a>
            <a
              className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors md:w-[158px]"
              href="/swipe"
            >
              Start Swiping
            </a>
          </div>
        </main>
      </div>
    </AuthGate>
  );
}
