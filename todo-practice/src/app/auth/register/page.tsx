"use client";
import Circle from "../../components/bgCircle";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/useUserStore";
import { useState } from "react";

export default function Register() {
  const router = useRouter();

  const setUsernameState = useUserStore((state) => state.setUsername);
  const setUserIdState = useUserStore((state) => state.setUserId);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function registerAccount() {
    if (!username || !password || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("API Response:", data);

      if (res.ok) {
        setUsernameState(username);
        setUserIdState(data.user.userId);
        router.push("/home");
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (e) {
      alert(`Network Error: ${e}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 relative flex flex-col overflow-hidden">
      {/* Background circles */}
      <Circle />

      {/* Main content */}
      <div className="flex-1 flex flex-col px-8 pt-60">
        {/* Header text */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-black mb-4">
            Welcome to Onboard!
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            Let&apos;s help to meet up your tasks.
          </p>
        </div>

        {/* Form inputs */}
        <div className="space-y-6 mb-10">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Enter your username"
            className="w-full px-6 py-4 rounded-4xl bg-white  outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-black"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter Password"
            className="w-full px-6 py-4 rounded-4xl bg-white outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-black"
          />
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm password"
            className="w-full px-6 py-4 rounded-4xl bg-white outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-black"
          />
        </div>
      </div>

      {/* Bottom buttons section */}
      <div className="px-8 pb-20 mx-auto">
        <button
          disabled={loading}
          onClick={() => registerAccount()}
          className="w-[350px] bg-[#50C2C9] text-white rounded-lg py-4 text-[18px] font-bold shadow-sm mb-6"
        >
          Register
        </button>

        {/* Sign in link */}
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/auth/login")}
            className="text-[#50C2C9] font-medium"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
