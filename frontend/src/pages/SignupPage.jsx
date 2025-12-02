import React, { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { User, Mail, Lock, MapPin } from 'lucide-react'
import Button from '../components/Button'
import Input from '../components/Input'
import Card from '../components/Card'

export default function SignupPage(){
  const { signup, isAuthenticated } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{ if(isAuthenticated) navigate('/dashboard') },[isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try{
      console.log('Attempting signup with:', email)
      await signup({ name, email, password })
      navigate('/dashboard')
    }catch(err){
      console.error('Signup error:', err)
      const msg = err.response?.data?.message || err.message || 'Signup failed'
      setError(msg)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-900 to-dark-800 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-500/20 border border-blue-500/30 mb-4">
            <MapPin className="w-7 h-7 text-blue-400" />
          </div>
          <h1 className="text-3xl font-poppins font-bold mb-2">PATCHPOINT</h1>
          <p className="text-dark-400">Join the community</p>
        </div>

        {/* Signup Card */}
        <Card className="!p-8 border-white/20 shadow-2xl">
          <h2 className="text-2xl font-poppins font-bold mb-6">Create account</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              icon={User}
              placeholder="Your name"
              value={name}
              onChange={e=>setName(e.target.value)}
              required
            />

            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="your@email.com"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              required
            />

            <Button 
              variant="primary" 
              size="md" 
              className="w-full mt-6" 
              disabled={loading}
              type="submit"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-dark-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
