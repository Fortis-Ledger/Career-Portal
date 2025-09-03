"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Save, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Job {
  id: string
  title: string
  description: string
  company_id: string
  employment_type: string
  experience_level: string
  location: string
  salary_min?: number
  salary_max?: number
  is_remote: boolean
  is_active: boolean
  is_featured: boolean
  skill_ids?: string[]
}

interface Company {
  id: string
  name: string
}

interface Skill {
  id: string
  name: string
  category: string
}

interface EditJobFormProps {
  job: Job
  companies: Company[]
  skills: Skill[]
}

const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
]

const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead" },
  { value: "executive", label: "Executive" },
]

export function EditJobForm({ job, companies, skills }: EditJobFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: job.title,
    description: job.description,
    company_id: job.company_id,
    employment_type: job.employment_type,
    experience_level: job.experience_level,
    location: job.location || "",
    salary_min: job.salary_min || "",
    salary_max: job.salary_max || "",
    is_remote: job.is_remote,
    is_active: job.is_active,
    is_featured: job.is_featured,
    skill_ids: job.skill_ids || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      
      const updateData = {
        title: formData.title,
        description: formData.description,
        company_id: formData.company_id,
        employment_type: formData.employment_type,
        experience_level: formData.experience_level,
        location: formData.location,
        salary_min: formData.salary_min ? parseInt(formData.salary_min.toString()) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max.toString()) : null,
        is_remote: formData.is_remote,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        skill_ids: formData.skill_ids,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from("jobs")
        .update(updateData)
        .eq("id", job.id)

      if (error) {
        console.error("Error updating job:", error)
        alert("Error updating job. Please try again.")
        return
      }

      router.push(`/admin/jobs/${job.id}?success=Job updated successfully`)
    } catch (error) {
      console.error("Error:", error)
      alert("Error updating job. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSkill = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      skill_ids: prev.skill_ids.includes(skillId)
        ? prev.skill_ids.filter(id => id !== skillId)
        : [...prev.skill_ids, skillId]
    }))
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-slate-300">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-slate-700/50 border-slate-600 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="company" className="text-slate-300">Company *</Label>
              <Select
                value={formData.company_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, company_id: value }))}
              >
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location" className="text-slate-300">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="bg-slate-700/50 border-slate-600 text-white"
                placeholder="e.g. New York, NY"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employment_type" className="text-slate-300">Employment Type *</Label>
                <Select
                  value={formData.employment_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, employment_type: value }))}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="experience_level" className="text-slate-300">Experience Level *</Label>
                <Select
                  value={formData.experience_level}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, experience_level: value }))}
                >
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Settings */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Job Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary_min" className="text-slate-300">Min Salary</Label>
                <Input
                  id="salary_min"
                  type="number"
                  value={formData.salary_min}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary_min: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="50000"
                />
              </div>

              <div>
                <Label htmlFor="salary_max" className="text-slate-300">Max Salary</Label>
                <Input
                  id="salary_max"
                  type="number"
                  value={formData.salary_max}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary_max: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white"
                  placeholder="80000"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_remote"
                  checked={formData.is_remote}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_remote: !!checked }))}
                />
                <Label htmlFor="is_remote" className="text-slate-300">Remote Work Available</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: !!checked }))}
                />
                <Label htmlFor="is_featured" className="text-slate-300">Featured Job</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: !!checked }))}
                />
                <Label htmlFor="is_active" className="text-slate-300">Job is Active</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Description */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="bg-slate-700/50 border-slate-600 text-white min-h-[200px]"
            placeholder="Describe the job role, responsibilities, requirements..."
            required
          />
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Required Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <div key={category}>
                <h4 className="font-medium text-slate-300 mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <Badge
                      key={skill.id}
                      variant={formData.skill_ids.includes(skill.id) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        formData.skill_ids.includes(skill.id)
                          ? "bg-cyan-500 hover:bg-cyan-600"
                          : "border-slate-600 text-slate-300 hover:bg-slate-700"
                      }`}
                      onClick={() => toggleSkill(skill.id)}
                    >
                      {skill.name}
                      {formData.skill_ids.includes(skill.id) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? "Updating..." : "Update Job"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
