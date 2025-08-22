import React, { useState } from "react";
import axios from "axios";
import { X, Upload, ArrowLeft, ArrowRight, Video } from "lucide-react";

const UploadContactsModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [campaignOption, setCampaignOption] = useState("existing");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedPipeline, setSelectedPipeline] = useState("");
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [mappedFields, setMappedFields] = useState({
    name: "",
    phone: "",
    alt_phone: "",
    email: "",
    location: "",
  });
  const [additionalSettings, setAdditionalSettings] = useState({
    leadDuplicacy: "",
    followUp: "",
    assignToUser: "",
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const XLSX = await import("xlsx");
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        setHeaders(json[0]); // first row contains headers
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleFieldChange = (field, value) => {
    setMappedFields((prev) => ({ ...prev, [field]: value }));
  };

  const handleSettingChange = (key, value) => {
    setAdditionalSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("campaign", selectedCampaign);
    formData.append("pipeline", selectedPipeline);
    formData.append("mappedFields", JSON.stringify(mappedFields));
    formData.append("user", "admin"); // optional
    formData.append("settings", JSON.stringify(additionalSettings));

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData
      );
      alert(res.data.message || "Upload successful");
      setStep(5);
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Upload failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 shadow-xl w-[650px] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <X />
        </button>
        <h2 className="text-xl font-semibold text-purple-700 mb-4 flex items-center gap-2">
          Upload Leads
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Video size={14} />
            Learn More
          </span>
        </h2>

        {/* Step 1: Upload File */}
        {step === 1 && (
          <>
            <div className="border-2 border-dashed border-purple-400 rounded p-6 mb-4 text-center">
              <p className="text-purple-600 font-medium mb-2">
                Drag and drop file
              </p>
              <input
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={handleFileUpload}
              />
              <p className="text-sm text-gray-500">
                Supported: .csv, .xls, .xlsx
              </p>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Max 25,000 leads. File ≤ 3MB
            </p>
            <div className="text-right">
              <button
                disabled={!selectedFile}
                onClick={() => setStep(2)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Next <ArrowRight className="inline ml-1" size={14} />
              </button>
            </div>
          </>
        )}

        {/* Step 2: Campaign & Pipeline */}
        {step === 2 && (
          <>
            <div className="flex gap-4 mb-4">
              <button
                className={`flex-1 px-4 py-2 border rounded ${
                  campaignOption === "existing"
                    ? "bg-purple-100 border-purple-400"
                    : "border-gray-300"
                }`}
                onClick={() => setCampaignOption("existing")}
              >
                Add to Existing Campaign
              </button>
              <button
                className={`flex-1 px-4 py-2 border rounded ${
                  campaignOption === "new"
                    ? "bg-purple-100 border-purple-400"
                    : "border-gray-300"
                }`}
                onClick={() => setCampaignOption("new")}
              >
                Create New Campaign
              </button>
            </div>
            <label className="block mb-2 text-sm">Select Campaign</label>
            <input
              className="w-full border px-3 py-2 rounded mb-4"
              placeholder="Enter campaign name"
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
            />
            <label className="block mb-2 text-sm">Select Pipeline</label>
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Enter pipeline"
              value={selectedPipeline}
              onChange={(e) => setSelectedPipeline(e.target.value)}
            />
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(1)}
                className="text-purple-700 flex items-center"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                disabled={!selectedCampaign || !selectedPipeline}
                onClick={() => setStep(3)}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Next <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
          </>
        )}

        {/* Step 3: Map Fields */}
        {step === 3 && (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Simply select the columns in your file for these details
            </p>
            {Object.keys(mappedFields).map((field) => (
              <div key={field} className="mb-4">
                <label className="block mb-1 capitalize text-sm text-gray-700">
                  {field.replace("_", " ")}
                </label>
                <select
                  value={mappedFields[field]}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select column</option>
                  {headers.map((header, index) => (
                    <option key={index} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Additional Settings */}
            <div className="mt-6 border-t pt-4">
              <h4 className="font-semibold text-sm mb-2">
                Additional Settings
              </h4>

              <label className="block text-sm mb-1">Lead Duplicacy</label>
              <select
                className="w-full border px-3 py-2 rounded mb-3"
                value={additionalSettings.leadDuplicacy}
                onChange={(e) =>
                  handleSettingChange("leadDuplicacy", e.target.value)
                }
              >
                <option value="">Select</option>
                <option value="ignore">Ignore Duplicate (Default)</option>
                <option value="merge">Merge Duplicate</option>
                <option value="create">Create Duplicate Leads</option>
                <option value="merge_reopen">
                  Merge & Reopen Closed Leads
                </option>
              </select>

              <label className="block text-sm mb-1">Set Follow-up</label>
              <input
                className="w-full border px-3 py-2 rounded mb-3"
                value={additionalSettings.followUp}
                onChange={(e) =>
                  handleSettingChange("followUp", e.target.value)
                }
              />

              <label className="block text-sm mb-1">Assign to User</label>
              <input
                className="w-full border px-3 py-2 rounded"
                value={additionalSettings.assignToUser}
                onChange={(e) =>
                  handleSettingChange("assignToUser", e.target.value)
                }
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(2)}
                className="text-purple-700 flex items-center"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                onClick={handleSubmit}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center"
              >
                <Upload size={16} className="mr-1" /> Submit
              </button>
            </div>
          </>
        )}

        {/* Step 4: Done */}
        {step === 5 && (
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              Upload Complete
            </h3>
            <p className="text-gray-600">
              Leads uploaded and saved successfully.
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadContactsModal;
