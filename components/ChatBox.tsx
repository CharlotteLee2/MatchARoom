"use client";

import React, { useEffect, useState } from "react";

export default function ChatBox({ onClose }: { onClose?: () => void }) {
  const [visible, setVisible] = useState(true);
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    // load recent liked users/rooms as mock recipients (no real chat service)
    try {
      const liked = JSON.parse(localStorage.getItem("likedRooms") || "[]");
      if (Array.isArray(liked)) {
        setMessages(liked.slice(0, 3).map((l: any, i: number) => ({ id: String(i), text: `Hi about ${l.title || 'room'}` })));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 w-80 bg-white border z-50" style={{ right: '1rem' }}>
      <div className="flex items-center justify-between px-3 py-2 bg-green-600 text-white">
        <div className="font-semibold">Chat</div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setVisible(false); onClose && onClose(); }} aria-label="Close chat" className="text-white/90">✕</button>
        </div>
      </div>

      <div className="p-3 h-48 overflow-y-auto">
        {messages.length === 0 && <div className="text-sm text-gray-500">No recent chats. Swipe to like someone to start.</div>}
        {messages.map((m) => (
          <div key={m.id} className="mb-2">
            <div className="text-sm font-medium text-gray-700">User {m.id}</div>
            <div className="text-sm text-gray-600">{m.text}</div>
          </div>
        ))}
      </div>

      <div className="px-3 py-2 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            setMessages((s) => [...s, { id: String(s.length + 1), text }]);
            setText("");
          }}
        >
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 border rounded px-2 py-1 text-sm"
              placeholder="Say hello..."
            />
            <button className="bg-green-600 text-white px-3 rounded text-sm">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}
