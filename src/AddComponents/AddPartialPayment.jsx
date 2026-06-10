import { useState } from "react";
import axios from "axios";

function AddPartialPayment({ paymentId, pendingAmount, onClose, onSuccess }) {
    const [form, setForm] = useState({
        paidAmount: "",
        paymentMethod: "Cash",
        notes: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Number(form.paidAmount) > pendingAmount) {
            setMessage(`❌ Amount cannot exceed pending balance of ₹${pendingAmount}`);
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const token = localStorage.getItem("token");

            await axios.post(
                `https://cliniccrm-kvlv.onrender.com/api/payments/${paymentId}/partial`,
                {
                    paidAmount: Number(form.paidAmount),
                    paymentMethod: form.paymentMethod,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage("✅ Partial payment applied successfully");

            setForm({
                paidAmount: "",
                paymentMethod: "Cash",
                notes: "",
            });

            if (onSuccess) onSuccess();

            setTimeout(() => {
                if (onClose) onClose();
            }, 1000);
        } catch (error) {
            console.error(error.response?.data || error.message);
            setMessage(
                error.response?.data?.message || "❌ Failed to apply partial payment"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">
                    Pay Remaining Balance
                </h2>
                <p className="text-sm text-orange-600 mt-1 font-medium">
                    Pending Amount: ₹{pendingAmount}
                </p>
            </div>

            {message && (
                <div className="p-3 rounded-lg bg-gray-100 text-gray-700">
                    {message}
                </div>
            )}

            <div>
                <label className="block mb-2 font-medium">
                    Paying Now
                </label>
                <input
                    type="number"
                    step="0.01"
                    name="paidAmount"
                    value={form.paidAmount}
                    onChange={handleChange}
                    placeholder={`Max ₹${pendingAmount}`}
                    required
                    min="1"
                    max={pendingAmount}
                    className="w-full border rounded-lg p-3"
                />
                {form.paidAmount && Number(form.paidAmount) < pendingAmount && (
                    <p className="text-sm text-gray-500 mt-1">
                        Still remaining after this: ₹{(pendingAmount - Number(form.paidAmount)).toFixed(2)}
                    </p>
                )}
            </div>

            <div>
                <label className="block mb-2 font-medium">
                    Payment Method
                </label>
                <select
                    name="paymentMethod"
                    value={form.paymentMethod}
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
                    value={form.notes}
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
                    className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:bg-orange-300"
                >
                    {loading ? "Applying Payment..." : "Pay Now"}
                </button>
            </div>
        </form>
    );
}

export default AddPartialPayment;