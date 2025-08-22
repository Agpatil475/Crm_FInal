import express from "express";
import {
  getPipelines,
  createPipeline,
  getStages,
  addStage,
} from "../controllers/pipelineController.js";

const router = express.Router();

router.get("/", getPipelines);
router.post("/", createPipeline);
router.get("/:pipelineId/stages", getStages);
router.post("/:pipelineId/stages", addStage);

export default router;
