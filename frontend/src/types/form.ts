export type QuestionType = "categorize" | "cloze" | "comprehension";

export interface QuestionOption {
  text: string;
  value: string;
}

export interface Question {
  _id?: string;
  type: QuestionType;
  text: string;
  image?: string;
  options?: QuestionOption[];
  answer?: any; // string, array, or object depending on type
  extraData?: any; // for anything type-specific
  order: number;
}

export interface Form {
  _id?: string;
  title: string;
  description?: string;
  headerImage?: string;
  questions: Question[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Submission {
  _id?: string;
  formId: string;
  answers: {
    questionId: string;
    response: any;
  }[];
  submittedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}