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
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.tiktok.com%2Fdiscover%2Fkirk-speed&psig=AOvVaw0CVW0HqVADYPjtgecJscvl&ust=1762752098726000&source=images&cd=vfe&opi=89978449&ved=0CBYQjRxqFwoTCJD2vbep5JADFQAAAAAdAAAAABAE",
  },
  {
    id: "2",
    name: "Maria Lopez",
    age: 24,
    description: "Friendly and tidy — hoping to find a chill place downtown.",
    image: "",
  },
  {
    id: "3",
    name: "David Kim",
    age: 29,
    description: "Work from home designer, clean and responsible.",
    image: "",
  },
];

export default function SwipePage() {
  const c = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (c.current) {
      c.current.innerHTML = ""; 
      createProfileStack(c.current, profiles);
    }
  }, []);

  return (
    <main className="py-20">
      <div className="mx-auto max-w-md px-6 text-center text-gray-700">
        <h2 className="text-3xl font-semibold mb-4">Swipe</h2>
        <p className="mb-6">Swipe left or right to explore roommate profiles!</p>

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

 