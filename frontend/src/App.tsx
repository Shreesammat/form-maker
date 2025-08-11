import { Route, Routes } from "react-router-dom"
import Landing from "./pages/Landing"
import NotFound from "./pages/NotFound"
import FormBuilder from "./pages/Form"

const App = () => {
  return (
      <div>
        <Routes>
          {/* Public routes */} 
          <Route>
            <Route path="/" element={<Landing />} />
            <Route path="/create" element={< FormBuilder />} />
          </Route>

          <Route path='*' element={<NotFound />} />

        </Routes>
      </div>
  )
}

export default App