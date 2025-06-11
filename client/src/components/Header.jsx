"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"

const Header = ({ user, sidebarCollapsed, onLogout }) => {
  const { boardId } = useParams()
  const location = useLocation()
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [boardTitle, setBoardTitle] = useState("")
  const dropdownRef = useRef(null)

  const isOnBoard = location.pathname.includes("/board/")

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch board title when on a board
  useEffect(() => {
    if (isOnBoard && boardId) {
      // In a real app, you'd fetch this from the API
      // For now, we'll use a placeholder or get it from localStorage/context
      setBoardTitle("Project Board") // You can replace this with actual board data
    } else {
      setBoardTitle("")
    }
  }, [isOnBoard, boardId])

  const handleLogout = () => {
    setShowUserDropdown(false)
    onLogout()
  }

  return (
    <div className="flex-shrink-0 bg-black bg-opacity-20 backdrop-blur-sm border-b border-white border-opacity-20 relative z-[100]">
      <div
        className={`flex items-center justify-between py-3 transition-all duration-300 ${
          sidebarCollapsed ? "px-6 lg:px-8" : "px-4 lg:px-6"
        }`}
      >
        {/* Left Section - Trello Text */}
        <div className="flex items-center">
          <span
            className={`text-white font-bold transition-all duration-300 ${sidebarCollapsed ? "text-2xl" : "text-xl"}`}
          >
            Trello
          </span>
        </div>

        {/* Center Section - Board Title */}
        {isOnBoard && boardTitle && (
          <div className="flex-1 flex justify-center">
            <h1
              className={`text-white font-bold transition-all duration-300 ${
                sidebarCollapsed ? "text-2xl" : "text-xl"
              }`}
            >
              {boardTitle}
            </h1>
          </div>
        )}

        {/* Right Section - Notifications & User */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-md transition-all duration-200">
            🔔
          </button>

          {/* User Avatar Dropdown */}
          <div className="relative z-[999999]" ref={dropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className={`bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                sidebarCollapsed ? "w-10 h-10 text-base" : "w-8 h-8 text-sm"
              }`}
            >
              {user.username.charAt(0).toUpperCase()}
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div
                className="absolute right-0 mt-2 w-64 bg-slate-800 rounded-lg shadow-2xl border border-slate-700 z-[999999] overflow-hidden"
                style={{ zIndex: 999999 }}
              >
                {/* User Info */}
                <div className="px-4 py-3 border-b border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{user.username}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center space-x-3">
                    <span className="text-base">👤</span>
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center space-x-3">
                    <span className="text-base">⚙️</span>
                    <span>Account Settings</span>
                  </button>
                </div>

                {/* Logout Section */}
                <div className="border-t border-slate-700 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900 hover:bg-opacity-20 hover:text-red-300 transition-colors flex items-center space-x-3"
                  >
                    <span className="text-base">⏻</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
