import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { apiService } from "@/lib/api";
import type { Form, Submission } from "@/types/form";

type SubQuestion = {
  id: string;
  text: string;
  type: "text" | "multiple_choice" | "checkbox";
  options?: string[];
  required?: boolean;
};

export default function SubmissionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [form, setForm] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadSubmission(id);
    }
  }, [id]);

  const loadSubmission = async (submissionId: string) => {
    try {
      setIsLoading(true);
      const loadedSubmission = await apiService.getSubmissionById(submissionId);
      setSubmission(loadedSubmission);
      
      // Load the associated form
      if (loadedSubmission.formId) {
        const loadedForm = await apiService.getFormById(loadedSubmission.formId);
        setForm(loadedForm);
      }
    } catch (error) {
      console.error("Failed to load submission:", error);
      alert("Failed to load submission");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (!submission || !form) {
  return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission not found</h2>
              <p className="text-gray-600 mb-4">The submission you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate(`/forms/${form._id}/submissions`)}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Submissions
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Submission Details</h1>
            <p className="text-gray-600 mt-2">Form: {form.title}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline">
              {submission.submittedBy || "anonymous"}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(submission.createdAt || "")}</span>
            </div>
          </div>
        </div>

        <Separator />
      </div>

      {/* Submission Content */}
      <div className="space-y-6">
        {form.questions.map((question, qIndex) => {
          const answer = submission.answers.find(a => a.questionId === question._id);
          
          return (
            <Card key={question._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">
                      Q{qIndex + 1}: {question.text}
                    </h3>
                    {question.image && (
                      <img 
                        src={question.image} 
                        alt="Question" 
                        className="w-full max-h-48 object-cover rounded-lg mt-3"
                      />
                    )}
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {question.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {question.type === "categorize" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Categories:</h4>
                        <div className="space-y-2">
                          {(question.extraData?.categories || []).map((category: string, catIndex: number) => (
                            <div key={catIndex} className="p-3 bg-blue-50 rounded-lg border">
                              {category}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Items to categorize:</h4>
                        <div className="space-y-2">
                          {(question.extraData?.items || []).map((item: string, itemIndex: number) => (
                            <div key={itemIndex} className="p-3 bg-gray-50 rounded-lg border border-dashed">
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {question.type === "cloze" && (
                    <div>
                      <h4 className="font-medium mb-2">Text with blanks:</h4>
                      <div className="p-4 bg-gray-50 rounded-lg mb-4">
                        <p>{question.extraData?.text || ""}</p>
                      </div>
                      <h4 className="font-medium mb-2">Answers:</h4>
                      <div className="space-y-2">
                        {answer ? (
                          Array.isArray(answer.response) ? 
                            answer.response.map((ans: string, i: number) => (
                              <div key={i} className="p-3 bg-green-50 rounded-lg border">
                                <strong>Blank {i + 1}:</strong> {ans}
                              </div>
                            )) : 
                            <div className="p-3 bg-green-50 rounded-lg border">
                              {JSON.stringify(answer.response)}
                            </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg border text-gray-500">
                            No answer provided
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {question.type === "comprehension" && (
                    <div>
                      <h4 className="font-medium mb-2">Passage:</h4>
                      <div className="p-4 bg-gray-50 rounded-lg mb-4">
                        <p className="whitespace-pre-wrap">{question.extraData?.passage || ""}</p>
                      </div>
                      <h4 className="font-medium mb-3">Questions & Answers:</h4>
                      <div className="space-y-4">
                        {(question.extraData?.subQuestions || []).map((subQ: SubQuestion, subIndex: number) => {
                          const subAnswer = answer?.response?.[subQ.id];
                          return (
                            <div key={subQ.id} className="p-4 border rounded-lg">
                              <h5 className="font-medium mb-2">
                                Q{subIndex + 1}: {subQ.text}
                              </h5>
                              <div className="text-sm text-gray-600">
                                {subAnswer ? (
                                  <div>
                                    {subQ.type === "multiple_choice" && (
                                      <div className="p-2 bg-green-50 rounded">
                                        <strong>Selected:</strong> {subAnswer}
                                      </div>
                                    )}
                                    {subQ.type === "checkbox" && (
                                      <div className="p-2 bg-green-50 rounded">
                                        <strong>Selected:</strong> {
                                          Array.isArray(subAnswer) ? 
                                            subAnswer.join(", ") : 
                                            subAnswer
                                        }
                                      </div>
                                    )}
                                    {subQ.type === "text" && (
                                      <div className="p-2 bg-green-50 rounded">
                                        <strong>Answer:</strong> {subAnswer}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="p-2 bg-gray-50 rounded text-gray-500">
                                    No answer provided
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {!answer && (
                    <div className="p-4 bg-gray-50 rounded-lg border text-gray-500">
                      No answer provided
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Submission completed successfully</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Submitted on {formatDate(submission.createdAt || "")}
        </p>
      </div>
    </div>
  );
}