"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Star,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Flag,
} from "lucide-react"
import { motion } from "framer-motion"

export default function FeedbackPage() {
  const [filter, setFilter] = useState("all")

  // Mock feedback data
  const feedbacks = [
    {
      id: "1",
      type: "rating",
      rating: 5,
      content: "Excellent seminar! The speaker was very knowledgeable and engaging.",
      seminar: "AI & Machine Learning",
      isAnonymous: true,
      isResolved: false,
      createdAt: "2024-05-15",
    },
    {
      id: "2",
      type: "report",
      rating: null,
      content: "The audio quality was poor in the online session.",
      seminar: "Web Dev Workshop",
      isAnonymous: true,
      isResolved: true,
      createdAt: "2024-05-14",
    },
    {
      id: "3",
      type: "rating",
      rating: 4,
      content: "Great content but would have liked more hands-on exercises.",
      seminar: "Business Strategy",
      isAnonymous: false,
      isResolved: false,
      createdAt: "2024-05-13",
    },
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Feedback & Reports</h1>
            <p className="text-muted-foreground mt-1">
              Manage attendee feedback and anonymous reports
            </p>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.6</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Reports</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Feedback</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {feedbacks.map((feedback) => (
              <Card key={feedback.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {feedback.type === "rating" && feedback.rating && (
                          <div className="flex">{renderStars(feedback.rating)}</div>
                        )}
                        {feedback.type === "report" && (
                          <Badge variant="destructive" className="gap-1">
                            <Flag className="h-3 w-3" />
                            Report
                          </Badge>
                        )}
                        <Badge variant={feedback.isAnonymous ? "secondary" : "outline"}>
                          {feedback.isAnonymous ? "Anonymous" : "Named"}
                        </Badge>
                      </div>
                      <p className="text-sm">{feedback.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {feedback.seminar} • {feedback.createdAt}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!feedback.isResolved && (
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                  {feedback.isResolved && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-800 dark:text-green-200">
                        <CheckCircle className="h-4 w-4 inline mr-1" />
                        Resolved: Audio equipment has been upgraded for future sessions.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="ratings">
            <div className="text-center py-12 text-muted-foreground">
              Rating-specific view
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="text-center py-12 text-muted-foreground">
              Reports-specific view
            </div>
          </TabsContent>

          <TabsContent value="resolved">
            <div className="text-center py-12 text-muted-foreground">
              Resolved items view
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
