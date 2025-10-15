import type React from "react"
import type { Metadata } from "next"

import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Fit Arena",
  description: "Full body workouts with guided timers and voice prompts.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans `}>
        {/* <Suspense fallback={null}></Suspense> */}
    {children}
      </body>
    </html>
  )
}
