import { createClient } from "@/lib/supabase/server"
import { AuthButton } from "@/components/auth-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Users,
  Calendar,
  Eye,
  ArrowLeft,
  ExternalLink,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface JobDetailPageProps {
  params: Promise<{ id: string }>
}

async function getJob(id: string) {
  const supabase = await createClient()

  const { data: job } = await supabase
    .from("jobs")
    .select(`
      *,
      companies (
        id,
        name,
        logo_url,
        industry,
        location,
        description,
        website_url
      )
    `)
    .eq("id", id)
    .eq("is_active", true)
    .single()

  if (!job) {
    return null
  }

  // Increment view count
  await supabase.rpc("increment_job_views", { job_id: id })

  return job
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params
  const job = await getJob(id)

  if (!job) {
    notFound()
  }

  // Get current user for auth button
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const formatSalary = (min?: number, max?: number, currency = "USD") => {
    if (!min && !max) return null
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })

    if (min && max) {
      return `${formatter.format(min)} - ${formatter.format(max)}`
    }
    return formatter.format(min || max || 0)
  }

  const getLocationDisplay = () => {
    if (job.is_remote) return "Remote"
    if (job.is_hybrid) return `${job.location} (Hybrid)`
    return job.location
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/jobs" className="flex items-center gap-1 sm:gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Jobs</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="font-bold text-sm sm:text-base truncate">FortisLedger</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <AuthButton user={user} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Job Header */}
          <Card className="border-gray-200 bg-white shadow-sm">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                  {job.companies?.logo_url ? (
                    <img
                      src={job.companies.logo_url}
                      alt={`${job.companies.name} logo`}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <CardTitle className="text-xl sm:text-2xl text-gray-900 break-words">{job.title}</CardTitle>
                      {job.is_featured && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white self-start">Featured</Badge>
                      )}
                    </div>
                    <p className="text-base sm:text-lg text-gray-600 break-words">{job.companies?.name}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Eye className="w-4 h-4" />
                      {job.view_count} views
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto sm:size-lg flex-shrink-0"
                >
                  <Link href={`/apply/${job.id}`}>Apply Now</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{getLocationDisplay()}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 capitalize truncate">{job.employment_type}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Users className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 capitalize truncate">{job.experience_level} level</span>
                </div>
                {formatSalary(job.salary_min, job.salary_max, job.currency) && (
                  <div className="flex items-center gap-2 min-w-0">
                    <DollarSign className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
                  </div>
                )}
              </div>

              {job.application_deadline && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 text-orange-700">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Application deadline: {new Date(job.application_deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700">{job.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Responsibilities */}
              {job.responsibilities && (
                <Card className="border-gray-200 bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Key Responsibilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap text-gray-700">{job.responsibilities}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Requirements */}
              {job.requirements && (
                <Card className="border-gray-200 bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap text-gray-700">{job.requirements}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              {job.benefits && (
                <Card className="border-gray-200 bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Benefits & Perks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap text-gray-700">{job.benefits}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <Card className="border-gray-200 bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill: any, index: number) => (
                        <Badge
                          key={index}
                          variant={skill.is_required ? "default" : "outline"}
                          className={
                            skill.is_required ? "bg-blue-100 text-blue-700" : "border-gray-300 text-gray-600"
                          }
                        >
                          {skill.name}
                          {skill.is_required && " *"}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">* Required skills</p>
                  </CardContent>
                </Card>
              )}

              {/* Company Info */}
              <Card className="border-gray-200 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">About {job.companies?.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.companies?.description && <p className="text-sm text-gray-700">{job.companies.description}</p>}
                  <div className="space-y-2 text-sm">
                    {job.companies?.industry && (
                      <div className="text-gray-700">
                        <span className="font-medium text-gray-900">Industry:</span> {job.companies.industry}
                      </div>
                    )}
                    {job.companies?.location && (
                      <div className="text-gray-700">
                        <span className="font-medium text-gray-900">Location:</span> {job.companies.location}
                      </div>
                    )}
                  </div>
                  {job.companies?.website_url && (
                    <Button variant="outline" size="sm" asChild className="w-full bg-white border-gray-300 text-gray-700 hover:bg-gray-50">
                      <a href={job.companies.website_url} target="_blank" rel="noopener noreferrer">
                        Visit Website
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Apply Card */}
              <Card className="border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 shadow-sm">
                <CardContent className="p-4 sm:p-6 text-center">
                  <h3 className="font-semibold mb-2 text-gray-900">Ready to Apply?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Join {job.companies?.name} and be part of the future of technology.
                  </p>
                  <Button
                    size="sm"
                    asChild
                    className="w-full sm:size-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Link href={`/apply/${job.id}`}>Apply for this Position</Link>
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
