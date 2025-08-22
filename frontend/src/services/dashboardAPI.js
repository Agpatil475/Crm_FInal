// /frontend/src/services/dashboardAPI.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/dashboard";

export const getCampaigns = async () => {
  const res = await axios.get(`${BASE_URL}/campaigns`);
  return res.data;
};

export const getLeadSources = async () => {
  const res = await axios.get(`${BASE_URL}/lead-sources`);
  return res.data;
};

export const getLeadAnalysis = async () => {
  const res = await axios.get(`${BASE_URL}/lead-analysis`);
  return res.data;
};

export const getCallAnalysis = async () => {
  const res = await axios.get(`${BASE_URL}/call-analysis`);
  return res.data;
};
