"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { apiService } from "@/lib/api";
import type { Form, Question } from "@/types/form";

// sub-answers map for comprehension-type answers (indexed by subQ.id)
type SubAnswerMap = Record<string, string | string[] | number | boolean>;

// an answer can be a simple string, an array (cloze/multi), or a sub-answer map
type AnswerValue = string | string[] | SubAnswerMap;

type SubQuestion = {
  id: string;
  text: string;
  type: "text" | "multiple_choice" | "checkbox";
  options?: string[];
  required?: boolean;
};

export default function FormFillPage() {
  const { id } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadForm(id);
    }
  }, [id]);

  const loadForm = async (formId: string) => {
    try {
      setIsLoading(true);
      const loadedForm = await apiService.getFormById(formId);
      setForm(loadedForm);
    } catch (error) {
      console.error("Failed to load form:", error);
      alert("Failed to load form");
    } finally {
      setIsLoading(false);
    }
  };

  const updateAnswer = (questionId: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    if (!form) return false;

    const newErrors: Record<string, string> = {};

    form.questions.forEach((question) => {
      const questionId = question._id || "";
      const answer = answers[questionId];

      if (question.type === "comprehension" && question.extraData?.subQuestions) {
        const subQuestions = question.extraData.subQuestions as SubQuestion[];
        // ensure answer is a map before indexing into it
        const isMap =
          answer !== undefined &&
          answer !== null &&
          typeof answer === "object" &&
          !Array.isArray(answer);
        const map = (isMap ? (answer as SubAnswerMap) : undefined) ?? {};

        subQuestions.forEach((subQ: SubQuestion) => {
          const subQuestionId = `${questionId}-${subQ.id}`;
          const subAnswer = map[subQ.id];
          if (subQ.required && (!subAnswer || (typeof subAnswer === "string" && subAnswer.trim() === ""))) {
            newErrors[subQuestionId] = "This field is required";
          }
        });
      } else {
        // For other question types, check if required
        if (
          answer === undefined ||
          answer === null ||
          (Array.isArray(answer) && answer.length === 0) ||
          (typeof answer === "string" && answer.trim() === "")
        ) {
          newErrors[questionId] = "This field is required";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async () => {
    if (!form || !validateForm()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const submissionData = {
        answers: Object.entries(answers).map(([questionId, response]) => ({
          questionId,
          response,
        })),
        submittedBy: "anonymous",
      };

      await apiService.createSubmission(form._id!, submissionData);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit form:", error);
      alert("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCategorizeQuestion = (question: Question, index: number) => {
    const categories = question.extraData?.categories || [];
    const items = question.extraData?.items || [];
    const questionId = question._id || "";
    const hasError = !!errors[questionId];

    return (
      <Card key={questionId} className={`mb-6 ${hasError ? "border-red-300" : ""}`}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {index + 1}. {question.text}
              </h3>
              {question.image && (
                <img src={question.image} alt="Question" className="w-full max-h-48 object-cover rounded-lg mt-3" />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Categories:</h4>
                <div className="space-y-2">
                  {categories.map((category: string, catIndex: number) => (
                    <div key={catIndex} className="p-3 bg-blue-50 rounded-lg border">
                      {category}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Items to categorize:</h4>
                <div className="space-y-2">
                  {items.map((item: string, itemIndex: number) => (
                    <div key={itemIndex} className="p-3 bg-gray-50 rounded-lg border border-dashed">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {hasError && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors[questionId]}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderClozeQuestion = (question: Question, index: number) => {
    const text = question.extraData?.text || "";
    const questionId = question._id || "";
    const hasError = !!errors[questionId];

    const parts = text.split(/\{\d+\}/);
    const blankIndices: number[] = [];
    const regex = /\{(\d+)\}/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      blankIndices.push(parseInt(match[1]));
    }

    return (
      <Card key={questionId} className={`mb-6 ${hasError ? "border-red-300" : ""}`}>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {index + 1}. {question.text}
              </h3>
              {question.image && (
                <img src={question.image} alt="Question" className="w-full max-h-48 object-cover rounded-lg mt-3" />
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-wrap items-center gap-2">
                {parts.map((part: string, partIndex: number) => (
                  <span key={partIndex}>
                    {part}
                    {blankIndices[partIndex] !== undefined && (
                      <Input
                        className="inline-block w-20 h-8 mx-1"
                        placeholder={`Blank ${blankIndices[partIndex]}`}
                        value={
                          // treat answers[questionId] as array for cloze
                          ((answers[questionId] as string[])?.[blankIndices[partIndex] - 1]) || ""
                        }
                        onChange={(e) => {
                          const currentAnswers = (answers[questionId] as string[]) || [];
                          const newAnswers = [...currentAnswers];
                          newAnswers[blankIndices[partIndex] - 1] = e.target.value;
                          updateAnswer(questionId, newAnswers);
                        }}
                      />
                    )}
                  </span>
                ))}
              </div>
            </div>

            {hasError && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors[questionId]}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderComprehensionQuestion = (question: Question, index: number) => {
    const passage = question.extraData?.passage || "";
    const subQuestions = (question.extraData?.subQuestions as SubQuestion[]) || [];
    const questionId = question._id || "";

    return (
      <Card key={questionId} className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {index + 1}. {question.text}
              </h3>
              {question.image && (
                <img src={question.image} alt="Question" className="w-full max-h-48 object-cover rounded-lg mt-3" />
              )}
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-2">Passage:</h4>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="whitespace-pre-wrap">{passage}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Questions:</h4>
              <div className="space-y-4">
                {subQuestions.map((subQ: SubQuestion, subIndex: number) => {
                  const subQuestionId = `${questionId}-${subQ.id}`;
                  const hasError = !!errors[subQuestionId];

                  // safely get the sub-answer map for this question
                  const answer = answers[questionId];
                  const isMap =
                    answer !== undefined &&
                    answer !== null &&
                    typeof answer === "object" &&
                    !Array.isArray(answer);
                  const map = (isMap ? (answer as SubAnswerMap) : undefined) ?? {};

                  return (
                    <div key={subQ.id} className="p-3 border rounded-lg">
                      <p className="font-medium mb-2">
                        {subIndex + 1}. {subQ.text}
                      </p>

                      {subQ.type === "multiple_choice" && subQ.options && (
                        <RadioGroup
                          value={(map[subQ.id] as string) || ""}
                          onValueChange={(value) => {
                            const currentAnswers = (answers[questionId] as SubAnswerMap) || {};
                            updateAnswer(questionId, { ...currentAnswers, [subQ.id]: value });
                          }}
                        >
                          {subQ.options.map((option: string, optIndex: number) => (
                            <div key={optIndex} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`${subQuestionId}-${optIndex}`} />
                              <Label htmlFor={`${subQuestionId}-${optIndex}`} className="text-sm font-normal">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      )}

                      {subQ.type === "checkbox" && subQ.options && (
                        <div className="space-y-2">
                          {subQ.options.map((option: string, optIndex: number) => {
                            const currentSelections = (map[subQ.id] as string[]) || [];
                            const checked = currentSelections.includes(option);
                            return (
                              <div key={optIndex} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`${subQuestionId}-${optIndex}`}
                                  checked={checked}
                                  onChange={(e) => {
                                    const currentAnswers = (answers[questionId] as SubAnswerMap) || {};
                                    const currentSelections = (currentAnswers[subQ.id] as string[]) || [];
                                    const newSelections = e.target.checked
                                      ? [...currentSelections, option]
                                      : currentSelections.filter((sel) => sel !== option);
                                    updateAnswer(questionId, { ...currentAnswers, [subQ.id]: newSelections });
                                  }}
                                />
                                <Label htmlFor={`${subQuestionId}-${optIndex}`} className="text-sm font-normal">
                                  {option}
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {subQ.type === "text" && (
                        <Input
                          type="text"
                          placeholder="Your answer"
                          value={(map[subQ.id] as string) || ""}
                          onChange={(e) => {
                            const currentAnswers = (answers[questionId] as SubAnswerMap) || {};
                            updateAnswer(questionId, { ...currentAnswers, [subQ.id]: e.target.value });
                          }}
                          className={hasError ? "border-red-300 focus:border-red-500" : ""}
                        />
                      )}

                      {hasError && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm mt-2">
                          <AlertCircle className="w-4 h-4" />
                          <span>{errors[subQuestionId]}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderQuestion = (question: Question, index: number) => {
    switch (question.type) {
      case "categorize":
        return renderCategorizeQuestion(question, index);
      case "cloze":
        return renderClozeQuestion(question, index);
      case "comprehension":
        return renderComprehensionQuestion(question, index);
      default:
        return (
          <Card key={question._id} className="mb-6">
            <CardContent className="pt-6">
              <p className="text-red-600">Unknown question type: {question.type}</p>
            </CardContent>
          </Card>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Form not found</h2>
              <p className="text-gray-600 mb-4">The form you're looking for doesn't exist or has been removed.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h2>
              <p className="text-gray-600 mb-4">Your response has been submitted successfully.</p>
              <p className="text-sm text-gray-500">You can now close this page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate progress more accurately
  const totalQuestions = form.questions.length;
  const answeredQuestions = form.questions.filter((question) => {
    const questionId = question._id || "";
    const answer = answers[questionId];

    if (question.type === "comprehension" && question.extraData?.subQuestions) {
      const subQuestions = question.extraData.subQuestions as SubQuestion[];
      const isMap =
        answer !== undefined && answer !== null && typeof answer === "object" && !Array.isArray(answer);
      const map = (isMap ? (answer as SubAnswerMap) : undefined) ?? {};
      return subQuestions.every((subQ) => {
        const subAnswer = map[subQ.id];
        return subAnswer && (typeof subAnswer !== "string" || subAnswer.trim() !== "");
      });
    }

    return answer && (typeof answer !== "string" || answer.trim() !== "");
  }).length;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Form Header */}
      <Card className="mb-8 border-t-4 border-t-blue-500">
        <CardHeader>
          <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
          {form.description && <p className="text-gray-600 mt-2">{form.description}</p>}
          {form.headerImage && (
            <img src={form.headerImage} alt="Header" className="w-full max-h-64 object-cover rounded-lg mt-4" />
          )}
        </CardHeader>
      </Card>

      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Questions completed</span>
          <span>
            {answeredQuestions}/{totalQuestions}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">{form.questions.map((question, index) => renderQuestion(question, index))}</div>

      {/* Submit Section */}
      <Card className="mt-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">{totalQuestions} questions</Badge>
              <Badge variant={answeredQuestions === totalQuestions ? "default" : "outline"}>
                {answeredQuestions}/{totalQuestions} completed
              </Badge>
            </div>
            <Button onClick={submitForm} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Footer */}
      <div className="text-center text-sm text-gray-500">
        <p>This form is powered by FormBuilder</p>
      </div>
    </div>
  );
}