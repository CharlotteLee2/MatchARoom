"use client";

import { useEffect, useState } from "react";
import PostEditor from "./PostEditor";

type Post = {
  id: string;
  title: string;
  body: string;
  images?: string[];
};

export default function ForumList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // seed with some sample posts
    setPosts([
      {
        id: "1",
        title: "Sublet available near campus - 2 bed",
        body: "Moving out early June, $900/month, utilities included",
        images: ["/global.svg"],
      },
      {
        id: "2",
        title: "Looking for 1 roommate - quiet, tidy",
        body: "Prefer non-smoker, near bus stop",
        images: [],
      },
    ]);
  }, []);

  function handleCreate(p: Post) {
    setPosts((s) => [p, ...s]);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h2 className="mb-4 text-2xl font-semibold">Community Forum</h2>
      <PostEditor onCreate={handleCreate} />

      <div className="mt-6 space-y-4">
        {posts.map((p) => (
          <article key={p.id} className="rounded-md border p-4">
            <h3 className="text-lg font-medium">{p.title}</h3>
            <p className="mt-2 text-sm text-gray-700">{p.body}</p>
            {p.images && p.images.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {p.images.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={src} src={src} alt={p.title} className="h-24 w-full object-cover rounded" />
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
