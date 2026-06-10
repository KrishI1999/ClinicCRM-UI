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
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(true);
    const [deleteLoadingId, setDeleteLoadingId] = useState(null);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("tokenExpiry");
        navigate("/login");
    };

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "https://cliniccrm-kvlv.onrender.com/api/payments",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = response.data.$values || response.data || [];
                const total = data.reduce((sum, p) => sum + p.paidAmount, 0);
                setRevenue(total);
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
                console.error(error);
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
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setUsersLoading(true);
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "https://cliniccrm-kvlv.onrender.com/api/users",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = response.data.$values || response.data || [];
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setUsersLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            setDeleteLoadingId(id);
            const token = localStorage.getItem("token");
            await axios.delete(
                `https://cliniccrm-kvlv.onrender.com/api/users/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (error) {
            console.error(error);
        } finally {
            setDeleteLoadingId(null);
        }
    };

    const roleConfig = {
        Admin: {
            bg: "bg-purple-50",
            text: "text-purple-700",
            border: "border-purple-200",
            dot: "bg-purple-500",
            label: "Admin",
        },
        Staff: {
            bg: "bg-blue-50",
            text: "text-blue-700",
            border: "border-blue-200",
            dot: "bg-blue-500",
            label: "Staff",
        },
    };

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
                        <p className="text-xs text-gray-400">Admin Dashboard</p>
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
                    <p className="text-sm text-gray-400 mt-0.5">Here's what's happening at your clinic today.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

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

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Total Revenue</p>
                            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
                                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                            ₹{revenue.toLocaleString("en-IN")}
                        </p>
                        <button
                            onClick={() => navigate("/revenue")}
                            className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-800 transition"
                        >
                            View revenue →
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                            onClick={() => setShowCreateUser(true)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition text-left group"
                        >
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">Create User</p>
                                <p className="text-xs text-gray-400">Add staff or admin</p>
                            </div>
                        </button>

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

                {/* Users Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700">Clinic Users</h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {usersLoading ? "Loading..." : `${users.length} user${users.length !== 1 ? "s" : ""} in your clinic`}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCreateUser(true)}
                            className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition"
                        >
                            + Add User
                        </button>
                    </div>

                    {usersLoading && (
                        <div className="text-center py-10 text-gray-400 text-sm">Loading users...</div>
                    )}

                    {!usersLoading && users.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-sm">No users found. Add your first user.</p>
                        </div>
                    )}

                    {!usersLoading && users.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">User</th>
                                        <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">Email</th>
                                        <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">Role</th>
                                        <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3 pr-4">Joined</th>
                                        <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide pb-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.map((user) => {
                                        const cfg = roleConfig[user.role] || roleConfig.Staff;
                                        return (
                                            <tr key={user.id} className="hover:bg-gray-50 transition">
                                                <td className="py-3 pr-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-xs flex-shrink-0">
                                                            {user.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-gray-800">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 pr-4 text-gray-500">{user.email}</td>
                                                <td className="py-3 pr-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                        {cfg.label}
                                                    </span>
                                                </td>
                                                <td className="py-3 pr-4 text-gray-400 text-xs">
                                                    {user.createdAt
                                                        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                                                            day: "numeric", month: "short", year: "numeric",
                                                        })
                                                        : "—"}
                                                </td>
                                                <td className="py-3 text-right">
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        disabled={deleteLoadingId === user.id}
                                                        className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                                    >
                                                        {deleteLoadingId === user.id ? "Deleting..." : "Delete"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showCreateUser && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
                        <button
                            onClick={() => setShowCreateUser(false)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition text-sm"
                        >✕</button>
                        <AddUser onClose={() => { setShowCreateUser(false); fetchUsers(); }} />
                    </div>
                </div>
            )}

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

export default Dashboard;