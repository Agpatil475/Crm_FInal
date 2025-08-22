import axios from "axios";

// If using hardcoded URL
const BASE_URL = "http://localhost:5000/api/pipelines";

export const getPipelines = () => axios.get(BASE_URL);

export const createPipeline = (data) => axios.post(BASE_URL, data);

export const getStages = (pipelineId) => {
  if (!pipelineId) {
    return Promise.reject(new Error("Pipeline ID is required"));
  }
  return axios.get(`${BASE_URL}/${pipelineId}/stages`);
};

export const addStage = (pipelineId, data) => {
  if (!pipelineId) {
    return Promise.reject(new Error("Pipeline ID is required"));
  }
  return axios.post(`${BASE_URL}/${pipelineId}/stages`, data);
};

// ✅ NEW: Export this function to allow stage editing
export const updateStage = (pipelineId, stageId, data) => {
  if (!pipelineId || !stageId) {
    return Promise.reject(new Error("Pipeline ID and Stage ID are required"));
  }
  return axios.put(`${BASE_URL}/${pipelineId}/stages/${stageId}`, data);
};
