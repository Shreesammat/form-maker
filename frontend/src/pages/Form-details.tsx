import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Users, Eye, Edit, Share2, Loader2, ArrowLeft } from "lucide-react";
import { apiService } from "@/lib/api";
import { type Form, type Question } from "@/types/form";

// Narrow type for comprehension sub-questions
type SubQuestion = {
  id: string;
  text: string;
  type: "text" | "multiple_choice" | "checkbox";
  options?: string[];
  required?: boolean;
};

export default function FormDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionCount, setSubmissionCount] = useState(0);

  useEffect(() => {
    if (id) {
      loadForm(id);
      loadSubmissions(id);
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

  const loadSubmissions = async (formId: string) => {
    try {
      const submissions = await apiService.getSubmissionsByFormId(formId);
      setSubmissionCount(submissions.length);
    } catch (error) {
      console.error("Failed to load submissions:", error);
    }
  };

  const renderCategorizeQuestion = (question: Question, index: number) => {
    const categories: string[] = question.extraData?.categories || [];
    const items: string[] = question.extraData?.items || [];

    return (
      <Card key={question._id ?? index} className="mb-4">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium">
                  {index + 1}. {question.text}
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
                Categorize
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h4 className="font-medium mb-3">Categories:</h4>
                <div className="space-y-2">
                  {categories.map((category, catIndex) => (
                    <div key={catIndex} className="p-3 bg-blue-50 rounded-lg border">
                      {category}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Items to categorize:</h4>
                <div className="space-y-2">
                  {items.map((item, itemIndex) => (
                    <div key={itemIndex} className="p-3 bg-gray-50 rounded-lg border border-dashed">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderClozeQuestion = (question: Question, index: number) => {
    const text: string = question.extraData?.text || "";
    const parts: string[] = text.split(/\{\d+\}/);
    const blankIndices: number[] = [];
    const regex = /\{(\d+)\}/g;
    let match: RegExpExecArray | null;
    
    while ((match = regex.exec(text)) !== null) {
      blankIndices.push(parseInt(match[1]));
    }

    return (
      <Card key={question._id ?? index} className="mb-4">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium">
                  {index + 1}. {question.text}
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
                Cloze
              </Badge>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg mt-4">
              <div className="flex flex-wrap items-center gap-2">
                {parts.map((part, partIndex) => (
                  <span key={partIndex}>
                    {part}
                    {blankIndices[partIndex] !== undefined && (
                      <span className="inline-block w-20 h-8 border-2 border-dashed border-gray-400 rounded mx-1 bg-white"></span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderComprehensionQuestion = (question: Question, index: number) => {
    const passage: string = question.extraData?.passage || "";
    const subQuestions: SubQuestion[] = (question.extraData?.subQuestions as SubQuestion[]) || [];

    return (
      <Card key={question._id ?? index} className="mb-4">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium">
                  {index + 1}. {question.text}
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
                Comprehension
              </Badge>
            </div>

            <div className="mb-6 mt-4">
              <h4 className="font-medium mb-2">Passage:</h4>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="whitespace-pre-wrap">{passage}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Questions:</h4>
              <div className="space-y-4">
                {subQuestions.map((subQ: SubQuestion, subIndex: number) => (
                  <div key={subQ.id ?? subIndex} className="p-3 border rounded-lg">
                    <p className="font-medium mb-2">{subIndex + 1}. {subQ.text}</p>
                    
                    {subQ.type === "multiple_choice" && subQ.options && (
                      <div className="space-y-1">
                        {subQ.options.map((option: string, optIndex: number) => (
                          <div key={optIndex} className="flex items-center space-x-2">
                            <div className="w-4 h-4 border border-gray-300 rounded-full"></div>
                            <span className="text-sm">{option}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {subQ.type === "checkbox" && subQ.options && (
                      <div className="space-y-1">
                        {subQ.options.map((option: string, optIndex: number) => (
                          <div key={optIndex} className="flex items-center space-x-2">
                            <div className="w-4 h-4 border border-gray-300 rounded"></div>
                            <span className="text-sm">{option}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {subQ.type === "text" && (
                      <div className="w-full h-10 border border-dashed border-gray-300 rounded-md flex items-center px-3 text-sm text-muted-foreground">
                        Text answer
                      </div>
                    )}
                  </div>
                ))}
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
          <Card key={question._id ?? index} className="mb-4">
            <CardContent className="pt-6">
              <p className="text-red-600">Unknown question type: {question.type}</p>
            </CardContent>
          </Card>
        );
    }
  };

  const copyToClipboard = () => {
    if (form) {
      const url = `${window.location.origin}/forms/${form._id}/fill`;
      navigator.clipboard.writeText(url);
      alert("Form link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="mt-4 text-gray-600">Loading form...</p>
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
    <div className="container mx-auto py-8 max-w-4xl">
      {/* Form Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title}</h1>
            {form.description && (
              <p className="text-lg text-gray-600 mb-4">{form.description}</p>
            )}
            {form.headerImage && (
              <img
                src={form.headerImage}
                alt="Header"
                className="w-full max-h-64 object-cover rounded-lg mt-4"
              />
            )}
          </div>
        </div>

        {/* Form Metadata */}
        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>Created {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "-"}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{submissionCount} responses</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>{form.questions.length} questions</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button 
            variant="default" 
            className="flex items-center space-x-2"
            onClick={() => navigate(`/forms/${form._id}/fill`)}
          >
            <Eye className="w-4 h-4" />
            <span>Fill Form</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 bg-transparent"
            onClick={() => navigate(`/forms/${form._id}/edit`)}
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 bg-transparent"
            onClick={() => navigate(`/forms/${form._id}/submissions`)}
          >
            <Users className="w-4 h-4" />
            <span>View Responses</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 bg-transparent"
            onClick={copyToClipboard}
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </Button>
        </div>

        <Separator className="mt-6" />
      </div>

      {/* Form Preview */}
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Form Preview</h2>
          <p className="text-gray-600">This is how your form will appear to respondents.</p>
        </div>

        <div className="space-y-4">
          {form.questions.map((question, index) => renderQuestion(question, index))}
        </div>
      </div>
    </div>
  );
}