import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import Spinner from "../components/Spinner";
import ErrorMsg from "../components/ErrorMsg";
import { subsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

function ScoreBadge({ score }) {
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 rounded-full bg-[#2D1B4E] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold" style={{ color }}>{score}</span>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subs, setSubs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [subsData, statsData] = await Promise.all([subsAPI.getAll(), subsAPI.stats()]);
      setSubs(subsData.subscriptions || subsData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const statCards = stats ? [
    { label: "Monthly Spend", value: `₹${(stats.totalMonthly || 0).toLocaleString()}`, sub: stats.spendChange || "", icon: "ti-currency-rupee", color: "#A855F7" },
    { label: "Active Subscriptions", value: stats.totalCount || 0, sub: `${stats.categoryCount || 0} categories`, icon: "ti-stack-2", color: "#22c55e" },
    { label: "Avg Health Score", value: `${stats.avgScore || 0}/100`, sub: `${stats.atRisk || 0} need attention`, icon: "ti-heart-rate-monitor", color: "#f59e0b" },
    { label: "Renewing Soon", value: stats.renewingSoon || 0, sub: "Within 10 days", icon: "ti-bell-ringing", color: "#ef4444" },
  ] : [];

  const dotColor = { danger: "bg-red-500", warn: "bg-yellow-500", success: "bg-green-500", info: "bg-[#A855F7]" };
  const activity = stats?.recentActivity || [];
  const spendByCategory = stats?.spendByCategory || [];

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <PageLayout title="Dashboard" subtitle={new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} action={{ label: "Add Subscription", icon: "ti-plus", path: "/add" }}>
      {loading ? <Spinner text="Loading your dashboard..." /> : error ? <ErrorMsg message={error} onRetry={fetchData} /> : (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Good morning, {firstName} 👋</h3>
            <p className="text-gray-500 text-sm mt-1">
              {stats?.atRisk > 0
                ? <>You have <span className="text-[#A855F7] font-semibold">{stats.atRisk} subscription{stats.atRisk > 1 ? "s" : ""}</span> that need your attention.</>
                : "All your subscriptions are looking healthy!"}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((s, i) => (
              <div key={i} className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl p-5 hover:border-[#A855F7] hover:border-opacity-40 transition">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: s.color + "18" }}>
                  <i className={`ti ${s.icon} text-lg`} style={{ color: s.color }} />
                </div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-gray-600 text-xs mt-1">{s.label}</p>
                <p className="text-gray-700 text-xs mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Subscriptions table */}
            <div className="lg:col-span-2 bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#3B1F6B]">
                <h4 className="text-white font-semibold text-sm">Subscriptions Overview</h4>
                <button onClick={() => navigate("/subscriptions")} className="text-[#A855F7] text-xs hover:underline flex items-center gap-1">
                  View all <i className="ti ti-arrow-right text-xs" />
                </button>
              </div>
              {subs.length === 0 ? (
                <div className="text-center py-12">
                  <i className="ti ti-stack-2 text-4xl text-gray-700 block mb-3" />
                  <p className="text-gray-600 text-sm">No subscriptions yet</p>
                  <button onClick={() => navigate("/add")} className="mt-3 text-[#A855F7] text-xs hover:underline">Add your first one →</button>
                </div>
              ) : (
                <div className="divide-y divide-[#2D1B4E]">
                  {subs.slice(0, 6).map((sub) => (
                    <div key={sub._id || sub.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#2D1B4E] transition">
                      <div className="w-10 h-10 rounded-xl bg-[#0F0A1E] border border-[#3B1F6B] flex items-center justify-center text-lg flex-shrink-0">
                        {sub.icon || "📦"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold">{sub.name}</p>
                        <p className="text-gray-600 text-xs">{sub.category}</p>
                      </div>
                      <div className="hidden sm:block text-right mr-4">
                        <p className="text-white text-sm font-semibold">₹{sub.cost}</p>
                        <p className="text-gray-600 text-xs">/{sub.billing?.toLowerCase() || "mo"}</p>
                      </div>
                      {sub.score != null && (
                        <div className="hidden md:block w-24"><ScoreBadge score={sub.score} /></div>
                      )}
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        sub.status === "active"
                          ? "bg-green-900 bg-opacity-40 text-green-400 border border-green-800"
                          : "bg-yellow-900 bg-opacity-40 text-yellow-400 border border-yellow-800"
                      }`}>
                        {sub.status === "active" ? "Active" : "Review"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Spend by category */}
              {spendByCategory.length > 0 && (
                <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl p-5">
                  <h4 className="text-white font-semibold text-sm mb-4">Spend by Category</h4>
                  {spendByCategory.map((c, i) => (
                    <div key={i} className="mb-3">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-400">{c.name}</span>
                        <span className="text-gray-400">₹{c.amount}</span>
                      </div>
                      <div className="h-1.5 bg-[#0F0A1E] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED]" style={{ width: `${c.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Activity */}
              {activity.length > 0 && (
                <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl p-5">
                  <h4 className="text-white font-semibold text-sm mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    {activity.map((a, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotColor[a.type] || "bg-[#A855F7]"}`} />
                        <div>
                          <p className="text-gray-300 text-xs leading-snug">{a.text}</p>
                          <p className="text-gray-700 text-xs mt-0.5">{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick actions */}
              <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl p-5">
                <h4 className="text-white font-semibold text-sm mb-4">Quick Actions</h4>
                <div className="space-y-2">
                  {[
                    { icon: "ti-circle-plus", label: "Add Subscription", path: "/add" },
                    { icon: "ti-stack-2", label: "View All Subscriptions", path: "/subscriptions" },
                    { icon: "ti-shield-half", label: "Admin Panel", path: "/admin" },
                  ].map((a, i) => (
                    <button key={i} onClick={() => navigate(a.path)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0F0A1E] border border-[#3B1F6B] hover:border-[#A855F7] hover:border-opacity-50 text-gray-400 hover:text-white text-sm transition">
                      <i className={`ti ${a.icon} text-[#A855F7]`} />{a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
