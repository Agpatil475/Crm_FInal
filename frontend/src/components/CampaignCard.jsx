// /frontend/src/components/CampaignCard.jsx
import React from "react";

const CampaignCard = ({ campaign }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 border border-gray-200">
      <h3 className="text-lg font-bold">{campaign.name}</h3>
      <p>Status: {campaign.status}</p>
      <p>Start: {campaign.start_date}</p>
      <p>End: {campaign.end_date}</p>
    </div>
  );
};

export default CampaignCard;
