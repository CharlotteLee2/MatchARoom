"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { createProfileStack } from "./card";

// Page is a client component (contains pointer interactions). Metadata removed to keep this file client-only.

const profiles = [
  {
    id: "1",
    name: "Alex Johnson",
    age: 27,
    description: "Looking for a quiet roommate who loves cooking.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  {
    id: "2",
    name: "Maria Lopez",
    age: 24,
    description: "Friendly and tidy — hoping to find a chill place downtown.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  },
  {
    id: "3",
    name: "David Kim",
    age: 29,
    description: "Work from home designer, clean and responsible.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
  },
];

export default function SwipePage() {
  const c = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (c.current && typeof window !== "undefined" && !initialized.current) {
      initialized.current = true;
      c.current.innerHTML = "";

      // Get swiped profile IDs from localStorage
      const swipedIds = JSON.parse(localStorage.getItem("swipedProfiles") || "[]");

      // Filter out already swiped profiles
      const remainingProfiles = profiles.filter(p => !swipedIds.includes(p.id));

      if (remainingProfiles.length === 0) {
        // Show "No More Entries" message immediately if all profiles are swiped
        const noMoreMessage = document.createElement('div');
        noMoreMessage.className = 'no-more-profiles';
        noMoreMessage.innerHTML = `
          <div style="text-align: center; padding: 40px 20px;">
            <h3 style="font-size: 24px; font-weight: bold; color: #666; margin-bottom: 10px;">
              No More Entries!
            </h3>
            <p style="font-size: 16px; color: #999;">
              Come back again another time.
            </p>
          </div>
        `;
        c.current.appendChild(noMoreMessage);
      } else {
        createProfileStack(c.current, remainingProfiles);
      }
    }
  }, []);

  return (
    <main className="pt-8 pb-20">
      <div className="mx-auto max-w-md px-6 text-center text-gray-700">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: '#356859' }}>Swipe</h1>
        <div className="mb-6 space-y-2">
  <p className="text-gray-600">
    Swipe left or right to explore roommate profiles!
  </p>
  <p className="text-sm text-gray-500">
    <span className="font-semibold text-red-500">Swipe left</span> to pass •
    <span className="font-semibold text-green-500"> Swipe right</span> to match
  </p>
</div>
        <div
          ref={c}
          id="ProfileCard"
          className="relative w-full h-[450px] flex justify-center items-center"
        ></div>

        <Link href="/" className="block mt-6 text-blue-600">
          Back to Home
        </Link>
      </div>
    </main>
  );
}

 