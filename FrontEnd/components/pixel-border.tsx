import type React from "react"

export function PixelBorder({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative p-1">
      <div className="absolute inset-0 bg-gradient-to-r from-pixel-green via-pixel-blue to-pixel-purple opacity-50 blur" />
      <div className="relative bg-background p-4">{children}</div>
    </div>
  )
}

