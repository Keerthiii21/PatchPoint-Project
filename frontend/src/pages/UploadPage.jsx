import React, { useState } from 'react'
import { uploadImage } from '../api/uploadApi'
import { createPothole } from '../api/potholeApi'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import { Upload, MapPin, Gauge, Home, CheckCircle } from 'lucide-react'

export default function UploadPage(){
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [gpsLat, setGpsLat] = useState('')
  const [gpsLon, setGpsLon] = useState('')
  const [depthCm, setDepthCm] = useState('')
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  // Map and geocoding refs/state (internal coordinates only)
  const mapRef = React.useRef(null)
  const markerRef = React.useRef(null)
  const mapContainerRef = React.useRef(null)

  const DEFAULT_CENTER = [20.5937, 78.9629]
  const DEFAULT_ZOOM = 5

  React.useEffect(() => {
    const init = () => {
      const L = window.L
      if (!L || !mapContainerRef.current) return
      if (mapRef.current) return

      const map = L.map(mapContainerRef.current).setView(DEFAULT_CENTER, DEFAULT_ZOOM)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map)

      map.on('click', async (e) => {
        const { lat, lng } = e.latlng
        placeMarker([lat, lng])
        await handleReverseGeocode(lat, lng)
      })

      mapRef.current = map
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init)
      return () => document.removeEventListener('DOMContentLoaded', init)
    } else {
      init()
    }
  }, [])

  const placeMarker = (coords) => {
    const L = window.L
    if (!L || !mapRef.current) return
    const [lat, lng] = coords
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng])
    } else {
      markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(mapRef.current)
      markerRef.current.on('dragend', async () => {
        const pos = markerRef.current.getLatLng()
        placeMarker([pos.lat, pos.lng])
        await handleReverseGeocode(pos.lat, pos.lng)
      })
    }
    mapRef.current.setView([lat, lng], 16)
    setGpsLat(Number(lat).toFixed(6))
    setGpsLon(Number(lng).toFixed(6))
  }

  const handleReverseGeocode = async (lat, lng) => {
    try {
      setMessage(null)
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Reverse geocode failed')
      const data = await res.json()
      setAddress(data.display_name || '')
    } catch (err) {
      setMessage('Failed to reverse geocode location')
    }
  }

  const handleLocate = async () => {
    if (!address || address.trim() === '') {
      setMessage('Please enter an address to locate')
      return
    }
    try {
      setMessage(null)
      const q = encodeURIComponent(address)
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Geocode failed')
      const data = await res.json()
      if (!data || !data.length) {
        setMessage('Address not found')
        return
      }
      const { lat, lon } = data[0]
      placeMarker([parseFloat(lat), parseFloat(lon)])
    } catch (err) {
      setMessage('Address lookup failed')
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0]
      setFile(f)
      const reader = new FileReader()
      reader.onload = (event) => setPreview(event.target.result)
      reader.readAsDataURL(f)
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0]
      setFile(f)
      const reader = new FileReader()
      reader.onload = (event) => setPreview(event.target.result)
      reader.readAsDataURL(f)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setSuccess(false)
    setLoading(true)
    if (!gpsLat || !gpsLon) {
      setMessage('Please select a location on the map or use the Locate button to set it.')
      setLoading(false)
      return
    }
    try{
      let imageUrl = null
      if (file) {
        const fd = new FormData()
        fd.append('image', file)
        const res = await uploadImage(fd)
        imageUrl = res.data.url
      }

      await createPothole({ gpsLat: Number(gpsLat), gpsLon: Number(gpsLon), depthCm: Number(depthCm), address, imageUrl })
      setSuccess(true)
      setMessage('✓ Pothole reported successfully!')
      setFile(null)
      setPreview(null)
      setGpsLat('')
      setGpsLon('')
      setDepthCm('')
      setAddress('')
      setTimeout(() => { setSuccess(false); setMessage(null) }, 3000)
    }catch(err){ 
      setMessage(err.response?.data?.message || err.message || 'Upload failed')
      setSuccess(false)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-900 to-dark-800">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-poppins font-bold mb-2">Report Pothole</h1>
          <p className="text-dark-400">Help us improve road conditions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <Card className="!p-6">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/20'
              }`}
            >
              {preview ? (
                <div className="space-y-4">
                  <img src={preview} alt="preview" className="w-32 h-32 mx-auto rounded-lg object-cover border border-white/20" />
                  <p className="text-sm text-dark-300">{file?.name}</p>
                  <button
                    type="button"
                    onClick={() => { setFile(null); setPreview(null) }}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Change image
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="inline-flex p-4 bg-blue-500/20 rounded-lg">
                    <Upload className="w-8 h-8 text-blue-400" />
                  </div>
                  <p className="font-semibold">Drag and drop your image here</p>
                  <p className="text-sm text-dark-400">or</p>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <span className="text-blue-400 hover:text-blue-300 cursor-pointer font-medium">browse files</span>
                  </label>
                </div>
              )}
            </div>
          </Card>

          {/* Location & Details */}
          <Card className="!p-6 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              Location Details
            </h3>

            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  label="Enter Address"
                  type="text"
                  icon={Home}
                  placeholder="Enter address to locate"
                  value={address}
                  onChange={e=>setAddress(e.target.value)}
                />
              </div>
              <div>
                <button type="button" onClick={handleLocate} className="px-4 py-2 bg-blue-500 text-white rounded-md">Locate</button>
              </div>
            </div>

            <div ref={mapContainerRef} id="upload-map" style={{ height: '400px' }} className="w-full rounded-lg overflow-hidden" />

            <p className="text-sm text-dark-400">Click the map to drop a pin, or drag the pin to adjust location. Address will be auto-filled.</p>
          </Card>

          {/* Depth */}
          <Card className="!p-6">
            <Input
              label="Pothole Depth (cm)"
              type="number"
              icon={Gauge}
              placeholder="Enter depth in centimeters"
              value={depthCm}
              onChange={e=>setDepthCm(e.target.value)}
            />
          </Card>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg flex items-start gap-3 animate-fade-in ${
              success 
                ? 'bg-green-500/10 border border-green-500/30' 
                : 'bg-red-500/10 border border-red-500/30'
            }`}>
              {success && <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />}
              <p className={success ? 'text-green-400' : 'text-red-400'}>{message}</p>
            </div>
          )}

          {/* Submit */}
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Uploading...' : 'Submit Report'}
          </Button>
        </form>
      </div>
    </div>
  )
}
