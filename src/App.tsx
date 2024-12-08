import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import NotesPage from "@/pages/NotesPage"

function App() {
  return (
    <Router basename="/notes-app/">
      <div className="App flex min-h-screen w-screen flex-col">
        <Routes>
          <Route path="/notes" element={<NotesPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
