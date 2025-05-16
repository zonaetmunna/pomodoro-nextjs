"use client"

import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-black/50">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-white">PomodoroFocus</span>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-sm text-gray-300 hover:text-white">
            Features
          </Link>
          <Link href="/#how-it-works" className="text-sm text-gray-300 hover:text-white">
            How It Works
          </Link>
        </nav>

        {/* Authentication buttons for landing page */}
        <div className="flex gap-2">
          <Link href="/login">
            <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

