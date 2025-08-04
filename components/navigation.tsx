"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Filter, Search } from "lucide-react"

interface NavigationProps {
  onFilterClick?: () => void
  onSearchClick?: () => void
}

export function Navigation({ onFilterClick, onSearchClick }: NavigationProps) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className="border-b border-gray-800 bg-black sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <h1 className="text-3xl font-bold text-white hover:text-gray-300 transition-colors">MovieMatch</h1>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link
                href="/"
                className={`transition-colors ${
                  isActive("/") ? "text-white font-medium" : "text-gray-300 hover:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                href="/discover"
                className={`transition-colors ${
                  isActive("/discover") ? "text-white font-medium" : "text-gray-300 hover:text-white"
                }`}
              >
                Discover
              </Link>
              <Link
                href="/my-list"
                className={`transition-colors ${
                  isActive("/my-list") ? "text-white font-medium" : "text-gray-300 hover:text-white"
                }`}
              >
                My List
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {onSearchClick && (
              <Button variant="ghost" size="icon" onClick={onSearchClick} className="text-white hover:bg-gray-800">
                <Search className="w-5 h-5" />
              </Button>
            )}
            {onFilterClick && (
              <Button variant="ghost" size="icon" onClick={onFilterClick} className="text-white hover:bg-gray-800">
                <Filter className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
