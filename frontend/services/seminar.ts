import { api } from "./api"

export const seminarApi = {
  getAll: (params?: {
    page?: number
    limit?: number
    search?: string
    category?: string
    status?: string
    upcoming?: boolean
  }) => api.get("/seminars", { params }).then((res) => res.data.data),

  getById: (id: string) => api.get(`/seminars/${id}`).then((res) => res.data.data),

  getBySlug: (slug: string) => api.get(`/seminars/slug/${slug}`).then((res) => res.data.data),

  create: (data: any) => api.post("/seminars", data).then((res) => res.data.data),

  update: (id: string, data: any) => api.put(`/seminars/${id}`, data).then((res) => res.data.data),

  delete: (id: string) => api.delete(`/seminars/${id}`).then((res) => res.data.data),

  publish: (id: string) => api.patch(`/seminars/${id}/publish`).then((res) => res.data.data),

  unpublish: (id: string) => api.patch(`/seminars/${id}/unpublish`).then((res) => res.data.data),

  getStats: () => api.get("/seminars/stats").then((res) => res.data.data),
}
