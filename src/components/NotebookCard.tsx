import { Check, Pencil, Trash2, X } from "lucide-react"
import { NoteBookType, UserInfo } from "@/types"

import { useState } from "react"

type NotebookCardProps = {
  book: NoteBookType
  noteBooks: NoteBookType[]
  userInfo: UserInfo
  setActiveBook: (book: NoteBookType) => void
  setIsOverlayOpen: (isOpen: boolean) => void
  setNoteBooks: (books: NoteBookType[] | ((prevBooks: NoteBookType[]) => NoteBookType[])) => void
}

const NotebookCard = ({ book, noteBooks, userInfo, setActiveBook, setIsOverlayOpen, setNoteBooks }: NotebookCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(book.name)

  const handleDelete = async (event: React.MouseEvent) => {
    event.stopPropagation()
    try {
      setNoteBooks(noteBooks.filter((b: NoteBookType) => b.id !== book.id))
      await fetch(`${import.meta.env.VITE_SERVER_URL}/notebooks/${book.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: userInfo.id })
      })
    } catch (error) {
      console.error("Failed to delete notebook:", error)
    }
  }

  const handleEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!isEditing) {
      setIsEditing(true)
      return
    }

    try {
      await fetch(`${import.meta.env.VITE_SERVER_URL}/notebooks/${book.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: editedName })
      })

      setNoteBooks((prevBooks) => prevBooks.map((b) => (b.id === book.id ? { ...b, name: editedName } : b)))
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update notebook:", error)
    }
  }

  return (
    <div
      className="group relative flex min-h-16 cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 hover:shadow"
      onClick={() => {
        if (!isEditing) {
          setActiveBook(book)
          setIsOverlayOpen(true)
        }
      }}
    >
      {isEditing ? (
        <input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="min-w-0 flex-1 bg-transparent text-lg font-medium leading-none outline-none"
          autoFocus
          maxLength={16}
        />
      ) : (
        <h2 className="min-w-0 flex-1 select-none text-lg font-medium leading-none">{book.name}</h2>
      )}

      <div className="flex items-center gap-2 transition-opacity sm:hidden sm:opacity-0 sm:group-hover:flex sm:group-hover:opacity-100">
        {isEditing ? (
          <>
            <button onClick={handleEdit} className="rounded-full p-1 hover:bg-green-50">
              <Check className="h-4 w-4 text-green-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(false)
                setEditedName(book.name)
              }}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </>
        ) : (
          <>
            <button onClick={handleEdit} className="rounded-full p-1 hover:bg-gray-100">
              <Pencil className="h-4 w-4 text-gray-600" />
            </button>
            <button onClick={handleDelete} className="rounded-full p-1 hover:bg-red-50">
              <Trash2 className="h-4 w-4 text-red-600" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default NotebookCard
