import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { listPotholes } from '../api/potholeApi'
import Card from '../components/Card'
import { Filter } from 'lucide-react'

export default function MapPage(){
  const [potholes, setPotholes] = useState([])
  const [selectedPothole, setSelectedPothole] = useState(null)

  useEffect(()=>{ 
    const fetch = async ()=>{
      try{ const res = await listPotholes(); setPotholes(res.data.potholes) }catch(err){console.error(err)}
    }
    fetch()
    const iv = setInterval(fetch, 10000)
    return ()=> clearInterval(iv)
  },[])

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-900 to-dark-800 flex flex-col">
      <div className="max-w-7xl w-full mx-auto px-6 py-8">
        <h1 className="text-4xl font-poppins font-bold mb-2">Map</h1>
        <p className="text-dark-400">View all reported potholes</p>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px] lg:h-96">
          {/* Map */}
          <div className="lg:col-span-3 rounded-xl overflow-hidden border border-white/10">
            <MapContainer center={[37.7749, -122.4194]} zoom={12} style={{height:'100%'}}>
              <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {potholes.map(ph=> (
                <Marker key={ph._id} position={[ph.gpsLat, ph.gpsLon]} eventHandlers={{ click: () => setSelectedPothole(ph) }}>
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
          </div>

          {/* Sidebar */}
          <Card className="!p-4 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
              <Filter className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold">Details</h3>
            </div>

            {selectedPothole ? (
              <div className="space-y-3 text-sm">
                {selectedPothole.imageUrl && (
                  <img src={selectedPothole.imageUrl} alt="pothole" className="w-full h-32 rounded object-cover border border-white/10" />
                )}
                <div>
                  <p className="text-dark-400 text-xs">COORDINATES</p>
                  <p className="font-medium">{selectedPothole.gpsLat.toFixed(5)}, {selectedPothole.gpsLon.toFixed(5)}</p>
                </div>
                <div>
                  <p className="text-dark-400 text-xs">DEPTH</p>
                  <p className="font-medium">{selectedPothole.depthCm ?? 'N/A'} cm</p>
                </div>
                <div>
                  <p className="text-dark-400 text-xs">ADDRESS</p>
                  <p className="font-medium">{selectedPothole.address || '—'}</p>
                </div>
                <div>
                  <p className="text-dark-400 text-xs">REPORTED</p>
                  <p className="font-medium text-xs">{new Date(selectedPothole.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <p className="text-dark-400 text-sm">Click on a marker to view details</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
