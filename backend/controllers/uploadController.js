import XLSX from "xlsx";
import pool from "../db.js";
import { v4 as uuidv4 } from "uuid";

export const uploadContacts = async (req, res) => {
  try {
    const {
      campaign,
      pipeline,
      mappedFields,
      leadDuplicacy,
      followUp,
      assignTo,
    } = req.body;

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // 🔍 Get UUID from name
    const campaignQuery = await pool.query(
      `SELECT id FROM campaigns WHERE name = $1 LIMIT 1`,
      [campaign]
    );
    const campaignId = campaignQuery.rows[0]?.id;

    const pipelineQuery = await pool.query(
      `SELECT id FROM pipelines WHERE name = $1 LIMIT 1`,
      [pipeline]
    );
    const pipelineId = pipelineQuery.rows[0]?.id;

    if (!campaignId || !pipelineId) {
      return res
        .status(400)
        .json({ error: "Invalid campaign or pipeline selected" });
    }

    for (const row of sheet) {
      const id = uuidv4();
      const name = row[mappedFields.name];
      const phone = row[mappedFields.phone];
      const altPhone = row[mappedFields.alt_phone] || null;
      const email = row[mappedFields.email] || null;
      const location = row[mappedFields.location] || null;

      await pool.query(
        `INSERT INTO contacts 
         (id, name, phone, alt_phone, email, location, campaign_id, pipeline_id, lead_duplicacy, follow_up_days, assigned_to)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [
          id,
          name,
          phone,
          altPhone,
          email,
          location,
          campaignId,
          pipelineId,
          leadDuplicacy,
          followUp,
          assignTo,
        ]
      );
    }

    return res.status(200).json({ message: "Contacts uploaded successfully" });
  } catch (err) {
    console.error("Upload Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
