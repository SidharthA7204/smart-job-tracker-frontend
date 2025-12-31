import { Navigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext)

  // ⏳ Wait until auth is resolved
  if (loading) return null

  // 🔐 Not logged in → login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // ✅ Logged in → show page
  return children
}

export default ProtectedRoute
