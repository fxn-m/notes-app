import NoteOverlay, { StickyNoteType } from "@/components/NoteOverlay"

import { AvatarMenu } from "@/components/avatar-menu"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { type UserInfo } from "@/App"

type NoteBookType = {
  id: number
  name: string
  notes: StickyNoteType[]
}

export type NotesPageProps = {
  onLogout: () => void
  userInfo: UserInfo
}

const NotesPage = ({ onLogout, userInfo }: NotesPageProps) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [noteBooks, setNoteBooks] = useState<NoteBookType[]>([])
  const [activeBook, setActiveBook] = useState<NoteBookType | null>(null)

  const createNotebook = async (userId: string, name: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/notebooks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId, name })
      })
      const data = await response.json()
      console.log("Created notebook:", data)
    } catch (error) {
      console.error("Failed to create notebook:", error)
    }
  }

  useEffect(() => {
    const fetchNoteBooks = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/notebooks?userId=${userInfo.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        })
        const data = await response.json()
        setNoteBooks(data.notebooks)
      } catch (error) {
        console.error("Failed to fetch notebooks:", error)
      }
    }

    fetchNoteBooks()
  }, [userInfo])

  const closeOverlay = (updatedNotes: StickyNoteType[]) => {
    setNoteBooks((prevBooks) => {
      if (activeBook) {
        return prevBooks.map((book) => (book.id === activeBook.id ? { ...book, notes: updatedNotes } : book))
      } else {
        return [
          ...prevBooks,
          {
            id: Date.now(),
            name: `Notebook ${prevBooks.length + 1}`,
            notes: updatedNotes
          }
        ]
      }
    })

    setActiveBook(null)
    setIsOverlayOpen(false)
  }

  return (
    <div className="relative flex min-h-screen w-screen justify-center bg-primary pt-12">
      {/* Sidebar */}
      <div className="absolute left-4 top-4 flex h-1/2 w-[40px] flex-col items-center rounded-full border border-gray-200 bg-white px-2 py-4 shadow-lg">
        <TodoIcon width="24" height="24" />
      </div>

      {/* Main container */}
      <div className="relative flex w-2/3 flex-col items-center rounded-lg border border-gray-100 bg-white pt-12 shadow-xl sm:w-[500px] md:w-[650px] lg:w-[800px] xl:w-[900px] 2xl:w-[1200px]">
        <div className="w-full flex-grow px-8">
          <Button
            onClick={() => {
              setActiveBook(null)
              setIsOverlayOpen(true)
              createNotebook(userInfo.id, `Notebook ${noteBooks.length + 1}`)
            }}
            variant={"default"}
            className="rounded-full px-6"
          >
            Create New Notebook
          </Button>

          {/* Notebooks */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {noteBooks.map((book) => (
              <NotebookCard
                key={book.id}
                book={book}
                noteBooks={noteBooks}
                userInfo={userInfo}
                setActiveBook={setActiveBook}
                setIsOverlayOpen={setIsOverlayOpen}
                setNoteBooks={setNoteBooks}
              />
            ))}
          </div>
        </div>

        {/* Note Overlay */}
        {isOverlayOpen && <NoteOverlay onClose={closeOverlay} notes={activeBook ? activeBook.notes : []} />}
      </div>

      {/* Account info */}
      <div className="absolute bottom-4 left-4">
        <AvatarMenu onLogout={onLogout} userInfo={userInfo} />
      </div>
    </div>
  )
}

const TodoIcon = ({ width = "40", height = "40" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width={width} height={height} className="text-current">
    <rect x="15" y="15" width="70" height="70" rx="15" fill="#FF7043" />
    <rect x="10" y="10" width="70" height="70" rx="15" fill="#FFA726" />
    <rect x="5" y="5" width="70" height="70" rx="15" fill="#FFB74D" />
    <path d="M25 45 L40 60 L65 30" fill="none" stroke="#2E2E2E" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

import { Pencil, Trash2, X, Check } from "lucide-react"

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
      await fetch(`${import.meta.env.VITE_SERVER_URL}/notebooks/${book.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId: userInfo.id })
      })
      setNoteBooks(noteBooks.filter((b: NoteBookType) => b.id !== book.id))
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
      className="group relative flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 hover:shadow"
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
          className="flex-1 bg-transparent text-lg font-medium outline-none"
          autoFocus
        />
      ) : (
        <h2 className="text-lg font-medium">{book.name}</h2>
      )}

      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
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

export default NotesPage
