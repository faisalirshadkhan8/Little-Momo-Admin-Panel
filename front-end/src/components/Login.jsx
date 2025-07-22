import { useState, useEffect } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import '../styles/Login.css'
import momoLogo from '../assets/Logo.webp'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.jsx"; // adjust path if needed

const ADMIN_EMAIL = "faisalirshadkhan8@gmail.com"; // your admin email

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '', rememberMe: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const { darkMode, toggleDarkMode } = useTheme()
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate, isAuthenticated])

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setCredentials({
      ...credentials,
      [e.target.name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password')
      return
    }
    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      const user = userCredential.user
      if (user.email !== ADMIN_EMAIL) {
        // Not the admin, log out and show error
        await auth.signOut()
        setError("You are not authorized to access the admin panel.")
        setLoading(false)
        return
      }
      setError('')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError('Invalid email or password')
    }
    setLoading(false)
  }

  const handleForgotPassword = () => {
    alert('Password reset functionality would be implemented here')
  }

  const handleSignUp = () => {
    alert('Sign up functionality would be implemented here')
  }

  return (
    <div className={`login-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="login-backdrop"></div>
      <div className={`login-form-container ${visible ? 'visible' : ''}`}>
        <div className="login-header">
          <div className="logo-wrapper">
            <img src={momoLogo} alt="Little Momo Logo" className="momo-logo" />
          </div>
          <h1>Little Momo Admin</h1>
          <p>Enter your credentials to access the dashboard</p>
        </div>
        
        {error && (
          <div className="error-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="input-icon" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
              </svg>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                autoComplete="email"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper" style={{ position: 'relative' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="input-icon" viewBox="0 0 16 16">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#888',
                  padding: 0
                }}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M13.359 11.238l1.397 1.398a.75.75 0 1 1-1.06 1.06l-1.398-1.397A7.03 7.03 0 0 1 8 13.25c-3.314 0-6.13-2.37-7.646-5.25C2.07 5.12 4.886 2.75 8 2.75c1.13 0 2.21.23 3.188.64l-1.41 1.41A5.53 5.53 0 0 0 8 4.25c-2.486 0-4.687 1.77-5.938 4C3.313 10.13 5.514 11.75 8 11.75c.67 0 1.32-.09 1.93-.26l1.398 1.398a.75.75 0 1 1-1.06 1.06l-1.398-1.397A7.03 7.03 0 0 1 8 13.25c-3.314 0-6.13-2.37-7.646-5.25C2.07 5.12 4.886 2.75 8 2.75c1.13 0 2.21.23 3.188.64l-1.41 1.41A5.53 5.53 0 0 0 8 4.25c-2.486 0-4.687 1.77-5.938 4C3.313 10.13 5.514 11.75 8 11.75c.67 0 1.32-.09 1.93-.26l1.398 1.398a.75.75 0 1 1-1.06 1.06l-1.398-1.397A7.03 7.03 0 0 1 8 13.25c-3.314 0-6.13-2.37-7.646-5.25C2.07 5.12 4.886 2.75 8 2.75c1.13 0 2.21.23 3.188.64l-1.41 1.41A5.53 5.53 0 0 0 8 4.25c-2.486 0-4.687 1.77-5.938 4C3.313 10.13 5.514 11.75 8 11.75c.67 0 1.32-.09 1.93-.26l1.398 1.398a.75.75 0 1 1-1.06 1.06l-1.398-1.397A7.03 7.03 0 0 1 8 13.25z"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 4a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/></svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={credentials.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe">Remember Me</label>
            </div>
            <button 
              type="button" 
              className="forgot-password" 
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Login'
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <button onClick={handleSignUp} className="signup-link">Sign Up</button></p>
          <div className="demo-credentials">
            <p>Demo: admin@example.com / admin123</p>
          </div>
          <button onClick={toggleDarkMode} className="theme-toggle">
            {darkMode ? '☀️' : ' 🌙'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
