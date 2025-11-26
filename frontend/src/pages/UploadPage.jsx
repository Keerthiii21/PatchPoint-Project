import React, { useState } from 'react'
import { uploadImage } from '../api/uploadApi'
import { createPothole } from '../api/potholeApi'

export default function UploadPage(){
  const [file, setFile] = useState(null)
  const [gpsLat, setGpsLat] = useState('')
  const [gpsLon, setGpsLon] = useState('')
  const [depthCm, setDepthCm] = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      let imageUrl = null
      if (file) {
        const fd = new FormData();
        fd.append('image', file)
        const res = await uploadImage(fd)
        imageUrl = res.data.url
      }

      await createPothole({ gpsLat: Number(gpsLat), gpsLon: Number(gpsLon), depthCm: Number(depthCm), address, imageUrl })
      setMessage('Pothole uploaded')
      setFile(null); setGpsLat(''); setGpsLon(''); setDepthCm(''); setAddress('')
    }catch(err){ setMessage(err.response?.data?.message || 'Upload failed') }
  }

  return (
    <div className="container">
      <h2>Report Pothole</h2>
      <form onSubmit={handleSubmit} className="card">
        {message && <div className="muted">{message}</div>}
        <input type="file" onChange={e=>setFile(e.target.files[0])} />
        <input value={gpsLat} onChange={e=>setGpsLat(e.target.value)} placeholder="Latitude" />
        <input value={gpsLon} onChange={e=>setGpsLon(e.target.value)} placeholder="Longitude" />
        <input value={depthCm} onChange={e=>setDepthCm(e.target.value)} placeholder="Depth (cm)" />
        <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Address" />
        <div className="flex"><button className="btn" type="submit">Submit</button></div>
      </form>
    </div>
  )
}
