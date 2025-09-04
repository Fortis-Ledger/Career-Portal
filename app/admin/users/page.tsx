import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Sparkles, Search, User, Calendar, MapPin, Mail, Phone } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getUsers() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("email").eq("id", user.id).single()

  const adminEmails = ["admin@fortisledger.io", "admin@fortisarena.io", "ahmedfaraz.sa.48@gmail.com"]

  if (!profile || !adminEmails.includes(profile.email)) {
    redirect("/unauthorized")
  }

  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  return { users: users || [] }
}

export default async function AdminUsersPage() {
  const { users } = await getUsers()

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
        {/* Header */}
        <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild className="text-slate-300 hover:text-white">
                <Link href="/admin" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">User Management</span>
              </div>
            </div>
          </div>
        </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">User Management</h1>
              <p className="text-slate-300">View and manage registered users</p>
            </div>
            <Badge variant="outline" className="border-slate-600 text-slate-300">{users.length} registered users</Badge>
          </div>

          {/* Search */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input placeholder="Search users by name, email, or location..." className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400" />
              </div>
            </CardContent>
          </Card>

          {/* Users List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user: any) => (
              <Card key={user.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-medium">
                      {user.full_name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1 text-white">{user.full_name || "Unknown User"}</h3>
                      <div className="space-y-2 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {user.phone}
                          </div>
                        )}
                        {user.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {user.location}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {user.current_role && (
                        <Badge variant="outline" className="mt-2 border-slate-600 text-slate-300">
                          {user.current_role}
                        </Badge>
                      )}
                      {user.years_experience > 0 && (
                        <Badge variant="outline" className="mt-2 ml-2 border-slate-600 text-slate-300">
                          {user.years_experience} years exp
                        </Badge>
                      )}
                    </div>
                  </div>

                  {user.bio && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <p className="text-sm text-slate-300 line-clamp-3">{user.bio}</p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2 flex-wrap">
                    {user.resume_url && (
                      <Button variant="outline" size="sm" asChild className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50">
                        <a href={user.resume_url} target="_blank" rel="noopener noreferrer">
                          Resume
                        </a>
                      </Button>
                    )}
                    {user.linkedin_url && (
                      <Button variant="outline" size="sm" asChild className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50">
                        <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      </Button>
                    )}
                    {user.github_url && (
                      <Button variant="outline" size="sm" asChild className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50">
                        <a href={user.github_url} target="_blank" rel="noopener noreferrer">
                          GitHub
                        </a>
                      </Button>
                    )}
                    {user.portfolio_url && (
                      <Button variant="outline" size="sm" asChild className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600/50">
                        <a href={user.portfolio_url} target="_blank" rel="noopener noreferrer">
                          Portfolio
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {users.length === 0 && (
            <Card className="bg-slate-800/50 border-slate-700 text-center backdrop-blur-sm">
              <CardContent className="p-12">
                <User className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">No Users Registered Yet</h3>
                <p className="text-slate-400">Users will appear here once they sign up for the portal.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
