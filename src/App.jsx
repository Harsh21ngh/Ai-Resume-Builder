import { Button } from "@/components/ui/button"
import { Navigate, Outlet } from "react-router-dom"
import { useState } from "react"
import { useEffect } from "react"
import { useUser } from "@clerk/clerk-react"
import Header from "./components/custom/Header"
import { Toaster } from "sonner"

function App() {
  const [count, setCount] = useState(0)
  const {user,isLoaded,isSignedIn} = useUser()

  if(!isSignedIn && isLoaded){
    return <Navigate to={'/auth/sign-in'} />
  }
  return (
    <>
    <Header></Header>
    <Outlet></Outlet>
    <Toaster></Toaster>
    </>
  )
}

export default App
