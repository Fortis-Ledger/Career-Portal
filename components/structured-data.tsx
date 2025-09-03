import Script from 'next/script'

interface StructuredDataProps {
  type?: 'website' | 'organization' | 'jobPosting'
  data?: any
}

export function StructuredData({ type = 'website', data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "url": "https://career.fortisledger.io",
          "name": "FortisLedger Career Portal",
          "description": "Discover exciting career opportunities in technology. Connect with top companies and advance your tech career journey.",
          "publisher": {
            "@type": "Organization",
            "name": "FortisLedger",
            "url": "https://fortisledger.io",
            "logo": {
              "@type": "ImageObject",
              "url": "https://career.fortisledger.io/image/favicon512.png"
            }
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://career.fortisledger.io/jobs?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }

      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "FortisLedger",
          "url": "https://fortisledger.io",
          "logo": "https://career.fortisledger.io/image/favicon512.png",
          "sameAs": [
            "https://twitter.com/fortisledger",
            "https://www.linkedin.com/company/fortisledger",
            "https://github.com/fortisledger"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-555-0123",
            "contactType": "customer service",
            "availableLanguage": ["English"]
          }
        }

      case 'jobPosting':
        return data || {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          "title": "Software Engineer",
          "description": "Join our team to build cutting-edge technology solutions.",
          "datePosted": new Date().toISOString().split('T')[0],
          "validThrough": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          "employmentType": "FULL_TIME",
          "hiringOrganization": {
            "@type": "Organization",
            "name": "FortisLedger",
            "sameAs": "https://fortisledger.io",
            "logo": "https://career.fortisledger.io/image/favicon192.png"
          },
          "jobLocation": {
            "@type": "Place",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "Remote"
            }
          },
          "applicantLocationRequirements": {
            "@type": "Country",
            "name": "Worldwide"
          }
        }

      default:
        return {}
    }
  }

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData())
      }}
    />
  )
}
