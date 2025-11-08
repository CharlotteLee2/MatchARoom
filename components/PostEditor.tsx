"use client";

import { useState } from "react";

type Post = {
  id: string;
  title: string;
  body: string;
  images?: string[];
};

export default function PostEditor({ onCreate }: { onCreate: (p: Post) => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<string[]>([]);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const list: string[] = [];
    Array.from(files).slice(0, 4).forEach((file) => {
      const url = URL.createObjectURL(file);
      list.push(url);
    });
    setImages((s) => [...s, ...list]);
  }

  function submit() {
    if (!title) return;
    const post: Post = {
      id: String(Date.now()),
      title,
      body,
      images,
    };
    onCreate(post);
    setTitle("");
    setBody("");
    setImages([]);
  }

  return (
    <div className="rounded-md border p-4">
      <input
        className="mb-2 w-full rounded border px-3 py-2"
        placeholder="Thread title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="mb-2 w-full rounded border px-3 py-2"
        placeholder="Describe the room, preferences, price..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="mb-2 flex items-center gap-2">
        <label className="cursor-pointer rounded bg-gray-100 px-3 py-1 text-sm">
          Add images
          <input className="hidden" type="file" accept="image/*" multiple onChange={handleFiles} />
        </label>
        <button className="ml-auto rounded bg-blue-600 px-3 py-1 text-sm text-white" onClick={submit}>
          Create Thread
        </button>
      </div>
      {images.length > 0 && (
        <div className="mt-2 grid grid-cols-4 gap-2">
          {images.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="preview" className="h-20 w-full object-cover rounded" />
          ))}
        </div>
      )}
    </div>
  );
}
