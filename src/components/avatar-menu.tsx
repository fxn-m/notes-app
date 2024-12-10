import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useState } from "react"

import { type NotesPageProps as AvatarMenuProps } from "@/types"

export function AvatarMenu({ onLogout, userInfo }: AvatarMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`relative h-10 w-10 transform rounded-full shadow-xl transition-transform duration-200 ${isOpen ? "scale-110" : "hover:scale-110"}`}
        >
          <Avatar>
            <AvatarImage src={userInfo.picture} alt="@username" />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 focus:outline-none focus:ring-0" align="end" forceMount onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userInfo.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{userInfo.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            onLogout()
          }}
          className="cursor-pointer text-red-500 focus:text-red-500"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
