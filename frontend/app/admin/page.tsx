"use client"

import { useAuth } from "@/hooks/use-auth"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  CalendarDays,
  Ticket,
  Star,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

const COLORS = ["hsl(var(--primary))", "hsl(var(--secondary))", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export default function AdminPage() {
  const { user } = useAuth()

  // Mock data for analytics (replace with actual API calls)
  const monthlyData = [
    { month: "Jan", registrations: 120, attendance: 95 },
    { month: "Feb", registrations: 150, attendance: 120 },
    { month: "Mar", registrations: 180, attendance: 145 },
    { month: "Apr", registrations: 220, attendance: 180 },
    { month: "May", registrations: 280, attendance: 240 },
    { month: "Jun", registrations: 310, attendance: 265 },
  ]

  const categoryData = [
    { name: "Technology", value: 35 },
    { name: "Business", value: 25 },
    { name: "Health", value: 15 },
    { name: "Education", value: 12 },
    { name: "Arts", value: 8 },
    { name: "Other", value: 5 },
  ]

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Seminars",
      value: "48",
      change: "+5%",
      trend: "up",
      icon: CalendarDays,
    },
    {
      title: "Registrations",
      value: "3,456",
      change: "+18%",
      trend: "up",
      icon: Ticket,
    },
    {
      title: "Avg Rating",
      value: "4.8",
      change: "+0.2",
      trend: "up",
      icon: Star,
    },
  ]

  return (
    <div className="container px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of your seminar platform
            </p>
          </div>
          <Button variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    )}
                    <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="registrations" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="attendance" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registration Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="registrations" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Seminars by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
