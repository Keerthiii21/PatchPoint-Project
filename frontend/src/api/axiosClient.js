import axios from 'axios'

const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'

const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
})

export default axiosClient
