import { Route, Routes } from "react-router-dom"
import Landing from "./pages/Landing"
import NotFound from "./pages/NotFound"
import FormBuilder from "./pages/Form"
import FormDetailPage from "./pages/Form-details"
import FormFill from "./pages/FormFill"
import FormSubmissions from "./pages/FormSubmissions"
import Submission from "./pages/Submission"

const App = () => {
  return (
      <div>
        <Routes>
          
          <Route path="/" element={<Landing />} />
          {/* Public routes */} 
          <Route path='forms'>
            <Route path="create" element={< FormBuilder />} />
            <Route path=":id/edit" element={< FormBuilder />} />
            <Route path=":id" element={< FormDetailPage />} />
            <Route path=":id/fill" element={< FormFill />} />
            <Route path=":id/submissions" element={< FormSubmissions />} />
          </Route>

          <Route path='submissions/:id' element={< Submission />} />
          <Route path='*' element={<NotFound />} />

        </Routes>
      </div>
  )
}

export default App