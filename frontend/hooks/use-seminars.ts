"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { seminarApi } from "@/services/seminar"
import { toast } from "@/hooks/use-toast"

export function useSeminars(params?: {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
  upcoming?: boolean
}) {
  return useQuery({
    queryKey: ["seminars", params],
    queryFn: () => seminarApi.getAll(params),
  })
}

export function useSeminar(id: string) {
  return useQuery({
    queryKey: ["seminar", id],
    queryFn: () => seminarApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateSeminar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: seminarApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seminars"] })
      toast({ title: "Success", description: "Seminar created successfully" })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error?.message || "Failed to create seminar",
        variant: "destructive",
      })
    },
  })
}

export function useUpdateSeminar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => seminarApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["seminars"] })
      queryClient.invalidateQueries({ queryKey: ["seminar", variables.id] })
      toast({ title: "Success", description: "Seminar updated successfully" })
    },
  })
}

export function useDeleteSeminar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: seminarApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seminars"] })
      toast({ title: "Success", description: "Seminar deleted successfully" })
    },
  })
}
