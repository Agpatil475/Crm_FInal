import db from "../db.js";
import { v4 as uuidv4 } from "uuid";

// GET all contacts
export const getAllContacts = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM contacts ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

// POST add contact
export const addContact = async (req, res) => {
  const { name, phone, email, location, campaign_id, source, created_by } =
    req.body;
  try {
    const id = uuidv4();
    await db.query(
      `INSERT INTO contacts (id, name, phone, email, location, campaign_id, source, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id, name, phone, email, location, campaign_id, source, created_by]
    );
    res.status(201).json({ message: "Contact added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add contact" });
  }
};

// GET campaigns
export const getCampaigns = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name FROM campaigns WHERE status = TRUE"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};

// GET sources
export const getSources = async (req, res) => {
  try {
    const result = await db.query("SELECT label FROM contact_sources");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sources" });
  }
};
