"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-pixel text-lg">PixelCode</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/problems"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/problems" ? "text-foreground" : "text-foreground/60",
              )}
            >
              Problems
            </Link>
            <Link
              href="/profile"
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/profile" ? "text-foreground" : "text-foreground/60",
              )}
            >
              Profile
            </Link>
          </nav>
        </div>
      </div>
    </nav>
  )
}

