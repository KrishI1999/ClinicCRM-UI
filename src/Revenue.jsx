import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Revenue() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [isFiltered, setIsFiltered] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "https://localhost:5001/api/payments",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = response.data.$values || response.data || [];
                setPayments(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const filteredPayments = isFiltered && fromDate && toDate
        ? payments.filter((p) => {
            const date = new Date(p.createdAt);
            const from = new Date(fromDate);
            const to = new Date(toDate);
            to.setHours(23, 59, 59, 999);
            return date >= from && date <= to;
        })
        : payments;

    // Stats
    const totalBilled = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalCollected = filteredPayments.reduce((sum, p) => sum + p.paidAmount, 0);
    const totalPending = filteredPayments.reduce((sum, p) => sum + p.pendingAmount, 0);
    const paidCount = filteredPayments.filter((p) => p.status === "Paid").length;
    const partialCount = filteredPayments.filter((p) => p.status === "Partial").length;
    const unpaidCount = filteredPayments.filter((p) => p.status === "Unpaid").length;

    const handleApplyFilter = () => {
        if (fromDate && toDate) setIsFiltered(true);
    };

    const handleClearFilter = () => {
        setFromDate("");
        setToDate("");
        setIsFiltered(false);
    };

    const handleTodayFilter = () => {
        const today = new Date().toISOString().split("T")[0];
        setFromDate(today);
        setToDate(today);
        setIsFiltered(true);
    };

    if (loading) {
        return (
            <div className="p-8">
                <h2 className="text-xl font-semibold">Loading revenue...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header + Filter */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Revenue Overview
                    </h1>

                    <div className="flex flex-wrap items-end gap-3">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500 font-medium">From</label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm text-gray-500 font-medium">To</label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <button
                            onClick={handleApplyFilter}
                            disabled={!fromDate || !toDate}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Apply Filter
                        </button>

                        <button
                            onClick={handleTodayFilter}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
                        >
                            Today
                        </button>

                        {isFiltered && (
                            <button
                                onClick={handleClearFilter}
                                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                            >
                                ✕ Clear Filter
                            </button>
                        )}

                        {isFiltered && (
                            <span className="text-sm text-gray-500 italic">
                                {new Date(fromDate).toLocaleDateString()} —{" "}
                                {new Date(toDate).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-blue-500">
                        <p className="text-sm text-gray-500 mb-1">Total Billed</p>
                        <p className="text-2xl font-bold text-blue-600">
                            ₹{totalBilled.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {filteredPayments.length} payment(s)
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500">
                        <p className="text-sm text-gray-500 mb-1">Total Collected</p>
                        <p className="text-2xl font-bold text-green-600">
                            ₹{totalCollected.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {paidCount} fully paid
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow p-5 border-l-4 border-yellow-500">
                        <p className="text-sm text-gray-500 mb-1">Total Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            ₹{totalPending.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {partialCount} partial · {unpaidCount} unpaid
                        </p>
                    </div>
                </div>

                {/* Payments Table */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Payment Breakdown
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-3">#</th>
                                    <th className="p-3">Patient</th>
                                    <th className="p-3">Visit No</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Method</th>
                                    <th className="p-3">Billed (₹)</th>
                                    <th className="p-3">Paid (₹)</th>
                                    <th className="p-3">Pending (₹)</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{payment.id}</td>
                                        <td className="p-3">{payment.patientName}</td>
                                        <td className="p-3">{payment.visitId}</td>
                                        <td className="p-3">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-3">{payment.paymentMethod}</td>
                                        <td className="p-3">₹{payment.amount.toFixed(2)}</td>
                                        <td className="p-3 text-green-600 font-medium">
                                            ₹{payment.paidAmount.toFixed(2)}
                                        </td>
                                        <td className="p-3 text-yellow-600 font-medium">
                                            ₹{payment.pendingAmount.toFixed(2)}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded-lg text-xs font-medium ${payment.status === "Paid"
                                                        ? "bg-green-100 text-green-700"
                                                        : payment.status === "Partial"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredPayments.length === 0 && (
                        <p className="text-center text-gray-500 mt-6">
                            No payments found for the selected range.
                        </p>
                    )}
                </div>
            </div>
           <div className="flex justify-center mt-5">
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

export default Revenue;