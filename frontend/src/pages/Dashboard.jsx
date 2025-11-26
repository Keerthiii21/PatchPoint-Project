import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { listPotholes } from '../api/potholeApi'

export default function Dashboard(){
  const [potholes, setPotholes] = useState([])

  const fetch = async ()=>{
    try{
      const res = await listPotholes()
      setPotholes(res.data.potholes)
    }catch(err){ console.error(err) }
  }

  useEffect(()=>{ fetch() },[])

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <div className="map card">
        <MapContainer center={[37.7749, -122.4194]} zoom={13} style={{height:'100%'}}>
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

      <div className="list">
        <table className="table card">
          <thead>
            <tr><th>Image</th><th>Coords</th><th>Depth (cm)</th><th>Address</th><th>Timestamp</th></tr>
          </thead>
          <tbody>
            {potholes.map(ph=> (
              <tr key={ph._id}>
                <td>{ph.imageUrl ? <img className="thumb" src={ph.imageUrl} alt="thumb" /> : '—'}</td>
                <td>{ph.gpsLat.toFixed(5)}, {ph.gpsLon.toFixed(5)}</td>
                <td>{ph.depthCm ?? '—'}</td>
                <td>{ph.address || '—'}</td>
                <td className="muted">{new Date(ph.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
