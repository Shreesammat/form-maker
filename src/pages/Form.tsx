import { FormCmp } from "@/components/FormCmp"
import { QuestionCard } from "@/components/Question-card"

export default function FormBuilder() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-center mb-2">Form Components Demo</h1>
          <p className="text-gray-600 text-center">Google Forms-like components built with React & shadcn/ui</p>
        </div>

        <div className="space-y-12">
          {/* Form Builder Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Form Builder</h2>
            <FormCmp />
          </section>

          {/* Question Card Examples */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Question Card Examples</h2>
            <div className="space-y-6">
              <QuestionCard
                question="What's your favorite programming language?"
                type="multiple-choice"
                options={["JavaScript", "TypeScript", "Python", "Go", "Rust"]}
                required
              />

              <QuestionCard
                question="Tell us about your experience with React"
                type="long-text"
                placeholder="Share your thoughts..."
              />

              <QuestionCard question="Your email address" type="short-text" placeholder="example@email.com" required />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}