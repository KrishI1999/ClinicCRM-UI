import { useState } from "react";
import axios from "axios";

function AddPatient({ onClose }) {
  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://cliniccrm-kvlv.onrender.com/api/patients",
        patient,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      setPatient({ name: "", age: "", gender: "", phone: "", address: "" });

      setTimeout(() => {
        onClose?.();
      }, 1200);

    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to add patient. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-lg">
          🧑‍⚕️
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Add New Patient</h2>
          <p className="text-sm text-gray-400">Register a new patient in the clinic</p>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Success */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
          <span>✅</span> Patient added successfully! Closing...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Patient Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Patient Name
          </label>
          <input
            type="text"
            name="name"
            value={patient.name}
            onChange={handleChange}
            placeholder="e.g. Rahul Sharma"
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          />
        </div>

        {/* Age + Gender */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={patient.age}
              onChange={handleChange}
              placeholder="e.g. 35"
              required
              min="0"
              max="150"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Gender
            </label>
            <div className="flex gap-2">
              {["Male", "Female", "Other"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setPatient({ ...patient, gender: g })}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-medium border transition ${
                    patient.gender === g
                      ? g === "Male"
                        ? "bg-blue-600 text-white border-blue-600"
                        : g === "Female"
                        ? "bg-pink-500 text-white border-pink-500"
                        : "bg-gray-600 text-white border-gray-600"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {g === "Male" ? "♂" : g === "Female" ? "♀" : "—"}{" "}
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400 text-sm">
              📞
            </span>
            <input
              type="tel"
              name="phone"
              value={patient.phone}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              required
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Address
          </label>
          <textarea
            name="address"
            value={patient.address}
            onChange={handleChange}
            rows="3"
            placeholder="e.g. 12, MG Road, Pune"
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none"
          />
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
            disabled={loading || success}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Adding...
              </>
            ) : success ? (
              "✅ Added!"
            ) : (
              "Add Patient"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddPatient;