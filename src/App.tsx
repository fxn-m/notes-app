import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import { useEffect, useState } from "react"

import { GoogleOAuthProvider } from "@react-oauth/google"
import LoginPage from "@/pages/LoginPage"
import NotesPage from "@/pages/NotesPage"

export type UserInfo = {
  id: string
  name: string
  email: string
  picture: string
}

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL

const verifyToken = async (token: string) => {
  const response = await fetch(`${VITE_SERVER_URL}/auth/verify-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ google_token: token })
  })

  const data = await response.json()
  return data
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<UserInfo>({ id: "", name: "", email: "", picture: "" })

  useEffect(() => {
    const fetchUserInfo = async (token: string) => {
      const { user } = await verifyToken(token)
      if (!user) {
        setIsAuthenticated(false)
        return
      }
      setUserInfo(user)
      setIsAuthenticated(true)
    }

    const token = localStorage.getItem("google_id_token")
    if (token) {
      try {
        fetchUserInfo(token)
      } catch (error) {
        console.error("Failed to decode token:", error)
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(false)
    }
  }, [isAuthenticated])

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
