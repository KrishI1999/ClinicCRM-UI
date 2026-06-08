import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await axios.post(
        "https://cliniccrm-kvlv.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      const jwtToken = resp.data.token;
      const role=resp.data.user.role;

      localStorage.setItem("token", jwtToken);
      localStorage.setItem("role", role);
      if (resp.data.user.role === "Admin") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/userdashboard", { replace: true });
      }
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">
            Clinic CRM
          </h1>
          <p className="text-gray-500 mt-2">
            Sign in to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="doctor@clinic.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-6">
          <span className="text-gray-600">
            Don't have an account?
          </span>

          <Link
            to="/register"
            className="ml-2 text-blue-600 font-semibold hover:text-blue-800"
          >
            Register Clinic
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;