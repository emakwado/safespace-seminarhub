"use client"

import { useParams } from "next/navigation"
import { useSeminar } from "@/hooks/use-seminars"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QRCodeSVG } from "qrcode.react"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Tag,
  Share2,
  Bookmark,
  CheckCircle,
  AlertCircle,
  Star,
  User,
  Building,
} from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function SeminarDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { data: seminar, isLoading } = useSeminar(slug)
  const { user, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    )
  }

  if (!seminar) {
    return (
      <div className="container px-4 md:px-6 py-16 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Seminar not found</h1>
        <p className="text-muted-foreground mt-2">
          The seminar you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild className="mt-4">
          <Link href="/seminars">Browse Seminars</Link>
        </Button>
      </div>
    )
  }

  const isFull = seminar.registeredCount >= seminar.capacity && seminar.capacity > 0
  const isOrganizer = user?.id === seminar.organizerId
  const isAdmin = user?.role === "super_admin"

  return (
    <div className="container px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Hero Image */}
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden">
          <Image
            src={seminar.image || "/placeholder-seminar.jpg"}
            alt={seminar.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                {seminar.category}
              </Badge>
              {seminar.isOnline && (
                <Badge variant="secondary" className="bg-blue-500/80 text-white border-0">
                  Online
                </Badge>
              )}
              {seminar.price > 0 ? (
                <Badge variant="secondary" className="bg-green-500/80 text-white border-0">
                  ${seminar.price}
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-green-500/80 text-white border-0">
                  Free
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{seminar.title}</h1>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="speakers">Speakers</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">About this Seminar</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {seminar.description}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Card>
                    <CardContent className="pt-6 flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Date & Time</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(seminar.startDate), "MMMM dd, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(seminar.startDate), "h:mm a")} -{" "}
                          {format(new Date(seminar.endDate), "h:mm a")}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6 flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{seminar.venue}</p>
                        {seminar.venueAddress && (
                          <p className="text-sm text-muted-foreground">
                            {seminar.venueAddress}
                          </p>
                        )}
                        {seminar.isOnline && seminar.onlineLink && (
                          <p className="text-sm text-primary">Online Event</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {seminar.tags && seminar.tags.length > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="h-4 w-4 text-primary" />
                        <p className="font-medium">Tags</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {seminar.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="speakers" className="space-y-4">
                {seminar.speakers?.map((speaker: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{speaker.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building className="h-4 w-4" />
                            <span>{speaker.title}</span>
                            {speaker.company && <span>at {speaker.company}</span>}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{speaker.bio}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {(!seminar.speakers || seminar.speakers.length === 0) && (
                  <p className="text-muted-foreground text-center py-8">
                    No speakers listed for this seminar.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="feedback">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center py-8">
                      Feedback will be available after the seminar.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Available Seats</span>
                    <span className="font-medium">
                      {Math.max(0, seminar.capacity - seminar.registeredCount)} / {seminar.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{
                        width: `${seminar.capacity > 0 ? (seminar.registeredCount / seminar.capacity) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>

                {isAuthenticated ? (
                  <>
                    {isFull ? (
                      <Button className="w-full" variant="outline" disabled>
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Fully Booked
                      </Button>
                    ) : (
                      <Button className="w-full">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Register Now
                      </Button>
                    )}
                  </>
                ) : (
                  <Button asChild className="w-full">
                    <Link href="/login">Sign in to Register</Link>
                  </Button>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Star className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{seminar.organizer?.fullName}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {seminar.organizer?.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {seminar.requiresApproval && (
              <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-200">
                        Approval Required
                      </p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Registration for this seminar requires organizer approval.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
