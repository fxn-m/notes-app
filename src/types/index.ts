export type UserInfo = {
  id: string
  name: string
  email: string
  picture: string
}

export type StickyNoteType = {
  id: string
  xPercent: number
  yPercent: number
  content: string
}

export type NoteBookType = {
  id: string
  name: string
  notes: StickyNoteType[]
}

export type NotesPageProps = {
  onLogout: () => void
  userInfo: UserInfo
}

export type NoteOverlayProps = {
  onClose: (updatedNotes: StickyNoteType[]) => void
  activeBook: NoteBookType
  userInfo: UserInfo
}
