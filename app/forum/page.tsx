"use client";

import { useState } from "react";
import Link from "next/link";
import RoomListingForm, { RoomFormData } from "../../components/RoomListingForm";

export default function ForumPage() {
  const [posts, setPosts] = useState<RoomFormData[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  function handleCreate(newPost: RoomFormData) {
    setPosts((prev) => [newPost, ...prev]);
    setShowForm(false); // Hide form after creation
  }

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.price.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="py-20">
      <div className="mx-auto max-w-4xl px-6 text-gray-600">

        {/* SEARCH BAR */}
        <div className="flex w-full mb-8">
          <input
            type="text"
            placeholder="Search room titles or prices..."
            className="flex-grow rounded-full border px-4 py-2 shadow-sm focus:outline-none mr-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* HEADER AND CREATE BUTTON */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-semibold">Community Forum</h2>
          <button
            onClick={() => setShowForm((show) => !show)}
            className="ml-4 rounded-full bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 shadow"
          >
            {showForm ? "Close" : "Create Post"}
          </button>
        </div>

        {/* LISTING FORM */}
        {showForm && (
          <div className="mb-6">
            <RoomListingForm onCreate={handleCreate} />
          </div>
        )}

        {/* POST LIST */}
        {filtered.length === 0 && (
          <div className="mb-8 text-center text-gray-400">
            No posts found.
          </div>
        )}

        <div className="space-y-4">
          {filtered.map((p, i) => (
            <article key={i} className="rounded-md border p-4">
              <h3 className="text-lg font-medium">{p.title}</h3>
              <div className="font-bold text-blue-600">${p.price}</div>
              {p.image && (
                <img
                  src={URL.createObjectURL(p.image)}
                  alt={p.title}
                  className="mt-2 w-full max-w-xs rounded"
                  style={{ maxHeight: 128 }}
                />
              )}
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
