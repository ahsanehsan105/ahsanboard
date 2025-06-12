import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../utils/api"
import CreateBoardModal from "../components/CreateBoardModal"

const Dashboard = ({ sidebarCollapsed }) => {
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Mock participants data - in real app, this would come from the board data
  const mockParticipants = [
    { id: "1", name: "John Doe", avatar: "JD", color: "bg-blue-500" },
    { id: "2", name: "Alice Smith", avatar: "AS", color: "bg-green-500" },
    { id: "3", name: "Mike Johnson", avatar: "MJ", color: "bg-purple-500" },
    { id: "4", name: "Sarah Wilson", avatar: "SW", color: "bg-pink-500" },
    { id: "5", name: "Tom Brown", avatar: "TB", color: "bg-indigo-500" },
    { id: "6", name: "Emma Davis", avatar: "ED", color: "bg-yellow-500" },
  ]

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      const response = await api.get("/api/boards")
      // Add mock participants to each board
      const boardsWithParticipants = response.data.map((board, index) => ({
        ...board,
        participants: getRandomParticipants(mockParticipants, 2 + (index % 4)), // 2-5 participants per board
      }))
      setBoards(boardsWithParticipants)
    } catch (error) {
      console.error("Error fetching boards:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRandomParticipants = (participants, count) => {
    const shuffled = [...participants].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  const handleCreateBoard = async (boardData) => {
    try {
      const response = await api.post("/api/boards", boardData)
      // Add random participants to new board
      const newBoard = {
        ...response.data,
        participants: getRandomParticipants(mockParticipants, 3),
      }
      setBoards([...boards, newBoard])
      setShowCreateModal(false)
    } catch (error) {
      console.error("Error creating board:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl font-semibold">Loading boards...</div>
      </div>
    )
  }

  // Adjust grid columns based on sidebar state
  const getGridCols = () => {
    if (sidebarCollapsed) {
      return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
    }
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
  }

  const getRecentViewedCols = () => {
    if (sidebarCollapsed) {
      return boards.slice(0, 6)
    }
    return boards.slice(0, 4)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className={`p-4 transition-all duration-300 ${sidebarCollapsed ? "lg:p-8 xl:p-12" : "lg:p-8"}`}>
        {/* Header */}
        <div className="mb-8">
          <h1
            className={`font-bold text-white mb-2 transition-all duration-300 ${
              sidebarCollapsed ? "text-3xl lg:text-4xl xl:text-5xl" : "text-2xl lg:text-3xl"
            }`}
          >
            Your Workspace
          </h1>
          <p
            className={`text-slate-300 transition-all duration-300 ${
              sidebarCollapsed ? "text-lg lg:text-xl" : "text-base lg:text-lg"
            }`}
          >
            Manage your boards and projects efficiently
          </p>
        </div>

        {/* Recently Viewed */}
        {boards.length > 0 && (
          <div className="mb-8">
            <h2
              className={`font-bold text-white mb-4 flex items-center transition-all duration-300 ${
                sidebarCollapsed ? "text-xl lg:text-2xl" : "text-lg lg:text-xl"
              }`}
            >
              <span className="mr-3 text-xl">🕒</span>
              Recently viewed
            </h2>
            <div className="overflow-x-auto pb-4">
              <div className="flex space-x-4 min-w-max">
                {getRecentViewedCols().map((board) => (
                  <Link
                    key={board._id}
                    to={`/board/${board._id}`}
                    className={`group relative overflow-hidden rounded-xl flex-shrink-0 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl border border-white/10 ${
                      sidebarCollapsed ? "h-32 w-80" : "h-28 w-72"
                    }`}
                    style={{ backgroundColor: board.backgroundColor || "#3b82f6" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40 group-hover:from-black/20 group-hover:to-black/50 transition-all duration-300"></div>
                    <div className="relative p-4 h-full flex flex-col justify-between">
                      <h3
                        className={`text-white font-bold leading-tight drop-shadow-md transition-all duration-300 ${
                          sidebarCollapsed ? "text-xl" : "text-lg"
                        }`}
                      >
                        {board.title}
                      </h3>

                      {/* Participants */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center -space-x-2">
                          {board.participants?.slice(0, 4).map((participant, index) => (
                            <div
                              key={participant.id}
                              className={`${participant.color} w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm transition-transform hover:scale-110`}
                              title={participant.name}
                            >
                              {participant.avatar}
                            </div>
                          ))}
                          {board.participants?.length > 4 && (
                            <div className="bg-gray-600 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm">
                              +{board.participants.length - 4}
                            </div>
                          )}
                        </div>
                        <div className="text-white/80 text-xs font-medium">
                          {board.participants?.length || 0} members
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Your Boards */}
        <div>
          <h2
            className={`font-bold text-white mb-4 flex items-center transition-all duration-300 ${
              sidebarCollapsed ? "text-xl lg:text-2xl" : "text-lg lg:text-xl"
            }`}
          >
            <span className="mr-3 text-xl">📋</span>
            Your boards
          </h2>

          {boards.length === 0 ? (
            <div className="text-center py-16">
              <div
                className={`bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg transition-all duration-300 ${
                  sidebarCollapsed ? "w-32 h-32" : "w-24 h-24"
                }`}
              >
                <span
                  className={`text-white transition-all duration-300 ${sidebarCollapsed ? "text-5xl" : "text-4xl"}`}
                >
                  📋
                </span>
              </div>
              <div
                className={`text-white font-bold mb-4 transition-all duration-300 ${
                  sidebarCollapsed ? "text-2xl lg:text-3xl" : "text-xl"
                }`}
              >
                No boards yet
              </div>
              <p
                className={`text-slate-300 mb-8 max-w-md mx-auto transition-all duration-300 ${
                  sidebarCollapsed ? "text-lg max-w-lg" : "text-base"
                }`}
              >
                Create your first board to get started with organizing your tasks and collaborating with your team
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                  sidebarCollapsed ? "px-8 py-4 text-lg" : "px-6 py-3 text-base"
                }`}
              >
                Create Your First Board
              </button>
            </div>
          ) : (
            <div className={`grid gap-6 transition-all duration-300 ${getGridCols()}`}>
              {boards.map((board) => (
                <Link
                  key={board._id}
                  to={`/board/${board._id}`}
                  className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl border border-white/10 h-40"
                  style={{ backgroundColor: board.backgroundColor || "#3b82f6" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40 group-hover:from-black/20 group-hover:to-black/50 transition-all duration-300"></div>
                  <div className="relative p-5 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-white text-xl font-bold leading-tight drop-shadow-md mb-2">{board.title}</h3>
                      {board.description && <p className="text-white/80 text-sm line-clamp-2">{board.description}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Participants */}
                      <div className="flex items-center -space-x-2">
                        {board.participants?.slice(0, 3).map((participant, index) => (
                          <div
                            key={participant.id}
                            className={`${participant.color} w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-sm transition-transform hover:scale-110`}
                            title={participant.name}
                          >
                            {participant.avatar}
                          </div>
                        ))}
                        {board.participants?.length > 3 && (
                          <div className="bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-sm">
                            +{board.participants.length - 3}
                          </div>
                        )}
                      </div>

                      {/* Board Info */}
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                        <div className="text-xs text-white font-medium">{board.participants?.length || 0} members</div>
                        <div className="text-xs text-white/80">{new Date().toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {/* Create New Board */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-all duration-300 group shadow-lg border-2 border-dashed border-white/20 hover:border-white/30 h-40"
              >
                <div className="text-center p-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500/50 to-blue-600/50 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-bold text-white">+</span>
                  </div>
                  <div className="text-lg font-semibold">Create new board</div>
                  <p className="text-white/70 text-sm mt-1">Add a new project board</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && <CreateBoardModal onClose={() => setShowCreateModal(false)} onSubmit={handleCreateBoard} />}
    </div>
  )
}

export default Dashboard
