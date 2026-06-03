import React, { useEffect, useState, useCallback } from "react";
import PageLayout from "../components/PageLayout";
import Spinner from "../components/Spinner";
import ErrorMsg from "../components/ErrorMsg";
import { adminAPI } from "../services/api";

const roleColors = {
  Admin: "text-[#A855F7] bg-[#A855F7] bg-opacity-10 border-[#A855F7] border-opacity-30",
  Manager: "text-blue-400 bg-blue-900 bg-opacity-20 border-blue-800",
  Viewer: "text-gray-400 bg-[#0F0A1E] border-[#3B1F6B]",
};
const logDot = { add: "bg-green-500", delete: "bg-red-500", edit: "bg-yellow-500", user: "bg-[#A855F7]", export: "bg-blue-400" };

const tabs = ["Overview", "Users", "Audit Log", "Settings"];

function Toggle({ on, onToggle }) {
  return (
    <div onClick={onToggle} className={`w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 relative ${on ? "bg-[#A855F7]" : "bg-[#2D1B4E]"}`}>
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${on ? "left-6" : "left-1"}`} />
    </div>
  );
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState("Overview");

  // Overview
  const [adminStats, setAdminStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  // Users
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");
  const [inviting, setInviting] = useState(false);

  // Audit
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState("");

  // Settings
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [settingsSaved, setSettingsSaved] = useState(false);

  // ─── Fetch overview stats on mount ───────────────────────────────────────
  const fetchStats = useCallback(async () => {
    setStatsLoading(true); setStatsError("");
    try { setAdminStats(await adminAPI.getStats()); }
    catch (err) { setStatsError(err.message); }
    finally { setStatsLoading(false); }
  }, []);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  // ─── Lazy load tabs ───────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab === "Users" && users.length === 0) {
      setUsersLoading(true); setUsersError("");
      adminAPI.getUsers()
        .then(d => setUsers(d.users || d))
        .catch(e => setUsersError(e.message))
        .finally(() => setUsersLoading(false));
    }
    if (activeTab === "Audit Log" && logs.length === 0) {
      setLogsLoading(true); setLogsError("");
      adminAPI.getAuditLogs()
        .then(d => setLogs(d.logs || d))
        .catch(e => setLogsError(e.message))
        .finally(() => setLogsLoading(false));
    }
    if (activeTab === "Settings" && !settings) {
      setSettingsLoading(true); setSettingsError("");
      adminAPI.getSettings()
        .then(d => setSettings(d.settings || d))
        .catch(e => setSettingsError(e.message))
        .finally(() => setSettingsLoading(false));
    }
  }, [activeTab]); // eslint-disable-line

  // ─── Invite user ─────────────────────────────────────────────────────────
  const handleInvite = async () => {
    if (!inviteEmail) return;
    setInviting(true);
    try {
      const data = await adminAPI.inviteUser({ email: inviteEmail, role: inviteRole });
      setUsers(u => [...u, data.user || { email: inviteEmail, role: inviteRole, status: "invited" }]);
      setShowInvite(false); setInviteEmail("");
    } catch (err) { alert(err.message); }
    finally { setInviting(false); }
  };

  // ─── Delete user ─────────────────────────────────────────────────────────
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Remove this user?")) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(u => u.filter(x => (x._id || x.id) !== id));
    } catch (err) { alert(err.message); }
  };

  // ─── Save settings ────────────────────────────────────────────────────────
  const handleSaveSettings = async () => {
    setSettingsSaving(true); setSettingsSaved(false);
    try {
      await adminAPI.updateSettings(settings);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    } catch (err) { alert(err.message); }
    finally { setSettingsSaving(false); }
  };

  const setSetting = (k, v) => setSettings(s => ({ ...s, [k]: v }));

  // ─── Stat cards ──────────────────────────────────────────────────────────
  const statCards = adminStats ? [
    { label: "Total Users", value: adminStats.totalUsers ?? "—", icon: "ti-users", color: "#A855F7" },
    { label: "Active Users", value: adminStats.activeUsers ?? "—", icon: "ti-user-check", color: "#22c55e" },
    { label: "Total Subscriptions", value: adminStats.totalSubscriptions ?? "—", icon: "ti-stack-2", color: "#f59e0b" },
    { label: "Monthly Budget Used", value: adminStats.monthlyBudgetUsed ? `₹${adminStats.monthlyBudgetUsed.toLocaleString()}` : "—", icon: "ti-chart-bar", color: "#ef4444" },
  ] : [];

  return (
    <PageLayout title="Admin Panel" subtitle="Manage users, settings & audit logs">
      <div className="space-y-5">

        {/* Tabs */}
        <div className="flex gap-1 bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl p-1.5 w-fit">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition ${activeTab === tab ? "bg-[#A855F7] text-white shadow-lg shadow-purple-900/30" : "text-gray-500 hover:text-white"}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "Overview" && (
          statsLoading ? <Spinner text="Loading stats..." /> :
          statsError ? <ErrorMsg message={statsError} onRetry={fetchStats} /> : (
            <div className="space-y-5">
              {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((s, i) => (
                  <div key={i} className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl p-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: s.color + "18" }}>
                      <i className={`ti ${s.icon} text-lg`} style={{ color: s.color }} />
                    </div>
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-gray-600 text-xs mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-5">
                {/* Budget utilization */}
                {adminStats?.budgetBreakdown?.length > 0 && (
                  <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl p-6">
                    <h4 className="text-white font-semibold text-sm mb-4">Budget by Category</h4>
                    {adminStats.budgetBreakdown.map((b, i) => (
                      <div key={i} className="mb-3">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-400">{b.name}</span>
                          <span className="text-gray-400">₹{b.spent?.toLocaleString()}{b.budget ? ` / ₹${b.budget.toLocaleString()}` : ""}</span>
                        </div>
                        <div className="h-1.5 bg-[#0F0A1E] rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED]"
                            style={{ width: b.budget ? `${Math.min((b.spent / b.budget) * 100, 100)}%` : "0%" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recent activity */}
                {adminStats?.recentActivity?.length > 0 && (
                  <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-semibold text-sm">Recent Activity</h4>
                      <button onClick={() => setActiveTab("Audit Log")} className="text-[#A855F7] text-xs hover:underline">View all</button>
                    </div>
                    <div className="space-y-3">
                      {adminStats.recentActivity.slice(0, 6).map((log, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${logDot[log.type] || "bg-[#A855F7]"}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-300 text-xs leading-snug">{log.action || log.text}</p>
                            <p className="text-gray-700 text-xs mt-0.5">{log.user} · {log.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* ── USERS ── */}
        {activeTab === "Users" && (
          usersLoading ? <Spinner text="Loading users..." /> :
          usersError ? <ErrorMsg message={usersError} onRetry={() => { setUsersLoading(true); adminAPI.getUsers().then(d => setUsers(d.users || d)).catch(e => setUsersError(e.message)).finally(() => setUsersLoading(false)); }} /> : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">{users.length} team member{users.length !== 1 ? "s" : ""}</p>
                <button onClick={() => setShowInvite(!showInvite)}
                  className="flex items-center gap-2 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white text-sm font-semibold px-4 py-2 rounded-xl transition active:scale-95 shadow-lg shadow-purple-900/30">
                  <i className="ti ti-user-plus text-sm" /> Invite User
                </button>
              </div>

              {showInvite && (
                <div className="bg-[#1A0F35] border border-[#A855F7] border-opacity-40 rounded-2xl p-5 space-y-4">
                  <h4 className="text-white font-semibold text-sm flex items-center gap-2"><i className="ti ti-mail text-[#A855F7]" /> Invite Team Member</h4>
                  <div className="flex gap-3">
                    <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@company.com"
                      className="flex-1 bg-[#0F0A1E] border border-[#3B1F6B] text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#A855F7] transition placeholder-gray-700 text-sm" />
                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value)}
                      className="bg-[#0F0A1E] border border-[#3B1F6B] text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#A855F7] transition">
                      <option>Admin</option><option>Manager</option><option>Viewer</option>
                    </select>
                    <button onClick={handleInvite} disabled={!inviteEmail || inviting}
                      className="bg-[#A855F7] hover:bg-[#9333EA] disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition">
                      {inviting ? "Sending..." : "Send"}
                    </button>
                  </div>
                </div>
              )}

              {users.length === 0 ? (
                <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl text-center py-14">
                  <i className="ti ti-users text-4xl text-gray-700 block mb-3" />
                  <p className="text-gray-600 text-sm">No users yet</p>
                </div>
              ) : (
                <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl overflow-hidden">
                  <div className="divide-y divide-[#2D1B4E]">
                    {users.map(user => {
                      const id = user._id || user.id;
                      const initials = user.name ? user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : user.email?.slice(0, 2).toUpperCase();
                      return (
                        <div key={id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#2D1B4E] transition group">
                          <div className="w-10 h-10 rounded-full bg-[#A855F7] bg-opacity-15 border border-[#A855F7] border-opacity-20 flex items-center justify-center text-xs font-bold text-[#A855F7] flex-shrink-0">
                            {initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold">{user.name || "—"}</p>
                            <p className="text-gray-600 text-xs">{user.email}</p>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium hidden sm:inline ${roleColors[user.role] || roleColors.Viewer}`}>{user.role}</span>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${user.status === "active" ? "bg-green-900 bg-opacity-40 text-green-400 border border-green-800" : "bg-gray-900 text-gray-600 border border-gray-800"}`}>
                            {user.status}
                          </span>
                          {user.createdAt && <p className="text-gray-700 text-xs hidden md:block">{new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                            {user.role !== "Admin" && (
                              <button onClick={() => handleDeleteUser(id)} className="p-1.5 rounded-lg hover:bg-[#0F0A1E] text-gray-500 hover:text-red-400 transition">
                                <i className="ti ti-user-x text-sm" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        )}

        {/* ── AUDIT LOG ── */}
        {activeTab === "Audit Log" && (
          logsLoading ? <Spinner text="Loading audit log..." /> :
          logsError ? <ErrorMsg message={logsError} /> : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">{logs.length} event{logs.length !== 1 ? "s" : ""} recorded</p>
                <button onClick={() => adminAPI.exportCSV()} className="flex items-center gap-2 bg-[#1A0F35] border border-[#3B1F6B] hover:border-[#A855F7] hover:border-opacity-50 text-gray-400 hover:text-white text-sm px-4 py-2 rounded-xl transition">
                  <i className="ti ti-download text-sm" /> Export CSV
                </button>
              </div>

              {logs.length === 0 ? (
                <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl text-center py-14">
                  <i className="ti ti-list text-4xl text-gray-700 block mb-3" />
                  <p className="text-gray-600 text-sm">No activity logged yet</p>
                </div>
              ) : (
                <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl overflow-hidden">
                  <div className="divide-y divide-[#2D1B4E]">
                    {logs.map((log, i) => (
                      <div key={log._id || i} className="flex items-center gap-4 px-6 py-4 hover:bg-[#2D1B4E] transition">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${logDot[log.type] || "bg-[#A855F7]"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-200 text-sm">{log.action || log.text}</p>
                          <p className="text-gray-600 text-xs mt-0.5">by {log.user}</p>
                        </div>
                        <p className="text-gray-700 text-xs flex-shrink-0">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : log.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        )}

        {/* ── SETTINGS ── */}
        {activeTab === "Settings" && (
          settingsLoading ? <Spinner text="Loading settings..." /> :
          settingsError ? <ErrorMsg message={settingsError} /> :
          !settings ? null : (
            <div className="space-y-5 max-w-2xl">

              {/* Notifications */}
              <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl p-6">
                <h4 className="text-white font-semibold text-sm mb-5 flex items-center gap-2"><i className="ti ti-bell text-[#A855F7]" /> Notifications</h4>
                <div className="space-y-4">
                  {[
                    { key: "emailAlerts", label: "Email renewal alerts", desc: "Get notified 7 days before renewal" },
                    { key: "slackAlerts", label: "Slack alerts", desc: "Push notifications to Slack channel" },
                    { key: "weeklyReport", label: "Weekly spend report", desc: "Summary email every Monday" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-300 text-sm">{label}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{desc}</p>
                      </div>
                      <Toggle on={!!settings[key]} onToggle={() => setSetting(key, !settings[key])} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Security */}
              <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl p-6">
                <h4 className="text-white font-semibold text-sm mb-5 flex items-center gap-2"><i className="ti ti-shield text-[#A855F7]" /> Security</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Two-Factor Authentication</p>
                      <p className="text-gray-600 text-xs mt-0.5">Add an extra layer of security</p>
                    </div>
                    <Toggle on={!!settings.twoFactor} onToggle={() => setSetting("twoFactor", !settings.twoFactor)} />
                  </div>
                  <div className="pt-3 border-t border-[#2D1B4E]">
                    <p className="text-gray-300 text-sm mb-2">Data Retention</p>
                    <div className="flex gap-2">
                      {["30", "60", "90", "180"].map(d => (
                        <button key={d} onClick={() => setSetting("dataRetention", d)}
                          className={`px-4 py-2 rounded-xl text-xs font-medium border transition ${String(settings.dataRetention) === d ? "bg-[#A855F7] bg-opacity-15 border-[#A855F7] border-opacity-50 text-[#A855F7]" : "bg-[#0F0A1E] border-[#3B1F6B] text-gray-400 hover:text-white"}`}>
                          {d} days
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-[#1A0F35] border border-[#3B1F6B] rounded-2xl p-6">
                <h4 className="text-white font-semibold text-sm mb-5 flex items-center gap-2"><i className="ti ti-settings text-[#A855F7]" /> Preferences</h4>
                <div>
                  <p className="text-gray-300 text-sm mb-2">Default Currency</p>
                  <div className="flex gap-2">
                    {["INR", "USD", "EUR", "GBP"].map(c => (
                      <button key={c} onClick={() => setSetting("currency", c)}
                        className={`px-4 py-2 rounded-xl text-xs font-medium border transition ${settings.currency === c ? "bg-[#A855F7] bg-opacity-15 border-[#A855F7] border-opacity-50 text-[#A855F7]" : "bg-[#0F0A1E] border-[#3B1F6B] text-gray-400 hover:text-white"}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save button */}
              <button onClick={handleSaveSettings} disabled={settingsSaving}
                className="w-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED] hover:from-[#9333EA] hover:to-[#6D28D9] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition text-sm shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2">
                {settingsSaving ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving...</> : settingsSaved ? <><i className="ti ti-check" /> Saved!</> : "Save Settings"}
              </button>

              {/* Danger zone */}
              <div className="bg-[#1A0F35] border border-red-900 border-opacity-50 rounded-2xl p-6">
                <h4 className="text-red-400 font-semibold text-sm mb-4 flex items-center gap-2"><i className="ti ti-alert-triangle" /> Danger Zone</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Export all data</p>
                      <p className="text-gray-600 text-xs">Download a CSV of all subscriptions</p>
                    </div>
                    <button onClick={() => adminAPI.exportCSV()} className="text-xs px-3 py-2 border border-[#3B1F6B] hover:border-[#A855F7] text-gray-400 hover:text-white rounded-xl transition">Export</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-300 text-sm">Delete account</p>
                      <p className="text-gray-600 text-xs">Permanently remove all data</p>
                    </div>
                    <button className="text-xs px-3 py-2 border border-red-900 text-red-500 hover:bg-red-900 hover:bg-opacity-20 rounded-xl transition">Delete</button>
                  </div>
                </div>
              </div>

            </div>
          )
        )}

      </div>
    </PageLayout>
  );
}
