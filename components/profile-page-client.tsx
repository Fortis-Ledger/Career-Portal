"use client"

import { useState, useEffect } from "react"
import { ProfileForm } from "@/components/profile-form"
import { ProfileHeader } from "@/components/profile-header"
import { createClient } from "@/lib/supabase/client"

interface ProfilePageClientProps {
  user: any
  profile: any
}

export function ProfilePageClient({ user, profile: initialProfile }: ProfilePageClientProps) {
  const [profile, setProfile] = useState(initialProfile)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const supabase = createClient()

  const refreshProfile = async () => {
    setIsRefreshing(true)
    try {
      const { data: refreshedProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      
      if (error) {
        console.error("Error refreshing profile:", error)
      } else {
        console.log("Profile refreshed:", refreshedProfile)
        setProfile(refreshedProfile)
      }
    } catch (error) {
      console.error("Error in refreshProfile:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleProfileUpdate = async () => {
    await refreshProfile()
  }

  // Refresh profile when initialProfile changes
  useEffect(() => {
    setProfile(initialProfile)
  }, [initialProfile])

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Professional Profile Header */}
        <ProfileHeader 
          user={user} 
          profile={profile} 
          onProfileUpdate={handleProfileUpdate}
        />

        {/* Profile Form */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Edit Profile Details
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                  Update your professional information and preferences
                </p>
              </div>
              <button
                onClick={refreshProfile}
                disabled={isRefreshing}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 w-fit"
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh Profile'}
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <ProfileForm user={user} profile={profile} />
          </div>
        </div>
      </div>
    </div>
  )
}
