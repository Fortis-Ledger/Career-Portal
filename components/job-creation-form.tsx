"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Save, Loader2 } from "lucide-react"
import Link from "next/link"

interface JobCreationFormProps {
  companies: Array<{ id: string; name: string }>
  skills: Array<{ id: string; name: string; category: string }>
}

export function JobCreationForm({ companies, skills }: JobCreationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    company_id: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    salary_min: "",
    salary_max: "",
    currency: "USD",
    employment_type: "",
    experience_level: "",
    location: "",
    is_remote: false,
    is_hybrid: false,
    department: "",
    application_deadline: "",
    is_featured: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Submitting job data:", formData)
      
      const response = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const responseData = await response.json()
      console.log("Response:", response.status, responseData)

      if (response.ok) {
        const { job } = responseData
        router.push(`/admin/jobs?success=Job "${job.title}" created successfully`)
      } else {
        console.error("Job creation failed:", responseData)
        alert(`Error: ${responseData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error("Error creating job:", error)
      alert("Failed to create job. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-slate-300">Job Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Senior Software Engineer"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_id" className="text-slate-300">Company *</Label>
          <Select 
            value={formData.company_id} 
            onValueChange={(value) => handleSelectChange("company_id", value)}
            required
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id} className="text-white hover:bg-slate-600">
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-slate-300">Job Description *</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Provide a comprehensive description of the role..."
          rows={6}
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="requirements" className="text-slate-300">Requirements</Label>
          <Textarea
            id="requirements"
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            placeholder="List the key requirements..."
            rows={4}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="responsibilities" className="text-slate-300">Responsibilities</Label>
          <Textarea
            id="responsibilities"
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleInputChange}
            placeholder="List the key responsibilities..."
            rows={4}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="benefits" className="text-slate-300">Benefits</Label>
        <Textarea
          id="benefits"
          name="benefits"
          value={formData.benefits}
          onChange={handleInputChange}
          placeholder="List the benefits and perks..."
          rows={3}
          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
        />
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="employment_type" className="text-slate-300">Employment Type *</Label>
          <Select 
            value={formData.employment_type} 
            onValueChange={(value) => handleSelectChange("employment_type", value)}
            required
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="full-time" className="text-white hover:bg-slate-600">Full-time</SelectItem>
              <SelectItem value="part-time" className="text-white hover:bg-slate-600">Part-time</SelectItem>
              <SelectItem value="contract" className="text-white hover:bg-slate-600">Contract</SelectItem>
              <SelectItem value="internship" className="text-white hover:bg-slate-600">Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience_level" className="text-slate-300">Experience Level *</Label>
          <Select 
            value={formData.experience_level} 
            onValueChange={(value) => handleSelectChange("experience_level", value)}
            required
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="entry" className="text-white hover:bg-slate-600">Entry</SelectItem>
              <SelectItem value="mid" className="text-white hover:bg-slate-600">Mid</SelectItem>
              <SelectItem value="senior" className="text-white hover:bg-slate-600">Senior</SelectItem>
              <SelectItem value="lead" className="text-white hover:bg-slate-600">Lead</SelectItem>
              <SelectItem value="executive" className="text-white hover:bg-slate-600">Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="department" className="text-slate-300">Department</Label>
          <Input
            id="department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            placeholder="e.g., Engineering, Sales"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="location" className="text-slate-300">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="e.g., New York, NY or Remote"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="application_deadline" className="text-slate-300">Application Deadline</Label>
          <Input
            id="application_deadline"
            name="application_deadline"
            type="date"
            value={formData.application_deadline}
            onChange={handleInputChange}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>
      </div>

      {/* Salary Range */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="salary_min" className="text-slate-300">Salary Min</Label>
          <Input
            id="salary_min"
            name="salary_min"
            type="number"
            value={formData.salary_min}
            onChange={handleInputChange}
            placeholder="50000"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salary_max" className="text-slate-300">Salary Max</Label>
          <Input
            id="salary_max"
            name="salary_max"
            type="number"
            value={formData.salary_max}
            onChange={handleInputChange}
            placeholder="80000"
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency" className="text-slate-300">Currency</Label>
          <Select 
            value={formData.currency} 
            onValueChange={(value) => handleSelectChange("currency", value)}
          >
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="USD" className="text-white hover:bg-slate-600">USD</SelectItem>
              <SelectItem value="EUR" className="text-white hover:bg-slate-600">EUR</SelectItem>
              <SelectItem value="GBP" className="text-white hover:bg-slate-600">GBP</SelectItem>
              <SelectItem value="PKR" className="text-white hover:bg-slate-600">PKR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Work Options */}
      <div className="space-y-4">
        <Label className="text-slate-300">Work Options</Label>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is_remote" 
              checked={formData.is_remote}
              onCheckedChange={(checked) => handleCheckboxChange("is_remote", checked as boolean)}
            />
            <Label htmlFor="is_remote" className="text-slate-300">Remote Work Available</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is_hybrid" 
              checked={formData.is_hybrid}
              onCheckedChange={(checked) => handleCheckboxChange("is_hybrid", checked as boolean)}
            />
            <Label htmlFor="is_hybrid" className="text-slate-300">Hybrid Work Available</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="is_featured" 
              checked={formData.is_featured}
              onCheckedChange={(checked) => handleCheckboxChange("is_featured", checked as boolean)}
            />
            <Label htmlFor="is_featured" className="text-slate-300">Featured Job</Label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" asChild className="border-slate-600 text-slate-300 hover:bg-slate-700">
          <Link href="/admin/jobs">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Create Job
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
