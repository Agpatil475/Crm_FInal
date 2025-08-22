// /frontend/src/pages/Unauthorized.jsx
import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
      <p className="text-lg text-gray-700 mb-6">
        You do not have permission to access this page.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
