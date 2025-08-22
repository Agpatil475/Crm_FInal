import express from "express";
import multer from "multer";
import { uploadContacts } from "../controllers/uploadController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadContacts);
// router.get("/uploaded-files", getUploadedFiles); // To fetch uploaded file data
router.post("/contacts/upload", upload.single("file"), uploadContacts);
export default router;
