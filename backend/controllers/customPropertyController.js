import db from "../db.js";
import { v4 as uuidv4 } from "uuid";

// Get all custom contact properties
export const getCustomProperties = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM custom_contact_properties ORDER BY created_at"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

// Add a new custom property
export const addCustomProperty = async (req, res) => {
  const { property_name, data_type } = req.body;
  if (!property_name || !data_type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await db.query(
      "INSERT INTO custom_contact_properties (id, property_name, data_type) VALUES ($1, $2, $3) RETURNING *",
      [uuidv4(), property_name, data_type]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to add property" });
  }
};

// Toggle enable/disable status
export const toggleProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "UPDATE custom_contact_properties SET enabled = NOT enabled WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update property" });
  }
};
