import { AvatarMenu } from "@/components/avatar-menu"

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold">Welcome to the Dashboard</h1>
        <div className="inline-block">
          <AvatarMenu />
        </div>
      </div>
    </div>
  )
}

