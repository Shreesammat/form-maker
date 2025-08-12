import type { Form, Submission } from "@/types/form";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Form endpoints
  async createForm(form: Form): Promise<Form> {
    return this.request<Form>("/forms", {
      method: "POST",
      body: JSON.stringify(form),
    });
  }

  async getAllForms(): Promise<Form[]> {
    return this.request<Form[]>("/forms");
  }

  async getFormById(id: string): Promise<Form> {
    return this.request<Form>(`/forms/${id}`);
  }

  async updateForm(id: string, form: Form): Promise<Form> {
    return this.request<Form>(`/forms/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });
  }

  async deleteForm(id: string): Promise<void> {
    return this.request<void>(`/forms/${id}`, {
      method: "DELETE",
    });
  }

  // Submission endpoints
  async createSubmission(formId: string, submission: Omit<Submission, "_id" | "formId" | "createdAt" | "updatedAt">): Promise<Submission> {
    return this.request<Submission>(`/forms/${formId}/submissions`, {
      method: "POST",
      body: JSON.stringify(submission),
    });
  }

  async getSubmissionsByFormId(formId: string): Promise<Submission[]> {
    return this.request<Submission[]>(`/forms/${formId}/submissions`);
  }

  async getSubmissionById(id: string): Promise<Submission> {
    return this.request<Submission>(`/submissions/${id}`);
  }

  // Upload endpoint
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("image", file);

    return this.request<{ url: string }>("/upload", {
      method: "POST",
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);
