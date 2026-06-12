import { useEffect, useState } from "react";
import axios from "axios";

function AddVisit({ onClose }) {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    // Replace this helper at the top of your component
    const getLocalDateTime = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const local = new Date(now - offset);
        return local.toISOString().slice(0, 16);
    };

    const [visit, setVisit] = useState({
        patientId: "",
        visitDate: getLocalDateTime(),
        case: "",
        advice: "",
        tablets: [],
        followUpDate: "",
        followUpNotes: "",
        referredBy: "",
        pastIllness: [],
    });

    const [tabletInput, setTabletInput] = useState({ name: "", durationDays: "" });
    const [illnessInput, setIllnessInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "https://localhost:5001/api/patients",
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

    const filteredPatients = patients.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectPatient = (patient) => {
        setSearch(patient.name);
        setVisit((prev) => ({ ...prev, patientId: patient.id }));
        setShowDropdown(false);
    };

    const addTablet = () => {
        if (!tabletInput.name.trim() || !tabletInput.durationDays) return;
        setVisit((prev) => ({
            ...prev,
            tablets: [...prev.tablets, { name: tabletInput.name.trim(), durationDays: parseInt(tabletInput.durationDays) }],
        }));
        setTabletInput({ name: "", durationDays: "" });
    };

    const removeTablet = (index) => {
        setVisit((prev) => ({ ...prev, tablets: prev.tablets.filter((_, i) => i !== index) }));
    };

    const addIllness = () => {
        if (!illnessInput.trim()) return;
        setVisit((prev) => ({ ...prev, pastIllness: [...prev.pastIllness, illnessInput.trim()] }));
        setIllnessInput("");
    };

    const removeIllness = (index) => {
        setVisit((prev) => ({ ...prev, pastIllness: prev.pastIllness.filter((_, i) => i !== index) }));
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
                "https://localhost:5001/api/visits",
                {
                    patientId: visit.patientId,
                    visitDate: visit.visitDate,
                    case: visit.case,
                    advice: visit.advice,
                    tablets: visit.tablets,
                    followUpDate: visit.followUpDate || null,
                    followUpNotes: visit.followUpNotes,
                    referredBy: visit.referredBy,
                    pastIllness: visit.pastIllness,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("success:Visit created successfully.");
            setVisit({
                patientId: "",
                visitDate: new Date().toISOString().slice(0, 16),
                case: "", advice: "", tablets: [],
                followUpDate: "", followUpNotes: "", referredBy: "", pastIllness: [],
            });
            setSearch("");
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
        <div className="flex flex-col max-h-[85vh]">

            {/* Header — fixed */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 flex-shrink-0">
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

            {/* Message */}
            {message && (
                <div className={`mt-3 px-4 py-3 rounded-xl text-sm flex items-center gap-2 border flex-shrink-0 ${isSuccess ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"
                    }`}>
                    <span>{isSuccess ? "✅" : "⚠️"}</span>
                    {messageText}
                </div>
            )}

            {/* Scrollable form body */}
            <div className="flex-1 pr-1 mt-4">
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Row 1 — Patient + Visit Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <label className={labelClass}>Patient</label>
                            <input
                                type="text"
                                placeholder="Search patient..."
                                value={search}
                                onFocus={() => setShowDropdown(true)}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setShowDropdown(true);
                                    setVisit((prev) => ({ ...prev, patientId: "" }));
                                }}
                                className={inputClass}
                            />
                            {visit.patientId && (
                                <p className="text-xs text-emerald-600 mt-1 font-medium">✓ Patient selected</p>
                            )}
                            {showDropdown && search && (
                                <div className="absolute z-50 w-full border border-gray-200 rounded-xl mt-1 max-h-40 overflow-y-auto bg-white shadow-lg">
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

                        <div>
                            <label className={labelClass}>Visit Date & Time</label>
                            <input
                                type="datetime-local"
                                value={visit.visitDate}
                                onChange={(e) => setVisit((prev) => ({ ...prev, visitDate: e.target.value }))}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Row 2 — Case + Advice */}
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    {/* Row 3 — Referred By + Past Illness */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Referred By</label>
                            <input
                                type="text"
                                placeholder="e.g. Dr. Raj Mehta"
                                value={visit.referredBy}
                                onChange={(e) => setVisit((prev) => ({ ...prev, referredBy: e.target.value }))}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Past Illness</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="e.g. Diabetes"
                                    value={illnessInput}
                                    onChange={(e) => setIllnessInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addIllness(); } }}
                                    className={inputClass}
                                />
                                <button
                                    type="button"
                                    onClick={addIllness}
                                    className="px-4 py-2.5 bg-emerald-600 text-white text-sm rounded-xl hover:bg-emerald-700 transition font-medium flex-shrink-0"
                                >
                                    Add
                                </button>
                            </div>
                            {visit.pastIllness.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    {visit.pastIllness.map((illness, i) => (
                                        <span key={i} className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                            {illness}
                                            <button type="button" onClick={() => removeIllness(i)} className="text-emerald-400 hover:text-red-500 transition font-bold">×</button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row 4 — Tablets */}
                    <div>
                        <label className={labelClass}>Tablets / Medicines</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Medicine name"
                                value={tabletInput.name}
                                onChange={(e) => setTabletInput((prev) => ({ ...prev, name: e.target.value }))}
                                className={inputClass}
                            />
                            <input
                                type="number"
                                placeholder="Days"
                                value={tabletInput.durationDays}
                                onChange={(e) => setTabletInput((prev) => ({ ...prev, durationDays: e.target.value }))}
                                className="w-28 border border-gray-200 bg-gray-50 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition flex-shrink-0"
                            />
                            <button
                                type="button"
                                onClick={addTablet}
                                className="px-4 py-2.5 bg-violet-600 text-white text-sm rounded-xl hover:bg-violet-700 transition font-medium flex-shrink-0"
                            >
                                Add
                            </button>
                        </div>
                        {visit.tablets.length > 0 && (
                            <div className="mt-2 grid grid-cols-2 gap-2">
                                {visit.tablets.map((t, i) => (
                                    <div key={i} className="flex items-center justify-between bg-violet-50 border border-violet-100 rounded-lg px-3 py-2 text-sm">
                                        <span className="text-violet-800 font-medium truncate">{t.name}</span>
                                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                            <span className="text-violet-500 text-xs">{t.durationDays}d</span>
                                            <button type="button" onClick={() => removeTablet(i)} className="text-red-400 hover:text-red-600 transition text-xs font-medium">✕</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Row 5 — Follow Up */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-3">Follow-up</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Follow-up Date</label>
                                <input
                                    type="date"
                                    value={visit.followUpDate}
                                    onChange={(e) => setVisit((prev) => ({ ...prev, followUpDate: e.target.value }))}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Follow-up Notes</label>
                                <textarea
                                    rows="2"
                                    placeholder="Any notes for the follow-up..."
                                    value={visit.followUpNotes}
                                    onChange={(e) => setVisit((prev) => ({ ...prev, followUpNotes: e.target.value }))}
                                    className={inputClass + " resize-none"}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-2" />

                    {/* Actions */}
                    <div className="flex gap-3 pb-1">
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
                            ) : "Add Visit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddVisit;