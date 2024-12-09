import { CredentialResponse, GoogleLogin } from "@react-oauth/google"

interface LoginPageProps {
  setAuth: (value: boolean) => void
}

export default function LoginPage({ setAuth }: LoginPageProps) {
  const handleSuccess = (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential
    if (token) {
      localStorage.setItem("google_id_token", token)
      setAuth(true)
    }
  }

  const handleError = () => {
    console.error("Google Login Failed")
  }

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col gap-8 rounded-xl border border-gray-100 bg-white p-6 shadow-md">
        <img src="./favicon.png" alt="Youni Notes" className="mx-auto h-14 w-14 rounded-full" />
        <div>
          <h2 className="mb-4 text-center text-xl font-bold">Sign in to Youni Notes</h2>
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </div>
      </div>
    </div>
  )
}
