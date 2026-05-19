"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Shield, Calendar, Edit2, Save } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

export default function ProfilePage() {
  const { user, profile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  })

  const handleSave = () => {
    // Save profile logic
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="container px-4 md:px-6 py-16 text-center">
        <p className="text-muted-foreground">Please sign in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} alt={user.fullName} />
                <AvatarFallback className="text-2xl">
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
                <Badge variant="secondary" className="capitalize">
                  <Shield className="h-3 w-3 mr-1" />
                  {user.role.replace("_", " ")}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{profile?.registrations?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Registrations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {profile?.registrations?.filter((r: any) => r.checkedInAt).length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Attended</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {new Date(user.createdAt).getFullYear()}
                </div>
                <div className="text-xs text-muted-foreground">Member Since</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
