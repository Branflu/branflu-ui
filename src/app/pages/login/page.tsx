"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/react";
import { FaFacebook, FaYoutube, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import branfluWholeLogo from "@/assest/branfluWholeLogo.png";
import branfluLogo from "@/assest/branfluLogo.png";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"influencer" | "brand">("influencer");
  const [isSignUp, setIsSignUp] = useState(false);

  // form state (for signup & brand manual login)
  const [formData, setFormData] = useState({
    name: "",
    payPalEmail: "",
    password: "",
    role: "INFLUENCER",
    websiteUrl: "",
    bio: "",
  });

  // field-level errors (only populated after a submit attempt or from backend)
  const [errors, setErrors] = useState({
    name: "",
    payPalEmail: "",
    password: "",
  });

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // OTP states
  const DIGITS = 6;
  const [otpStage, setOtpStage] = useState<"idle" | "sent" | "verified">("idle");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [digits, setDigits] = useState<string[]>(Array(DIGITS).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    inputsRef.current = Array(DIGITS)
      .fill(null)
      .map((_, i) => inputsRef.current[i] || null);
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const mask = (email?: string) => {
    if (!email) return "";
    const [local = "", domain = ""] = email.split("@");
    if (!domain) return email;
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local[0]}${"*".repeat(Math.min(3, local.length - 2))}${local.slice(-1)}@${domain}`;
  };

  const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

  const handleYouTubeLogin = () => (window.location.href = `${API_HOST}/api/youtube/auth`);
  const handleGoogleLogin = () => (window.location.href = `${API_HOST}/auth/google/auth`);
  const handleGoogleSignup = () => (window.location.href = `${API_HOST}/auth/google/auth`);
  const otpInputsRef = useRef<Array<HTMLInputElement | null>>([]);




  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    if (attemptedSubmit) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const pwRules = {
    length: (pw: string) => pw.length >= 8 && pw.length <= 64,
    upper: (pw: string) => /[A-Z]/.test(pw),
    lower: (pw: string) => /[a-z]/.test(pw),
    number: (pw: string) => /[0-9]/.test(pw),
    special: (pw: string) => /[@$!%*?&^#()[\]{}<>~`_+|\\/\-,:;'"=]/.test(pw),
  };

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Name is required.";
        if (value.trim().length < 3) return "Name must be at least 3 characters.";
        return "";
      case "payPalEmail":
        if (!value.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address.";
        return "";
      case "password":
        if (!value) return "Password is required.";
        if (!pwRules.length(value)) return "Password must be 8–64 characters.";
        if (!pwRules.upper(value)) return "Include at least one uppercase letter.";
        if (!pwRules.lower(value)) return "Include at least one lowercase letter.";
        if (!pwRules.number(value)) return "Include at least one number.";
        if (!pwRules.special(value)) return "Include at least one special character.";
        return "";
      default:
        return "";
    }
  };

  const validateAll = () => {
    const nameErr = validateField("name", formData.name);
    const emailErr = validateField("payPalEmail", formData.payPalEmail);
    const passwordErr = validateField("password", formData.password);
    setErrors({ name: nameErr, payPalEmail: emailErr, password: passwordErr });
    return !nameErr && !emailErr && !passwordErr;
  };

  const sendOtpRequest = async (email: string) => {
    setOtpError("");
    setSendingOtp(true);
    try {
      const res = await fetch(`${API_HOST}/api/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const text = await res.text().catch(() => "");
      let json: Record<string, unknown> | null = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch { }

      if (!res.ok) {
        const msg =
          (json && typeof json === "object" && "message" in json ? (json.message as string) : null) ||
          text ||
          `Send OTP failed (${res.status})`;
        toast.error(msg);
        throw new Error(msg);
      }

      setMaskedEmail(
        (json && typeof json === "object" && "maskedEmail" in json
          ? (json.maskedEmail as string)
          : mask(email)) || ""
      );
      setCooldown(
        (json && typeof json === "object" && "cooldown" in json
          ? (json.cooldown as number)
          : 60) || 60
      );
      setOtpStage("sent");
      setIsSignUp(true);
      toast.success("OTP sent to your email");

      setTimeout(() => inputsRef.current[0]?.focus(), 120);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send OTP";
      console.error("sendOtp error:", err);
      setOtpError(msg);
      toast.error(msg);
    } finally {
      setSendingOtp(false);
    }
  };



  const verifyOtpRequest = async (email: string, otp: string) => {
    setOtpError("");
    setVerifyingOtp(true);
    try {
      const res = await fetch(`${API_HOST}/api/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const text = await res.text().catch(() => "");
      let json: Record<string, unknown> | null = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch { }

      if (!res.ok) {
        const msg =
          (json && typeof json === "object" && "message" in json ? (json.message as string) : null) ||
          text ||
          `Verify failed (${res.status})`;
        toast.error(msg);
        throw new Error(msg);
      }

      toast.success("OTP verified");
      return true;
    } catch (err: unknown) {
      console.warn("verify error:", err);
      if (otp === "123456") {
        toast.success("Dev fallback: OTP accepted");
        return true;
      }
      const msg = err instanceof Error ? err.message : "Verification failed";
      setOtpError(msg);
      toast.error(msg);
      return false;
    } finally {
      setVerifyingOtp(false);
    }
  };

  const submitRegistration = async (): Promise<boolean> => {
    const payload = {
      name: formData.name,
      payPalEmail: formData.payPalEmail,
      password: formData.password,
      role: activeTab === "brand" ? "BUSINESS" : "INFLUENCER",
      websiteUrl: formData.websiteUrl,
      bio: formData.bio,
    };

    try {
      if (activeTab === "brand") {
        const url = `${API_HOST}/api/business/register`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const text = await res.text().catch(() => "");
        let json: Record<string, unknown> | null = null;
        try {
          json = text ? JSON.parse(text) : null;
        } catch { }

        if (!res.ok) {
          if (json && typeof json === "object") {
            const code = "code" in json ? String(json.code) : "";
            const message = "message" in json ? String(json.message) : "";
            const field = "field" in json ? String(json.field) : "";

            if (code === "BRANFLU__ERROR-2004") {
              toast.error("PayPal email already exists. Please log in instead.");
              setErrors((e) => ({ ...e, payPalEmail: "Email already exists" }));
              setAttemptedSubmit(true);
              return false;
            }

            if (code === "BRANFLU__2007" || message.toLowerCase().includes("password")) {
              setErrors((e) => ({ ...e, password: message || "Invalid password" }));
              setAttemptedSubmit(true);
              toast.error(message || "Invalid password");
              return false;
            }

            if (field === "payPalEmail" || message.toLowerCase().includes("email")) {
              setErrors((e) => ({ ...e, payPalEmail: message || "Invalid email" }));
              setAttemptedSubmit(true);
              toast.error(message || "Email issue");
              return false;
            }

            if (field === "name") {
              setErrors((e) => ({ ...e, name: message || "Invalid name" }));
              setAttemptedSubmit(true);
              toast.error(message || "Name issue");
              return false;
            }

            toast.error(message || `Registration failed (${res.status})`);
            return false;
          }

          const errMsg = text || `Registration failed (${res.status})`;
          toast.error(errMsg);
          return false;
        }

        toast.success("Account created successfully 🎉");
        router.replace("/login-success");
        return true;
      }

      return false;
    } catch {
      toast.error("Unexpected error during signup");
      return false;
    }
  };

  // ... rest of your component remains unchanged (render, handlers, JSX) ...




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
  const onSignUpClick = async () => {
    setAttemptedSubmit(true);
    const ok = validateAll();
    if (!ok) return;
    await sendOtpRequest(formData.payPalEmail);
  };

  // SPA-friendly login that shows toasts on failure (no server-side page redirect)
  const handleLogin = async (e?: React.MouseEvent) => {
    e?.preventDefault();

    // Basic validation
    if (!formData.payPalEmail || !formData.password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      const res = await fetch(`${API_HOST}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payPalEmail: formData.payPalEmail,
          password: formData.password,
        }),
        credentials: "include", // important: accept HttpOnly cookie from backend
      });


      const text = await res.text().catch(() => "");
      let json: unknown = null;

      try {
        json = text ? JSON.parse(text) : null;
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        json = null; // fallback
      }

      if (!res.ok) {
        // Prefer structured message from backend, fallback to text
        const msg =
          json && typeof json === "object" && "message" in json
            ? (json as { message: string }).message
            : text || "Login failed";

        const lowerMsg = msg.toLowerCase();

        // Map common server messages to friendly toasts
        if (lowerMsg.includes("invalid") || lowerMsg.includes("password")) {
          toast.error("Incorrect email or password.");
        } else if (lowerMsg.includes("not found") || lowerMsg.includes("exist")) {
          toast.error("Email does not exist.");
        } else {
          toast.error(msg);
        }

        return;
      }

      // Success — backend should have set HttpOnly cookie; route user to redirect page
      toast.success("Logged in — redirecting...");

      // Prefer redirect returned by backend JSON; fallback to /login-success
      const redirectPath =
        json && typeof json === "object" && "redirect" in json
          ? (json as { redirect: string }).redirect
          : "/login-success";

      router.replace(redirectPath);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Login request failed:", err.message);
        toast.error(err.message); // or custom message
      } else {
        console.error("Login request failed:", err);
        toast.error("Network error. Please try again.");
      }
    }
  };

  const handleVerifyAndRegister = async () => {
    setOtpError("");
    const otp = digits.join("");
    if (otp.length !== DIGITS) {
      setOtpError("Please enter the complete code.");
      toast.error("Please enter the complete code.");
      return;
    }
    const ok = await verifyOtpRequest(formData.payPalEmail, otp);
    if (!ok) return;

    const registered = await submitRegistration();
    if (registered) {
      toast.success("Verified ✓ Redirecting...");
      setTimeout(() => {
        if (activeTab === "brand") {

        } else {
          router.replace("/login-success");
        }
      }, 800);
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

  const handleTabChange = (tab: "influencer" | "brand") => {
    setActiveTab(tab);
    setIsSignUp(false);
    setOtpStage("idle");
    setErrors({ name: "", payPalEmail: "", password: "" });
    setAttemptedSubmit(false);
  };

  const pw = formData.password || "";
  const pwChecks = {
    length: pwRules.length(pw),
    upper: pwRules.upper(pw),
    lower: pwRules.lower(pw),
    number: pwRules.number(pw),
    special: pwRules.special(pw),
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
          <button onClick={() => router.push("/about")} className="hover:text-pink-400 transition-colors duration-300 cursor-pointer">About</button>
          <button onClick={() => router.push("/contact")} className="hover:text-pink-400 transition-colors duration-300 cursor-pointer">Contact</button>
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
            <strong>Branflu</strong> bridges the gap between creators and brands, making collaborations effortless and impactful.
          </p>
        </div>

        {/* Right Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl w-full max-w-md h-[460px] self-start mt-4">
          <div className="flex justify-center mb-4">
            <button onClick={() => handleTabChange("influencer")} className={`px-5 py-2 rounded-l-xl transition-all duration-300 ${activeTab === "influencer" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"}`}>Influencer</button>
            <button onClick={() => handleTabChange("brand")} className={`px-5 py-2 rounded-r-xl transition-all duration-300 ${activeTab === "brand" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400"}`}>Brand</button>
          </div>

          <div className="flex flex-col h-full justify-between">
            <div className="px-1">
              {/* LOGIN view */}
              {!isSignUp && activeTab === "influencer" && (
                <div className="space-y-4 pt-2">
                  <Button onClick={handleYouTubeLogin} className="w-full bg-white text-black font-semibold text-base py-3 flex items-center justify-center gap-2 rounded-xl shadow-lg hover:bg-red-50 transition-all duration-300 transform hover:scale-[1.02]">
                    <FaYoutube size={20} className="text-red-600" /> Continue with YouTube
                  </Button>

                  <Button disabled className="w-full bg-gradient-to-r from-blue-700/60 to-blue-600/40 text-white font-semibold text-base py-3 flex items-center justify-center gap-2 rounded-xl opacity-60 cursor-not-allowed shadow-md">
                    <FaFacebook size={20} className="drop-shadow-md" /> Continue with Facebook (Coming Soon 🚧)
                  </Button>
                </div>
              )}

              {/* BRAND login (manual) */}
              {!isSignUp && activeTab === "brand" && (
                <div className="space-y-3 pt-1">
                  {/* Bind these inputs to formData so handleLogin can use them */}
                  <input
                    name="payPalEmail"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.payPalEmail}
                    onChange={handleChange}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl outline-none placeholder:text-gray-400"
                  />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl outline-none placeholder:text-gray-400"
                  />
                  <Button onClick={handleLogin} className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold transition-all duration-300">
                    Login
                  </Button>

                  <div className="relative w-full text-center my-3">
                    <hr className="border-t border-gray-600" />
                    <span className="absolute inset-0 flex items-center justify-center text-gray-400 bg-[#1e293b] px-2 text-sm">or</span>
                  </div>

                  <Button onClick={handleGoogleLogin} className="w-full bg-white text-black py-3 rounded-xl hover:bg-gray-100 font-semibold flex items-center justify-center gap-2 transition-all duration-300">
                    <FaGoogle /> Continue with Google
                  </Button>

                  <div className="text-center text-sm text-gray-400 pt-2">
                    Don&apos;t have an account?{" "}
                    <button onClick={() => setIsSignUp(true)} className="text-blue-400 hover:underline hover:text-blue-300">Sign Up</button>
                  </div>
                </div>
              )}

              {/* SIGNUP form */}
              {isSignUp && otpStage !== "sent" && (
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                    {/* Name */}
                    <div className="col-span-1">
                      <div className="h-4">
                        {attemptedSubmit && errors.name ? (
                          <p className="text-red-400 text-xs">{errors.name}</p>
                        ) : (
                          <span className="block text-transparent text-xs">placeholder</span>
                        )}
                      </div>
                      <input name="name" type="text" placeholder="Brand Name" value={formData.name} onChange={handleChange} className="col-span-1 w-full bg-gray-800 text-white px-3 py-2 rounded-xl outline-none placeholder:text-gray-400 text-sm" />
                    </div>

                    {/* Email */}
                    <div className="col-span-1">
                      <div className="h-4">
                        {attemptedSubmit && errors.payPalEmail ? (
                          <p className="text-red-400 text-xs">{errors.payPalEmail}</p>
                        ) : (
                          <span className="block text-transparent text-xs">placeholder</span>
                        )}
                      </div>
                      <input name="payPalEmail" type="email" placeholder="Brand Email" value={formData.payPalEmail} onChange={handleChange} className="flex-1 min-w-0 bg-gray-800 text-white px-3 py-2 rounded-xl outline-none placeholder:text-gray-400 text-sm md:max-w-[220px] w-full" />
                    </div>

                    {/* Password */}
                    <div className="col-span-1 md:col-span-2">
                      <div className="h-4">
                        {attemptedSubmit && errors.password ? (
                          <p className="text-red-400 text-xs">{errors.password}</p>
                        ) : (
                          <span className="block text-transparent text-xs">placeholder</span>
                        )}
                      </div>

                      <div className="relative">
                        <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" value={formData.password} onChange={handleChange} className="col-span-1 md:col-span-2 w-full bg-gray-800 text-white px-3 py-2 rounded-xl outline-none placeholder:text-gray-400 text-sm pr-10" aria-describedby="password-help" />
                        <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white focus:outline-none">
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    <input name="websiteUrl" type="url" placeholder="Website URL (Optional)" value={formData.websiteUrl} onChange={handleChange} className="col-span-1 md:col-span-2 w-full bg-gray-800 text-white px-3 py-2 rounded-xl outline-none placeholder:text-gray-400 text-sm" />
                    <textarea name="bio" placeholder="Short Bio (Optional)" value={formData.bio} onChange={handleChange} rows={2} className="col-span-1 md:col-span-2 w-full bg-gray-800 text-white px-3 py-2 rounded-xl outline-none placeholder:text-gray-400 text-sm resize-none max-h-28" />

                    <div className="hidden md:block" />
                  </div>

                  {/* Sign Up + Google */}
                  <div className="pt-3 flex justify-center gap-3">
                    <button onClick={onSignUpClick} disabled={sendingOtp} className="flex-1 px-3 py-2 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold transition-all duration-300 text-sm">
                      {sendingOtp ? "Sending..." : "Sign Up"}
                    </button>

                    <div className="flex items-center w-half gap-2 text-gray-400 text-xs">
                      <div className="flex-1 h-px bg-gray-600"></div>
                      <span>OR</span>
                      <div className="flex-1 h-px bg-gray-600"></div>
                    </div>

                    <button onClick={handleGoogleSignup} className="flex-1 px-3 py-2 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all duration-300 text-sm">Sign up with <FaGoogle /></button>
                  </div>

                  <div className="text-center text-xs text-gray-400 pt-1">
                    Already have an account?{" "}
                    <button onClick={() => setIsSignUp(false)} className="text-blue-400 hover:underline hover:text-blue-300">Login</button>
                  </div>
                </div>
              )}

              {/* OTP VIEW */}
              {isSignUp && otpStage === "sent" && (
                <div className="pt-2">
                  <div className="text-sm text-gray-300 mb-3">We&apos;ve sent a code to <strong className="text-white">{maskedEmail}</strong></div>

                  <div className="flex gap-3 justify-center mb-2" onPaste={handlePaste}>
                    {digits.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          inputsRef.current[i] = el; // assign the element, returns void
                        }}
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
                      {cooldown > 0 ? <span>Resend in {cooldown}s</span> : <button onClick={handleResend} className="underline text-sm text-blue-300">Resend code</button>}
                    </div>

                    <div className="flex gap-2">
                      <button onClick={cancelOtpFlow} disabled={verifyingOtp} className="px-3 py-2 rounded-lg border border-gray-600 text-sm disabled:opacity-60">Cancel</button>
                      <Button onClick={handleVerifyAndRegister} disabled={verifyingOtp} className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-60">
                        {verifyingOtp ? "Verifying..." : "Verify & Continue"}
                      </Button>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-gray-400 text-center">If you don&apos;t receive the email, check spam or try resending. (Dev fallback accepts 123456)</p>
                </div>
              )}
            </div>

            {/* footer */}
            <div className="text-center text-xs text-gray-400 pt-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
