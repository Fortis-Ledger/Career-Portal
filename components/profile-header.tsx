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
  const [isEditing, setIsEditing] = useState(false)
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
        <div className="absolute top-4 right-4 flex gap-2">
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
            className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
          >
            {isUploadingCover ? (
              <Upload className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
            {isUploadingCover ? 'Uploading...' : 'Cover'}
          </Button>
          {profile?.cover_image_url && (
            <Button
              size="sm"
              variant="destructive"
              onClick={removeCoverImage}
              className="bg-red-500/20 backdrop-blur-sm text-white hover:bg-red-500/40"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Profile Picture Section */}
      <div className="relative px-6 pb-6">
        <div className="flex items-end justify-between">
          {/* Profile Picture */}
          <div className="relative -mt-20">
            <div className="relative w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
              {profile?.profile_picture_url ? (
                <Image
                  src={profile.profile_picture_url}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                  <User className="w-20 h-20 text-gray-500" />
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
                className="w-8 h-8 p-0 rounded-full bg-blue-600 hover:bg-blue-700"
              >
                {isUploadingProfile ? (
                  <Upload className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </Button>
              {profile?.profile_picture_url && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={removeProfilePicture}
                  className="w-8 h-8 p-0 rounded-full bg-red-500 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {profile?.full_name || 'Your Name'}
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            {profile?.current_role || 'Professional Title'}
          </p>
          <div className="flex items-center gap-4 mt-2 text-gray-500">
            {profile?.location && (
              <span className="flex items-center gap-1">
                📍 {profile.location}
              </span>
            )}
            {profile?.years_experience > 0 && (
              <span className="flex items-center gap-1">
                💼 {profile.years_experience} years experience
              </span>
            )}
            {profile?.is_open_to_remote && (
              <span className="flex items-center gap-1">
                🌐 Open to remote work
              </span>
            )}
          </div>
          {profile?.bio && (
            <p className="text-gray-700 mt-3 max-w-2xl">
              {profile.bio}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
