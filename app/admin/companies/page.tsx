import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Plus, Edit, Eye, Globe, MapPin, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CompaniesListClient } from "./companies-list-client"

async function getCompanies() {
  const supabase = await createClient()
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", user.id)
    .single()

  const adminEmails = [
    'admin@fortisledger.io',
    'admin@fortisarena.io', 
    'ahmedfaraz.sa.48@gmail.com'
  ]

  if (!profile || !adminEmails.includes(profile.email)) {
    redirect("/unauthorized")
  }

  // Get all companies
  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false })

  // Get job counts for each company
  const { data: jobCounts } = await supabase
    .from("jobs")
    .select("company_id")
    .eq("is_active", true)

  const companiesWithCounts = companies?.map(company => ({
    ...company,
    jobCount: jobCounts?.filter(job => job.company_id === company.id).length || 0
  })) || []

  return companiesWithCounts
}

export default async function CompaniesPage() {
  const companies = await getCompanies()

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/80 to-pink-900/70" />
      <div className="absolute inset-0 bg-gradient-to-tl from-cyan-800/60 via-blue-800/50 to-indigo-800/60" />
      
      {/* Animated Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/40 to-purple-500/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-32 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-500/35 to-blue-500/35 rounded-full blur-3xl animate-pulse delay-2000" />
      <div className="absolute bottom-40 right-20 w-64 h-64 bg-gradient-to-r from-pink-500/40 to-purple-500/40 rounded-full blur-3xl animate-pulse delay-500" />
      
      {/* Content Wrapper */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-4 sm:py-8">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <div className="mb-4 sm:mb-6">
              <Button 
                asChild 
                variant="ghost" 
                className="text-slate-300 hover:text-white hover:bg-slate-800/50 p-2 sm:p-3"
              >
                <Link href="/admin" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Admin Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-white">Company Management</h1>
                <p className="text-slate-300 text-sm sm:text-base">
                  Manage companies and their information across the platform
                </p>
              </div>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto">
                <Link href="/admin/companies/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-bold text-white">{companies.length}</p>
                      <p className="text-xs sm:text-sm text-slate-300 truncate">Total Companies</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-bold text-white">{companies.filter(c => c.is_active).length}</p>
                      <p className="text-xs sm:text-sm text-slate-300 truncate">Active Companies</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xl sm:text-2xl font-bold text-white">{companies.reduce((sum, c) => sum + c.jobCount, 0)}</p>
                      <p className="text-xs sm:text-sm text-slate-300 truncate">Total Jobs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Companies List */}
            <CompaniesListClient companies={companies} />
          </div>
        </div>
      </div>
    </div>
  )
}
