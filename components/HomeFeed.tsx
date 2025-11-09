"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type PostWithId = {
  id: string;
  title: string;
  price: string;
  image: string | null;
  community: string;
  createdAt: string;
  author?: string;
};

export default function HomeFeed() {
  const [posts, setPosts] = useState<PostWithId[]>([]);
  const [userCommunities, setUserCommunities] = useState<string[]>([]);
  const [_, forceUpdate] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load user's joined communities
      try {
        const raw = localStorage.getItem("userCommunities");
        if (raw) setUserCommunities(JSON.parse(raw));
      } catch (e) {
        setUserCommunities([]);
      }

      // Load posts from localStorage
      try {
        const storedPosts = localStorage.getItem("forumposts");
        if (storedPosts) {
          setPosts(JSON.parse(storedPosts));
        }
      } catch (e) {
        setPosts([]);
      }
    }
  }, []);

  function formatTimeAgo(dateString: string): string {
    // Default to November 9, 2024 if no date provided
    let date: Date;
    if (!dateString) {
      date = new Date('2024-11-09');
    } else {
      date = new Date(dateString);
      if (isNaN(date.getTime())) {
        date = new Date('2024-11-09');
      }
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffSecs < 60) return `${Math.max(0, diffSecs)}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    return date.toLocaleDateString();
  }

  function toggleFavorite(postId: string) {
    if (typeof window === "undefined") return;
    const key = `like_${postId}`;
    const alreadyLiked = window.localStorage.getItem(key) === "1";
    if (alreadyLiked) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, "1");
    }
    forceUpdate(n => n + 1);
  }

  // Filter posts to only show those from communities the user has joined
  const filteredPosts = posts
    .filter(p => p.community && userCommunities.includes(p.community))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (userCommunities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">You haven't joined any communities yet.</p>
        <Link
          href="/explore"
          className="inline-block px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition-colors duration-200"
        >
          Explore Communities
        </Link>
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">No posts yet from your communities.</p>
        <p className="text-sm text-gray-500">Check back later for new posts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredPosts.map(post => {
        const isFavorited = typeof window !== "undefined" && window.localStorage.getItem(`like_${post.id}`) === "1";
        return (
          <article
            key={post.id}
            className="bg-white border border-[#A87C5F] rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Post Header */}
            <div className="px-4 pt-3 pb-2">
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                <Link
                  href={`/explore?filter=${encodeURIComponent(post.community)}`}
                  className="font-semibold text-[#356859] hover:underline"
                >
                  {post.community}
                </Link>
                <span>•</span>
                {post.author && (
                  <>
                    <span>Posted by {post.author}</span>
                    <span>•</span>
                  </>
                )}
                <span>{formatTimeAgo(post.createdAt)}</span>
              </div>

              {/* Post Title */}
              <Link href={`/explore/${post.id}`}>
                <h2 className="text-xl font-bold text-[#356859] hover:text-green-700 mb-2">
                  {post.title}
                </h2>
              </Link>

              {/* Price */}
              <div className="text-lg font-bold text-[#356859] mb-3">
                ${post.price}/month
              </div>
            </div>

            {/* Post Image */}
            {post.image && (
              <Link href={`/explore/${post.id}`}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                />
              </Link>
            )}

            {/* Post Footer */}
            <div className="px-4 py-2 flex items-center gap-4 border-t border-gray-200">
              <button
                onClick={() => toggleFavorite(post.id)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#356859] transition"
              >
                <span className="text-lg">{isFavorited ? "🫒" : "🤎"}</span>
                <span>{isFavorited ? "Favorited" : "Favorite"}</span>
              </button>
              <Link
                href={`/explore/${post.id}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#356859] transition"
              >
                <span>💬</span>
                <span>Comments</span>
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
