import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MovieMatch - Discover Your Next Favorite Movie",
  description:
    "Find and discover amazing movies with our curated collection. Browse trending, popular, action, sci-fi, and drama films with personalized recommendations.",
  keywords:
    "movies, film recommendations, movie discovery, trending movies, popular films, action movies, sci-fi, drama",
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "MovieMatch",
  robots: "index, follow",
  openGraph: {
    title: "MovieMatch - Discover Your Next Favorite Movie",
    description: "Find and discover amazing movies with our curated collection.",
    url: "https://moviematch.com",
    siteName: "MovieMatch",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MovieMatch - Movie Discovery Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieMatch - Discover Your Next Favorite Movie",
    description: "Find and discover amazing movies with our curated collection.",
    images: ["/og-image.jpg"],
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://moviematch.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "MovieMatch",
              description:
                "Discover your next favorite movie with curated collections and personalized recommendations.",
              url: "https://moviematch.com",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://moviematch.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
