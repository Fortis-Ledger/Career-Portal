import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, Edit, Trash2, Eye, Building2 } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface JobPageProps {
  params: { id: string }
}

async function getJob(id: string) {
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

  const { data: job, error } = await supabase
    .from("jobs")
    .select(`
      *,
      companies (
        id,
        name,
        logo_url,
        industry,
        location
      )
    `)
    .eq("id", id)
    .single()

  if (error || !job) {
    redirect("/admin/jobs")
  }

  return job
}

export default async function AdminJobPage({ params }: JobPageProps) {
  const job = await getJob(params.id)

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/80 to-pink-900/70" />
      <div className="absolute inset-0 bg-gradient-to-tl from-cyan-800/60 via-blue-800/50 to-indigo-800/60" />
      
      {/* Content Wrapper */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white">
                  <Link href="/admin/jobs" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Jobs
                  </Link>
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-white">Job Details</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  asChild
                  className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                >
                  <Link href={`/jobs/${job.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Public
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  <Link href={`/admin/jobs/${job.id}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Job
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                        {job.is_featured && (
                          <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
                            Featured
                          </Badge>
                        )}
                        <Badge variant={job.is_active ? "default" : "secondary"} className="border-0">
                          {job.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-slate-300 text-lg mb-2">{job.companies?.name || "Company"}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <span className="capitalize">{job.employment_type}</span>
                        <span className="capitalize">{job.experience_level} level</span>
                        <span>{job.location}</span>
                        {job.is_remote && (
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            Remote
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Job Description */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-slate-300 whitespace-pre-wrap">{job.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job Stats */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Job Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Views</span>
                    <span className="text-white font-medium">{job.view_count || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <Badge variant={job.is_active ? "default" : "secondary"}>
                      {job.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Featured</span>
                    <Badge variant={job.is_featured ? "default" : "outline"}>
                      {job.is_featured ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Remote</span>
                    <Badge variant={job.is_remote ? "default" : "outline"}>
                      {job.is_remote ? "Yes" : "No"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Salary Info */}
              {(job.salary_min || job.salary_max) && (
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Salary Range</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">
                      ${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}
                    </div>
                    <p className="text-slate-400 text-sm">Per year</p>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                  >
                    <Link href={`/admin/jobs/${job.id}/edit`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Job
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
                    asChild
                  >
                    <Link href={`/jobs/${job.id}`}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Public Page
                    </Link>
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
