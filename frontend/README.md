# Form Builder

A modern form builder application built with React, TypeScript, and Tailwind CSS. Create custom forms with three unique question types: categorize, cloze, and comprehension questions.

## Features

### Question Types

1. **Categorize Questions**
   - Create categories and items for users to organize
   - Drag-and-drop style interface for categorization
   - Perfect for sorting and classification exercises

2. **Cloze Questions**
   - Fill-in-the-blank questions with customizable text
   - Use `{1}`, `{2}`, etc. to mark blank spaces
   - Automatic answer validation

3. **Comprehension Questions**
   - Reading passages with multiple sub-questions
   - Support for text, multiple choice, and checkbox sub-questions
   - Ideal for reading comprehension exercises

### Core Features

- **Form Builder**: Intuitive drag-and-drop interface
- **Form Preview**: See how your form will appear to respondents
- **Form Filling**: User-friendly form completion interface
- **Response Management**: View and export all form submissions
- **Image Upload**: Add header images to your forms
- **CSV Export**: Download form responses as CSV files
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Backend**: Node.js, Express, MongoDB (API endpoints provided)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB database
- Backend API server (see API endpoints below)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd form-maker-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

The frontend expects the following API endpoints from your backend:

### Forms
- `POST /api/forms` - Create a new form
- `GET /api/forms` - Get all forms
- `GET /api/forms/:id` - Get form by ID
- `PUT /api/forms/:id` - Update form by ID
- `DELETE /api/forms/:id` - Delete form by ID

### Submissions
- `POST /api/forms/:id/submissions` - Submit answers for a form
- `GET /api/forms/:id/submissions` - Get all submissions for a form
- `GET /api/submissions/:id` - Get a single submission by ID

### Upload
- `POST /api/upload` - Upload image files

## Usage

### Creating a Form

1. Navigate to the home page and click "Create Form"
2. Add a title and description for your form
3. Optionally upload a header image
4. Add questions using the three question type buttons:
   - **Categorize**: Create categories and items
   - **Cloze**: Add fill-in-the-blank questions
   - **Comprehension**: Create reading passages with sub-questions
5. Save your form

### Filling a Form

1. Share the form link with respondents
2. Respondents can fill out the form anonymously
3. All responses are saved to the database

### Viewing Responses

1. Go to your form details page
2. Click "View Responses" to see all submissions
3. Export responses as CSV for further analysis

## Project Structure

```
src/
├── components/
│   ├── question/           # Question type components
│   │   ├── CategorizeQuestion.tsx
│   │   ├── ClozeQuestion.tsx
│   │   ├── ComprehensionQuestion.tsx
│   │   └── QuestionFactory.tsx
│   ├── ui/                 # Reusable UI components
│   └── FormCmp.tsx         # Main form builder component
├── lib/
│   ├── api.ts             # API service layer
│   └── store/
│       └── formStore.ts   # Zustand state management
├── pages/                 # Page components
├── types/
│   └── form.ts           # TypeScript type definitions
└── App.tsx               # Main application component
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Adding New Question Types

1. Create a new question component in `src/components/question/`
2. Add the question type to the `QuestionType` union in `src/types/form.ts`
3. Update the `QuestionFactory` component to handle the new type
4. Add rendering logic in form fill and submission pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
