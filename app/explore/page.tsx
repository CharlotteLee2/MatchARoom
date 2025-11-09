"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import RoomListingForm, { RoomFormData } from "../../components/RoomListingForm";
import { getListings, getSites } from "./actions";

type PostWithId = RoomFormData & { id: string };


export default function ExplorePage() {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<PostWithId[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState("");
  const [communities, setCommunities] = useState<string[]>([]);
  const [userCommunities, setUserCommunities] = useState<string[]>([]);
  const [allUserCreatedCommunities, setAllUserCreatedCommunities] = useState<string[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [_, forceUpdate] = useState(0);
  const [showUserCommunitiesDropdown, setShowUserCommunitiesDropdown] = useState(false);

  // Load initial data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load user's joined communities
      try {
        const raw = localStorage.getItem("userCommunities");
        if (raw) setUserCommunities(JSON.parse(raw));
      } catch (e) {
        setUserCommunities([]);
      }

      // Load all user-created communities (global list)
      try {
        const allCommunitiesRaw = localStorage.getItem("allUserCreatedCommunities");
        if (allCommunitiesRaw) setAllUserCreatedCommunities(JSON.parse(allCommunitiesRaw));
      } catch (e) {
        setAllUserCreatedCommunities([]);
      }
    }
  }, []);

  // React to URL parameter changes
  useEffect(() => {
    const createParam = searchParams.get("create");
    if (createParam === "1") setShowForm(true);

    const filterParam = searchParams.get("filter");
    if (filterParam) {
      setSearch(filterParam);
    } else {
      setSearch("");
    }
  }, [searchParams]);

  // Lock scroll when form is open
  useEffect(() => {
    if (showForm) {
      // Get scrollbar width before hiding it
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [showForm]);

  // Fetch data from database
  useEffect(() => {
    async function fetchData() {
      try {
        const [listingsData, sitesData] = await Promise.all([
          getListings(),
          getSites()
        ]);
        
        setPosts(listingsData);
        setCommunities(sitesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    
    fetchData();
  }, []);


  function getImageUrl(image: File | string | null | undefined): string | null {
    if (!image) return null;
    if (typeof image === "string") return image;
    if (typeof window !== "undefined" && image instanceof File) {
      return URL.createObjectURL(image);
    }
    return null;
  }

  async function handleCreate(newPost: RoomFormData) {
    // Convert File to data URL if needed
    let imageUrl: string | null = null;
    if (newPost.image instanceof File) {
      imageUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(newPost.image as File);
      });
    } else if (typeof newPost.image === 'string') {
      imageUrl = newPost.image;
    }

    // Note: In a real implementation, you'd save to database here
    // For now, we'll add it to the local state and refetch
    const toAdd: PostWithId = { ...newPost, image: imageUrl, id: Date.now().toString() };
    setPosts(prev => [toAdd, ...prev]);
    setShowForm(false);
    
    // Refetch from database to get updated list
    try {
      const listingsData = await getListings();
      setPosts(listingsData);
    } catch (error) {
      console.error("Error refetching data:", error);
    }
  }

  function handleAddCommunity(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newCommunity.trim();
    if (trimmed && !communities.includes(trimmed) && !allUserCreatedCommunities.includes(trimmed)) {
      // Add to user's joined communities
      const updatedUserCommunities = [...userCommunities, trimmed];
      setUserCommunities(updatedUserCommunities);

      // Add to global list of all user-created communities
      const updatedAllCommunities = [...allUserCreatedCommunities, trimmed];
      setAllUserCreatedCommunities(updatedAllCommunities);

      if (typeof window !== "undefined") {
        localStorage.setItem("userCommunities", JSON.stringify(updatedUserCommunities));
        localStorage.setItem("allUserCreatedCommunities", JSON.stringify(updatedAllCommunities));
        window.dispatchEvent(new CustomEvent("userCommunitiesChanged", { detail: updatedUserCommunities }));
      }
      setNewCommunity("");
      setShowCommunityModal(false);
    }
  }

  function joinCommunity(communityName: string) {
    if (!userCommunities.includes(communityName)) {
      const updated = [...userCommunities, communityName];
      setUserCommunities(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("userCommunities", JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("userCommunitiesChanged", { detail: updated }));
      }
    }
  }

  function leaveCommunity(communityName: string) {
    const updated = userCommunities.filter(c => c !== communityName);
    setUserCommunities(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("userCommunities", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("userCommunitiesChanged", { detail: updated }));
    }
  }

  const favorites = posts.filter(
    p => typeof window !== "undefined" && window.localStorage.getItem(`like_${p.id}`) === "1"
  );

  // Check if search matches any community (preset or user-created)
  const isSearchingCommunity = search && (communities.includes(search) || allUserCreatedCommunities.includes(search));

  const filtered = isSearchingCommunity
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

  // Current filter can be a preset community or user-created community
  const currentFilter = search && (communities.includes(search) || allUserCreatedCommunities.includes(search)) ? search : null;
  const isJoined = currentFilter ? userCommunities.includes(currentFilter) : false;

  return (
    <main className="pt-8 pb-20 bg-white min-h-screen">
      <div className="mx-auto max-w-4xl px-6 text-[#356859]">

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: '#356859' }}>Explore</h1>

        {/* Join Community Banner */}
        {currentFilter && (
          <div className="mb-6 p-4 bg-white rounded-lg border border-[#A87C5F] flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#356859]">{currentFilter}</h2>
              <p className="text-sm text-gray-600">
                {isJoined ? "You're a member of this community" : "Join to stay updated"}
              </p>
            </div>
            <button
              onClick={() => isJoined ? leaveCommunity(currentFilter) : joinCommunity(currentFilter)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                isJoined
                  ? "bg-gray-200 text-[#356859] hover:bg-gray-300"
                  : "bg-[#356859] text-white hover:bg-green-900"
              }`}
            >
              {isJoined ? "Leave" : "Join"}
            </button>
          </div>
        )}

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
          {communities.map((comm, index) => (
            <button
              key={`preset-${index}-${comm}`}
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

          {/* User-Created Communities Dropdown */}
          {allUserCreatedCommunities.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowUserCommunitiesDropdown(!showUserCommunitiesDropdown)}
                className={`px-3 py-1 rounded-full border transition font-medium flex items-center gap-1 ${
                  search && allUserCreatedCommunities.includes(search)
                    ? "bg-[#356859] text-white border-[#A87C5F]"
                    : "border-[#A87C5F] bg-[#F5EEE6] text-[#356859] hover:bg-[#356859] hover:text-white"
                }`}
              >
                User Communities
                <svg
                  className={`w-4 h-4 transform transition-transform ${showUserCommunitiesDropdown ? 'rotate-180' : 'rotate-0'}`}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {showUserCommunitiesDropdown && (
                <div className="absolute top-full mt-1 bg-white border border-[#A87C5F] rounded shadow-lg z-10 min-w-[200px]">
                  {allUserCreatedCommunities.map((comm, index) => (
                    <button
                      key={`user-comm-${index}-${comm}`}
                      onClick={() => {
                        setSearch(comm);
                        setShowUserCommunitiesDropdown(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm transition ${
                        search === comm
                          ? "bg-[#356859] text-white font-semibold"
                          : "text-[#356859] hover:bg-[#F5EEE6]"
                      }`}
                    >
                      {comm}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
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

        {filtered.length === 0 && (
          <div className="mb-8 text-center text-[#C9B29B]">No posts found.</div>
        )}
        <div className="space-y-8">
          {filtered.map(p => {
            const isFavorited = typeof window !== "undefined" && window.localStorage.getItem(`like_${p.id}`) === "1";
            const postCommunityJoined = p.community ? userCommunities.includes(p.community) : false;
            return (
            <article key={p.id} className="rounded-md border border-[#A87C5F] bg-white p-4 relative">
              <Link
                href={`/explore/${p.id}`}
                className="text-lg font-medium text-[#356859] hover:underline"
              >
                {p.title}
              </Link>
              {p.community && (
                <span className="ml-2 inline-flex items-center gap-2">
                  <span className="text-sm bg-[#F5EEE6] text-[#A87C5F] px-2 py-1 rounded">
                    {p.community}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      postCommunityJoined ? leaveCommunity(p.community!) : joinCommunity(p.community!);
                      forceUpdate(n => n + 1);
                    }}
                    className={`text-xs px-2 py-1 rounded-full font-medium transition ${
                      postCommunityJoined
                        ? "bg-[#356859] text-white"
                        : "border border-[#356859] text-[#356859] hover:bg-[#356859] hover:text-white"
                    }`}
                  >
                    {postCommunityJoined ? "Joined" : "Join"}
                  </button>
                </span>
              )}
              <div className="font-bold text-[#356859]">${p.price}</div>
              {p.image && getImageUrl(p.image) && (
                <img
                  src={getImageUrl(p.image)!}
                  alt={p.title}
                  className="mt-2 w-full max-w-xs rounded cursor-pointer transition hover:scale-105 border border-[#A87C5F]"
                  style={{ maxHeight: 128, objectFit: 'cover' }}
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

        {/* Create Post Modal */}
        {showForm && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto py-8"
            style={{ backgroundColor: 'rgba(53, 104, 89, 0.3)' }}
            onClick={() => setShowForm(false)}
          >
            <div className="w-full max-w-lg mx-4">
              <RoomListingForm
                onCreate={handleCreate}
                onClose={() => setShowForm(false)}
                communities={[...communities.filter(c => userCommunities.includes(c)), ...userCommunities.filter(c => !communities.includes(c))]}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
