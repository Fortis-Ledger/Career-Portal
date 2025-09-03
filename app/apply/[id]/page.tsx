import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ApplicationForm } from "@/components/application-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2, Sparkles } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface ApplyPageProps {
  params: Promise<{ id: string }>
}

async function getJobAndUser(jobId: string) {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/apply/" + jobId)
  }

  // Get job details
  const { data: job } = await supabase.from("job_listings").select("*").eq("id", jobId).eq("is_active", true).single()

  if (!job) {
    return { user, job: null }
  }

  // Check if user already applied
  const { data: existingApplication } = await supabase
    .from("applications")
    .select("id")
    .eq("job_id", jobId)
    .eq("user_id", user.id)
    .single()

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return { user, job, existingApplication, profile }
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { id } = await params
  const { user, job, existingApplication, profile } = await getJobAndUser(id)

  if (!job) {
    notFound()
  }

  if (existingApplication) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/30 via-purple-100/40 to-pink-100/30"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        {/* Content Wrapper */}
        <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/jobs/${id}`} className="flex items-center gap-1 sm:gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Job</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="font-bold text-sm sm:text-base">FortisLedger</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="border-border/50 text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Application Already Submitted</h1>
                <p className="text-muted-foreground mb-6">
                  You have already applied for the <strong>{job.title}</strong> position at{" "}
                  <strong>{job.company_name}</strong>.
                </p>
                <div className="space-y-3">
                  <Button asChild className="w-full">
                    <Link href="/applications">View My Applications</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/jobs">Browse Other Jobs</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/jobs/${id}`} className="flex items-center gap-1 sm:gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Job</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <span className="font-bold text-sm sm:text-base">FortisLedger</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Job Summary */}
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  {job.company_logo ? (
                    <img
                      src={job.company_logo || "/placeholder.svg"}
                      alt={`${job.company_name} logo`}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl text-gray-900 break-words">{job.title}</CardTitle>
                    <p className="text-gray-600 break-words">{job.company_name}</p>
                  </div>
                </div>
                {job.is_featured && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white self-start sm:self-center flex-shrink-0">Featured</Badge>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Application Form */}
          <ApplicationForm job={job} user={user} profile={profile} />
        </div>
      </div>
    </div>
  )
}
