import axiosClient from './axiosClient'

export const uploadImage = (formData) => axiosClient.post('/api/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
