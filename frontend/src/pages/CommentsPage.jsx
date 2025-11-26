import React, { useEffect, useState } from 'react'
import { listPotholes } from '../api/potholeApi'
import { listComments, createComment } from '../api/commentApi'

export default function CommentsPage(){
  const [potholes, setPotholes] = useState([])
  const [selected, setSelected] = useState('')
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')

  useEffect(()=>{ (async ()=>{ try{ const res = await listPotholes(); setPotholes(res.data.potholes); if(res.data.potholes[0]) setSelected(res.data.potholes[0]._id) }catch(err){}})() },[])

  useEffect(()=>{ if(selected) fetchComments(selected) },[selected])

  const fetchComments = async (id) => {
    try{ const res = await listComments(id); setComments(res.data.comments) }catch(err){ console.error(err) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{ await createComment({ potholeId: selected, text }); setText(''); fetchComments(selected) }catch(err){ console.error(err) }
  }

  return (
    <div className="container">
      <h2>Comments</h2>
      <div className="card">
        <label>Select pothole</label>
        <select value={selected} onChange={e=>setSelected(e.target.value)}>
          {potholes.map(ph=> <option key={ph._id} value={ph._id}>{ph.address || `${ph.gpsLat.toFixed(4)}, ${ph.gpsLon.toFixed(4)}`}</option>)}
        </select>

        <div style={{marginTop:12}}>
          <form onSubmit={handleSubmit}>
            <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write a comment" rows={4} />
            <div className="flex" style={{marginTop:8}}>
              <button className="btn" type="submit">Post comment</button>
            </div>
          </form>
        </div>

        <div style={{marginTop:12}}>
          <h4>Existing comments</h4>
          {comments.map(c=> (
            <div key={c._id} className="card" style={{marginBottom:8}}>
              <div><strong>{c.userId?.name || 'Unknown'}</strong> <span className="muted">{new Date(c.createdAt).toLocaleString()}</span></div>
              <div>{c.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
