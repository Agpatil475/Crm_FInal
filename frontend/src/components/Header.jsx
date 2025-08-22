// /frontend/src/components/Header.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [username, setUsername] = useState("User");

  useEffect(() => {
    if (user && user.name) {
      setUsername(user.name);
    } else {
      // Try fallback from localStorage (in case context not yet initialized)
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUsername(parsed.name || "User");
        } catch {
          setUsername("User");
        }
      }
    }
  }, [user]);

  return (
    <header className="h-16 bg-white shadow px-6 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-gray-700">
        Welcome {username}
      </h1>
      <button
        onClick={logout}
        className="text-sm text-blue-600 hover:underline"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
