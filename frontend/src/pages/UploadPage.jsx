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
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Latitude"
                type="number"
                step="0.00001"
                placeholder="37.7749"
                value={gpsLat}
                onChange={e=>setGpsLat(e.target.value)}
                required
              />
              <Input
                label="Longitude"
                type="number"
                step="0.00001"
                placeholder="-122.4194"
                value={gpsLon}
                onChange={e=>setGpsLon(e.target.value)}
                required
              />
            </div>
            
            <Input
              label="Address"
              type="text"
              icon={Home}
              placeholder="Street address (optional)"
              value={address}
              onChange={e=>setAddress(e.target.value)}
            />
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
