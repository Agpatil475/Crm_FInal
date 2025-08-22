import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const UserActionMenu = ({ user, position, onClose, onAction }) => {
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div
      ref={menuRef}
      className="absolute z-50 bg-white rounded shadow-lg w-60 border"
      style={{ top: position.y, left: position.x }}
    >
      <button
        onClick={() => onAction("edit", user)}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Edit
      </button>
      <button
        onClick={() => onAction("status", user)}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        {user.status === "Active" ? "Deactivate" : "Activate"}
      </button>
      <button
        onClick={() => onAction("reset", user)}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        Change Password
      </button>
      <button disabled className="w-full text-left px-4 py-2 text-gray-400">
        View Campaigns
      </button>
      <button disabled className="w-full text-left px-4 py-2 text-gray-400">
        Reassign Leads
      </button>
      <button
        onClick={() => onAction("lead", user)}
        className="w-full text-left px-4 py-2 hover:bg-gray-100"
      >
        {user.lead_assignment_enabled
          ? "Disable Lead Assignment"
          : "Enable Lead Assignment"}
      </button>
      <button
        onClick={() => onAction("delete", user)}
        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
      >
        Delete
      </button>
    </div>,
    document.body
  );
};

export default UserActionMenu;
