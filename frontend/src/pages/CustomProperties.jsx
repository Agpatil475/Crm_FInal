import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CustomProperties = () => {
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/custom-properties"
      );
      setProperties(res.data);
    } catch (err) {
      console.error("Error fetching properties", err);
    }
  };

  const handleAddProperty = async () => {
    setError("");
    if (!newProperty.trim()) {
      setError("Please enter property name.");
      return;
    }
    if (properties.length >= 15) {
      setError("Maximum of 15 properties allowed.");
      return;
    }

    try {
      const label = newProperty.trim().toLowerCase().replace(/\s+/g, "_");
      const res = await axios.post(
        "http://localhost:5000/api/custom-properties",
        {
          name: newProperty,
          field_type: fieldType,
          label,
        }
      );
      setProperties([...properties, res.data]);
      setNewProperty("");
    } catch (err) {
      console.error("Error adding property", err);
      setError("Failed to add property.");
    }
  };

  const toggleProperty = async (id) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/custom-properties/${id}/toggle`
      );
      const updated = properties.map((p) => (p.id === id ? res.data : p));
      setProperties(updated);
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  return (
    <div className="p-6">
      <button
        onClick={() => navigate("/contacts")}
        className="flex items-center text-purple-700 hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Contacts
      </button>

      <h1 className="text-2xl font-bold text-purple-700 mb-2">
        Custom Contact Properties
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Manage up to 15 customizable fields to enrich your lead data.
      </p>

      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <h2 className="font-semibold text-gray-800 mb-4">
          Edit Contact Properties
        </h2>

        {properties.length === 0 ? (
          <p className="text-gray-500 mb-4">No custom properties added yet.</p>
        ) : (
          <ul className="space-y-3 mb-6">
            {properties.map((prop) => (
              <li
                key={prop.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded shadow-sm"
              >
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={prop.is_enabled}
                    onChange={() => toggleProperty(prop.id)}
                    className="form-checkbox text-purple-600"
                  />
                  {prop.name}
                </label>
                <span className="text-xs text-gray-400">{`{{${prop.label}}}`}</span>
              </li>
            ))}
          </ul>
        )}

        <h2 className="font-semibold text-gray-800 mb-2">
          Add More Properties
        </h2>
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            placeholder="Property name"
            value={newProperty}
            onChange={(e) => setNewProperty(e.target.value)}
            className="border rounded px-4 py-2 w-full"
          />
          <select
            value={fieldType}
            onChange={(e) => setFieldType(e.target.value)}
            className="border rounded px-2"
          >
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
          </select>
          <button
            onClick={handleAddProperty}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Save
          </button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <p className="text-xs text-gray-500">
          Maximum 15 Custom Contact Properties are allowed.
        </p>
      </div>
    </div>
  );
};

export default CustomProperties;
