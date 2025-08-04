"use client"

import { useState, useEffect } from "react"
import { Footer } from "@/components/footer"
import { Search, TrendingUp, Star, Play, ChevronRight, Sparkles, Users, Calendar, Clock } from "lucide-react"

// Types
interface Movie {
  id: number
  title: string
  year: string
  genre: number[]
  rating: number
  poster: string
  backdrop: string
  description: string
  director: string
  runtime: number
}

interface TmdbMovie {
  id: number
  title: string
  release_date: string
  genre_ids: number[]
  vote_average: number
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  runtime?: number
}

interface TmdbResponse {
  results: TmdbMovie[]
  total_results: number
  total_pages: number
}

interface FilterOptions {
  genres: string[]
  yearRange: [number, number]
  ratingRange: [number, number]
  sortBy: string
}

// TMDb API configuration
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || ''
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

// TMDb API functions
const tmdbApi = {
  search: (query: string): Promise<Response> => 
    fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`),
  
  trending: (timeWindow: 'day' | 'week' = 'week'): Promise<Response> => 
    fetch(`${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}&language=en-US`),
  
  popular: (): Promise<Response> => 
    fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`),
  
  topRated: (): Promise<Response> => 
    fetch(`${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`),
  
  discover: (params: Record<string, string> = {}): Promise<Response> => {
    const searchParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'en-US',
      page: '1',
      sort_by: 'popularity.desc',
      ...params
    })
    return fetch(`${TMDB_BASE_URL}/discover/movie?${searchParams}`)
  },
  
  genres: (): Promise<Response> => 
    fetch(`${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`),
  
  movieDetails: (movieId: number): Promise<Response> => 
    fetch(`${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=videos,credits`)
}

// Helper function to get image URL
const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-movie.jpg'
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

// Convert TMDb movie to our format
const convertTmdbMovie = (tmdbMovie: TmdbMovie): Movie => ({
  id: tmdbMovie.id,
  title: tmdbMovie.title,
  year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear().toString() : 'N/A',
  genre: tmdbMovie.genre_ids || [],
  rating: Math.round(tmdbMovie.vote_average * 10) / 10,
  poster: getImageUrl(tmdbMovie.poster_path),
  backdrop: getImageUrl(tmdbMovie.backdrop_path, 'w1280'),
  description: tmdbMovie.overview || 'No description available.',
  director: '',
  runtime: tmdbMovie.runtime || 0
})

// Genre mapping
const genreMap: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
}

interface MovieCardProps {
  movie: Movie
  onToggleLike: (movieId: number) => void
  isLiked: boolean
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [popularMovies, setPopularMovies] = useState<Movie[]>([])
  const [actionMovies, setActionMovies] = useState<Movie[]>([])
  const [scifiMovies, setScifiMovies] = useState<Movie[]>([])
  const [dramaMovies, setDramaMovies] = useState<Movie[]>([])
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)
  const [likedMovies, setLikedMovies] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("trending")

  // Check if API key is provided
  useEffect(() => {
    if (!TMDB_API_KEY) {
      setApiKeyMissing(true)
    } else {
      loadInitialData()
    }
  }, [])

  // Load initial data
  const loadInitialData = async (): Promise<void> => {
    setLoading(true)
    try {
      // Load trending movies
      const trendingResponse = await tmdbApi.trending()
      const trendingData: TmdbResponse = await trendingResponse.json()
      const trending = trendingData.results.slice(0, 12).map(convertTmdbMovie)
      setTrendingMovies(trending)
      
      // Set featured movie as first trending movie
      if (trending.length > 0) {
        setFeaturedMovie(trending[0])
      }

      // Load popular movies
      const popularResponse = await tmdbApi.popular()
      const popularData: TmdbResponse = await popularResponse.json()
      setPopularMovies(popularData.results.slice(0, 12).map(convertTmdbMovie))

      // Load genre-specific movies
      const actionResponse = await tmdbApi.discover({ with_genres: '28' })
      const actionData: TmdbResponse = await actionResponse.json()
      setActionMovies(actionData.results.slice(0, 12).map(convertTmdbMovie))

      const scifiResponse = await tmdbApi.discover({ with_genres: '878' })
      const scifiData: TmdbResponse = await scifiResponse.json()
      setScifiMovies(scifiData.results.slice(0, 12).map(convertTmdbMovie))

      const dramaResponse = await tmdbApi.discover({ with_genres: '18' })
      const dramaData: TmdbResponse = await dramaResponse.json()
      setDramaMovies(dramaData.results.slice(0, 12).map(convertTmdbMovie))

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle search
  const handleSearch = async (): Promise<void> => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    try {
      const response = await tmdbApi.search(searchQuery)
      const data: TmdbResponse = await response.json()
      setSearchResults(data.results.map(convertTmdbMovie))
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle search input change
  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(handleSearch, 500)
      return () => clearTimeout(timeoutId)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  // Load liked movies from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("likedMovies")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setLikedMovies(parsed)
        }
      } catch (error) {
        console.error('Error parsing liked movies:', error)
      }
    }
  }, [])

  const toggleLike = (movieId: number): void => {
    const newLikedMovies = likedMovies.includes(movieId)
      ? likedMovies.filter((id) => id !== movieId)
      : [...likedMovies, movieId]

    setLikedMovies(newLikedMovies)
    localStorage.setItem("likedMovies", JSON.stringify(newLikedMovies))
  }

  // Movie card component
  const MovieCard: React.FC<MovieCardProps> = ({ movie, onToggleLike, isLiked }) => (
    <div className="group relative bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105">
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
            const target = e.target as HTMLImageElement
            target.src = '/placeholder-movie.jpg'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Like button */}
        <button
          onClick={() => onToggleLike(movie.id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-200"
          type="button"
        >
          <Star className={`w-5 h-5 ${isLiked ? 'text-yellow-400 fill-current' : 'text-white'}`} />
        </button>

        {/* Movie info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{movie.title}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-300 mb-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{movie.year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{movie.rating}</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm line-clamp-3">{movie.description}</p>
        </div>
      </div>
    </div>
  )

  // API Key missing component
  if (apiKeyMissing) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="w-24 h-24 mx-auto mb-8 bg-red-900/20 rounded-full flex items-center justify-center">
            <Search className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="text-4xl font-bold mb-6">TMDb API Key Required</h1>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            To use this movie application, you need to set up your TMDb API key in your environment variables.
          </p>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-left">
            <h3 className="text-lg font-semibold text-white mb-4">Setup Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Get a free API key from <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">themoviedb.org</a></li>
              <li>Create an account and go to Settings → API</li>
              <li>Request an API key (it&apos;s free!)</li>
              <li>Add to your <code className="bg-gray-800 px-2 py-1 rounded text-sm">.env.local</code> file:</li>
              <li className="ml-4">
                <code className="bg-gray-800 px-2 py-1 rounded text-sm block mt-2">
                  NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here
                </code>
              </li>
              <li>Restart your development server</li>
            </ol>
          </div>
        </div>
      </div>
    )
  }

  const currentMovies: Record<string, Movie[]> = {
    trending: trendingMovies,
    popular: popularMovies,
    action: actionMovies,
    scifi: scifiMovies,
    drama: dramaMovies
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Simple Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="text-2xl font-bold">MovieMatch</div>
          <div className="text-sm text-gray-400">Powered by TMDb</div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 bg-black">
          {featuredMovie && (
            <>
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat opacity-30"
                style={{
                  backgroundImage: `url('${featuredMovie.backdrop}')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </>
          )}
        </div>

        {/* Content */}
        <div className="relative z-20 container mx-auto px-4 py-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Main Title */}
            <div className="mb-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 text-gray-400" />
                <span className="text-lg font-medium text-gray-400 tracking-wider uppercase">
                  Discover Movies with TMDb
                </span>
                <Sparkles className="w-8 h-8 text-gray-400" />
              </div>
              <h1 className="text-7xl md:text-9xl font-black mb-8 leading-none">
                <span className="text-white">Movie</span>
                <br />
                <span className="text-gray-200">Match</span>
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
                Explore millions of movies from The Movie Database. Search, discover, and find your next cinematic adventure.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-3xl mx-auto mb-16">
              <div className="relative bg-gray-900 border border-gray-800 rounded-lg p-2">
                <div className="flex items-center">
                  <Search className="ml-6 w-6 h-6 text-gray-400" />
                  <input
                    placeholder="Search movies from TMDb database..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-6 py-6 text-lg bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none"
                    type="text"
                  />
                  {loading && (
                    <div className="mr-6">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

          
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-24">
        <div className="container mx-auto px-4">
          {searchQuery && searchResults.length > 0 ? (
            // Search Results
            <div>
              <div className="text-center mb-12">
                <h3 className="text-4xl font-bold text-white mb-4">Search Results</h3>
                <p className="text-xl text-gray-400">
                  {searchResults.length} movies found for &quot;{searchQuery}&quot;
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                {searchResults.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onToggleLike={toggleLike}
                    isLiked={likedMovies.includes(movie.id)}
                  />
                ))}
              </div>
            </div>
          ) : searchQuery && searchResults.length === 0 && !loading ? (
            // No search results
            <div className="bg-gray-900 border border-gray-800 rounded-lg">
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-700 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No movies found</h3>
                <p className="text-gray-400 text-lg">
                  Try searching for something else or browse our categories below.
                </p>
              </div>
            </div>
          ) : (
            // Categories
            <div>
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-white mb-6">Explore Collections</h2>
                <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
                  Browse through movies from The Movie Database, updated in real-time
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex justify-center mb-16">
                <div className="bg-gray-900 border border-gray-800 p-1 rounded-lg flex">
                  {[
                    { id: 'trending', label: 'Trending', icon: TrendingUp },
                    { id: 'popular', label: 'Popular', icon: Star },
                    { id: 'action', label: 'Action', icon: null },
                    { id: 'scifi', label: 'Sci-Fi', icon: null },
                    { id: 'drama', label: 'Drama', icon: null }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-4 py-2 font-medium transition-colors text-base rounded-md ${
                        activeTab === tab.id
                          ? 'bg-white text-black'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      type="button"
                    >
                      {tab.icon && <tab.icon className="w-5 h-5" />}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Movie Grid */}
              <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-3xl font-bold text-white capitalize mb-2">
                        {activeTab === "scifi" ? "Science Fiction" : activeTab} Collection
                      </h3>
                      <p className="text-gray-400 text-lg">
                        {currentMovies[activeTab]?.length || 0} movies from TMDb
                      </p>
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                      {currentMovies[activeTab]?.map((movie) => (
                        <MovieCard
                          key={movie.id}
                          movie={movie}
                          onToggleLike={toggleLike}
                          isLiked={likedMovies.includes(movie.id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}