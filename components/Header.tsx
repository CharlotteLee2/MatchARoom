"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Room = {
  id: string;
  title: string;
  price?: number;
};

export default function Header() {
  const [liked, setLiked] = useState<Room[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("likedRooms");
      if (raw) setLiked(JSON.parse(raw));
    } catch (e) {
      setLiked([]);
    }
  }, []);

  return (
    <header className="w-full border-b border-gray-200 bg-white/60 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-semibold">
            MatchARoom
          </Link>
          <nav className="hidden sm:flex gap-3 text-sm text-gray-600">
            <Link href="/forum" className="hover:underline">
              Forum
            </Link>
            <Link href="/swipe" className="hover:underline">
              Swipe
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/interested" className="relative">
            <button className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              Interested
            </button>
            {liked.length > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {liked.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
