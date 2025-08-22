// /backend/controllers/dashboardController.js
import db from "../db.js";

export const getPinnedCampaigns = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM campaigns ORDER BY id DESC LIMIT 5"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLeadSourceSummary = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM lead_sources");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLeadAnalysis = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM lead_analysis");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCallAnalysis = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM call_analysis");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
