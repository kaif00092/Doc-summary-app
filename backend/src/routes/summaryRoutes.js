import express from "express";
import multer from "multer";

import { generateSummary } from "../controllers/summaryController.js";

const router = express.Router();
//multer handle file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });
//post endpoint for summary
router.post("/summarize", upload.single("document"), generateSummary);

export default router;
