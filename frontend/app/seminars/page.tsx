"use client"

import { useState } from "react"
import { useSeminars } from "@/hooks/use-seminars"
import { SeminarCard } from "@/components/seminar-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const categories = [
  "All",
  "Technology",
  "Business",
  "Health",
  "Education",
  "Arts",
  "Science",
  "Other",
]

export default function SeminarsPage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading } = useSeminars({
    search: search || undefined,
    category: selectedCategory === "All" ? undefined : selectedCategory.toLowerCase(),
    limit: 12,
  })

  return (
    <div className="container px-4 md:px-6 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">All Seminars</h1>
          <p className="text-muted-foreground">
            Browse and register for upcoming seminars
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search seminars..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Category Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-2 pb-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="cursor-pointer capitalize"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        {!isLoading && data && (
          <p className="text-sm text-muted-foreground">
            Showing {data.data?.length || 0} of {data.meta?.total || 0} seminars
          </p>
        )}

        {/* Seminar Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {data?.data?.map((seminar: any, index: number) => (
              <motion.div
                key={seminar.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <SeminarCard seminar={seminar} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && data?.data?.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No seminars found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
