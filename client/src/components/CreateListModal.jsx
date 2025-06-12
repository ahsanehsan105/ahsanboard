import { useState } from "react"

const CreateListModal = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit({ title: title.trim() })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Add New List</h2>
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
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1">List Name</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                placeholder="Enter list name"
                autoFocus
              />
            </div>

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
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Add List
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateListModal
