import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Board from "./components/Board"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const handleLogin = (token, userData) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl font-semibold">Loading...</div>
      </div>
    )
  }

  return (
    <Router>
      <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
          <Route
            path="/dashboard"
            element={
              user ? (
                <div className="flex h-full">
                  <Sidebar user={user} onLogout={handleLogout} onToggle={handleSidebarToggle} />
                  <div
                    className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
                      sidebarCollapsed ? "ml-0 lg:ml-16" : "ml-0 lg:ml-72"
                    }`}
                  >
                    <Header user={user} sidebarCollapsed={sidebarCollapsed} onLogout={handleLogout} />
                    <main className="flex-1 overflow-hidden">
                      <Dashboard sidebarCollapsed={sidebarCollapsed} />
                    </main>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/board/:boardId"
            element={
              user ? (
                <div className="flex h-full">
                  <Sidebar user={user} onLogout={handleLogout} onToggle={handleSidebarToggle} />
                  <div
                    className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
                      sidebarCollapsed ? "ml-0 lg:ml-16" : "ml-0 lg:ml-72"
                    }`}
                  >
                    <Header user={user} sidebarCollapsed={sidebarCollapsed} onLogout={handleLogout} />
                    <main className="flex-1 overflow-hidden">
                      <Board sidebarCollapsed={sidebarCollapsed} />
                    </main>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
