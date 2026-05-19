"use client"

import Link from "next/link"
import { useSeminars } from "@/hooks/use-seminars"
import { SeminarCard } from "@/components/seminar-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function FeaturedSeminars() {
  const { data, isLoading } = useSeminars({ limit: 6, upcoming: true })

  return (
    <section className="container px-4 md:px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Featured Seminars</h2>
          <p className="text-muted-foreground mt-1">Upcoming events you don't want to miss</p>
        </div>
        <Button variant="ghost" asChild className="hidden sm:flex gap-2">
          <Link href="/seminars">
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

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
              transition={{ delay: index * 0.1 }}
            >
              <SeminarCard seminar={seminar} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="mt-8 text-center sm:hidden">
        <Button variant="outline" asChild>
          <Link href="/seminars">View All Seminars</Link>
        </Button>
      </div>
    </section>
  )
}
