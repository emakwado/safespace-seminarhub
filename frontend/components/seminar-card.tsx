"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import { format } from "date-fns"

interface SeminarCardProps {
  seminar: {
    id: string
    title: string
    slug: string
    shortDescription?: string
    image?: string
    venue: string
    startDate: string
    capacity: number
    registeredCount: number
    category: string
    status: string
    price: number
  }
}

export function SeminarCard({ seminar }: SeminarCardProps) {
  const isFull = seminar.registeredCount >= seminar.capacity && seminar.capacity > 0
  const availableSeats = Math.max(0, seminar.capacity - seminar.registeredCount)
  const fillPercentage = seminar.capacity > 0
    ? Math.round((seminar.registeredCount / seminar.capacity) * 100)
    : 0

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={seminar.image || "/placeholder-seminar.jpg"}
          alt={seminar.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="capitalize">
            {seminar.category}
          </Badge>
        </div>
        {isFull && (
          <div className="absolute top-3 right-3">
            <Badge variant="destructive">Full</Badge>
          </div>
        )}
        {seminar.price > 0 && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="default">${seminar.price}</Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <h3 className="font-semibold text-lg line-clamp-2">{seminar.title}</h3>
        {seminar.shortDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {seminar.shortDescription}
          </p>
        )}
      </CardHeader>

      <CardContent className="pb-2 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(seminar.startDate), "MMM dd, yyyy h:mm a")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="truncate">{seminar.venue}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>
            {seminar.registeredCount}/{seminar.capacity} registered
            {availableSeats > 0 && (
              <span className="text-green-600 ml-1">({availableSeats} left)</span>
            )}
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{ width: `${fillPercentage}%` }}
          />
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full gap-2" variant={isFull ? "outline" : "default"}>
          <Link href={`/seminars/${seminar.slug}`}>
            {isFull ? "Join Waitlist" : "View Details"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
