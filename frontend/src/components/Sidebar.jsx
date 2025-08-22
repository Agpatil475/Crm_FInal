// /frontend/src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 px-6 py-4 shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Admin Portal</h2>
      <nav className="space-y-4">
        <Link to="/" className="block hover:text-pink-400">
          Dashboard
        </Link>
        <Link to="/contacts" className="block hover:text-pink-400">
          Contacts
        </Link>
        <Link to="/reports" className="block hover:text-pink-400">
          Reports
        </Link>
        <Link to="/settings" className="block hover:text-pink-400">
          Settings
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
