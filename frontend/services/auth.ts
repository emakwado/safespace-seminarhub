import { api } from "./api"

export const authApi = {
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => api.post("/auth/register", data).then((res) => res.data.data),

  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data).then((res) => res.data.data),

  logout: () => api.post("/auth/logout").then((res) => res.data.data),

  getProfile: () => api.get("/auth/profile").then((res) => res.data.data),

  updateProfile: (data: { firstName?: string; lastName?: string; avatar?: string }) =>
    api.patch("/auth/profile", data).then((res) => res.data.data),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }).then((res) => res.data.data),

  resetPassword: (data: { token: string; password: string }) =>
    api.post("/auth/reset-password", data).then((res) => res.data.data),

  verifyEmail: (token: string) =>
    api.get(`/auth/verify-email?token=${token}`).then((res) => res.data.data),
}
