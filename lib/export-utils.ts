export interface ExportData {
  applications?: any[]
  users?: any[]
  jobs?: any[]
}

export function exportToCSV(data: any[], filename: string) {
  if (!data.length) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Handle values that might contain commas or quotes
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value || ""
        })
        .join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function exportToJSON(data: any[], filename: string) {
  const jsonContent = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.json`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function formatDataForExport(data: any[], type: "applications" | "users" | "jobs") {
  switch (type) {
    case "applications":
      return data.map((app) => ({
        id: app.id,
        job_title: app.jobs?.title || 'N/A',
        company_name: app.jobs?.companies?.name || 'N/A',
        applicant_name: app.profiles?.full_name || 'N/A',
        applicant_email: app.profiles?.email || 'N/A',
        applicant_phone: app.profiles?.phone || 'N/A',
        applicant_location: app.profiles?.location || 'N/A',
        status: app.status,
        applied_date: new Date(app.applied_at).toLocaleDateString(),
        cover_letter_length: app.cover_letter?.length || 0,
        has_resume: !!app.resume_url,
        has_portfolio: !!app.portfolio_url,
        resume_url: app.resume_url || '',
        portfolio_url: app.portfolio_url || '',
        additional_info: app.additional_info || '',
        notes: app.notes || ''
      }))

    case "users":
      return data.map((user) => ({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        location: user.location,
        experience_level: user.experience_level,
        joined_date: new Date(user.created_at).toLocaleDateString(),
        applications_count: user.applications?.length || 0,
      }))

    case "jobs":
      return data.map((job) => ({
        id: job.id,
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        experience_level: job.experience_level,
        salary_range: job.salary_range,
        applications_count: job.application_count || 0,
        posted_date: new Date(job.created_at).toLocaleDateString(),
        status: job.is_active ? "Active" : "Inactive",
      }))

    default:
      return data
  }
}
