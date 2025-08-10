import { z } from "zod";

const questionSchema = z.object({
  type: z.enum(["categorize", "cloze", "comprehension"]),
  text: z.string().min(1, "Question text is required"),
  image: z.string().url().optional(),
  options: z.array(
    z.object({
      text: z.string().min(1),
      value: z.string().min(1),
    })
  ).optional(),
  answer: z.any().optional(),
  extraData: z.any().optional(),
  order: z.number().int().nonnegative(),
}).refine(
  (data) =>
    (data.type === "categorize" || data.type === "comprehension"
      ? data.options && data.options.length > 0
      : true),
  {
    message: "Options are required for categorize and comprehension questions",
    path: ["options"],
  }
);

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  headerImage: z.string().url().optional(),
  questions: z.array(questionSchema).min(1, "At least one question is required"),
});