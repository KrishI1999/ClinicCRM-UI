import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient?"
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://cliniccrm-kvlv.onrender.com/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients((prev) => prev.filter((p) => p.id !== id));
      alert("Patient deleted successfully");
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to delete patient");
    }
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://cliniccrm-kvlv.onrender.com/api/patients",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = response.data;
        setPatients(response.data.$values ?? []);
        console.log("Fetched patients:", response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = (Array.isArray(patients) ? patients : []).filter((patient) => {
    const query = searchQuery.toLowerCase();
    return (
      patient.name?.toLowerCase().includes(query) ||
      patient.phone?.toLowerCase().includes(query) ||
      patient.address?.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const indexOfFirst = (currentPage - 1) * patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirst, indexOfFirst + patientsPerPage);

  // Reset to page 1 when search changes
  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  const avatarColors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-2">👥</p>
          <p className="text-gray-400 text-sm">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-wrap justify-between items-center gap-4">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg">
                👥
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
                <p className="text-sm text-gray-400">
                  {searchQuery
                    ? `${filteredPatients.length} result(s) for "${searchQuery}"`
                    : `${patients.length} total patients`}
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-80">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by name, phone, address..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-red-500 transition"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-slate-50">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Patient
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Age
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Gender
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Phone
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Address
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {currentPatients.map((patient, index) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-slate-50 transition group"
                  >
                    {/* Patient Name + Avatar */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColors[(indexOfFirst + index) % avatarColors.length]
                            }`}
                        >
                          {getInitials(patient.name)}
                        </div>
                        <span className="font-medium text-gray-800">
                          {patient.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {patient.age ?? "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${patient.gender === "Male"
                          ? "bg-blue-50 text-blue-700"
                          : patient.gender === "Female"
                            ? "bg-pink-50 text-pink-700"
                            : "bg-gray-100 text-gray-500"
                          }`}
                      >
                        {patient.gender || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {patient.phone || "—"}
                    </td>

                    <td className="px-5 py-4 text-gray-500 max-w-[180px] truncate">
                      {patient.address || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/visits/patient/${patient.id}`)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                        >
                          📋 Visits
                        </button>

                        <button
                          onClick={() => navigate(`/patients/${patient.id}`)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-50 text-amber-700 hover:bg-amber-100 transition"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          onClick={() => handleDelete(patient.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 transition"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredPatients.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-3xl mb-3">🔍</p>
              <p className="text-gray-500 font-medium">
                {searchQuery
                  ? `No patients found for "${searchQuery}"`
                  : "No patients found."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => handleSearch("")}
                  className="mt-3 text-sm text-blue-600 hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {filteredPatients.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Showing{" "}
                <span className="font-medium text-gray-600">
                  {indexOfFirst + 1}–{Math.min(indexOfFirst + patientsPerPage, filteredPatients.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-600">{filteredPatients.length}</span> patients
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition text-sm"
                >
                  ‹
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${page === currentPage
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-500 hover:bg-gray-100"
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition text-sm"
                >
                  ›
                </button>
              </div>
            </div>
          )}

        </div>
        <button
          onClick={() => navigate('/userdashboard')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
        >
          🏠 Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Patients;