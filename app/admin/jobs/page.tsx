import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Sparkles, Search, Plus, Edit, Eye, Trash2, Building2 } from "lucide-react"
import Link from "next/link"
import { ExportButton } from "@/components/export-button"
import { JobsListClient } from "./jobs-list-client"

export const dynamic = "force-dynamic"

async function getJobs() {
  const supabase = await createServerClient()

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

  const { data: jobs } = await supabase.from("jobs").select("*").order("created_at", { ascending: false })

  return { jobs: jobs || [] }
}

export default async function AdminJobsPage() {
  const { jobs } = await getJobs()

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white">
                <Link href="/admin" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">Job Management</span>
              </div>
            </div>
            <Button
              asChild
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              <Link href="/admin/jobs/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Job
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Job Management</h1>
              <p className="text-slate-300">Create, edit, and manage job postings</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {jobs.length} total jobs
              </Badge>
              <ExportButton data={jobs} filename="jobs" type="jobs" />
            </div>
          </div>

          {/* Search */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs by title, company, or description..."
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Jobs List - Client Component for interactivity */}
          <JobsListClient jobs={jobs} />
        </div>
      </div>
      </div>
    </div>
  )
}
