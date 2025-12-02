import React, { useEffect, useState } from 'react'
import { listPotholes } from '../api/potholeApi'
import { listComments, createComment } from '../api/commentApi'
import Card from '../components/Card'
import CommentCard from '../components/CommentCard'
import Button from '../components/Button'
import Input from '../components/Input'
import { MessageCircle, Send } from 'lucide-react'

export default function CommentsPage(){
  const [potholes, setPotholes] = useState([])
  const [selected, setSelected] = useState('')
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ (async ()=>{ try{ const res = await listPotholes(); setPotholes(res.data.potholes); if(res.data.potholes[0]) setSelected(res.data.potholes[0]._id) }catch(err){}})() },[])

  useEffect(()=>{ if(selected) fetchComments(selected) },[selected])

  const fetchComments = async (id) => {
    try{ const res = await listComments(id); setComments(res.data.comments) }catch(err){ console.error(err) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    try{ 
      await createComment({ potholeId: selected, text })
      setText('')
      fetchComments(selected)
    }catch(err){ console.error(err) }finally{ setLoading(false) }
  }

  const selectedPothole = potholes.find(p => p._id === selected)

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-900 to-dark-800">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-poppins font-bold mb-2">Comments</h1>
          <p className="text-dark-400">Discuss pothole reports</p>
        </div>

        {/* Pothole Selector */}
        <Card className="mb-8 !p-6">
          <label className="block text-sm font-medium text-dark-300 mb-3">Select a pothole</label>
          <select 
            value={selected} 
            onChange={e=>setSelected(e.target.value)}
            className="input-field"
          >
            {potholes.map(ph=> (
              <option key={ph._id} value={ph._id}>
                {ph.address || `${ph.gpsLat.toFixed(4)}, ${ph.gpsLon.toFixed(4)}`}
              </option>
            ))}
          </select>
        </Card>

        {/* Pothole Info */}
        {selectedPothole && (
          <Card className="mb-8 !p-6 border-blue-500/30 bg-blue-500/5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-blue-400 font-semibold mb-1">Location</p>
                <p className="text-dark-300">{selectedPothole.address || `Lat: ${selectedPothole.gpsLat.toFixed(5)}, Lon: ${selectedPothole.gpsLon.toFixed(5)}`}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-400 font-semibold mb-1">Depth</p>
                <p className="text-dark-300">{selectedPothole.depthCm ?? 'N/A'} cm</p>
              </div>
            </div>
          </Card>
        )}

        {/* Add Comment */}
        <Card className="mb-8 !p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-400" />
            Add a comment
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea 
              value={text}
              onChange={e=>setText(e.target.value)}
              placeholder="Share your thoughts about this pothole..."
              className="input-field resize-none py-3 h-24"
            />
            
            <div className="flex justify-end">
              <Button 
                variant="primary" 
                type="submit" 
                disabled={loading || !text.trim()}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Posting...' : 'Post comment'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Comments List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Existing comments ({comments.length})</h3>
          
          {comments.length === 0 ? (
            <Card className="!p-8 text-center">
              <MessageCircle className="w-12 h-12 text-dark-600 mx-auto mb-3 opacity-50" />
              <p className="text-dark-400">No comments yet. Be the first to comment!</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {comments.map(c=> <CommentCard key={c._id} comment={c} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
