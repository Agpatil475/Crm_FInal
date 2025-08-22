// /frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import CampaignCard from "../components/CampaignCard";
import {
  getCampaigns,
  getLeadSources,
  getLeadAnalysis,
  getCallAnalysis,
} from "../services/dashboardAPI";

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [leadAnalysis, setLeadAnalysis] = useState([]);
  const [callAnalysis, setCallAnalysis] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setCampaigns(await getCampaigns());
      setLeadSources(await getLeadSources());
      setLeadAnalysis(await getLeadAnalysis());
      setCallAnalysis(await getCallAnalysis());
    };
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <span role="img" aria-label="dashboard">
          📊
        </span>{" "}
        Admin Dashboard
      </h1>

      {/* 📌 Campaigns */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-pink-600 mb-4">
          📌 Pinned Campaigns
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      </section>

      {/* 🎯 Lead Sources */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-orange-600 mb-2">
          🎯 Lead Source Summary
        </h2>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <ul className="list-disc pl-6 space-y-1">
            {leadSources.map((l) => (
              <li key={l.id}>
                {l.source_name}:{" "}
                <span className="font-medium">{l.total_leads} leads</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 📈 Lead Analysis */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-purple-600 mb-2">
          📈 Lead Analysis
        </h2>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <ul className="list-disc pl-6 space-y-1">
            {leadAnalysis.map((l) => (
              <li key={l.id}>
                {l.metric_name}: <span className="font-medium">{l.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 📞 Call Analysis */}
      <section>
        <h2 className="text-2xl font-semibold text-red-600 mb-2">
          📞 Call Analysis
        </h2>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <ul className="list-disc pl-6 space-y-1">
            {callAnalysis.map((c) => (
              <li key={c.id}>
                {c.type}: <span className="font-medium">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
