import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    clinicName: "",
    address: "",
    phone: "",
    subscriptionPlan: "",
    adminName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.name === "email"
      ? e.target.value.toLowerCase()
      : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    if (formData.email !== formData.email.toLowerCase()) {
      setError("Email must be in lowercase.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (formData.password.length > 12) {
      setError("Password must not exceed 12 characters.");
      return;
    }

    try {
      setLoading(true);
      const payload = { ...formData, phone: `+91${formData.phone}` };
      await axios.post("https://cliniccrm-kvlv.onrender.com/api/auth/register-clinic", payload);
      setSuccess(true);
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const planConfig = {
    Basic:    { color: "text-gray-700",   bg: "bg-gray-50",   border: "border-gray-200" },
    Standard: { color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
    Premium:  { color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  };

  const inputClass =
    "w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition";

  const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-5">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg">
              🏥
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clinic CRM</h1>
              <p className="text-sm text-gray-400">Create your clinic account</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">

          {/* Clinic Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-base">🏢</span>
              <h2 className="text-base font-semibold text-gray-800">Clinic Details</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Clinic Name</label>
                <input type="text" name="clinicName" value={formData.clinicName}
                  onChange={handleChange} placeholder="e.g. City Health Clinic"
                  required className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Address</label>
                <textarea name="address" value={formData.address}
                  onChange={handleChange} placeholder="Full clinic address"
                  rows={3} required className={inputClass + " resize-none"} />
              </div>

              <div>
                <label className={labelClass}>Phone</label>
                <div className="flex items-center border border-gray-200 bg-gray-50 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-400 focus-within:bg-white transition">
                  <span className="px-3 py-2.5 text-sm font-medium text-gray-500 bg-gray-100 border-r border-gray-200 select-none">
                    🇮🇳 +91
                  </span>
                  <input type="tel" name="phone" value={formData.phone}
                    onChange={handleChange} placeholder="98765 43210"
                    maxLength={10} required
                    className="flex-1 px-3 py-2.5 text-sm bg-transparent focus:outline-none text-gray-800 placeholder-gray-400" />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Must be exactly 10 digits</p>
              </div>

              <div>
                <label className={labelClass}>Subscription Plan</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Basic", "Standard", "Premium"].map((plan) => {
                    const cfg = planConfig[plan];
                    const selected = formData.subscriptionPlan === plan;
                    return (
                      <button key={plan} type="button"
                        onClick={() => { setFormData({ ...formData, subscriptionPlan: plan }); setError(""); }}
                        className={`py-2.5 rounded-xl border text-sm font-medium transition ${
                          selected
                            ? `${cfg.bg} ${cfg.color} ${cfg.border} ring-2 ring-offset-1 ${
                                plan === "Premium" ? "ring-purple-400" :
                                plan === "Standard" ? "ring-blue-400" : "ring-gray-400"
                              }`
                            : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                        }`}>
                        {plan === "Basic" && "⚡ "}
                        {plan === "Standard" && "🌟 "}
                        {plan === "Premium" && "👑 "}
                        {plan}
                      </button>
                    );
                  })}
                </div>
                <select name="subscriptionPlan" value={formData.subscriptionPlan}
                  onChange={handleChange} required className="sr-only" tabIndex={-1}>
                  <option value="" />
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-base">👤</span>
              <h2 className="text-base font-semibold text-gray-800">Admin Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Admin Name</label>
                <input type="text" name="adminName" value={formData.adminName}
                  onChange={handleChange} placeholder="Full name"
                  required className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="admin@clinic.com"
                  required className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password" value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters, max. 12"
                    maxLength={12}
                    required className={inputClass + " pr-11"}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 transition text-sm">
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                <p className={`text-xs mt-1 text-right ${
                  formData.password.length > 0 && formData.password.length < 8
                    ? "text-red-400"
                    : formData.password.length >= 8
                    ? "text-emerald-500"
                    : "text-gray-400"
                }`}>
                  {formData.password.length}/12 characters
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
              <span>✅</span> Registration successful! Redirecting to login...
            </div>
          )}

          <button type="submit" disabled={loading || success}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition text-sm shadow-sm">
            {loading ? "Registering..." : success ? "✅ Redirecting..." : "Register Clinic →"}
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button type="button" onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline font-medium">
              Sign in
            </button>
          </p>
        </form>

      </div>
    </div>
  );
}

export default Register;