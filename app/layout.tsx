import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

const poppins = Poppins({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GetValidatedFast.com",
  description: "One stop point for all your validation needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className={cn("antialiased", poppins.className)}>
          {children} <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
