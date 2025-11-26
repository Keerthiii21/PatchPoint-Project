import axiosClient from './axiosClient'

export const listPotholes = () => axiosClient.get('/api/potholes')
export const createPothole = (data) => axiosClient.post('/api/potholes', data)
export const createFromPi = (data) => axiosClient.post('/api/potholes/pi', data)
export const getPothole = (id) => axiosClient.get(`/api/potholes/${id}`)
