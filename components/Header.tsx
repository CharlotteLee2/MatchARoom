"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type HeaderProps = {
  onToggleChat?: () => void;
};

type Room = {
  id: string;
  title: string;
};

export default function Header({ onToggleChat }: HeaderProps) {
  const [liked, setLiked] = useState<Room[]>([]);
  const [logoSrc, setLogoSrc] = useState<string>('/images/matcharoom_logo_v2.png');
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("likedRooms");
      if (raw) setLiked(JSON.parse(raw));
    } catch (e) {
      setLiked([]);
    }
    // set a cache-busted logo source once on mount so updates to the file are picked up by the browser
    setLogoSrc(`/images/matcharoom_logo_v2.png?v=${Date.now()}`);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/auth/logout', { method: 'GET' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if fetch fails
      router.push('/');
      router.refresh();
    }
  };

  return (
    <header className="w-full border-b" style={{ backgroundColor: "#467f36" }}>
  <div className="mx-auto max-w-6xl pl-4 pr-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            {/* use a cache-busted src to ensure updated logo file is loaded */}
            <img src={logoSrc} alt="MatchARoom logo" width={40} height={40} />
            <span className="font-semibold text-lg text-white">MatchARoom</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/interested" className="relative">
            <button className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              Interested
            </button>
            {liked.length > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {liked.length}
              </span>
            )}
          </Link>

          <button
            onClick={() => onToggleChat && onToggleChat()}
            aria-label="Open Chat"
            className="relative inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-sm hover:bg-white/20"
          >
            <img src="/images/chat_icon.png" alt="chat" className="w-5 h-5" />
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
          >
            Logout
          </button>

          {/* Interested button removed per request */}
        </div>
      </div>
    </header>
  );
}
