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
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setPatients(response.data);
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

        setVisit((prev) => ({
            ...prev,
            patientId: patient.id,
        }));

        setShowDropdown(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!visit.patientId) {
            setMessage("❌ Please select a patient");
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
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("✅ Visit created successfully");

            setVisit({
                patientId: "",
                visitDate: new Date().toISOString().slice(0, 16),
                case: "",
                advice: "",
            });

            setSearch("");
            setShowDropdown(false);

            // Close popup after success (optional)
            setTimeout(() => {
                if (onClose) onClose();
            }, 1000);

        } catch (error) {
            console.error(error.response?.data || error.message);

            setMessage(
                error.response?.data?.message ||
                "❌ Failed to create visit"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
                Add Visit
            </h2>

            {/* Message */}
            {message && (
                <div className="p-3 rounded-lg bg-gray-100 text-gray-700">
                    {message}
                </div>
            )}

            {/* Patient Search */}
            <div className="relative">
                <label className="block mb-2 font-medium">
                    Patient Name
                </label>

                <input
                    type="text"
                    placeholder="Search patient..."
                    value={search}
                    onFocus={() => setShowDropdown(true)}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setShowDropdown(true);

                        setVisit((prev) => ({
                            ...prev,
                            patientId: "",
                        }));
                    }}
                    className="w-full border rounded-lg p-3"
                />

                {showDropdown && search && (
                    <div className="absolute z-50 w-full border rounded-lg mt-1 max-h-48 overflow-y-auto bg-white shadow-lg">
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map((patient) => (
                                <div
                                    key={patient.id}
                                    onClick={() => selectPatient(patient)}
                                    className="p-3 cursor-pointer hover:bg-gray-100"
                                >
                                    <div className="font-medium">
                                        {patient.name}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-3 text-gray-500">
                                No patients found
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Visit Date */}
            <div>
                <label className="block mb-2 font-medium">
                    Visit Date
                </label>

                <input
                    type="datetime-local"
                    value={visit.visitDate}
                    onChange={(e) =>
                        setVisit((prev) => ({
                            ...prev,
                            visitDate: e.target.value,
                        }))
                    }
                    className="w-full border rounded-lg p-3"
                />
            </div>

            {/* Notes */}
            <div>
                <label className="block mb-2 font-medium">
                    Case Details
                </label>

                <textarea
                    rows="4"
                    placeholder="Enter case details..."
                    value={visit.case}
                    onChange={(e) =>
                        setVisit((prev) => ({
                            ...prev,
                            case: e.target.value,
                        }))
                    }
                    className="w-full border rounded-lg p-3"
                />
            </div>

            {/* Advice */}
            <div>
                <label className="block mb-2 font-medium">
                    Medical Advice
                </label>

                <textarea
                    rows="4"
                    placeholder="Enter medical advice..."
                    value={visit.advice}
                    onChange={(e) =>
                        setVisit((prev) => ({
                            ...prev,
                            advice: e.target.value,
                        }))
                    }
                    className="w-full border rounded-lg p-3"
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                >
                    {loading ? "Creating Visit..." : "Add Visit"}
                </button>
            </div>
        </form>
    );
}

export default AddVisit;