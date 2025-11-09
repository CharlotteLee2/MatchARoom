"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { createProfileStack } from "./card";

// Page is a client component (contains pointer interactions). Metadata removed to keep this file client-only.

const profiles = [
  {
    id: "1",
    name: "Alex Johnson",
    age: 18,
    description: "Looking for a quiet roommate who loves cooking.",
    interestedIn: "Villas at Chesnut Ridge, The Station, Aspen Heights",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex%20Johnson",
  },
  {
    id: "2",
    name: "Maria Lopez",
    age: 21,
    description: "Friendly and tidy — hoping to find a chill place downtown.",
    interestedIn: "The Station, Aspen Heights",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria%20Lopez",
  },
  {
    id: "3",
    name: "David Kim",
    age: 19,
    description: "Work from home designer, clean and responsible.",
    interestedIn: "Villas at Chesnut Ridge", 
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David%20Kim",
  },
  {
    id: "4",
    name: "Ivan Lee",
    age: 21,
    description: "Easy-going and loves to eat out. Looking for a person to share food adventures with!",
    interestedIn: "The Station",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan%20Lee",
  },
  {
    id: "5",
    name: "Jeff Zheng",
    age: 21,
    description: "Avid gamer and just a jokester. Everyone laughs at my jokes!",
    interestedIn: "Aspen Heights",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jeff%20Zheng",
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

 