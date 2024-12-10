import { NoteBookType, UserInfo } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetchNoteBooks = async ({
  userInfo,
  setIsLoading,
  setError,
  setNoteBooks
}: {
  userInfo: UserInfo
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setNoteBooks: (notebooks: NoteBookType[]) => void
}): Promise<void> => {
  setIsLoading(true)
  setError(null)
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/notebooks?userId=${userInfo.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })

    if (!response.ok) {
      const errorMessage = `Failed to fetch notebooks: ${response.statusText}`
      setError(errorMessage)
      return
    }

    const data = await response.json()
    setNoteBooks(data.notebooks)
  } catch (err) {
    console.error("Failed to fetch notebooks:", err)
    setError("An unexpected error occurred while fetching notebooks.")
  } finally {
    setIsLoading(false)
  }
}

export const createNotebook = async (id: string, userId: string, name: string) => {
  try {
    await fetch(`${import.meta.env.VITE_SERVER_URL}/notebooks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, userId, name })
    })
  } catch (error) {
    console.error("Failed to create notebook:", error)
  }
}

export const verifyToken = async (token: string) => {
  const response = await fetch(`${VITE_SERVER_URL}/auth/verify-token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ google_token: token })
  })

  const data = await response.json()
  return data
}
