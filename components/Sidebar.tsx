"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [userCommunities, setUserCommunities] = useState<string[]>([]);
  const [userCommunitiesOpen, setUserCommunitiesOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("userCommunities");
      if (raw) setUserCommunities(JSON.parse(raw));
      else setUserCommunities([]);
    } catch (e) {
      setUserCommunities([]);
    }
  }, []);

  // listen for updates when user communities change
  useEffect(() => {
    function onChange(e: Event) {
      try {
        const detail = (e as CustomEvent).detail;
        if (Array.isArray(detail)) setUserCommunities(detail as string[]);
        else {
          const raw = localStorage.getItem("userCommunities");
          if (raw) setUserCommunities(JSON.parse(raw));
          else setUserCommunities([]);
        }
      } catch (err) {
        try {
          const raw = localStorage.getItem("userCommunities");
          if (raw) setUserCommunities(JSON.parse(raw));
          else setUserCommunities([]);
        } catch {
          setUserCommunities([]);
        }
      }
    }

    window.addEventListener("userCommunitiesChanged", onChange as EventListener);
    return () => window.removeEventListener("userCommunitiesChanged", onChange as EventListener);
  }, []);

  return (
  <aside className="w-56 border-r p-3 hidden lg:block lg:fixed lg:top-14 lg:left-0 lg:z-40 lg:shadow-sm lg:h-[calc(100vh-3.5rem)] lg:overflow-auto">
      <div className="flex flex-col gap-3">
        <Link href="/" className="flex items-center gap-3 hover:bg-gray-100 rounded px-2 py-2">
          <img src="/images/home_logo.png" alt="home" className="w-6 h-6" />
          <span className="font-medium" style={{ color: '#315328' }}>Home</span>
        </Link>

        <Link href="/explore" className="flex items-center gap-3 hover:bg-gray-100 rounded px-2 py-2">
          <img src="/images/explore_logo.png" alt="explore" className="w-6 h-6" />
          <span className="font-medium" style={{ color: '#315328' }}>Explore</span>
        </Link>

        <Link href="/swipe" className="flex items-center gap-3 hover:bg-gray-100 rounded px-2 py-2">
          <img src="/images/swipe_icon.png" alt="swipe" className="w-6 h-6" />
          <span className="font-medium" style={{ color: '#315328' }}>Swipe</span>
        </Link>

        {/* User-Created Communities Dropdown */}
        <div>
          <button
            onClick={() => setUserCommunitiesOpen((s) => !s)}
            aria-expanded={userCommunitiesOpen}
            className="flex items-center gap-3 w-full text-left px-2 py-2 hover:bg-gray-100 rounded"
          >
            <img src="/images/community_logo.png" alt="user communities" className="w-6 h-6" />
            <span className="font-medium" style={{ color: '#315328' }}>My Communities</span>
            <span className="ml-auto">
              <svg
                  className={`w-4 h-4 text-[#315328] transform transition-transform duration-300 ease-in-out ${userCommunitiesOpen ? 'rotate-180' : 'rotate-0'}`}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>
          </button>

          {userCommunitiesOpen && (
            <div className="mt-2 pl-3 flex flex-col gap-2">
              {userCommunities.length === 0 ? (
                <span className="text-xs text-gray-500">No communities yet</span>
              ) : (
                userCommunities.map((c, index) => (
                  <Link
                    key={`sidebar-comm-${index}-${c}`}
                    href={`/explore?filter=${encodeURIComponent(c)}`}
                    className="text-sm text-left hover:underline"
                    style={{ color: '#315328' }}
                  >
                    {c}
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
