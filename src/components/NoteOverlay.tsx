import { Menu, StickyNote } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "./ui/button"
import Draggable from "react-draggable"

interface NoteOverlayProps {
  onClose: (updatedNotes: StickyNoteType[]) => void
  name: string
  notes: StickyNoteType[]
}

export type StickyNoteType = {
  id: number
  xPercent: number
  yPercent: number
  content: string
}

const ANIMATION_DURATION = 500

export default function NoteOverlay({ onClose, name, notes }: NoteOverlayProps) {
  const [stickyNotes, setStickyNotes] = useState<StickyNoteType[]>(notes)
  const [isVisible, setIsVisible] = useState(false)
  const [showNoteInput, setShowNoteInput] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null) // Ref for the parent container

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose(stickyNotes)
    }, ANIMATION_DURATION)
  }

  const addStickyNote = (content: string) => {
    const randomX = Math.floor(Math.random() * 80) + 10
    const randomY = Math.floor(Math.random() * 80) + 10
    setStickyNotes([
      ...stickyNotes,
      {
        id: Date.now(),
        xPercent: randomX,
        yPercent: randomY,
        content
      }
    ])
  }

  useEffect(() => {
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
  }, [])

  return (
    <div
      ref={overlayRef}
      className={`group absolute inset-0 z-20 flex max-h-screen cursor-pointer flex-col items-center justify-start transition ${isVisible ? "translate-y-0" : "translate-y-full"}`}
      style={{
        transitionDuration: `${ANIMATION_DURATION}ms`
      }}
    >
      {/* Gap */}
      <div className="peer absolute h-3 w-full bg-transparent" onClick={handleClose} />

      {/* Overlay */}
      <div className="relative mt-3 w-full flex-1 scale-x-110 cursor-default rounded-lg border border-gray-100 bg-white shadow-lg transition-transform duration-300 peer-hover:translate-y-2">
        {/* Header */}
        <div className="mx-4 mt-6 flex items-baseline justify-between border-b border-gray-100 p-4">
          <h1 className="text-lg font-semibold">{name}</h1>
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
            <div className="flex cursor-pointer justify-center" onClick={() => setShowNoteInput(!showNoteInput)}>
              <StickyNote size={20} className="text-yellow-500" />
            </div>

            <div className="flex flex-1 items-center justify-center">
              <Menu size={16} className="drag-handle cursor-pointer text-gray-400" />
            </div>

            <div
              className={`absolute -left-4 top-0 z-50 -translate-x-full border border-gray-100 ${showNoteInput ? "flex" : "hidden"} h-48 w-72 flex-col rounded-lg bg-white p-4 shadow-md`}
            >
              <textarea
                placeholder="Write text for sticky note..."
                className="h-full w-full resize-none bg-transparent p-2 text-left align-top outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault() // Prevent newline on Enter
                    addStickyNote(e.currentTarget.value)
                    e.currentTarget.value = ""
                  }
                }}
              />

              <Button
                onClick={(e) => {
                  const input = e.currentTarget.previousSibling as HTMLInputElement
                  if (input.value.trim() !== "") {
                    addStickyNote(input.value)
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
              }}
            >
              <div className="absolute cursor-pointer whitespace-pre-wrap break-words rounded-lg bg-white p-4 shadow-md">{note.content}</div>
            </Draggable>
          )
        })}
      </div>
    </div>
  )
}
