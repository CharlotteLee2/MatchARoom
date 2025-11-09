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
  }
];

export default function ExplorePage() {
  const [posts, setPosts] = useState<PostWithId[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState("");
  const [communities, setCommunities] = useState<string[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [_, forceUpdate] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("create") === "1") setShowForm(true);
    }
  }, []);

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

  const favorites = posts.filter(
    p => typeof window !== "undefined" && window.localStorage.getItem(`like_${p.id}`) === "1"
  );

  const filtered = search && communities.includes(search)
    ? posts.filter(p => p.community === search)
    : posts.filter(
        p =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.price.toLowerCase().includes(search.toLowerCase())
      );

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

  return (
    <main className="py-20 bg-[#F5EEE6] min-h-screen">
      <div className="mx-auto max-w-4xl px-6 text-[#356859]">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="rounded-full bg-[#356859] px-5 py-2 font-semibold text-white shadow hover:bg-green-900"
          >
            + Create Post
          </button>
          <button
            onClick={() => setShowCommunityModal(true)}
            className="rounded-full bg-[#A87C5F] px-5 py-2 font-semibold text-white shadow hover:bg-[#6D4E2E]"
          >
            Create Community
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSearch("")}
            className={`px-3 py-1 rounded-full border transition font-medium ${
              search === ""
                ? "bg-[#356859] text-white border-[#A87C5F]"
                : "bg-[#F5EEE6] text-[#356859] border-[#A87C5F]"
            }`}
          >
            All
          </button>
          {communities.map(comm => (
            <button
              key={comm}
              onClick={() => setSearch(comm)}
              className={`px-3 py-1 rounded-full border transition font-medium ${
                search === comm
                  ? "bg-[#356859] text-white border-[#A87C5F]"
                  : "bg-[#F5EEE6] text-[#356859] border-[#A87C5F]"
              }`}
            >
              {comm}
            </button>
          ))}
        </div>
        {favorites.length > 0 && (
          <div className="mb-8">
            <div className="font-semibold mb-1 text-[#356859]">Your Favorites</div>
            <div className="flex gap-4 overflow-auto pb-2">
              {favorites.map(f => (
                <Link
                  href={`/explore/${f.id}`}
                  key={f.id}
                  className="min-w-[200px] max-w-[220px] bg-[#F5EEE6] rounded shadow border border-[#A87C5F] hover:shadow-md flex flex-col items-center p-2"
                >
                  <img
                    src={typeof f.image === "string" ? f.image : ""}
                    alt={f.title}
                    className="w-full h-20 object-cover rounded mb-1"
                  />
                  <span
                    className="font-medium text-xs text-[#356859] leading-tight break-words w-full text-center"
                    style={{
                      maxWidth: "180px",
                      overflowWrap: "break-word",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      display: "block"
                    }}
                  >
                    {f.title}
                  </span>
                  <span className="text-xs text-[#A87C5F]">{f.community}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
        {showCommunityModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
            <form
              onSubmit={handleAddCommunity}
              className="bg-[#F5EEE6] rounded shadow p-6 flex flex-col border border-[#A87C5F]"
              style={{ minWidth: 280 }}
            >
              <label className="mb-2 font-semibold text-[#356859]">Community Name:</label>
              <input
                type="text"
                value={newCommunity}
                onChange={e => setNewCommunity(e.target.value)}
                className="border rounded px-2 py-1 mb-4 border-[#A87C5F] bg-white text-[#356859]"
                required
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#356859] rounded text-white px-4 py-1 font-semibold"
                >Create</button>
                <button
                  type="button"
                  className="bg-[#C9B29B] rounded px-3 font-semibold"
                  onClick={() => setShowCommunityModal(false)}
                >Cancel</button>
              </div>
            </form>
          </div>
        )}
        <input
          type="text"
          placeholder="Search room titles or prices..."
          className="flex-grow rounded-full border border-[#A87C5F] px-4 py-2 shadow-sm focus:outline-none mr-4 w-full mb-8 bg-[#F5EEE6] text-[#356859]"
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
          <div className="mb-8 text-center text-[#C9B29B]">No posts found.</div>
        )}
        <div className="space-y-8">
          {filtered.map(p => {
            const isFavorited = typeof window !== "undefined" && window.localStorage.getItem(`like_${p.id}`) === "1";
            return (
            <article key={p.id} className="rounded-md border border-[#A87C5F] bg-white p-4 relative">
              <Link
                href={`/explore/${p.id}`}
                className="text-lg font-medium text-[#356859] hover:underline"
              >
                {p.title}
              </Link>
              {p.community && (
                <span className="ml-2 text-sm bg-[#F5EEE6] text-[#A87C5F] px-2 py-1 rounded">
                  {p.community}
                </span>
              )}
              <div className="font-bold text-[#356859]">${p.price}</div>
              {p.image && getImageUrl(p.image) && (
                <img
                  src={getImageUrl(p.image)!}
                  alt={p.title}
                  className="mt-2 w-full max-w-xs rounded cursor-pointer transition hover:scale-105 border border-[#A87C5F]"
                  style={{ maxHeight: 128 }}
                  onClick={e => {
                    e.preventDefault();
                    setModalImage(getImageUrl(p.image)!);
                  }}
                />
              )}
              <button
                onClick={() => toggleFavorite(p.id)}
                style={{
                  background: "none",
                  border: "none",
                  position: "absolute",
                  right: 8,
                  top: 8,
                  cursor: "pointer",
                  fontSize: 22
                }}
                aria-label={isFavorited ? "Unfavorite" : "Favorite"}
              >
                {isFavorited ? "🫒" : "🤎"}
              </button>
            </article>
          )})}
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
      </div>
    </main>
  );
}
