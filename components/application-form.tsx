"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, LinkIcon, Send } from "lucide-react"
import { useRouter } from "next/navigation"

interface ApplicationFormProps {
  job: any
  user: any
  profile: any
}

export function ApplicationForm({ job, user, profile }: ApplicationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    coverLetter: "",
    resumeUrl: profile?.resume_url || "",
    portfolioUrl: profile?.portfolio_url || "",
    githubUrl: profile?.github_url || "",
    additionalInfo: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Update profile with new URLs if provided
      if (formData.resumeUrl !== profile?.resume_url || 
          formData.portfolioUrl !== profile?.portfolio_url ||
          formData.githubUrl !== profile?.github_url) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            resume_url: formData.resumeUrl || null,
            portfolio_url: formData.portfolioUrl || null,
            github_url: formData.githubUrl || null,
          })
          .eq("id", user.id)

        if (profileError) throw profileError
      }

      // Submit application
      const { error: applicationError } = await supabase.from("applications").insert({
        job_id: job.id,
        user_id: user.id,
        cover_letter: formData.coverLetter,
        resume_url: formData.resumeUrl,
        portfolio_url: formData.portfolioUrl,
        additional_info: formData.additionalInfo,
        status: "pending",
      })

      if (applicationError) throw applicationError

      setSuccess(true)
      setTimeout(() => {
        router.push("/applications")
      }, 2000)
    } catch (error: any) {
      setError(error.message || "Failed to submit application")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-muted-foreground mb-4">
            Your application for <strong>{job.title}</strong> has been successfully submitted to{" "}
            <strong>{job.company_name}</strong>.
          </p>
          <p className="text-sm text-muted-foreground">Redirecting to your applications...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Apply for {job.title}</CardTitle>
        <p className="text-muted-foreground text-sm sm:text-base">
          Complete the form below to submit your application. All fields marked with * are required.
        </p>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Cover Letter */}
          <div className="space-y-2">
            <Label htmlFor="coverLetter">
              Cover Letter *
              <span className="text-sm text-muted-foreground ml-2">Tell us why you're interested in this role</span>
            </Label>
            <Textarea
              id="coverLetter"
              placeholder="Dear Hiring Manager,

I am excited to apply for the [Position] role at [Company]. With my background in..."
              value={formData.coverLetter}
              onChange={(e) => setFormData((prev) => ({ ...prev, coverLetter: e.target.value }))}
              className="min-h-32"
              required
            />
          </div>

          {/* Resume URL */}
          <div className="space-y-2">
            <Label htmlFor="resumeUrl" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Resume URL *
            </Label>
            <Input
              id="resumeUrl"
              type="url"
              placeholder="https://drive.google.com/file/d/your-resume-link"
              value={formData.resumeUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, resumeUrl: e.target.value }))}
              required
            />
            <p className="text-xs text-muted-foreground">
              Upload your resume to Google Drive, Dropbox, or similar service and paste the public link here.
            </p>
          </div>

          {/* Portfolio URL */}
          <div className="space-y-2">
            <Label htmlFor="portfolioUrl" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Portfolio/Website URL
            </Label>
            <Input
              id="portfolioUrl"
              type="url"
              placeholder="https://your-portfolio.com"
              value={formData.portfolioUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, portfolioUrl: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Link to your portfolio or personal website.
            </p>
          </div>

          {/* GitHub URL */}
          <div className="space-y-2">
            <Label htmlFor="githubUrl" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              GitHub Profile URL
            </Label>
            <Input
              id="githubUrl"
              type="url"
              placeholder="https://github.com/yourusername"
              value={formData.githubUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Optional: Link to your GitHub profile to showcase your code.
            </p>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              placeholder="Any additional information you'd like to share (certifications, availability, salary expectations, etc.)"
              value={formData.additionalInfo}
              onChange={(e) => setFormData((prev) => ({ ...prev, additionalInfo: e.target.value }))}
              className="min-h-24"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                "Submitting Application..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
              Cancel
            </Button>
          </div>

          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p className="font-medium mb-1">Before submitting:</p>
            <ul className="space-y-1">
              <li>• Double-check your resume link is accessible</li>
              <li>• Review your cover letter for typos</li>
              <li>• Ensure all required fields are completed</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
