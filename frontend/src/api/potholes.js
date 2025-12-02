import axiosClient from './axiosClient'

export const getPotholes = () => axiosClient.get('/api/potholes')

// For user uploads (multipart/form-data)
export const uploadPothole = (formData) => axiosClient.post('/api/potholes', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

// For Pi uploads - accepts formData with fields: image, lat, lon, depth, timestamp
export const uploadPotholeFromPi = (formData) => axiosClient.post('/api/potholes/pi-upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

export const getPothole = (id) => axiosClient.get(`/api/potholes/${id}`)
