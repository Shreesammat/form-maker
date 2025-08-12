import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreVertical, Trash2, Copy, Plus, ImageIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFormStore } from "@/lib/store/formStore";
import type { Question, QuestionType } from "@/types/form";

interface QuestionCardProps {
  index: number;
  editable?: boolean;
  onRemove?: () => void;
}

export function QuestionCard({
  index,
  editable = false,
  onRemove,
}: QuestionCardProps) {
  const { form, updateQuestion } = useFormStore();
  const question = form.questions[index];
  const [localCategories, setLocalCategories] = useState<string[]>(
    question?.type === "categorize" && question.extraData?.categories 
      ? question.extraData.categories 
      : []
  );

  if (!question) return null;

  const handleChange = <K extends keyof Question>(field: K, value: Question[K]) => {
    updateQuestion(index, { [field]: value });
  };

  const handleCategoryChange = (catIndex: number, value: string) => {
    const updated = [...localCategories];
    updated[catIndex] = value;
    setLocalCategories(updated);
    
    // Update the extraData with new categories
    const currentExtraData = question.extraData || {};
    handleChange("extraData", { ...currentExtraData, categories: updated });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      // you might handle file upload here and set `image` as a URL
      handleChange("image", URL.createObjectURL(e.target.files[0]));
    }
  };

  const renderFields = () => {
    switch (question.type) {
      case "comprehension":
        return (
          <Textarea
            placeholder="Enter comprehension passage"
            value={question.extraData?.passage || ""}
            onChange={(e) => {
              const currentExtraData = question.extraData || {};
              handleChange("extraData", { ...currentExtraData, passage: e.target.value });
            }}
            disabled={!editable}
            rows={4}
          />
        );

      case "categorize":
        return (
          <div className="space-y-2">
            {localCategories.map((cat: string, i: number) => (
              <Input
                key={i}
                placeholder={`Category ${i + 1}`}
                value={cat}
                onChange={(e) => handleCategoryChange(i, e.target.value)}
                disabled={!editable}
              />
            ))}
            {editable && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCategoryChange(localCategories.length, "")}
              >
                <Plus className="h-4 w-4" />
                Add category
              </Button>
            )}
          </div>
        );

      case "cloze":
        return (
          <Input
            placeholder="Enter text with blanks"
            value={question.extraData?.text || ""}
            onChange={(e) => {
              const currentExtraData = question.extraData || {};
              handleChange("extraData", { ...currentExtraData, text: e.target.value });
            }}
            disabled={!editable}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            {editable ? (
              <>
                <Input
                  placeholder="Enter question"
                  value={question.text}
                  onChange={(e) => handleChange("text", e.target.value)}
                  className="text-lg font-medium border-none p-0 focus-visible:ring-0"
                />
                <div className="flex items-center gap-4">
                  <Select
                    value={question.type}
                    onValueChange={(val: QuestionType) =>
                      handleChange("type", val)
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comprehension">
                        Comprehension
                      </SelectItem>
                      <SelectItem value="categorize">Categorize</SelectItem>
                      <SelectItem value="cloze">Cloze</SelectItem>
                    </SelectContent>
                  </Select>

                  <Label className="cursor-pointer flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                  </Label>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-medium">{question.text}</h3>
                {question.image && (
                  <img
                    src={question.image}
                    alt="Question"
                    className="w-32 rounded"
                  />
                )}
              </div>
            )}
          </div>

          {editable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onRemove} className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {renderFields()}
        {editable && question.image && (
          <img src={question.image} alt="Preview" className="w-32 rounded" />
        )}
      </CardContent>
    </Card>
  );
}
