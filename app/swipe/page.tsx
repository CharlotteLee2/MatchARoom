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
    name: "Ivan Wu",
    age: 21,
    description: "Easy-going and loves to eat out. SHORT KINGS STAND UP!",
    interestedIn: "The Station",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan%20Wu",
  },
  {
    id: "5",
    name: "Jeff Zheng",
    age: 21,
    description: "Just a comedian. Everyone laughs at my jokes!",
    interestedIn: "Aspen Heights",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jeff%20Zheng",
  },
  {
    id: "6",
    name: "Charlotte Lee",
    age: 19,
    description: "What the hell! Someone just broke my freaking window!",
    interestedIn: "Villas at Chesnut Ridge",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte%20Lee",
  },
  {
    id: "7",
    name: "Isabella Delgado",
    age: 19,
    description: "Got asked what I'm doing later... 6 7!",
    interestedIn: "The Station",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella%20Delgado",
  },
  {
    id: "8",
    name: "Jedidiah Liaw",
    age: 19,
    description: "I'm just a goofy goober for real!",
    interestedIn: "Villas at Chesnut Ridge",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jedidiah%20Liaw",
  }
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
 <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4">
      <div className="mx-auto max-w-lg">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            Swipe
          </h1>
          <p className="text-gray-600 text-lg font-medium mb-3">
            Discover Your Perfect Roommate Match
          </p>
          
          {/* Instruction Pills */}
          <div className="flex items-center justify-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 bg-red-50 px-4 py-2 rounded-full border border-red-100">
              <span className="text-2xl">👈</span>
              <span className="font-semibold text-red-600">Pass</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
            <div className="flex items-center gap-1.5 bg-green-50 px-4 py-2 rounded-full border border-green-100">
              <span className="text-2xl">👉</span>
              <span className="font-semibold text-green-600">Match</span>
            </div>
          </div>
        </div>

        {/* Card Container with Enhanced Shadow */}
        <div className="relative mb-8">
          <div
            ref={c}
            id="ProfileCard"
            className="relative w-full h-[480px] flex justify-center items-center"
          ></div>
          
          {/* Decorative Background Elements */}
          <div className="absolute -z-10 top-8 left-8 w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl opacity-20"></div>
        </div>

        {/* Navigation Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex gap-3">
            <Link 
              href="/" 
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 text-center"
            >
              🏠 Home
            </Link>
            <Link 
              href="/forum" 
              className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-0.5 text-center"
            >
              💬 Forum
            </Link>
          </div>
        </div>

        {/* Footer Tip */}
        <p className="text-center text-sm text-gray-500 mt-6 font-medium">
          💡 Click the buttons or use keyboard arrows to navigate
        </p>
      </div>
    </main>
  );
}