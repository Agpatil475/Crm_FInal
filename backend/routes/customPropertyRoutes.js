// backend/routes/customPropertyRoutes.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// GET all properties
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM custom_contact_properties ORDER BY created_at ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching custom properties:", err.message);
    res.status(500).send("Server error");
  }
});

// ADD a new property
router.post("/", async (req, res) => {
  const { name, label, field_type } = req.body;
  if (!name || !label || !field_type) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO custom_contact_properties (name, label, field_type, is_enabled)
       VALUES ($1, $2, $3, true) RETURNING *`,
      [name, label, field_type]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Insert Error:", err.message);
    res.status(500).send("Insert failed");
  }
});

// TOGGLE on/off
router.put("/:id/toggle", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `UPDATE custom_contact_properties
       SET is_enabled = NOT is_enabled
       WHERE id = $1 RETURNING *`,
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Toggle Error:", err.message);
    res.status(500).send("Toggle failed");
  }
});

export default router;
