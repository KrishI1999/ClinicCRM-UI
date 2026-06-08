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

            setMessage("✅ Payment added successfully");

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
                error.response?.data?.message ||
                "❌ Failed to add payment"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
                Add Payment
            </h2>

            {message && (
                <div className="p-3 rounded-lg bg-gray-100 text-gray-700">
                    {message}
                </div>
            )}

            <div>
                <label className="block mb-2 font-medium">
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
                    className="w-full border rounded-lg p-3"
                />
            </div>

            <div>
                <label className="block mb-2 font-medium">
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
                    className="w-full border rounded-lg p-3"
                />
            </div>

            <div>
                <label className="block mb-2 font-medium">
                    Payment Method
                </label>

                <select
                    name="paymentMethod"
                    value={payment.paymentMethod}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-3"
                >
                    <option value="Cash">Cash</option>
                    <option value="Online">Online</option>
                </select>
            </div>

            <div>
                <label className="block mb-2 font-medium">
                    Notes
                </label>

                <textarea
                    name="notes"
                    rows="3"
                    value={payment.notes}
                    onChange={handleChange}
                    placeholder="Enter notes (optional)"
                    className="w-full border rounded-lg p-3"
                />
            </div>

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
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-green-300"
                >
                    {loading ? "Saving Payment..." : "Add Payment"}
                </button>
            </div>
        </form>
    );
}

export default AddPayment