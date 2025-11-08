"use client";

import { useState } from "react";
import SwipeCard from "./SwipeCard";

type Room = {
  id: string;
  title: string;
  description?: string;
  price?: number;
  image?: string;
};

export default function SwipeContainer({ initial }: { initial: Room[] }) {
  const [items, setItems] = useState<Room[]>(initial || []);

  function handleLike(r: Room) {
    const raw = localStorage.getItem("likedRooms") ?? "[]";
    const arr = JSON.parse(raw);
    if (!arr.find((x: any) => x.id === r.id)) arr.push(r);
    localStorage.setItem("likedRooms", JSON.stringify(arr));
    setItems((s) => s.filter((it) => it.id !== r.id));
    // small feedback
    try {
      // eslint-disable-next-line no-alert
      alert("Added to Interested");
    } catch (e) {}
  }

  function handlePass(r: Room) {
    setItems((s) => s.filter((it) => it.id !== r.id));
  }

  if (!items || items.length === 0) return <div className="text-center text-gray-600">No more listings</div>;

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div key={item.id} className="flex justify-center">
          <SwipeCard item={item} onLike={handleLike} onPass={handlePass} />
        </div>
      ))}
    </div>
  );
}
