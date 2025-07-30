"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { FaFacebook, FaInstagram, FaYoutube, FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import branfluWholeLogo from "@/assest/branfluWholeLogo.png";
import branfluLogo from "@/assest/branfluLogo.png";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"influencer" | "brand">("influencer");
  const [showPopup, setShowPopup] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const redirectTo = (url: string) => {
    window.location.href = url;
  };

  const handleCombinedLogin = () => setShowPopup(true);

  const proceedToFacebookLogin = () => {
    redirectTo("https://native-violently-imp.ngrok-free.app/api/facebook/login");
  };

  const handleYouTubeLogin = () => {
    redirectTo("http://localhost:8080/api/youtube/auth");
  };

  const handleRegister = async () => {
  const payload = {
    name: fullName,
  payPalEmail: email,          // ✅ Corrected key
  password: password,
  role: "BUSINESS",            // ✅ Required field
  imageUrl: imageUrl,
  websiteUrl: websiteUrl,
  Bio: bio,                    // ✅ Must be capital `B` to match backend
  category: category,
  };

  const endpoint = "https://native-violently-imp.ngrok-free.app/api/business/register";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      // ✅ Redirect to login-success page
      window.location.href = "/login-success";
    } else {
      alert(`Registration failed: ${data.message || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Registration error:", error);
    alert("Something went wrong during registration.");
  }
};


  return isLoading ? (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <Image src={branfluLogo} alt="Branflu Loading Logo" width={120} height={120} />
    </div>
  ) : (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white font-sans relative overflow-auto">
      <div className="w-full pl-0 pr-6 py-4 flex justify-between items-center absolute top-0 z-10">
        <Image
          src={branfluLogo}
          alt="Branflu Logo"
          width={50}
          height={50}
          className="mt-2 cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => router.push("/")}
        />
        <div className="flex gap-4 text-sm font-medium">
          <button onClick={() => router.push("/about")} className="hover:text-pink-400 transition duration-300">About</button>
          <button onClick={() => router.push("/contact")} className="hover:text-pink-400 transition duration-300">Contact</button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-6 pt-16 animate-fade-in">
        <div className="md:w-1/2 w-full px-4 text-left space-y-6 mb-6 md:mb-0 animate-slide-in-left">
          <Image src={branfluWholeLogo} alt="Branflu Full Logo" width={440} height={440} priority />
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight mt-[-60px]">
            Discover <span className="text-pink-500">Branflu</span>
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            <strong>Branflu</strong> bridges the gap between creators and brands. Influencers can showcase their talent and get discovered, while brands find the perfect match to amplify their marketing through authentic content.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl w-full max-w-md animate-slide-in-right self-start mt-4 min-h-[520px]">
          <div className="flex justify-center mb-6">
            {["influencer", "brand"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as "influencer" | "brand");
                  setIsSignUp(false);
                }}
                className={`px-5 py-2 transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400"
                } ${tab === "influencer" ? "rounded-l-xl" : "rounded-r-xl"}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="h-[360px] overflow-y-auto pr-1">
            {isSignUp ? (
              <div className="space-y-4 pt-2">
                <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="email" placeholder="PayPal Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="password" placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="url" placeholder="Image URL (optional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full px-4 py-3 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="url" placeholder="Website URL (optional)" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} className="w-full px-4 py-3 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <textarea placeholder="Bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-4 py-3 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="" disabled>Select Category</option>
                  <option value="FASHION">Fashion</option>
                  <option value="TECH">Tech</option>
                  <option value="FITNESS">Fitness</option>
                  <option value="TRAVEL">Travel</option>
                  <option value="FOOD">Food</option>
                  <option value="ENTERTAINMENT">Entertainment</option>
                </select>

                <Button onClick={handleRegister} className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-semibold transition-all duration-300">
                  Register
                </Button>

                <div className="text-center text-sm text-gray-400 pt-2">
                  Already have an account?{" "}
                  <button className="text-blue-400 hover:underline hover:text-blue-300 transition-all duration-200" onClick={() => setIsSignUp(false)}>
                    Login
                  </button>
                </div>
              </div>
            ) : activeTab === "influencer" ? (
              <div className="space-y-4 pt-2">
                <Button onClick={handleCombinedLogin} className="w-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white font-semibold text-lg py-3 flex items-center justify-center gap-4 rounded-xl hover:from-blue-700 hover:to-pink-600 transition-all duration-300">
                  <span className="flex items-center gap-1"><FaFacebook size={20} /> Facebook</span>
                  /
                  <span className="flex items-center gap-1"><FaInstagram size={20} /> Instagram</span>
                </Button>

                <Button onClick={handleYouTubeLogin} className="w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-semibold text-lg py-3 flex items-center justify-center gap-2 rounded-xl hover:from-red-600 hover:to-red-800 transition-all duration-300">
                  <FaYoutube size={20} /> Continue with YouTube
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <input type="email" placeholder="you@company.com" className="w-full px-4 py-3 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="password" placeholder="Password" className="w-full px-4 py-3 rounded-md bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <Button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold transition-all duration-300">Login</Button>

                <div className="relative w-full text-center my-4">
                  <hr className="border-t border-gray-600" />
                  <span className="absolute inset-0 flex items-center justify-center text-gray-400 bg-[#1e293b] px-2 text-sm">or</span>
                </div>

                <Button className="w-full bg-white text-black py-3 rounded-xl hover:bg-gray-100 font-semibold flex items-center justify-center gap-2 transition-all duration-300">
                  <FaGoogle /> Continue with Google
                </Button>

                <div className="text-center text-sm text-gray-400 pt-2">
                  Don&apos;t have an account?{" "}
                  <button className="text-blue-400 hover:underline hover:text-blue-300 transition-all duration-200" onClick={() => setIsSignUp(true)}>
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-50 flex justify-center items-center p-4">
          <div className="bg-white/90 backdrop-blur-lg border border-gray-200 shadow-2xl rounded-2xl max-w-md w-full p-6 relative text-gray-800">
            <h2 className="text-2xl font-semibold text-center mb-5 text-gray-900">⚠️ Important Steps Before Login</h2>
            <ul className="list-disc pl-6 text-sm space-y-2 text-gray-700">
              <li>Your Instagram must be a Business or Creator account.</li>
              <li>Instagram must be linked to the Facebook Page.</li>
            </ul>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowPopup(false)} className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition">Cancel</button>
              <button onClick={proceedToFacebookLogin} className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white font-semibold hover:from-blue-700 hover:to-pink-600 transition">Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
