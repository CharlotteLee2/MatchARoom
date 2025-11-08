import Link from "next/link";

export const metadata = {
  title: "Swipe - MatchARoom",
};

export default function SwipePage() {
  return (
    <main className="py-20">
      <div className="mx-auto max-w-4xl px-6 text-center text-gray-600">
        <h2 className="text-2xl font-semibold mb-3">Swipe (Coming Soon)</h2>
        <p className="mb-6">The swipe/matching experience will be added here. For now, browse the forum or return home.</p>
        <Link href="/" className="text-blue-600">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
