"use client"

import { useState, useEffect } from "react"
import { Heart, Trash2, Sparkles, Star, Calendar, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { MovieCard } from "@/components/movie-card"
import { Footer } from "@/components/footer"
import { allMovies } from "@/lib/movies"

export default function MyListClient() {
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

  const removeFromList = (movieId: number) => {
    const newLikedMovies = likedMovies.filter((id) => id !== movieId)
    setLikedMovies(newLikedMovies)
    localStorage.setItem("likedMovies", JSON.stringify(newLikedMovies))
  }

  const clearAllMovies = () => {
    setLikedMovies([])
    localStorage.removeItem("likedMovies")
  }

  const likedMovieData = allMovies.filter((movie) => likedMovies.includes(movie.id))

  // Calculate stats
  const totalRating = likedMovieData.reduce((sum, movie) => sum + movie.rating, 0)
  const averageRating = likedMovieData.length > 0 ? (totalRating / likedMovieData.length).toFixed(1) : "0"
  const genres = [...new Set(likedMovieData.flatMap((movie) => movie.genre))]
  const years = likedMovieData.map((movie) => Number.parseInt(movie.year))
  const yearRange = years.length > 0 ? `${Math.min(...years)} - ${Math.max(...years)}` : "N/A"

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900" />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Sparkles className="w-8 h-8 text-gray-400" />
              <span className="text-lg font-medium text-gray-300 tracking-wider uppercase">
                Your Personal Collection
              </span>
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none">
              <span className="text-white flex items-center justify-center gap-6">
                <Heart className="w-16 h-16 md:w-20 md:h-20 text-red-500 fill-current" />
                My List
              </span>
            </h1>

            <p className="text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
              Your carefully curated collection of favorite movies.
              <br />
              {likedMovieData.length > 0
                ? `${likedMovieData.length} movies that captured your heart.`
                : "Start building your personal movie library."}
            </p>

            {/* Stats Cards */}
            {likedMovieData.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                <Card className="bg-gray-900 border border-gray-800 hover:bg-gray-800 transition-colors duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-700 p-3">
                      <Heart className="w-full h-full text-white fill-current" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{likedMovieData.length}</div>
                    <div className="text-gray-400 text-sm">Movies</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border border-gray-800 hover:bg-gray-800 transition-colors duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-700 p-3">
                      <Star className="w-full h-full text-white fill-current" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{averageRating}</div>
                    <div className="text-gray-400 text-sm">Avg Rating</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border border-gray-800 hover:bg-gray-800 transition-colors duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-700 p-3">
                      <Play className="w-full h-full text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{genres.length}</div>
                    <div className="text-gray-400 text-sm">Genres</div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border border-gray-800 hover:bg-gray-800 transition-colors duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-700 p-3">
                      <Calendar className="w-full h-full text-white" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{yearRange}</div>
                    <div className="text-gray-400 text-sm">Year Range</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Action Buttons */}
            {likedMovieData.length > 0 && (
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={clearAllMovies}
                  variant="outline"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent rounded-md px-6 py-3 text-base font-medium"
                >
                  <Trash2 className="w-5 h-5 mr-3" />
                  Clear All Movies
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 pb-24">
        {likedMovieData.length === 0 ? (
          <Card className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <CardContent className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-700 rounded-full flex items-center justify-center">
                <Heart className="w-16 h-16 text-gray-400" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">Your list is empty</h2>
              <p className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                Start building your personal movie collection by adding films that inspire, entertain, and move you.
                Click the heart icon on any movie to add it to your list.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  asChild
                  className="bg-white text-black hover:bg-gray-100 rounded-md px-6 py-3 text-base font-medium"
                >
                  <a href="/">Browse Movies</a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent rounded-md px-6 py-3 text-base font-medium"
                >
                  <a href="/discover">Discover New Movies</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Your Movie Collection</h2>
                  <p className="text-gray-400 text-lg">
                    {likedMovieData.length} movies • Average rating: {averageRating}/10
                  </p>
                </div>

                {/* Genre Tags */}
                <div className="flex flex-wrap gap-2 max-w-md">
                  {genres.slice(0, 4).map((genre) => (
                    <Badge key={genre} className="bg-gray-800 text-gray-300 border-gray-700 px-3 py-1">
                      {genre}
                    </Badge>
                  ))}
                  {genres.length > 4 && (
                    <Badge className="bg-gray-800 text-gray-300 border-gray-700 px-3 py-1">
                      +{genres.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                {likedMovieData.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onToggleLike={toggleLike}
                    isLiked={true}
                    showRemove={true}
                    onRemove={removeFromList}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      <Footer />
    </div>
  )
}
