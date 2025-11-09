"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import RoomListingForm, { RoomFormData } from "../../components/RoomListingForm";
import { v4 as uuidv4 } from "uuid";

type PostWithId = RoomFormData & { id: string };

const FAKE_COMMUNITIES = [
  "Looking For a Roommate",
  "Roommate Needed ASAP",
  "Sublet/Lease Takeover",
  "Girls Roommate Search",
  "Guys Roommate Search",
  "Buffalo Apartments Connect",
  "Pets Welcome",
  "Station Residents",
  "Auden Buffalo",
  "Chestnut Place",
  "Chill Roommates",
  "Move-In Help",
  "Cheap Housing Deals"
];

const FAKE_POSTS: PostWithId[] = [
  {
    title: "1 Bedroom Open – Station (Fall)",
    price: "950",
    image: "https://www.thestationbuffalo.com/wp-content/uploads/2023/12/station-buffalo-amenities-4.jpg",
    community: "Station Residents",
    id: "1a"
  },
  {
    title: "Girls Apartment — Station, Private Bath",
    price: "960",
    image: "https://th.bing.com/th/id/OIP.vHCn7-CUiqBFKT5B4cQlwQHaE8?w=260&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.3&pid=1.7&rm=3",
    community: "Station Residents",
    id: "4d"
  },
  {
    title: "Roommate Needed for 2BR @ Auden",
    price: "825",
    image: "https://th.bing.com/th/id/OIP.6tV9GO7PoiSj2Pe-vo6vgAHaEc?w=310&h=185&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.3&pid=1.7&rm=3",
    community: "Auden Buffalo",
    id: "2b"
  },
  {
    title: "Sublet Needed @ Auden (Jan–May)",
    price: "830",
    image: "https://th.bing.com/th/id/OIP.uT4whbocU-LcVhNKPAwfhAHaEc?w=306&h=183&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.3&pid=1.7&rm=3",
    community: "Auden Buffalo",
    id: "5e"
  },
  {
    title: "1 Room Available – Chestnut Place (Spring Sublet)",
    price: "900",
    image: "https://th.bing.com/th/id/OIP.OPVm3QTeOeb7bpToo6GXNwHaFj?w=210&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.3&pid=1.7&rm=3",
    community: "Chestnut Place",
    id: "3c"
  },
  {
    title: "3 Bedroom – Chestnut, All Genders Welcome",
    price: "860",
    image: "https://th.bing.com/th/id/OIP.vNGsYCp1tPs7Zt96yDM0KQHaFj?w=211&h=181&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.3&pid=1.7&rm=3",
    community: "Chestnut Place",
    id: "6f"
  },
  {
    title: "Private Bedroom – Chestnut Place, Summer Lease",
    price: "910",
    image: "https://th.bing.com/th/id/OIP.OPVm3QTeOeb7bpToo6GXNwHaFj?w=210&h=180&c=7&r=0&o=7&cb=ucfimgc2&dpr=1.3&pid=1.7&rm=3",
    community: "Chestnut Place",
    id: "7g"
  }
];

