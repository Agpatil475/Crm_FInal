import React, { useEffect, useState } from "react";
import {
  getPipelines,
  getStages,
  addStage,
  updateStage,
} from "../../services/pipelineService";
import AddStageModal from "../../components/pipeline/AddStageModal";
import { Plus } from "lucide-react";

const Pipelines = () => {
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState(null);
  const [stages, setStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editStageData, setEditStageData] = useState({
    name: "",
    tags: "",
    transitions: [],
  });

  useEffect(() => {
    loadPipelines();
  }, []);

  const loadPipelines = async () => {
    try {
      const { data } = await getPipelines();
      setPipelines(data);
      if (data.length > 0) {
        setSelectedPipelineId(String(data[0].id));
      }
    } catch (err) {
      console.error("Failed to load pipelines:", err);
    }
  };

  useEffect(() => {
    if (!selectedPipelineId || selectedPipelineId === "null") return;
    loadStages(selectedPipelineId);
  }, [selectedPipelineId]);

  const loadStages = async (pipelineId) => {
    try {
      const { data } = await getStages(pipelineId);
      setStages(data);
      setSelectedStage(null);
      setEditStageData({ name: "", tags: "", transitions: [] });
    } catch (err) {
      console.error("Failed to load stages:", err);
    }
  };

  const handleAddStage = async (stageName) => {
    if (!selectedPipelineId || selectedPipelineId === "null") {
      console.error("Pipeline ID is missing. Cannot add stage.");
      return;
    }
    const position = stages.length;
    try {
      await addStage(selectedPipelineId, { name: stageName, position });
      await loadStages(selectedPipelineId);
    } catch (err) {
      console.error("Failed to add stage:", err);
    }
  };

  const handleStageSelect = (stage) => {
    setSelectedStage(stage);
    setEditStageData({
      name: stage.name,
      tags: stage.tags?.join(", ") || "",
      transitions: stage.transitions || [],
    });
  };

  const handleStageUpdate = async () => {
    try {
      const updated = {
        name: editStageData.name,
        tags: editStageData.tags.split(",").map((tag) => tag.trim()),
        transitions: editStageData.transitions,
      };
      await updateStage(selectedPipelineId, selectedStage.id, updated);
      await loadStages(selectedPipelineId);
    } catch (err) {
      console.error("Error saving stage:", err);
    }
  };

  const handleTransitionChange = (transition) => {
    const existing = editStageData.transitions || [];
    const updated = existing.includes(transition)
      ? existing.filter((t) => t !== transition)
      : [...existing, transition];
    setEditStageData({ ...editStageData, transitions: updated });
  };

  return (
    <div className="p-6 w-full">
      <div className="text-xl font-semibold mb-4">Pipeline</div>

      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <span className="font-medium">Select Pipeline:</span>
          <select
            className="border p-2 rounded"
            value={selectedPipelineId || ""}
            onChange={(e) => {
              const selected = e.target.value;
              setSelectedPipelineId(selected !== "null" ? selected : null);
            }}
          >
            <option value="null" disabled>
              Select pipeline
            </option>
            {pipelines.map((pipe) => (
              <option key={pipe.id} value={pipe.id}>
                {pipe.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => alert("Edit pipeline flow coming soon...")}
          className="border px-4 py-2 rounded-full text-sm hover:shadow-md"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 items-start">
        {/* Pipeline Flow */}
        <div className="border p-4 rounded relative">
          {stages.map((stage, idx) => (
            <div key={stage.id} className="relative mb-6">
              <div
                className="p-3 rounded text-center font-medium cursor-pointer bg-purple-100 hover:bg-purple-200"
                onClick={() => handleStageSelect(stage)}
              >
                {stage.name}
              </div>

              {/* Vertical Arrow */}
              {idx !== stages.length - 1 && (
                <div className="flex justify-center my-2">
                  <div className="w-px h-4 bg-gray-400 relative">
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-400"></div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Final Add Button */}
          <div className="flex justify-center py-2">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Stage Editor */}
        <div className="border p-4 rounded">
          <div className="font-semibold mb-2">Edit Stage</div>
          {selectedStage ? (
            <>
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">
                  Stage Name
                </label>
                <input
                  type="text"
                  value={editStageData.name}
                  onChange={(e) =>
                    setEditStageData({ ...editStageData, name: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">Tags</label>
                <input
                  type="text"
                  value={editStageData.tags}
                  onChange={(e) =>
                    setEditStageData({ ...editStageData, tags: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                  placeholder="e.g. hot, cold, warm"
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium">
                  Transitions
                </label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {["Open", "In Progress", "Converted", "Lost"].map((label) => (
                    <label key={label}>
                      <input
                        type="checkbox"
                        checked={editStageData.transitions.includes(label)}
                        onChange={() => handleTransitionChange(label)}
                        className="mr-2"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded"
                  onClick={handleStageUpdate}
                >
                  Save
                </button>
              </div>
            </>
          ) : (
            <div className="text-gray-500">Select a stage to edit</div>
          )}
        </div>
      </div>

      {showModal && (
        <AddStageModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddStage}
        />
      )}
    </div>
  );
};

export default Pipelines;
