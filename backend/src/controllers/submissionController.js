import Submission from "../models/Submission.js";
import Form from "../models/Form.js";

// Submit answers for a form
export const createSubmission = async (req, res) => {
  try {
    const { id: formId } = req.params;
    const { answers, submittedBy = "anonymous" } = req.body;

    // Optional: Check form existence
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ error: "Form not found" });

    const submission = new Submission({ formId, answers, submittedBy });
    await submission.save();

    res.status(201).json({ message: "Submission saved successfully", submission });
  } catch (error) {
    console.error("Create submission error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all submissions for a given form
export const getSubmissionsByFormId = async (req, res) => {
  try {
    const { id: formId } = req.params;
    const submissions = await Submission.find({ formId });
    res.json({ submissions });
  } catch (error) {
    console.error("Get submissions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a single submission by ID
export const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id);
    if (!submission) return res.status(404).json({ error: "Submission not found" });
    res.json({ submission });
  } catch (error) {
    console.error("Get submission by ID error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};