import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", company: "" });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleNext = (e) => { e.preventDefault(); setError(""); setStep(2); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }
    setError("");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.company);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const strength = () => {
    const p = form.password;
    if (!p) return { width: "0%", color: "bg-gray-700", label: "" };
    if (p.length < 6) return { width: "25%", color: "bg-red-500", label: "Weak" };
    if (p.length < 10) return { width: "55%", color: "bg-yellow-500", label: "Fair" };
    if (p.match(/[A-Z]/) && p.match(/[0-9]/) && p.match(/[^A-Za-z0-9]/)) return { width: "100%", color: "bg-green-500", label: "Strong" };
    return { width: "75%", color: "bg-blue-400", label: "Good" };
  };
  const s = strength();

  const EyeIcon = ({ visible }) => (
    <svg className="w-4 h-4 text-gray-500 hover:text-gray-300 transition cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {visible
        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      }
    </svg>
  );

  const features = [
    { icon: "📊", text: "Track all subscriptions in one place" },
    { icon: "🔔", text: "Renewal alerts before you're charged" },
    { icon: "💡", text: "AI health scores for every tool" },
    { icon: "📉", text: "Spot waste & cut costs instantly" },
  ];

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
            <p className="text-[#A855F7] text-xs tracking-widest uppercase">Free forever. No credit card.</p>
          </div>
          <h2 className="text-5xl font-bold text-white leading-[1.15]">
            Stop guessing.<br />Start knowing<br /><span className="text-[#A855F7]">exactly</span> what<br />you pay for.
          </h2>
          <div className="mt-10 space-y-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#A855F7] bg-opacity-10 border border-[#A855F7] border-opacity-20 flex items-center justify-center text-sm flex-shrink-0">{f.icon}</div>
                <p className="text-gray-400 text-sm">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-gray-700 text-xs">© 2026 SubSense. Built for smart businesses.</p>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-3xl p-8 shadow-2xl shadow-purple-900/20">
            <div className="mb-7">
              <div className="inline-flex items-center gap-2 bg-[#A855F7] bg-opacity-10 border border-[#A855F7] border-opacity-20 rounded-full px-3 py-1 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse"></div>
                <p className="text-[#A855F7] text-xs tracking-widest uppercase">{step === 1 ? "Step 1 of 2 — Your Info" : "Step 2 of 2 — Security"}</p>
              </div>
              <h2 className="text-3xl font-bold text-white leading-tight">{step === 1 ? <>"Create your<br />free account."</> : <>"Secure your<br />account."</>}</h2>
            </div>

            <div className="flex gap-2 mb-7">
              <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 1 ? "bg-[#A855F7]" : "bg-[#3B1F6B]"}`}></div>
              <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= 2 ? "bg-[#A855F7]" : "bg-[#3B1F6B]"}`}></div>
            </div>

            {error && (
              <div className="mb-5 flex items-center gap-2 bg-red-900 bg-opacity-20 border border-red-800 rounded-xl px-4 py-3">
                <i className="ti ti-alert-circle text-red-400 text-sm" />
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-5">
                <div>
                  <label className="text-gray-400 text-xs tracking-widest uppercase mb-2 block">Full Name</label>
                  <input type="text" value={form.name} onChange={e => set("name", e.target.value)} required placeholder="Gowtham Kumar"
                    className="w-full bg-[#0F0A1E] border border-[#3B1F6B] text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition placeholder-gray-700 text-sm" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs tracking-widest uppercase mb-2 block">Work Email</label>
                  <input type="email" value={form.email} onChange={e => set("email", e.target.value)} required placeholder="you@company.com"
                    className="w-full bg-[#0F0A1E] border border-[#3B1F6B] text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition placeholder-gray-700 text-sm" />
                </div>
                <div>
                  <label className="text-gray-400 text-xs tracking-widest uppercase mb-2 block">Company Name <span className="text-gray-700 normal-case tracking-normal">(optional)</span></label>
                  <input type="text" value={form.company} onChange={e => set("company", e.target.value)} placeholder="Acme Inc."
                    className="w-full bg-[#0F0A1E] border border-[#3B1F6B] text-white rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition placeholder-gray-700 text-sm" />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] active:scale-95 text-white font-semibold py-3.5 rounded-xl transition text-sm">
                  Continue →
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-gray-400 text-xs tracking-widest uppercase mb-2 block">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={form.password} onChange={e => set("password", e.target.value)} required placeholder="••••••••"
                      className="w-full bg-[#0F0A1E] border border-[#3B1F6B] text-white rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition placeholder-gray-700 text-sm" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2"><EyeIcon visible={showPassword} /></button>
                  </div>
                  {form.password && (
                    <div className="mt-2">
                      <div className="h-1 rounded-full bg-[#0F0A1E] overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${s.color}`} style={{ width: s.width }}></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{s.label}</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-gray-400 text-xs tracking-widest uppercase mb-2 block">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={e => set("confirmPassword", e.target.value)} required placeholder="••••••••"
                      className={`w-full bg-[#0F0A1E] border text-white rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-1 transition placeholder-gray-700 text-sm ${form.confirmPassword && form.confirmPassword !== form.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-[#3B1F6B] focus:border-[#A855F7] focus:ring-[#A855F7]"}`} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2"><EyeIcon visible={showConfirm} /></button>
                  </div>
                  {form.confirmPassword && form.confirmPassword !== form.password && <p className="text-red-500 text-xs mt-1">Passwords do not match.</p>}
                </div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div onClick={() => setAgreed(!agreed)} className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition ${agreed ? "bg-[#A855F7] border-[#A855F7]" : "border-[#3B1F6B]"}`}>
                    {agreed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="text-gray-500 text-xs leading-relaxed">I agree to the <a href="#" className="text-[#A855F7] hover:underline">Terms of Service</a> and <a href="#" className="text-[#A855F7] hover:underline">Privacy Policy</a>.</span>
                </label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 bg-transparent border border-[#3B1F6B] hover:border-[#A855F7] text-gray-400 hover:text-white font-semibold py-3.5 rounded-xl transition text-sm">← Back</button>
                  <button type="submit" disabled={!agreed || form.password !== form.confirmPassword || !form.password || loading}
                    className="flex-[2] bg-gradient-to-r from-[#A855F7] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition text-sm shadow-lg shadow-purple-900/40">
                    {loading ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Creating...</span> : "Create Account →"}
                  </button>
                </div>
              </form>
            )}

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#3B1F6B]"></div><p className="text-gray-700 text-xs">or</p><div className="flex-1 h-px bg-[#3B1F6B]"></div>
            </div>
            <p className="text-gray-500 text-sm text-center">Already have an account? <a href="/" className="text-[#A855F7] hover:underline font-semibold">Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
