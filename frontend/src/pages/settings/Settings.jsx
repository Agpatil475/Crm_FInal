// /src/pages/settings/Settings.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Users from "./Users";
import Pipelines from "./Pipelines";
import RolesAndPermissions from "./RolesAndPermissions";

const tabs = [
  { label: "Users", value: "users" },
  { label: "Pipelines", value: "pipelines" },
  { label: "Roles & Permissions", value: "roles" },
];

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    return params.get("tab") || "users";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set("tab", activeTab);
    navigate({ search: params.toString() }, { replace: true });
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "users":
        return <Users />;
      case "pipelines":
        return <Pipelines />;
      case "roles":
        return <RolesAndPermissions />;
      default:
        return <Users />;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <div className="flex space-x-4 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`py-2 px-4 text-sm font-medium transition-all ${
              activeTab === tab.value
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-lg shadow p-4">{renderContent()}</div>
    </div>
  );
};

export default Settings;
