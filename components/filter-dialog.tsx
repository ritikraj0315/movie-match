"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface FilterOptions {
  genres: string[]
  yearRange: [number, number]
  ratingRange: [number, number]
  sortBy: string
}

interface FilterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters: (filters: FilterOptions) => void
  currentFilters: FilterOptions
}

const availableGenres = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Drama",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
]

const sortOptions = [
  { value: "rating-desc", label: "Rating (High to Low)" },
  { value: "rating-asc", label: "Rating (Low to High)" },
  { value: "year-desc", label: "Year (Newest First)" },
  { value: "year-asc", label: "Year (Oldest First)" },
  { value: "title-asc", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
]

export function FilterDialog({ open, onOpenChange, onApplyFilters, currentFilters }: FilterDialogProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters)

  const handleGenreChange = (genre: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      genres: checked ? [...prev.genres, genre] : prev.genres.filter((g) => g !== genre),
    }))
  }

  const handleApply = () => {
    onApplyFilters(filters)
    onOpenChange(false)
  }

  const handleReset = () => {
    setFilters({
      genres: [],
      yearRange: [1970, 2024],
      ratingRange: [0, 10],
      sortBy: "rating-desc",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Filter Movies</DialogTitle>
          <DialogDescription className="text-gray-400">Customize your movie discovery experience</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Genres */}
          <div>
            <Label className="text-base font-medium mb-3 block">Genres</Label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {availableGenres.map((genre) => (
                <div key={genre} className="flex items-center space-x-2">
                  <Checkbox
                    id={genre}
                    checked={filters.genres.includes(genre)}
                    onCheckedChange={(checked) => handleGenreChange(genre, checked as boolean)}
                    className="border-gray-600"
                  />
                  <Label htmlFor={genre} className="text-sm text-gray-300">
                    {genre}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Year Range */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Release Year: {filters.yearRange[0]} - {filters.yearRange[1]}
            </Label>
            <Slider
              value={filters.yearRange}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, yearRange: value as [number, number] }))}
              min={1970}
              max={2024}
              step={1}
              className="w-full"
            />
          </div>

          {/* Rating Range */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Rating: {filters.ratingRange[0]} - {filters.ratingRange[1]}
            </Label>
            <Slider
              value={filters.ratingRange}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, ratingRange: value as [number, number] }))}
              min={0}
              max={10}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Sort By */}
          <div>
            <Label className="text-base font-medium mb-3 block">Sort By</Label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset} className="border-gray-600 text-gray-300 bg-transparent">
            Reset
          </Button>
          <Button onClick={handleApply} className="bg-white text-black hover:bg-gray-200">
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
