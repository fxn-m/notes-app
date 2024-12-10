import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-primary">
      <div className="flex flex-col items-center">
        <Loader2 size={48} className="animate-spin text-yellow-300" />
      </div>
    </div>
  )
}
