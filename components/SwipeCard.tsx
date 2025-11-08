"use client";

import { useState } from "react";

type Room = {
  id: string;
  title: string;
  description?: string;
  price?: number;
  image?: string;
};

export default function SwipeCard({ item, onLike, onPass }: { item: Room; onLike: (r: Room) => void; onPass: (r: Room) => void }) {
  const [isAnimating, setIsAnimating] = useState(false);

  function like() {
    setIsAnimating(true);
    setTimeout(() => onLike(item), 200);
  }
  function pass() {
    setIsAnimating(true);
    setTimeout(() => onPass(item), 200);
  }

  return (
    <div className={`mx-auto max-w-md rounded-lg border bg-white p-4 shadow ${isAnimating ? "opacity-60" : ""}`}>
      <div className="h-48 w-full overflow-hidden rounded-md bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.image ?? "/global.svg"} alt={item.title} className="h-full w-full object-cover" />
      </div>
      <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
      <p className="mt-1 text-sm text-gray-600">{item.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-lg font-medium">${item.price ?? "—"}</div>
        <div className="flex gap-2">
          <button onClick={pass} className="rounded bg-gray-200 px-3 py-1 text-sm">
            Pass
          </button>
          <button onClick={like} className="rounded bg-green-600 px-3 py-1 text-sm text-white">
            Like
          </button>
        </div>
      </div>
    </div>
  );
}
