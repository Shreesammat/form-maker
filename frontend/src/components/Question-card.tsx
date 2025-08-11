import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreVertical, Trash2, Copy, Plus, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface QuestionCardProps {
  question: string
  type: "short-text" | "long-text" | "multiple-choice"
  options?: string[]
  required?: boolean
  placeholder?: string
  editable?: boolean
  onUpdate?: (updates: {
    question?: string
    type?: "short-text" | "long-text" | "multiple-choice"
    options?: string[]
    required?: boolean
  }) => void
  onRemove?: () => void
}

export function QuestionCard({
  question,
  type,
  options = [],
  required = false,
  placeholder,
  editable = false,
  onUpdate,
  onRemove,
}: QuestionCardProps) {
  const [localOptions, setLocalOptions] = useState(options)
  // const [isEditing, setIsEditing] = useState(false)

  const handleQuestionChange = (newQuestion: string) => {
    onUpdate?.({ question: newQuestion })
  }

  const handleTypeChange = (newType: "short-text" | "long-text" | "multiple-choice") => {
    onUpdate?.({ type: newType })
  }

  const handleRequiredToggle = () => {
    onUpdate?.({ required: !required })
  }

  const addOption = () => {
    const newOptions = [...localOptions, `Option ${localOptions.length + 1}`]
    setLocalOptions(newOptions)
    onUpdate?.({ options: newOptions })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = localOptions.map((opt, i) => (i === index ? value : opt))
    setLocalOptions(newOptions)
    onUpdate?.({ options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = localOptions.filter((_, i) => i !== index)
    setLocalOptions(newOptions)
    onUpdate?.({ options: newOptions })
  }

  const renderAnswerField = () => {
    switch (type) {
      case "short-text":
        return <Input placeholder={placeholder || "Your answer"} className="max-w-md" disabled={editable} />
      case "long-text":
        return (
          <Textarea placeholder={placeholder || "Your answer"} className="max-w-2xl" rows={4} disabled={editable} />
        )
      case "multiple-choice":
        return (
          <div className="space-y-3">
            {editable ? (
              <div className="space-y-2">
                {localOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    <Input value={option} onChange={(e) => updateOption(index, e.target.value)} className="flex-1" />
                    {localOptions.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeOption(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={addOption} className="flex items-center gap-2 text-blue-600">
                  <Plus className="h-4 w-4" />
                  Add option
                </Button>
              </div>
            ) : (
              <RadioGroup>
                {localOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {editable ? (
              <div className="space-y-3">
                <Input
                  value={question}
                  onChange={(e) => handleQuestionChange(e.target.value)}
                  className="text-lg font-medium border-none p-0 focus-visible:ring-0"
                />
                <div className="flex items-center gap-4">
                  <Select value={type} onValueChange={handleTypeChange}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short-text">Short answer</SelectItem>
                      <SelectItem value="long-text">Paragraph</SelectItem>
                      <SelectItem value="multiple-choice">Multiple choice</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRequiredToggle}
                    className={required ? "text-red-600" : "text-gray-500"}
                  >
                    Required
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">{question}</h3>
                {required && (
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>
            )}
          </div>

          {editable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
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

      <CardContent>{renderAnswerField()}</CardContent>
    </Card>
  )
}
