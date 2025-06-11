"use client"

import { useState } from "react"
import api from "../utils/api"

const CardDetailModal = ({ card, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: card.title || "",
    description: card.description || "",
    dueDate: card.dueDate ? new Date(card.dueDate).toISOString().split("T")[0] : "",
    priority: card.priority || "medium",
    labels: card.labels || [],
    completed: card.completed || false,
    comments: card.comments || [],
    assignedTo: card.assignedTo || [],
    estimatedHours: card.estimatedHours || "",
    timeSpent: card.timeSpent || 0,
  })
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [availableUsers] = useState([
    { id: "1", username: "John Doe", email: "john@example.com", avatar: "JD" },
    { id: "2", username: "Alice Smith", email: "alice@example.com", avatar: "AS" },
    { id: "3", username: "Mike Johnson", email: "mike@example.com", avatar: "MJ" },
    { id: "4", username: "Sarah Wilson", email: "sarah@example.com", avatar: "SW" },
  ])

  const priorities = [
    { value: "low", label: "Low", color: "bg-green-500" },
    { value: "medium", label: "Medium", color: "bg-yellow-500" },
    { value: "high", label: "High", color: "bg-orange-500" },
    { value: "urgent", label: "Urgent", color: "bg-red-500" },
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updatedCard = {
        ...card,
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate || null,
        priority: formData.priority,
        labels: formData.labels,
        completed: formData.completed,
        comments: formData.comments,
        assignedTo: formData.assignedTo,
        estimatedHours: formData.estimatedHours ? Number.parseInt(formData.estimatedHours) : null,
        timeSpent: formData.timeSpent,
      }

      const response = await api.put(`/api/cards/${card._id}`, updatedCard)
      onUpdate(response.data)
      onClose()
    } catch (error) {
      console.error("Error updating card:", error)
    } finally {
      setLoading(false)
    }
  }

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        text: newComment.trim(),
        createdAt: new Date().toISOString(),
        user: JSON.parse(localStorage.getItem("user")),
      }

      setFormData({
        ...formData,
        comments: [...formData.comments, comment],
      })
      setNewComment("")
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const isOverdue = () => {
    if (!formData.dueDate || formData.completed) return false
    const now = new Date()
    const due = new Date(formData.dueDate)
    return now > due
  }

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find((p) => p.value === priority)
    return priorityObj ? priorityObj.color : "bg-gray-500"
  }

  const getAvatarColor = (index) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"]
    return colors[index % colors.length]
  }

  const getAssignedUsers = () => {
    return availableUsers.filter((user) => formData.assignedTo.includes(user.id))
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="completed"
                  checked={formData.completed}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-white text-white focus:ring-white"
                />
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="text-xl font-bold text-white bg-transparent border-b border-transparent hover:border-white/50 focus:border-white focus:outline-none"
                  required
                />
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-full transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Status and Priority */}
            <div className="flex items-center space-x-3 mt-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getPriorityColor(formData.priority)}`}
              >
                {priorities.find((p) => p.value === formData.priority)?.label}
              </span>
              {formData.dueDate && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    formData.completed
                      ? "bg-green-500 text-white"
                      : isOverdue()
                        ? "bg-red-500 text-white"
                        : "bg-blue-500 text-white"
                  }`}
                >
                  {formData.completed ? "Completed" : isOverdue() ? "Overdue" : "In Progress"}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    placeholder="Add a detailed description..."
                  />
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Comments</label>
                  <div className="flex space-x-3 mb-4">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={addComment}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {formData.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {comment.user?.username?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{comment.user?.username || "User"}</span>
                          <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-700 text-sm pl-8">{comment.text}</p>
                      </div>
                    ))}
                    {(!formData.comments || formData.comments.length === 0) && (
                      <p className="text-gray-500 text-sm italic text-center py-4">No comments yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Task Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Task Details</h3>

                  {/* Priority */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      {priorities.map((priority) => (
                        <option key={priority.value} value={priority.value}>
                          {priority.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Due Date */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  {/* Estimated Hours */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Hours</label>
                    <input
                      type="number"
                      name="estimatedHours"
                      value={formData.estimatedHours}
                      onChange={handleChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  {/* Time Spent */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Spent (hours)</label>
                    <input
                      type="number"
                      name="timeSpent"
                      value={formData.timeSpent}
                      onChange={handleChange}
                      min="0"
                      step="0.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Assigned Users */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Assigned To</h3>
                  <div className="space-y-2">
                    {getAssignedUsers().map((user, index) => (
                      <div key={user.id} className="flex items-center space-x-2">
                        <div
                          className={`w-6 h-6 ${getAvatarColor(index)} rounded-full flex items-center justify-center text-white text-xs font-bold`}
                        >
                          {user.avatar}
                        </div>
                        <span className="text-sm text-gray-900">{user.username}</span>
                      </div>
                    ))}
                    {getAssignedUsers().length === 0 && <p className="text-sm text-gray-500 italic">No one assigned</p>}
                  </div>
                </div>

                {/* Labels */}
                {formData.labels.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Labels</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.labels.map((label, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CardDetailModal
