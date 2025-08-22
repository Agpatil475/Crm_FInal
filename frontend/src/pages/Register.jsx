// /frontend/src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginVisual from "../assets/login-visual.png";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [strength, setStrength] = useState("");

  const validatePassword = (password) => {
    const length = password.length >= 8;
    const upper = /[A-Z]/.test(password);
    const lower = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const special = /[!@#$%^&*]/.test(password);

    const score = [length, upper, lower, number, special].filter(
      Boolean
    ).length;

    if (score <= 2) return "Weak";
    if (score === 3 || score === 4) return "Moderate";
    return "Strong";
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setForm({ ...form, password: pwd });
    setStrength(validatePassword(pwd));
  };

  const validateEmail = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: "sample",
      });
    } catch (err) {
      if (err.response?.status === 401) setEmailTaken(false);
      else setEmailTaken(true);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (emailTaken) return;

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      Swal.fire({
        title: "Registration Successful!",
        icon: "success",
        text: "Redirecting to login...",
        timer: 1800,
        showConfirmButton: false,
        position: "top-end",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      Swal.fire("Failed", "Please try again", "error");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Visual */}
      <div className="w-1/2 bg-gradient-to-br from-purple-800 via-indigo-900 to-black text-white flex flex-col justify-center items-center p-10">
        <img
          src={loginVisual}
          alt="Register Visual"
          className="max-w-[80%] mb-6"
        />
        <h1 className="text-xl font-semibold">Create your business identity</h1>
      </div>

      {/* Right Register Form */}
      <div className="w-1/2 bg-[#f6f9ff] flex justify-center items-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            Create Account
          </h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full mb-4 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              required
              onBlur={validateEmail}
              className={`w-full mb-1 px-4 py-2 rounded-full border ${
                emailTaken ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {emailTaken && (
              <p className="text-xs text-red-500 mb-2">
                Email already registered
              </p>
            )}

            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                value={form.password}
                onChange={handlePasswordChange}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-2.5 cursor-pointer text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {form.password && (
              <p
                className={`text-sm mb-3 ${
                  strength === "Strong"
                    ? "text-green-500"
                    : strength === "Moderate"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                Password strength: {strength}
              </p>
            )}

            <select
              required
              className="w-full mb-6 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="">Select Role</option>
              <option value="ORG_ADMIN">ORG_ADMIN</option>
              <option value="TEAM_LEAD">TEAM_LEAD</option>
              <option value="EMPLOYEE">EMPLOYEE</option>
            </select>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition"
            >
              Register
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:underline font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
