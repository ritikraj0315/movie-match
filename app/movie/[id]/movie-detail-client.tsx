"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, Heart, Play, Share, Calendar, Clock, Users, Sparkles, Award, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { similarMovies } from "@/lib/movies"

interface Movie {
  id: number
  title: string
  year: string
  rating: number
  genre: string[]
  poster: string
  backdrop: string
  description: string
  director: string
  cast: string[]
  runtime: string
  releaseDate: string
  budget: string
  boxOffice: string
  plot: string
}

interface MovieDetailClientProps {
  movie: Movie
}

export default function MovieDetailClient({ movie }: MovieDetailClientProps) {
  const [likedMovies, setLikedMovies] = useState<number[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("likedMovies")
    if (saved) {
      setLikedMovies(JSON.parse(saved))
    }
  }, [])

  const toggleLike = (movieId: number) => {
    const newLikedMovies = likedMovies.includes(movieId)
      ? likedMovies.filter((id) => id !== movieId)
      : [...likedMovies, movieId]

    setLikedMovies(newLikedMovies)
    localStorage.setItem("likedMovies", JSON.stringify(newLikedMovies))
  }

  const isLiked = likedMovies.includes(movie.id)

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <Image
            src={movie.backdrop || "/placeholder.svg"}
            alt={`${movie.title} backdrop`}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center py-24">
          <div className="flex flex-col lg:flex-row gap-12 w-full max-w-7xl mx-auto">
            <div className="flex-shrink-0 lg:w-1/3">
              <Card className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <Image
                  src={movie.poster || "/placeholder.svg"}
                  alt={`${movie.title} poster`}
                  width={400}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
              </Card>
            </div>

            <div className="flex-1 lg:w-2/3">
              <Link
                href="/"
                className="inline-flex items-center text-gray-300 hover:text-white mb-8 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                <span className="text-lg">Back to Movies</span>
              </Link>

              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-gray-400" />
                <span className="text-lg font-medium text-gray-300 tracking-wider uppercase">Featured Movie</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight text-white">{movie.title}</h1>

              <p className="text-2xl text-gray-300 mb-8 font-light">{movie.year}</p>

              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center space-x-3 bg-gray-900 rounded-lg px-4 py-3 border border-gray-800">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <span className="text-2xl font-bold text-white">{movie.rating}</span>
                  <span className="text-gray-400">/10</span>
                </div>
                <div className="flex items-center space-x-3 bg-gray-900 rounded-lg px-4 py-3 border border-gray-800">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-white font-medium">{movie.runtime}</span>
                </div>
                <div className="flex items-center space-x-3 bg-gray-900 rounded-lg px-4 py-3 border border-gray-800">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-white font-medium">{movie.releaseDate}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mb-8">
                {movie.genre.map((g) => (
                  <Badge
                    key={g}
                    className="bg-gray-800 text-gray-300 border-gray-700 px-4 py-2 text-lg font-medium rounded-md"
                  >
                    {g}
                  </Badge>
                ))}
              </div>

              <p className="text-xl text-gray-200 mb-10 leading-relaxed max-w-4xl font-light">{movie.description}</p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 rounded-md px-8 py-4 text-lg font-semibold"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Watch Trailer
                </Button>
                <Button
                  size="lg"
                  onClick={() => toggleLike(movie.id)}
                  className={`rounded-md px-8 py-4 text-lg font-semibold transition-colors duration-300 ${
                    isLiked
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-900 border border-gray-800 text-white hover:bg-gray-800"
                  }`}
                >
                  <Heart className={`w-6 h-6 mr-3 ${isLiked ? "fill-current" : ""}`} />
                  {isLiked ? "Remove from List" : "Add to List"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent rounded-md px-8 py-4 text-lg font-semibold"
                >
                  <Share className="w-6 h-6 mr-3" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden mb-12">
              <CardContent className="p-8">
                <h2 className="text-4xl font-bold text-white mb-6 flex items-center gap-3">
                  <Award className="w-8 h-8 text-yellow-400" />
                  Plot Summary
                </h2>
                <p className="text-gray-300 text-xl leading-relaxed font-light">{movie.plot}</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                  <Users className="w-7 h-7 text-gray-400" />
                  Cast & Crew
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {movie.cast.map((actor, index) => (
                    <Card
                      key={index}
                      className="bg-gray-900 border border-gray-800 hover:bg-gray-800 transition-colors duration-300"
                    >
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-white font-semibold text-lg">{actor}</p>
                        <p className="text-gray-400 text-sm">Actor</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-gray-400" />
                  Movie Details
                </h3>
                <div className="space-y-6">
                  <div>
                    <span className="text-gray-400 text-sm uppercase tracking-wider">Director</span>
                    <p className="text-white font-semibold text-lg mt-1">{movie.director}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm uppercase tracking-wider">Runtime</span>
                    <p className="text-white font-semibold text-lg mt-1">{movie.runtime}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm uppercase tracking-wider">Release Date</span>
                    <p className="text-white font-semibold text-lg mt-1">{movie.releaseDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm uppercase tracking-wider">Budget</span>
                    <p className="text-white font-semibold text-lg mt-1">{movie.budget}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm uppercase tracking-wider">Box Office</span>
                    <p className="text-white font-semibold text-lg mt-1">{movie.boxOffice}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">You Might Also Like</h2>
            <p className="text-xl text-gray-400">More movies that match your taste</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {similarMovies.map((similarMovie) => (
              <Card
                key={similarMovie.id}
                className="group bg-gray-900 border border-gray-800 hover:bg-gray-800 transition-colors duration-300 cursor-pointer rounded-lg overflow-hidden"
              >
                <Link href={`/movie/${similarMovie.id}`}>
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <Image
                        src={similarMovie.poster || "/placeholder.svg"}
                        alt={`${similarMovie.title} poster`}
                        width={400}
                        height={600}
                        className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="sm"
                          className="w-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md rounded-md"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-white mb-2 text-xl line-clamp-1">{similarMovie.title}</h4>
                      <p className="text-gray-400 mb-3">{similarMovie.year}</p>
                      <div className="flex items-center space-x-2 mb-4">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-white font-semibold">{similarMovie.rating}</span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-2">{similarMovie.description}</p>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
