// /backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../db.js";
import dotenv from "dotenv";
import multer from "multer";
import * as XLSX from "xlsx";
import pool from "../db.js";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const upload = multer({ storage: multer.memoryStorage() });

export const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  const offset = (page - 1) * limit;

  try {
    const result = await db.query(
      `SELECT * FROM users WHERE name ILIKE $1 OR email ILIKE $1 ORDER BY id ASC LIMIT $2 OFFSET $3`,
      [`%${search}%`, limit, offset]
    );
    const countResult = await db.query(
      `SELECT COUNT(*) FROM users WHERE name ILIKE $1 OR email ILIKE $1`,
      [`%${search}%`]
    );
    res
      .status(200)
      .json({ users: result.rows, total: parseInt(countResult.rows[0].count) });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    role,
    mobile_number,
    status,
    reporting_to,
    expiry_date,
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE users SET name = $1, email = $2, role = $3, mobile_number = $4, status = $5, reporting_to = $6, expiry_date = $7 WHERE id = $8 RETURNING *`,
      [name, email, role, mobile_number, status, reporting_to, expiry_date, id]
    );
    res.status(200).json({ message: "User updated", user: result.rows[0] });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM users WHERE id = $1", [id]);
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};
// Register new user
export const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    mobile_number,
    reporting_to,
    expiry_date,
  } = req.body;

  try {
    if (!name || !password || !role) {
      return res
        .status(400)
        .json({ error: "Name, password and role are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users 
       (name, email, password, role, mobile_number, reporting_to, expiry_date, status, lead_assignment_enabled, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'Active', true, NOW())
       RETURNING *`,
      [
        name,
        email || null,
        hashedPassword,
        role,
        mobile_number || null,
        reporting_to || null,
        expiry_date || null,
      ]
    );

    res.status(201).json({ message: "User created", user: result.rows[0] });
  } catch (err) {
    console.error("❌ Register Error:", err.message);
    res.status(500).json({
      error: "Server error during registration",
      details: err.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRes = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = userRes.rows[0];

    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const resetUserPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      id,
    ]);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
};

// TOGGLE USER STATUS
export const toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'Active' or 'Inactive'

  try {
    await db.query("UPDATE users SET status = $1 WHERE id = $2", [status, id]);
    res.status(200).json({ message: `User status updated to ${status}` });
  } catch (error) {
    console.error("Toggle Status Error:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
};

// DISABLE LEAD ASSIGNMENT
export const disableLeadAssignment = async (req, res) => {
  const { id } = req.params;
  const { lead_assignment_enabled } = req.body; // boolean

  try {
    await db.query(
      "UPDATE users SET lead_assignment_enabled = $1 WHERE id = $2",
      [lead_assignment_enabled, id]
    );
    res.status(200).json({ message: "Lead assignment setting updated" });
  } catch (error) {
    console.error("Disable Lead Assignment Error:", error);
    res.status(500).json({ error: "Failed to update lead assignment setting" });
  }
};

// BULK UPLOAD USERS
export const bulkUploadUsers = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const response = [];

    for (const row of data) {
      const {
        user_name,
        mobile_number,
        user_password,
        role,
        email,
        employee_id,
        reporting_to,
        expiry_date,
      } = row;

      try {
        const hashedPassword = await bcrypt.hash(user_password, 10);

        const result = await pool.query(
          `INSERT INTO users (name, mobile_number, password, role, email, employee_id, reporting_to, expiry_date, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Active') RETURNING *`,
          [
            user_name,
            mobile_number,
            hashedPassword,
            role,
            email || null,
            employee_id || null,
            reporting_to || null,
            expiry_date || null,
          ]
        );

        response.push({
          name: user_name,
          mobile_number,
          role,
          status: "Success",
          description: "User created successfully",
        });
      } catch (err) {
        response.push({
          name: user_name,
          mobile_number,
          role,
          status: "Failed",
          description: "User already exists or registration error",
        });
      }
    }

    res.json({ status: "done", results: response });
  } catch (err) {
    console.error("Bulk Upload Error:", err);
    res.status(500).json({ error: "Server error during bulk upload" });
  }
};
