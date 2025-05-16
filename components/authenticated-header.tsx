"use client"

import { Button } from "@/components/ui/button"
import { BarChart2, Clock, ListTodo, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AuthenticatedHeader({ userName = "User" }: { userName?: string }) {
  const pathname = usePathname()
  
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-black/50">
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-white">PomodoroFocus</span>
          </Link>
        </div>
        
        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-4 bg-black/30 p-1 border border-white/10 rounded-lg">
          <Link href="/dashboard">
            <Button
              variant={pathname === "/dashboard" ? "default" : "ghost"}
              size="sm"
              className={pathname === "/dashboard" ? "bg-gradient-to-r from-red-500 to-orange-500" : "text-gray-300"}
            >
              <Clock className="mr-2 h-4 w-4" />
              Pomodoro
            </Button>
          </Link>
          <Link href="/dashboard/tasks">
            <Button
              variant={pathname === "/dashboard/tasks" ? "default" : "ghost"}
              size="sm"
              className={pathname === "/dashboard/tasks" ? "bg-gradient-to-r from-red-500 to-orange-500" : "text-gray-300"}
            >
              <ListTodo className="mr-2 h-4 w-4" />
              Tasks
            </Button>
          </Link>
          <Link href="/dashboard/analytics">
            <Button
              variant={pathname === "/dashboard/analytics" ? "default" : "ghost"}
              size="sm"
              className={pathname === "/dashboard/analytics" ? "bg-gradient-to-r from-red-500 to-orange-500" : "text-gray-300"}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button
              variant={pathname === "/dashboard/settings" ? "default" : "ghost"}
              size="sm"
              className={pathname === "/dashboard/settings" ? "bg-gradient-to-r from-red-500 to-orange-500" : "text-gray-300"}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </nav>

        {/* User profile and logout */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-300">
            <User className="h-4 w-4" />
            <span>{userName}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="text-gray-300 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
} 