import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EditJobForm } from "./edit-job-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

interface EditJobPageProps {
  params: { id: string }
}

async function getJobAndCompanies(id: string) {
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

  // Get job details with skills
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select(`
      *,
      companies (
        id,
        name,
        logo_url,
        industry,
        location
      ),
      job_skills (
        skill_id,
        skills (
          id,
          name,
          category
        )
      )
    `)
    .eq("id", id)
    .single()

  if (jobError || !job) {
    redirect("/admin/jobs")
  }

  // Get all companies for the dropdown
  const { data: companies } = await supabase
    .from("companies")
    .select("id, name")
    .eq("is_active", true)
    .order("name")

  // Get all skills for the multi-select
  const { data: skills } = await supabase
    .from("skills")
    .select("id, name, category")
    .eq("is_active", true)
    .order("category")
    .order("name")

  // Transform job_skills data to skill_ids array for the form
  const jobWithSkillIds = {
    ...job,
    skill_ids: job.job_skills?.map((js: any) => js.skill_id) || []
  }

  return {
    job: jobWithSkillIds,
    companies: companies || [],
    skills: skills || []
  }
}

export default async function EditJobPage({ params }: EditJobPageProps) {
  const { job, companies, skills } = await getJobAndCompanies(params.id)

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
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white">
                <Link href={`/admin/jobs/${job.id}`} className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Job
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">Edit Job</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Edit Job Posting</h1>
              <p className="text-slate-300">Update the job details and requirements</p>
            </div>

            <EditJobForm job={job} companies={companies} skills={skills} />
          </div>
        </div>
      </div>
    </div>
  )
}
