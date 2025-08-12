import express from "express";
import * as uploadController from "../controllers/uploadController.js";

const router = express.Router();

router.post("/upload", uploadController.uploadImage);

export default router;