"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormStore } from "@/lib/store/formStore";
import { apiService } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestionFactory } from "@/components/question/QuestionFactory";
import type { Form, Question, QuestionType } from "@/types/form";
import { Plus, Save, Eye, Upload, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

export function FormCmp() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { form, setForm, updateFormField, addQuestion, updateQuestion, removeQuestion } = useFormStore();

  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load form if editing
  useEffect(() => {
    if (id && id !== "create") {
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

  const handleSave = async () => {
    if (!form.title.trim()) {
      alert("Please enter a form title");
      return;
    }

    try {
      setIsSaving(true);
      
      // Upload header image if selected
      let headerImageUrl = form.headerImage;
      if (imageFile) {
        const uploadResult = await apiService.uploadImage(imageFile);
        headerImageUrl = uploadResult.url;
      }

      const formToSave = { ...form, headerImage: headerImageUrl };

      let savedForm: Form;
      if (id && id !== "create") {
        savedForm = await apiService.updateForm(id, formToSave);
      } else {
        savedForm = await apiService.createForm(formToSave);
      }

      setForm(savedForm);
      alert("Form saved successfully!");
      
      if (id === "create") {
        navigate(`/forms/${savedForm._id}/edit`);
      }
    } catch (error) {
      console.error("Failed to save form:", error);
      alert("Failed to save form");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddQuestion = (type: QuestionType) => {
    let newQuestion: Question;
    switch (type) {
      case "categorize":
        newQuestion = {
          type: "categorize",
          text: "",
          image: "",
          options: [],
          answer: null,
          extraData: { categories: [], items: [] },
          order: form.questions.length,
        };
        break;
      case "cloze":
        newQuestion = {
          type: "cloze",
          text: "",
          image: "",
          options: [],
          answer: null,
          extraData: { text: "" },
          order: form.questions.length,
        };
        break;
      case "comprehension":
      default:
        newQuestion = {
          type: "comprehension",
          text: "",
          image: "",
          options: [],
          answer: null,
          extraData: { passage: "", subQuestions: [] },
          order: form.questions.length,
        };
        break;
    }
    addQuestion(newQuestion);
  };

  const handleQuestionUpdate = (index: number, updatedQuestion: Question) => {
    updateQuestion(index, updatedQuestion);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      updateFormField("headerImage", URL.createObjectURL(file));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form meta */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <Input
            placeholder="Form title"
            value={form.title}
            onChange={(e) => updateFormField("title", e.target.value)}
            className="text-2xl font-bold"
          />
          <Textarea
            placeholder="Form description"
            value={form.description}
            onChange={(e) => updateFormField("description", e.target.value)}
            rows={3}
          />
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Header Image</Label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="header-image"
              />
              <label htmlFor="header-image">
                <Button variant="outline" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </span>
                </Button>
              </label>
              {form.headerImage && (
                <div className="relative">
                  <img
                    src={form.headerImage}
                    alt="Header"
                    className="w-32 h-20 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    onClick={() => updateFormField("headerImage", "")}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Questions</h2>
        </div>

        {form.questions.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="pt-6 text-center">
              <p className="text-gray-500">No questions yet. Add your first question below.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {form.questions.map((question, index) => (
              <div key={index} className="relative">
                <QuestionFactory
                  question={question}
                  onUpdate={(updatedQuestion) => handleQuestionUpdate(index, updatedQuestion)}
                  editable={true}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => removeQuestion(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add Question Buttons - Moved to bottom */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => handleAddQuestion("categorize")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Categorize
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAddQuestion("cloze")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Cloze
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAddQuestion("comprehension")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Comprehension
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{form.questions.length} questions</Badge>
          {form.headerImage && <Badge variant="outline">Has header image</Badge>}
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/forms/${id}/fill`)}
            disabled={!id || id === "create"}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" onClick={handleSave}/>
                Save Form
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}