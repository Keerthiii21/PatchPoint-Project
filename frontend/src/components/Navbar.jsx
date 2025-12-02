import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { MapPin, Menu, X, LogOut } from 'lucide-react'
import Button from './Button'

export default function Navbar() {
  const { currentUser, isAuthenticated, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 glass-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-poppins font-bold">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <MapPin className="w-5 h-5 text-blue-400" />
          </div>
          <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
            PATCHPOINT
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="text-dark-300 hover:text-white transition-colors">Dashboard</Link>
              <Link to="/upload" className="text-dark-300 hover:text-white transition-colors">Upload</Link>
              <Link to="/map" className="text-dark-300 hover:text-white transition-colors">Map</Link>
              <Link to="/comments" className="text-dark-300 hover:text-white transition-colors">Comments</Link>
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-3 px-3 py-2 rounded-lg bg-dark-700/50">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-400">
                    {currentUser?.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-dark-300">{currentUser?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" size="sm">Signup</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-dark-700/50 transition-colors"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden animate-fade-in border-t border-white/10 bg-dark-850/40 backdrop-blur-md px-6 py-4 space-y-3">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block text-dark-300 hover:text-white">Dashboard</Link>
              <Link to="/upload" onClick={() => setMenuOpen(false)} className="block text-dark-300 hover:text-white">Upload</Link>
              <Link to="/map" onClick={() => setMenuOpen(false)} className="block text-dark-300 hover:text-white">Map</Link>
              <Link to="/comments" onClick={() => setMenuOpen(false)} className="block text-dark-300 hover:text-white">Comments</Link>
              <hr className="border-white/10" />
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-400">{currentUser?.name?.[0]?.toUpperCase()}</span>
                </div>
                <span className="text-sm">{currentUser?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="w-full justify-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block">
                <Button variant="secondary" size="md" className="w-full">Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="block">
                <Button variant="primary" size="md" className="w-full">Signup</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
