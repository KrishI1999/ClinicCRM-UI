import React from "react";
import AddUser from "./AddComponents/AddUser";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddPatient from "./AddComponents/AddPatient";
import axios from "axios";
import AddVisit from "./AddComponents/AddVisit";

const Dashboard = () => {
    const navigate = useNavigate();

    const [visits, setVisits] = useState([]);
    const [todayVisits, setTodayVisits] = useState(0);
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState([]);
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [showCreatePatient, setShowCreatePatient] = useState(false);
    const [showCreateVisit, setShowCreateVisit] = useState(false);
    const [revenue, setRevenue] = useState(0);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    useEffect(() => {
    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "https://cliniccrm-kvlv.onrender.com/api/payments",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // ✅ FIX: unwrap $values
            const data = response.data.$values || response.data || [];
            const revenue = data.reduce((total, payment) => total + payment.paidAmount, 0);
            setRevenue(revenue);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    fetchPayments();
}, []);

    useEffect(() => {
    const fetchVisits = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "https://cliniccrm-kvlv.onrender.com/api/visits",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // ✅ FIX: unwrap $values
            const data = response.data.$values || response.data || [];
            setVisits(data);

            const count = data.filter((visit) => {
                const visitDate = new Date(visit.visitDate);
                const today = new Date();
                return (
                    visitDate.getDate() === today.getDate() &&
                    visitDate.getMonth() === today.getMonth() &&
                    visitDate.getFullYear() === today.getFullYear()
                );
            }).length;

            setTodayVisits(count);
        } catch (error) {
            console.error("Error fetching visits:", error);
        }
    };

    fetchVisits();
}, []);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "https://cliniccrm-kvlv.onrender.com/api/patients",
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // ✅ FIX: API returns { $values: [...] }, not a plain array
                const list = response.data.$values || response.data || [];
                setPatients(list);
            } catch (error) {
                console.error("Error fetching patients:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-8">

            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">
                        🏥 Clinic Dashboard
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Welcome back! Here's what's happening today.
                    </p>
                    {/* ✅ REMOVED: Subscribe button (Subscription feature removed) */}
                </div>

                <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md transition flex items-center gap-2"
                >
                    <span>⎋</span> Logout
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

                {/* Total Patients */}
                <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                            Total Patients
                        </h3>
                        <span className="text-2xl">🧑‍⚕️</span>
                    </div>
                    {/* ✅ FIX: was patients (number), now patients.length (array) */}
                    <p className="text-4xl font-extrabold text-blue-600">
                        {loading ? "..." : patients.length}
                    </p>
                    {/* ✅ FIX: navigate() without replace:true so back button works */}
                    <button
                        onClick={() => navigate("/patients")}
                        className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        View Patients →
                    </button>
                </div>

                {/* Today's Visits */}
                <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-green-500 hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                            Today's Visits
                        </h3>
                        <span className="text-2xl">📋</span>
                    </div>
                    <p className="text-4xl font-extrabold text-green-600">
                        {todayVisits}
                    </p>
                    <button
                        onClick={() => navigate("/visits")}
                        className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        {/* ✅ FIX: removed stray "hello" from button text */}
                        View All Visits →
                    </button>
                </div>

                {/* Revenue */}
                <div className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-purple-500 hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                            Revenue
                        </h3>
                        <span className="text-2xl">💰</span>
                    </div>
                    <p className="text-4xl font-extrabold text-purple-600">
                        ₹{revenue.toLocaleString("en-IN")}
                    </p>
                    <button
                        onClick={() => navigate("/revenue")}
                        className="inline-block mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        View Revenue →
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-700 mb-4 uppercase tracking-wide">
                    ⚡ Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => setShowCreateUser(true)}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 shadow transition font-medium"
                    >
                        <span className="text-lg">👤</span> Create User
                    </button>
                    <button
                        onClick={() => setShowCreatePatient(true)}
                        className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 shadow transition font-medium"
                    >
                        <span className="text-lg">🧑‍⚕️</span> Create Patient
                    </button>
                    <button
                        onClick={() => setShowCreateVisit(true)}
                        className="flex items-center justify-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl hover:bg-purple-700 shadow transition font-medium"
                    >
                        <span className="text-lg">📋</span> Add Visit
                    </button>
                </div>
            </div>

            {/* Modals */}
            {showCreateUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
                        <button
                            onClick={() => setShowCreateUser(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
                        >✕</button>
                        <h2 className="text-2xl font-bold mb-6">Create New User</h2>
                        <AddUser onClose={() => setShowCreateUser(false)} />
                    </div>
                </div>
            )}

            {showCreatePatient && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
                        <button
                            onClick={() => setShowCreatePatient(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
                        >✕</button>
                        <AddPatient onClose={() => setShowCreatePatient(false)} />
                    </div>
                </div>
            )}

            {showCreateVisit && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
                        <button
                            onClick={() => setShowCreateVisit(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
                        >✕</button>
                        <AddVisit onClose={() => setShowCreateVisit(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;