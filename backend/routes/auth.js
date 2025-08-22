import express from "express";
import {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  resetUserPassword,
  toggleUserStatus,
  disableLeadAssignment,
  bulkUploadUsers,
} from "../controllers/authController.js";
import upload from "../middleware/upload.js"; // ✅ Use only this

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/reset-password", resetUserPassword);
router.patch("/users/:id/status", toggleUserStatus);
router.patch("/users/:id/lead-assignment", disableLeadAssignment);

// ✅ Bulk Upload Route (uses middleware upload from /middleware/upload.js)
router.post("/users/bulk-upload", upload.single("file"), bulkUploadUsers);

export default router;
