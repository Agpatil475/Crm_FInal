import express from "express";
import {
  getAllContacts,
  addContact,
  getCampaigns,
  getSources,
} from "../controllers/contactsController.js";
import pool from "../db.js";

const router = express.Router();

router.get("/", getAllContacts);
router.post("/", addContact);
router.get("/campaigns", getCampaigns);
router.get("/sources", getSources);
router.post("/search", async (req, res) => {
  const filters = req.body.filters || {};
  try {
    // Whitelist of valid DB columns
    const allowedColumns = [
      "name",
      "phone",
      "email",
      "location",
      "campaign_id",
      "source",
    ];

    let query = "SELECT * FROM contacts WHERE 1=1";
    const values = [];

    for (const [key, val] of Object.entries(filters)) {
      if (val && val.trim() !== "" && allowedColumns.includes(key)) {
        values.push(`%${val.toLowerCase()}%`);
        query += ` AND LOWER(${key}) LIKE $${values.length}`;
      }
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Search error:", err.message);
    res.status(500).json({ error: err.message });
  }
});
export default router;
