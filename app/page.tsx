import React from "react"
import { createClient } from "@/lib/supabase/server"
import { JobSearch, type SearchFilters } from "@/components/job-search"
import { JobSearchWrapper } from "@/components/job-search-wrapper"
import { JobCard } from "@/components/job-card"
import { AuthButton } from "@/components/auth-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Briefcase, Users, TrendingUp, Sparkles, Zap, Globe, Brain, Cpu, Award, Building2 } from "lucide-react"
import Link from "next/link"

async function getJobs(searchParams?: SearchFilters) {
  const supabase = await createClient()

  const query = supabase
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
    .limit(12)

  return query
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

async function getStats() {
  const supabase = await createClient()

  const [jobsResult, companiesResult] = await Promise.all([
    supabase.from("jobs").select("id", { count: "exact" }).eq("is_active", true),
    supabase.from("companies").select("id", { count: "exact" }).eq("is_active", true),
  ])

  return {
    totalJobs: jobsResult.count || 0,
    totalCompanies: companiesResult.count || 0,
  }
}

export default async function HomePage() {
  const [jobsResult, skills, stats] = await Promise.all([getJobs(), getSkills(), getStats()])

  const jobs = jobsResult.data || []
  
  // Get current user for auth button
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const techCategories = [
    {
      icon: Cpu,
      name: "Quantum Computing",
      description: "Shape the future of computation",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Globe,
      name: "Web3 & Blockchain",
      description: "Build decentralized solutions",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Brain,
      name: "Artificial Intelligence",
      description: "Create intelligent systems",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Zap,
      name: "IoT & Engineering",
      description: "Connect the physical world",
      gradient: "from-orange-500 to-red-500",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
                  FortisLedger
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Careers Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <AuthButton user={user} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-2 text-sm font-medium">
                <Sparkles className="w-3 h-3 mr-1" />
                Shape the Future of Technology
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-balance">
                Join the{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Innovation
                </span>{" "}
                Revolution
              </h1>
              <p className="text-xl text-gray-600 text-balance max-w-2xl mx-auto">
                Discover cutting-edge opportunities in Quantum Computing, Web3, AI, IoT, and Engineering. Build
                tomorrow's technology today with FortisLedger.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="#jobs">
                  Explore Opportunities
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.totalJobs}+</div>
                <div className="text-sm text-gray-600">Open Positions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{stats.totalCompanies}+</div>
                <div className="text-sm text-gray-600">Partner Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">50+</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Explore Technology Domains</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover opportunities across our core technology areas and join teams building the future
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techCategories.map((category, index) => {
              const Icon = category.icon
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 border-gray-200 bg-white shadow-sm"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2 text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Job Search & Listings */}
      <section id="jobs" className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Find Your Next Opportunity</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Search through our latest job openings and find the perfect role for your skills and ambitions
            </p>
          </div>

          {/* Job Search Component */}
          <div className="mb-8">
            <JobSearchWrapper skills={skills} />
          </div>

          {/* Featured Jobs */}
          {jobs.length > 0 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Featured Opportunities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs
                    .filter((job) => job.is_featured)
                    .slice(0, 6)
                    .map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-900">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  Latest Opportunities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs
                    .filter((job) => !job.is_featured)
                    .slice(0, 6)
                    .map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                </div>
              </div>

              <div className="text-center">
                <Button size="lg" variant="outline" asChild>
                  <Link href="/jobs">
                    View All Jobs
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <p className="text-sm text-gray-500 mt-2">Or stay here and use the search above to find jobs</p>
              </div>
            </div>
          )}

          {jobs.length === 0 && (
            <Card className="p-12 text-center border-gray-200 bg-white shadow-sm">
              <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No Jobs Available Yet</h3>
              <p className="text-gray-600 mb-6">
                We're preparing exciting opportunities for you. Check back soon!
              </p>
              <Button asChild>
                <Link href="/auth/sign-up">Join Our Talent Pool</Link>
              </Button>
            </Card>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">FortisLedger</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Pioneering the future of technology through innovation and talent.
              </p>
            </div>

            {/* Company Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Company</h4>
              <nav className="flex flex-col space-y-3">
                <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  About Us
                </Link>
                <Link href="/careers" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Careers
                </Link>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </nav>
            </div>

            {/* Candidate Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">For Candidates</h4>
              <nav className="flex flex-col space-y-3">
                <Link href="/jobs" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Browse Jobs
                </Link>
                <Link href="/profile" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Create Profile
                </Link>
                <Link href="/applications" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  My Applications
                </Link>
              </nav>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Resources</h4>
              <nav className="flex flex-col space-y-3">
                <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Blog
                </Link>
                <Link href="/help" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Help Center
                </Link>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </nav>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">&copy; 2024 FortisLedger. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
