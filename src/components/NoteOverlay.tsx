import { Menu, StickyNote } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import Draggable from "react-draggable"

interface NoteOverlayProps {
  onClose: () => void
}

type StickyNoteType = {
  id: number
  xPercent: number
  yPercent: number
  content: string
}

const ANIMATION_DURATION = 500

export default function NoteOverlay({ onClose }: NoteOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [stickyNotes, setStickyNotes] = useState<StickyNoteType[]>([])

  const overlayRef = useRef<HTMLDivElement>(null) // Ref for the parent container

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, ANIMATION_DURATION)
  }

  const addStickyNote = () => {
    const randomX = Math.floor(Math.random() * 80) + 10
    const randomY = Math.floor(Math.random() * 80) + 10
    setStickyNotes([
      ...stickyNotes,
      {
        id: Date.now(),
        xPercent: randomX,
        yPercent: randomY,
        content: "New Note"
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
      className={`group absolute inset-0 z-20 flex cursor-pointer items-start justify-center transition duration-${ANIMATION_DURATION} ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Gap */}
      <div className="peer absolute h-3 w-full bg-transparent" onClick={handleClose} />

      {/* Overlay */}
      <div className="relative mt-3 h-full w-full scale-x-110 cursor-default rounded-lg border border-gray-100 bg-white shadow-lg transition-transform duration-300 peer-hover:translate-y-2">
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
          <div className="absolute -right-4 top-1/4 flex h-64 w-8 flex-col rounded-full bg-white py-4 shadow-md">
            <div className="flex cursor-pointer justify-center" onClick={addStickyNote}>
              <StickyNote size={20} className="text-yellow-500" />
            </div>

            <div className="flex flex-1 items-center justify-center">
              <Menu size={16} className="drag-handle cursor-pointer text-gray-400" />
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
              <div className="absolute cursor-pointer rounded-lg bg-white p-4 shadow-md">{note.content}</div>
            </Draggable>
          )
        })}
      </div>
    </div>
  )
}
