const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ─── Token helpers ───────────────────────────────────────────────────────────
export const getToken = () => localStorage.getItem("subsense_token");
export const setToken = (t) => localStorage.setItem("subsense_token", t);
export const removeToken = () => localStorage.removeItem("subsense_token");
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem("subsense_user")); } catch { return null; }
};
export const setUser = (u) => localStorage.setItem("subsense_user", JSON.stringify(u));
export const removeUser = () => localStorage.removeItem("subsense_user");

// ─── Core fetch wrapper ──────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authAPI = {
  login:    (email, password)       => request("/auth/login",    { method: "POST", body: JSON.stringify({ email, password }) }),
  register: (name, email, password, company) => request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password, company }) }),
  me:       ()                      => request("/auth/me"),
};

// ─── Subscriptions ───────────────────────────────────────────────────────────
export const subsAPI = {
  getAll:  ()       => request("/subscriptions"),
  getOne:  (id)     => request(`/subscriptions/${id}`),
  create:  (data)   => request("/subscriptions",      { method: "POST",   body: JSON.stringify(data) }),
  update:  (id, data) => request(`/subscriptions/${id}`, { method: "PUT",    body: JSON.stringify(data) }),
  delete:  (id)     => request(`/subscriptions/${id}`, { method: "DELETE" }),
  stats:   ()       => request("/subscriptions/stats"),
};

// ─── Admin ───────────────────────────────────────────────────────────────────
export const adminAPI = {
  getUsers:    ()         => request("/admin/users"),
  inviteUser:  (data)     => request("/admin/users/invite", { method: "POST", body: JSON.stringify(data) }),
  updateUser:  (id, data) => request(`/admin/users/${id}`,  { method: "PUT",  body: JSON.stringify(data) }),
  deleteUser:  (id)       => request(`/admin/users/${id}`,  { method: "DELETE" }),
  getAuditLogs: ()        => request("/admin/logs"),
  getSettings: ()         => request("/admin/settings"),
  updateSettings: (data)  => request("/admin/settings",     { method: "PUT",  body: JSON.stringify(data) }),
  getStats:    ()         => request("/admin/stats"),
  exportCSV:   ()         => request("/admin/export"),
};
