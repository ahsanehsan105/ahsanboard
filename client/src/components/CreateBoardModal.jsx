import { useState } from "react"

const CreateBoardModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    backgroundColor: "#1e40af",
    members: [],
  })

  const colors = [
    "#1e40af", // Blue
    "#dc2626", // Red
    "#059669", // Green
    "#d97706", // Orange
    "#7c3aed", // Purple
    "#db2777", // Pink
    "#0891b2", // Cyan
    "#65a30d", // Lime
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Create New Project</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-full transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="p-5">
            {/* Background Preview */}
            <div className="mb-4">
              <div
                className="w-full h-20 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-inner"
                style={{ backgroundColor: formData.backgroundColor }}
              >
                {formData.title || "Project Preview"}
              </div>
            </div>

            {/* Background Colors */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Choose Theme</label>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, backgroundColor: color })}
                    className={`w-full h-10 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                      formData.backgroundColor === color ? "border-gray-800 shadow-lg" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Project Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Enter project name"
              />
            </div>

            {/* Project Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                rows="2"
                placeholder="Describe your project"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.title.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateBoardModal
