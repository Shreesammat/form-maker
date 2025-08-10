import express from "express";
import validate from "../middlewares/validate.js";
import submissionSchema from "../schema/submissionSchema.js";
import * as submissionController from "../controllers/submissionController.js";

const router = express.Router();

// Submit answers for a form
router.post("/forms/:id/submissions", validate(submissionSchema), submissionController.createSubmission);

// Get all submissions for a form
router.get("/forms/:id/submissions", submissionController.getSubmissionsByFormId);

// Get a single submission by submission ID
router.get("/:id", submissionController.getSubmissionById);

export default router;