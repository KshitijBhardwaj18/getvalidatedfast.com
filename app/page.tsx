"use client";
import {Button} from "@/components/ui/button"
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="w-full bg-white/65 flex items-center justify-center h-full">
      <div className="flex flex-col gap-1 items-center justify-center">
        <h1 className="text-black text-center text-2xl ">✅ GetValidatedFast.com</h1>
        <p className="text-neutral-500 text-center text-lg">
           One stop shop for all your validation needs.
        </p>
        <div className="flex flex-row gap-2">
          <Button className="bg-white text-black hover:text-green-500" onClick={() => router.push("/auth/signup")}>
            Sign Up
          </Button>
          <Button className="bg-white hover:text-green-500 text-black" onClick={() => router.push("/auth/signin")}>
            Sign In
          </Button>
          </div>
      </div>
    </div>
  );
}
