"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { RoomFormData } from "../../../components/RoomListingForm";

type Reply = { text: string };
type Comment = { text: string; replies?: Reply[] };
type PostWithId = RoomFormData & { id: string };

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
  const [post, setPost] = useState<PostWithId | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [otherPosts, setOtherPosts] = useState<PostWithId[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("forumposts");
    if (stored) {
      const arr = JSON.parse(stored);
      const found = arr.find((p: any) => p.id === id);
      setPost(found ?? null);
      setOtherPosts(arr.filter((p: any) => p.id !== id));
    }
    const cs = window.localStorage.getItem("forumcomments_" + id);
    if (cs) setComments(JSON.parse(cs));
  }, [id]);

  useEffect(() => {
    if (!id || typeof window === "undefined") return;
    window.localStorage.setItem("forumcomments_" + id, JSON.stringify(comments));
  }, [comments, id]);

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

  if (!post) return <div className="p-12 text-center text-[#A87C5F]">Post not found.</div>;

  return (
    <main className="py-10 bg-[#F5EEE6] min-h-screen">
      <div className="mx-auto max-w-lg px-2">
        {/* POST CARD */}
        <div className="bg-white rounded-lg shadow px-4 py-3 mb-6 flex flex-col gap-3 border border-[#A87C5F]">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold truncate text-[#356859]">{post.title}</h2>
            <button
              onClick={toggleLike}
              className={`text-lg ${liked ? "text-[#356859]" : "text-[#C9B29B]"}`}
              aria-label="Like"
              title={liked ? "Unlike" : "Like"}
            >
              {liked ? <span>🫒</span> : <span>🤎</span>}
            </button>
          </div>
          <div className="flex items-center text-sm gap-2">
            {post.community && (
              <span className="bg-[#F5EEE6] text-[#A87C5F] px-2 py-1 rounded-full font-medium">{post.community}</span>
            )}
            <span className="text-[#356859] ml-auto font-semibold">${post.price}</span>
          </div>
          {post.image && getImageUrl(post.image) && (
            <img
              src={getImageUrl(post.image)!}
              alt={post.title}
              className="rounded-md cursor-pointer my-2 transition hover:scale-105 max-h-56 object-cover w-full shadow border border-[#A87C5F]"
              onClick={() => setModalImage(getImageUrl(post.image)!)}
            />
          )}
        </div>
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

        <div className="bg-[#F5EEE6] rounded-lg shadow p-4 border border-[#A87C5F]">
          <h4 className="font-semibold text-[#356859] mb-3 text-base">Comments</h4>
          <ul className="mb-3 space-y-2 text-[15px]">
            {comments.map((c, ci) => (
              <li key={ci} className="border rounded px-2 py-1 bg-white flex flex-col gap-1 border-[#A87C5F]">
                <div className="flex justify-between items-center">
                  <span>{c.text}</span>
                  <button
                    className="text-xs text-[#356859] hover:underline ml-2"
                    type="button"
                    onClick={() => setReplyTo(ci)}
                  >
                    Reply
                  </button>
                </div>
                {c.replies && c.replies.length > 0 && (
                  <ul className="pl-4 mt-1 text-sm text-[#A87C5F] border-l border-[#C9B29B] space-y-1">
                    {c.replies.map((r, ri) => (
                      <li key={ri}>{r.text}</li>
                    ))}
                  </ul>
                )}
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
        <button
          onClick={() => router.back()}
          className="text-[#356859] hover:underline mt-6 text-sm mx-auto block"
        >
          Back
        </button>
        {otherPosts.length > 0 && (
          <div className="mt-10">
            <h5 className="font-semibold text-[#A87C5F] mb-2 text-base">Other Threads</h5>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {otherPosts.slice(0, 4).map(p => (
                <a
                  key={p.id}
                  href={`/explore/${p.id}`}
                  className="flex flex-col bg-white border border-[#A87C5F] rounded-lg shadow hover:bg-[#F5EEE6] transition px-3 py-2 cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold truncate text-[#356859]">{p.title}</span>
                    <span className="text-xs text-[#2B463C]">${p.price}</span>
                  </div>
                  {p.image && (
                    <img
                      src={typeof p.image === "string" ? p.image : ""}
                      alt={p.title}
                      className="rounded h-20 w-full object-cover mt-1"
                    />
                  )}
                  <span className="mt-1 text-xs text-[#A87C5F]">{p.community}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// Comments form
function CommentForm({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <form
      className="flex gap-2 mt-1"
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
        className="rounded-full border border-[#A87C5F] px-3 py-1 flex-grow text-sm bg-[#F5EEE6] text-[#356859]"
      />
      <button
        type="submit"
        className="rounded bg-[#356859] px-4 py-1.5 text-white font-medium hover:bg-green-900 text-sm"
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
      className="flex gap-2 mt-2"
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
        className="rounded-full border border-[#A87C5F] px-2 py-0.5 flex-grow text-sm bg-[#F5EEE6] text-[#356859]"
      />
      <button
        type="submit"
        className="rounded bg-[#A87C5F] px-3 py-1 text-white text-xs hover:bg-[#6D4E2E]"
      >
        Reply
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="rounded bg-[#C9B29B] px-2 py-1 text-xs ml-1"
      >
        Cancel
      </button>
    </form>
  );
}
