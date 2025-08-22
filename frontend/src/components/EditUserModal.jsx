import React, { useState, useEffect } from "react";
import axios from "axios";

const EditUserModal = ({ isOpen, onClose, userData, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    mobile_number: "",
    status: "Active",
    reporting_to: "",
    expiry_date: "",
    lead_assignment_enabled: true,
  });

  useEffect(() => {
    if (userData && userData.id) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || "",
        mobile_number: userData.mobile_number || "",
        status: userData.status || "Active",
        reporting_to: userData.reporting_to || "",
        expiry_date: userData.expiry_date
          ? new Date(userData.expiry_date).toISOString().split("T")[0]
          : "",
        lead_assignment_enabled:
          userData.lead_assignment_enabled !== undefined
            ? userData.lead_assignment_enabled
            : true,
      });
    }
  }, [userData]);

  const handleInput = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleToggleLead = () =>
    setFormData((prev) => ({
      ...prev,
      lead_assignment_enabled: !prev.lead_assignment_enabled,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData?.id) {
      console.error("Missing user ID");
      alert("Cannot update: Invalid user ID");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/auth/users/${userData.id}`,
        formData
      );
      onUserUpdated();
      onClose();
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update user. Please check the console for details.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInput}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            name="mobile_number"
            placeholder="Mobile Number"
            value={formData.mobile_number}
            onChange={handleInput}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInput}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="text"
            name="reporting_to"
            placeholder="Reporting To"
            value={formData.reporting_to}
            onChange={handleInput}
            className="w-full border rounded px-3 py-2"
          />
          <input
            type="date"
            name="expiry_date"
            value={formData.expiry_date}
            onChange={handleInput}
            className="w-full border rounded px-3 py-2"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleInput}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Role</option>
            <option value="ORG_ADMIN">Org Admin</option>
            <option value="Manager">Manager</option>
            <option value="Executive">Executive</option>
            <option value="Asst. Manager">Asst. Manager</option>
          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleInput}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.lead_assignment_enabled}
              onChange={handleToggleLead}
            />
            <span>Enable Lead Assignment</span>
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
