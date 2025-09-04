import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile-form"
import { ProfileHeader } from "@/components/profile-header"
import { ProfilePageClient } from "@/components/profile-page-client"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getUserProfile() {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("User fetch error:", userError)
      redirect("/auth/login")
    }

    console.log("User authenticated:", user.id, user.email)

    // Test database connection and get profile count
    const { count, error: countError } = await supabase
      .from("profiles")
      .select("*", { count: 'exact', head: true })

    if (countError) {
      console.error("Database connection test failed:", countError)
    } else {
      console.log("Total profiles in database:", count)
    }

    // Fetch profile with better error handling
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError) {
      // If profile doesn't exist (PGRST116 = no rows returned), create it now
      if (profileError.code === 'PGRST116') {
        console.log("Profile not found, creating new profile...")
        
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([{
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || ''
          }])
          .select()
          .single()
        
        if (createError) {
          console.error("Failed to create profile:", createError)
          return { user, profile: null }
        }
        
        console.log("Profile created successfully:", newProfile)
        return { user, profile: newProfile }
      } else {
        console.error("Profile fetch error:", profileError)
        return { user, profile: null }
      }
    }

    console.log("User ID:", user.id)
    console.log("Profile data:", profile)
    console.log("Profile fields check:")
    if (profile) {
      console.log("- full_name:", profile.full_name)
      console.log("- phone:", profile.phone)
      console.log("- location:", profile.location)
      console.log("- bio:", profile.bio)
      console.log("- years_experience:", profile.years_experience)
    }

    return { user, profile }
  } catch (error) {
    console.error("Unexpected error in getUserProfile:", error)
    throw error
  }
}

export default async function ProfilePage() {
  const { user, profile } = await getUserProfile()

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/30 via-purple-100/40 to-pink-100/30"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Content Wrapper */}
      <div className="relative z-10">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-3 sm:px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Button variant="ghost" size="sm" asChild className="px-2 sm:px-3">
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Home</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="font-bold text-sm sm:text-base">FortisLedger</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <Button variant="outline" asChild size="sm" className="text-xs sm:text-sm">
                <Link href="/applications">My Applications</Link>
              </Button>
              <Button variant="outline" asChild size="sm" className="text-xs sm:text-sm">
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <ProfilePageClient user={user} profile={profile} />
      </div>
    </div>
  )
}
