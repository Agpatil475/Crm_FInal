import React, { useState } from "react";

const AddStageModal = ({ onClose, onSubmit }) => {
  const [stageName, setStageName] = useState("");

  const handleSubmit = () => {
    if (stageName.trim()) {
      onSubmit(stageName);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[350px] shadow-xl">
        <h3 className="text-lg font-bold mb-4">Add Stage</h3>
        <input
          type="text"
          value={stageName}
          onChange={(e) => setStageName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          placeholder="Enter stage name"
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-500">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStageModal;
