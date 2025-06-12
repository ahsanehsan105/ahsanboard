import { useState, useEffect } from "react"

const CreateCardModal = ({ onClose, onSubmit, boardId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    assignedTo: [],
    labels: [],
    estimatedHours: "",
    completed: false,
  })
  const [availableUsers, setAvailableUsers] = useState([])
  const [newLabel, setNewLabel] = useState("")

  const priorities = [
    { value: "low", label: "Low", color: "bg-green-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "high", label: "High", color: "bg-orange-500" },
    { value: "urgent", label: "Urgent", color: "bg-red-500" },
  ]

  useEffect(() => {
    // Fetch available users for the board
    fetchBoardMembers()
    // eslint-disable-next-line
  }, [boardId])

  const fetchBoardMembers = async () => {
    try {
      // For demo purposes, using mock data
      setAvailableUsers([
        { id: "1", username: "John Doe", email: "john@example.com", avatar: "JD" },
        { id: "2", username: "Alice Smith", email: "alice@example.com", avatar: "AS" },
        { id: "3", username: "Mike Johnson", email: "mike@example.com", avatar: "MJ" },
        { id: "4", username: "Sarah Wilson", email: "sarah@example.com", avatar: "SW" },
      ])
    } catch (error) {
      console.error("Error fetching board members:", error)
    }
  }

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    if (formData.title.trim()) {
      onSubmit({
        ...formData,
        title: formData.title.trim(),
        dueDate: formData.dueDate || null,
        estimatedHours: formData.estimatedHours ? Number.parseInt(formData.estimatedHours) : null,
      })
    }
  }

  const handleUserToggle = (userId) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(userId)
        ? prev.assignedTo.filter((id) => id !== userId)
        : [...prev.assignedTo, userId],
    }))
  }

  const addLabel = () => {
    if (newLabel.trim() && !formData.labels.includes(newLabel.trim())) {
      setFormData((prev) => ({
        ...prev,
        labels: [...prev.labels, newLabel.trim()],
      }))
      setNewLabel("")
    }
  }

  const removeLabel = (labelToRemove) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels.filter((label) => label !== labelToRemove),
    }))
  }

  const getAvatarColor = (index) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"]
    return colors[index % colors.length]
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999999] p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-2 sm:mx-4 border border-gray-200 overflow-hidden max-h-[98vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-3 sm:px-5 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-white">Create New Task</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-full transition-all duration-200"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-3 sm:p-5">
            {/* Task Title */}
            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Task Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm"
                placeholder="Enter task title"
                autoFocus
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm"
                rows="2"
                placeholder="Describe the task"
              />
            </div>

            {/* Priority, Due Date, Est. Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {/* Priority */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm"
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm"
                />
              </div>

              {/* Estimated Hours */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Est. Hours</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm"
                  placeholder="Hours"
                />
              </div>
            </div>

            {/* Assign To */}
            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Assign To</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableUsers.map((user, index) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserToggle(user.id)}
                    className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer transition-all duration-200 ${
                      formData.assignedTo.includes(user.id)
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 ${getAvatarColor(index)} rounded-full flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {user.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{user.username}</p>
                    </div>
                    {formData.assignedTo.includes(user.id) && (
                      <div className="text-purple-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Labels */}
            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Labels</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLabel())}
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-xs sm:text-sm"
                  placeholder="Add a label"
                />
                <button
                  type="button"
                  onClick={addLabel}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-xs sm:text-sm"
                >
                  Add
                </button>
              </div>
              {formData.labels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {formData.labels.map((label, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex items-center"
                    >
                      {label}
                      <button
                        type="button"
                        onClick={() => removeLabel(label)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                        aria-label={`Remove label ${label}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-3 sm:p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateCardModal