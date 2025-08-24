"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/react";
import { FaFacebook, FaYoutube, FaGoogle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import branfluWholeLogo from "@/assest/branfluWholeLogo.png";
import branfluLogo from "@/assest/branfluLogo.png";
import { FcGoogle } from "react-icons/fc";


export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("influencer");
  const [isSignUp, setIsSignUp] = useState(false);

  // form state (for signup)
  const [formData, setFormData] = useState({
    name: "",
    payPalEmail: "",
    password: "",
    role: "INFLUENCER",
    websiteUrl: "",
    bio: "",
    category: "Fashion",
  });

  // OTP states
  const DIGITS = 6;
  const [otpStage, setOtpStage] = useState<"idle" | "sent" | "verified">("idle");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [digits, setDigits] = useState<string[]>(Array(DIGITS).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  // success toast
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    inputsRef.current = Array(DIGITS)
      .fill(null)
      .map((_, i) => inputsRef.current[i] || (null as any));
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // simple mask for UI
  const mask = (email?: string) => {
    if (!email) return "";
    const [local = "", domain = ""] = email.split("@");
    if (!domain) return email;
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local[0]}${"*".repeat(Math.min(3, local.length - 2))}${local.slice(-1)}@${domain}`;
  };

  // social handlers unchanged
  const handleFacebookLogin = () => (window.location.href = "http://localhost:8080/api/facebook/login");
  const handleYouTubeLogin = () => (window.location.href = "http://localhost:8080/api/youtube/auth");

  // form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // -------------------------
  // OTP: frontend requests (assumes backend working)
  // -------------------------
  const sendOtpRequest = async (email: string) => {
    setOtpError("");
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setOtpError("Please enter a valid PayPal email.");
      return;
    }
    setSendingOtp(true);
    try {
      const res = await fetch("http://localhost:8080/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const text = await res.text().catch(() => "");
      let json: any = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch { }

      if (!res.ok) {
        const msg = json?.message || text || `Send OTP failed (${res.status})`;
        throw new Error(msg);
      }

      setMaskedEmail(json?.maskedEmail || mask(email));
      setCooldown(json?.cooldown || 60);
      setOtpStage("sent");
      setIsSignUp(true);

      // focus first OTP input
      setTimeout(() => inputsRef.current[0]?.focus(), 120);
    } catch (err: any) {
      console.error("sendOtp error:", err);
      setOtpError(err?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtpRequest = async (email: string, otp: string) => {
    setOtpError("");
    setVerifyingOtp(true);
    try {
      const res = await fetch("http://localhost:8080/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const text = await res.text().catch(() => "");
      let json: any = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch { }

      if (!res.ok) {
        const msg = json?.message || text || `Verify failed (${res.status})`;
        throw new Error(msg);
      }

      // ✅ Do NOT change otpStage here; keep user on the OTP view.
      return true;
    } catch (err: any) {
      console.warn("verify error:", err);
      if (otp === "123456") {
        // dev fallback - remove in prod
        return true;
      }
      setOtpError(err?.message || "Verification failed");
      return false;
    } finally {
      setVerifyingOtp(false);
    }
  };

  // registration
  const submitRegistration = async (): Promise<boolean> => {
    const payload = {
      name: formData.name,
      payPalEmail: formData.payPalEmail,
      password: formData.password,
      role: activeTab === "brand" ? "BUSINESS" : "INFLUENCER",
      websiteUrl: formData.websiteUrl,
      bio: formData.bio,
      category: formData.category,
    };

    try {
      const url =
        activeTab === "brand"
          ? "http://localhost:8080/api/business/register"
          : "http://localhost:8080/api/auth/signup";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Registration failed (${res.status})`);
      await res.json().catch(() => null);
      return true;
    } catch (err: any) {
      console.error("Registration error:", err);
      setOtpError(err?.message || "Registration failed");
      return false;
    }
  };

  // -------------------------
  // OTP helpers (input behaviour)
  // -------------------------
  const onDigitChange = (idx: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[idx] = value.slice(-1);
    setDigits(next);
    if (value && idx < DIGITS - 1) inputsRef.current[idx + 1]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) inputsRef.current[idx - 1]?.focus();
    if (e.key === "ArrowLeft" && idx > 0) inputsRef.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < DIGITS - 1) inputsRef.current[idx + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = (e.clipboardData.getData("text") || "").trim();
    const onlyDigits = pasted.replace(/\D/g, "").slice(0, DIGITS);
    if (!onlyDigits) return;
    const arr = Array(DIGITS).fill("");
    onlyDigits.split("").forEach((d, i) => (arr[i] = d));
    setDigits(arr);
  };

  // -------------------------
  // Actions
  // -------------------------
  const handleVerifyAndRegister = async () => {
    setOtpError("");
    const otp = digits.join("");
    if (otp.length !== DIGITS) {
      setOtpError("Please enter the complete code.");
      return;
    }
    const ok = await verifyOtpRequest(formData.payPalEmail, otp);
    if (!ok) return;

    const registered = await submitRegistration();
    if (registered) {
      // stay on OTP view, show toast, then redirect
      setSuccessToast("Verified ✓ Redirecting...");
      setTimeout(() => {
        router.replace("/business/dashboard");
      }, 1200);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setDigits(Array(DIGITS).fill(""));
    await sendOtpRequest(formData.payPalEmail);
  };

  const cancelOtpFlow = () => {
    setOtpStage("idle");
    setDigits(Array(DIGITS).fill(""));
    setOtpError("");
    setIsSignUp(false);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSignUp(false);
    setOtpStage("idle");
  };

  // -------------------------
  // Render
  // -------------------------
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
        <Image
          src={branfluLogo}
          alt="Branflu Logo"
          width={120}
          height={120}
          className="-ml-2 mt-2 cursor-pointer hover:scale-105 transition-transform duration-300"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white font-sans relative overflow-auto">
      {/* Navbar */}
      <div className="w-full pl-0 pr-6 py-4 flex justify-between items-center bg-transparent absolute top-0 z-10">
        <Image
          src={branfluLogo}
          alt="Branflu Logo"
          width={50}
          height={50}
          className="mt-2 cursor-pointer hover:scale-105 transition-transform duration-300"
          onClick={() => router.push("/")}
        />
        <div className="flex gap-4 text-sm font-medium text-white">
          <button
            onClick={() => router.push("/about")}
            className="hover:text-pink-400 transition-colors duration-300 cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => router.push("/contact")}
            className="hover:text-pink-400 transition-colors duration-300 cursor-pointer"
          >
            Contact
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 px-6 pt-16">
        {/* Left */}
        <div className="md:w-1/2 w-full px-4 text-left space-y-6 mb-6 md:mb-0">
          <Image src={branfluWholeLogo} alt="Branflu Full Logo" width={440} height={440} priority />
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight mt-[-60px]">
            Discover <span className="text-pink-500">Branflu</span>
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            <strong>Branflu</strong> bridges the gap between creators and brands, making
            collaborations effortless and impactful. Whether you’re an influencer looking
            to monetize your reach or a business aiming to expand your audience, Branflu
            provides the tools and opportunities to grow together.
          </p>

        </div>

        {/* Right Card (fixed height so login & signup match) */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl w-full max-w-md h-[460px] self-start mt-4">
          <div className="flex justify-center mb-4">
            <button
              onClick={() => handleTabChange("influencer")}
              className={`px-5 py-2 rounded-l-xl transition-all duration-300 ${activeTab === "influencer" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"
                }`}
            >
              Influencer
            </button>
            <button
              onClick={() => handleTabChange("brand")}
              className={`px-5 py-2 rounded-r-xl transition-all duration-300 ${activeTab === "brand" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"
                }`}
            >
              Brand
            </button>
          </div>

          <div className="flex flex-col h-full justify-between">
            <div className="px-1">
              {/* LOGIN view */}
              {!isSignUp && activeTab === "influencer" && (
                <div className="space-y-4 pt-2">
                  <Button
                    onClick={handleFacebookLogin}
                    className="w-full bg-blue-700 text-white font-semibold text-base py-3 flex items-center justify-center gap-2 rounded-xl hover:bg-blue-800 transition-all duration-300"
                  >
                    <FaFacebook size={18} /> Continue with Facebook
                  </Button>
                  <Button
                    onClick={handleYouTubeLogin}
                    className="w-full bg-red-600 text-white font-semibold text-base py-3 flex items-center justify-center gap-2 rounded-xl hover:bg-red-700 transition-all duration-300"
                  >
                    <FaYoutube size={18} /> Continue with YouTube
                  </Button>
                </div>
              )}

              {!isSignUp && activeTab === "brand" && (
                <div className="space-y-3 pt-1">
                  <input
                    type="email"
                    placeholder="you@company.com"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl outline-none placeholder:text-gray-400"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl outline-none placeholder:text-gray-400"
                  />
                  <Button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold transition-all duration-300">
                    Login
                  </Button>

                  <div className="relative w-full text-center my-3">
                    <hr className="border-t border-gray-600" />
                    <span className="absolute inset-0 flex items-center justify-center text-gray-400 bg-[#1e293b] px-2 text-sm">
                      or
                    </span>
                  </div>

                  <Button className="w-full bg-white text-black py-3 rounded-xl hover:bg-gray-100 font-semibold flex items-center justify-center gap-2 transition-all duration-300">
                    <FaGoogle /> Continue with Google
                  </Button>

                  <div className="text-center text-sm text-gray-400 pt-2">
                    Don't have an account?{" "}
                    <button
                      onClick={() => setIsSignUp(true)}
                      className="text-blue-400 hover:underline hover:text-blue-300"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              )}

              {/* SIGNUP form */}
              {isSignUp && otpStage !== "sent" && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      name="name"
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="col-span-1 w-full bg-gray-800 text-white px-3 py-2 rounded-xl outline-none placeholder:text-gray-400 text-sm"
                    />

                    <div className="col-span-1 flex items-center gap-2">
                      <input
                        name="payPalEmail"
                        type="email"
                        placeholder="Email"
                        value={formData.payPalEmail}
                        onChange={handleChange}
                        className="flex-1 min-w-0 bg-gray-800 text-white px-3 py-2 rounded-xl outline-none placeholder:text-gray-400 text-sm"
                      />
                    </div>

                    <input
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="col-span-1 md:col-span-2 w-full bg-gray-800 text-white px-3 py-2 rounded-xl outline-none placeholder:text-gray-400 text-sm"
                    />
                    <input
                      name="websiteUrl"
                      type="url"
                      placeholder="Website URL"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      className="col-span-1 md:col-span-2 w-full bg-gray-800 text-white px-3 py-2 rounded-xl outline-none placeholder:text-gray-400 text-sm"
                    />
                    <textarea
                      name="bio"
                      placeholder="Short Bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={2}
                      className="col-span-1 md:col-span-2 w-full bg-gray-800 text-white px-3 py-2 rounded-xl outline-none placeholder:text-gray-400 text-sm resize-none max-h-28"
                    />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="col-span-1 w-full bg-gray-800 text-white px-3 py-2 rounded-xl outline-none text-sm"
                    >
                      <option value="Fashion">Fashion</option>
                      <option value="Technology">Technology</option>
                      <option value="Food">Food</option>
                      <option value="Fitness">Fitness</option>
                    </select>

                    <div className="hidden md:block" />
                  </div>

                  {/* ✅ Sign Up + Google side by side */}
                  <div className="pt-3 flex justify-center gap-3">
                    <button
                      onClick={() => sendOtpRequest(formData.payPalEmail)}
                      disabled={sendingOtp || !formData.payPalEmail}
                      className="flex-1 px-3 py-2 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold transition-all duration-300 text-sm"
                    >
                      {sendingOtp ? "Sending..." : "Sign Up"}
                    </button>
                    <div className="flex items-center w-half gap-2 text-gray-400 text-xs">
                      <div className="flex-1 h-px bg-gray-600"></div>
                      <span>OR</span>
                      <div className="flex-1 h-px bg-gray-600"></div>
                    </div>

                    <button
                      onClick={() => console.log("Google Signup")} // replace with Google auth handler
                      className="flex-1 px-3 py-2 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all duration-300 text-sm"
                    >
                      Sign up with <FaGoogle />
                    </button>
                  </div>


                  <div className="text-center text-xs text-gray-400 pt-1">
                    Already have an account?{" "}
                    <button
                      onClick={() => setIsSignUp(false)}
                      className="text-blue-400 hover:underline hover:text-blue-300"
                    >
                      Login
                    </button>
                  </div>
                </div>
              )}


              {/* OTP VIEW */}
              {isSignUp && otpStage === "sent" && (
                <div className="pt-2">
                  <div className="text-sm text-gray-300 mb-3">
                    We've sent a code to <strong className="text-white">{maskedEmail}</strong>
                  </div>

                  <div className="flex gap-3 justify-center mb-2" onPaste={handlePaste}>
                    {digits.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => (inputsRef.current[i] = el as HTMLInputElement)}
                        value={d}
                        onChange={(e) => onDigitChange(i, e.target.value)}
                        onKeyDown={(e) => onKeyDown(e, i)}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        disabled={verifyingOtp}
                        className="w-12 h-12 text-center rounded-lg bg-gray-800 text-white text-lg outline-none disabled:opacity-60"
                      />
                    ))}
                  </div>

                  {otpError && <p className="text-xs text-red-400 mt-1 text-center">{otpError}</p>}

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-400">
                      {cooldown > 0 ? (
                        <span>Resend in {cooldown}s</span>
                      ) : (
                        <button onClick={handleResend} className="underline text-sm text-blue-300">
                          Resend code
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={cancelOtpFlow}
                        disabled={verifyingOtp}
                        className="px-3 py-2 rounded-lg border border-gray-600 text-sm disabled:opacity-60"
                      >
                        Cancel
                      </button>
                      <Button
                        onClick={handleVerifyAndRegister}
                        disabled={verifyingOtp}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
                      >
                        {verifyingOtp ? "Verifying..." : "Verify & Continue"}
                      </Button>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-gray-400 text-center">
                    If you don't receive the email, check spam or try resending. (Dev fallback accepts 123456)
                  </p>
                </div>
              )}

              {/* (Removed the separate 'verified' screen to avoid flicker) */}
            </div>

            {/* footer area kept minimal */}
            <div className="text-center text-xs text-gray-400 pt-2">{/* reserved for extra help text */}</div>
          </div>
        </div>
      </div>

      {/* ✅ Success Toast while staying on OTP view */}
      {
        successToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg">
            {successToast}
          </div>
        )
      }
    </div >
  );
}
