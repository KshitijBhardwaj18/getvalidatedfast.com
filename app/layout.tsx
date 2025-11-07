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
          <script
    defer
    src="http://localhost:3000/widget.js"
    data-client-key="af9ee0bb-259e-4c89-91ae-d9210b73fc86"
    data-language="en" 
    id="getvalidated-widget-script"
></script>
        </body>
      </html>
    </SessionProvider>
  );
}
