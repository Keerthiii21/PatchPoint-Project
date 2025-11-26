import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar(){
  const { currentUser, isAuthenticated, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar container">
      <div className="brand">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C14.7614 2 17 4.23858 17 7C17 11.25 12 17 12 17C12 17 7 11.25 7 7C7 4.23858 9.23858 2 12 2Z" stroke="currentColor" strokeWidth="1.2"/><circle cx="12" cy="7" r="1.8" fill="currentColor"/></svg>
        <span>PATCHPOINT</span>
      </div>

      <div className="navlinks">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/map">Map</Link>
        <Link to="/comments">Comments</Link>
        {isAuthenticated ? (
          <>
            <span className="muted">{currentUser?.name}</span>
            <button className="btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn ghost">Login</Link>
            <Link to="/signup" className="btn">Signup</Link>
          </>
        )}
      </div>
    </nav>
  )
}
