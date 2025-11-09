"use client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { RoomFormData } from "../../../components/RoomListingForm";

type Reply = { text: string };
type Comment = { text: string; replies?: Reply[] };

function getImageUrl(image: File | string | null | undefined): string | null {
  if (!image) return null;
  if (typeof image === "string") return image;
  if (typeof window !== "undefined" && image instanceof File) {
    return URL.createObjectURL(image);
  }
  return null;
}

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<(RoomFormData & { id: string }) | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("forumposts");
    if (stored) {
      const arr = JSON.parse(stored);
      const found = arr.find((p: any) => p.id === id);
      setPost(found ?? null);
    }
    const cs = window.localStorage.getItem("forumcomments_" + id);
    if (cs) setComments(JSON.parse(cs));
  }, [id]);

  useEffect(() => {
    if (!id || typeof window === "undefined") return;
    window.localStorage.setItem("forumcomments_" + id, JSON.stringify(comments));
  }, [comments, id]);

  // Like logic per post (optional, see above for like button code)
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !id) return;
    setLiked(!!window.localStorage.getItem("like_" + id));
  }, [id]);
  function toggleLike() {
    if (!id) return;
    if (!liked) window.localStorage.setItem("like_" + id, "1");
    else window.localStorage.removeItem("like_" + id);
    setLiked(l => !l);
  }

  function addComment(text: string) {
    setComments(prev => [...prev, { text }]);
  }
  function addReply(commentIdx: number, text: string) {
    setComments(prev =>
      prev.map((c, i) =>
        i === commentIdx
          ? { ...c, replies: [...(c.replies || []), { text }] }
          : c
      )
    );
    setReplyTo(null);
  }

  if (!post) return <div className="p-12 text-center">Post not found.</div>;

  return (
    <main className="py-20">
      <div className="mx-auto max-w-2xl px-6 text-gray-600">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-2xl font-semibold">{post.title}</h2>
          <button
            onClick={toggleLike}
            className={`text-xl ml-2 ${liked ? "text-red-600" : "text-gray-400"}`}
            aria-label="Like"
          >
            {liked ? <span>&#10084;&#65039;</span> : <span>&#9825;</span>}
          </button>
        </div>
        {post.community && (
          <span className="mb-2 inline-block text-sm bg-blue-50 px-2 py-1 rounded">
            {post.community}
          </span>
        )}
        <div className="font-bold text-blue-600 mb-2">${post.price}</div>

        {/* Ensure image is always shown if available */}
        {post.image && getImageUrl(post.image) && (
          <img
            src={getImageUrl(post.image)!}
            alt={post.title}
            className="rounded mb-4 cursor-pointer hover:scale-105 transition"
            style={{ maxHeight: 300 }}
            onClick={() => setModalImage(getImageUrl(post.image)!)}
          />
        )}
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

        {/* Comment thread */}
        <div className="mt-6">
          <h4 className="font-semibold mb-2 text-base">Comments</h4>
          <ul className="mb-2 space-y-2">
            {comments.map((c, ci) => (
              <li key={ci} className="border rounded px-2 py-1 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span>{c.text}</span>
                  <button
                    className="text-xs text-blue-600 hover:underline ml-4"
                    type="button"
                    onClick={() => setReplyTo(ci)}
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
                {replyTo === ci && (
                  <ReplyForm
                    onSubmit={text => addReply(ci, text)}
                    onCancel={() => setReplyTo(null)}
                  />
                )}
              </li>
            ))}
          </ul>
          <CommentForm onSubmit={addComment} />
        </div>
        <button onClick={() => router.back()} className="text-blue-600 hover:underline mt-8 block">
          Back
        </button>
      </div>
    </main>
  );
}

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
