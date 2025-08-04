"use client"
import Image from "next/image"
import Link from "next/link"
import { Star, Play, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Movie {
  id: number
  title: string
  year: string
  rating: number
  genre: string[]
  poster: string
  description: string
}

interface MovieCardProps {
  movie: Movie
  onToggleLike?: (movieId: number) => void
  isLiked?: boolean
  showRemove?: boolean
  onRemove?: (movieId: number) => void
}

export function MovieCard({ movie, onToggleLike, isLiked = false, showRemove = false, onRemove }: MovieCardProps) {
  return (
    <Card className="group bg-gray-900 border-gray-800 hover:bg-gray-800 transition-all duration-300 hover:scale-105 cursor-pointer">
      <Link href={`/movie/${movie.id}`}>
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <Image
              src={movie.poster || "/placeholder.svg"}
              alt={`${movie.title} poster`}
              width={300}
              height={450}
              className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {onToggleLike && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault()
                    onToggleLike(movie.id)
                  }}
                  className="bg-black/50 hover:bg-black/70 text-white"
                  aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              )}
            </div>
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
                  <Play className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                {showRemove && onRemove && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.preventDefault()
                      onRemove(movie.id)
                    }}
                    className="bg-red-600/80 hover:bg-red-600"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="p-4">
            <h4 className="font-semibold text-white mb-1 line-clamp-1">{movie.title}</h4>
            <p className="text-gray-400 text-sm mb-2">{movie.year}</p>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-white text-sm font-medium">{movie.rating}</span>
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-3 line-clamp-2">{movie.description}</p>
            <div className="flex flex-wrap gap-1">
              {movie.genre.slice(0, 2).map((g) => (
                <Badge key={g} variant="secondary" className="text-xs bg-gray-800 text-gray-300 border-gray-700">
                  {g}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
