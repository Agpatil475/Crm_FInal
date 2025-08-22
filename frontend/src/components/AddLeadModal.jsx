import React, { useState, useEffect } from "react";
import axios from "axios";

const AddLeadModal = ({ isOpen, onClose, onSuccess }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [sources, setSources] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    campaign_id: "",
    source: "",
    created_by: "00000000-0000-0000-0000-000000000000", // Replace this with actual user ID logic
  });

  useEffect(() => {
    if (isOpen) {
      axios
        .get("http://localhost:5000/api/contacts/campaigns")
        .then((res) => setCampaigns(res.data));
      axios
        .get("http://localhost:5000/api/contacts/sources")
        .then((res) => setSources(res.data));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/contacts", formData);
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error adding lead:", err);
      alert("Failed to add lead");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm transition-all">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6 relative">
        <h2 className="text-xl font-bold text-purple-700 mb-4">Add New Lead</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
          />
          <select
            name="campaign_id"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
            required
          >
            <option value="">Select Campaign</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            name="source"
            className="w-full border px-4 py-2 rounded"
            onChange={handleChange}
            required
          >
            <option value="">Select Source</option>
            {sources.map((s) => (
              <option key={s.label} value={s.label}>
                {s.label}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
            >
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
