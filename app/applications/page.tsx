import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, Calendar, Building2, FileText, ExternalLink } from "lucide-react"
import Link from "next/link"

async function getUserApplications() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: applications } = await supabase
    .from("applications")
    .select(
      `
      *,
      jobs:job_id (
        id,
        title,
        employment_type,
        location,
        is_remote,
        is_hybrid,
        companies (
          id,
          name,
          logo_url,
          industry,
          location
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("applied_at", { ascending: false })

  return { user, applications: applications || [] }
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
  reviewing: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  interview: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
  offer: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
  withdrawn: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300",
}

const statusLabels = {
  pending: "Pending Review",
  reviewing: "Under Review",
  interview: "Interview Stage",
  offer: "Offer Extended",
  rejected: "Not Selected",
  withdrawn: "Withdrawn",
}

export default async function ApplicationsPage() {
  const { user, applications } = await getUserApplications()

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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Profile
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">FortisLedger</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/profile">Edit Profile</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/jobs">Browse Jobs</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Applications</h1>
            <p className="text-muted-foreground">
              Track the status of your job applications and manage your career journey.
            </p>
          </div>

          {applications.length > 0 ? (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-border/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
                    <div className="text-sm text-muted-foreground">Total Applications</div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {applications.filter((app) => app.status === "pending").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {applications.filter((app) => app.status === "interview").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Interviews</div>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {applications.filter((app) => app.status === "offer").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Offers</div>
                  </CardContent>
                </Card>
              </div>

              {/* Applications List */}
              <div className="space-y-4">
                {applications.map((application: any) => (
                  <Card key={application.id} className="border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          {application.jobs?.companies?.logo_url ? (
                            <img
                              src={application.jobs.companies.logo_url}
                              alt={`${application.jobs.companies.name} logo`}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-white" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-lg">{application.jobs?.title}</h3>
                              <Badge className={statusColors[application.status as keyof typeof statusColors]}>
                                {statusLabels[application.status as keyof typeof statusLabels]}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-2">{application.jobs?.companies?.name}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Applied {new Date(application.applied_at).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {application.jobs?.employment_type}
                              </div>
                              {application.jobs?.is_remote && <Badge variant="outline">Remote</Badge>}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/jobs/${application.job_id}`}>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Job
                            </Link>
                          </Button>
                        </div>
                      </div>

                      {application.cover_letter && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <details className="group">
                            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              View Cover Letter
                            </summary>
                            <div className="mt-2 p-3 bg-muted/50 rounded-lg text-sm">
                              <p className="whitespace-pre-wrap">{application.cover_letter}</p>
                            </div>
                          </details>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="border-border/50 text-center">
              <CardContent className="p-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start your career journey by applying to exciting opportunities at FortisLedger.
                </p>
                <div className="space-y-3">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Link href="/jobs">Browse Job Opportunities</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/profile">Complete Your Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
