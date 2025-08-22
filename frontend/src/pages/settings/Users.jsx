import React, { useEffect, useState } from "react";
import axios from "axios";
import EditUserModal from "../../components/EditUserModal";
import UserActionMenu from "../../components/UserActionMenu";
import AddUserModal from "../../components/AddUserModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [paginatedUsers, setPaginatedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [menuUser, setMenuUser] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/users?search=${search}`
      );
      if (Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error("Fetch Users Error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  useEffect(() => {
    const start = (currentPage - 1) * itemsPerPage;
    setPaginatedUsers(users.slice(start, start + itemsPerPage));
  }, [users, currentPage]);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
    setMenuUser(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/auth/users/${id}`);
        fetchUsers(); // Refresh list
      } catch (error) {
        console.error("Delete failed", error);
        alert("Failed to delete user.");
      }
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = prompt("Enter new password:");
    if (newPassword) {
      await axios.patch(`/api/auth/users/${id}/reset-password`, {
        newPassword,
      });
      alert("Password reset successfully");
    }
  };

  const handleToggleStatus = async (user) => {
    await axios.patch(`/api/auth/users/${user.id}/status`, {
      status: user.status === "Active" ? "Inactive" : "Active",
    });
    fetchUsers();
  };

  const handleToggleLeadAssignment = async (user) => {
    await axios.patch(`/api/auth/users/${user.id}/lead-assignment`, {
      lead_assignment_enabled: !user.lead_assignment_enabled,
    });
    fetchUsers();
  };

  return (
    <div className="p-6 w-full max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-purple-800">Users</h2>
          <p className="text-sm text-gray-500">
            Manage your team with user creation and user deactivation or
            deletion.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchUsers()} // refresh
            className="px-4 py-2 rounded text-purple-700 border border-purple-500 hover:bg-purple-50"
          >
            🔄 Refresh
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)} // single unified Add User button
            className="px-4 py-2 rounded bg-purple-700 text-white hover:bg-purple-800"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-md px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/* Table */}
      <div className="rounded border overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-purple-100 text-purple-800">
            <tr>
              <th className="px-4 py-2 border">No.</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Mobile Number</th>
              <th className="px-4 py-2 border">Reporting To</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Role</th>
              <th className="px-4 py-2 border">Expiry Date</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 text-gray-700">
                  <td className="px-4 py-2 border">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-2 border">{user.name}</td>
                  <td className="px-4 py-2 border">
                    {user.mobile_number || "—"}
                  </td>
                  <td className="px-4 py-2 border">
                    {user.reporting_to || "—"}
                  </td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">{user.role}</td>
                  <td className="px-4 py-2 border">
                    {user.expiry_date
                      ? new Intl.DateTimeFormat("en-GB").format(
                          new Date(user.expiry_date)
                        )
                      : "—"}
                  </td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
                        user.status === "Active"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMenuPosition({
                          x: rect.left,
                          y: rect.bottom + window.scrollY,
                        });
                        setMenuUser(user);
                      }}
                      className="text-lg font-bold px-2 hover:bg-gray-200 rounded"
                    >
                      ⋮
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Page {currentPage} of {Math.ceil(users.length / itemsPerPage) || 1}
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage >= Math.ceil(users.length / itemsPerPage)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Floating Menu */}
      {menuUser && (
        <UserActionMenu
          user={menuUser}
          position={menuPosition}
          onClose={() => setMenuUser(null)}
          onAction={(action, user) => {
            setMenuUser(null);
            if (action === "edit") handleEdit(user);
            if (action === "status") handleToggleStatus(user);
            if (action === "reset") handleResetPassword(user.id);
            if (action === "lead") handleToggleLeadAssignment(user);
            if (action === "delete") handleDelete(user.id);
          }}
        />
      )}

      {/* Edit Modal */}
      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        userData={selectedUser}
        onUserUpdated={fetchUsers}
      />
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={fetchUsers}
      />
    </div>
  );
};

export default Users;
