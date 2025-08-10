import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["categorize", "cloze", "comprehension"]
  },
  text: {
    type: String,
    required: true
  },
  image: {
    type: String // Cloudinary URL if needed
  },
  options: [
    {
      text: String,
      value: String
    }
  ],
  answer: mongoose.Schema.Types.Mixed, // string, array, or object depending on type
  extraData: mongoose.Schema.Types.Mixed, // for anything type-specific
  order: {
    type: Number,
    required: true
  }
}, { _id: true });

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  headerImage: {
    type: String // Cloudinary URL
  },
  questions: [questionSchema]
}, { timestamps: true });

const Form = mongoose.model("Form", formSchema);
export default Form;