"use client"

import Link from "next/link"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, FileText, LinkIcon, Save } from "lucide-react"

interface ProfileFormProps {
  user: any
  profile: any
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [currentProfile, setCurrentProfile] = useState(profile)

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    location: "",
    bio: "",
    profile_picture_url: "",
    cover_image_url: "",
    resume_url: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    years_experience: 0,
    current_role: "",
    preferred_salary_min: "",
    preferred_salary_max: "",
    available_from: "",
    is_open_to_remote: true,
  })

  // Initialize form data when profile changes
  useEffect(() => {
    if (profile) {
      const newFormData = {
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: profile.bio || "",
        profile_picture_url: profile.profile_picture_url || "",
        cover_image_url: profile.cover_image_url || "",
        resume_url: profile.resume_url || "",
        linkedin_url: profile.linkedin_url || "",
        github_url: profile.github_url || "",
        portfolio_url: profile.portfolio_url || "",
        years_experience: profile.years_experience || 0,
        current_role: profile.current_role || "",
        preferred_salary_min: profile.preferred_salary_min ? profile.preferred_salary_min.toString() : "",
        preferred_salary_max: profile.preferred_salary_max ? profile.preferred_salary_max.toString() : "",
        available_from: profile.available_from || "",
        is_open_to_remote: profile.is_open_to_remote ?? true,
      }
      setFormData(newFormData)
    }
  }, [profile])

  // Force form update when currentProfile changes
  useEffect(() => {
    if (currentProfile) {
      const newFormData = {
        full_name: currentProfile.full_name || "",
        phone: currentProfile.phone || "",
        location: currentProfile.location || "",
        bio: currentProfile.bio || "",
        profile_picture_url: currentProfile.profile_picture_url || "",
        cover_image_url: currentProfile.cover_image_url || "",
        resume_url: currentProfile.resume_url || "",
        linkedin_url: currentProfile.linkedin_url || "",
        github_url: currentProfile.github_url || "",
        portfolio_url: currentProfile.portfolio_url || "",
        years_experience: currentProfile.years_experience || 0,
        current_role: currentProfile.current_role || "",
        preferred_salary_min: currentProfile.preferred_salary_min ? currentProfile.preferred_salary_min.toString() : "",
        preferred_salary_max: currentProfile.preferred_salary_max ? currentProfile.preferred_salary_max.toString() : "",
        available_from: currentProfile.available_from || "",
        is_open_to_remote: currentProfile.is_open_to_remote ?? true,
      }
      setFormData(newFormData)
    }
  }, [currentProfile])

  // Function to refresh profile data
  const refreshProfile = async () => {
    try {
      const supabase = createClient()
      const { data: refreshedProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          setCurrentProfile(null)
          setFormData({
            full_name: "",
            phone: "",
            location: "",
            bio: "",
            profile_picture_url: "",
            cover_image_url: "",
            resume_url: "",
            linkedin_url: "",
            github_url: "",
            portfolio_url: "",
            years_experience: 0,
            current_role: "",
            preferred_salary_min: "",
            preferred_salary_max: "",
            available_from: "",
            is_open_to_remote: true,
          })
        }
      } else {
        setCurrentProfile(refreshedProfile)
        if (refreshedProfile) {
          setFormData({
            full_name: refreshedProfile.full_name || "",
            phone: refreshedProfile.phone || "",
            location: refreshedProfile.location || "",
            bio: refreshedProfile.bio || "",
            profile_picture_url: refreshedProfile.profile_picture_url || "",
            cover_image_url: refreshedProfile.cover_image_url || "",
            resume_url: refreshedProfile.resume_url || "",
            linkedin_url: refreshedProfile.linkedin_url || "",
            github_url: refreshedProfile.github_url || "",
            portfolio_url: refreshedProfile.portfolio_url || "",
            years_experience: refreshedProfile.years_experience || 0,
            current_role: refreshedProfile.current_role || "",
            preferred_salary_min: refreshedProfile.preferred_salary_min ? refreshedProfile.preferred_salary_min.toString() : "",
            preferred_salary_max: refreshedProfile.preferred_salary_max ? refreshedProfile.preferred_salary_max.toString() : "",
            available_from: refreshedProfile.available_from || "",
            is_open_to_remote: refreshedProfile.is_open_to_remote ?? true,
          })
        }
      }
    } catch (error) {
      console.error("Error in refreshProfile:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const updateData = {
        id: user.id,
        email: user.email,
        full_name: formData.full_name,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        profile_picture_url: formData.profile_picture_url,
        cover_image_url: formData.cover_image_url,
        resume_url: formData.resume_url,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
        portfolio_url: formData.portfolio_url,
        years_experience: Number.parseInt(formData.years_experience.toString()) || 0,
        current_role: formData.current_role,
        preferred_salary_min: formData.preferred_salary_min
          ? Number.parseInt(formData.preferred_salary_min.toString())
          : null,
        preferred_salary_max: formData.preferred_salary_max
          ? Number.parseInt(formData.preferred_salary_max.toString())
          : null,
        available_from: formData.available_from || null,
        is_open_to_remote: formData.is_open_to_remote,
      }

      const { data, error: upsertError } = await supabase
        .from("profiles")
        .upsert(updateData, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()

      if (upsertError) {
        throw upsertError
      }

      if (data && data.length > 0) {
        setCurrentProfile(data[0])
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      
      setTimeout(() => {
        refreshProfile()
      }, 500)
      
    } catch (error: any) {
      setError(error.message || "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled className="bg-muted" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself, your experience, and what you're looking for..."
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              className="min-h-24"
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Professional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current_role">Current Role</Label>
              <Input
                id="current_role"
                placeholder="e.g., Senior Software Engineer"
                value={formData.current_role}
                onChange={(e) => setFormData((prev) => ({ ...prev, current_role: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years_experience">Years of Experience</Label>
              <Input
                id="years_experience"
                type="number"
                min="0"
                max="50"
                placeholder="Enter years of experience"
                value={formData.years_experience.toString()}
                onChange={(e) => setFormData((prev) => ({ ...prev, years_experience: Number.parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferred_salary_min">Preferred Salary Range (USD)</Label>
              <div className="flex gap-2">
                <Input
                  id="preferred_salary_min"
                  type="number"
                  placeholder="Min"
                  value={formData.preferred_salary_min}
                  onChange={(e) => setFormData((prev) => ({ ...prev, preferred_salary_min: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={formData.preferred_salary_max}
                  onChange={(e) => setFormData((prev) => ({ ...prev, preferred_salary_max: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="available_from">Available From</Label>
              <Input
                id="available_from"
                type="date"
                value={formData.available_from}
                onChange={(e) => setFormData((prev) => ({ ...prev, available_from: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_open_to_remote"
              checked={formData.is_open_to_remote}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_open_to_remote: !!checked }))}
            />
            <Label htmlFor="is_open_to_remote">Open to remote work opportunities</Label>
          </div>
        </CardContent>
      </Card>

      {/* Links & Documents */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Links & Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume_url" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Resume URL
            </Label>
            <Input
              id="resume_url"
              type="url"
              placeholder="https://drive.google.com/file/d/your-resume"
              value={formData.resume_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, resume_url: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
              <Input
                id="linkedin_url"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={formData.linkedin_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, linkedin_url: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub Profile</Label>
              <Input
                id="github_url"
                type="url"
                placeholder="https://github.com/yourusername"
                value={formData.github_url}
                onChange={(e) => setFormData((prev) => ({ ...prev, github_url: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="portfolio_url">Portfolio/Website</Label>
            <Input
              id="portfolio_url"
              type="url"
              placeholder="https://your-portfolio.com"
              value={formData.portfolio_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, portfolio_url: e.target.value }))}
              />
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
          <AlertDescription className="text-green-700 dark:text-green-300">
            Profile updated successfully!
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isLoading ? (
            "Saving..."
          ) : profile ? (
            <>
              <Save className="w-4 h-4 mr-2" />
              Update Profile
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Create Profile
            </>
          )}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href="/applications">View Applications</Link>
        </Button>
      </div>

      {!profile && (
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            No profile found. Fill out the form above and click "Create Profile" to get started.
          </AlertDescription>
        </Alert>
      )}
    </form>
  )
}
