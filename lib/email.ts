import { createClient } from "@/lib/supabase/server"

interface EmailConfig {
  smtp_host: string
  smtp_port: string
  smtp_username: string
  smtp_password: string
  email_notifications: boolean
}

interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
}

export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    // Get email configuration from settings
    const supabase = await createClient()
    const { data: settings, error: dbError } = await supabase
      .from("portal_settings")
      .select("smtp_host, smtp_port, smtp_username, smtp_password, email_notifications, contact_email")
      .single()

    if (dbError) {
      console.error("Database error fetching settings:", dbError)
      throw new Error(`Database error: ${dbError.message}`)
    }

    if (!settings) {
      throw new Error("Portal settings not found. Please run the setup SQL script.")
    }

    if (!settings?.email_notifications) {
      console.log("Email notifications are disabled")
      return false
    }

    // Try Resend API first if available
    if (process.env.RESEND_API_KEY) {
      console.log("Attempting to send via Resend API...")
      const success = await sendViaResend(emailData)
      if (success) return true
    }

    // Fallback to SMTP if Resend fails or is not configured
    if (settings?.smtp_host && settings?.smtp_username && settings?.smtp_password) {
      console.log("Attempting to send via SMTP...")
      return await sendViaSMTP(settings as EmailConfig, emailData)
    }

    throw new Error("No email configuration found. Please configure SMTP settings in admin portal.")

  } catch (error) {
    console.error("Email send error:", error)
    throw error // Re-throw to provide better error details to API
  }
}

async function sendViaResend(emailData: EmailData): Promise<boolean> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailData.from || 'FortisLedger Career <noreply@career.fortisledger.io>',
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
      }),
    })

    if (!response.ok) {
      console.error("Resend API failed:", await response.text())
      return false
    }

    return true
  } catch (error) {
    console.error("Email send error:", error)
    return false
  }
}

async function sendViaSMTP(config: EmailConfig, emailData: EmailData): Promise<boolean> {
  try {
    // Use nodemailer for SMTP
    const nodemailer = await import('nodemailer')
    
    const transporter = nodemailer.createTransport({
      host: config.smtp_host,
      port: parseInt(config.smtp_port),
      secure: parseInt(config.smtp_port) === 465,
      auth: {
        user: config.smtp_username,
        pass: config.smtp_password,
      },
    })

    await transporter.sendMail({
      from: emailData.from || `FortisLedger Career <${config.smtp_username}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    })

    return true
  } catch (error) {
    console.error("SMTP send error:", error)
    return false
  }
}

// Email templates
export const emailTemplates = {
  applicationReceived: (applicantName: string, jobTitle: string, companyName: string) => ({
    subject: `Application Received - ${jobTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0;">
        <div style="background: white; margin: 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">FortisLedger</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 16px;">Career Portal</p>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px;">Application Received</h2>
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">Dear ${applicantName},</p>
            <div style="background: #f8fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #10b981; margin: 20px 0;">
              <p style="color: #334155; margin: 0; font-size: 16px; line-height: 1.6;">
                Thank you for your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.
              </p>
              <p style="color: #334155; margin: 15px 0 0 0; font-size: 16px; line-height: 1.6;">
                We have received your application and our team will review it shortly. You will hear from us within the next few days.
              </p>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; margin: 0; font-size: 14px;">
                Best regards,<br>
                <strong style="color: #1e293b;">The ${companyName} Team</strong>
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
    `
  }),

  applicationStatusUpdate: (applicantName: string, jobTitle: string, status: string, companyName: string) => ({
    subject: `Application Update - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">Application Status Update</h2>
        <p>Dear ${applicantName},</p>
        <p>Your application for the <strong>${jobTitle}</strong> position has been updated.</p>
        <p><strong>New Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
        ${status === 'interview' ? '<p>We will contact you soon with interview details.</p>' : ''}
        ${status === 'offer' ? '<p>Congratulations! We will be in touch with offer details.</p>' : ''}
        <p>Best regards,<br>The ${companyName} Team</p>
      </div>
    `
  }),

  newApplicationNotification: (applicantName: string, jobTitle: string, companyName: string) => ({
    subject: `New Application - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0ea5e9;">New Application Received</h2>
        <p>A new application has been submitted:</p>
        <ul>
          <li><strong>Applicant:</strong> ${applicantName}</li>
          <li><strong>Position:</strong> ${jobTitle}</li>
          <li><strong>Company:</strong> ${companyName}</li>
        </ul>
        <p>Please review the application in the admin dashboard.</p>
      </div>
    `
  })
}
