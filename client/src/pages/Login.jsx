"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import api from "../utils/api"

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await api.post("/api/login", formData)
      // Call the onLogin prop with token and user data
      onLogin(response.data.token, response.data.user)
    } catch (error) {
      console.error("Login error:", error)

      // Handle specific error cases based on the API response
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        if (error.response.status === 401) {
          // This is the status code your API returns for invalid credentials
          setError("Invalid credentials. Please check your email and password.")
        } else if (error.response.status === 404) {
          // This would be if your API specifically returns 404 for user not found
          setError("User not found with this email. Please register first.")
        } else {
          // For any other error status, use the error message from the API
          setError(error.response.data.error || "An error occurred during login")
        }
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please try again later.")
      } else {
        // Something happened in setting up the request
        setError("Error setting up request. Please try again.")
      }

      // Clear the password field on error
      setFormData({
        ...formData,
        password: "",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-4 px-2 sm:px-4 lg:px-6">
      <div className="max-w-sm w-full space-y-6">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h2>
            <p className="text-gray-600 text-sm">Sign in to your Trello account</p>
          </div>

          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md text-sm">{error}</div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <div className="text-center mt-2">
              <Link to="/register" className="text-blue-600 hover:text-blue-500 text-xs">
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
