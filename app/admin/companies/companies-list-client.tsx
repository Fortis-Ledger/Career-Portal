"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Edit, Eye, Globe, MapPin, Users, Trash2 } from "lucide-react"
import Link from "next/link"

interface Company {
  id: string
  name: string
  description?: string
  industry?: string
  location?: string
  website_url?: string
  logo_url?: string
  size_category?: string
  is_active: boolean
  jobCount: number
}

interface CompaniesListClientProps {
  companies: Company[]
}

function SuccessMessage({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        {message}
      </div>
    </div>
  )
}

export function CompaniesListClient({ companies }: CompaniesListClientProps) {
  const [successMessage, setSuccessMessage] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [companyList, setCompanyList] = useState<Company[]>(companies)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const success = searchParams.get("success")
    if (success) {
      setSuccessMessage(success)
    }
  }, [searchParams])

  // Update company list when props change
  useEffect(() => {
    setCompanyList(companies)
  }, [companies])

  const getSizeLabel = (size: string) => {
    const labels = {
      startup: "Startup",
      small: "Small (1-50)",
      medium: "Medium (51-200)", 
      large: "Large (201-1000)",
      enterprise: "Enterprise (1000+)"
    }
    return labels[size as keyof typeof labels] || size
  }

  const handleDelete = async (companyId: string, companyName: string) => {
    if (!confirm(`Are you sure you want to delete "${companyName}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(companyId)
    try {
      // Use API route for deletion (bypasses RLS with service role)
      const response = await fetch(`/api/admin/companies/${companyId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("Delete API error:", result.error)
        alert(`Error deleting company: ${result.error}`)
        return
      }

      console.log("Company successfully deleted from database")

      // Remove the company from the local state
      setCompanyList(prev => prev.filter(company => company.id !== companyId))
      setSuccessMessage("Company permanently deleted from database")
      
      // Force a hard refresh after a short delay to ensure server state is updated
      setTimeout(() => {
        window.location.reload()
      }, 2000)

    } catch (error) {
      console.error("Error:", error)
      alert("Error deleting company. Please try again.")
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

      {/* Companies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {companyList.map((company) => (
          <Card key={company.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  {company.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt={`${company.name} logo`}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base sm:text-lg text-white truncate">{company.name}</CardTitle>
                    <p className="text-xs sm:text-sm text-slate-400 truncate">{company.industry}</p>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Badge variant={company.is_active ? "default" : "secondary"} className="text-xs">
                    {company.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3">
                {company.description && (
                  <p className="text-xs sm:text-sm text-slate-400 line-clamp-2">
                    {company.description}
                  </p>
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-400">
                  {company.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{company.location}</span>
                    </div>
                  )}
                  {company.size_category && (
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{getSizeLabel(company.size_category)}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                  <div className="text-xs sm:text-sm">
                    <span className="font-medium text-white">{company.jobCount}</span>
                    <span className="text-slate-400"> active jobs</span>
                  </div>
                  
                  <div className="flex gap-1 sm:gap-2">
                    {company.website_url && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50 p-2"
                      >
                        <a href={company.website_url} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-3 h-3" />
                        </a>
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild
                      className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50 p-2"
                    >
                      <Link href={`/admin/companies/${company.id}/edit`}>
                        <Edit className="w-3 h-3" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(company.id, company.name)}
                      disabled={isDeleting === company.id}
                      className="bg-slate-700/50 border-slate-600 text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {companyList.length === 0 && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm text-center">
          <CardContent className="p-8 sm:p-12">
            <Building2 className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">No Companies Yet</h3>
            <p className="text-slate-400 mb-6 text-sm sm:text-base">
              Start by adding your first company to the platform.
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto">
              <Link href="/admin/companies/new">
                <Building2 className="w-4 h-4 mr-2" />
                Add First Company
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  )
}
