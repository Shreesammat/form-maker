import { FormCmp } from "@/components/FormCmp"
import { useParams } from "react-router-dom"

export default function FormBuilder() {
  const { id } = useParams();
  const isEditing = id && id !== "create";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            {isEditing ? "Edit Form" : "Create New Form"}
          </h1>
          <p className="text-gray-600 text-center">
            Build your custom form with categorize, cloze, and comprehension questions
          </p>
        </div>

        <FormCmp />
      </div>
    </div>
  )
}