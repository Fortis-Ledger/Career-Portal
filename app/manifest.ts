import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FortisLedger Career Portal',
    short_name: 'FortisLedger Careers',
    description: 'Discover exciting career opportunities in technology. Connect with top companies and advance your tech career journey.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0ea5e9',
    icons: [
      {
        src: '/image/favicon192.ico',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/image/favicon512.ico',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['business', 'productivity', 'lifestyle'],
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
  }
}
