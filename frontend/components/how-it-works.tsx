"use client"

import { motion } from "framer-motion"
import { Search, Ticket, QrCode, MessageSquare } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Discover",
    description: "Browse through our curated list of seminars across various categories and find the perfect match for your interests.",
  },
  {
    icon: Ticket,
    title: "Register",
    description: "Sign up for seminars with a single click. Receive instant confirmation and your digital ticket with QR code.",
  },
  {
    icon: QrCode,
    title: "Attend",
    description: "Show your QR code at check-in for seamless entry. Track your attendance history in real-time.",
  },
  {
    icon: MessageSquare,
    title: "Share Feedback",
    description: "Submit anonymous feedback and ratings. Help us improve while keeping your identity protected.",
  },
]

export function HowItWorks() {
  return (
    <section className="container px-4 md:px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Getting started is easy. Follow these simple steps to join our community of learners.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            className="relative flex flex-col items-center text-center gap-4"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <step.icon className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-8 left-[60%] w-full h-[2px] bg-border" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}
