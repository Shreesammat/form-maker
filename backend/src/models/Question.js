import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true
  },
  type: {
    type: String,
    enum: ["categorize", "cloze", "comprehension"],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  image: {
    type: String // Cloudinary URL
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // Flexible JSON structure for each type
    required: true
  },
  order: {
    type: Number,
    required: true
  }
});

const Question = mongoose.model("Question", questionSchema);
export default Question;