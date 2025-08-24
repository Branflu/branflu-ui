"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import branfluLogo from "@/assest/branfluLogo.png";

const Sidebar: React.FC = () => {
  const router = useRouter();

  return (
    <aside className="w-64 bg-[#111827] flex flex-col py-6 border-r border-gray-700">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 pl-6 -ml-6">
        <div className="flex justify-center">
          <Image src={branfluLogo} alt="Branflu Logo" width={60} height={60} />
        </div>
        <span className="text-xl font-semibold -ml-4">Branflu</span>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-6">
        <div
          onClick={() => router.push("/influencer/dashboard")}
          className="flex items-center gap-3 ml-6 text-gray-300 hover:text-white cursor-pointer"
        >
          <Icon icon="mdi:view-dashboard-outline" width="20" height="20" />
          Dashboard
        </div>
        
        <div className="flex items-center gap-3 ml-6 text-gray-300 hover:text-white cursor-pointer"
        onClick={() => router.push("/influencer/marketplace")}>
          <Icon icon="mdi:chart-line" width="20" height="20" />
          Marketplace
        </div>
        <div className="flex items-center gap-3 ml-6 text-gray-300 hover:text-white cursor-pointer"
        onClick={() => router.push("/influencer/earnings")}>
          <Icon icon="mdi:cash-multiple" width="20" height="20" />
          Earnings
        </div>
        <div className="flex items-center gap-3 ml-6 text-gray-300 hover:text-white cursor-pointer"
          onClick={() => router.push("/influencer/myCampaigns")}>
          <Icon icon="mdi:clipboard-text-outline" width="20" height="20" />
          My Campaigns
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
