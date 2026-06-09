import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function PatientVisits() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `https://cliniccrm-kvlv.onrender.com/api/visits/patient/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Unwrap top-level $values
        const data = response.data.$values || response.data || [];

        // Unwrap any nested $values on each visit (e.g. visit.payments, visit.items etc.)
        const normalized = data.map((visit) => ({
          ...visit,
          payment: visit.payment?.$values
            ? visit.payment.$values[0] ?? null
            : visit.payment ?? null,
        }));

        setVisits(normalized);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, [id]);

  const patientName = visits[0]?.patientName || null;

  const statusConfig = {
    Paid: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    Partial: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    Unpaid: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200",
      dot: "bg-red-500",
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {patientName ? patientName.charAt(0).toUpperCase() : "P"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {patientName ? `${patientName}'s Visits` : "Patient Visits"}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm text-gray-400">Patient ID: {id}</span>
                {!loading && (
                  <>
                    <span className="text-gray-200">|</span>
                    <span className="text-sm text-gray-400">
                      {visits.length} visit{visits.length !== 1 ? "s" : ""} total
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-2xl mb-2">📋</p>
            <p className="text-gray-400 text-sm">Loading visits...</p>
          </div>
        )}

        {/* No Visits */}
        {!loading && visits.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-3xl mb-3">🗒️</p>
            <p className="text-gray-600 font-medium">No visits found</p>
            <p className="text-gray-400 text-sm mt-1">
              This patient has no recorded visits yet.
            </p>
          </div>
        )}

        {/* Visits Timeline */}
        <div className="space-y-3">
          {visits.map((visit, index) => {
            const status = visit.payment?.status || "Unpaid";
            const cfg = statusConfig[status] || statusConfig.Unpaid;

            return (
              <div
                key={visit.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition"
              >
                {/* Visit Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {visits.length - index}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Visit #{visit.id}
                      </p>
                      <p className="text-xs text-gray-400">
                        {index === 0
                          ? "Latest visit"
                          : `Visit ${visits.length - index} of ${visits.length}`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600">
                      {visit.visitDate
                        ? new Date(visit.visitDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "No Date"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {visit.visitDate
                        ? new Date(visit.visitDate).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-50 mb-4" />

                {/* Case & Advice */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Case Details
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {visit.case || "No case details available"}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                      Medical Advice
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {visit.advice || "No medical advice available"}
                    </p>
                  </div>
                </div>

                {/* Payment Status */}
                {visit.payment && (
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      {status}
                      {visit.payment.pendingAmount > 0 && (
                        <span className="font-normal opacity-75">
                          · ₹{visit.payment.pendingAmount.toFixed(2)} pending
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        Billed:{" "}
                        <span className="font-semibold text-gray-700">
                          ₹{visit.payment.amount?.toFixed(2)}
                        </span>
                      </span>
                      <span>
                        Paid:{" "}
                        <span className="font-semibold text-emerald-600">
                          ₹{visit.payment.paidAmount?.toFixed(2)}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ✅ FIX: proper back button using navigate(-1) instead of <a href> */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
        >
          ← Back
        </button>

      </div>
    </div>
  );
}

export default PatientVisits;