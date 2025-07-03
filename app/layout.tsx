import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StokIn Lite - Sistem Manajemen Inventaris",
  description: "Sistem manajemen inventaris multi-gudang yang sederhana dan efisien",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-background">{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
