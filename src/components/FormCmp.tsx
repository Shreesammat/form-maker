
import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Send } from "lucide-react"
import { QuestionCard } from "./Question-card"

interface Question {
  id: string
  question: string
  type: "short-text" | "long-text" | "multiple-choice"
  options?: string[]
  required: boolean
}

export function FormCmp() {
  const [formTitle, setFormTitle] = useState("Untitled Form")
  const [formDescription, setFormDescription] = useState("")
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      question: "What's your name?",
      type: "short-text",
      required: true,
    },
  ])

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "Untitled Question",
      type: "short-text",
      required: false,
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <Card className="border-t-4 border-t-blue-500">
        <CardHeader>
          <Input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="text-2xl font-bold border-none p-0 focus-visible:ring-0"
            placeholder="Form title"
          />
          <Textarea
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            className="border-none p-0 focus-visible:ring-0 resize-none"
            placeholder="Form description"
            rows={2}
          />
        </CardHeader>
      </Card>

      {/* Questions */}
      {questions.map((question, index) => (
        <QuestionCard
          key={question.id+`${index}`}
          question={question.question}
          type={question.type}
          options={question.options}
          required={question.required}
          editable
          onUpdate={(updates) => updateQuestion(question.id, updates)}
          onRemove={() => removeQuestion(question.id)}
        />
      ))}

      {/* Add Question Button */}
      <Card className="border-dashed border-2 hover:border-blue-300 transition-colors">
        <CardContent className="flex items-center justify-center py-8">
          <Button
            variant="ghost"
            onClick={addQuestion}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <Plus className="h-5 w-5" />
            Add Question
          </Button>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-between items-center pt-4">
        <div className="flex gap-2">
          <Badge variant="secondary">{questions.length} questions</Badge>
          <Badge variant="outline">{questions.filter((q) => q.required).length} required</Badge>
        </div>
        <Button className="flex items-center gap-2">
          <Send className="h-4 w-4" />
          Send Form
        </Button>
      </div>
    </div>
  )
}