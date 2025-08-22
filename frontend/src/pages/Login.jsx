import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginVisual from "../assets/login-visual.png";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );
      const { token } = res.data;
      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(payload));

      Swal.fire({
        title: `Welcome, ${payload.name}!`,
        text: "You’ve logged in successfully.",
        icon: "success",
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      Swal.fire(
        "Login Failed",
        err?.response?.data?.message || "Invalid credentials",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Image Section */}
      <div className="w-1/2.9 bg-[#2d005f] text-white flex flex-col justify-center items-center p-10">
        <img
          src={loginVisual}
          alt="NeoDove themed login"
          className="max-w-[80%] mb-8"
        />
        <h1 className="text-2xl font-bold">Empower your business today!</h1>
      </div>

      {/* Right: Login Form */}
      <div className="w-1/2 bg-[#f6f9ff] flex justify-center items-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Log in</h2>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email / Phone Number"
              required
              className="w-full mb-4 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <div className="relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-2.5 cursor-pointer text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <div className="text-right text-sm text-purple-500 mb-4 hover:underline cursor-pointer">
              Forgot Password?
            </div>

            <div className="flex items-center mb-4">
              <input type="checkbox" required className="mr-2" />
              <span className="text-sm text-gray-600">
                I accept{" "}
                <span className="text-blue-600 underline">Privacy Policy</span>{" "}
                and{" "}
                <span className="text-blue-600 underline">Terms of Use</span>
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition"
            >
              Log in
            </button>
          </form>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-2 text-sm text-gray-400">or</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <p className="text-center text-sm mb-2 text-purple-600 font-semibold cursor-pointer hover:underline">
            Log in using OTP
          </p>

          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-purple-600 hover:underline font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
