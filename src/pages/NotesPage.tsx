import NoteOverlay, { StickyNoteType } from "@/components/NoteOverlay"

import { AvatarMenu } from "@/components/avatar-menu"
import { useState } from "react"

type NoteBookType = {
  id: number
  name: string
  notes: StickyNoteType[]
}

const NotesPage = () => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  const [noteBooks, setNoteBooks] = useState<NoteBookType[]>([])
  const [activeBook, setActiveBook] = useState<NoteBookType | null>(null)

  const closeOverlay = (updatedNotes: StickyNoteType[]) => {
    setNoteBooks((prevBooks) => {
      if (activeBook) {
        return prevBooks.map((book) => (book.id === activeBook.id ? { ...book, notes: updatedNotes } : book))
      } else {
        return [
          ...prevBooks,
          {
            id: Date.now(),
            name: `New Notebook ${prevBooks.length + 1}`,
            notes: updatedNotes
          }
        ]
      }
    })

    setActiveBook(null)
    setIsOverlayOpen(false)
  }

  return (
    <div className="bg-primary relative flex min-h-screen w-screen justify-center pt-12">
      {/* Sidebar */}
      <div className="absolute left-4 top-4 flex h-1/2 w-[40px] flex-col items-center rounded-full border border-gray-200 bg-white px-2 py-4 shadow-lg">
        <TodoIcon width="24" height="24" />
      </div>

      {/* Main container */}
      <div className="relative flex w-2/3 flex-col items-center rounded-lg border border-gray-100 bg-white pt-12 shadow-xl sm:w-[500px] md:w-[650px] lg:w-[800px] xl:w-[900px] 2xl:w-[1200px]">
        <div className="w-full flex-grow px-8">
          <button
            onClick={() => {
              setActiveBook(null)
              setIsOverlayOpen(true)
            }}
            className="flex items-center justify-center rounded-full bg-[#54A268] px-6 py-2 text-white shadow-md hover:bg-green-700"
          >
            Create New Notebook
          </button>

          {/* Notebooks */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {noteBooks.map((book) => (
              <div
                key={book.id}
                className="cursor-pointer rounded-lg bg-gray-100 p-4"
                onClick={() => {
                  setActiveBook(book)
                  setIsOverlayOpen(true)
                }}
              >
                <h2 className="text-lg font-semibold">{book.name}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Note Overlay */}
        {isOverlayOpen && <NoteOverlay onClose={closeOverlay} notes={activeBook ? activeBook.notes : []} />}
      </div>

      {/* Account info */}
      <div className="absolute bottom-4 left-4">
        <AvatarMenu />
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
