import type { Metadata } from "next"
import { notFound } from "next/navigation"
import MovieDetailClient from "./movie-detail-client"
import { allMovies } from "@/lib/movies"

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const movie = allMovies.find((m) => m.id === Number.parseInt(params.id))

  if (!movie) {
    return {
      title: "Movie Not Found - MovieMatch",
    }
  }

  return {
    title: `${movie.title} (${movie.year}) - MovieMatch`,
    description: movie.description,
    keywords: `${movie.title}, ${movie.year}, ${movie.genre.join(", ")}, ${movie.director}`,
    openGraph: {
      title: `${movie.title} (${movie.year})`,
      description: movie.description,
      images: [movie.poster],
      type: "video.movie",
    },
  }
}

export default function MoviePage({ params }: Props) {
  const movie = allMovies.find((m) => m.id === Number.parseInt(params.id))

  if (!movie) {
    notFound()
  }

  return <MovieDetailClient movie={movie} />
}
