"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye, Trash2, Building2, Plus } from "lucide-react"
import Link from "next/link"
import { SuccessMessage } from "@/components/success-message"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface Job {
  id: string
  title: string
  description: string
  company_name?: string
  employment_type: string
  experience_level: string
  location?: string
  is_active: boolean
  is_featured: boolean
  is_remote?: boolean
  view_count?: number
}

interface JobsListClientProps {
  jobs: Job[]
}

export function JobsListClient({ jobs }: JobsListClientProps) {
  const [successMessage, setSuccessMessage] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [jobList, setJobList] = useState<Job[]>(jobs)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const success = searchParams.get("success")
    if (success) {
      setSuccessMessage(success)
    }
  }, [searchParams])

  // Update job list when props change
  useEffect(() => {
    setJobList(jobs)
  }, [jobs])

  const handleDelete = async (jobId: string, jobTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${jobTitle}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(jobId)
    try {
      // Use API route for deletion (bypasses RLS with service role)
      const response = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("Delete API error:", result.error)
        alert(`Error deleting job: ${result.error}`)
        return
      }

      console.log("Job successfully deleted from database")

      // Remove the job from the local state
      setJobList(prev => prev.filter(job => job.id !== jobId))
      setSuccessMessage("Job permanently deleted from database")
      
      // Force a hard refresh after a short delay to ensure server state is updated
      setTimeout(() => {
        window.location.reload()
      }, 2000)

    } catch (error) {
      console.error("Error:", error)
      alert("Error deleting job. Please try again.")
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <>
      {successMessage && (
        <SuccessMessage 
          message={successMessage} 
          onClose={() => setSuccessMessage("")} 
        />
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {jobList.map((job) => (
          <Card key={job.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg text-white">{job.title}</h3>
                    <div className="flex items-center gap-2">
                      {job.is_featured && (
                        <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
                          Featured
                        </Badge>
                      )}
                      <Badge variant={job.is_active ? "default" : "secondary"} className="border-0">
                        {job.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-2">{job.company_name || "Company"}</p>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-slate-400">
                    <span className="capitalize">{job.employment_type}</span>
                    <span className="capitalize">{job.experience_level} level</span>
                    <span>{job.location}</span>
                    {job.is_remote && (
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        Remote
                      </Badge>
                    )}
                    <span>Views: {job.view_count || 0}</span>
                  </div>
                </div>
                <div className="flex gap-2 sm:flex-col sm:gap-2 sm:flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50 flex-1 sm:flex-none"
                  >
                    <Link href={`/jobs/${job.id}`} className="flex items-center justify-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span className="sm:hidden">View</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50 flex-1 sm:flex-none"
                  >
                    <Link href={`/admin/jobs/${job.id}/edit`} className="flex items-center justify-center gap-2">
                      <Edit className="w-4 h-4" />
                      <span className="sm:hidden">Edit</span>
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50 flex-1 sm:flex-none"
                    onClick={() => handleDelete(job.id, job.title)}
                    disabled={isDeleting === job.id}
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="sm:hidden">Delete</span>
                  </Button>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400 line-clamp-2">{job.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {jobList.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700 text-center backdrop-blur-sm">
          <CardContent className="p-12">
            <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-white">No Jobs Posted Yet</h3>
            <p className="text-slate-400 mb-6">Create your first job posting to get started.</p>
            <Button
              asChild
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              <Link href="/admin/jobs/new">
                <Plus className="w-4 h-4 mr-2" />
                Create First Job
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  )
}
