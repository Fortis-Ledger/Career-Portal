import { createServerClient } from "@/lib/supabase/server"
import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const adminEmails = ["admin@fortisledger.io", "admin@fortisarena.io", "ahmedfaraz.sa.48@gmail.com"]
    if (!adminEmails.includes(user.email || "")) {
      console.error("User not admin:", user.email)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get request body
    const body = await request.json()
    console.log("Received job data:", body)
    
    const {
      title,
      company_id,
      description,
      requirements,
      responsibilities,
      benefits,
      salary_min,
      salary_max,
      currency,
      employment_type,
      experience_level,
      location,
      is_remote,
      is_hybrid,
      department,
      application_deadline,
      is_featured
    } = body

    // Validate required fields
    if (!title || !company_id || !description || !employment_type || !experience_level) {
      console.error("Missing required fields:", { title, company_id, description, employment_type, experience_level })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use service role client to bypass RLS for admin operations
    const serviceClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Create job using service role client
    const { data: job, error: jobError } = await serviceClient
      .from("jobs")
      .insert({
        title,
        company_id,
        description,
        requirements,
        responsibilities,
        benefits,
        salary_min: salary_min ? parseInt(salary_min) : null,
        salary_max: salary_max ? parseInt(salary_max) : null,
        currency: currency || "USD",
        employment_type,
        experience_level,
        location,
        is_remote: is_remote || false,
        is_hybrid: is_hybrid || false,
        department,
        application_deadline: application_deadline || null,
        is_featured: is_featured || false,
        is_active: true
      })
      .select()
      .single()

    if (jobError) {
      console.error("Error creating job:", jobError)
      return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
    }

    return NextResponse.json({ job }, { status: 201 })
  } catch (error) {
    console.error("Error in job creation API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
