import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { StructuredData } from "@/components/structured-data"
import { seoConfig } from "@/lib/seo-config"
import "./globals.css"

export const metadata: Metadata = {
  ...seoConfig,
  authors: [{ name: "FortisLedger" }],
  creator: "FortisLedger",
  publisher: "FortisLedger",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(seoConfig.url),
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <StructuredData type="website" />
        <StructuredData type="organization" />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
