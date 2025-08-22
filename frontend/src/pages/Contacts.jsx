// frontend/src/pages/Contacts.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import AddLeadModal from "../components/AddLeadModal";
import { useNavigate } from "react-router-dom";
import { Clock, Upload, SlidersHorizontal } from "lucide-react";
import UploadContactsModal from "../components/UploadContactsModal";

const Contacts = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [sources, setSources] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [leads, setLeads] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [filters, setFilters] = useState({});
  const [customFields, setCustomFields] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    fetchSources();
    fetchCustomFields();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/contacts/campaigns"
      );
      setCampaigns(res.data);
    } catch (err) {
      console.error("Failed to load campaigns", err);
    }
  };

  const fetchSources = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contacts/sources");
      setSources(res.data);
    } catch (err) {
      console.error("Failed to load sources", err);
    }
  };

  const fetchCustomFields = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/custom-properties"
      );
      const enabledFields = res.data.filter((field) => field.is_enabled);
      setCustomFields(enabledFields);

      // Initialize filter state for these fields
      const initialFilters = {};
      enabledFields.forEach((f) => (initialFilters[f.label] = ""));
      setFilters((prev) => ({ ...prev, ...initialFilters }));
    } catch (err) {
      console.error("Failed to fetch custom fields", err);
    }
  };

  const fetchFilteredLeads = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/contacts/search",
        {
          filters,
        }
      );
      setLeads(res.data);
    } catch (err) {
      console.error("Failed to fetch leads", err);
      alert("Search failed. Please check console.");
    }
  };

  const handleSearch = () => {
    const hasValue = Object.values(filters).some((v) => v && v.trim() !== "");
    if (hasValue) {
      fetchFilteredLeads();
      setShowTable(true);
    } else {
      alert("Please enter at least one search field.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800">Contacts</h1>
      <p className="text-sm text-gray-500">
        Manage and track all your leads from here
      </p>

      <div className="flex justify-end gap-3 my-4">
        <button className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition">
          <Clock className="w-4 h-4" />
          View History
        </button>
        <button
          onClick={() => navigate("/custom-properties")}
          className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Custom Contact Properties
        </button>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition"
        >
          <Upload size={16} />
          Upload Contacts
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="font-bold text-purple-700 mb-4">BASIC DETAILS</h2>
          <div className="grid grid-cols-2 gap-4">
            {customFields.map((field) => (
              <input
                key={field.label}
                type="text"
                placeholder={field.name}
                value={filters[field.label] || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    [field.label]: e.target.value,
                  }))
                }
                className="w-full border px-4 py-2 rounded focus:ring-2 ring-purple-300"
              />
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-bold text-purple-700 mb-2">CAMPAIGNS</h2>
            <select className="w-full border px-4 py-2 rounded focus:ring-2 ring-purple-300">
              <option value="">Select Campaign</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="font-bold text-purple-700 mb-2">CONTACT SOURCE</h2>
            <div className="space-y-2 text-sm text-gray-700">
              {sources.map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <input type="checkbox" id={s.label} />
                  <label htmlFor={s.label}>{s.label}</label>
                </div>
              ))}
              <a
                href="#"
                className="text-blue-600 text-xs hover:underline block mt-1"
              >
                View More...
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={handleSearch}
          className="bg-purple-700 text-white px-8 py-2 rounded-full hover:bg-purple-800 transition"
        >
          Search
        </button>
      </div>

      {/* Results Table */}
      {showTable && (
        <div className="bg-white mt-8 shadow rounded-xl overflow-auto relative">
          <button
            onClick={() => setShowTable(false)}
            className="absolute top-3 right-4 text-sm text-gray-500 hover:text-red-600"
          >
            ✖
          </button>
          <h2 className="text-lg font-semibold px-6 py-4 border-b text-purple-700">
            All Leads
          </h2>
          <table className="min-w-full text-sm text-left">
            <thead className="bg-purple-50 border-b">
              <tr>
                {customFields.map((field) => (
                  <th key={field.label} className="px-6 py-3">
                    {field.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={customFields.length}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No leads found
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    {customFields.map((field) => (
                      <td key={field.label} className="px-6 py-3">
                        {lead[field.label] || "-"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <button
        className="fixed bottom-6 right-6 bg-purple-700 hover:bg-purple-800 text-white flex items-center gap-2 px-5 py-2 rounded-full shadow-lg"
        onClick={() => setShowModal(true)}
      >
        + Add Lead
      </button>

      <AddLeadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => {
          alert("Lead added successfully!");
        }}
      />
      {showUploadModal && (
        <UploadContactsModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
};

export default Contacts;
