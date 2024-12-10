import { Menu, StickyNote, X } from "lucide-react"
import { NoteOverlayProps, StickyNoteType } from "@/types"
import { useEffect, useRef, useState } from "react"

import { Button } from "./ui/button"
import Draggable from "react-draggable"
import { v4 as uuidv4 } from "uuid"

const ANIMATION_DURATION = 500

export default function NoteOverlay({ onClose, activeBook, userInfo }: NoteOverlayProps) {
  const [stickyNotes, setStickyNotes] = useState<StickyNoteType[]>(activeBook.notes || [])
  const [isVisible, setIsVisible] = useState(false)
  const [showNoteInput, setShowNoteInput] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null) // Ref for the parent container
  const inputContainerRef = useRef<HTMLDivElement>(null) // Ref for the input container

  useEffect(() => {
    setIsVisible(true)

    const handleClickOutside = (e: MouseEvent) => {
      if (inputContainerRef.current && !inputContainerRef.current.contains(e.target as Node)) {
        setShowNoteInput(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    // Fetch all notes on first render
    const fetchNotes = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/notes/${activeBook.id}?userId=${userInfo.id}`, {})
        if (!response.ok) {
          throw new Error("Failed to fetch notes")
        }
        const { notes } = await response.json()
        setStickyNotes(
          notes.map((note: StickyNoteType) => ({
            ...note,
            xPercent: Math.min(note.xPercent, 100),
            yPercent: Math.min(note.yPercent, 100)
          }))
        )
      } catch (error) {
        console.error("Error fetching notes:", error)
      }
    }

    fetchNotes()

    const resizeObserver = new ResizeObserver(() => {
      if (overlayRef.current) {
        setStickyNotes((prevNotes) =>
          prevNotes.map((note) => {
            return {
              ...note,
              xPercent: Math.min(note.xPercent, 100),
              yPercent: Math.min(note.yPercent, 100)
            }
          })
        )
      }
    })

    if (overlayRef.current) {
      resizeObserver.observe(overlayRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [activeBook.id, userInfo.id])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose(stickyNotes)
    }, ANIMATION_DURATION)
  }

  const handleDeleteNote = async (noteId: string, userId: string, setStickyNotes: React.Dispatch<React.SetStateAction<StickyNoteType[]>>) => {
    try {
      setStickyNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId))
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
      })

      if (!response.ok) {
        throw new Error("Failed to delete note")
      }
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  const addStickyNote = async (content: string, notebookId: string, userId: string) => {
    if (content.trim() === "") {
      return
    }

    const randomX = Math.floor(Math.random() * 60) + 20
    const randomY = Math.floor(Math.random() * 60) + 10

    try {
      const id = uuidv4()

      setStickyNotes((prevNotes) => [
        ...prevNotes,
        {
          id,
          xPercent: randomX,
          yPercent: randomY,
          content
        }
      ])

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/notes/${notebookId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          id,
          xPercent: randomX,
          yPercent: randomY,
          content
        })
      })

      if (!response.ok) {
        throw new Error("Failed to upload note to server")
      }
    } catch (error) {
      console.error("Error adding sticky note:", error)
    }
  }

  return (
    <div
      ref={overlayRef}
      className={`group absolute inset-0 z-20 flex max-h-screen cursor-pointer flex-col items-center justify-start transition ${isVisible ? "translate-y-0" : "translate-y-full"}`}
      style={{
        transitionDuration: `${ANIMATION_DURATION}ms`
      }}
    >
      {/* Gap */}
      <div className="peer absolute h-5 w-full bg-transparent" onClick={handleClose} />

      {/* Overlay */}
      <div className="relative mt-5 w-full flex-1 scale-x-110 cursor-default rounded-lg border border-gray-100 bg-white shadow-lg transition-transform duration-300 peer-hover:translate-y-2">
        {/* Header */}
        <div className="items-top flex justify-between border-b border-gray-100 p-2">
          <div className="mx-4 mt-6 flex items-baseline justify-between p-2">
            <h1 className="text-lg font-semibold">{activeBook.name}</h1>
          </div>
          <button onClick={handleClose} className="items-top flex gap-1 p-2 leading-none text-gray-600 hover:text-red-500 sm:hidden">
            <span className="inline-block">Close</span>
            <X size={18} className="inline-block" />
          </button>
        </div>

        {/* Top-left Tab */}
        <div className="absolute -top-1 left-12 h-8 w-28">
          <div className="absolute -ml-1 h-0 w-0 border-b-[4px] border-l-[4px] border-transparent border-b-[#f4d7a4]"></div>
          <div className="h-8 w-full rounded-b-lg bg-[#fae0b2]"></div>
        </div>

        {/* Side Tabs */}
        <div className="absolute -left-3 top-12 flex flex-col space-y-2">
          <div className="h-12 w-3 rounded-l-lg bg-[#fbcaca]"></div>
          <div className="h-12 w-3 rounded-l-lg bg-[#fae0b2]"></div>
          <div className="h-12 w-3 rounded-l-lg bg-[#dfd6fd]"></div>
        </div>

        {/* Draggable Pill */}
        <Draggable axis="y" bounds="parent" handle=".drag-handle">
          <div className="absolute -right-4 top-1/4 z-50 flex h-64 w-8 flex-col rounded-full bg-white py-4 shadow-md">
            <div
              className="flex cursor-pointer justify-center"
              onMouseDown={(event) => {
                event.stopPropagation()
                setShowNoteInput(!showNoteInput)
              }}
            >
              <StickyNote size={20} className="text-yellow-500" />
            </div>

            <div className="flex flex-1 items-center justify-center">
              <Menu size={16} className="drag-handle cursor-pointer text-gray-400" />
            </div>

            <div
              className={`absolute -left-4 top-0 z-50 -translate-x-full border border-gray-100 ${showNoteInput ? "flex" : "hidden"} h-48 w-72 flex-col rounded-lg bg-white p-4 shadow-md`}
              ref={inputContainerRef}
            >
              <textarea
                placeholder="Write text for sticky note..."
                className="h-full w-full resize-none bg-transparent p-2 text-left align-top outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    addStickyNote(e.currentTarget.value, activeBook.id, userInfo.id)
                    e.currentTarget.value = ""
                  }
                }}
              />

              <Button
                onClick={(e) => {
                  const input = e.currentTarget.previousSibling as HTMLInputElement
                  if (input.value.trim() !== "") {
                    addStickyNote(input.value, activeBook.id, userInfo.id)
                  }
                  input.value = ""
                }}
                className="w-40 rounded-full"
                variant={"default"}
              >
                Add Sticky Note
              </Button>
            </div>
          </div>
        </Draggable>

        {/* Generated Notes */}
        {stickyNotes.map((note) => {
          const { offsetWidth, offsetHeight } = overlayRef.current || {
            offsetWidth: 1,
            offsetHeight: 1
          }

          const positionX = (note.xPercent / 100) * offsetWidth
          const positionY = (note.yPercent / 100) * offsetHeight

          return (
            <Draggable
              key={note.id}
              bounds="parent"
              cancel=".delete-button"
              position={{ x: positionX, y: positionY }}
              onStop={(_, data) => {
                setStickyNotes((prevNotes) =>
                  prevNotes.map((n) =>
                    n.id === note.id
                      ? {
                          ...n,
                          xPercent: (data.x / offsetWidth) * 100,
                          yPercent: (data.y / offsetHeight) * 100
                        }
                      : n
                  )
                )

                fetch(`${import.meta.env.VITE_SERVER_URL}/notes/${note.id}`, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    xPercent: (data.x / offsetWidth) * 100,
                    yPercent: (data.y / offsetHeight) * 100
                  })
                })
              }}
            >
              <div className="group/note absolute max-w-48 cursor-pointer whitespace-pre-wrap text-wrap break-words rounded-lg bg-yellow-200 p-4 shadow-lg">
                {/* Note Content */}
                {note.content}

                {/* Delete Icon */}
                <button
                  className="delete-button absolute right-0 top-0 text-gray-500 transition-colors sm:hover:text-red-500"
                  onClick={() => handleDeleteNote(note.id, userInfo.id, setStickyNotes)}
                  title="Delete Note"
                >
                  <X className="m-1 group-hover/note:block sm:hidden" size={16} />
                </button>

                {/* Fold Effect */}
                <div
                  className="absolute bottom-0 right-0 h-1 w-4 bg-yellow-300"
                  style={{
                    clipPath: "polygon(0 0, 100% 100%, 0 100%)",
                    backgroundColor: "rgba(0, 0, 0, 0.05)"
                  }}
                ></div>
              </div>
            </Draggable>
          )
        })}
      </div>
    </div>
  )
}
