import express from "express";
import validate from "../middlewares/validate.js";
import { formSchema } from "../schema/formSchema.js";
import * as formController from "../controllers/formController.js";

const router = express.Router();

// Create a new form
router.post("/", validate(formSchema), formController.createForm);

// Get all forms (list)
router.get("/", formController.getAllForms);

// Get single form by ID (with questions)
router.get("/:id", formController.getFormById);

// Update form by ID
router.put("/:id", validate(formSchema), formController.updateForm);

// Delete form by ID (optionally delete related submissions)
router.delete("/:id", formController.deleteForm);

export default router;