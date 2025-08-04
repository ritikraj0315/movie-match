import type { Metadata } from "next"
import DiscoverClient from "./discover-client"

export const metadata: Metadata = {
  title: "Discover Movies - MovieMatch",
  description:
    "Explore and discover new movies with advanced filtering options. Find movies by genre, year, rating, and more.",
  keywords: "movie discovery, film exploration, movie filters, genre search, movie recommendations",
  openGraph: {
    title: "Discover Movies - MovieMatch",
    description: "Explore and discover new movies with advanced filtering options.",
    url: "https://moviematch.com/discover",
  },
}

export default function DiscoverPage() {
  return <DiscoverClient />
}
