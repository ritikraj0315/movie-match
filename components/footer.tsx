import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-white mb-2">MovieMatch</h3>
            <p className="text-gray-400">Discover your next favorite movie</p>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm mb-2">
                Created with ❤️ by <span className="text-white font-medium">Ritik Raj</span>
              </p>
              <p className="text-gray-500 text-xs">Open Source Project</p>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800" asChild>
                <a
                  href="https://github.com/ritikraj0315/movie-match"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <Github className="w-4 h-4" />
                  <span>View on GitHub</span>
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 MovieMatch. This is an open source project. Feel free to contribute!
          </p>
        </div>
      </div>
    </footer>
  )
}
