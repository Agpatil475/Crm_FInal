// src/services/customPropertyService.js
import axios from "axios";

export const getEnabledCustomProperties = async () => {
  const res = await axios.get("/api/custom-properties/enabled");
  return res.data;
};
