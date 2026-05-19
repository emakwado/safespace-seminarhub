"use client"

import { motion } from "framer-motion"
import { CalendarDays, Users, Star, TrendingUp } from "lucide-react"

const stats = [
  {
    icon: CalendarDays,
    value: "500+",
    label: "Active Seminars",
    description: "Regularly updated with new topics",
  },
  {
    icon: Users,
    value: "10K+",
    label: "Registered Attendees",
    description: "Growing community of learners",
  },
  {
    icon: Star,
    value: "4.8",
    label: "Average Rating",
    description: "Based on attendee feedback",
  },
  {
    icon: TrendingUp,
    value: "95%",
    label: "Attendance Rate",
    description: "Consistent participation",
  },
]

export function StatsSection() {
  return (
    <section className="border-y bg-muted/50">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <div className="rounded-full bg-primary/10 p-3">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm font-medium">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
