import Card from './Card'

export default function CommentCard({ comment }) {
  if (!comment) return null
  
  const initials = comment.userId?.name?.[0]?.toUpperCase() || 'U'
  const timeAgo = new Date(comment.createdAt).toLocaleDateString()

  return (
    <Card className="animate-fade-in">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-semibold text-blue-400">{initials}</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium">{comment.userId?.name || 'Anonymous'}</p>
            <p className="text-xs text-dark-400">{timeAgo}</p>
          </div>
          <p className="text-dark-300 text-sm leading-relaxed">{comment.text}</p>
        </div>
      </div>
    </Card>
  )
}
