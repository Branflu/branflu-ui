"use client";

import React from "react";
import Sidebar from "@/app/influencer/sidebar/page"; // adjust path if different
import { useRouter } from "next/navigation";
import { IoChatbubbleEllipsesOutline, IoNotificationsOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";

export default function InfluencerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-[#0f172a] text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col overflow-hidden">
        {/* Top right icons row */}
        <div className="flex justify-end items-center gap-4 mb-4 flex-shrink-0 mr-4">
          <IoChatbubbleEllipsesOutline
            className="text-2xl cursor-pointer"
            onClick={() => router.push("/influencer/chatbox")}
          />
          <IoNotificationsOutline
            className="text-2xl cursor-pointer"
            onClick={() => router.push("/influencer/notifications")}
          />
          <FaRegUserCircle
            className="text-2xl cursor-pointer"
            onClick={() => router.push("/influencer/profile")}
          />
        </div>

        {/* Page children (handles its own scrolling inside) */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