export default function ForumPage() {
  const [posts, setPosts] = useState<PostWithId[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState("");
  const [communities, setCommunities] = useState<string[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    setPosts(FAKE_POSTS);
    setCommunities(FAKE_COMMUNITIES);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("forumposts", JSON.stringify(FAKE_POSTS));
      window.localStorage.setItem("communities", JSON.stringify(FAKE_COMMUNITIES));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("forumposts", JSON.stringify(posts));
      window.localStorage.setItem("communities", JSON.stringify(communities));
    }
  }, [posts, communities]);

  function getImageUrl(image: File | string | null | undefined): string | null {
    if (!image) return null;
    if (typeof image === "string") return image;
    if (typeof window !== "undefined" && image instanceof File) {
      return URL.createObjectURL(image);
    }
    return null;
  }

  function handleCreate(newPost: RoomFormData) {
    const toAdd: PostWithId = { ...newPost, id: uuidv4() };
    setPosts(prev => [toAdd, ...prev]);
    setShowForm(false);
  }

  function handleAddCommunity(e: React.FormEvent) {
    e.preventDefault();
    if (newCommunity.trim() && !communities.includes(newCommunity.trim())) {
      setCommunities(prev => [...prev, newCommunity.trim()]);
      setNewCommunity("");
      setShowCommunityModal(false);
    }
  }

  const filtered = search && communities.includes(search)
    ? posts.filter(p => p.community === search)
    : posts.filter(
        p =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.price.toLowerCase().includes(search.toLowerCase())
      );

  return (
    <main className="py-20">
      <div className="mx-auto max-w-4xl px-6 text-gray-600">

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSearch("")}
            className={`px-3 py-1 rounded-full border ${search === "" ? "bg-blue-600 text-white" : "bg-white text-blue-800 border-blue-200"} transition font-medium`}
          >
            All
          </button>
          {communities.map(comm => (
            <button
              key={comm}
              onClick={() => setSearch(comm)}
              className={`px-3 py-1 rounded-full border ${search === comm ? "bg-blue-600 text-white" : "bg-white text-blue-800 border-blue-200"} transition font-medium`}
            >
              {comm}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-semibold">Community Forum</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(show => !show)}
              className="rounded-full bg-blue-600 px-5 py-2 font-semibold text-white shadow transition hover:bg-blue-700"
            >
              {showForm ? "Close" : "Create Post"}
            </button>
            <button
              onClick={() => setShowCommunityModal(true)}
              className="rounded-full bg-green-600 px-5 py-2 font-semibold text-white shadow transition hover:bg-green-700"
            >
              Create Community
            </button>
          </div>
        </div>

        {showCommunityModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <form
              onSubmit={handleAddCommunity}
              className="bg-white rounded shadow p-6 flex flex-col"
              style={{ minWidth: 280 }}
            >
              <label className="mb-2 font-semibold">Community Name:</label>
              <input
                type="text"
                value={newCommunity}
                onChange={e => setNewCommunity(e.target.value)}
                className="border rounded px-2 py-1 mb-4"
                required
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 rounded text-white px-4 py-1"
                >Create</button>
                <button
                  type="button"
                  className="bg-gray-300 rounded px-3"
                  onClick={() => setShowCommunityModal(false)}
                >Cancel</button>
              </div>
            </form>
          </div>
        )}

        <input
          type="text"
          placeholder="Search room titles or prices..."
          className="flex-grow rounded-full border px-4 py-2 shadow-sm focus:outline-none mr-4 w-full mb-8"
          value={search && !communities.includes(search) ? search : ""}
          onChange={e => setSearch(e.target.value)}
        />

        {showForm &&
          <RoomListingForm
            onCreate={handleCreate}
            communities={communities}
          />
        }
        {filtered.length === 0 && (
          <div className="mb-8 text-center text-gray-400">No posts found.</div>
        )}
        <div className="space-y-8">
          {filtered.map(p => (
            <article key={p.id} className="rounded-md border p-4">
              <Link
                href={`/forum/${p.id}`}
                className="text-lg font-medium text-blue-600 hover:underline"
              >
                {p.title}
              </Link>
              {p.community && (
                <span className="ml-2 text-sm bg-blue-50 px-2 py-1 rounded">
                  {p.community}
                </span>
              )}
              <div className="font-bold text-blue-600">${p.price}</div>
              {p.image && getImageUrl(p.image) && (
                <img
                  src={getImageUrl(p.image)!}
                  alt={p.title}
                  className="mt-2 w-full max-w-xs rounded cursor-pointer transition hover:scale-105"
                  style={{ maxHeight: 128 }}
                  onClick={e => {
                    e.preventDefault();
                    setModalImage(getImageUrl(p.image)!);
                  }}
                />
              )}
            </article>
          ))}
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
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
