import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
      },
      response: mongoose.Schema.Types.Mixed // Could be string, array, or object
    }
  ],
  submittedBy: {
    type: String, // optional: could be email, user ID, or "anonymous"
    default: "anonymous"
  },
}, {timestamps: true});

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
