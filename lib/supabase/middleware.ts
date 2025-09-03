import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // IMPORTANT: You *must* call getUser() to refresh the session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      url.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    try {
      // Check if user is admin
      const { data: profile } = await supabase.from("profiles").select("email").eq("id", user.id).single()

      const adminEmails = ["admin@fortisledger.io", "admin@fortisarena.io", "ahmedfaraz.sa.48@gmail.com"]

      if (!profile || !adminEmails.includes(profile.email)) {
        const url = request.nextUrl.clone()
        url.pathname = "/unauthorized"
        return NextResponse.redirect(url)
      }
    } catch (error) {
      // If database tables don't exist or there's a database error,
      // allow access for admin emails based on auth user email
      const adminEmails = ["admin@fortisledger.io", "admin@fortisarena.io", "ahmedfaraz.sa.48@gmail.com"]

      if (!user.email || !adminEmails.includes(user.email)) {
        const url = request.nextUrl.clone()
        url.pathname = "/unauthorized"
        return NextResponse.redirect(url)
      }
    }
  }

  // Protect user profile and application routes
  if (
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/applications") ||
    request.nextUrl.pathname.startsWith("/apply")
  ) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      url.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  // Redirect authenticated users away from auth pages (except callback)
  if (user && request.nextUrl.pathname.startsWith("/auth/") && !request.nextUrl.pathname.includes("/auth/callback")) {
    const url = request.nextUrl.clone()
    url.pathname = "/profile"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
