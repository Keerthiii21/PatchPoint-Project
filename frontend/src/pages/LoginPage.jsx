import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function LoginPage(){
  const { login, isAuthenticated } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{ if(isAuthenticated) navigate('/dashboard') },[isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      await login({ email, password })
      navigate('/dashboard')
    }catch(err){ setError(err.response?.data?.message || 'Login failed') }
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="card">
        {error && <div className="muted">{error}</div>}
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
        <div className="flex">
          <button className="btn" type="submit">Login</button>
        </div>
      </form>
      <p className="muted">Don't have an account? <a href="/signup">Signup</a></p>
    </div>
  )
}
