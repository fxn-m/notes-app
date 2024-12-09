import NoteOverlay, { StickyNoteType } from "@/components/NoteOverlay"

import { AvatarMenu } from "@/components/avatar-menu"
import { Button } from "@/components/ui/button"
import NotebookCard from "@/components/NotebookCard"
import { v4 as uuidv4 } from "uuid"

import { useEffect, useState } from "react"
import { type UserInfo } from "@/App"

export type NoteBookType = {
  id: string
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
      const id = uuidv4()
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/notebooks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, userId, name })
      })
      const data = await response.json()
      console.log("Created notebook:", data)
      return id
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
    console.log("Updated notes:", updatedNotes)
    setNoteBooks((prevBooks) => {
      if (activeBook && activeBook.id && prevBooks.some((book) => book.id === activeBook.id)) {
        return prevBooks.map((book) => (book.id === activeBook.id ? { ...book, notes: updatedNotes } : book))
      } else {
        return [
          ...prevBooks,
          {
            id: activeBook !== null ? activeBook.id : uuidv4(),
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
            onClick={async () => {
              setActiveBook(null)
              setIsOverlayOpen(true)
              const id = await createNotebook(userInfo.id, `Notebook ${noteBooks.length + 1}`)
              if (!id) return
              setActiveBook({ id, name: `Notebook ${noteBooks.length + 1}`, notes: [] })
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
        {isOverlayOpen && activeBook && <NoteOverlay onClose={closeOverlay} activeBook={activeBook} userInfo={userInfo} />}
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

export default NotesPage
