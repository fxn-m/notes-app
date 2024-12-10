import { BookPlus, Loader2, RefreshCw } from "lucide-react"
import { NoteBookType, NotesPageProps, StickyNoteType } from "@/types"
import { createNotebook, fetchNoteBooks } from "@/lib/utils"
import { useEffect, useState } from "react"

import { AvatarMenu } from "@/components/avatar-menu"
import { Button } from "@/components/ui/button"
import NoteOverlay from "@/components/NoteOverlay"
import NotebookCard from "@/components/NotebookCard"
import TodoIcon from "@/assets/TodoIcon"
import { v4 as uuidv4 } from "uuid"

const NotesPage = ({ onLogout, userInfo }: NotesPageProps) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [noteBooks, setNoteBooks] = useState<NoteBookType[]>([])
  const [activeBook, setActiveBook] = useState<NoteBookType | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNoteBooks({ userInfo, setIsLoading, setError, setNoteBooks })
  }, [userInfo])

  // Create a new notebook, open the overlay, and persist to the database
  const handleCreateNotebook = () => {
    const name = `Notebook ${noteBooks.length + 1}`
    const id = uuidv4()
    const userId = userInfo.id

    setActiveBook({ id, name, notes: [] })
    setIsOverlayOpen(true)
    createNotebook(id, userId, name)
  }

  // Update the notes for the active notebook and close the overlay
  const closeOverlay = (updatedNotes: StickyNoteType[]) => {
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
    <div className="relative flex min-h-dvh w-screen flex-col items-center gap-3 bg-primary pb-4 pt-4 sm:pb-0 sm:pt-12">
      <div className="flex w-full justify-between px-10">
        {/* Sidebar */}
        <div className="flex h-10 w-3/5 items-center rounded-full border border-gray-200 bg-white px-2 py-4 shadow-lg sm:absolute sm:left-4 sm:top-4 sm:h-1/2 sm:w-[40px] sm:flex-col">
          <TodoIcon width="24" height="24" />
        </div>

        {/* Account info */}
        <div className="bottom-4 left-4 sm:absolute">
          <AvatarMenu onLogout={onLogout} userInfo={userInfo} />
        </div>
      </div>

      {/* Main container */}
      <div className="relative flex w-10/12 flex-grow flex-col items-center rounded-lg border border-gray-100 bg-white px-8 shadow-xl sm:w-[500px] sm:pt-8 md:w-[650px] lg:w-[800px] xl:w-[900px] 2xl:w-[1200px]">
        <Button
          onClick={handleCreateNotebook}
          variant="default"
          className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full p-2 text-white shadow-lg transition-all hover:bg-green-600 sm:static sm:mb-4 sm:h-auto sm:w-auto sm:self-start sm:px-6"
        >
          <BookPlus className="!h-6 !w-6 sm:hidden" />
          <span className="hidden sm:inline">Create New Notebook</span>
        </Button>

        {isLoading ? (
          <div className="flex max-h-96 w-full flex-grow items-center justify-center">
            <Loader2 size={36} className="animate-spin text-yellow-400" />
          </div>
        ) : error ? (
          <div className="flex max-h-96 flex-grow flex-col items-center justify-center">
            <div className="flex w-full items-center justify-center text-red-500">{error}</div>
            <div>
              <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                <RefreshCw className="mr-1 !h-4 !w-4" />
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        )}

        {/* Note Overlay */}
        {isOverlayOpen && activeBook && <NoteOverlay key={activeBook.id} onClose={closeOverlay} activeBook={activeBook} userInfo={userInfo} />}
      </div>
    </div>
  )
}

export default NotesPage
