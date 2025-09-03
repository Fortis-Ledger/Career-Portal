"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings, Briefcase, FileText, BarChart3, Building2, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AuthButtonProps {
  user: any
}

export function AuthButton({ user }: AuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  // Check if user is admin
  const isAdmin = user?.email && [
    "admin@fortisledger.io", 
    "admin@fortisarena.io", 
    "ahmedfaraz.sa.48@gmail.com"
  ].includes(user.email)

  if (!user) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
          <a href="/auth/login">Sign In</a>
        </Button>
        <Button variant="ghost" size="sm" asChild className="sm:hidden">
          <a href="/auth/login">Sign In</a>
        </Button>
        <Button
          size="sm"
          asChild
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-xs sm:text-sm px-2 sm:px-4"
        >
          <a href="/auth/sign-up" className="whitespace-nowrap">Join Us</a>
        </Button>
      </div>
    )
  }

  if (isAdmin) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 sm:gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Admin Menu</span>
              <span className="sm:hidden">Admin</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 sm:w-56">
            <DropdownMenuItem asChild>
              <a href="/admin" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Admin Dashboard
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/admin/jobs/new" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Post New Job
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/admin/jobs" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Manage Jobs
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/admin/applications" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Review Applications
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/admin/users" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Manage Users
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/admin/analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="/profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                My Profile
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="/applications" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                My Applications
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} disabled={isLoading}>
              <LogOut className="w-4 h-4 mr-2" />
              {isLoading ? "Signing out..." : "Sign Out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Button variant="ghost" size="sm" asChild>
        <a href="/profile" className="flex items-center gap-1 sm:gap-2">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Profile</span>
        </a>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleSignOut} disabled={isLoading}>
        <LogOut className="w-4 h-4 sm:mr-2" />
        <span className="hidden sm:inline">{isLoading ? "Signing out..." : "Sign Out"}</span>
      </Button>
    </div>
  )
}
