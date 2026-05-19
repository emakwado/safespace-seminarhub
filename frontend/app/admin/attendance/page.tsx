"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  QrCode,
  CheckCircle,
  XCircle,
  Search,
  Camera,
  Users,
  Clock,
  BarChart3,
} from "lucide-react"
import { motion } from "framer-motion"

export default function AttendancePage() {
  const [scanMode, setScanMode] = useState(false)
  const [ticketNumber, setTicketNumber] = useState("")

  // Mock attendance data
  const recentScans = [
    { id: "1", name: "John Doe", ticket: "TKT-ABC123", time: "2:30 PM", status: "checked-in" },
    { id: "2", name: "Jane Smith", ticket: "TKT-DEF456", time: "2:28 PM", status: "checked-in" },
    { id: "3", name: "Bob Johnson", ticket: "TKT-GHI789", time: "2:25 PM", status: "checked-out" },
  ]

  const handleScan = () => {
    // Handle QR scan logic
    console.log("Scanning ticket:", ticketNumber)
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance Tracking</h1>
          <p className="text-muted-foreground mt-1">
            Scan QR codes and manage attendance
          </p>
        </div>

        <Tabs defaultValue="scanner">
          <TabsList>
            <TabsTrigger value="scanner">QR Scanner</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="scanner" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    QR Scanner
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-square max-w-sm mx-auto bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                    <div className="text-center space-y-2">
                      <QrCode className="h-12 w-12 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">
                        Camera access required for QR scanning
                      </p>
                      <Button variant="outline">Enable Camera</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Scans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentScans.map((scan) => (
                      <div
                        key={scan.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          {scan.status === "checked-in" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-blue-500" />
                          )}
                          <div>
                            <p className="font-medium">{scan.name}</p>
                            <p className="text-sm text-muted-foreground">{scan.ticket}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={scan.status === "checked-in" ? "default" : "secondary"}>
                            {scan.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{scan.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-6">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Manual Check-in</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ticket Number</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter ticket number (e.g., TKT-ABC123)"
                      value={ticketNumber}
                      onChange={(e) => setTicketNumber(e.target.value)}
                    />
                    <Button onClick={handleScan}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Registered</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">156</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Checked In</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">142</div>
                  <p className="text-xs text-muted-foreground">91% attendance rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">No Show</CardTitle>
                  <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">14</div>
                  <p className="text-xs text-muted-foreground">9% no-show rate</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
