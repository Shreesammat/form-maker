import Form from '../models/Form.js'
import Submission from '../models/Submission.js'

export const createForm = async (req, res) => {
    try {
        const form = new Form(req.body);
        await form.save();
        res.status(201)
            .json({
                message: "Form created successfully!"
            })
    } catch (error) {
        res.status(500)
            .json({
                error: "Internal server error!" 
            })
    }
};

export const getAllForms = async (req, res) => {
    try {
        const forms = await Form.find().select("title description createdAt updatedAt");
        res.json({
            forms
        })
    }
    catch (error) {
        res.status(500)
            .json({
                error: "Internal Server Error!"
            })
    }
};

export const getFormById = async (req, res) => {
    try {
        const {id} = req.params;
        const form = await Form.findById(id);

        if(!form) return res.status(404).json({error: "Form not found."})
        res.status(200)
            .json({
                form
            })

    } catch (error) {
        res.status(500)
            .json({
                error: "Internal Server Error!"
            })
    }
};

// Update form by ID
export const updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedForm = await Form.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedForm) return res.status(404).json({ error: "Form not found" });
    res.json({ message: "Form updated successfully", form: updatedForm });
  } catch (error) {
    console.error("Update form error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete form by ID (optionally delete related submissions)
export const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;
    const form = await Form.findByIdAndDelete(id);
    if (!form) return res.status(404).json({ error: "Form not found" });

    // Optional: Delete related submissions
    await Submission.deleteMany({ formId: id });

    res.json({ message: "Form and related submissions deleted successfully" });
  } catch (error) {
    console.error("Delete form error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};