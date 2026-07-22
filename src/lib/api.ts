import axios, { type AxiosError, type AxiosResponse } from 'axios'
import type { ApiError } from '@/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
  timeout: 10000,
})

// Request interceptor — attach access token from localStorage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('brainhealth-auth')
        if (stored) {
          const parsed = JSON.parse(stored)
          const token = parsed?.state?.accessToken
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
      } catch {
        // ignore parse errors
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response interceptor — handle 401 globally with silent refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as any

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Don't intercept refresh or signin endpoints
      if (originalRequest.url === '/auth/refresh' || originalRequest.url === '/auth/signin') {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('brainhealth-auth')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        let refreshToken = null
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('brainhealth-auth')
          if (stored) {
            const parsed = JSON.parse(stored)
            refreshToken = parsed?.state?.refreshToken
          }
        }

        if (!refreshToken) {
          throw new Error('No refresh token found')
        }

        // Call refresh endpoint directly using axios to avoid interceptor loops
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
          refresh: refreshToken,
        })

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data

        // Manually update localStorage Zustand state
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('brainhealth-auth')
          if (stored) {
            const parsed = JSON.parse(stored)
            parsed.state.accessToken = newAccessToken
            parsed.state.refreshToken = newRefreshToken
            localStorage.setItem('brainhealth-auth', JSON.stringify(parsed))
          }
        }

        // Tell Axios to use the new token
        api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken

        processQueue(null, newAccessToken)
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('brainhealth-auth')
          window.location.href = '/login?error=session_expired'
        }
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
