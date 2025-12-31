import { createContext, useState, useEffect } from "react"

export const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    if (savedToken) {
      setToken(savedToken)
    }
    setLoading(false)
  }, [])

  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken)
    setToken(jwtToken)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
  }

  const value = {
    token,
    isAuthenticated: !!token,
    login,
    logout,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
