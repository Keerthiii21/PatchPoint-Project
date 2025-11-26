import axiosClient from './axiosClient'

export const listComments = (potholeId) => axiosClient.get(`/api/comments/${potholeId}`)
export const createComment = (data) => axiosClient.post('/api/comments', data)
