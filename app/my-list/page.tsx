import type { Metadata } from "next"
import MyListClient from "./my-list-client"

export const metadata: Metadata = {
  title: "My List - MovieMatch",
  description: "Your personal collection of favorite movies. Manage and organize your movie watchlist.",
  keywords: "movie watchlist, favorite movies, personal collection, movie list",
  openGraph: {
    title: "My List - MovieMatch",
    description: "Your personal collection of favorite movies.",
    url: "https://moviematch.com/my-list",
  },
}

export default function MyListPage() {
  return <MyListClient />
}
