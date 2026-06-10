import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AddPayment from "./AddComponents/AddPayment";
import AddPartialPayment from "./AddComponents/AddPartialPayment";

function AllVisits() {
    const { id } = useParams();
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPayment, setShowPayment] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [isFiltered, setIsFiltered] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const visitsPerPage = 5;

    const fetchVisits = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "https://cliniccrm-kvlv.onrender.com/api/visits",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = response.data.$values || response.data || [];
            setVisits(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, [id]);

    const handlePaymentSuccess = () => {
        fetchVisits(); // refresh list so status updates instantly
        setShowPayment(false);
        setSelectedVisit(null);
    };

    const handleCloseModal = () => {
        setShowPayment(false);
        setSelectedVisit(null);
    };

    const filteredVisits =
        isFiltered && fromDate && toDate
            ? visits.filter((visit) => {
                const visitDate = new Date(visit.visitDate);
                const from = new Date(fromDate);
                const to = new Date(toDate);
                to.setHours(23, 59, 59, 999);
                return visitDate >= from && visitDate <= to;
            })
            : visits;

    const totalPages = Math.ceil(filteredVisits.length / visitsPerPage);
    const indexOfFirstVisit = (currentPage - 1) * visitsPerPage;
    const currentVisits = filteredVisits.slice(indexOfFirstVisit, indexOfFirstVisit + visitsPerPage);

    const handleApplyFilter = () => {
        if (fromDate && toDate) {
            setIsFiltered(true);
            setCurrentPage(1);
        }
    };

    const handleClearFilter = () => {
        setFromDate("");
        setToDate("");
        setIsFiltered(false);
        setCurrentPage(1);
    };

    const handleTodayFilter = () => {
        const today = new Date().toISOString().split("T")[0];
        setFromDate(today);
        setToDate(today);
        setIsFiltered(true);
        setCurrentPage(1);
    };

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

    // Derive what button to show and what modal to open
    const getPaymentAction = (visit) => {
        const status = visit.payment?.status;
        if (status === "Paid") return null;
        if (status === "Partial") return {
            label: `Pay Remaining · ₹${visit.payment.pendingAmount.toFixed(2)}`,
            style: "bg-amber-500 hover:bg-amber-600",
            type: "partial",
        };
        return {
            label: "+ Add Payment",
            style: "bg-blue-600 hover:bg-blue-700",
            type: "new",
        };
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto space-y-5">

                {/* Header */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg">
                            🏥
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Patient Visits</h1>
                            <p className="text-sm text-gray-400">
                                {isFiltered
                                    ? `${filteredVisits.length} visit(s) in range`
                                    : `${visits.length} total visits`}
                            </p>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap items-end gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">From</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">To</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="border border-gray-200 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                            />
                        </div>

                        <button
                            onClick={handleApplyFilter}
                            disabled={!fromDate || !toDate}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Apply
                        </button>

                        <button
                            onClick={handleTodayFilter}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition"
                        >
                            Today
                        </button>

                        {isFiltered && (
                            <button
                                onClick={handleClearFilter}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 bg-white border border-gray-200 hover:bg-gray-100 transition"
                            >
                                ✕ Clear
                            </button>
                        )}

                        {isFiltered && (
                            <span className="text-xs text-gray-400 italic ml-1">
                                {new Date(fromDate).toLocaleDateString()} —{" "}
                                {new Date(toDate).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400 text-sm">
                        Loading visits...
                    </div>
                )}

                {/* No Visits */}
                {!loading && filteredVisits.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                        <p className="text-3xl mb-2">📋</p>
                        <p className="text-gray-500 text-sm">
                            {isFiltered ? "No visits found for the selected date range." : "No visits found."}
                        </p>
                    </div>
                )}

                {/* Visits List */}
                <div className="space-y-3">
                    {currentVisits.map((visit) => {
                        const status = visit.payment?.status || "Unpaid";
                        const cfg = statusConfig[status] || statusConfig.Unpaid;
                        const action = getPaymentAction(visit);

                        return (
                            <div
                                key={visit.id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition"
                            >
                                {/* Visit Header */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                            {visit.patientName?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800 text-base leading-tight">
                                                {visit.patientName}
                                            </p>
                                            <p className="text-xs text-gray-400">Visit #{visit.id}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs font-medium text-gray-500">
                                            {visit.visitDate
                                                ? new Date(visit.visitDate).toLocaleDateString("en-IN", {
                                                    day: "numeric", month: "short", year: "numeric",
                                                })
                                                : "No Date"}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {visit.visitDate
                                                ? new Date(visit.visitDate).toLocaleTimeString("en-IN", {
                                                    hour: "2-digit", minute: "2-digit",
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
                                        <p className="text-sm text-gray-700 leading-relaxed">
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

                                {/* Payment Section */}
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                        {status}
                                        {visit.payment?.pendingAmount > 0 && (
                                            <span className="font-normal opacity-75">
                                                · ₹{visit.payment.pendingAmount.toFixed(2)} pending
                                            </span>
                                        )}
                                    </div>

                                    {/* ✅ Context-aware button */}
                                    {action && (
                                        <button
                                            onClick={() => {
                                                setSelectedVisit(visit);
                                                setShowPayment(true);
                                            }}
                                            className={`flex items-center gap-1.5 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition ${action.style}`}
                                        >
                                            {action.label}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3 flex items-center justify-between">
                        <p className="text-sm text-gray-400">
                            Showing{" "}
                            <span className="font-medium text-gray-600">
                                {indexOfFirstVisit + 1}–{Math.min(indexOfFirstVisit + visitsPerPage, filteredVisits.length)}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium text-gray-600">{filteredVisits.length}</span> visits
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
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                                        page === currentPage ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"
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

                {/* ✅ Context-aware Payment Modal */}
                {showPayment && selectedVisit && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative">
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition text-sm"
                            >
                                ✕
                            </button>

                            <p className="text-sm text-gray-400 mb-6">
                                Visit #{selectedVisit.id} · {selectedVisit.patientName}
                            </p>

                            {/* Render correct form based on payment status */}
                            {selectedVisit.payment?.status === "Partial" ? (
                                <AddPartialPayment
                                    paymentId={selectedVisit.payment.id}
                                    pendingAmount={selectedVisit.payment.pendingAmount}
                                    onClose={handleCloseModal}
                                    onSuccess={handlePaymentSuccess}
                                />
                            ) : (
                                <AddPayment
                                    visitId={selectedVisit.id}
                                    patientId={selectedVisit.patientId}
                                    onClose={handleCloseModal}
                                    onSuccess={handlePaymentSuccess}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllVisits;