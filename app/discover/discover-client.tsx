"use client"

import { useState, useEffect } from "react"
import { Search, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { FilterDialog } from "@/components/filter-dialog"
import { MovieCard } from "@/components/movie-card"
import { Footer } from "@/components/footer"
import { discoverMovies, quickFilters } from "@/lib/movies"

interface FilterOptions {
  genres: string[]
  yearRange: [number, number]
  ratingRange: [number, number]
  sortBy: string
}

export default function DiscoverClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [likedMovies, setLikedMovies] = useState<number[]>([])
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    genres: [],
    yearRange: [1970, 2024],
    ratingRange: [0, 10],
    sortBy: "rating-desc",
  })

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

  const applyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters)
  }

  const applyQuickFilter = (quickFilter: any) => {
    setFilters((prev) => ({
      ...prev,
      ...quickFilter.filter,
      yearRange: quickFilter.filter.yearRange || prev.yearRange,
      ratingRange: quickFilter.filter.ratingRange || prev.ratingRange,
    }))
  }

  const filterMovies = () => {
    const filtered = discoverMovies.filter((movie) => {
      if (searchQuery) {
        const matchesSearch =
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
        if (!matchesSearch) return false
      }

      if (filters.genres.length > 0) {
        const hasMatchingGenre = movie.genre.some((g) => filters.genres.includes(g))
        if (!hasMatchingGenre) return false
      }

      const year = Number.parseInt(movie.year)
      if (year < filters.yearRange[0] || year > filters.yearRange[1]) return false

      if (movie.rating < filters.ratingRange[0] || movie.rating > filters.ratingRange[1]) return false

      return true
    })

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "rating-desc":
          return b.rating - a.rating
        case "rating-asc":
          return a.rating - b.rating
        case "year-desc":
          return Number.parseInt(b.year) - Number.parseInt(a.year)
        case "year-asc":
          return Number.parseInt(a.year) - Number.parseInt(b.year)
        case "title-asc":
          return a.title.localeCompare(b.title)
        case "title-desc":
          return b.title.localeCompare(a.title)
        default:
          return 0
      }
    })

    return filtered
  }

  const filteredMovies = filterMovies()

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation onFilterClick={() => setFilterOpen(true)} />

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900" />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Sparkles className="w-8 h-8 text-gray-400" />
              <span className="text-lg font-medium text-gray-300 tracking-wider uppercase">
                Advanced Movie Discovery
              </span>
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none">
              <span className="text-white">Discover</span>
              <br />
              <span className="text-gray-200">Movies</span>
            </h1>

            <p className="text-2xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
              Explore our extensive collection with powerful search and filtering capabilities.
              <br />
              Find your next cinematic adventure from thousands of carefully curated films.
            </p>

            <div className="relative max-w-4xl mx-auto mb-16">
              <Card className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <CardContent className="p-2">
                  <div className="flex items-center">
                    <div className="flex items-center flex-1">
                      <Search className="ml-6 w-7 h-7 text-gray-400" />
                      <Input
                        placeholder="Search by title, genre, director, cast, or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-6 py-6 text-lg bg-transparent border-none text-white placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                      />
                    </div>
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-gray-100 rounded-md px-6 py-3 text-base font-medium"
                    >
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
              {quickFilters.map((filter, index) => {
                const Icon = filter.icon
                return (
                  <Card
                    key={index}
                    className="bg-gray-900 border border-gray-800 hover:bg-gray-800 transition-colors duration-300"
                    onClick={() => applyQuickFilter(filter)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gray-700 p-3`}>
                        <Icon className="w-full h-full text-white" />
                      </div>
                      <h3 className="font-semibold text-white mb-1 text-sm">{filter.label}</h3>
                      <p className="text-xs text-gray-400">{filter.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>
      {(filters.genres.length > 0 ||
        filters.yearRange[0] > 1970 ||
        filters.yearRange[1] < 2024 ||
        filters.ratingRange[0] > 0 ||
        filters.ratingRange[1] < 10) && (
        <section className="container mx-auto px-4 pb-8">
          <Card className="bg-gray-900 border border-gray-800 rounded-lg">
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-gray-300 font-medium">Active filters:</span>
                {filters.genres.map((genre) => (
                  <Badge key={genre} className="bg-gray-800 text-gray-300 border-gray-700">
                    {genre}
                  </Badge>
                ))}
                {filters.yearRange[0] > 1970 || filters.yearRange[1] < 2024 ? (
                  <Badge className="bg-gray-800 text-gray-300 border-gray-700">
                    {filters.yearRange[0]} - {filters.yearRange[1]}
                  </Badge>
                ) : null}
                {filters.ratingRange[0] > 0 || filters.ratingRange[1] < 10 ? (
                  <Badge className="bg-gray-800 text-gray-300 border-gray-700">
                    Rating: {filters.ratingRange[0]} - {filters.ratingRange[1]}
                  </Badge>
                ) : null}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setFilters({ genres: [], yearRange: [1970, 2024], ratingRange: [0, 10], sortBy: "rating-desc" })
                  }
                  className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-md"
                >
                  Clear all
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="container mx-auto px-4 pb-24">
        <Card className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">
                  {searchQuery ? `Search Results` : `Movie Collection`}
                </h2>
                <p className="text-xl text-gray-400">
                  {filteredMovies.length} movies found
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
              <div className="text-gray-400">
                <span className="text-sm">Sorted by: </span>
                <span className="font-medium">
                  {filters.sortBy.replace("-", " ").replace("desc", "(high to low)").replace("asc", "(low to high)")}
                </span>
              </div>
            </div>

            {filteredMovies.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 mx-auto mb-8 bg-gray-700 rounded-full flex items-center justify-center">
                  <Search className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">No movies found</h3>
                <p className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto">
                  Try adjusting your search terms or filters to discover new movies that match your preferences.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setFilters({ genres: [], yearRange: [1970, 2024], ratingRange: [0, 10], sortBy: "rating-desc" })
                    }}
                    className="bg-white text-black hover:bg-gray-100 rounded-md px-8 py-4"
                  >
                    Clear Search & Filters
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent rounded-md px-8 py-4"
                  >
                    Browse All Movies
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                {filteredMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onToggleLike={toggleLike}
                    isLiked={likedMovies.includes(movie.id)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <Footer />

      <FilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        onApplyFilters={applyFilters}
        currentFilters={filters}
      />
    </div>
  )
}
