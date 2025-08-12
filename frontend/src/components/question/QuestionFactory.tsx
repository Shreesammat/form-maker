import { CategorizeQuestion } from "./CategorizeQuestion";
import { ClozeQuestion } from "./ClozeQuestion";
import { ComprehensionQuestion } from "./comprehensionQuestion";
import type { Question } from "@/types/form";

interface QuestionFactoryProps {
  question: Question;
  onUpdate: (question: Question) => void;
  editable?: boolean;
}

export function QuestionFactory({ question, onUpdate, editable = true }: QuestionFactoryProps) {
  switch (question.type) {
    case "categorize":
      return (
        <CategorizeQuestion
          question={question}
          onUpdate={onUpdate}
          editable={editable}
        />
      );
    case "cloze":
      return (
        <ClozeQuestion
          question={question}
          onUpdate={onUpdate}
          editable={editable}
        />
      );
    case "comprehension":
      return (
        <ComprehensionQuestion
          question={question}
          onUpdate={onUpdate}
          editable={editable}
        />
      );
    default:
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
          <p className="text-red-600">Unknown question type: {question.type}</p>
        </div>
      );
  }
}
