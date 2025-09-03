import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, DollarSign, Building2, Users } from "lucide-react"
import Link from "next/link"

interface JobCardProps {
  job: {
    id: string
    title: string
    company_name: string
    company_logo?: string
    location: string
    employment_type: string
    experience_level: string
    salary_min?: number
    salary_max?: number
    currency: string
    is_remote: boolean
    is_hybrid: boolean
    is_featured: boolean
    created_at: string
    skills?: Array<{
      name: string
      category: string
      is_required: boolean
    }>
  }
}

export function JobCard({ job }: JobCardProps) {
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
    <Card
      className={`group hover:shadow-lg transition-all duration-300 bg-white border-gray-200 shadow-sm ${
        job.is_featured
          ? "ring-2 ring-blue-500/30 border-blue-200"
          : ""
      }`}
    >
      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
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
              <CardTitle className="text-base sm:text-lg text-gray-900 group-hover:text-blue-600 transition-colors break-words">
                {job.title}
              </CardTitle>
              <p className="text-sm text-gray-600 break-words">{job.company_name}</p>
            </div>
          </div>
          {job.is_featured && (
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white self-start flex-shrink-0">
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-1 min-w-0">
            <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="truncate">{getLocationDisplay()}</span>
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="truncate">{job.employment_type}</span>
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <Users className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <span className="truncate">{job.experience_level}</span>
          </div>
          {formatSalary(job.salary_min, job.salary_max, job.currency) && (
            <div className="flex items-center gap-1 min-w-0">
              <DollarSign className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="truncate">{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
            </div>
          )}
        </div>

        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {job.skills.slice(0, 4).map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className={`text-xs border-gray-300 ${skill.is_required ? "border-blue-200 text-blue-700 bg-blue-50" : "text-gray-600"}`}
              >
                {skill.name}
              </Badge>
            ))}
            {job.skills.length > 4 && (
              <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                +{job.skills.length - 4} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <span className="text-xs text-gray-500 order-2 sm:order-1">Posted {new Date(job.created_at).toLocaleDateString()}</span>
          <Button
            asChild
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto order-1 sm:order-2"
          >
            <Link href={`/jobs/${job.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
