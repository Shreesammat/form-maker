import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Plus, Eye, Edit, Calendar, FileText, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/lib/api";
import type { Form } from "@/types/form";

export default function Home() {
  const navigate = useNavigate();
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      setIsLoading(true);
      const loadedForms = await apiService.getAllForms();
      setForms(loadedForms);
    } catch (error) {
      console.error("Failed to load forms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

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
            <Button onClick={() => navigate('/forms/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Form
            </Button>
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
            Build custom forms with categorize, cloze, and comprehension questions. No coding required, just pure creativity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
              onClick={() => navigate('/forms/create')}
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
            <div>{forms.length}+ forms created</div>
          </div>
        </div>
      </section>

      {/* Forms List Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Your Forms</h2>
              <p className="text-gray-600">Create, edit, and manage your forms</p>
            </div>
            <Button onClick={() => navigate('/forms/create')}>
              <Plus className="h-4 w-4 mr-2" />
              New Form
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading forms...</p>
              </div>
            </div>
          ) : forms.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No forms yet</h3>
                <p className="text-gray-600 mb-6">Create your first form to get started</p>
                <Button onClick={() => navigate('/forms/create')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Form
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((form) => (
                <Card key={form._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{form.title}</CardTitle>
                        {form.description && (
                          <p className="text-sm text-gray-600 line-clamp-2">{form.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(form.createdAt || "")}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary">
                        {form.questions.length} questions
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/forms/${form._id}/fill`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Fill
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/forms/${form._id}/edit`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Question Types</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Support for three unique question types to capture exactly what you need
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Categorize</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Create categories and items for users to organize and sort.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Cloze</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Fill-in-the-blank questions with customizable text and answers.</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Comprehension</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Reading passages with multiple sub-questions and answer types.</p>
              </CardContent>
            </Card>
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
            <Button size="lg" variant="secondary" className="px-8 bg-white text-blue-600 hover:bg-gray-100" onClick={() => navigate('/forms/create')}>
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