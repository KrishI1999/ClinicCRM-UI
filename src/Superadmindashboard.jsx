import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://cliniccrm-kvlv.onrender.com/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => (n ?? 0).toLocaleString("en-IN");
const getToken = () => localStorage.getItem("token");
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

const planConfig = {
  Enterprise: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
  Pro:        { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   dot: "bg-blue-500"   },
  Basic:      { bg: "bg-slate-50",  text: "text-slate-600",  border: "border-slate-200",  dot: "bg-slate-400"  },
};

const planCfg = (plan) => planConfig[plan] ?? planConfig.Basic;

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ cfg, label }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
    {label}
  </span>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon, accent, sub }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
    <div className="flex items-center justify-between mb-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      <div className={`w-9 h-9 ${accent} rounded-xl flex items-center justify-center text-lg`}>{icon}</div>
    </div>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
    {sub && <p className="mt-1.5 text-xs text-gray-400">{sub}</p>}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab]         = useState("overview");
  const [clinics, setClinics]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  // Clinic detail modal
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // Add clinic modal
  const [showAddClinic, setShowAddClinic] = useState(false);
  const [addLoading, setAddLoading]       = useState(false);
  const [addError, setAddError]           = useState(null);
  const [addForm, setAddForm] = useState({
    clinicName: "", address: "", phone: "",
    subscriptionPlan: "Basic",
    adminName: "", email: "", password: "",
  });

  // Clinics tab filters
  const [clinicSearch, setClinicSearch]   = useState("");
  const [planFilter, setPlanFilter]       = useState("All");

  // Nav user info from token
  const userName  = localStorage.getItem("name")  ?? "Super Admin";
  const userEmail = localStorage.getItem("email") ?? "";

  // ── Fetch all clinics ──────────────────────────────────────────────────────
  const fetchClinics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/clinics`, { headers: authHeaders() });
      const data = res.data?.$values ?? res.data ?? [];
      setClinics(data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to load clinics. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClinics(); }, []);

  // ── Delete clinic ──────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this clinic? This cannot be undone.")) return;
    try {
      setDeleteLoadingId(id);
      await axios.delete(`${BASE_URL}/clinics/${id}`, { headers: authHeaders() });
      setClinics((prev) => prev.filter((c) => c.id !== id));
      if (selectedClinic?.id === id) setSelectedClinic(null);
    } catch {
      alert("Failed to delete clinic.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // ── Add clinic ─────────────────────────────────────────────────────────────
  const handleAddClinic = async () => {
    setAddError(null);
    const { clinicName, address, phone, subscriptionPlan, adminName, email, password } = addForm;
    if (!clinicName || !address || !phone || !adminName || !email || !password) {
      setAddError("All fields are required.");
      return;
    }
    try {
      setAddLoading(true);
      await axios.post(`${BASE_URL}/clinics`, addForm, { headers: authHeaders() });
      setShowAddClinic(false);
      setAddForm({ clinicName: "", address: "", phone: "", subscriptionPlan: "Basic", adminName: "", email: "", password: "" });
      await fetchClinics();
    } catch (err) {
      setAddError(err.response?.data?.message ?? "Failed to create clinic.");
    } finally {
      setAddLoading(false);
    }
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ── Computed stats ─────────────────────────────────────────────────────────
  const totalPatients = clinics.reduce((s, c) => s + (c.totalPatients ?? 0), 0);
  const totalUsers    = clinics.reduce((s, c) => s + (c.totalUsers    ?? 0), 0);

  // ── Filtered clinics ───────────────────────────────────────────────────────
  const filtered = clinics.filter((c) => {
    const q = clinicSearch.toLowerCase();
    const matchSearch = (c.clinicName ?? "").toLowerCase().includes(q) ||
                        (c.address    ?? "").toLowerCase().includes(q) ||
                        (c.adminName  ?? "").toLowerCase().includes(q);
    const matchPlan = planFilter === "All" || c.subscriptionPlan === planFilter;
    return matchSearch && matchPlan;
  });

  const tabs = [
    { id: "overview", label: "Overview"  },
    { id: "clinics",  label: "Clinics"   },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ══ Clinic Detail Modal ══════════════════════════════════════════════ */}
      {selectedClinic && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

            {/* Header */}
            <div className="bg-blue-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl">🏥</div>
                <div>
                  <h3 className="text-white font-semibold">{selectedClinic.clinicName}</h3>
                  <p className="text-blue-100 text-xs">{selectedClinic.address}</p>
                </div>
              </div>
              <button onClick={() => setSelectedClinic(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition text-sm">✕</button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Patients", value: fmt(selectedClinic.totalPatients) },
                  { label: "Staff Users",    value: fmt(selectedClinic.totalUsers)    },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3.5">
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <span className="text-sm text-gray-500">Subscription Plan</span>
                <Badge cfg={planCfg(selectedClinic.subscriptionPlan)} label={selectedClinic.subscriptionPlan} />
              </div>

              <div className="space-y-2 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Admin Name</span>
                  <span className="font-medium text-gray-800">{selectedClinic.adminName || "—"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Admin Email</span>
                  <span className="font-medium text-gray-800">{selectedClinic.adminEmail || "—"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-800">{selectedClinic.phone || "—"}</span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(selectedClinic.id)}
                disabled={deleteLoadingId === selectedClinic.id}
                className="w-full py-2 text-sm font-medium border border-red-200 text-red-600 rounded-xl hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                {deleteLoadingId === selectedClinic.id ? "Deleting..." : "🗑 Delete Clinic"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Add Clinic Modal ═════════════════════════════════════════════════ */}
      {showAddClinic && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => { setShowAddClinic(false); setAddError(null); }}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition text-sm">✕</button>

            <h3 className="text-base font-semibold text-gray-900 mb-1">Add New Clinic</h3>
            <p className="text-xs text-gray-400 mb-5">Creates the clinic and its admin account in one step.</p>

            {addError && (
              <div className="mb-4 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">{addError}</div>
            )}

            <div className="space-y-3">
              {/* Clinic fields */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Clinic Info</p>
              {[
                { key: "clinicName",       label: "Clinic Name",  placeholder: "e.g. Apollo Clinic Pune" },
                { key: "address",          label: "Address",      placeholder: "123, MG Road, Pune" },
                { key: "phone",            label: "Phone",        placeholder: "9876543210" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
                  <input
                    value={addForm[key]}
                    onChange={(e) => setAddForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder={placeholder}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Subscription Plan</label>
                <select
                  value={addForm.subscriptionPlan}
                  onChange={(e) => setAddForm((p) => ({ ...p, subscriptionPlan: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white">
                  <option>Basic</option>
                  <option>Pro</option>
                  <option>Enterprise</option>
                </select>
              </div>

              {/* Admin fields */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide pt-2">Admin Account</p>
              {[
                { key: "adminName", label: "Admin Name",  placeholder: "Dr. Rahul Sharma",       type: "text"     },
                { key: "email",     label: "Admin Email", placeholder: "admin@clinic.com",        type: "email"    },
                { key: "password",  label: "Password",    placeholder: "Min. 8 characters",       type: "password" },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={addForm[key]}
                    onChange={(e) => setAddForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder={placeholder}
                  />
                </div>
              ))}

              <button
                onClick={handleAddClinic}
                disabled={addLoading}
                className="w-full mt-2 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                {addLoading ? "Creating..." : "Create Clinic"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Top Nav ══════════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">Clinic CRM</h1>
            <p className="text-xs text-gray-400">Super Admin Console</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden md:block">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-50 border border-violet-200">
            <div className="w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-violet-700">{userName}</span>
            <span className="text-xs text-violet-400 border-l border-violet-200 pl-2">Super Admin</span>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 border border-gray-200 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h2>
            <p className="text-sm text-gray-400 mt-0.5">Complete visibility across all clinics on the platform.</p>
          </div>
          <button onClick={() => setShowAddClinic(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Clinic
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === t.id
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Loading / Error ── */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3">
            <span className="text-red-500 text-xl">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-700">{error}</p>
              <button onClick={fetchClinics} className="text-xs text-red-500 hover:text-red-700 mt-1 transition">Try again →</button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ════════════ OVERVIEW TAB ════════════ */}
            {activeTab === "overview" && (
              <>
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <StatCard label="Total Clinics"   value={clinics.length}    icon="🏥" accent="bg-blue-50"
                    sub={`${clinics.length} registered on platform`} />
                  <StatCard label="Total Patients"  value={fmt(totalPatients)} icon="👥" accent="bg-emerald-50"
                    sub="Across all clinics" />
                  <StatCard label="Total Staff"     value={fmt(totalUsers)}    icon="👤" accent="bg-violet-50"
                    sub="All clinic users" />
                </div>

                {/* Plan Breakdown + Top Clinics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                  {/* Plan Breakdown */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Clinics by Plan</h3>
                    <div className="space-y-4">
                      {["Enterprise", "Pro", "Basic"].map((plan) => {
                        const count = clinics.filter((c) => c.subscriptionPlan === plan).length;
                        const pct   = clinics.length > 0 ? Math.round((count / clinics.length) * 100) : 0;
                        const cfg   = planCfg(plan);
                        return (
                          <div key={plan}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm text-gray-600">{plan}</span>
                              <span className="text-sm font-semibold text-gray-800">{count} clinic{count !== 1 ? "s" : ""}</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-2 rounded-full ${cfg.dot} transition-all`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top Clinics by Patients */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Clinics by Patients</h3>
                    {clinics.length === 0
                      ? <p className="text-sm text-gray-400 py-4 text-center">No clinics yet.</p>
                      : (
                        <div className="space-y-3">
                          {[...clinics]
                            .sort((a, b) => (b.totalPatients ?? 0) - (a.totalPatients ?? 0))
                            .slice(0, 5)
                            .map((c, i) => {
                              const max = Math.max(...clinics.map((x) => x.totalPatients ?? 0)) || 1;
                              const pct = Math.round(((c.totalPatients ?? 0) / max) * 100);
                              return (
                                <div key={c.id} className="flex items-center gap-3">
                                  <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-sm font-medium text-gray-700">{c.clinicName}</span>
                                      <span className="text-sm font-semibold text-gray-900">{fmt(c.totalPatients)} patients</span>
                                    </div>
                                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-1.5 bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                  </div>
                </div>

                {/* All Clinics Quick List */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-700">All Clinics</h3>
                    <button onClick={() => setActiveTab("clinics")}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 transition">
                      View full table →
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {clinics.slice(0, 5).map((c) => (
                      <div key={c.id} className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded-xl transition">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-xs">
                            {(c.clinicName ?? "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{c.clinicName}</p>
                            <p className="text-xs text-gray-400">{c.adminEmail}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge cfg={planCfg(c.subscriptionPlan)} label={c.subscriptionPlan} />
                          <span className="text-xs text-gray-400">{fmt(c.totalPatients)} patients</span>
                          <button onClick={() => setSelectedClinic(c)}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 transition">View →</button>
                        </div>
                      </div>
                    ))}
                    {clinics.length === 0 && (
                      <p className="text-sm text-gray-400 py-8 text-center">No clinics registered yet.</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ════════════ CLINICS TAB ════════════ */}
            {activeTab === "clinics" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
                  <div className="flex-1 relative">
                    <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      value={clinicSearch}
                      onChange={(e) => setClinicSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Search by clinic name, address, or admin…"
                    />
                  </div>
                  <div className="flex gap-2">
                    {["All", "Enterprise", "Pro", "Basic"].map((p) => (
                      <button key={p} onClick={() => setPlanFilter(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${planFilter === p
                          ? "bg-blue-600 text-white border-blue-600"
                          : "text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100">
                        {["Clinic", "Admin", "Plan", "Patients", "Staff", "Phone", ""].map((h) => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filtered.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50 transition">
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0">
                                {(c.clinicName ?? "?").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800 whitespace-nowrap">{c.clinicName}</p>
                                <p className="text-xs text-gray-400">{c.address}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 pr-4">
                            <p className="text-gray-700 font-medium">{c.adminName || "—"}</p>
                            <p className="text-xs text-gray-400">{c.adminEmail || "—"}</p>
                          </td>
                          <td className="py-3 pr-4">
                            <Badge cfg={planCfg(c.subscriptionPlan)} label={c.subscriptionPlan} />
                          </td>
                          <td className="py-3 pr-4 text-gray-700 font-medium">{fmt(c.totalPatients)}</td>
                          <td className="py-3 pr-4 text-gray-500">{fmt(c.totalUsers)}</td>
                          <td className="py-3 pr-4 text-gray-400 text-xs">{c.phone || "—"}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <button onClick={() => setSelectedClinic(c)}
                                className="text-xs font-medium text-blue-600 hover:text-blue-800 transition whitespace-nowrap">
                                View →
                              </button>
                              <button
                                onClick={() => handleDelete(c.id)}
                                disabled={deleteLoadingId === c.id}
                                className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
                                {deleteLoadingId === c.id ? "..." : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length === 0 && (
                    <div className="text-center py-12 text-gray-400 text-sm">No clinics match your search.</div>
                  )}
                </div>
                <p className="mt-3 text-xs text-gray-400">{filtered.length} of {clinics.length} clinics shown</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;