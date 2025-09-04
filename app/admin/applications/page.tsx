import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Sparkles, Search, Filter, Eye, Calendar, User } from "lucide-react"
import Link from "next/link"
import { ExportButton } from "@/components/export-button"

export const dynamic = "force-dynamic"

async function getApplications() {
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

  // First get applications
  const { data: applications, error: applicationsError } = await supabase
    .from("applications")
    .select("*")
    .order("applied_at", { ascending: false })

  if (applicationsError) {
    console.error("Error fetching applications:", applicationsError)
    return { applications: [] }
  }

  // Then get related data separately
  let applicationsWithDetails = []
  
  if (applications && applications.length > 0) {
    // Get unique user IDs and job IDs
    const userIds = [...new Set(applications.map(app => app.user_id))]
    const jobIds = [...new Set(applications.map(app => app.job_id))]
    
    // Fetch profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone, location")
      .in("id", userIds)
    
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError)
    }
    
    // Fetch jobs with company information
    const { data: jobs, error: jobsError } = await supabase
      .from("jobs")
      .select(`
        id, 
        title, 
        employment_type,
        companies!inner (id, name)
      `)
      .in("id", jobIds)
    
    if (jobsError) {
      console.error("Error fetching jobs:", jobsError)
    }
    
    // Combine the data
    applicationsWithDetails = applications.map(app => ({
      ...app,
      profiles: profiles?.find(p => p.id === app.user_id) || null,
      jobs: jobs?.find(j => j.id === app.job_id) || null
    }))
  }

  // Error handling is done in individual queries above

  console.log("Applications query result:", { applications: applicationsWithDetails, count: applicationsWithDetails?.length })

  return { applications: applicationsWithDetails || [] }
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
  reviewing: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  interview: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
  offer: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
  withdrawn: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300",
}

export default async function AdminApplicationsPage() {
  const { applications } = await getApplications()

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
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white w-fit">
              <Link href="/admin" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Admin Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-sm sm:text-base">Application Management</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Application Management</h1>
              <p className="text-slate-300">Review and manage job applications</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <Badge variant="outline" className="border-slate-600 text-slate-300 w-fit">
                {applications.length} total applications
              </Badge>
              <ExportButton data={applications} filename="applications" type="applications" />
            </div>
          </div>

          {/* Filters */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search candidates, jobs, companies..."
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                  <Select>
                    <SelectTrigger className="w-full sm:w-48 bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="all" className="text-slate-300">
                        All Statuses
                      </SelectItem>
                      <SelectItem value="pending" className="text-slate-300">
                        Pending
                      </SelectItem>
                      <SelectItem value="reviewing" className="text-slate-300">
                        Reviewing
                      </SelectItem>
                      <SelectItem value="interview" className="text-slate-300">
                        Interview
                      </SelectItem>
                      <SelectItem value="offer" className="text-slate-300">
                        Offer
                      </SelectItem>
                      <SelectItem value="rejected" className="text-slate-300">
                        Rejected
                      </SelectItem>
                      <SelectItem value="withdrawn" className="text-slate-300">
                        Withdrawn
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50 whitespace-nowrap"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Applications List */}
          <div className="space-y-4">
            {applications.map((application: any) => (
              <Card key={application.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                        {application.profiles?.full_name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2 mb-1">
                          <h3 className="font-semibold text-base sm:text-lg text-white truncate">
                            {application.profiles?.full_name || "Unknown User"}
                          </h3>
                          <Badge
                            className={`${statusColors[application.status as keyof typeof statusColors]} border-0 w-fit`}
                          >
                            {application.status}
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-2 text-sm sm:text-base">
                          Applied for <strong className="text-cyan-400">{application.jobs?.title}</strong> at{" "}
                          <strong className="text-purple-400">{application.jobs?.companies?.name || "Unknown Company"}</strong>
                        </p>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 text-xs sm:text-sm text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                            {new Date(application.applied_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 truncate">
                            <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">{application.profiles?.email}</span>
                          </div>
                          {application.profiles?.location && (
                            <div className="flex items-center gap-1">
                              <span className="truncate">{application.profiles.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50 w-full sm:w-auto"
                      >
                        <Link href={`/admin/applications/${application.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          Review
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {application.cover_letter && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <details className="group">
                        <summary className="cursor-pointer text-sm font-medium text-slate-400 hover:text-slate-300">
                          Preview Cover Letter
                        </summary>
                        <div className="mt-2 p-3 bg-slate-700/50 rounded-lg text-sm">
                          <p className="line-clamp-3 text-slate-300">{application.cover_letter}</p>
                        </div>
                      </details>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {applications.length === 0 && (
            <Card className="bg-slate-800/50 border-slate-700 text-center backdrop-blur-sm">
              <CardContent className="p-12">
                <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">No Applications Yet</h3>
                <p className="text-slate-400">Applications will appear here once candidates start applying.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
