import React, { useState } from "react";
import axios from "axios";
import AddBulkUserModal from "./AddBulkUserModal";

const roles = ["ORG_ADMIN", "MANAGER", "ASST_MANAGER", "EXECUTIVE"];

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [users, setUsers] = useState([
    {
      user_name: "",
      mobile_number: "",
      user_password: "",
      role: "",
      email: "",
      reporting_to: "",
      employee_id: "",
    },
  ]);
  const [responseData, setResponseData] = useState([]);
  const [step, setStep] = useState("form"); // form | result
  const [showBulkModal, setShowBulkModal] = useState(false);

  const handleInputChange = (index, field, value) => {
    const updatedUsers = [...users];
    updatedUsers[index][field] = value;
    setUsers(updatedUsers);
  };

  const handleAddRow = () => {
    setUsers([
      ...users,
      {
        user_name: "",
        mobile_number: "",
        user_password: "",
        role: "",
        email: "",
        reporting_to: "",
        employee_id: "",
      },
    ]);
  };

  const handleRemoveRow = (index) => {
    const updatedUsers = [...users];
    updatedUsers.splice(index, 1);
    setUsers(updatedUsers);
  };

  const handleSubmit = async () => {
    const results = [];

    for (const user of users) {
      try {
        const transformedUser = {
          name: user.user_name,
          email: user.email,
          password: user.user_password,
          role: user.role,
          mobile_number: user.mobile_number,
          reporting_to: user.reporting_to,
          employee_id: user.employee_id,
          expiry_date: "2026-12-31", // or dynamic date if needed
        };

        const res = await axios.post("/api/auth/register", transformedUser);

        results.push({
          ...user,
          status: "Success",
          description: "User created successfully",
        });
      } catch (err) {
        results.push({
          ...user,
          status: "Failed",
          description:
            err.response?.data?.error || "Server error during registration",
        });
      }
    }

    setResponseData(results);
    setStep("result");
    onUserAdded(); // refresh table
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-5xl p-6 rounded shadow">
        <h2 className="text-xl font-bold text-purple-700 mb-2">Add Users</h2>

        {step === "form" && (
          <>
            <div className="text-sm text-gray-500 mb-4">
              Supported formats: <code>.csv</code>, <code>.xls</code>,{" "}
              <code>.xlsx</code>
              <span
                className="float-right text-purple-700 font-semibold cursor-pointer"
                onClick={() => setShowBulkModal(true)}
              >
                Add Bulk Users
              </span>
            </div>

            {users.map((user, index) => (
              <div
                key={index}
                className="grid grid-cols-7 gap-2 items-center mb-2"
              >
                <input
                  placeholder="User Name *"
                  value={user.user_name}
                  onChange={(e) =>
                    handleInputChange(index, "user_name", e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                  required
                />
                <input
                  placeholder="Contact Number *"
                  value={user.mobile_number}
                  onChange={(e) =>
                    handleInputChange(index, "mobile_number", e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                  required
                />
                <input
                  type="password"
                  placeholder="Password *"
                  value={user.user_password}
                  onChange={(e) =>
                    handleInputChange(index, "user_password", e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                  required
                />
                <select
                  value={user.role}
                  onChange={(e) =>
                    handleInputChange(index, "role", e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                  required
                >
                  <option value="">Role *</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Email"
                  value={user.email}
                  onChange={(e) =>
                    handleInputChange(index, "email", e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                />
                <input
                  placeholder="Manager (optional)"
                  value={user.reporting_to}
                  onChange={(e) =>
                    handleInputChange(index, "reporting_to", e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                />
                <input
                  placeholder="Employee ID (optional)"
                  value={user.employee_id}
                  onChange={(e) =>
                    handleInputChange(index, "employee_id", e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                />
              </div>
            ))}

            <button
              className="text-sm text-purple-600 font-semibold mb-4"
              onClick={handleAddRow}
            >
              + Add Row
            </button>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
              >
                Submit
              </button>
            </div>
          </>
        )}

        {step === "result" && (
          <>
            <h3 className="text-md font-medium mb-2">User Response:</h3>
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Mobile Number</th>
                  <th className="border px-2 py-1">Role</th>
                  <th className="border px-2 py-1">Status</th>
                  <th className="border px-2 py-1">Description</th>
                </tr>
              </thead>
              <tbody>
                {responseData.map((res, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{res.user_name}</td>
                    <td className="border px-2 py-1">{res.mobile_number}</td>
                    <td className="border px-2 py-1">{res.role}</td>
                    <td
                      className={`border px-2 py-1 font-semibold ${
                        res.status === "Success"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {res.status}
                    </td>
                    <td className="border px-2 py-1">{res.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setStep("form");
                  onClose();
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
              >
                OK
              </button>
            </div>
          </>
        )}
        <AddBulkUserModal
          isOpen={showBulkModal}
          onClose={() => setShowBulkModal(false)}
          onUserAdded={() => {
            setShowBulkModal(false);
            onUserAdded(); // to refresh parent
          }}
        />
      </div>
    </div>
  );
};

export default AddUserModal;
