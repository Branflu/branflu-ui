"use client";

import React, { useState } from "react";
import { IoSearch, IoEllipsisHorizontal } from "react-icons/io5";
import { Paperclip, Smile, Send } from "lucide-react";
import { Icon } from "@iconify/react"; // ✅ iconify import

export default function CollaborationUI() {
    const [messages] = useState([
        { from: "Stella Evergreen", text: "Hi Jackson Rivers! I’d like to buy your products.", time: "10:20 AM", sent: false },
        { from: "Stella Evergreen", text: "I just love what you’re providing. Also, I’ll send you a few examples.", time: "10:22 AM", sent: false },
        { from: "Me", text: "Great to hear that! Looking forward to working more with you.", time: "10:23 AM", sent: true },
        { from: "Stella Evergreen", text: "I have bought the products already.", time: "10:25 AM", sent: false },
        { from: "Me", text: "Awesome! Do you need any assistance with setup?", time: "10:27 AM", sent: true },
        { from: "Stella Evergreen", text: "Not yet, but I’ll ask if needed.", time: "10:28 AM", sent: false },
        { from: "Stella Evergreen", text: "Also, I’m gonna buy more products from you soon.", time: "10:30 AM", sent: false },
        { from: "Me", text: "Perfect, I’ll share the catalog update soon.", time: "10:32 AM", sent: true },
        { from: "Stella Evergreen", text: "That’s great, thank you!", time: "10:34 AM", sent: false },
        { from: "Me", text: "You’re most welcome 😊", time: "10:35 AM", sent: true },
    ]);

    const contacts = [
        "Stella Evergreen",
        "Oliver Crestwood",
        "Ethan Sterling",
        "Amelia Rose",
        "Lucas Green",
        "Sophia White",
        "Liam Johnson",
        "Mia Carter",
        "Noah Brooks",
        "Isabella Rivera",
        "James Howard",
        "Charlotte Gray",
    ];

    return (
        <div className="h-screen w-full flex text-white relative bg-[#0f172a]">
            {/* Main Content */}
            <div className="flex-1 flex gap-4 p-4 items-stretch">
                {/* Messages List */}
                <div className="w-1/4 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl p-4 shadow-lg flex flex-col h-[77vh]">
                    <h2 className="text-lg font-semibold mb-4">All Messages</h2>
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search Message"
                            className="w-full p-2 pl-4 pr-10 rounded-lg bg-[#1e293b] text-sm placeholder-gray-400 focus:outline-none"
                        />
                        <IoSearch className="absolute right-3 top-2.5 text-gray-400" />
                    </div>
                    <p className="text-gray-400 text-sm mb-2">Recent</p>
                    {/* Scrollable messages */}
                    <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                        {contacts.map((name, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#2d3748] cursor-pointer transition"
                            >
                                <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
                                <div>
                                    <p className="font-medium">{name}</p>
                                    <p className="text-xs text-gray-400">Last message preview...</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Section */}
                {/* Chat Section */}
                <div className="flex-1 max-w-[calc(100%-6rem)] bg-gradient-to-br from-[#1e1b4b] via-[#1e293b] to-[#0f172a] rounded-2xl p-4 shadow-lg flex flex-col h-[77vh]">
                    {/* Chat Header */}
                    <div className="flex items-center justify-between border-b border-gray-700 pb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-500 rounded-full"></div>
                            <div>
                                <p className="font-semibold">Stella Evergreen</p>
                                <p className="text-sm text-gray-400">stellaevergreen@gmail.com</p>
                            </div>
                        </div>
                        <IoEllipsisHorizontal />
                    </div>

                    {/* Chat Messages (Scrollable) */}
                    <div className="flex-1 mt-4 space-y-4 overflow-y-auto pr-2">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xs p-3 rounded-2xl text-sm ${msg.sent
                                        ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow"
                                        : "bg-[#374151] text-gray-200"
                                        }`}
                                >
                                    {msg.text}
                                    <div className="text-[10px] text-gray-300 mt-1">{msg.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Typing Section */}
                    <div className="w-full">
                        <div className="flex flex-col gap-3 mt-4 p-3 bg-[#2a2f45] rounded-xl shadow-md">
                            <input
                                type="text"
                                placeholder="Type Message"
                                className="flex-1 p-2 bg-transparent text-sm placeholder-gray-400 focus:outline-none"
                            />

                            {/* Buttons Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex gap-3">
                                    <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-xs font-medium shadow hover:opacity-90">
                                        <Icon icon="mdi:wallet-outline" className="w-5 h-5" /> Ask for payment
                                    </button>
                                    <button className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-xs font-medium shadow hover:opacity-90">
                                        <Icon icon="mdi:tag-outline" className="w-4 h-4" /> Make Offer
                                    </button>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Paperclip className="cursor-pointer text-gray-300" />
                                    <Smile className="cursor-pointer text-gray-300" />
                                    <button className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-md hover:opacity-90">
                                        <Send className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}
