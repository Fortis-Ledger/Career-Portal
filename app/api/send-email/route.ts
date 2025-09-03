import { NextRequest, NextResponse } from "next/server"
import { sendEmail, emailTemplates } from "@/lib/email"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, data } = await request.json()

    let emailData
    switch (type) {
      case 'application_received':
        emailData = {
          to: data.applicantEmail,
          ...emailTemplates.applicationReceived(data.applicantName, data.jobTitle, data.companyName)
        }
        break

      case 'application_status_update':
        emailData = {
          to: data.applicantEmail,
          ...emailTemplates.applicationStatusUpdate(data.applicantName, data.jobTitle, data.status, data.companyName)
        }
        break

      case 'new_application_notification':
        // Get notification email from settings
        const { data: settings } = await supabase
          .from("portal_settings")
          .select("notification_email")
          .single()
        
        emailData = {
          to: settings?.notification_email || 'admin@fortisledger.io',
          ...emailTemplates.newApplicationNotification(data.applicantName, data.jobTitle, data.companyName)
        }
        break

      case 'custom':
        emailData = {
          to: data.to || data.applicantEmail,
          subject: data.subject,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0;">
              <div style="background: white; margin: 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">FortisLedger</h1>
                  <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 16px;">Career Portal</p>
                </div>
                <div style="padding: 40px 30px;">
                  <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px;">Hello ${data.applicantName},</h2>
                  <div style="background: #f8fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
                    <div style="color: #334155; font-size: 16px; line-height: 1.6;">
                      ${data.message.replace(/\n/g, '<br>')}
                    </div>
                  </div>
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <p style="color: #64748b; margin: 0; font-size: 14px;">
                      Best regards,<br>
                      <strong style="color: #1e293b;">The FortisLedger Team</strong><br>
                      <span style="color: #94a3b8;">Building the future of financial technology</span>
                    </p>
                  </div>
                </div>
                <div style="background: #f1f5f9; padding: 20px 30px; text-align: center;">
                  <p style="color: #64748b; margin: 0; font-size: 12px;">
                    © 2025 FortisLedger. All rights reserved.<br>
                    <a href="https://career.fortisledger.io" style="color: #0ea5e9; text-decoration: none;">career.fortisledger.io</a>
                  </p>
                </div>
              </div>
            </div>
          `,
          text: `Dear ${data.applicantName},\n\n${data.message}\n\nBest regards,\nThe FortisLedger Team\nBuilding the future of financial technology\n\n© 2025 FortisLedger. All rights reserved.\ncareer.fortisledger.io`
        }
        break

      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
    }

    const success = await sendEmail(emailData)
    
    if (success) {
      return NextResponse.json({ success: true, message: "Email sent successfully" })
    } else {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

  } catch (error) {
    console.error("Email API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ 
      error: "Internal server error", 
      details: errorMessage,
      debug: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }, { status: 500 })
  }
}
