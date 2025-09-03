import { StructuredData } from './structured-data'

interface JobStructuredDataProps {
  job: {
    id: string
    title: string
    description: string
    created_at: string
    salary_min?: number
    salary_max?: number
    employment_type: string
    experience_level: string
    is_remote: boolean
    companies?: {
      name: string
      location?: string
    }
  }
}

export function JobStructuredData({ job }: JobStructuredDataProps) {
  const jobData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description,
    "identifier": {
      "@type": "PropertyValue",
      "name": "FortisLedger Job ID",
      "value": job.id
    },
    "datePosted": job.created_at,
    "validThrough": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    "employmentType": job.employment_type.toUpperCase(),
    "experienceRequirements": job.experience_level,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.companies?.name || "FortisLedger",
      "sameAs": "https://fortisledger.io",
      "logo": "https://career.fortisledger.io/image/favicon192.png"
    },
    "jobLocation": job.is_remote ? {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "Remote"
      }
    } : {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": job.companies?.location || "Global",
        "addressCountry": "Worldwide"
      }
    },
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": job.is_remote ? "Remote" : job.companies?.location || "Worldwide"
    },
    "workHours": job.employment_type === "FULL_TIME" ? "40 hours per week" : "Flexible",
    ...(job.salary_min && job.salary_max && {
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "USD",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": job.salary_min,
          "maxValue": job.salary_max,
          "unitText": "YEAR"
        }
      }
    })
  }

  return <StructuredData type="jobPosting" data={jobData} />
}
