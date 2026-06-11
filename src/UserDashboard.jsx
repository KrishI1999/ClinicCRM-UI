import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddPatient from "./AddComponents/AddPatient";
import axios from "axios";
import AddVisit from "./AddComponents/AddVisit";

const UserDashboard = () => {
    const navigate = useNavigate();

    const [todayVisits, setTodayVisits] = useState(0);
    const [loading, setLoading] = useState(true);
    const [patients, setPatients] = useState([]);
    const [showCreatePatient, setShowCreatePatient] = useState(false);
    const [showCreateVisit, setShowCreateVisit] = useState(false);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("tokenExpiry");
        navigate("/login");
    };

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "https://cliniccrm-kvlv.onrender.com/api/visits",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = response.data.$values || response.data || [];
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
        <div className="min-h-screen bg-slate-50">

            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-base font-semibold text-gray-900">Clinic CRM</h1>
                        <p className="text-xs text-gray-400">Staff Dashboard</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 hidden md:block">
                        {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 border border-gray-200 transition"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">

                {/* Page Title */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Welcome back! Here's what's happening at your clinic today.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Total Patients</p>
                            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                            {loading ? "—" : patients.length}
                        </p>
                        <button
                            onClick={() => navigate("/patients")}
                            className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-800 transition"
                        >
                            View all patients →
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Today's Visits</p>
                            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{todayVisits}</p>
                        <button
                            onClick={() => navigate("/visits")}
                            className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-800 transition"
                        >
                            View all visits →
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                        <button
                            onClick={() => setShowCreatePatient(true)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition text-left group"
                        >
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition">
                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Create Patient</p>
                                <p className="text-xs text-gray-400">Register new patient</p>
                            </div>
                        </button>

                        <button
                            onClick={() => setShowCreateVisit(true)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition text-left group"
                        >
                            <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center group-hover:bg-violet-200 transition">
                                <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Add Visit</p>
                                <p className="text-xs text-gray-400">Record patient visit</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showCreatePatient && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
                        <button
                            onClick={() => setShowCreatePatient(false)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition text-sm"
                        >✕</button>
                        <AddPatient onClose={() => setShowCreatePatient(false)} />
                    </div>
                </div>
            )}

            {showCreateVisit && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
                        <button
                            onClick={() => setShowCreateVisit(false)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition text-sm"
                        >✕</button>
                        <AddVisit onClose={() => setShowCreateVisit(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;