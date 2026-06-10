import { useState } from "react";
import axios from "axios";

function AddPayment({ visitId, patientId, onClose, onSuccess }) {
    const [payment, setPayment] = useState({
        amount: "",
        paidAmount: "",
        paymentMethod: "Cash",
        notes: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setPayment({
            ...payment,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const token = localStorage.getItem("token");

            await axios.post(
                "https://cliniccrm-kvlv.onrender.com/api/payments",
                {
                    patientId,
                    visitId,
                    amount: Number(payment.amount),
                    paidAmount: Number(payment.paidAmount),
                    paymentMethod: payment.paymentMethod,
                    notes: payment.notes,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("success:Payment added successfully");

            setPayment({
                amount: "",
                paidAmount: "",
                paymentMethod: "Cash",
                notes: "",
            });

            if (onSuccess) {
                onSuccess();
            }

            setTimeout(() => {
                if (onClose) {
                    onClose();
                }
            }, 1000);
        } catch (error) {
            console.error(error.response?.data || error.message);

            setMessage(
                `error:${error.response?.data?.message || "Failed to add payment"}`
            );
        } finally {
            setLoading(false);
        }
    };

    const isError = message.startsWith("error:");
    const isSuccess = message.startsWith("success:");
    const messageText = message.replace(/^(error|success):/, "");

    const inputClass =
        "w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition";

    const labelClass =
        "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

    return (
        <div className="space-y-5">

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
                    <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 9V7a5 5 0 00-10 0v2M5 9h14l-1 10H6L5 9z"
                        />
                    </svg>
                </div>

                <div>
                    <h2 className="text-xl font-bold text-gray-900">
                        Add Payment
                    </h2>
                    <p className="text-sm text-gray-400">
                        Record patient payment details
                    </p>
                </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Message */}
            {message && (
                <div
                    className={`px-4 py-3 rounded-xl text-sm flex items-center gap-2 border ${isSuccess
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-red-50 border-red-200 text-red-700"
                        }`}
                >
                    <span>{isSuccess ? "✅" : "⚠️"}</span>
                    {messageText}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Total Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Total Amount */}
                    <div>
                        <label className={labelClass}>
                            Total Amount
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            name="amount"
                            value={payment.amount}
                            onChange={handleChange}
                            placeholder="Enter total amount"
                            required
                            className={inputClass}
                        />
                    </div>

                    {/* Paid Amount */}
                    <div>
                        <label className={labelClass}>
                            Paid Amount
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            name="paidAmount"
                            value={payment.paidAmount}
                            onChange={handleChange}
                            placeholder="Enter paid amount"
                            required
                            className={inputClass}
                        />
                    </div>

                </div>

                {/* Payment Method */}
                <div>
                    <label className={labelClass}>
                        Payment Method
                    </label>

                    <select
                        name="paymentMethod"
                        value={payment.paymentMethod}
                        onChange={handleChange}
                        className={inputClass}
                    >
                        <option value="Cash">Cash</option>
                        <option value="Online">Online</option>
                    </select>
                </div>

                {/* Notes */}
                <div>
                    <label className={labelClass}>
                        Notes
                    </label>

                    <textarea
                        name="notes"
                        rows="3"
                        value={payment.notes}
                        onChange={handleChange}
                        placeholder="Enter notes (optional)"
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
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v8z"
                                    />
                                </svg>
                                Saving Payment...
                            </>
                        ) : (
                            "Add Payment"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddPayment;