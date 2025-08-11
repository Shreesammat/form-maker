import { FormCmp } from "@/components/FormCmp"
import { QuestionCard } from "@/components/Question-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, ArrowRight, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FB</span>
            </div>
            <span className="font-bold text-xl">FormBuilder</span>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/create')}>Create for Free</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">✨ Built with React & TypeScript</Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Beautiful Forms
            <br />
            <span className="text-gray-900">In Minutes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Build Google Forms-like surveys and questionnaires with our intuitive drag-and-drop interface. No coding
            required, just pure creativity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
              onClick={() => navigate('/create')}
            >
              Create for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.9/5 rating</span>
            </div>
            <div>•</div>
            <div>10,000+ forms created</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple & Anonymous</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create and fill forms anonymously, then see all responses in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Create & Fill Anonymously</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Create forms and allow users to fill them out completely anonymously.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">See All Responses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">View and manage all form responses in one centralized dashboard.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">See it in action</h2>
            <p className="text-gray-600">Try our form builder right here - no signup required!</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12">
            <FormCmp />
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-4">Question Types</h3>
            <p className="text-gray-600 mb-8">Support for multiple question formats to capture exactly what you need</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <QuestionCard
                question="What's your favorite programming language?"
                type="multiple-choice"
                options={["JavaScript", "TypeScript", "Python", "Go", "Rust"]}
                required
              />

              <QuestionCard question="Your email address" type="short-text" placeholder="example@email.com" required />
            </div>

            <div className="space-y-6">
              <QuestionCard
                question="Tell us about your experience with React"
                type="long-text"
                placeholder="Share your thoughts and experiences..."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to build your first form?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of creators who trust FormBuilder for their data collection needs.
          </p>
          <div className="flex justify-center">
            <Button size="lg" variant="secondary" className="px-8 bg-white text-blue-600 hover:bg-gray-100" onClick={() => navigate('/create')}>
              Create for Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-300">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FB</span>
                </div>
                <span className="font-bold text-xl text-white">FormBuilder</span>
              </div>
              <p className="text-sm">Create beautiful forms with ease. Built for creators, by creators.</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 FormBuilder. All rights reserved. Built with React, TypeScript & Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}