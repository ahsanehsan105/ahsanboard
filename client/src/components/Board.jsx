import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { DragDropContext } from "react-beautiful-dnd"
import api from "../utils/api"
import List from "./List"
import CreateListModal from "./CreateListModal"

const Board = ({ sidebarCollapsed }) => {
  const { boardId } = useParams()
  const [board, setBoard] = useState(null)
  const [lists, setLists] = useState([])
  const [cards, setCards] = useState({})
  const [loading, setLoading] = useState(true)
  const [showCreateListModal, setShowCreateListModal] = useState(false)

  useEffect(() => {
    fetchBoardData()
  }, [boardId])

  const fetchBoardData = async () => {
    try {
      const [boardResponse, listsResponse] = await Promise.all([
        api.get(`/api/boards/${boardId}`),
        api.get(`/api/boards/${boardId}/lists`),
      ])

      setBoard(boardResponse.data)
      setLists(listsResponse.data)

      // Update document title with board name
      document.title = `${boardResponse.data.title} | Trello`

      // Fetch cards for each list
      const cardsData = {}
      for (const list of listsResponse.data) {
        const cardsResponse = await api.get(`/api/lists/${list._id}/cards`)
        cardsData[list._id] = cardsResponse.data
      }
      setCards(cardsData)
    } catch (error) {
      console.error("Error fetching board data:", error)
      // Fallback for demo
      setBoard({ title: "Project Board" })
      document.title = "Project Board | Trello"
    } finally {
      setLoading(false)
    }
  }

  const handleCreateList = async (listData) => {
    try {
      const response = await api.post(`/api/boards/${boardId}/lists`, {
        ...listData,
        position: lists.length,
      })
      setLists([...lists, response.data])
      setCards({ ...cards, [response.data._id]: [] })
      setShowCreateListModal(false)
    } catch (error) {
      console.error("Error creating list:", error)
    }
  }

  const handleCreateCard = async (listId, cardData) => {
    try {
      const response = await api.post(`/api/lists/${listId}/cards`, {
        ...cardData,
        position: cards[listId]?.length || 0,
      })
      setCards({
        ...cards,
        [listId]: [...(cards[listId] || []), response.data],
      })
    } catch (error) {
      console.error("Error creating card:", error)
    }
  }

  const handleUpdateCard = async (updatedCard) => {
    try {
      // Update the card in the state
      const listId = updatedCard.list
      const updatedCards = cards[listId].map((card) => (card._id === updatedCard._id ? updatedCard : card))

      setCards({
        ...cards,
        [listId]: updatedCards,
      })
    } catch (error) {
      console.error("Error updating card:", error)
    }
  }

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    const sourceListId = source.droppableId
    const destListId = destination.droppableId
    const sourceCards = Array.from(cards[sourceListId])
    const destCards = sourceListId === destListId ? sourceCards : Array.from(cards[destListId])

    // Remove card from source
    const [movedCard] = sourceCards.splice(source.index, 1)

    // Add card to destination
    if (sourceListId === destListId) {
      sourceCards.splice(destination.index, 0, movedCard)
      setCards({
        ...cards,
        [sourceListId]: sourceCards,
      })
    } else {
      destCards.splice(destination.index, 0, movedCard)
      setCards({
        ...cards,
        [sourceListId]: sourceCards,
        [destListId]: destCards,
      })

      // Update card's list in backend
      try {
        await api.put(`/api/cards/${draggableId}`, {
          ...movedCard,
          list: destListId,
          position: destination.index,
        })
      } catch (error) {
        console.error("Error updating card:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white text-xl font-semibold">Loading board...</div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-x-auto overflow-y-hidden">
      <div className={`h-full transition-all duration-300 ${sidebarCollapsed ? "p-6" : "p-4"}`}>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4 h-full pb-4 min-w-max">
            {lists.map((list) => (
              <List
                key={list._id}
                list={list}
                cards={cards[list._id] || []}
                onCreateCard={handleCreateCard}
                onUpdateCard={handleUpdateCard}
                boardId={boardId}
                sidebarCollapsed={sidebarCollapsed}
              />
            ))}

            {/* Add List Button */}
            <div className="flex-shrink-0">
              <button
                onClick={() => setShowCreateListModal(true)}
                className={`bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white rounded-lg text-left transition-all duration-200 shadow-lg border border-white/10 ${
                  sidebarCollapsed ? "p-5 w-80" : "p-4 w-72"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">+</span>
                  <span className="font-medium">Add another list</span>
                </div>
              </button>
            </div>
          </div>
        </DragDropContext>

        {showCreateListModal && (
          <CreateListModal onClose={() => setShowCreateListModal(false)} onSubmit={handleCreateList} />
        )}
      </div>
    </div>
  )
}

export default Board
