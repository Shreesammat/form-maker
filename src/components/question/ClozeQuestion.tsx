import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GripVertical, Plus } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { Question } from "@/types/form";

interface ClozeQuestionProps {
  question: Question;
  onUpdate: (question: Question) => void;
  editable?: boolean;
}

export function ClozeQuestion({ question, onUpdate, editable = true }: ClozeQuestionProps) {
  if (question.type !== "cloze") return null;

  const [text, setText] = useState<string>(question.extraData?.text || "");
  const [blanks, setBlanks] = useState<string[]>(question.extraData?.blanks || []);

  const updateQuestion = (updates: Partial<Question>) => {
    onUpdate({ ...question, ...updates } as Question);
  };

  const handleTextChange = (value: string) => {
    setText(value);
    updateQuestion({ 
      extraData: { 
        ...question.extraData, 
        text: value 
      } 
    });
  };

  const addBlank = () => {
    const newBlanks = [...blanks, ""];
    setBlanks(newBlanks);
    updateQuestion({ 
      extraData: { 
        ...question.extraData, 
        blanks: newBlanks 
      } 
    });
  };

  const removeBlank = (index: number) => {
    const newBlanks = blanks.filter((_, i) => i !== index);
    setBlanks(newBlanks);
    updateQuestion({ 
      extraData: { 
        ...question.extraData, 
        blanks: newBlanks 
      } 
    });
  };

  const renderTextWithBlanks = () => {
    if (!text) return null;
    
    const parts = text.split(/\{\d+\}/);
    const blankIndices: number[] = [];
    const regex = /\{(\d+)\}/g;
    let match: RegExpExecArray | null;
    
    while ((match = regex.exec(text)) !== null) {
      blankIndices.push(parseInt(match[1]));
    }

    return (
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <div className="flex flex-wrap items-center gap-2">
            {parts.map((part, index) => (
              <span key={index}>
                {part}
                {blankIndices[index] !== undefined && (
                  <span className="inline-block w-20 h-8 border-2 border-dashed border-gray-400 rounded mx-1 bg-white"></span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
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
          {renderTextWithBlanks()}
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
          <Label className="font-medium">Text with blanks</Label>
          <p className="text-sm text-gray-600 mb-2">
            Use {"{1}"}, {"{2}"}, etc. to mark blank spaces
          </p>
          <Textarea
            placeholder="Enter text with blanks like: The capital of France is {1} and the capital of Germany is {2}."
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={4}
          />
        </div>

        {renderTextWithBlanks()}

        <div>
          <div className="flex items-center justify-between mb-3">
            <Label className="font-medium">Track blanks (optional)</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addBlank}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Blank
            </Button>
          </div>
          <div className="space-y-2">
            {blanks.map((blank, index) => (
              <div key={index} className="flex items-center gap-2">
                <Label className="w-16 text-sm">Blank {index + 1}:</Label>
                <Input
                  value={blank}
                  onChange={(e) => {
                    const newBlanks = [...blanks];
                    newBlanks[index] = e.target.value;
                    setBlanks(newBlanks);
                    updateQuestion({ 
                      extraData: { 
                        ...question.extraData, 
                        blanks: newBlanks 
                      } 
                    });
                  }}
                  placeholder={`Answer for blank ${index + 1}`}
                />
                {blanks.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBlank(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
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
