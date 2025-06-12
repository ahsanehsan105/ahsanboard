import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import api from "../utils/api"

const Sidebar = ({ user, onLogout, onToggle }) => {
  const [boards, setBoards] = useState([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    fetchBoards()
  }, [])

  useEffect(() => {
    if (onToggle) {
      onToggle(isCollapsed)
    }
  }, [isCollapsed, onToggle])

  const fetchBoards = async () => {
    try {
      const response = await api.get("/api/boards")
      setBoards(response.data)
    } catch (error) {
      console.error("Error fetching boards:", error)
    }
  }

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-slate-900 shadow-2xl z-50 lg:z-0
          transition-all duration-300 ease-in-out flex flex-col border-r border-slate-700
          ${isCollapsed ? "w-16" : "w-72"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  T
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Trello Workspace</h3>
                  <p className="text-xs text-slate-400 font-medium">Free Plan</p>
                </div>
              </div>
            )}
            {isCollapsed && (
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg mx-auto">
                T
              </div>
            )}
            <button
              onClick={handleToggleCollapse}
              className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition-all duration-200 hidden lg:block"
            >
              {isCollapsed ? "→" : "←"}
            </button>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-lg transition-all duration-200 lg:hidden"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!isCollapsed ? (
            <>
              {/* Boards Section */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Your boards</h4>
                <div className="space-y-1 max-h-96 overflow-y-auto">
                  {boards.map((board) => (
                    <Link
                      key={board._id}
                      to={`/board/${board._id}`}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        location.pathname === `/board/${board._id}`
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-md flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: board.backgroundColor || "#3b82f6" }}
                      ></div>
                      <span className="text-sm font-medium truncate">{board.title}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Create Board Button */}
              <Link
                to="/dashboard"
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-all duration-200"
              >
                <div className="w-5 h-5 bg-slate-700 rounded-md flex items-center justify-center hover:bg-slate-600 transition-colors">
                  <span className="text-sm font-bold text-white">+</span>
                </div>
                <span className="text-sm font-medium">Create new board</span>
              </Link>
            </>
          ) : (
            /* Collapsed sidebar content */
            <div className="space-y-3">
              {/* Boards - collapsed */}
              <div className="space-y-2">
                {boards.map((board) => (
                  <Link
                    key={board._id}
                    to={`/board/${board._id}`}
                    onClick={() => setIsMobileOpen(false)}
                    className={`block p-2 rounded-lg transition-all duration-200 group ${
                      location.pathname === `/board/${board._id}`
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg"
                        : "hover:bg-slate-800"
                    }`}
                    title={board.title}
                  >
                    <div
                      className="w-8 h-8 rounded-md mx-auto shadow-sm transition-transform group-hover:scale-110"
                      style={{ backgroundColor: board.backgroundColor || "#3b82f6" }}
                    ></div>
                  </Link>
                ))}
              </div>

              {/* Create Board - collapsed */}
              <Link
                to="/dashboard"
                onClick={() => setIsMobileOpen(false)}
                className="block p-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-all duration-200 group"
                title="Create new board"
              >
                <div className="w-8 h-8 bg-slate-700 rounded-md flex items-center justify-center mx-auto hover:bg-slate-600 transition-all duration-200 group-hover:scale-110">
                  <span className="text-sm font-bold text-white">+</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden bg-slate-800 p-2 rounded-lg shadow-md border border-slate-700"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  )
}

export default Sidebar
