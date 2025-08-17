import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ClerkProvider } from "@clerk/nextjs"
import dynamic from "next/dynamic"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Finance AI",
  description: "One Stop Financial Intelligence Platform",
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <Header></Header>
          <main className="min-h-screen" suppressHydrationWarning>{children}</main>

          <Toaster richColors />

          <Footer />
        </body>
      </html>
    </ClerkProvider>
  )
}

