"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authApi } from "@/services/auth"
import { useAuthStore } from "@/store/auth"
import { toast } from "@/hooks/use-toast"

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, setUser, clearAuth } = useAuthStore()

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => authApi.getProfile(),
    enabled: !!user,
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setUser(data.user, data.accessToken, data.refreshToken)
      toast({ title: "Success", description: "Logged in successfully" })
      router.push("/dashboard")
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error?.message || "Login failed",
        variant: "destructive",
      })
    },
  })

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Registration successful! Please check your email.",
      })
      router.push("/login")
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error?.message || "Registration failed",
        variant: "destructive",
      })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth()
      queryClient.clear()
      toast({ title: "Success", description: "Logged out successfully" })
      router.push("/")
    },
  })

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  }
}
