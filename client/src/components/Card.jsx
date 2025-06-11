"use client"

import { useState } from "react"
import CardDetailModal from "./CardDetailModal"
import api from "../utils/api"

const Card = ({ card, onUpdate }) => {
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [isCompleted, setIsCompleted] = useState(card.completed || false)

  // Mock assigned users - in real app, this would come from card.assignedTo
  const getAssignedUsers = () => {
    const allUsers = [
      { id: "1", name: "John Doe", avatar: "JD", color: "bg-blue-500" },
      { id: "2", name: "Alice Smith", avatar: "AS", color: "bg-green-500" },
      { id: "3", name: "Mike Johnson", avatar: "MJ", color: "bg-purple-500" },
      { id: "4", name: "Sarah Wilson", avatar: "SW", color: "bg-pink-500" },
      { id: "5", name: "Tom Brown", avatar: "TB", color: "bg-indigo-500" },
      { id: "6", name: "Emma Davis", avatar: "ED", color: "bg-yellow-500" },
    ]

    // For demo, assign 1-3 random users to each card
    const assignedCount = 1 + (card._id.length % 3)
    const shuffled = [...allUsers].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, assignedCount)
  }

  const assignedUsers = getAssignedUsers()

  const handleCardClick = (e) => {
    // Prevent opening modal when clicking on checkbox
    if (e.target.type === "checkbox") return
    setShowDetailModal(true)
  }

  const handleCheckboxClick = async (e) => {
    e.stopPropagation()
    const newCompletedStatus = !isCompleted
    setIsCompleted(newCompletedStatus)

    try {
      await api.put(`/api/cards/${card._id}`, {
        ...card,
        completed: newCompletedStatus,
      })
      if (onUpdate) {
        onUpdate({
          ...card,
          completed: newCompletedStatus,
        })
      }
    } catch (error) {
      console.error("Error updating card completion status:", error)
      setIsCompleted(isCompleted) // Revert on error
    }
  }

  const handleCardUpdate = (updatedCard) => {
    setIsCompleted(updatedCard.completed)
    if (onUpdate) {
      onUpdate(updatedCard)
    }
  }

  // Check if task is overdue
  const isOverdue = () => {
    if (!card.dueDate || isCompleted) return false
    const now = new Date()
    const due = new Date(card.dueDate)
    return now > due
  }

  // Format due date
  const formatDueDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
  }

  const commentCount = card.comments?.length || 0

  // Generate label colors
  const getLabelColor = (index) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"]
    return colors[index % colors.length]
  }

  return (
    <>
      <div
        className="bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-slate-200"
        onClick={handleCardClick}
      >
        {/* Card Labels */}
        {card.labels && card.labels.length > 0 && (
          <div className="flex items-center space-x-1 mb-3">
            {card.labels.slice(0, 3).map((label, index) => (
              <span
                key={index}
                className={`${getLabelColor(index)} h-2 rounded-full`}
                style={{ width: `${Math.max(20, Math.min(40, label.length * 3))}px` }}
              ></span>
            ))}
            {card.labels.length > 3 && (
              <span className="text-xs text-slate-500 font-medium">+{card.labels.length - 3}</span>
            )}
          </div>
        )}

        {/* Card Title with Checkbox */}
        <div className="flex items-start space-x-2 mb-2">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleCheckboxClick}
            className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            onClick={(e) => e.stopPropagation()}
          />
          <h4
            className={`text-slate-800 text-sm font-semibold leading-tight ${
              isCompleted ? "line-through text-slate-500" : ""
            }`}
          >
            {card.title}
          </h4>
        </div>

        {/* Card Description */}
        {card.description && (
          <p className="text-slate-600 text-xs mb-3 leading-relaxed line-clamp-2 pl-6">{card.description}</p>
        )}

        {/* Card Footer */}
        <div className="flex items-center justify-between mt-2">
          {/* Card Actions */}
          <div className="flex items-center space-x-2 text-slate-500">
            {commentCount > 0 && (
              <div className="flex items-center space-x-1 hover:bg-slate-100 px-2 py-1 rounded transition-colors">
                <span className="text-xs">💬</span>
                <span className="text-xs font-medium">{commentCount}</span>
              </div>
            )}

            {card.dueDate && (
              <div
                className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                  isCompleted ? "text-green-600" : isOverdue() ? "text-red-600 font-medium" : "text-slate-600"
                }`}
              >
                <span>📅</span>
                <span>{formatDueDate(card.dueDate)}</span>
              </div>
            )}
          </div>

          {/* Assigned Users Avatars */}
          <div className="flex items-center -space-x-2">
            {assignedUsers.slice(0, 3).map((user, index) => (
              <div
                key={user.id}
                className={`w-6 h-6 ${user.color} rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm transition-transform hover:scale-110`}
                title={user.name}
              >
                {user.avatar}
              </div>
            ))}
            {assignedUsers.length > 3 && (
              <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm">
                +{assignedUsers.length - 3}
              </div>
            )}
          </div>
        </div>

        {/* Status Indicator */}
        {card.dueDate && (
          <div className="mt-2 pt-2 border-t border-slate-100">
            <div
              className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                isCompleted
                  ? "bg-green-100 text-green-800"
                  : isOverdue()
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
              }`}
            >
              {isCompleted ? "Completed" : isOverdue() ? "Overdue" : "In Progress"}
            </div>
          </div>
        )}
      </div>

      {showDetailModal && (
        <CardDetailModal card={card} onClose={() => setShowDetailModal(false)} onUpdate={handleCardUpdate} />
      )}
    </>
  )
}

export default Card
