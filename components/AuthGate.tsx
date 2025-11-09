"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      // Simple localStorage-based mock auth check for frontend prototype.
      // The app should replace this with real auth (cookie, JWT, session) later.
      const t = localStorage.getItem("authToken") || localStorage.getItem("user");
      setLoggedIn(!!t);
    } catch (e) {
      setLoggedIn(false);
    }
  }, []);

  if (loggedIn === null) {
    return <div className="py-20 text-center text-gray-500">Checking authentication…</div>;
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="mx-auto max-w-md rounded-lg border bg-white p-8 text-center shadow">
          <h2 className="mb-4 text-2xl font-semibold">Welcome to MatchARoom</h2>
          <p className="mb-6 text-gray-600">Please log in or register to continue.</p>
          <div className="flex justify-center gap-4">
            <Link href="/login" className="rounded bg-blue-600 px-4 py-2 text-white">
              Log in
            </Link>
            <Link href="/register" className="rounded border border-gray-300 px-4 py-2">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
