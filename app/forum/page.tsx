import Link from "next/link";

export const metadata = {
  title: "Forum - MatchARoom",
};

export default function ForumPage() {
  return (
    <main className="py-20">
      <div className="mx-auto max-w-4xl px-6 text-center text-gray-600">
        <h2 className="text-2xl font-semibold mb-3">Forum (Coming Soon)</h2>
        <p className="mb-6">This page is reserved for the community forum. The team is working on it.</p>
        <Link href="/" className="text-blue-600">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
