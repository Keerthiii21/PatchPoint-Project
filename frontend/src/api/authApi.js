import axiosClient from './axiosClient'

export const signup = (data) => axiosClient.post('/api/auth/signup', data)
export const login = (data) => axiosClient.post('/api/auth/login', data)
export const logout = () => axiosClient.post('/api/auth/logout')
export const me = () => axiosClient.get('/api/auth/me')
