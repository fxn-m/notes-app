import { CredentialResponse, GoogleLogin } from "@react-oauth/google"

interface LoginPageProps {
  setAuth: (value: boolean) => void
}

export default function LoginPage({ setAuth }: LoginPageProps) {
  const handleSuccess = (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential
    console.log("Credential Response", credentialResponse)
    if (token) {
      localStorage.setItem("google_id_token", token)
      setAuth(true)
    }
  }

  const handleError = () => {
    console.error("Google Login Failed")
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-center text-xl font-bold">Sign in to Youni Notes</h2>
        <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
      </div>
    </div>
  )
}
