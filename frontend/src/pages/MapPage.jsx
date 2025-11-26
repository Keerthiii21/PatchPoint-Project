import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { listPotholes } from '../api/potholeApi'

export default function MapPage(){
  const [potholes, setPotholes] = useState([])
  useEffect(()=>{ (async ()=>{
    try{ const res = await listPotholes(); setPotholes(res.data.potholes) }catch(err){console.error(err)}
  })() },[])

  return (
    <div className="container">
      <h2>Map</h2>
      <div className="map card">
        <MapContainer center={[37.7749, -122.4194]} zoom={12} style={{height:'600px'}}>
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {potholes.map(ph=> (
            <Marker key={ph._id} position={[ph.gpsLat, ph.gpsLon]}>
              <Popup>
                <div style={{maxWidth:240}}>
                  {ph.imageUrl && <img src={ph.imageUrl} alt="pothole" style={{width:'100%',borderRadius:6,marginBottom:6}} />}
                  <div><strong>Depth:</strong> {ph.depthCm ?? 'N/A'} cm</div>
                  <div><strong>Coords:</strong> {ph.gpsLat.toFixed(5)}, {ph.gpsLon.toFixed(5)}</div>
                  <div className="muted">{new Date(ph.timestamp).toLocaleString()}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
