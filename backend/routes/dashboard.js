// /backend/routes/dashboard.js
import express from "express";
import {
  getPinnedCampaigns,
  getLeadSourceSummary,
  getLeadAnalysis,
  getCallAnalysis,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/campaigns", getPinnedCampaigns);
router.get("/lead-sources", getLeadSourceSummary);
router.get("/lead-analysis", getLeadAnalysis);
router.get("/call-analysis", getCallAnalysis);

export default router;
