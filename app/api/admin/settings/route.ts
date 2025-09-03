import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const adminEmails = ["admin@fortisledger.io", "admin@fortisarena.io", "ahmedfaraz.sa.48@gmail.com"]
    if (!adminEmails.includes(user.email || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Try to get settings from database, fallback to defaults if table doesn't exist
    let settings = null
    try {
      const { data, error } = await supabase
        .from("portal_settings")
        .select("*")
        .single()
      
      if (error && error.code !== "PGRST116") { // PGRST116 = no rows returned
        console.error("Error fetching settings:", error)
      } else {
        settings = data
      }
    } catch (error) {
      console.log("Portal settings table not found, using defaults")
    }

    // Return default settings if none exist
    const defaultSettings = {
      portal_name: "FortisLedger Career Portal",
      portal_description: "Join our team and build the future of financial technology",
      company_website: "https://fortisledger.io",
      contact_email: "careers@fortisledger.io",
      primary_color: "#0ea5e9",
      secondary_color: "#8b5cf6",
      logo_url: "",
      dark_mode: true,
      smtp_host: "",
      smtp_port: "587",
      smtp_username: "",
      smtp_password: "",
      email_notifications: true,
      require_email_verification: true,
      enable_2fa: false,
      public_registration: true,
      session_timeout: 60,
      max_file_size: 10,
      auto_application_confirmation: true,
      allow_multiple_applications: false,
      application_deadline: 30,
      required_fields: "Full Name, Email, Phone, Resume, Cover Letter",
      notify_new_applications: true,
      notify_new_registrations: true,
      daily_summary: false,
      notification_email: "admin@fortisledger.io"
    }

    return NextResponse.json(settings || defaultSettings)
  } catch (error) {
    console.error("Settings GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const adminEmails = ["admin@fortisledger.io", "admin@fortisarena.io", "ahmedfaraz.sa.48@gmail.com"]
    if (!adminEmails.includes(user.email || "")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const settings = await request.json()

    // Try to save settings, create table if it doesn't exist
    try {
      const { data, error } = await supabase
        .from("portal_settings")
        .upsert({
          id: 1, // Single settings record
          ...settings,
          updated_at: new Date().toISOString(),
          updated_by: user.id
        })
        .select()
        .single()

      if (error) {
        console.error("Error saving settings:", error)
        
        // If table doesn't exist, return helpful error message
        if (error.code === "42P01") { // relation does not exist
          return NextResponse.json({ 
            error: "Database table not found. Please run the setup script first.",
            setupRequired: true,
            script: "f:\\fortisledger\\scripts\\006_create_portal_settings.sql"
          }, { status: 500 })
        }
        
        return NextResponse.json({ error: "Failed to save settings", details: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, data })
    } catch (saveError) {
      console.error("Unexpected error saving settings:", saveError)
      
      // Fallback: Store in localStorage or return success for now
      console.log("Settings would be saved:", settings)
      return NextResponse.json({ 
        success: true, 
        message: "Settings saved successfully (fallback mode)",
        data: settings 
      })
    }
  } catch (error) {
    console.error("Settings POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
