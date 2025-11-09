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
};

export default function RoomListingForm({ onCreate, communities }: Props) {
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
      className="flex flex-col gap-4 p-6 mx-auto my-8 max-w-lg rounded-2xl shadow-xl bg-white border-2 border-blue-200"
    >
      <label className="font-bold">Room Title
        <input
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Room Title"
          required
          className="mt-1 block w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-300"
        />
      </label>
      <label className="font-bold">Monthly Price
        <input
          name="price"
          type="text"
          value={form.price}
          onChange={handleChange}
          placeholder="Monthly Price"
          required
          className="mt-1 block w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-blue-300"
        />
      </label>
      <label className="font-bold">Community
        <select
          name="community"
          value={form.community}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-4 py-2 border rounded-full focus:ring-2 focus:ring-green-300"
        >
          <option value="">Select a Community</option>
          {communities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="font-bold">Room Photo
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1"
        />
      </label>
      {previewUrl && <img src={previewUrl} alt="Preview" className="w-64 rounded-md border mx-auto my-4" />}
      <button
        type="submit"
        className="rounded-full bg-gradient-to-r from-blue-500 to-blue-700 px-8 py-3 text-white font-extrabold shadow-lg hover:from-blue-700 hover:to-blue-900"
      >Create Listing</button>
    </form>
  );
}
