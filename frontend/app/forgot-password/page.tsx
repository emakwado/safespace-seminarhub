"use client"

import { useState } from "react"
import Link from "next/link"
import { authApi } from "@/services/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "@/hooks/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      setSubmitted(true)
      toast({ title: "Success", description: "Reset link sent to your email" })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error?.message || "Failed to send reset link",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <Link href="/login" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              Enter your email and we'll send you a reset link
            </CardDescription>
          </CardHeader>

          {submitted ? (
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
                <div>
                  <h3 className="font-semibold text-lg">Check your email</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We've sent a password reset link to {email}
                  </p>
                </div>
                <Button variant="outline" asChild className="mt-4">
                  <Link href="/login">Back to login</Link>
                </Button>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send reset link"}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Remember your password?{" "}
                  <Link href="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
