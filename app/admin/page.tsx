import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Briefcase,
  FileText,
  Building2,
  TrendingUp,
  Eye,
  Plus,
  Settings,
  Sparkles,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getAdminData() {
  try {
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables")
      throw new Error("Missing Supabase configuration")
    }

    const supabase = await createClient()

    // Check if supabase client is properly initialized
    if (!supabase || !supabase.auth) {
      console.error("Supabase client not properly initialized")
      redirect("/auth/login")
    }

    console.log("Supabase client created successfully")

    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error("Auth error:", error)
      redirect("/auth/login")
    }

    if (!data || !data.user) {
      console.error("No user data found")
      redirect("/auth/login")
    }

    console.log("User authenticated:", data.user.email)

    const { user } = data

    // Check if user is admin
    const adminEmails = ["admin@fortisledger.io", "admin@fortisarena.io", "ahmedfaraz.sa.48@gmail.com"]
    if (!adminEmails.includes(user.email || "")) {
      console.error("User not authorized as admin:", user.email)
      redirect("/unauthorized")
    }

    console.log("Admin access granted for:", user.email)

    // Get dashboard statistics
    const [jobsResult, applicationsResult, usersResult, companiesResult] = await Promise.all([
      supabase.from("jobs").select("id, is_active, created_at", { count: "exact" }),
      supabase.from("applications").select("id, status, applied_at", { count: "exact" }),
      supabase.from("profiles").select("id, created_at", { count: "exact" }),
      supabase.from("companies").select("id, is_active", { count: "exact" }),
    ])

    // Get recent applications
    const { data: recentApplicationsData, error: recentApplicationsError } = await supabase
      .from("applications")
      .select("*")
      .order("applied_at", { ascending: false })
      .limit(5)

    let recentApplications = []
    
    if (recentApplicationsData && recentApplicationsData.length > 0) {
      // Get unique user IDs and job IDs
      const userIds = [...new Set(recentApplicationsData.map(app => app.user_id))]
      const jobIds = [...new Set(recentApplicationsData.map(app => app.job_id))]
      
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, email")
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
          companies!inner (id, name)
        `)
        .in("id", jobIds)
      
      if (jobsError) {
        console.error("Error fetching jobs:", jobsError)
      }
      
      // Combine the data
      recentApplications = recentApplicationsData.map(app => ({
        ...app,
        profiles: profiles?.find(p => p.id === app.user_id) || null,
        jobs: jobs?.find(j => j.id === app.job_id) || null
      }))
    }

    // Get application stats by status
    const applicationsByStatus = applicationsResult.data?.reduce(
      (acc: Record<string, number>, app: any) => {
        acc[app.status] = (acc[app.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      user,
      stats: {
        totalJobs: jobsResult.count || 0,
        activeJobs: jobsResult.data?.filter((job: any) => job.is_active).length || 0,
        totalApplications: applicationsResult.count || 0,
        totalUsers: usersResult.count || 0,
        totalCompanies: companiesResult.count || 0,
        activeCompanies: companiesResult.data?.filter((company: any) => company.is_active).length || 0,
      },
      recentApplications: recentApplications || [],
      applicationsByStatus: applicationsByStatus || {},
    }
  } catch (error) {
    console.error("Error in getAdminData:", error)
    redirect("/auth/login")
  }
}

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  reviewing: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  interview: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  offer: "bg-green-500/20 text-green-300 border-green-500/30",
  rejected: "bg-red-500/20 text-red-300 border-red-500/30",
  withdrawn: "bg-gray-500/20 text-gray-300 border-gray-500/30",
}

export default async function AdminDashboard() {
  const { user, stats, recentApplications, applicationsByStatus } = await getAdminData()

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
        <header className="border-b border-white/20 bg-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                    FortisLedger Admin
                  </h1>
                  <p className="text-xs text-slate-300 hidden sm:block">Career Portal Management</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30 hidden sm:inline-flex">
                  Admin Access
                </Badge>
                <Button
                  variant="outline"
                  asChild
                  size="sm"
                  className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50 text-xs sm:text-sm"
                >
                  <Link href="/">
                    <span className="hidden sm:inline">View Portal</span>
                    <span className="sm:hidden">Portal</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

                 <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-white">Welcome back, {user.email?.split("@")[0]}</h1>
            <p className="text-sm sm:text-base text-slate-300">
              Manage your career portal, review applications, and track performance metrics.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
            <Button
              asChild
              className="h-auto p-3 sm:p-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              <Link href="/admin/jobs/new" className="flex flex-col items-center gap-1 sm:gap-2">
                <Plus className="w-4 h-4 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm text-center">Post New Job</span>
              </Link>
            </Button>
            <Button
              asChild
              className="h-auto p-3 sm:p-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Link href="/admin/companies/new" className="flex flex-col items-center gap-1 sm:gap-2">
                <Building2 className="w-4 h-4 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm text-center">Add Company</span>
              </Link>
            </Button>
            <Button
              asChild
              className="h-auto p-3 sm:p-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <Link href="/admin/companies" className="flex flex-col items-center gap-1 sm:gap-2">
                <Settings className="w-4 h-4 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm text-center">Manage Companies</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto p-3 sm:p-4 bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50"
            >
              <Link href="/admin/applications" className="flex flex-col items-center gap-1 sm:gap-2">
                <FileText className="w-4 h-4 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm text-center">Review Applications</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto p-3 sm:p-4 bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50"
            >
              <Link href="/admin/jobs" className="flex flex-col items-center gap-1 sm:gap-2">
                <Briefcase className="w-4 h-4 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm text-center">Manage Jobs</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto p-3 sm:p-4 bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50"
            >
              <Link href="/admin/users" className="flex flex-col items-center gap-1 sm:gap-2">
                <Users className="w-4 h-4 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm text-center">View Users</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto p-3 sm:p-4 bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700/50"
            >
              <Link href="/admin/analytics" className="flex flex-col items-center gap-1 sm:gap-2">
                <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm text-center">Analytics</span>
              </Link>
            </Button>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Total Jobs</CardTitle>
                <Briefcase className="h-4 w-4 text-cyan-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalJobs}</div>
                <p className="text-xs text-slate-400">{stats.activeJobs} active positions</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Applications</CardTitle>
                <FileText className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalApplications}</div>
                <p className="text-xs text-slate-400">{applicationsByStatus.pending || 0} pending review</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Registered Users</CardTitle>
                <Users className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                <p className="text-xs text-slate-400">Total candidates</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Companies</CardTitle>
                <Building2 className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalCompanies}</div>
                <p className="text-xs text-slate-400">{stats.activeCompanies} active</p>
              </CardContent>
            </Card>
          </div>

          {/* Application Status Overview */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5" />
                Application Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {Object.entries(applicationsByStatus).map(([status, count]) => (
                  <div key={status} className="text-center">
                    <div className="text-2xl font-bold text-white">{count}</div>
                    <Badge className={statusColors[status as keyof typeof statusColors]} variant="outline">
                      {status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Applications */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="w-5 h-5" />
                  Recent Applications
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                >
                  <Link href="/admin/applications">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentApplications.length > 0 ? (
                <div className="space-y-4">
                  {recentApplications.map((application: any) => (
                    <div
                      key={application.id}
                      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-slate-700 rounded-lg bg-slate-700/30"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-medium text-sm sm:text-base flex-shrink-0">
                          {application.profiles?.full_name?.charAt(0) || "U"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-white text-sm sm:text-base truncate">{application.profiles?.full_name || "Unknown User"}</p>
                          <p className="text-xs sm:text-sm text-slate-300">
                            Applied for <span className="text-cyan-400">{application.jobs?.title}</span>
                          </p>
                          <p className="text-xs sm:text-sm text-slate-300">
                            at <span className="text-purple-400">{application.jobs?.companies?.[0]?.name || "Unknown Company"}</span>
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(application.applied_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 sm:flex-shrink-0">
                        <Badge
                          className={`${statusColors[application.status as keyof typeof statusColors]} text-xs`}
                          variant="outline"
                        >
                          {application.status}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50 px-2 sm:px-3"
                        >
                          <Link href={`/admin/applications/${application.id}`}>
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="ml-1 text-xs sm:hidden">View</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-400 py-8">No recent applications</p>
              )}
            </CardContent>
          </Card>

          {/* Management Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Briefcase className="w-5 h-5" />
                  Job Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                >
                  <Link href="/admin/jobs">View All Jobs</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                >
                  <Link href="/admin/jobs/new">Create New Job</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                >
                  <Link href="/admin/companies">Manage Companies</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                >
                  <Link href="/admin/users">View All Users</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                >
                  <Link href="/admin/applications">Review Applications</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                >
                  <Link href="/admin/analytics">View Analytics</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="w-5 h-5" />
                  System Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                >
                  <Link href="/admin/skills">Manage Skills</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                >
                  <Link href="/admin/settings">Portal Settings</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full justify-start bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                >
                  <Link href="/admin/export">Export Data</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
