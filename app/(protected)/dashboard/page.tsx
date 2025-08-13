import { auth } from "@/auth"
import { redirect } from "next/navigation";
import { memberShipExists } from "@/data/user";

export default async function() {
   const session = await auth();
    
   if(!session?.user?.id){
    redirect("/login");
   }

    const memberShip = await memberShipExists(session.user.id);

    if(!memberShip){
        redirect("/onboarding");
    }

    
    return (
        <div className="flex flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
           
        </div>
    )
}