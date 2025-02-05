import { GeistMono } from "geist/font/mono"
import "./globals.css"
import type React from "react" // Import React

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body className={`${GeistMono.className} bg-background text-foreground`}>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}

