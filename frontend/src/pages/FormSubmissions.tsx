import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, ArrowLeft, Loader2, Download } from "lucide-react";
import { apiService } from "@/lib/api";
import type { Form, Submission } from "@/types/form";

type SubQuestion = {
  id: string;
  text: string;
  type: "text" | "multiple_choice" | "checkbox";
  options?: string[];
  required?: boolean;
};

export default function FormSubmissionsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadForm(id);
      loadSubmissions(id);
    }
  }, [id]);

  const loadForm = async (formId: string) => {
    try {
      const loadedForm = await apiService.getFormById(formId);
      setForm(loadedForm);
    } catch (error) {
      console.error("Failed to load form:", error);
      alert("Failed to load form");
    }
  };

  const loadSubmissions = async (formId: string) => {
    try {
      setIsLoading(true);
      const loadedSubmissions = await apiService.getSubmissionsByFormId(formId);
      setSubmissions(loadedSubmissions);
    } catch (error) {
      console.error("Failed to load submissions:", error);
      alert("Failed to load submissions");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const exportToCSV = () => {
    if (!form || submissions.length === 0) return;

    const headers = ["Submission Date", "Submitted By"];
    form.questions.forEach((question, index) => {
      headers.push(`Q${index + 1}: ${question.text}`);
    });

    const csvContent = [
      headers.join(","),
      ...submissions.map(submission => {
        const row = [
          formatDate(submission.createdAt || ""),
          submission.submittedBy || "anonymous"
        ];

        form.questions.forEach(question => {
          const answer = submission.answers.find(a => a.questionId === question._id);
          let answerText = "";
          
          if (answer) {
            if (typeof answer.response === "string") {
              answerText = answer.response;
            } else if (Array.isArray(answer.response)) {
              answerText = answer.response.join("; ");
            } else if (typeof answer.response === "object") {
              answerText = Object.values(answer.response).join("; ");
            }
          }
          
          row.push(`"${answerText.replace(/"/g, '""')}"`);
        });

        return row.join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.title}_submissions.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (!form) {
  return (
      <div className="container mx-auto py-8 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Form not found</h2>
              <p className="text-gray-600 mb-4">The form you're looking for doesn't exist or has been removed.</p>
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
    <div className="container mx-auto py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Button
              variant="ghost"
              onClick={() => navigate(`/forms/${form._id}`)}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Form
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">{form.title} - Submissions</h1>
            {form.description && (
              <p className="text-gray-600 mt-2">{form.description}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">
              {submissions.length} responses
            </Badge>
            {submissions.length > 0 && (
              <Button onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>
        </div>

        <Separator />
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No submissions yet</h3>
              <p className="text-gray-600 mb-6">When people fill out your form, their responses will appear here.</p>
              <Button onClick={() => navigate(`/forms/${form._id}/fill`)}>
                Test Your Form
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {submissions.map((submission, index) => (
            <Card key={submission._id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">#{index + 1}</Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(submission.createdAt || "")}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {submission.submittedBy || "anonymous"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {form.questions.map((question, qIndex) => {
                    const answer = submission.answers.find(a => a.questionId === question._id);
                    
                    return (
                      <div key={question._id} className="border-l-4 border-blue-200 pl-4">
                        <h4 className="font-medium mb-2">
                          Q{qIndex + 1}: {question.text}
                        </h4>
                        <div className="text-sm text-gray-600">
                          {answer ? (
                            <div>
                              {question.type === "categorize" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <strong>Categories:</strong>
                                    <div className="mt-1 space-y-1">
                                      {(question.extraData?.categories || []).map((cat: string, i: number) => (
                                        <div key={i} className="p-2 bg-blue-50 rounded text-xs">
                                          {cat}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <strong>Items:</strong>
                                    <div className="mt-1 space-y-1">
                                      {(question.extraData?.items || []).map((item: string, i: number) => (
                                        <div key={i} className="p-2 bg-gray-50 rounded text-xs">
                                          {item}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {question.type === "cloze" && (
                                <div>
                                  <strong>Text:</strong>
                                  <div className="mt-1 p-2 bg-gray-50 rounded text-xs">
                                    {question.extraData?.text || ""}
                                  </div>
                                  <strong className="block mt-2">Answers:</strong>
                                  <div className="mt-1 space-y-1">
                                    {Array.isArray(answer.response) ? 
                                      answer.response.map((ans: string, i: number) => (
                                        <div key={i} className="p-2 bg-green-50 rounded text-xs">
                                          Blank {i + 1}: {ans}
                                        </div>
                                      )) : 
                                      <div className="p-2 bg-green-50 rounded text-xs">
                                        {JSON.stringify(answer.response)}
                                      </div>
                                    }
                                  </div>
                                </div>
                              )}
                              
                              {question.type === "comprehension" && (
                                <div>
                                  <strong>Passage:</strong>
                                  <div className="mt-1 p-2 bg-gray-50 rounded text-xs">
                                    {question.extraData?.passage || ""}
                                  </div>
                                  <strong className="block mt-2">Answers:</strong>
                                  <div className="mt-1 space-y-2">
                                    {(question.extraData?.subQuestions || []).map((subQ: SubQuestion, subIndex: number) => {
                                      const subAnswer = answer.response?.[subQ.id];
                                      return (
                                        <div key={subQ.id} className="p-2 bg-green-50 rounded text-xs">
                                          <strong>Q{subIndex + 1}:</strong> {subQ.text}
                                          <div className="mt-1">
                                            <strong>Answer:</strong> {
                                              Array.isArray(subAnswer) ? 
                                                subAnswer.join(", ") : 
                                                (subAnswer || "No answer")
                                            }
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">No answer provided</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}