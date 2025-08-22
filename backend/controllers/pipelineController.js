import db from "../db.js";

export const getPipelines = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM pipelines");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createPipeline = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO pipelines (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStages = async (req, res) => {
  const pipelineId = req.params.pipelineId;
  try {
    const result = await db.query(
      "SELECT * FROM stages WHERE pipeline_id = $1 ORDER BY position ASC",
      [pipelineId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addStage = async (req, res) => {
  const { pipelineId } = req.params;
  const { name, position } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO stages (pipeline_id, name, position) VALUES ($1, $2, $3) RETURNING *",
      [pipelineId, name, position]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
