import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import "./header.css"

const Header = () => {
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()
  const { logout } = authContext || {}
  
  if (!authContext || !logout) {
    return null
  }

  return (
    <header className="header">
      <span className="brand" onClick={() => navigate("/dashboard")}>
        Smart Job Tracker
      </span>

      <button className="logout" onClick={() => {
        logout()
        navigate("/login")
      }}>
        Logout
      </button>
    </header>
  )
}

export default Header
