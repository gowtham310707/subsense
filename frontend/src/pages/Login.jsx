import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0A1E] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-[#A855F7] opacity-[0.07] rounded-full blur-[140px] animate-pulse"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-[#7C3AED] opacity-[0.07] rounded-full blur-[140px] animate-pulse"></div>

      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 h-screen bg-[#1A0F35] px-16 py-12 border-r border-[#3B1F6B]">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Sub<span className="text-[#A855F7]">Sense</span></h1>
            <p className="text-[#A855F7] text-xs mt-1 tracking-[4px] uppercase opacity-70">Subscription Intelligence</p>
          </div>
        </div>
        <div>
          <div className="inline-flex items-center gap-2 bg-[#A855F7] bg-opacity-10 border border-[#A855F7] border-opacity-20 rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse"></div>
            <p className="text-[#A855F7] text-xs tracking-widest uppercase">Smart. Simple. Powerful.</p>
          </div>
          <h2 className="text-5xl font-bold text-white leading-[1.15]">
            Every rupee<br />you spend<br /><span className="text-[#A855F7]">should earn</span><br />its place.
          </h2>
          <p className="text-gray-500 mt-6 text-sm leading-relaxed max-w-sm">
            SubSense gives every subscription a health score — so you always know what's worth keeping and what's quietly draining your budget.
          </p>
          <div className="flex gap-6 mt-10">
            {[{ num: "84%", label: "businesses overpay" }, { num: "₹341", label: "wasted monthly" }, { num: "3×", label: "tool overlap" }].map((s, i) => (
              <div key={i} className="border-l-2 border-[#A855F7] pl-4">
                <p className="text-2xl font-bold text-white">{s.num}</p>
                <p className="text-gray-600 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-700 text-xs">© 2026 SubSense. Built for smart businesses.</p>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-3xl font-bold text-white">Sub<span className="text-[#A855F7]">Sense</span></h1>
          </div>

          <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-3xl p-8 shadow-2xl shadow-purple-900/20">
            <div className="mb-7">
              <div className="inline-flex items-center gap-2 bg-[#A855F7] bg-opacity-10 border border-[#A855F7] border-opacity-20 rounded-full px-3 py-1 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse"></div>
                <p className="text-[#A855F7] text-xs tracking-widest uppercase">Your dashboard awaits</p>
              </div>
              <h2 className="text-3xl font-bold text-white leading-tight">Sign in &<br />take control.</h2>
              <p className="text-gray-500 mt-2 text-sm">Don't let another subscription go unnoticed.</p>
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-2 bg-red-900 bg-opacity-20 border border-red-800 rounded-xl px-4 py-3">
                <i className="ti ti-alert-circle text-red-400 text-sm" />
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-gray-400 text-xs tracking-widest uppercase mb-2 block">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@company.com"
                  className="w-full bg-[#0F0A1E] border border-[#3B1F6B] text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition placeholder-gray-700 text-sm" />
              </div>
              <div>
                <label className="text-gray-400 text-xs tracking-widest uppercase mb-2 block">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full bg-[#0F0A1E] border border-[#3B1F6B] text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition placeholder-gray-700 text-sm" />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#A855F7]" />
                  <span className="text-gray-500 text-xs">Remember me</span>
                </label>
                <a href="#" className="text-[#A855F7] text-xs hover:underline">Forgot password?</a>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] active:scale-95 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition text-sm tracking-wide shadow-lg shadow-purple-900/40">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    Signing in...
                  </span>
                ) : "Sign In to SubSense →"}
              </button>
            </form>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#3B1F6B]"></div>
              <p className="text-gray-700 text-xs">or</p>
              <div className="flex-1 h-px bg-[#3B1F6B]"></div>
            </div>
            <p className="text-gray-500 text-sm text-center">
              New to SubSense?{" "}
              <a href="/register" className="text-[#A855F7] hover:underline font-semibold">Create free account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
