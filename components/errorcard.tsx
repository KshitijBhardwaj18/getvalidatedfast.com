"use client"
import CardWrapper from "./cardwrapper"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"


const ErrorCard = () => {
    const router = useRouter();
  return(
   
    <CardWrapper>
        <div className="flex justify-center items-center flex-col">
        <p>
           ⚠️ An error  occured
        </p>
        <Button className="mt-5" onClick={() => router.push("/auth/signin")}>
           Go back to sign in page
        </Button>
        </div>
    </CardWrapper>
  
    
  )  
}

export default ErrorCard;