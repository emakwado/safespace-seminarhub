"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Calendar, Users, Shield } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium w-fit">
              <Shield className="h-4 w-4 text-primary" />
              <span>Secure & Anonymous Feedback</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Discover. Learn.{" "}
              <span className="text-primary">Connect.</span>
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl max-w-[600px]">
              Your modern platform for seminar management. Book sessions, track attendance,
              share feedback anonymously, and grow your network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/seminars">
                  Browse Seminars
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/register">Get Started Free</Link>
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>500+ Seminars</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>10K+ Attendees</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl border bg-card p-2 shadow-2xl">
              <div className="rounded-xl bg-gradient-to-br from-primary/20 to-secondary p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg bg-background/80 p-4 backdrop-blur">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">AI & Machine Learning</p>
                      <p className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</p>
                    </div>
                    <div className="ml-auto">
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                        Open
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg bg-background/80 p-4 backdrop-blur">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Web Dev Workshop</p>
                      <p className="text-sm text-muted-foreground">Next Week, 10:00 AM</p>
                    </div>
                    <div className="ml-auto">
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                        Filling Fast
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg bg-background/80 p-4 backdrop-blur">
                    <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">Mental Health Awareness</p>
                      <p className="text-sm text-muted-foreground">In 3 Days, 1:00 PM</p>
                    </div>
                    <div className="ml-auto">
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                        Approved
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
