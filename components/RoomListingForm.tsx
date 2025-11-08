import React, { useState } from "react";

export type RoomFormData = {
  title: string;
  price: string;
  image: File | null;
};

type RoomListingFormProps = {
  onCreate: (data: RoomFormData) => void;
};

export default function RoomListingForm({ onCreate }: RoomListingFormProps) {
  const [form, setForm] = useState<RoomFormData>({
    title: "",
    price: "",
    image: null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, image: file }));
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onCreate(form);
    setForm({ title: "", price: "", image: null });
    setPreviewUrl(null);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "400px",
        margin: "2rem auto",
        background: "#fff",
        padding: "1.5rem",
        borderRadius: "10px",
        boxShadow: "0 2px 8px #aaa",
      }}
    >
      <label style={{ fontWeight: "bold" }}>
        Room Title
        <input
          name="title"
          type="text"
          value={form.title}
          onChange={handleChange}
          placeholder="Room Title"
          required
          style={{
            width: "100%",
            padding: ".5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginTop: ".5rem",
          }}
        />
      </label>
      <label style={{ fontWeight: "bold" }}>
        Monthly Price
        <input
          name="price"
          type="text"
          value={form.price}
          onChange={handleChange}
          placeholder="Monthly Price"
          required
          style={{
            width: "100%",
            padding: ".5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginTop: ".5rem",
          }}
        />
      </label>
      <label style={{ fontWeight: "bold" }}>
        Room Photo
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginTop: ".5rem" }}
        />
      </label>
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          style={{
            width: "270px",
            borderRadius: "8px",
            margin: "1rem 0",
          }}
        />
      )}
      <button
        type="submit"
        style={{
          padding: "0.7rem 1.2rem",
          borderRadius: "6px",
          border: "none",
          background: "#3366ee",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 1px 3px #ddd",
        }}
      >
        Submit Listing
      </button>
    </form>
  );
}
