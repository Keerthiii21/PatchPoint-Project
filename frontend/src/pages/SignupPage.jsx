import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function SignupPage(){
  const { signup, isAuthenticated } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{ if(isAuthenticated) navigate('/dashboard') },[isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      await signup({ name, email, password })
      navigate('/dashboard')
    }catch(err){ setError(err.response?.data?.message || 'Signup failed') }
  }

  return (
    <div className="container">
      <h2>Create account</h2>
      <form onSubmit={handleSubmit} className="card">
        {error && <div className="muted">{error}</div>}
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
        <div className="flex">
          <button className="btn" type="submit">Create account</button>
        </div>
      </form>
      <p className="muted">Already have an account? <a href="/login">Login</a></p>
    </div>
  )
}
