import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen font-sans">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          🏥 Clinic CRM
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollTo("contact")}
            className="text-sm text-gray-600 hover:text-gray-900 transition"
          >
            Contact
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
          >
            Login →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-white px-8 py-20 text-center">
        <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
          🩺 Built for modern clinics
        </span>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight max-w-2xl mx-auto mb-5">
          Manage your clinic{" "}
          <span className="text-blue-600">smarter</span>, not harder
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          Clinic CRM brings patients, visits, revenue, and staff management
          into one clean dashboard — so you can focus on care, not paperwork.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-7 py-3 rounded-xl transition text-sm"
          >
            Get started →
          </button>
          <button
            onClick={() => scrollTo("features")}
            className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium px-7 py-3 rounded-xl transition text-sm"
          >
            See features ↓
          </button>
        </div>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <section className="bg-gray-50 px-8 py-10">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-semibold text-gray-700">
              🏥 Clinic Dashboard
            </h3>
            <span className="text-xs text-gray-400">
              Welcome back! Here's today's summary.
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="bg-gray-50 rounded-xl p-4 border-t-4 border-blue-500">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Total patients
              </p>
              <p className="text-2xl font-bold text-blue-600">128</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border-t-4 border-green-500">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Today's visits
              </p>
              <p className="text-2xl font-bold text-green-600">14</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border-t-4 border-purple-500">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Revenue
              </p>
              <p className="text-2xl font-bold text-purple-600">₹84,200</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["👤 Create user", "🧑‍⚕️ Add patient", "📋 Add visit"].map((a) => (
              <div
                key={a}
                className="bg-gray-50 border border-gray-100 rounded-xl py-2 text-center text-xs text-gray-500"
              >
                {a}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-blue-600 grid grid-cols-4">
        {[
          { num: "500+", label: "Patients managed" },
          { num: "3", label: "User roles" },
          { num: "100%", label: "Cloud-based" },
          { num: "24/7", label: "Accessible" },
        ].map(({ num, label }) => (
          <div
            key={label}
            className="text-center py-8 border-r border-blue-500 last:border-r-0"
          >
            <p className="text-3xl font-bold text-white">{num}</p>
            <p className="text-blue-200 text-sm mt-1">{label}</p>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="bg-white px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Everything your clinic needs
          </h2>
          <p className="text-gray-500 text-base">
            From patient records to revenue tracking — all in one place.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {[
            {
              icon: "👥",
              title: "Patient management",
              desc: "Register, search, and manage full patient profiles with complete visit history.",
              color: "bg-blue-50",
            },
            {
              icon: "📋",
              title: "Visit tracking",
              desc: "Log every visit, track today's appointments, and review past records instantly.",
              color: "bg-green-50",
            },
            {
              icon: "💰",
              title: "Revenue insights",
              desc: "Monitor payments, total revenue, and financial summaries at a glance.",
              color: "bg-purple-50",
            },
            {
              icon: "🔐",
              title: "Role-based access",
              desc: "Separate admin and staff roles ensure secure, controlled data access.",
              color: "bg-amber-50",
            },
            {
              icon: "👤",
              title: "User management",
              desc: "Add, manage, and remove clinic staff with full control.",
              color: "bg-teal-50",
            },
            {
              icon: "☁️",
              title: "Cloud-based",
              desc: "Access your clinic data securely from anywhere, anytime, on any device.",
              color: "bg-red-50",
            },
          ].map(({ icon, title, desc, color }) => (
            <div
              key={title}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition"
            >
              <div
                className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center text-xl mb-4`}
              >
                {icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-gray-50 px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            How it works
          </h2>
          <p className="text-gray-500 text-base">Up and running in minutes.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            {
              step: "1",
              title: "Set up your clinic",
              desc: "Create your admin account and configure clinic details.",
            },
            {
              step: "2",
              title: "Add staff & patients",
              desc: "Invite staff members and start registering your patients.",
            },
            {
              step: "3",
              title: "Log visits & payments",
              desc: "Record every visit and track payments as they come in.",
            },
            {
              step: "4",
              title: "Track & grow",
              desc: "Use the dashboard to monitor performance and grow your practice.",
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center mx-auto mb-4">
                {step}
              </div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="bg-white px-8 py-16 text-center">
        <p className="text-lg text-gray-700 italic max-w-xl mx-auto mb-5 leading-relaxed">
          "Clinic CRM transformed how we manage our daily operations. Patient
          tracking, visits, and billing — all in one place. It's exactly what
          a growing clinic needs."
        </p>
        <p className="text-sm text-gray-400">
          — Dr. Priya Sharma, General Physician, Pune
        </p>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="bg-gray-50 px-8 py-20">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Get in touch
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Have questions or want a demo? Reach out — we'd love to hear from
            you.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 text-left">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-base mb-3">
                📧
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Email
              </p>
              <p className="text-sm font-medium text-gray-800 break-all">
                krishnakantidam06@gmail.com
              </p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 text-left">
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center text-base mb-3">
                📞
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800">
                +91 94206 02216
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-blue-600 px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-3">
          Ready to modernise your clinic?
        </h2>
        <p className="text-blue-200 text-sm mb-8">
          Join clinics already using Clinic CRM to streamline their operations.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-blue-50 transition text-sm"
        >
          Get started today →
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-gray-100 px-8 py-5 flex flex-wrap justify-between items-center gap-3 text-sm text-gray-400">
        <span className="font-semibold text-gray-700">🏥 Clinic CRM</span>
        <span>© 2026 Clinic CRM. All rights reserved.</span>
        <span>krishnakantidam06@gmail.com · +91 94206 02216</span>
      </footer>
    </div>
  );
};

export default LandingPage;