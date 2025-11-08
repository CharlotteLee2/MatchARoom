"use client";
import { useState } from "react";
import Link from "next/link";
import RoomListingForm, { RoomFormData } from "../../components/RoomListingForm";

type Reply = { text: string };
type Comment = { text: string; replies?: Reply[] };

// File or string url support
function getImageUrl(image: File | string | null): string | null {
  if (!image) return null;
  if (typeof image === "string") return image;
  return URL.createObjectURL(image);
}

export default function ForumPage() {
  const [posts, setPosts] = useState<RoomFormData[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [showInterested, setShowInterested] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<{ postIdx: number; commentIdx: number } | null>(null);

  function handleCreate(newPost: RoomFormData) {
    setPosts(prev => [newPost, ...prev]);
    setShowForm(false);
  }
  function toggleLike(index: number) {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }
  function addComment(index: number, text: string) {
    setComments(prev => {
      const next = { ...prev };
      if (!next[index]) next[index] = [];
      next[index] = [...next[index], { text }];
      return next;
    });
  }
  function addReply(postIdx: number, commentIdx: number, text: string) {
    setComments(prev => {
      const postComments = prev[postIdx] || [];
      const updated = postComments.map((c, i) =>
        i === commentIdx
          ? { ...c, replies: [...(c.replies || []), { text }] }
          : c
      );
      return { ...prev, [postIdx]: updated };
    });
    setReplyTo(null);
  }

  const displayedPosts = posts
    .map((p, i) => ({ ...p, _idx: i }))
    .filter(({ title, price, _idx }) =>
      (title.toLowerCase().includes(search.toLowerCase()) ||
        price.toLowerCase().includes(search.toLowerCase())) &&
      (!showInterested || likedPosts.has(_idx))
    );

  return (
    <main className="py-20">
      <div className="mx-auto max-w-4xl px-6 text-gray-600">

        {/* SEARCH BAR (top, rounded) */}
        <div className="flex w-full mb-8">
          <input
            type="text"
            placeholder="Search room titles or prices..."
            className="flex-grow rounded-full border px-4 py-2 shadow-sm focus:outline-none mr-4"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* HEADER + CREATE POST + INTERESTED BUTTONS */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-semibold">Community Forum</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowInterested(i => !i)}
              className={`rounded-full px-5 py-2 font-medium shadow
                ${showInterested ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-700"}
                transition hover:bg-yellow-600`}
            >
              Interested
            </button>
            <button
              onClick={() => setShowForm(show => !show)}
              className="rounded-full bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 shadow"
            >
              {showForm ? "Close" : "Create Post"}
            </button>
          </div>
        </div>

        {/* POST FORM */}
        {showForm && (
          <div className="mb-6">
            <RoomListingForm onCreate={handleCreate} />
          </div>
        )}

        {/* NO RESULTS */}
        {displayedPosts.length === 0 && (
          <div className="mb-8 text-center text-gray-400">
            {showInterested ? "No interested posts yet." : "No posts found."}
          </div>
        )}

        {/* POSTS LIST */}
        <div className="space-y-8">
          {displayedPosts.map((p, idx) => (
            <article key={p._idx} className="rounded-md border p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-medium">{p.title}</h3>
                <button
                  aria-label="Like"
                  onClick={() => toggleLike(p._idx!)}
                  className="text-red-500 hover:text-red-600 text-xl"
                >
                  {likedPosts.has(p._idx!) ? (
                    <span>&#10084;&#65039;</span>
                  ) : (
                    <span>&#9825;</span>
                  )}
                </button>
              </div>
              <div className="font-bold text-blue-600">${p.price}</div>
              {p.image && getImageUrl(p.image) && (
                <img
                  src={getImageUrl(p.image)!}
                  alt={p.title}
                  className="mt-2 w-full max-w-xs rounded cursor-pointer transition hover:scale-105"
                  style={{ maxHeight: 128 }}
                  onClick={() => setModalImage(getImageUrl(p.image)!)}
                />
              )}
              {/* COMMENTS SECTION */}
              <div className="mt-6">
                <h4 className="font-semibold mb-2 text-base">Comments</h4>
                <ul className="mb-2 space-y-2">
                  {(comments[p._idx!] || []).map((c, ci) => (
                    <li key={ci} className="border rounded px-2 py-1 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span>{c.text}</span>
                        <button
                          className="text-xs text-blue-600 hover:underline ml-4"
                          type="button"
                          onClick={() => setReplyTo({ postIdx: p._idx!, commentIdx: ci })}
                        >
                          Reply
                        </button>
                      </div>
                      {/* Replies */}
                      {c.replies && c.replies.length > 0 && (
                        <ul className="ml-6 mt-2 space-y-1 text-sm text-gray-700">
                          {c.replies.map((r, ri) => (
                            <li key={ri} className="pl-2 border-l">{r.text}</li>
                          ))}
                        </ul>
                      )}
                      {/* Reply form */}
                      {replyTo &&
                        replyTo.postIdx === p._idx! &&
                        replyTo.commentIdx === ci && (
                          <ReplyForm
                            onSubmit={text =>
                              addReply(p._idx!, ci, text)
                            }
                            onCancel={() => setReplyTo(null)}
                          />
                        )}
                    </li>
                  ))}
                </ul>
                <CommentForm
                  onSubmit={text => addComment(p._idx!, text)}
                />
              </div>
            </article>
          ))}
        </div>

        {/* MODAL for fullscreen image */}
        {modalImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setModalImage(null)}
            style={{ cursor: "zoom-out" }}
          >
            <img
              src={modalImage}
              alt="Full Size Room"
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
              onClick={e => e.stopPropagation()}
            />
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-4 right-4 text-white text-3xl font-bold"
              aria-label="Close"
            >&times;</button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

// Comment form
function CommentForm({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <form
      className="flex gap-2"
      onSubmit={e => {
        e.preventDefault();
        if (text.trim()) {
          onSubmit(text.trim());
          setText("");
        }
      }}
    >
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a comment..."
        className="rounded-full border px-3 py-1 flex-grow"
      />
      <button
        type="submit"
        className="rounded bg-blue-500 px-4 py-1 text-white font-medium hover:bg-blue-600"
      >
        Send
      </button>
    </form>
  );
}

// Reply form
function ReplyForm({
  onSubmit,
  onCancel
}: {
  onSubmit: (text: string) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState("");
  return (
    <form
      className="flex gap-2 mt-2 ml-4"
      onSubmit={e => {
        e.preventDefault();
        if (text.trim()) {
          onSubmit(text.trim());
          setText("");
        }
      }}
    >
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Reply..."
        className="rounded-full border px-2 py-0.5 flex-grow"
      />
      <button
        type="submit"
        className="rounded bg-blue-400 px-3 py-1 text-white text-xs hover:bg-blue-600"
      >
        Reply
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded bg-gray-300 px-2 py-1 text-xs ml-1"
      >
        Cancel
      </button>
    </form>
  );
}
