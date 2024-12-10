import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
