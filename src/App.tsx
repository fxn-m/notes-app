import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { useEffect, useState } from "react"

import { GoogleOAuthProvider } from "@react-oauth/google"
import LoginPage from "@/pages/LoginPage"
import NotesPage from "@/pages/NotesPage"
import { jwtDecode } from "jwt-decode"

export type UserInfo = {
  name: string
  email: string
  picture: string
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", email: "", picture: "" })

  useEffect(() => {
    const token = localStorage.getItem("google_id_token")
    if (token) {
      try {
        const decoded: { email: string; name: string; picture: string } = jwtDecode(token)
        setUserInfo(decoded)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Failed to decode token:", error)
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("google_id_token")
    setIsAuthenticated(false)
  }

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
