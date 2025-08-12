import { create } from "zustand";
import type { Form, Question } from "@/types/form";

interface FormStore {
  form: Form;
  setForm: (form: Form) => void;
  updateFormField: <K extends keyof Form>(field: K, value: Form[K]) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: <T extends Partial<Question>>(index: number, updated: T) => void;
  removeQuestion: (index: number) => void;
  resetForm: () => void;
}

// ---------- Default Empty Form ----------
const defaultForm: Form = {
  title: "",
  description: "",
  headerImage: "",
  questions: [],
};

// ---------- Store ----------
export const useFormStore = create<FormStore>((set) => ({
  form: defaultForm,

  setForm: (form) => set({ form }),

  updateFormField: (field, value) =>
    set((state) => ({
      form: {
        ...state.form,
        [field]: value,
      },
    })),

  addQuestion: (question) =>
    set((state) => ({
      form: {
        ...state.form,
        questions: [...state.form.questions, { ...question, order: state.form.questions.length }],
      },
    })),

  updateQuestion: (index, updated) =>
    set((state) => ({
      form: {
        ...state.form,
        questions: state.form.questions.map((q, i) =>
          i === index ? ({ ...q, ...updated } as Question) : q
        ),
      },
    })),

  removeQuestion: (index) =>
    set((state) => ({
      form: {
        ...state.form,
        questions: state.form.questions
          .filter((_, i) => i !== index)
          .map((q, i) => ({ ...q, order: i })),
      },
    })),

  resetForm: () => set({ form: defaultForm }),
}));
