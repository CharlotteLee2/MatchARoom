"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Sidebar() {
  const [communities, setCommunities] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("communities");
      if (raw) setCommunities(JSON.parse(raw));
      else setCommunities([]);
    } catch (e) {
      setCommunities([]);
    }
  }, []);

  function selectCommunity(c?: string) {
    if (c) localStorage.setItem("selectedCommunity", c);
    else localStorage.removeItem("selectedCommunity");
    // dispatch event so other components can react
    window.dispatchEvent(new CustomEvent("selectedCommunityChanged", { detail: c }));
  }

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

        <div>
          <button
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            className="flex items-center gap-3 w-full text-left px-2 py-2 hover:bg-gray-100 rounded"
          >
            <img src="/images/community_logo.png" alt="community" className="w-6 h-6" />
            <span className="font-medium" style={{ color: '#315328' }}>Communities</span>
            {/* chevron showing dropdown state; rotates when open */}
            <span className="ml-auto">
              <svg
                  className={`w-4 h-4 text-[#315328] transform transition-transform duration-300 ease-in-out ${open ? 'rotate-180' : 'rotate-0'}`}
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </span>
          </button>

          {open && communities.length > 0 && (
            <div className="mt-2 pl-3 flex flex-col gap-2">
              <button onClick={() => selectCommunity(undefined)} className="text-sm text-left" style={{ color: '#315328' }}>All</button>
              {communities.map((c) => (
                <button key={c} onClick={() => selectCommunity(c)} className="text-sm text-left" style={{ color: '#315328' }}>{c} <span className="text-xs text-gray-500">Join</span></button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
