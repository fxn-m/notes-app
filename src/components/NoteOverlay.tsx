import { Menu, StickyNote } from "lucide-react"
import { useEffect, useState } from "react"

import Draggable from "react-draggable"

interface NoteOverlayProps {
  onClose: () => void
}

const ANIMATION_DURATION = 500

export default function NoteOverlay({ onClose }: NoteOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, ANIMATION_DURATION)
  }

  return (
    <div
      className={`group absolute inset-0 z-20 flex cursor-pointer items-start justify-center transition duration-${ANIMATION_DURATION} ${isVisible ? "translate-y-0" : "translate-y-full"}`}
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
          {/* Tab 1 */}
          <div className="h-12 w-3 rounded-l-lg bg-[#fbcaca]"></div>
          {/* Tab 2 */}
          <div className="h-12 w-3 rounded-l-lg bg-[#fae0b2]"></div>
          {/* Tab 3 */}
          <div className="h-12 w-3 rounded-l-lg bg-[#dfd6fd]"></div>
        </div>

        {/* Draggable Pill */}
        <Draggable axis="y" bounds="parent">
          <div className="absolute -right-4 top-1/4 flex h-64 w-8 cursor-pointer flex-col items-center justify-between rounded-full bg-white py-4 shadow-md">
            <StickyNote size={20} className="text-yellow-500" />
            <Menu size={16} className="cursor-pointer text-gray-400" />
            <div></div>
          </div>
        </Draggable>

        {/* Content */}
        <div className="p-24">
          <h2 className="mb-4 text-xl font-semibold">Child Document</h2>
          <p className="text-gray-600">This is the content of the Note Overlay.</p>
        </div>
      </div>
    </div>
  )
}
