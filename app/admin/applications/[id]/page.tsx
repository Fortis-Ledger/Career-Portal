import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Sparkles, Calendar, User, Building2, FileText, ExternalLink, ChevronDown } from "lucide-react"
import Link from "next/link"
import { ActionButtons } from "./action-buttons"
import { StatusUpdater } from "./status-updater"

export const dynamic = "force-dynamic"

async function getApplication(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const adminEmails = ["admin@fortisledger.io", "admin@fortisarena.io", "ahmedfaraz.sa.48@gmail.com"]
  if (!adminEmails.includes(user.email || "")) {
    redirect("/unauthorized")
  }

  // Get application
  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single()

  if (applicationError || !application) {
    notFound()
  }

  // Get related data
  const [profileResult, jobResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, phone, location, bio, resume_url, linkedin_url, github_url, portfolio_url")
      .eq("id", application.user_id)
      .single(),
    supabase
      .from("jobs")
      .select(`
        id, 
        title, 
        employment_type,
        experience_level,
        location,
        is_remote,
        companies!inner (id, name, industry)
      `)
      .eq("id", application.job_id)
      .single()
  ])

  if (profileResult.error) {
    console.error("Error fetching profile:", profileResult.error)
  }

  if (jobResult.error) {
    console.error("Error fetching job:", jobResult.error)
  }

  return {
    application,
    profile: profileResult.data,
    job: jobResult.data
  }
}



export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const { application, profile, job } = await getApplication(params.id)

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/80 to-pink-900/70" />
      <div className="absolute inset-0 bg-gradient-to-tl from-cyan-800/60 via-blue-800/50 to-indigo-800/60" />
      
      {/* Animated Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/40 to-purple-500/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-32 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-500/35 to-blue-500/35 rounded-full blur-3xl animate-pulse delay-2000" />
      <div className="absolute bottom-40 right-20 w-64 h-64 bg-gradient-to-r from-pink-500/40 to-purple-500/40 rounded-full blur-3xl animate-pulse delay-500" />
      
      {/* Content Wrapper */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-3 sm:px-4 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white w-fit">
                <Link href="/admin/applications" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Applications</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white text-sm sm:text-base">Application Review</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="space-y-6">
            {/* Application Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Application Review</h1>
                <p className="text-slate-300 text-sm sm:text-base">
                  Reviewing application for {job?.title} position
                </p>
              </div>
               <StatusUpdater 
                 applicationId={application.id}
                 currentStatus={application.status}
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Applicant Information */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-white text-base sm:text-lg">Applicant Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0">
                      {profile?.full_name?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-white truncate">{profile?.full_name || "Unknown"}</h3>
                      <p className="text-slate-300 text-sm truncate">{profile?.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {profile?.phone && (
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{profile.phone}</span>
                      </div>
                    )}
                    {profile?.location && (
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{profile.location}</span>
                      </div>
                    )}
                    {profile?.bio && (
                      <p className="text-slate-300 text-xs sm:text-sm line-clamp-3">{profile.bio}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                    {profile?.resume_url && (
                      <Button variant="outline" size="sm" asChild className="w-full bg-slate-700/50 border-slate-600 text-slate-300 text-xs sm:text-sm">
                        <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                          <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          View Resume
                        </a>
                      </Button>
                    )}
                    {profile?.linkedin_url && (
                      <Button variant="outline" size="sm" asChild className="w-full bg-slate-700/50 border-slate-600 text-slate-300 text-xs sm:text-sm">
                        <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {profile?.portfolio_url && (
                      <Button variant="outline" size="sm" asChild className="w-full bg-slate-700/50 border-slate-600 text-slate-300 text-xs sm:text-sm">
                        <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Portfolio
                        </a>
                      </Button>
                    )}
                    {profile?.github_url && (
                      <Button variant="outline" size="sm" asChild className="w-full bg-slate-700/50 border-slate-600 text-slate-300 text-xs sm:text-sm">
                        <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Job Information */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-base sm:text-lg">Job Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white">{job?.title}</h3>
                    <p className="text-slate-300 text-sm">{job?.companies?.[0]?.name}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{job?.employment_type} • {job?.experience_level}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{job?.location} {job?.is_remote && "(Remote)"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application Details */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-white text-base sm:text-lg">Application Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span>Applied: {new Date(application.applied_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                       <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                       <span>Status: {application.status}</span>
                     </div>
                  </div>

                  {application.cover_letter && (
                    <div>
                      <h4 className="font-medium text-white mb-2 text-sm sm:text-base">Cover Letter</h4>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-xs sm:text-sm text-slate-300 max-h-32 sm:max-h-40 overflow-y-auto">
                        {application.cover_letter}
                      </div>
                    </div>
                  )}

                  {application.additional_info && (
                    <div>
                      <h4 className="font-medium text-white mb-2 text-sm sm:text-base">Additional Information</h4>
                      <p className="text-xs sm:text-sm text-slate-300">{application.additional_info}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <ActionButtons 
              applicationId={application.id}
              applicantEmail={profile?.email || ""}
              applicantName={profile?.full_name || "Applicant"}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
