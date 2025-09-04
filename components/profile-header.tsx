"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, Edit3, X, Upload, User } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"

interface ProfileHeaderProps {
  user: any
  profile: any
  onProfileUpdate: () => void
}

export function ProfileHeader({ user, profile, onProfileUpdate }: ProfileHeaderProps) {
  const [isUploadingProfile, setIsUploadingProfile] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const profileFileRef = useRef<HTMLInputElement>(null)
  const coverFileRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()

  const handleProfilePictureUpload = async (file: File) => {
    if (!file) return

    setIsUploadingProfile(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/profile.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName)

      // Update profile with new image URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      onProfileUpdate()
    } catch (error) {
      console.error('Error uploading profile picture:', error)
      alert('Failed to upload profile picture')
    } finally {
      setIsUploadingProfile(false)
    }
  }

  const handleCoverImageUpload = async (file: File) => {
    if (!file) return

    setIsUploadingCover(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/cover.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('cover-images')
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('cover-images')
        .getPublicUrl(fileName)

      // Update profile with new cover image URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ cover_image_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      onProfileUpdate()
    } catch (error) {
      console.error('Error uploading cover image:', error)
      alert('Failed to upload cover image')
    } finally {
      setIsUploadingCover(false)
    }
  }

  const removeProfilePicture = async () => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture_url: null })
        .eq('id', user.id)

      if (updateError) throw updateError

      onProfileUpdate()
    } catch (error) {
      console.error('Error removing profile picture:', error)
      alert('Failed to remove profile picture')
    }
  }

  const removeCoverImage = async () => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ cover_image_url: null })
        .eq('id', user.id)

      if (updateError) throw updateError

      onProfileUpdate()
    } catch (error) {
      console.error('Error removing cover image:', error)
      alert('Failed to remove cover image')
    }
  }

  return (
    <Card className="relative overflow-hidden border-0 shadow-lg">
      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        {profile?.cover_image_url ? (
          <Image
            src={profile.cover_image_url}
            alt="Cover"
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
        )}
        
        {/* Cover Image Upload Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-1 sm:gap-2">
          <input
            ref={coverFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleCoverImageUpload(file)
            }}
          />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => coverFileRef.current?.click()}
            disabled={isUploadingCover}
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 text-xs sm:text-sm px-2 sm:px-3"
          >
            {isUploadingCover ? (
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
            ) : (
              <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            <span className="hidden sm:inline ml-1">{isUploadingCover ? 'Uploading...' : 'Cover'}</span>
          </Button>
          {profile?.cover_image_url && (
            <Button
              size="sm"
              variant="destructive"
              onClick={removeCoverImage}
              className="bg-red-500/20 backdrop-blur-sm text-white hover:bg-red-500/40 p-1 sm:p-2"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Profile Picture Section */}
      <div className="relative px-3 sm:px-6 pb-4 sm:pb-6">
        <div className="flex justify-center sm:justify-start">
          {/* Profile Picture */}
          <div className="relative -mt-16 sm:-mt-20">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
              {profile?.profile_picture_url ? (
                <Image
                  src={profile.profile_picture_url}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                  <User className="w-16 h-16 sm:w-20 sm:h-20 text-gray-500" />
                </div>
              )}
            </div>
            
            {/* Profile Picture Upload Controls */}
            <div className="absolute bottom-2 right-2 flex gap-1">
              <input
                ref={profileFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleProfilePictureUpload(file)
                }}
              />
              <Button
                size="sm"
                onClick={() => profileFileRef.current?.click()}
                disabled={isUploadingProfile}
                className="w-7 h-7 sm:w-8 sm:h-8 p-0 rounded-full bg-blue-600 hover:bg-blue-700"
              >
                {isUploadingProfile ? (
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </Button>
              {profile?.profile_picture_url && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={removeProfilePicture}
                  className="w-7 h-7 sm:w-8 sm:h-8 p-0 rounded-full bg-red-500 hover:bg-red-600"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              )}
            </div>
          </div>

        </div>

        {/* Profile Info */}
        <div className="mt-4 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {profile?.full_name || 'Your Name'}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-1">
            {profile?.current_role || 'Professional Title'}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-gray-500 text-sm sm:text-base">
            {profile?.location && (
              <span className="flex items-center justify-center sm:justify-start gap-1">
                📍 {profile.location}
              </span>
            )}
            {profile?.years_experience > 0 && (
              <span className="flex items-center justify-center sm:justify-start gap-1">
                💼 {profile.years_experience} years experience
              </span>
            )}
            {profile?.is_open_to_remote && (
              <span className="flex items-center justify-center sm:justify-start gap-1">
                🌐 Open to remote work
              </span>
            )}
          </div>
          {profile?.bio && (
            <p className="text-gray-700 mt-3 max-w-2xl text-sm sm:text-base">
              {profile.bio}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
