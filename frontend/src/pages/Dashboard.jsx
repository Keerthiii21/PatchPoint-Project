import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { listPotholes } from '../api/potholeApi'
import StatsCard from '../components/StatsCard'
import Card from '../components/Card'
import { Zap, Gauge, Clock, MapPin } from 'lucide-react'

export default function Dashboard(){
  const [potholes, setPotholes] = useState([])
  const [stats, setStats] = useState({ total: 0, avgDepth: 0, today: 0, lastTime: null })

  const fetch = async ()=>{
    try{
      const res = await listPotholes()
      const data = res.data.potholes
      setPotholes(data)
      
      // Calculate stats
      const today = new Date().toDateString()
      const todayPotholes = data.filter(p => new Date(p.timestamp).toDateString() === today).length
      const avgDepth = data.length > 0 ? Math.round(data.reduce((sum, p) => sum + (p.depthCm || 0), 0) / data.length) : 0
      const lastTime = data[0]?.timestamp
      
      setStats({ total: data.length, avgDepth, today: todayPotholes, lastTime })
    }catch(err){ console.error(err) }
  }

  useEffect(()=>{ 
    fetch()
    const iv = setInterval(fetch, 10000) // poll every 10s for new Pi detections
    return () => clearInterval(iv)
  },[])

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-900 to-dark-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-poppins font-bold mb-2">Dashboard</h1>
          <p className="text-dark-400">Monitor potholes in real-time</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard icon={Zap} title="Total Reports" value={stats.total} />
          <StatsCard icon={Gauge} title="Avg. Depth" value={`${stats.avgDepth} cm`} />
          <StatsCard icon={Clock} title="Today's Detections" value={stats.today} />
          <StatsCard icon={MapPin} title="Active Locations" value={stats.total > 0 ? '✓' : '—'} />
        </div>

        {/* Map */}
        <Card className="mb-8 !p-0 overflow-hidden h-96 md:h-96 lg:h-96">
          <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{height:'100%'}}>
            <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {potholes.map(ph=> (
              <Marker key={ph._id} position={[ph.gpsLat, ph.gpsLon]}>
                <Popup>
                  <div style={{minWidth:200}}>
                    {ph.imageUrl && <img src={ph.imageUrl} alt="pothole" style={{width:'100%',height:120,objectFit:'cover',borderRadius:6,marginBottom:8}} />}
                    <div className="text-xs space-y-1 text-dark-900">
                      <div><strong>Depth:</strong> {ph.depthCm ?? 'N/A'} cm</div>
                      <div><strong>Coords:</strong> {ph.gpsLat.toFixed(5)}, {ph.gpsLon.toFixed(5)}</div>
                      <div className="text-dark-500">{new Date(ph.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Card>

        {/* Recent Potholes Table */}
        <Card className="!p-6">
          <h2 className="text-xl font-poppins font-bold mb-4">Recent Reports</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-semibold text-blue-400">Image</th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-400">Coordinates</th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-400">Depth (cm)</th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-400">Address</th>
                  <th className="text-left py-3 px-4 font-semibold text-blue-400">Time</th>
                </tr>
              </thead>
              <tbody>
                {potholes.map(ph=> (
                  <tr key={ph._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4">
                      {ph.imageUrl ? (
                        <img src={ph.imageUrl} alt="thumb" className="w-12 h-10 rounded object-cover border border-white/10" />
                      ) : (
                        <span className="text-dark-500">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-dark-300">{ph.gpsLat.toFixed(4)}, {ph.gpsLon.toFixed(4)}</td>
                    <td className="py-4 px-4 text-dark-300">{ph.depthCm ?? '—'}</td>
                    <td className="py-4 px-4 text-dark-300">{ph.address || '—'}</td>
                    <td className="py-4 px-4 text-dark-500 text-xs">{new Date(ph.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
