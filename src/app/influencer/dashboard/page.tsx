"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import {
  IoChatbubbleEllipsesOutline,
  IoNotificationsOutline,
} from "react-icons/io5";
import { FaRegUserCircle, FaYoutube, FaInstagram } from "react-icons/fa";
import branfluLogo from "@/assest/branfluLogo.png";
import { useRouter } from "next/navigation"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";




interface Influencer {
  title: string;
  imageUrl?: string;
  subscriberCount: number;
  totalViews: number;
  totalVideos: number;
  engagementRate: number;
}

interface ChartDataPoint {
  date: string; // formatted for display, e.g. "May 15"
  views: number;
  likes: number;
  comments: number;
}

function parseJwt(token: string | null): any {
  if (!token) return null;
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function formatDateForXAxis(isoDate: string): string {
  // isoDate assumed "YYYY-MM-DD" or a valid ISO string
  try {
    const d = new Date(isoDate);
    return d.toLocaleString("en-US", { month: "short", day: "numeric" }); // e.g. "May 15"
  } catch {
    return isoDate;
  }
}

const CampaignsPage: React.FC = () => {
  const router = useRouter();
  // ✅ Pages Router hook

  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Extract token from URL query ?token= if exists (after login redirect)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      localStorage.setItem("jwtToken", urlToken);
      // Remove token from URL so it doesn't stay visible
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const payload = parseJwt(token);
    const channelId = payload?.channelId || payload?.sub || payload?.user_id;
    if (!channelId) {
      setError("Channel ID not found in token");
      setLoading(false);
      return;
    }

    // Fetch influencer data from your backend endpoint
    fetch(`http://localhost:8080/api/youtube/influencer/${channelId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch influencer data");
        return res.json();
      })
      .then((data) => {
        // Map root-level fields to influencer state (matches the API you provided)
        setInfluencer({
          title: data.name ?? "Unknown",
          imageUrl: data.imageUrl ?? undefined,
          subscriberCount: data.subscriberCount ?? data.subscribers ?? 0,
          totalViews: data.totalViews ?? data.views ?? 0,
          totalVideos: data.videoCount ?? data.videos ?? 0,
          engagementRate: data.engagementRate ?? 0,
        });

        // Map analytics array -> chart data
        if (Array.isArray(data.analytics) && data.analytics.length > 0) {
          // Some backends may wrap analytics differently; you said analytics is an array of objects.
          // If the API returns an object with { analytics: [...] } this will work.
          const arr = data.analytics.slice(); // shallow copy
          // ensure each element is an object {date, views, likes, comments}
          const sorted = arr.sort((a: any, b: any) => {
            const da = new Date(a.date).getTime();
            const db = new Date(b.date).getTime();
            return da - db;
          });

          const formatted: ChartDataPoint[] = sorted.map((r: any) => ({
            date: formatDateForXAxis(r.date ?? r.daily ?? ""),
            views: typeof r.views === "number" ? r.views : 0,
            likes: typeof r.likes === "number" ? r.likes : 0,
            comments: typeof r.comments === "number" ? r.comments : 0,
          }));

          setChartData(formatted);
        } else {
          // If the API uses a different analytics shape (e.g. data.analytics.rows),
          // try to fallback to that format as well:
          if (data.analytics?.rows && Array.isArray(data.analytics.rows)) {
            const rows = data.analytics.rows
              .map((r: any[]) => ({
                // assume row format [date, views, ???, likes, comments]
                date: r[0],
                views: typeof r[1] === "number" ? r[1] : 0,
                likes: typeof r[3] === "number" ? r[3] : 0,
                comments: typeof r[4] === "number" ? r[4] : 0,
              }))
              .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map((r: any) => ({
                date: formatDateForXAxis(r.date),
                views: r.views,
                likes: r.likes,
                comments: r.comments,
              }));
            setChartData(rows);
          } else {
            setChartData([]);
          }
        }

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, []);

  // Dummy campaigns for display
  const campaigns = [
    { title: "GlowUp Challenge", category: "Fashion", brand: "T" },
    { title: "Hair Growth", category: "Tech", brand: "B" },
  ];

  const successRate = 85;
  let badge = "Bronze";
  if (successRate >= 80) badge = "Gold";
  else if (successRate >= 60) badge = "Silver";

  // Sidebar click handler


  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">
      {/* Sidebar */}
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
          <div
            className="flex items-center gap-3 ml-6 text-gray-300 hover:text-white cursor-pointer"
             onClick={() => router.push("/influencer/activeCollabration")}
          >
            <Icon icon="mdi:circle" width="12" height="12" className="text-green-400" />
            Active Collaboration
          </div>
          <div

            className="flex items-center gap-3 ml-6 text-gray-300 hover:text-white cursor-pointer"
          >
            <Icon icon="mdi:chart-line" width="20" height="20" />
            Marketplace
          </div>
          <div

            className="flex items-center gap-3 ml-6 text-gray-300 hover:text-white cursor-pointer"
          >
            <Icon icon="mdi:cash-multiple" width="20" height="20" />
            Earnings
          </div>
          <div

            className="flex items-center gap-3 ml-6 text-gray-300 hover:text-white cursor-pointer"
          >
            <Icon icon="mdi:clipboard-text-outline" width="20" height="20" />
            My Campaigns
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-8 py-6">
        {/* Top Bar */}
        <div className="flex justify-end items-center gap-4 mb-4">
          <IoChatbubbleEllipsesOutline className="text-2xl cursor-pointer" />
          <IoNotificationsOutline className="text-2xl cursor-pointer" />
          <FaRegUserCircle className="text-2xl cursor-pointer" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold">
          Campaigns <span className="text-green-400">in-Progress</span>
        </h1>
        <hr className="border-gray-700 my-3" />

        {/* Search & Filters */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="Search"
            className="px-4 py-2 rounded-md bg-[#1e293b] border border-gray-600 focus:outline-none focus:border-blue-500 text-sm"
          />
          <button className="px-4 py-2 bg-blue-600 rounded-md text-sm">Search</button>

          <div className="flex items-center gap-1 px-3 py-2 bg-[#1e293b] rounded-md text-sm border border-gray-600">
            <FaYoutube className="text-red-500" />
            <select className="bg-[#1e293b] focus:outline-none text-sm">
              <option>10k - 20k</option>
              <option>20k - 50k</option>
              <option>50k - 100k</option>
              <option>100k - 500k</option>
              <option>500k - 1M</option>
            </select>
          </div>

          <div className="flex items-center gap-1 px-3 py-2 bg-[#1e293b] rounded-md text-sm border border-gray-600">
            <FaInstagram className="text-pink-500" />
            <select className="bg-[#1e293b] focus:outline-none text-sm">
              <option>10k - 20k</option>
              <option>20k - 50k</option>
              <option>50k - 100k</option>
              <option>100k - 500k</option>
              <option>500k - 1M</option>
            </select>
          </div>

          <button className="px-4 py-2 border border-gray-500 rounded-md text-sm">Filters</button>
          <button className="px-4 py-2 border border-gray-500 rounded-md text-sm">Apply</button>
        </div>

        {/* Campaigns + Right Card */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Campaigns List */}
          <div className="flex flex-col gap-4 flex-1 max-w-3xl">
            {campaigns.map((campaign, idx) => (
              <div
                key={idx}
                className="bg-[#1e293b] p-5 rounded-lg border border-gray-600 shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">{campaign.title}</h2>
                    <p className="text-gray-400 text-sm mt-1 max-w-lg">
                      Collaborate with top beauty influencers to showcase BrandX's new summer skincare range through engaging Instagram reels and authentic product reviews.
                    </p>
                    <p className="mt-2 text-yellow-400 text-xs font-medium">Requirement</p>
                  </div>
                  <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {campaign.brand}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <FaYoutube className="text-red-500" /> 22k
                    </span>
                    <span className="flex items-center gap-1">
                      <FaInstagram className="text-pink-500" /> 20k
                    </span>
                    <span>Category: {campaign.category}</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-4 py-1 bg-blue-500 hover:bg-blue-600 rounded-md text-white text-sm transition">
                      Details
                    </button>
                    <button className="px-4 py-1 text-blue-400 border border-blue-400 hover:bg-blue-400 hover:text-white rounded-md text-sm transition">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side Card */}
          <div className="lg:w-1/3 bg-[#1e293b] border border-gray-600 rounded-xl p-5 shadow-lg h-fit flex flex-col">
            {/* Profile */}
            <div className="flex flex-col items-center mb-6">
              {loading ? (
                <p className="text-gray-400 italic">Loading influencer data...</p>
              ) : error ? (
                <p className="text-red-500 italic">{error}</p>
              ) : influencer ? (
                <>
                  {influencer.imageUrl ? (
                    // Use native img to avoid next/image external config issues
                    <img
                      src={influencer.imageUrl}
                      alt={`${influencer.title} profile`}
                      width={80}
                      height={80}
                      className="rounded-full border-2 border-gray-600 object-cover"
                    />
                  ) : (
                    <Icon icon="mdi:account-circle-outline" className="text-7xl text-gray-300" />
                  )}

                  <h2 className="mt-3 text-lg font-bold">{influencer.title}</h2>
                  <span className="text-sm text-gray-400">Influencer</span>
                </>
              ) : (
                <p className="text-gray-400 italic">No influencer data found.</p>
              )}
            </div>

            {/* Activity Graph */}
            <div className="h-64 mb-6">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          // Force order: views -> likes -> comments
                          const order: Record<"views" | "likes" | "comments", number> = {
                            views: 1,
                            likes: 2,
                            comments: 3,
                          };

                          const ordered = [...payload].sort((a, b) => {
                            const keyA = a.dataKey as keyof typeof order;
                            const keyB = b.dataKey as keyof typeof order;
                            return order[keyA] - order[keyB];
                          });

                          return (
                            <div
                              style={{
                                backgroundColor: "#111827", // Dark tooltip background
                                border: "1px solid #374151", // Subtle border
                                borderRadius: "6px",
                                padding: "10px",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                                minWidth: "140px",
                              }}
                            >
                              {/* Date */}
                              <p style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "4px" }}>
                                {label}
                              </p>

                              {/* Data items */}
                              {ordered.map((entry, index) => (
                                <p
                                  key={`item-${index}`}
                                  style={{
                                    color: entry.stroke, // Same color for name & value
                                    fontSize: "13px",
                                    margin: "2px 0",
                                    fontWeight: "500",
                                  }}
                                >
                                  {entry.name} : {entry.value.toLocaleString()}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    <Legend wrapperStyle={{ color: "#9ca3af" }} />
                    <Line type="monotone" dataKey="views" stroke="#4c6ef5" dot={false} />
                    <Line type="monotone" dataKey="likes" stroke="#15aabf" dot={false} />
                    <Line type="monotone" dataKey="comments" stroke="#e64980" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 italic text-center mt-20">No performance data available.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampaignsPage;
