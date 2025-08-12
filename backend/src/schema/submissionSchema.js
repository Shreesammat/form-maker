import {z} from 'zod'

const submissionSchema = z.object({
  formId: z.string().min(1, "formId is required"),  // ObjectId as string
  answers: z.array(
    z.object({
      questionId: z.string().min(1, "questionId is required"),  // ObjectId as string
      response: z.any()
    })
  ).min(1, "At least one answer is required"),
  submittedBy: z.string().optional().default("anonymous")
});

export default submissionSchema