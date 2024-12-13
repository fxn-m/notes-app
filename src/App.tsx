import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { useEffect, useState } from "react"

import { GoogleOAuthProvider } from "@react-oauth/google"
import Loading from "@/components/Loading"
import LoginPage from "@/pages/LoginPage"
import NotesPage from "@/pages/NotesPage"
import { UserInfo } from "@/types"
import { fetchUserInfo } from "./lib/utils"

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo>({ id: "", name: "", email: "", picture: "" })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("google_id_token")
    if (token) {
      fetchUserInfo({ token, setIsAuthenticated, setUserInfo, setLoading })
    } else {
      setIsAuthenticated(false)
      setLoading(false)
    }
  }, [isAuthenticated])

  const handleLogout = () => {
    localStorage.removeItem("google_id_token")
    setIsAuthenticated(false)
  }

  if (loading) return <Loading />

  return (
    <GoogleOAuthProvider clientId="146729163411-9j93smr5d0mq2g6ki6l8ifjipvuk6474.apps.googleusercontent.com">
      <Router basename="/notes-app/">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage setAuth={setIsAuthenticated} />} />
          <Route path="/" element={isAuthenticated ? <NotesPage onLogout={handleLogout} userInfo={userInfo} /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
