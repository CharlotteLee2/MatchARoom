import Link from "next/link";

export const metadata = {
  title: "Register - MatchARoom",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center py-20">
      <div className="mx-auto w-full max-w-md rounded-lg border bg-white p-8 shadow">
        <h1 className="mb-4 text-2xl font-semibold">Register</h1>
        <p className="mb-4 text-sm text-gray-600">This is a placeholder register page. Implement signup here.</p>
        <div className="flex gap-2">
          <button
            className="rounded bg-green-600 px-4 py-2 text-white"
            onClick={() => {
              try {
                // For local testing, set a mock user and redirect to home
                localStorage.setItem("user", JSON.stringify({ name: "dev" }));
                window.location.href = "/";
              } catch (e) {}
            }}
          >
            Mock Register
          </button>
          <Link href="/login" className="ml-auto self-center text-sm text-blue-600">
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}
