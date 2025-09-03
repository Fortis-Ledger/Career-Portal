export const seoConfig = {
  title: {
    default: "FortisLedger Career Portal | Find Your Dream Tech Job",
    template: "%s | FortisLedger Careers"
  },
  description: "Discover exciting career opportunities in technology. Connect with top companies and advance your tech career journey in Quantum Computing, Web3, AI, IoT, and Engineering.",
  keywords: [
    "jobs", "careers", "technology", "blockchain", "software", "engineering", 
    "remote work", "FortisLedger", "quantum computing", "AI", "web3", "IoT",
    "full-time", "part-time", "contract", "startup jobs", "tech careers"
  ],
  url: "https://career.fortisledger.io",
  siteName: "FortisLedger Career Portal",
  locale: "en_US",
  type: "website",
  
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://career.fortisledger.io",
    siteName: "FortisLedger Career Portal",
    title: "FortisLedger Career Portal",
    description: "Discover exciting career opportunities in technology. Connect with top companies and advance your tech career journey.",
    images: [
      {
        url: "/image/og-image.png",
        width: 1200,
        height: 630,
        alt: "FortisLedger Career Portal",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "FortisLedger Career Portal",
    description: "Discover exciting career opportunities in technology. Connect with top companies and advance your tech career journey.",
    images: ["/image/twitter-image.png"],
    creator: "@fortisledger",
    site: "@fortisledger",
  },
  
  icons: {
    icon: [
      { url: "/image/favicon16.ico", sizes: "16x16", type: "image/x-icon" },
      { url: "/image/favicon32.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/image/favicon192.ico", sizes: "192x192", type: "image/png" },
      { url: "/image/favicon512.ico", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#0ea5e9",
      },
    ],
  },
  
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
    yandex: process.env.YANDEX_VERIFICATION_CODE,
    yahoo: process.env.YAHOO_VERIFICATION_CODE,
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
}

export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
  image?: string
) {
  return {
    title,
    description,
    openGraph: {
      ...seoConfig.openGraph,
      title: `${title} | FortisLedger Careers`,
      description,
      url: `${seoConfig.url}${path}`,
      ...(image && {
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
    },
    twitter: {
      ...seoConfig.twitter,
      title: `${title} | FortisLedger Careers`,
      description,
      ...(image && { images: [image] }),
    },
    alternates: {
      canonical: `${seoConfig.url}${path}`,
    },
  }
}
