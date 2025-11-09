"use client";

import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatBox from "./ChatBox";

export default function Shell({ children }: { children: React.ReactNode }) {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Header onToggleChat={() => setShowChat((s) => !s)} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
      {showChat && <ChatBox onClose={() => setShowChat(false)} />}
    </div>
  );
}
