import { useEffect, useState } from "react";
import axios from "axios";

function AddVisit({ onClose }) {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const [visit, setVisit] = useState({
        patientId: "",
        visitDate: new Date().toISOString().slice(0, 16),
        case: "",
        advice: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "https://cliniccrm-kvlv.onrender.com/api/patients",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setPatients(
                    Array.isArray(response.data)
                        ? response.data
                        : response.data.$values || []
                );
            } catch (error) {
                console.error(error);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectPatient = (patient) => {
        setSearch(patient.name);
        setVisit((prev) => ({ ...prev, patientId: patient.id }));
        setShowDropdown(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!visit.patientId) {
            setMessage("error:Please select a patient from the list.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const token = localStorage.getItem("token");

            await axios.post(
                "https://cliniccrm-kvlv.onrender.com/api/visits",
                {
                    patientId: visit.patientId,
                    visitDate: visit.visitDate,
                    case: visit.case,
                    advice: visit.advice,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage("success:Visit created successfully.");
            setVisit({
                patientId: "",
                visitDate: new Date().toISOString().slice(0, 16),
                case: "",
                advice: "",
            });
            setSearch("");
            setShowDropdown(false);

            setTimeout(() => { if (onClose) onClose(); }, 1000);

        } catch (error) {
            setMessage(`error:${error.response?.data?.message || "Failed to create visit."}`);
        } finally {
            setLoading(false);
        }
    };

    const isError = message.startsWith("error:");
    const isSuccess = message.startsWith("success:");
    const messageText = message.replace(/^(error|success):/, "");

    const inputClass = "w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition";
    const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Add Visit</h2>
                    <p className="text-sm text-gray-400">Record a new patient visit</p>
                </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Message */}
            {message && (
                <div className={`px-4 py-3 rounded-xl text-sm flex items-center gap-2 border ${
                    isSuccess
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-red-50 border-red-200 text-red-700"
                }`}>
                    <span>{isSuccess ? "✅" : "⚠️"}</span>
                    {messageText}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Patient Search */}
                <div className="relative">
                    <label className={labelClass}>Patient</label>
                    <input
                        type="text"
                        placeholder="Search by patient name..."
                        value={search}
                        onFocus={() => setShowDropdown(true)}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setShowDropdown(true);
                            setVisit((prev) => ({ ...prev, patientId: "" }));
                        }}
                        className={inputClass}
                    />
                    {/* Selected indicator */}
                    {visit.patientId && (
                        <p className="text-xs text-emerald-600 mt-1.5 font-medium">✓ Patient selected</p>
                    )}

                    {showDropdown && search && (
                        <div className="absolute z-50 w-full border border-gray-200 rounded-xl mt-1 max-h-48 overflow-y-auto bg-white shadow-lg">
                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <div
                                        key={patient.id}
                                        onClick={() => selectPatient(patient)}
                                        className="px-4 py-2.5 cursor-pointer hover:bg-blue-50 text-sm text-gray-700 hover:text-blue-700 transition flex items-center gap-2"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                            {patient.name.charAt(0).toUpperCase()}
                                        </div>
                                        {patient.name}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-gray-400">No patients found</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Visit Date */}
                <div>
                    <label className={labelClass}>Visit Date & Time</label>
                    <input
                        type="datetime-local"
                        value={visit.visitDate}
                        onChange={(e) => setVisit((prev) => ({ ...prev, visitDate: e.target.value }))}
                        className={inputClass}
                    />
                </div>

                {/* Case Details */}
                <div>
                    <label className={labelClass}>Case Details</label>
                    <textarea
                        rows="3"
                        placeholder="Describe the patient's condition..."
                        value={visit.case}
                        onChange={(e) => setVisit((prev) => ({ ...prev, case: e.target.value }))}
                        className={inputClass + " resize-none"}
                    />
                </div>

                {/* Medical Advice */}
                <div>
                    <label className={labelClass}>Medical Advice</label>
                    <textarea
                        rows="3"
                        placeholder="Enter prescribed advice or treatment..."
                        value={visit.advice}
                        onChange={(e) => setVisit((prev) => ({ ...prev, advice: e.target.value }))}
                        className={inputClass + " resize-none"}
                    />
                </div>

                <div className="border-t border-gray-100 pt-2" />

                {/* Actions */}
                <div className="flex gap-3">
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    )}
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
                                Creating Visit...
                            </>
                        ) : (
                            "Add Visit"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddVisit;