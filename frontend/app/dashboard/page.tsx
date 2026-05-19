"use client"

import { useAuth } from "@/hooks/use-auth"
import { useQuery } from "@tanstack/react-query"
import { seminarApi } from "@/services/seminar"
import { registrationApi } from "@/services/registration"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { SeminarCard } from "@/components/seminar-card"
import { QRCodeSVG } from "qrcode.react"
import {
  CalendarDays,
  Ticket,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Star,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { format } from "date-fns"

export default function DashboardPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === "super_admin" || user?.role === "organizer"

  const { data: myRegistrations, isLoading: registrationsLoading } = useQuery({
    queryKey: ["my-registrations"],
    queryFn: () => registrationApi.getMyRegistrations(),
  })

  const { data: seminarStats } = useQuery({
    queryKey: ["seminar-stats"],
    queryFn: () => seminarApi.getStats(),
    enabled: isAdmin,
  })

  const upcomingRegistrations = myRegistrations?.filter(
    (r: any) => new Date(r.seminar.startDate) > new Date() && r.status === "approved"
  )

  const pastRegistrations = myRegistrations?.filter(
    (r: any) => new Date(r.seminar.endDate) < new Date()
  )

  return (
    <div className="container px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your seminars
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myRegistrations?.length || 0}</div>
              <p className="text-xs text-muted-foreground">All time registrations</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingRegistrations?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Confirmed upcoming events</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Attended</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pastRegistrations?.filter((r: any) => r.checkedInAt).length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Events you've attended</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {myRegistrations?.filter((r: any) => r.status === "pending").length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {registrationsLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : upcomingRegistrations?.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingRegistrations.map((registration: any) => (
                  <Card key={registration.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{registration.seminar.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(registration.seminar.startDate), "MMM dd, yyyy h:mm a")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {registration.seminar.venue}
                          </p>
                          <Badge variant={registration.status === "approved" ? "default" : "secondary"}>
                            {registration.status}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/seminars/${registration.seminar.slug}`}>
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No upcoming events</h3>
                <p className="text-muted-foreground mt-1">
                  Browse seminars and register for upcoming events
                </p>
                <Button asChild className="mt-4">
                  <Link href="/seminars">Browse Seminars</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastRegistrations?.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {pastRegistrations.map((registration: any) => (
                  <Card key={registration.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{registration.seminar.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(registration.seminar.startDate), "MMM dd, yyyy")}
                          </p>
                          <div className="flex items-center gap-2">
                            {registration.checkedInAt ? (
                              <Badge variant="default" className="gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Attended
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Missed
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No past events</h3>
                <p className="text-muted-foreground mt-1">
                  Your attended events will appear here
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tickets" className="space-y-4">
            {myRegistrations?.filter((r: any) => r.status === "approved").length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myRegistrations
                  .filter((r: any) => r.status === "approved")
                  .map((registration: any) => (
                    <Card key={registration.id}>
                      <CardHeader>
                        <CardTitle className="text-sm">{registration.seminar.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-center">
                          <QRCodeSVG
                            value={registration.ticketNumber}
                            size={160}
                            level="M"
                            className="rounded-lg"
                          />
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-sm font-mono text-muted-foreground">
                            {registration.ticketNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Present this QR code at check-in
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold">No tickets yet</h3>
                <p className="text-muted-foreground mt-1">
                  Register for seminars to get your digital tickets
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
