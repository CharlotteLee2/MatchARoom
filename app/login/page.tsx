"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center py-20">
      <div className="mx-auto w-full max-w-md rounded-lg border bg-white p-8 shadow">
        <h1 className="mb-4 text-2xl font-semibold">Log in</h1>
        <p className="mb-4 text-sm text-gray-600">This is a placeholder login page. Implement authentication here.</p>
        <div className="flex gap-2">
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white"
            onClick={() => {
              // For local testing, set a mock token then redirect to home
              try {
                localStorage.setItem("authToken", "dev-token");
                window.location.href = "/";
              } catch (e) {
                // ignore
              }
            }}
          >
            Mock Log in
          </button>
          <Link href="/register" className="ml-auto self-center text-sm text-blue-600">
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
