import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Spinner from "../components/Spinner";
import { subsAPI } from "../services/api";

const categories = ["Design", "Communication", "Productivity", "CRM", "Video", "Finance", "HR", "Security", "Other"];
const billingCycles = ["Monthly", "Quarterly", "Half-Yearly", "Yearly"];
const usageLevels = ["High", "Medium", "Low", "Unknown"];
const currencies = ["₹ INR", "$ USD", "€ EUR", "£ GBP"];

const popularTools = [
  { name: "Figma", icon: "🎨", category: "Design", cost: 45 },
  { name: "Slack", icon: "💬", category: "Communication", cost: 87 },
  { name: "Notion", icon: "📝", category: "Productivity", cost: 32 },
  { name: "Zoom", icon: "📹", category: "Communication", cost: 54 },
  { name: "HubSpot", icon: "📊", category: "CRM", cost: 120 },
  { name: "Linear", icon: "📐", category: "Productivity", cost: 28 },
  { name: "Loom", icon: "🎥", category: "Video", cost: 18 },
  { name: "Jira", icon: "🔧", category: "Productivity", cost: 70 },
];

export default function AddSubscription() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isEdit = !!editId;

  const [form, setForm] = useState({
    name: "", icon: "📦", category: "", cost: "", currency: "₹ INR",
    billing: "Monthly", seats: "", usage: "Medium",
    nextRenewal: "", website: "", notes: "", notify: true, status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    subsAPI.getOne(editId)
      .then(data => {
        const sub = data.subscription || data;
        setForm({
          name: sub.name || "", icon: sub.icon || "📦", category: sub.category || "",
          cost: sub.cost || "", currency: sub.currency || "₹ INR", billing: sub.billing || "Monthly",
          seats: sub.seats || "", usage: sub.usage || "Medium",
          nextRenewal: sub.nextRenewal ? sub.nextRenewal.split("T")[0] : "",
          website: sub.website || "", notes: sub.notes || "", notify: sub.notify !== false, status: sub.status || "active",
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setFetchLoading(false));
  }, [editId, isEdit]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const fillFromTemplate = (tool) => setForm(f => ({ ...f, name: tool.name, icon: tool.icon, category: tool.category, cost: tool.cost }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const payload = { ...form, cost: parseFloat(form.cost), seats: form.seats ? parseInt(form.seats) : undefined };
      if (isEdit) await subsAPI.update(editId, payload);
      else await subsAPI.create(payload);
      setSuccess(true);
      setTimeout(() => navigate("/subscriptions"), 1500);
    } catch (err) {
      setError(err.message || "Failed to save subscription");
    } finally {
      setLoading(false);
    }
  };

  const isValid = form.name && form.category && form.cost && form.nextRenewal;

  if (fetchLoading) return <PageLayout title={isEdit ? "Edit Subscription" : "Add Subscription"}><Spinner text="Loading subscription..." /></PageLayout>;

  if (success) return (
    <PageLayout title={isEdit ? "Edit Subscription" : "Add Subscription"}>
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-[#A855F7] bg-opacity-15 border border-[#A855F7] border-opacity-30 flex items-center justify-center text-4xl mb-6">✅</div>
        <h3 className="text-2xl font-bold text-white">{isEdit ? "Subscription Updated!" : "Subscription Added!"}</h3>
        <p className="text-gray-500 text-sm mt-2">Redirecting to your subscriptions...</p>
      </div>
    </PageLayout>
  );

  return (
    <PageLayout title={isEdit ? "Edit Subscription" : "Add Subscription"} subtitle={isEdit ? "Update subscription details" : "Track a new tool or service"}>
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Quick-fill */}
        {!isEdit && (
          <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl p-5">
            <p className="text-gray-400 text-xs tracking-widest uppercase mb-3">Quick Fill — Popular Tools</p>
            <div className="flex flex-wrap gap-2">
              {popularTools.map(t => (
                <button key={t.name} onClick={() => fillFromTemplate(t)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition ${form.name === t.name ? "bg-[#A855F7] bg-opacity-15 border-[#A855F7] border-opacity-50 text-[#A855F7]" : "bg-[#0F0A1E] border-[#3B1F6B] text-gray-400 hover:text-white hover:border-[#A855F7] hover:border-opacity-30"}`}>
                  <span>{t.icon}</span>{t.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step indicator */}
        {!isEdit && (
          <div className="flex gap-2 items-center">
            {[{ num: 1, label: "Basic Info" }, { num: 2, label: "Billing" }, { num: 3, label: "Usage & Notes" }].map((s, i, arr) => (
              <React.Fragment key={s.num}>
                <button onClick={() => setStep(s.num)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition ${step === s.num ? "bg-[#A855F7] bg-opacity-15 border border-[#A855F7] border-opacity-30 text-[#A855F7]" : "text-gray-600 hover:text-gray-400"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${step === s.num ? "bg-[#A855F7] text-white" : "bg-[#2D1B4E] text-gray-600"}`}>{s.num}</div>
                  {s.label}
                </button>
                {i < arr.length - 1 && <div className="flex-1 h-px bg-[#3B1F6B]" />}
              </React.Fragment>
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-900 bg-opacity-20 border border-red-800 rounded-xl px-4 py-3">
            <i className="ti ti-alert-circle text-red-400 text-sm" />
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1 or edit — Basic Info */}
          {(step === 1 || isEdit) && (
            <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl p-6 space-y-5">
              <h4 className="text-white font-semibold text-sm flex items-center gap-2"><i className="ti ti-info-circle text-[#A855F7]" /> Basic Information</h4>
              <div className="flex gap-3">
                <div>
                  <label className="text-gray-500 text-xs tracking-widest uppercase mb-2 block">Icon</label>
                  <input type="text" value={form.icon} onChange={e => set("icon", e.target.value)} maxLength={2}
                    className="w-14 h-[46px] text-center text-2xl bg-[#0F0A1E] border border-[#3B1F6B] rounded-xl focus:outline-none focus:border-[#A855F7] transition" />
                </div>
                <div className="flex-1">
                  <label className="text-gray-500 text-xs tracking-widest uppercase mb-2 block">Name *</label>
                  <input type="text" value={form.name} onChange={e => set("name", e.target.value)} required placeholder="e.g. Figma, Slack"
                    className="w-full bg-[#0F0A1E] border border-[#3B1F6B] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition placeholder-gray-700 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs tracking-widest uppercase mb-2 block">Category *</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(c => (
                    <button key={c} type="button" onClick={() => set("category", c)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition ${form.category === c ? "bg-[#A855F7] bg-opacity-15 border-[#A855F7] border-opacity-50 text-[#A855F7]" : "bg-[#0F0A1E] border-[#3B1F6B] text-gray-400 hover:text-white"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs tracking-widest uppercase mb-2 block">Website</label>
                <input type="url" value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://figma.com"
                  className="w-full bg-[#0F0A1E] border border-[#3B1F6B] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#A855F7] transition placeholder-gray-700 text-sm" />
              </div>
              {!isEdit && <button type="button" onClick={() => setStep(2)} disabled={!form.name || !form.category}
                className="w-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED] disabled:opacity-40 disabled:cursor-not-allowed hover:from-[#9333EA] hover:to-[#6D28D9] text-white font-semibold py-3 rounded-xl transition text-sm">
                Continue to Billing →
              </button>}
            </div>
          )}

          {/* Section 2 or edit — Billing */}
          {(step === 2 || isEdit) && (
            <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl p-6 space-y-5">
              <h4 className="text-white font-semibold text-sm flex items-center gap-2"><i className="ti ti-currency-rupee text-[#A855F7]" /> Billing Details</h4>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-gray-500 text-xs tracking-widest uppercase mb-2 block">Cost *</label>
                  <input type="number" value={form.cost} onChange={e => set("cost", e.target.value)} required placeholder="0.00" min="0"
                    className="w-full bg-[#0F0A1E] border border-[#3B1F6B] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#A855F7] transition placeholder-gray-700 text-sm" />
                </div>
                <div>
                  <label className="text-gray-500 text-xs tracking-widest uppercase mb-2 block">Currency</label>
                  <select value={form.currency} onChange={e => set("currency", e.target.value)}
                    className="bg-[#0F0A1E] border border-[#3B1F6B] text-white rounded-xl px-3 py-3 focus:outline-none focus:border-[#A855F7] transition text-sm h-[46px]">
                    {currencies.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs tracking-widest uppercase mb-2 block">Billing Cycle</label>
                <div className="flex gap-2 flex-wrap">
                  {billingCycles.map(b => (
                    <button key={b} type="button" onClick={() => set("billing", b)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium border transition ${form.billing === b ? "bg-[#A855F7] bg-opacity-15 border-[#A855F7] border-opacity-50 text-[#A855F7]" : "bg-[#0F0A1E] border-[#3B1F6B] text-gray-400 hover:text-white"}`}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs tracking-widest uppercase mb-2 block">Next Renewal Date *</label>
                <input type="date" value={form.nextRenewal} onChange={e => set("nextRenewal", e.target.value)} required
                  className="w-full bg-[#0F0A1E] border border-[#3B1F6B] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#A855F7] transition text-sm" style={{ colorScheme: "dark" }} />
              </div>
              <div>
                <label className="text-gray-500 text-xs tracking-widest uppercase mb-2 block">Seats / Licenses</label>
                <input type="number" value={form.seats} onChange={e => set("seats", e.target.value)} placeholder="e.g. 5" min="1"
                  className="w-full bg-[#0F0A1E] border border-[#3B1F6B] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#A855F7] transition placeholder-gray-700 text-sm" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => set("notify", !form.notify)} className={`w-11 h-6 rounded-full transition-colors duration-200 relative cursor-pointer ${form.notify ? "bg-[#A855F7]" : "bg-[#2D1B4E]"}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${form.notify ? "left-6" : "left-1"}`} />
                </div>
                <span className="text-gray-400 text-sm">Send renewal reminders</span>
              </label>
              {!isEdit && (
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 bg-transparent border border-[#3B1F6B] hover:border-[#A855F7] text-gray-400 hover:text-white font-semibold py-3 rounded-xl transition text-sm">← Back</button>
                  <button type="button" onClick={() => setStep(3)} disabled={!form.cost || !form.nextRenewal}
                    className="flex-[2] bg-gradient-to-r from-[#A855F7] to-[#7C3AED] disabled:opacity-40 disabled:cursor-not-allowed hover:from-[#9333EA] hover:to-[#6D28D9] text-white font-semibold py-3 rounded-xl transition text-sm">
                    Continue to Usage →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Section 3 or edit — Usage & Notes */}
          {(step === 3 || isEdit) && (
            <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl p-6 space-y-5">
              <h4 className="text-white font-semibold text-sm flex items-center gap-2"><i className="ti ti-chart-bar text-[#A855F7]" /> Usage & Notes</h4>
              <div>
                <label className="text-gray-500 text-xs tracking-widest uppercase mb-2 block">Usage Level</label>
                <div className="flex gap-2">
                  {usageLevels.map(u => (
                    <button key={u} type="button" onClick={() => set("usage", u)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium border transition ${form.usage === u ? "bg-[#A855F7] bg-opacity-15 border-[#A855F7] border-opacity-50 text-[#A855F7]" : "bg-[#0F0A1E] border-[#3B1F6B] text-gray-400 hover:text-white"}`}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-gray-500 text-xs tracking-widest uppercase mb-2 block">Notes</label>
                <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={4} placeholder="Why do we use this? Who owns it? Any cancellation notes..."
                  className="w-full bg-[#0F0A1E] border border-[#3B1F6B] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#A855F7] transition placeholder-gray-700 text-sm resize-none" />
              </div>

              {/* Summary */}
              <div className="bg-[#0F0A1E] border border-[#3B1F6B] rounded-xl p-4">
                <p className="text-gray-500 text-xs tracking-widest uppercase mb-3">Summary</p>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                  <div><span className="text-gray-600">Name:</span> <span className="text-white font-medium">{form.name || "—"}</span></div>
                  <div><span className="text-gray-600">Category:</span> <span className="text-white font-medium">{form.category || "—"}</span></div>
                  <div><span className="text-gray-600">Cost:</span> <span className="text-[#A855F7] font-semibold">{form.cost ? `${form.currency.split(" ")[0]}${form.cost}/${form.billing}` : "—"}</span></div>
                  <div><span className="text-gray-600">Renews:</span> <span className="text-white font-medium">{form.nextRenewal || "—"}</span></div>
                  <div><span className="text-gray-600">Usage:</span> <span className="text-white font-medium">{form.usage}</span></div>
                  <div><span className="text-gray-600">Alerts:</span> <span className={form.notify ? "text-green-400" : "text-gray-500"}>{form.notify ? "On" : "Off"}</span></div>
                </div>
              </div>

              <div className="flex gap-3">
                {!isEdit && <button type="button" onClick={() => setStep(2)} className="flex-1 bg-transparent border border-[#3B1F6B] hover:border-[#A855F7] text-gray-400 hover:text-white font-semibold py-3 rounded-xl transition text-sm">← Back</button>}
                <button type="submit" disabled={!isValid || loading}
                  className="flex-[2] bg-gradient-to-r from-[#A855F7] to-[#7C3AED] disabled:opacity-40 disabled:cursor-not-allowed hover:from-[#9333EA] hover:to-[#6D28D9] active:scale-95 text-white font-semibold py-3 rounded-xl transition text-sm shadow-lg shadow-purple-900/40">
                  {loading
                    ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving...</span>
                    : isEdit ? "Save Changes ✓" : "Add Subscription ✓"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </PageLayout>
  );
}
