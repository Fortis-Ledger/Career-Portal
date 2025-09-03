import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/auth/callback',
        '/_next/',
        '/private/',
      ],
    },
    sitemap: 'https://career.fortisledger.io/sitemap.xml',
  }
}
