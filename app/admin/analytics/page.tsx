import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, Users, Briefcase, FileText } from "lucide-react"
import { redirect } from "next/navigation"
import { AnalyticsCharts } from "@/components/analytics-charts"

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
      <div className="relative z-10 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-slate-300">Comprehensive insights into your career portal performance</p>
          </div>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalApplications}</div>
              <p className="text-xs text-slate-400">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Registered Users</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalUsers}</div>
              <p className="text-xs text-slate-400">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalJobs}</div>
              <p className="text-xs text-slate-400">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +3 new this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Avg Apps/Job</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{avgApplicationsPerJob}</div>
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
  )
}
