import { useState } from "react"
import { Droppable, Draggable } from "react-beautiful-dnd"
import Card from "./Card"
import CreateCardModal from "./CreateCardModal"

const List = ({ list, cards, onCreateCard, onUpdateCard, boardId }) => {
  const [showCreateCardModal, setShowCreateCardModal] = useState(false)

  const handleCreateCard = (cardData) => {
    onCreateCard(list._id, cardData)
    setShowCreateCardModal(false)
  }

  const handleCardUpdate = (updatedCard) => {
    if (onUpdateCard) {
      onUpdateCard(updatedCard)
    }
  }

  return (
    <div
      className="bg-slate-100 rounded-lg p-3 w-72 flex-shrink-0 flex flex-col shadow-xl border border-slate-200"
      style={{ height: "calc(100vh - 140px)" }}
    >
      {/* List Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0 px-1">
        <h3 className="font-bold text-slate-800 text-base">{list.title}</h3>
        <button className="text-slate-600 hover:text-slate-800 hover:bg-slate-200 p-1.5 rounded-md transition-all duration-200">
          ⋯
        </button>
      </div>

      {/* Cards Container */}
      <Droppable droppableId={list._id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto space-y-3 px-1 py-1 ${
              snapshot.isDraggingOver ? "bg-blue-50 border-2 border-dashed border-blue-300 rounded-md p-2" : ""
            } transition-all duration-200`}
            style={{ minHeight: "100px" }}
          >
            {cards.map((card, index) => (
              <Draggable key={card._id} draggableId={card._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${
                      snapshot.isDragging ? "rotate-1 shadow-xl scale-105" : ""
                    } transition-all duration-200`}
                  >
                    <Card card={card} onUpdate={handleCardUpdate} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Card Button */}
      <button
        onClick={() => setShowCreateCardModal(true)}
        className="mt-2 p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-2 flex-shrink-0"
      >
        <span className="w-5 h-5 bg-slate-300 rounded-full flex items-center justify-center text-slate-700">+</span>
        <span>Add a card</span>
      </button>

      {showCreateCardModal && (
        <CreateCardModal onClose={() => setShowCreateCardModal(false)} onSubmit={handleCreateCard} boardId={boardId} />
      )}
    </div>
  )
}

export default List
