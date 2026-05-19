import { api } from "./api"

export const registrationApi = {
  create: (data: { seminarId: string; notes?: string }) =>
    api.post("/registrations", data).then((res) => res.data.data),

  getAll: (params?: {
    page?: number
    limit?: number
    seminarId?: string
    status?: string
  }) => api.get("/registrations", { params }).then((res) => res.data.data),

  getMyRegistrations: () =>
    api.get("/registrations/my-registrations").then((res) => res.data.data),

  updateStatus: (id: string, status: string) =>
    api.patch(`/registrations/${id}/status`, { status }).then((res) => res.data.data),

  cancel: (id: string) =>
    api.delete(`/registrations/${id}/cancel`).then((res) => res.data.data),

  exportAttendees: (seminarId: string) =>
    api.get(`/registrations/export/${seminarId}`).then((res) => res.data.data),
}
