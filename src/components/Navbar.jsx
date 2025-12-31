import { NavLink, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import "./navbar.css"

const Navbar = () => {
  const { logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()              // ✅ clears token + auth state
    navigate("/login")    // ✅ redirect immediately
  }

  return (
    <nav className="navbar">
      <h2 className="logo">Smart Job Tracker</h2>

      <div className="nav-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/ai"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          🤖 AI Tools
        </NavLink>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
