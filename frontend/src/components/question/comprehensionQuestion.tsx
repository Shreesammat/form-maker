import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { Question } from "@/types/form";

interface ComprehensionSubQuestion {
  id: string;
  text: string;
  type: "text" | "multiple_choice" | "checkbox";
  required?: boolean;
  options?: string[];
}

interface ComprehensionQuestionProps {
  question: Question;
  onUpdate: (question: Question) => void;
  editable?: boolean;
}

export function ComprehensionQuestion({ question, onUpdate, editable = true }: ComprehensionQuestionProps) {
  if (question.type !== "comprehension") return null;

  const [passage, setPassage] = useState<string>(question.extraData?.passage || "");
  const [subQuestions, setSubQuestions] = useState<ComprehensionSubQuestion[]>(
    question.extraData?.subQuestions || []
  );

  const updateQuestion = (updates: Partial<Question>) => {
    onUpdate({ ...question, ...updates } as Question);
  };

  const handlePassageChange = (value: string) => {
    setPassage(value);
    updateQuestion({ 
      extraData: { 
        ...question.extraData, 
        passage: value, 
        subQuestions 
      } 
    });
  };

  const addSubQuestion = () => {
    const newSubQuestion: ComprehensionSubQuestion = {
      id: `sub_${Date.now()}`,
      text: "",
      type: "text",
      required: false,
      options: [],
    };
    const newSubQuestions = [...subQuestions, newSubQuestion];
    setSubQuestions(newSubQuestions);
    updateQuestion({ 
      extraData: { 
        ...question.extraData, 
        passage, 
        subQuestions: newSubQuestions 
      } 
    });
  };

  const updateSubQuestion = (idx: number, updates: Partial<ComprehensionSubQuestion>) => {
    const newSubQuestions = subQuestions.map((sq, i) => (i === idx ? { ...sq, ...updates } : sq));
    setSubQuestions(newSubQuestions);
    updateQuestion({ 
      extraData: { 
        ...question.extraData, 
        passage, 
        subQuestions: newSubQuestions 
      } 
    });
  };

  const removeSubQuestion = (idx: number) => {
    const newSubQuestions = subQuestions.filter((_, i) => i !== idx);
    setSubQuestions(newSubQuestions);
    updateQuestion({ 
      extraData: { 
        ...question.extraData, 
        passage, 
        subQuestions: newSubQuestions 
      } 
    });
  };

  const addOption = (subIdx: number) => {
    const newSubQuestions = subQuestions.map((sq, i) => {
      if (i === subIdx) {
        const options = sq.options || [];
        return { ...sq, options: [...options, `Option ${options.length + 1}`] } as ComprehensionSubQuestion;
      }
      return sq;
    });
    setSubQuestions(newSubQuestions);
    updateQuestion({ 
      extraData: { 
        ...question.extraData, 
        passage, 
        subQuestions: newSubQuestions 
      } 
    });
  };

  const updateOption = (subIdx: number, optionIndex: number, value: string) => {
    const newSubQuestions = subQuestions.map((sq, i) => {
      if (i === subIdx) {
        const options = [...(sq.options || [])];
        options[optionIndex] = value;
        return { ...sq, options } as ComprehensionSubQuestion;
      }
      return sq;
    });
    setSubQuestions(newSubQuestions);
    updateQuestion({ 
      extraData: { 
        ...question.extraData, 
        passage, 
        subQuestions: newSubQuestions 
      } 
    });
  };

  const removeOption = (subIdx: number, optionIndex: number) => {
    const newSubQuestions = subQuestions.map((sq, i) => {
      if (i === subIdx) {
        const options = (sq.options || []).filter((_, j) => j !== optionIndex);
        return { ...sq, options } as ComprehensionSubQuestion;
      }
      return sq;
    });
    setSubQuestions(newSubQuestions);
    updateQuestion({ 
      extraData: { 
        ...question.extraData, 
        passage, 
        subQuestions: newSubQuestions 
      } 
    });
  };

  if (!editable) {
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardHeader>
          <h3 className="text-lg font-medium">{question.text}</h3>
          {question.image && (
            <img 
              src={question.image} 
              alt="Question" 
              className="w-full max-h-48 object-cover rounded-lg mt-3"
            />
          )}
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h4 className="font-medium mb-2">Passage:</h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="whitespace-pre-wrap">{passage}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">Questions:</h4>
            <div className="space-y-4">
              {subQuestions.map((subQ, index) => (
                <div key={subQ.id} className="p-3 border rounded-lg">
                  <p className="font-medium mb-2">{index + 1}. {subQ.text}</p>
                  {subQ.type === "multiple_choice" && subQ.options && (
                    <div className="space-y-1">
                      {subQ.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <input type="radio" disabled />
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {subQ.type === "checkbox" && subQ.options && (
                    <div className="space-y-1">
                      {subQ.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <input type="checkbox" disabled />
                          <span>{option}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {subQ.type === "text" && (
                    <input
                      type="text"
                      placeholder="Your answer"
                      className="w-full p-2 border rounded"
                      disabled
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-gray-400" />
          <Input
            placeholder="Enter question text"
            value={question.text}
            onChange={(e) => updateQuestion({ text: e.target.value })}
            className="text-lg font-medium"
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="font-medium">Reading Passage</Label>
          <Textarea
            placeholder="Enter the reading passage or text for comprehension..."
            value={passage}
            onChange={(e) => handlePassageChange(e.target.value)}
            rows={6}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="font-medium">Sub-questions</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSubQuestion}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Question
            </Button>
          </div>
          <div className="space-y-4">
            {subQuestions.map((subQ, index) => (
              <Card key={subQ.id} className="border-2">
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    
                    <Input
                      placeholder="Enter sub-question text"
                      value={subQ.text}
                      onChange={(e) => updateSubQuestion(index, { text: e.target.value })}
                    />

                    <div className="flex items-center gap-4">
                      <div>
                        <Label className="text-sm">Question Type:</Label>
                        <select
                          value={subQ.type}
                          onChange={(e) => updateSubQuestion(index, { 
                            type: e.target.value as "text" | "multiple_choice" | "checkbox" 
                          })}
                          className="ml-2 p-1 border rounded"
                        >
                          <option value="text">Text</option>
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!!subQ.required}
                          onChange={(e) => updateSubQuestion(index, { required: e.target.checked })}
                        />
                        <Label className="text-sm">Required</Label>
                      </div>
                    </div>

                    {(subQ.type === "multiple_choice" || subQ.type === "checkbox") && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm">Options:</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(index)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Option
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(subQ.options || []).map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <Input
                                value={option}
                                onChange={(e) => updateOption(index, optIndex, e.target.value)}
                                placeholder={`Option ${optIndex + 1}`}
                                className="flex-1"
                              />
                              {(subQ.options || []).length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeOption(index, optIndex)}
                                >
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Image Upload */}
        <ImageUpload
          currentImage={question.image}
          onImageChange={(imageUrl) => updateQuestion({ image: imageUrl })}
          onImageRemove={() => updateQuestion({ image: undefined })}
          label="Question Image (Optional)"
        />
      </CardContent>
    </Card>
  );
}
