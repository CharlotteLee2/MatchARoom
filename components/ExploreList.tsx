"use client";

import React, { useEffect, useState } from "react";

type Site = {
  id: number;
  name: string;
  baseUrl?: string;
};

export default function ExploreList({ sites }: { sites: Site[] }) {
  const [joined, setJoined] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("communities");
      if (raw) setJoined(JSON.parse(raw));
      else setJoined([]);
    } catch (e) {
      setJoined([]);
    }
  }, []);

  function toggleJoin(name: string) {
    const isJoined = joined.includes(name);
    const next = isJoined ? joined.filter((c) => c !== name) : [...joined, name];
    setJoined(next);
    try {
      localStorage.setItem("communities", JSON.stringify(next));
      // notify other components (Sidebar) to refresh
      window.dispatchEvent(new CustomEvent("communitiesChanged", { detail: next }));
    } catch (e) {
      // ignore
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Explore</h1>
      <p className="text-gray-600 mb-4">Browse housings and join communities.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sites.map((s) => {
          const isJoined = joined.includes(s.name);
          return (
            <div key={s.id} className="border rounded p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{s.name}</div>
                {s.baseUrl && <div className="text-sm text-gray-500">{s.baseUrl}</div>}
              </div>

              <button
                onClick={() => toggleJoin(s.name)}
                className={`px-3 py-1 rounded-full text-sm focus:outline-none ${isJoined ? 'bg-[#315328] text-white' : 'border border-[#315328] text-[#315328]'}`}
              >
                {isJoined ? 'Joined' : 'Join'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
