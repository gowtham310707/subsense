import React, { useEffect, useState, useCallback } from "react";
import PageLayout from "../components/PageLayout";
import Spinner from "../components/Spinner";
import ErrorMsg from "../components/ErrorMsg";
import { subsAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

function ScoreBar({ score }) {
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 rounded-full bg-[#2D1B4E] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold w-6" style={{ color }}>{score}</span>
    </div>
  );
}

export default function Subscriptions() {
  const navigate = useNavigate();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("table");
  const [selected, setSelected] = useState([]);
  const [deleting, setDeleting] = useState(null);

  const fetchSubs = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const data = await subsAPI.getAll();
      setSubs(data.subscriptions || data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subscription?")) return;
    setDeleting(id);
    try { await subsAPI.delete(id); setSubs(s => s.filter(x => (x._id || x.id) !== id)); }
    catch (err) { alert(err.message); }
    finally { setDeleting(null); }
  };

  const categories = ["All", ...new Set(subs.map(s => s.category).filter(Boolean))];

  const filtered = subs
    .filter(s => (category === "All" || s.category === category) &&
      (s.name?.toLowerCase().includes(search.toLowerCase()) || s.category?.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sortBy === "cost") return b.cost - a.cost;
      if (sortBy === "score") return (b.score || 0) - (a.score || 0);
      return (a.name || "").localeCompare(b.name || "");
    });

  const totalCost = filtered.reduce((a, s) => a + (s.cost || 0), 0);
  const toggleSelect = (id) => setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);

  return (
    <PageLayout
      title="Subscriptions"
      subtitle={loading ? "Loading..." : `${subs.length} total · ₹${subs.reduce((a, s) => a + (s.cost || 0), 0).toLocaleString()}/mo`}
      action={{ label: "Add Subscription", icon: "ti-plus", path: "/add" }}
    >
      {loading ? <Spinner text="Fetching subscriptions..." /> : error ? <ErrorMsg message={error} onRetry={fetchSubs} /> : (
        <div className="space-y-5">

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <i className="ti ti-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 text-sm" />
              <input type="text" placeholder="Search subscriptions..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#1A0F35] border border-[#3B1F6B] text-white rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] placeholder-gray-700 text-sm transition" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition ${category === c ? "bg-[#A855F7] text-white" : "bg-[#1A0F35] border border-[#3B1F6B] text-gray-400 hover:text-white hover:border-[#A855F7] hover:border-opacity-50"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="bg-[#1A0F35] border border-[#3B1F6B] text-gray-400 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#A855F7] transition">
                <option value="name">Sort: Name</option>
                <option value="cost">Sort: Cost</option>
                <option value="score">Sort: Score</option>
              </select>
              <div className="flex bg-[#1A0F35] border border-[#3B1F6B] rounded-xl overflow-hidden">
                {["table", "grid"].map(v => (
                  <button key={v} onClick={() => setViewMode(v)} className={`px-3 py-2 transition ${viewMode === v ? "bg-[#A855F7] text-white" : "text-gray-500 hover:text-white"}`}>
                    <i className={`ti ti-${v === "table" ? "list" : "layout-grid"} text-sm`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="flex gap-4 text-xs text-gray-500">
            <span><span className="text-white font-semibold">{filtered.length}</span> shown</span>
            <span>·</span>
            <span>Total: <span className="text-[#A855F7] font-semibold">₹{totalCost.toLocaleString()}/mo</span></span>
            {selected.length > 0 && <><span>·</span><span className="text-yellow-400">{selected.length} selected</span></>}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl text-center py-16">
              <i className="ti ti-search-off text-4xl text-gray-700 block mb-3" />
              <p className="text-gray-600 text-sm">No subscriptions found</p>
              <button onClick={() => navigate("/add")} className="mt-3 text-[#A855F7] text-xs hover:underline">Add your first subscription →</button>
            </div>
          ) : viewMode === "table" ? (
            <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#3B1F6B]">
                      <th className="px-4 py-3 text-left">
                        <input type="checkbox" className="accent-[#A855F7]"
                          onChange={e => setSelected(e.target.checked ? filtered.map(s => s._id || s.id) : [])}
                          checked={selected.length === filtered.length && filtered.length > 0} />
                      </th>
                      {["Name", "Category", "Cost/mo", "Renews", "Health", "Status", ""].map((h, i) => (
                        <th key={i} className={`px-4 py-3 text-left text-xs text-gray-600 font-semibold tracking-widest uppercase ${i > 1 && i < 5 ? "hidden md:table-cell" : ""} ${i === 1 ? "hidden sm:table-cell" : ""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2D1B4E]">
                    {filtered.map(sub => {
                      const id = sub._id || sub.id;
                      return (
                        <tr key={id} className="hover:bg-[#2D1B4E] transition group">
                          <td className="px-4 py-4"><input type="checkbox" className="accent-[#A855F7]" checked={selected.includes(id)} onChange={() => toggleSelect(id)} /></td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-[#0F0A1E] border border-[#3B1F6B] flex items-center justify-center text-base flex-shrink-0">{sub.icon || "📦"}</div>
                              <div>
                                <p className="text-white text-sm font-semibold">{sub.name}</p>
                                {sub.seats && <p className="text-gray-600 text-xs">{sub.seats} seats</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 hidden sm:table-cell">
                            <span className="text-xs text-gray-400 bg-[#0F0A1E] border border-[#3B1F6B] px-2.5 py-1 rounded-lg">{sub.category}</span>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            <p className="text-white text-sm font-semibold">₹{sub.cost}</p>
                            <p className="text-gray-600 text-xs">{sub.billing || "Monthly"}</p>
                          </td>
                          <td className="px-4 py-4 hidden lg:table-cell">
                            <p className="text-gray-400 text-xs">{sub.nextRenewal ? new Date(sub.nextRenewal).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</p>
                          </td>
                          <td className="px-4 py-4 hidden md:table-cell">
                            {sub.score != null ? <ScoreBar score={sub.score} /> : <span className="text-gray-700 text-xs">N/A</span>}
                            {sub.usage && <p className="text-gray-700 text-xs mt-1">Usage: {sub.usage}</p>}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sub.status === "active" ? "bg-green-900 bg-opacity-40 text-green-400 border border-green-800" : "bg-yellow-900 bg-opacity-40 text-yellow-400 border border-yellow-800"}`}>
                              {sub.status === "active" ? "Active" : "Review"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                              <button onClick={() => navigate(`/add?edit=${id}`)} className="p-1.5 rounded-lg hover:bg-[#0F0A1E] text-gray-500 hover:text-[#A855F7] transition">
                                <i className="ti ti-edit text-sm" />
                              </button>
                              <button onClick={() => handleDelete(id)} disabled={deleting === id} className="p-1.5 rounded-lg hover:bg-[#0F0A1E] text-gray-500 hover:text-red-400 transition">
                                {deleting === id ? <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> : <i className="ti ti-trash text-sm" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(sub => {
                const id = sub._id || sub.id;
                const scoreColor = sub.score >= 75 ? "#22c55e" : sub.score >= 50 ? "#f59e0b" : "#ef4444";
                return (
                  <div key={id} className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl p-5 hover:border-[#A855F7] hover:border-opacity-40 transition group relative">
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => navigate(`/add?edit=${id}`)} className="p-1.5 rounded-lg bg-[#0F0A1E] text-gray-500 hover:text-[#A855F7]"><i className="ti ti-edit text-xs" /></button>
                      <button onClick={() => handleDelete(id)} className="p-1.5 rounded-lg bg-[#0F0A1E] text-gray-500 hover:text-red-400"><i className="ti ti-trash text-xs" /></button>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-[#0F0A1E] border border-[#3B1F6B] flex items-center justify-center text-2xl mb-4">{sub.icon || "📦"}</div>
                    <h4 className="text-white font-semibold text-sm">{sub.name}</h4>
                    <p className="text-gray-600 text-xs mt-0.5 mb-3">{sub.category}{sub.seats ? ` · ${sub.seats} seats` : ""}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[#A855F7] font-bold text-lg">₹{sub.cost}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${sub.status === "active" ? "bg-green-900 bg-opacity-40 text-green-400 border border-green-800" : "bg-yellow-900 bg-opacity-40 text-yellow-400 border border-yellow-800"}`}>
                        {sub.status === "active" ? "Active" : "Review"}
                      </span>
                    </div>
                    {sub.score != null && (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">Health</span>
                          <span className="font-semibold" style={{ color: scoreColor }}>{sub.score}</span>
                        </div>
                        <div className="h-1.5 bg-[#0F0A1E] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${sub.score}%`, backgroundColor: scoreColor }} />
                        </div>
                      </div>
                    )}
                    {sub.nextRenewal && <p className="text-gray-700 text-xs mt-2">Renews {new Date(sub.nextRenewal).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
