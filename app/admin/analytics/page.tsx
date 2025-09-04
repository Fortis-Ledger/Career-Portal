import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, Users, Briefcase, FileText, ArrowLeft, Sparkles } from "lucide-react"
import { redirect } from "next/navigation"
import { AnalyticsCharts } from "@/components/analytics-charts"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getAnalyticsData() {
  const supabase = await createServerClient()

  if (!supabase) {
    redirect("/auth/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const adminEmails = ["admin@fortisledger.io", "admin@fortisarena.io", "ahmedfaraz.sa.48@gmail.com"]
  if (!adminEmails.includes(user.email || "")) {
    redirect("/unauthorized")
  }

  // Get application trends over time
  const { data: applicationTrends } = await supabase
    .from("applications")
    .select("created_at, status")
    .order("created_at", { ascending: true })

  // Get job performance metrics
  const { data: jobMetrics } = await supabase.from("jobs_with_details").select("title, application_count, department")

  // Get user registration trends
  const { data: userTrends } = await supabase
    .from("profiles")
    .select("created_at")
    .order("created_at", { ascending: true })

  // Get status distribution
  const { data: statusData } = await supabase.from("applications").select("status")

  return {
    applicationTrends: applicationTrends || [],
    jobMetrics: jobMetrics || [],
    userTrends: userTrends || [],
    statusData: statusData || [],
  }
}

function processApplicationTrends(data: any[]) {
  const monthlyData = data.reduce((acc, app) => {
    const month = new Date(app.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    if (!acc[month]) {
      acc[month] = { month, applications: 0, pending: 0, reviewed: 0, accepted: 0, rejected: 0 }
    }
    acc[month].applications++
    acc[month][app.status]++
    return acc
  }, {})

  return Object.values(monthlyData)
}

function processStatusDistribution(data: any[]) {
  const statusCounts = data.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {})

  const colors = {
    pending: "#3b82f6",
    reviewed: "#f59e0b",
    accepted: "#10b981",
    rejected: "#ef4444",
  }

  return Object.entries(statusCounts).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    fill: colors[status as keyof typeof colors] || "#6b7280",
  }))
}

export default async function AnalyticsPage() {
  const { applicationTrends, jobMetrics, userTrends, statusData } = await getAnalyticsData()

  const processedTrends = processApplicationTrends(applicationTrends)
  const statusDistribution = processStatusDistribution(statusData)

  const totalApplications = applicationTrends.length
  const totalUsers = userTrends.length
  const totalJobs = jobMetrics.length
  const avgApplicationsPerJob = totalJobs > 0 ? Math.round(totalApplications / totalJobs) : 0

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
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white">
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
                <span className="font-bold text-white">Analytics Dashboard</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
                <p className="text-slate-300 text-sm sm:text-base">Comprehensive insights into your career portal performance</p>
              </div>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                <span className="text-sm sm:text-base">Export Report</span>
              </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Total Applications</CardTitle>
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-white">{totalApplications}</div>
                  <p className="text-xs text-slate-400">
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Registered Users</CardTitle>
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-white">{totalUsers}</div>
                  <p className="text-xs text-slate-400">
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Active Jobs</CardTitle>
                  <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-white">{totalJobs}</div>
                  <p className="text-xs text-slate-400">
                    <TrendingUp className="inline w-3 h-3 mr-1" />
                    +3 new this week
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-slate-300">Avg Apps/Job</CardTitle>
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-white">{avgApplicationsPerJob}</div>
                  <p className="text-xs text-slate-400">Applications per position</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <AnalyticsCharts
              processedTrends={processedTrends}
              statusDistribution={statusDistribution}
              jobMetrics={jobMetrics}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
