import { useState } from "react";
import axios from "axios";

function AddUser({ onClose }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "Staff",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const value = e.target.name === "email"
            ? e.target.value.toLowerCase()
            : e.target.value;

        setForm({ ...form, [e.target.name]: value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.password || !form.role) {
            setError("All fields are required.");
            return;
        }

        if (form.email !== form.email.toLowerCase()) {
            setError("Email must be in lowercase.");
            return;
        }

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (form.password.length > 12) {
            setError("Password must not exceed 12 characters.");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            await axios.post(
                "https://cliniccrm-kvlv.onrender.com/api/users",
                {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: form.role,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            onClose();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data ||
                "Failed to create user. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg">
                    👤
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
                    <p className="text-sm text-gray-400">Add a staff member or admin</p>
                </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                    <span>⚠️</span> {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Dr. Rahul Sharma"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>

                {/* Email */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Email Address
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="e.g. rahul@clinic.com"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Min. 8 characters, max. 12"
                            maxLength={12}
                            className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 text-sm"
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </div>
                    {/* ✅ Live character counter */}
                    <p className={`text-xs mt-1 text-right ${
                        form.password.length > 0 && form.password.length < 8
                            ? "text-red-400"
                            : form.password.length >= 8
                            ? "text-emerald-500"
                            : "text-gray-400"
                    }`}>
                        {form.password.length}/12 characters
                    </p>
                </div>

                {/* Role */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                        Role
                    </label>
                    <div className="flex gap-3">
                        {["Staff", "Admin"].map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setForm({ ...form, role: r })}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition ${
                                    form.role === r
                                        ? r === "Admin"
                                            ? "bg-purple-600 text-white border-purple-600"
                                            : "bg-blue-600 text-white border-blue-600"
                                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                                }`}
                            >
                                {r === "Admin" ? "👑 Admin" : "👤 Staff"}
                            </button>
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">
                        {form.role === "Admin"
                            ? "Admin can manage users, view revenue and all clinic data."
                            : "Staff can manage patients, visits and payments."}
                    </p>
                </div>

                <div className="border-t border-gray-100 pt-2" />

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Creating...
                            </>
                        ) : (
                            "Create User"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddUser;