import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { ImageUpload } from "@/components/ui/ImageUpload";
import type { Question } from "@/types/form";

interface CategorizeQuestionProps {
  question: Question;
  onUpdate: (question: Question) => void;
  editable?: boolean;
}

export function CategorizeQuestion({ question, onUpdate, editable = true }: CategorizeQuestionProps) {
  const [categories, setCategories] = useState<string[]>(
    question.type === "categorize" ? (question.extraData?.categories || ["Category 1", "Category 2"]) : ["Category 1", "Category 2"]
  );
  const [items, setItems] = useState<string[]>(
    question.type === "categorize" ? (question.extraData?.items || ["Item 1", "Item 2", "Item 3"]) : ["Item 1", "Item 2", "Item 3"]
  );

  if (question.type !== "categorize") return null;

  const updateQuestion = (updates: Partial<Question>) => {
    onUpdate({ ...question, ...updates } as Question);
  };

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
    updateQuestion({ 
      extraData: { 
        ...question.extraData, 
        categories: newCategories 
      } 
    });
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
    updateQuestion({ 
      extraData: { 
        ...question.extraData, 
        items: newItems 
      } 
    });
  };

  const addCategory = () => {
    const newCategories = [...categories, `Category ${categories.length + 1}`];
    setCategories(newCategories);
    updateQuestion({ 
      extraData: { 
        ...question.extraData, 
        categories: newCategories 
      } 
    });
  };

  const addItem = () => {
    const newItems = [...items, `Item ${items.length + 1}`];
    setItems(newItems);
    updateQuestion({ 
      extraData: { 
        ...question.extraData, 
        items: newItems 
      } 
    });
  };

  const removeCategory = (index: number) => {
    if (categories.length > 1) {
      const newCategories = categories.filter((_, i) => i !== index);
      setCategories(newCategories);
      updateQuestion({ 
        extraData: { 
          ...question.extraData, 
          categories: newCategories 
        } 
      });
    }
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      updateQuestion({ 
        extraData: { 
          ...question.extraData, 
          items: newItems 
        } 
      });
    }
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Categories:</h4>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border">
                    {category}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Items to categorize:</h4>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border border-dashed">
                    {item}
                  </div>
                ))}
              </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="font-medium">Categories</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCategory}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Category
              </Button>
            </div>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={category}
                    onChange={(e) => handleCategoryChange(index, e.target.value)}
                    placeholder={`Category ${index + 1}`}
                  />
                  {categories.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCategory(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="font-medium">Items to categorize</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={item}
                    onChange={(e) => handleItemChange(index, e.target.value)}
                    placeholder={`Item ${index + 1}`}
                  />
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
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
