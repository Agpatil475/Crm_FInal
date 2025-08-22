import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

const roles = ["ORG_ADMIN", "MANAGER", "ASST_MANAGER", "EXECUTIVE"];

const AddBulkUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [users, setUsers] = useState([]);
  const [fileName, setFileName] = useState("");
  const [responseData, setResponseData] = useState([]);
  const [step, setStep] = useState("upload"); // upload | form | result

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      const transformed = data.map((row) => ({
        user_name: row["user_name"] || row["User Name"] || "",
        mobile_number: row["mobile_number"] || row["Contact Number"] || "",
        user_password: row["password"] || row["Password"] || "",
        role: row["role"] || row["Role"] || "",
        email: row["email"] || row["Email"] || "",
        reporting_to: row["reporting_to"] || row["Manager"] || "",
        employee_id: row["employee_id"] || row["Employee Id"] || "",
      }));

      setUsers(transformed);
      setStep("form");
    };
    reader.readAsBinaryString(file);
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...users];
    updated[index][field] = value;
    setUsers(updated);
  };

  const handleRemoveRow = (index) => {
    const updated = [...users];
    updated.splice(index, 1);
    setUsers(updated);
  };

  const handleSubmit = async () => {
    const results = [];

    for (const user of users) {
      const transformedUser = {
        name: user.user_name,
        email: user.email,
        password: user.user_password,
        role: user.role,
        mobile_number: user.mobile_number,
        reporting_to: user.reporting_to,
        employee_id: user.employee_id,
        expiry_date: "2026-12-31",
      };

      try {
        await axios.post("/api/auth/register", transformedUser);
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
    onUserAdded();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-6xl p-6 rounded shadow">
        <h2 className="text-xl font-bold text-purple-700 mb-2">Add Users</h2>

        {step === "upload" && (
          <>
            <div className="text-sm text-gray-500 mb-4">
              Supported formats: <code>.csv</code>, <code>.xls</code>,{" "}
              <code>.xlsx</code>
            </div>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
            />
          </>
        )}

        {step === "form" && (
          <>
            <p className="text-sm text-gray-600 mb-2">
              File: <b>{fileName}</b>
            </p>
            {users.map((user, index) => (
              <div key={index} className="grid grid-cols-7 gap-2 mb-2">
                <input
                  placeholder="User Name *"
                  value={user.user_name}
                  onChange={(e) =>
                    handleInputChange(index, "user_name", e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                />
                <input
                  placeholder="Contact Number *"
                  value={user.mobile_number}
                  onChange={(e) =>
                    handleInputChange(index, "mobile_number", e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                />
                <input
                  placeholder="Password *"
                  type="password"
                  value={user.user_password}
                  onChange={(e) =>
                    handleInputChange(index, "user_password", e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                />
                <select
                  value={user.role}
                  onChange={(e) =>
                    handleInputChange(index, "role", e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                >
                  <option value="">Select Role</option>
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
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
                  placeholder="Manager *"
                  value={user.reporting_to}
                  onChange={(e) =>
                    handleInputChange(index, "reporting_to", e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                />
                <input
                  placeholder="Employee Id"
                  value={user.employee_id}
                  onChange={(e) =>
                    handleInputChange(index, "employee_id", e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                />
              </div>
            ))}

            <div className="flex justify-end mt-4 gap-2">
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
                  setStep("upload");
                  onClose();
                }}
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
              >
                OK
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddBulkUserModal;
