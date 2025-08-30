"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { FaYoutube, FaInstagram } from "react-icons/fa";
import { useRouter } from "next/navigation";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
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
  date: string;
  views: number;
  likes: number;
  comments: number;
  estimatedMinutesWatched: number;
}

function formatDateForXAxis(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleString("en-US", { month: "short", day: "numeric" });
  } catch {
    return isoDate;
  }
}

const CampaignsPage: React.FC = () => {
  const router = useRouter();
  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch influencer data directly, backend reads JWT from cookie
    fetch(`http://localhost:8080/api/youtube/influencer/me`, {
      method: "GET",
      credentials: "include", // ✅ important: sends cookies automatically
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch influencer data");
        return res.json();
      })
      .then((data) => {
        setInfluencer({
          title: data.name ?? "Unknown",
          imageUrl: data.imageUrl ?? undefined,
          subscriberCount: data.subscriberCount ?? data.subscribers ?? 0,
          totalViews: data.totalViews ?? data.views ?? 0,
          totalVideos: data.videoCount ?? data.videos ?? 0,
          engagementRate: data.engagementRate ?? 0,
        });

        if (Array.isArray(data.analytics) && data.analytics.length > 0) {
          const sorted = data.analytics
            .slice()
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
          const formatted: ChartDataPoint[] = sorted.map((r: any) => ({
            date: formatDateForXAxis(r.date ?? r.daily ?? ""),
            views: typeof r.views === "number" ? r.views : 0,
            likes: typeof r.likes === "number" ? r.likes : 0,
            comments: typeof r.comments === "number" ? r.comments : 0,
            estimatedMinutesWatched:
              typeof r.estimatedMinutesWatched === "number" ? r.estimatedMinutesWatched : 0,
          }));
          setChartData(formatted);
        } else {
          setChartData([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, []);

  const campaigns = [
    { title: "GlowUp Challenge", category: "Fashion", brand: "T" },
    { title: "Hair Growth", category: "Tech", brand: "B" },
  ];

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">
      <main className="flex-1 px-2 pt-2">
        <h1 className="text-2xl font-semibold">
          Campaigns <span className="text-green-400">in-Progress</span>
        </h1>
        <hr className="border-gray-700 my-3" />

        <div className="flex flex-col lg:flex-row gap-6">
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
                      Collaborate with top influencers to showcase products.
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {campaign.brand}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-1/3 bg-[#1e293b] border border-gray-600 rounded-xl p-5 shadow-lg h-fit flex flex-col">
            <div className="flex flex-col items-center mb-6">
              {loading ? (
                <p className="text-gray-400 italic">Loading influencer data...</p>
              ) : error ? (
                <p className="text-red-500 italic">{error}</p>
              ) : influencer ? (
                <>
                  {influencer.imageUrl ? (
                    <img
                      src={influencer.imageUrl}
                      alt={`${influencer.title} profile`}
                      className="w-20 h-20 rounded-full border-2 border-gray-600 object-cover"
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

            <div className="h-64 mb-6">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData.map((item) => ({
                      ...item,
                      totalPerformance:
                        item.views + item.likes + item.comments + item.estimatedMinutesWatched,
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const original = payload[0].payload;
                          return (
                            <div
                              style={{
                                backgroundColor: "#111827",
                                border: "1px solid #374151",
                                borderRadius: "6px",
                                padding: "10px",
                                minWidth: "140px",
                              }}
                            >
                              <p style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "4px" }}>
                                {label}
                              </p>
                              <p style={{ color: "#f59f00", fontSize: "13px", margin: "2px 0" }}>
                                Views: {original.views}
                              </p>
                              <p style={{ color: "#15aabf", fontSize: "13px", margin: "2px 0" }}>
                                Likes: {original.likes}
                              </p>
                              <p style={{ color: "#e64980", fontSize: "13px", margin: "2px 0" }}>
                                Comments: {original.comments}
                              </p>
                              <p style={{ color: "#51cf66", fontSize: "13px", margin: "2px 0" }}>
                                Watch Time: {Math.floor(original.estimatedMinutesWatched / 60)}h{" "}
                                {original.estimatedMinutesWatched % 60}m
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="linear"
                      dataKey="totalPerformance"
                      stroke="#3b82f6"
                      strokeWidth={1}
                      dot={false}
                      name="Performance Index"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 italic text-center mt-20">
                  No performance data available.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampaignsPage;
