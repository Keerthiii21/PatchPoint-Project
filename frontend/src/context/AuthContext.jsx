import React, { createContext, useState, useEffect } from 'react'
import * as authApi from '../api/authApi'
import axiosClient from '../api/axiosClient'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const fetchMe = async () => {
    try {
      const res = await authApi.me()
      setCurrentUser(res.data.user)
      setIsAuthenticated(true)
    } catch (err) {
      setCurrentUser(null)
      setIsAuthenticated(false)
    }
  }

  useEffect(() => { fetchMe() }, [])

  const signup = async (data) => {
    try {
      const res = await authApi.signup(data)
      setCurrentUser(res.data.user)
      setIsAuthenticated(true)
      return res
    } catch (err) {
      console.error('Signup error in context:', err.response?.data || err.message)
      throw err
    }
  }

  const login = async (data) => {
    try {
      const res = await authApi.login(data)
      setCurrentUser(res.data.user)
      setIsAuthenticated(true)
      return res
    } catch (err) {
      console.error('Login error in context:', err.response?.data || err.message)
      throw err
    }
  }

  const logout = async () => {
    await authApi.logout()
    setCurrentUser(null)
    setIsAuthenticated(false)
    // clear cookies handled by server
  }

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, signup, login, logout, fetchMe }}>
      {children}
    </AuthContext.Provider>
  )
}
