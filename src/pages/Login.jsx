import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material"
import { AuthContext } from "../context/AuthContext"
import api from "../api/axios"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  // 🔁 Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true })
    }
  }, [isAuthenticated, navigate])

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      })

      // ✅ token expected from backend
      if (res.data?.token) {
        login(res.data.token)
        navigate("/dashboard", { replace: true })
      } else {
        setError("Invalid response from server")
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ xs: 2, sm: 3 }}
      bgcolor="#f1f3f4"
    >
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" textAlign="center" fontWeight={500}>
          Sign in
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          color="text.secondary"
          mt={1}
          mb={3}
        >
          Use your Job Tracker account
        </Typography>

        <form onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError("")
            }}
            required
            disabled={loading}
            error={!!error}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError("")
            }}
            required
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, textTransform: "none" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        {/* 🔗 Register link */}
        <Typography
          variant="body2"
          textAlign="center"
          mt={2}
        >
          Don’t have an account?{" "}
          <span
            style={{ color: "#1a73e8", cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            Create one
          </span>
        </Typography>
      </Paper>
    </Box>
  )
}

export default Login
