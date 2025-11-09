"use client";
import React, { useState } from "react";

export type RoomFormData = {
  title: string;
  price: string;
  image: File | string | null;
  community: string;
};

type Props = {
  onCreate: (data: RoomFormData) => void;
  communities: string[];
  onClose?: () => void;
};

export default function RoomListingForm({ onCreate, communities, onClose }: Props) {
  const [form, setForm] = useState<RoomFormData>({
    title: "",
    price: "",
    image: null,
    community: "",
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, image: file }));
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onCreate(form);
    setForm({ title: "", price: "", image: null, community: "" });
    setPreviewUrl(null);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-6 mx-auto max-w-lg rounded-2xl shadow-xl bg-white border-2 border-[#A87C5F]"
      onClick={(e) => e.stopPropagation()}
    >
      <label className="font-bold text-[#356859]">
        Title
        <input
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Room title"
          required
          className="mt-1 block w-full px-4 py-2 border rounded-full border-[#A87C5F] focus:ring-2 focus:ring-[#356859] bg-white text-[#356859]"
        />
      </label>
      <label className="font-bold text-[#356859]">
        Price&nbsp;($/month)
        <input
          name="price"
          type="text"
          value={form.price}
          onChange={handleChange}
          placeholder="Monthly price"
          required
          className="mt-1 block w-full px-4 py-2 border rounded-full border-[#A87C5F] focus:ring-2 focus:ring-[#356859] bg-white text-[#356859]"
        />
      </label>
      <label className="font-bold text-[#356859]">
        Community
        <select
          name="community"
          value={form.community}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border rounded-full border-[#A87C5F] focus:ring-2 focus:ring-[#5FB268] bg-white text-[#356859]"
        >
          <option value="">Select a community</option>
          {communities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="font-bold text-[#356859] flex flex-col">
        Room Photo
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-2 mb-1"
          style={{ maxWidth: 240 }}
        />
      </label>
      {previewUrl && <img src={previewUrl} alt="Preview" className="w-64 rounded-md border mx-auto my-4 border-[#A87C5F]" />}
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 rounded-full bg-[#356859] px-8 py-3 text-white font-extrabold shadow-lg hover:bg-green-900"
        >
          Post
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#C9B29B] px-6 py-3 text-[#356859] font-extrabold shadow-lg hover:bg-[#A87C5F] hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
