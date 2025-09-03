import { createClient } from "@/lib/supabase/server"
import { JobSearch } from "@/components/job-search"
import { JobSearchWrapper } from "@/components/job-search-wrapper"
import { JobCard } from "@/components/job-card"
import { AuthButton } from "@/components/auth-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Briefcase, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"
import { generatePageMetadata } from "@/lib/seo-config"

export const metadata: Metadata = generatePageMetadata(
  "FortisLedger Career Opportunities",
  "Explore all available job opportunities at FortisLedger in technology, blockchain, AI, quantum computing, and engineering. Find your perfect career match.",
  "/jobs"
)

interface JobsPageProps {
  searchParams: Promise<{
    q?: string
    skills?: string
    employment?: string
    experience?: string
    remote?: string
    salary?: string
  }>
}

async function getJobs(filters?: any) {
  const supabase = await createClient()

  let query = supabase
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
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })

  // Apply filters if provided
  if (filters?.q) {
    const searchTerm = filters.q.trim()
    // Use simple title search first, then expand if needed
    query = query.ilike('title', `%${searchTerm}%`)
  }

  if (filters?.remote === "true") {
    query = query.eq("is_remote", true)
  }

  if (filters?.employment) {
    const types = filters.employment.split(",")
    query = query.in("employment_type", types)
  }

  if (filters?.experience) {
    const levels = filters.experience.split(",")
    query = query.in("experience_level", levels)
  }

  if (filters?.skills) {
    const skillIds = filters.skills.split(",")
    // Filter jobs that have any of the selected skills
    query = query.overlaps("skill_ids", skillIds)
  }

  if (filters?.salary) {
    const minSalary = parseInt(filters.salary)
    query = query.gte("salary_min", minSalary)
  }

  const { data: jobs, error } = await query.limit(50)
  
  if (error) {
    console.error('Database query error:', error)
  }
  
  console.log('Jobs found:', jobs?.length || 0)
  if (filters?.q) {
    console.log('Jobs data:', jobs?.map(job => ({ title: job.title, company: job.companies?.name })))
  }
  
  return jobs || []
}

async function getSkills() {
  const supabase = await createClient()
  const { data: skills } = await supabase
    .from("skills")
    .select("id, name, category")
    .eq("is_active", true)
    .order("category")
    .order("name")

  return skills || []
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams
  const [jobs, skills] = await Promise.all([getJobs(params), getSkills()])
  
  // Get current user for auth button
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="flex items-center gap-1 sm:gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </Link>
              </Button>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                    FortisLedger Jobs
                  </h1>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <AuthButton user={user} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-4">
            <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">FortisLedger Career Opportunities</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Discover your next career opportunity in cutting-edge technology. Filter by skills, location, and more to
            find the perfect match.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4">
            <Badge variant="outline" className="border-gray-300 text-gray-700">{jobs.length} positions available</Badge>
            <Badge variant="outline" className="border-gray-300 text-gray-700">{skills.length} skills tracked</Badge>
          </div>
        </div>

        {/* Job Search */}
        <div className="mb-8">
          <JobSearchWrapper skills={skills} />
        </div>

        {/* Job Results */}
        {jobs.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {params.q ? `Search results for "${params.q}"` : "All Positions"}
              </h2>
              <p className="text-sm text-gray-600">{jobs.length} jobs found</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">No jobs found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search filters or check back later.</p>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
