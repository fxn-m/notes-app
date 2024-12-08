import { AvatarMenu } from "@/components/avatar-menu"

const NotesPage = () => {
  return (
    <div className="bg-primary flex min-h-screen w-screen justify-center px-[127px] pt-[92px]">
      {/* Sidebar */}
      <div className="absolute left-4 top-4 flex h-1/2 w-[40px] flex-col items-center rounded-full border border-gray-200 bg-white px-2 py-4 shadow-lg">
        <TodoIcon width="24" height="24" />
      </div>

      {/* Main container */}
      <div className="flex w-4/5 flex-col items-center rounded-lg border border-gray-100 bg-white pt-12 shadow-xl">
        <div className="w-full flex-grow px-8">
          <button className="flex items-center justify-center rounded-full bg-[#54A268] px-6 py-2 text-white shadow-md hover:bg-green-700">
            Open Child Document
          </button>
        </div>
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
